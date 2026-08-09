import { NextRequest, NextResponse } from "next/server";
import { callGeminiWithRetry, AIError, DEFAULT_AI_MODEL } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { reportTitle, reportType, diagnosis, hospital, doctor } = await req.json();

    const prompt = `Summarize the following medical document details for a family health vault application:
- Report Title: ${reportTitle || 'Medical Report'}
- Type: ${reportType || 'LAB_REPORT'}
- Doctor: ${doctor || 'Not specified'}
- Hospital: ${hospital || 'Not specified'}
- Text / Notes / Diagnosis: ${diagnosis || 'Not specified'}

Provide response as JSON with:
1. "summary": A 2-3 sentence patient-friendly summary strictly based on the provided details. If information is not available, state "Not available in this report."
2. "keyFindings": An array of bullet points highlighting critical numbers or conclusions.
3. "actionItems": An array of actionable recommendations for the patient.
4. "disclaimer": "AI-generated information is for educational purposes and does not replace professional medical advice."

Respond ONLY with raw JSON without markdown backticks. Do not fabricate information.`;

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
    console.error("Gemini Summarize Error:", error);
    const err = error as AIError;
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || "AI_SUMMARIZE_ERROR";
    const errorMessage = err.message || "Failed to generate AI report summary.";

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        summary: `Unable to generate AI summary at this moment (${errorCode}).`,
        keyFindings: ["Summary generation failed."],
        actionItems: ["Consult your physician directly."],
        disclaimer: "AI-generated information is for educational purposes and does not replace professional medical advice."
      },
      { status: statusCode }
    );
  }
}
