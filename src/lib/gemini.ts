/**
 * Google Gemini API client
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaceClassification } from "@/types";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

/**
 * Analyze face shape using Gemini 1.5 Flash
 */
export async function analyzeFaceWithGemini(
  imageBase64: string
): Promise<FaceClassification> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze this face image and determine the face shape.
Choose from: oval, round, square, heart, oblong, or diamond.

Provide your response in this exact JSON format:
{
  "shape": "oval|round|square|heart|oblong|diamond",
  "confidence": 85-98,
  "reasoning": "Brief explanation of why this shape was chosen"
}`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(",")[1],
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const parsed = JSON.parse(text);

    return {
      shape: parsed.shape,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      measurements: {
        faceWidth: 0,
        faceHeight: 0,
        ratio: 0,
        jawWidth: 0,
        cheekboneWidth: 0,
        foreheadWidth: 0,
      },
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to analyze face with AI");
  }
}
