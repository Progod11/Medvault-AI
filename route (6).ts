import { NextRequest, NextResponse } from "next/server";
import { callGeminiWithRetry, AIError, DEFAULT_AI_MODEL } from "@/lib/ai/gemini";

interface RecordItem {
  id: string;
  title?: string;
  hospital?: string;
  doctor?: string;
  diagnosis?: string;
  tags?: string[];
  medicines?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { query, items } = await req.json();

    if (!query) {
      return NextResponse.json({ matchingIds: (items || []).map((i: RecordItem) => i.id) });
    }

    const prompt = `You are a medical records search engine.
User Search Query: "${query}"

Here is a JSON list of medical records:
${JSON.stringify(items, null, 2)}

Filter these records and return JSON with an array "matchingIds" containing ONLY the string IDs of the records that match the query semantically (e.g., matching medical conditions, dates, doctor names, report types, or medication names).

Respond ONLY with JSON: { "matchingIds": ["id1", "id2"] } without markdown formatting.`;

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
    console.error("Gemini Search Error:", error);
    const err = error as AIError;
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || "AI_SEARCH_ERROR";

    return NextResponse.json({ matchingIds: [], error: err.message, code: errorCode }, { status: statusCode });
  }
}
