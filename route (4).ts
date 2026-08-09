import { NextRequest, NextResponse } from "next/server";
import { callGeminiWithRetry, AIError, DEFAULT_AI_MODEL } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { medicineName, dosage } = await req.json();

    if (!medicineName) {
      return NextResponse.json(
        { error: "Medicine name is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a medical assistant AI. Provide a clear, simple-language explanation for the medicine "${medicineName}" (${dosage || 'dosage unspecified'}).

Format your response strictly as valid JSON with the following keys:
- "usage": A concise explanation in plain everyday language of what the medicine is used for and how it works.
- "sideEffects": An array of 3-4 common side effects.
- "precautions": A concise paragraph on key precautions or food/drug interactions to keep in mind.
- "disclaimer": "AI-generated information is for educational purposes and does not replace professional medical advice."

Respond ONLY with raw JSON, no markdown formatting.`;

    const rawText = await callGeminiWithRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: DEFAULT_AI_MODEL,
        contents: prompt,
      });
      return response.text;
    });

    const text = rawText || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanText);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Gemini Explain Error:", error);
    const err = error as AIError;
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || "AI_EXPLAIN_ERROR";
    const errorMessage = err.message || "Failed to explain medicine.";

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        usage: "Information could not be retrieved dynamically due to service error.",
        sideEffects: ["Consult your physician for possible side effects."],
        precautions: "Follow your doctor's instructions carefully.",
        disclaimer: "AI-generated information is for educational purposes and does not replace professional medical advice."
      },
      { status: statusCode }
    );
  }
}
