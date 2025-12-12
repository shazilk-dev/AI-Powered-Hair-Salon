/**
 * API Route: GET /api/recommend
 * Returns hairstyle recommendations for a face shape
 */

import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/hairstyleDatabase";
import { FaceShape, RecommendResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shape = searchParams.get("shape") as FaceShape;

    // Validate input
    const validShapes: FaceShape[] = [
      "oval",
      "round",
      "square",
      "heart",
      "oblong",
      "diamond",
    ];

    if (!shape || !validShapes.includes(shape)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SHAPE",
            message: "Valid face shape is required",
          },
        } as RecommendResponse,
        { status: 400 }
      );
    }

    // Get recommendations
    const recommendations = getRecommendations(shape);

    return NextResponse.json({
      success: true,
      data: {
        faceShape: shape,
        recommendations,
      },
    } as RecommendResponse);
  } catch (error) {
    console.error("Recommendation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RECOMMENDATION_FAILED",
          message: "Failed to get recommendations. Please try again.",
        },
      } as RecommendResponse,
      { status: 500 }
    );
  }
}
