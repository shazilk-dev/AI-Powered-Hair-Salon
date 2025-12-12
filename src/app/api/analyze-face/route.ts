/**
 * API Route: POST /api/analyze-face
 * Analyzes face shape using Gemini AI
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeFaceWithGemini } from "@/lib/gemini";
import { AnalyzeFaceResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, landmarks } = body;

    // Validate input
    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Image data is required",
          },
        } as AnalyzeFaceResponse,
        { status: 400 }
      );
    }

    // Call Gemini API
    const result = await analyzeFaceWithGemini(image);

    return NextResponse.json({
      success: true,
      data: result,
    } as AnalyzeFaceResponse);
  } catch (error) {
    console.error("Analyze face error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ANALYSIS_FAILED",
          message: "Failed to analyze face. Please try again.",
        },
      } as AnalyzeFaceResponse,
      { status: 500 }
    );
  }
}
