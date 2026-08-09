import { NextRequest, NextResponse } from "next/server";
import { callGeminiWithRetry, AIError, DEFAULT_AI_MODEL } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages, familyMemberContext, language = "en", image } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    let langMandate = "";
    if (language === "hi") {
      langMandate = "\nCRITICAL LANGUAGE MANDATE: You MUST write your entire response in clear, fluent, natural Hindi (Devanagari script). Use standard Hindi medical terms where appropriate.";
    } else if (language === "mr") {
      langMandate = "\nCRITICAL LANGUAGE MANDATE: You MUST write your entire response in clear, fluent Marathi.";
    } else {
      langMandate = "\nCRITICAL LANGUAGE MANDATE: Respond in clear, professional English.";
    }

    let systemInstruction = `You are Med AI Assistant, an empathetic, highly knowledgeable AI medical consultant and family health assistant for MedVault AI.
You help families understand medical reports, lab results, medication usage, potential side effects, drug interactions, and symptom analysis.${langMandate}

CRITICAL INSTRUCTIONS:
1. Always maintain a clear, reassuring, and professional medical tone.
2. Structure your answers clearly using bullet points, bold headings, and short scannable paragraphs.
3. If an image is attached (lab report image, skin symptom, prescription photo, or pill bottle), analyze the visible contents carefully and explain key findings or observations.
4. If analyzing symptoms, provide potential possibilities, recommended home care / triage level (e.g. routine doctor visit vs urgent emergency care), and helpful questions the patient should ask their doctor.
5. When family member medical context (allergies, chronic conditions, active medicines, lab reports) is provided, incorporate it directly into your clinical reasoning.
6. ALWAYS end with a brief disclaimer stating that Med AI Assistant provides educational health guidance and is not a replacement for in-person consultation with a licensed physician.`;

    if (familyMemberContext) {
      systemInstruction += `\n\nCURRENT FAMILY MEMBER CONTEXT:
Name: ${familyMemberContext.name || "N/A"}
Relationship: ${familyMemberContext.relationship || "N/A"}
Age: ${familyMemberContext.age || "N/A"} | Blood Group: ${familyMemberContext.bloodGroup || "N/A"}
Known Allergies: ${Array.isArray(familyMemberContext.allergies) ? familyMemberContext.allergies.join(", ") : "None reported"}
Chronic Conditions: ${Array.isArray(familyMemberContext.chronicDiseases) ? familyMemberContext.chronicDiseases.join(", ") : "None reported"}
Active Prescribed Medications: ${Array.isArray(familyMemberContext.medications) ? familyMemberContext.medications.map((m: { name?: string; dosage?: string }) => `${m.name || ''} (${m.dosage || ''})`).join("; ") : "None listed"}
Recent Lab Reports / Records: ${Array.isArray(familyMemberContext.reports) ? familyMemberContext.reports.map((r: { title?: string; reportDate?: string; summary?: string; diagnosis?: string }) => `[${r.title || 'Report'}] Date: ${r.reportDate || 'N/A'}, Summary: ${r.summary || r.diagnosis || 'N/A'}`).join(" | ") : "No reports uploaded"}`;
    }

    const formattedHistory = messages.map((m: { role: string; content: string }) => {
      const sender = m.role === "user" ? "User" : "Med AI Assistant";
      return `${sender}: ${m.content}`;
    }).join("\n\n");

    const fullPromptText = `${systemInstruction}\n\n--- CONVERSATION HISTORY ---\n${formattedHistory}\n\nMed AI Assistant:`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contentsPayload: any = fullPromptText;

    if (image && typeof image === "string" && image.startsWith("data:")) {
      const mimeType = image.substring(image.indexOf(":") + 1, image.indexOf(";")) || "image/jpeg";
      const cleanBase64 = image.substring(image.indexOf(",") + 1);

      contentsPayload = [
        { text: fullPromptText },
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
      ];
    }

    const textResponse = await callGeminiWithRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: DEFAULT_AI_MODEL,
        contents: contentsPayload,
      });
      return response.text;
    });

    const outputText = textResponse || "I was unable to generate a response at this time. Please try asking again.";

    return NextResponse.json({ text: outputText });
  } catch (error: unknown) {
    console.error("Gemini AI Assistant API Error:", error);
    const err = error as AIError;
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || "UNKNOWN_ERROR";
    const errorMessage = err.message || "An unexpected error occurred while processing your request.";

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        text: `MedVault AI is temporarily unavailable (${errorCode}): ${errorMessage}. Please try again in a moment.`,
      },
      { status: statusCode }
    );
  }
}
