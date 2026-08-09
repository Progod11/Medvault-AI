import { GoogleGenAI } from "@google/genai";

export class AIError extends Error {
  code: string;
  statusCode: number;

  constructor(code: string, message: string, statusCode: number = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "AIError";
  }
}

export const DEFAULT_AI_MODEL = "gemini-3.5-flash-lite";

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AIError(
      "AI_CONFIGURATION_ERROR",
      "Gemini API key missing. Please configure GEMINI_API_KEY in your environment secrets.",
      500
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function callGeminiWithRetry<T>(
  fn: (ai: GoogleGenAI) => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let attempt = 0;
  while (true) {
    const ai = getGeminiClient();
    try {
      return await fn(ai);
    } catch (error: unknown) {
      attempt++;
      const errObj = error as { message?: string; status?: number; statusCode?: number };
      const errorMessage = String(errObj?.message || error);
      const status = errObj?.status || errObj?.statusCode || 500;

      let code = "AI_SERVICE_UNAVAILABLE";
      if (errorMessage.includes("API key") || errorMessage.includes("authentication") || status === 401 || status === 403) {
        throw new AIError("AI_AUTH_ERROR", `Gemini Authentication Error: ${errorMessage}`, 401);
      }
      if (status === 429 || errorMessage.includes("rate limit") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
        code = "AI_RATE_LIMIT";
      } else if (status === 400 || errorMessage.includes("invalid argument") || errorMessage.includes("INVALID_ARGUMENT")) {
        throw new AIError("AI_INVALID_REQUEST", `Invalid AI Request: ${errorMessage}`, 400);
      } else if (errorMessage.includes("timeout") || status === 504) {
        code = "AI_TIMEOUT";
      } else if (status >= 500) {
        code = "AI_SERVICE_UNAVAILABLE";
      }

      const isTemporary = status === 429 || status >= 500 || code === "AI_RATE_LIMIT" || code === "AI_TIMEOUT" || code === "AI_SERVICE_UNAVAILABLE";
      if (attempt >= retries || !isTemporary) {
        throw new AIError(code, `Gemini API Error (${code}): ${errorMessage}`, status >= 400 ? status : 500);
      }

      console.warn(`Gemini API temporary failure (attempt ${attempt}/${retries}): ${errorMessage}. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
