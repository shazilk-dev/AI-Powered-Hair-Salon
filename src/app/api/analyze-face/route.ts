/**
 * POST /api/analyze-face
 *
 * Analyzes uploaded face image and returns face shape classification.
 * Integrates client-side MediaPipe classification with server-side Gemini AI validation.
 *
 * API Contract per SPEC.md Section 2.2:
 *
 * Request Body:
 * - image: base64 encoded image string (with data:image prefix)
 * - clientClassification?: FaceClassification from MediaPipe
 * - landmarks?: FaceLandmark[] from MediaPipe (468 points)
 *
 * Response:
 * - 200: { success: true, data: { shape, confidence, reasoning, measurements } }
 * - 400: { success: false, error: { code, message, recoverable } }
 * - 429: { success: false, error: { code: 'API_RATE_LIMITED', retryAfter } }
 * - 500: { success: false, error: { code: 'API_ERROR', message } }
 *
 * Rate Limits:
 * - 15 requests per minute (Gemini free tier)
 * - Automatic retry with exponential backoff (3 attempts)
 *
 * @see SPEC.md Section 2.2 - API Endpoints
 * @see SPEC.md Section 6.1 - Error Handling
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeFaceWithGemini } from "@/lib/gemini";
import type {
  AnalyzeFaceRequest,
  AnalyzeFaceResponse,
  ErrorCode,
} from "@/types";

/**
 * POST handler for face analysis
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: AnalyzeFaceRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT" as ErrorCode,
            message: "Invalid JSON in request body",
            recoverable: true,
          },
        } satisfies AnalyzeFaceResponse,
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.image || typeof body.image !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT" as ErrorCode,
            message:
              "Missing or invalid 'image' field. Expected base64 encoded string.",
            recoverable: true,
          },
        } satisfies AnalyzeFaceResponse,
        { status: 400 }
      );
    }

    // Validate image format
    const imageValidation = validateImageData(body.image);
    if (!imageValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT" as ErrorCode,
            message: imageValidation.error || "Invalid image format",
            recoverable: true,
          },
        } satisfies AnalyzeFaceResponse,
        { status: 400 }
      );
    }

    // Optional: Validate client classification if provided
    if (body.clientClassification) {
      const classificationValidation = validateClassification(
        body.clientClassification
      );
      if (!classificationValidation.valid) {
        console.warn(
          "Invalid client classification provided:",
          classificationValidation.error
        );
        // Continue without client classification instead of failing
        body.clientClassification = undefined;
      }
    }

    // Optional: Validate landmarks if provided
    if (body.landmarks) {
      if (
        !Array.isArray(body.landmarks) ||
        body.landmarks.length === 0 ||
        body.landmarks.length > 468
      ) {
        console.warn(
          `Invalid landmarks array provided: ${body.landmarks?.length || 0} points. Expected 0-468.`
        );
        // Continue without landmarks instead of failing
        body.landmarks = undefined;
      }
    }

    // Call Gemini API for analysis
    try {
      const classification = await analyzeFaceWithGemini(
        body.image,
        body.clientClassification,
        body.landmarks
      );

      // Success response
      return NextResponse.json(
        {
          success: true,
          data: classification,
        } satisfies AnalyzeFaceResponse,
        { status: 200 }
      );
    } catch (apiError) {
      // Handle Gemini API errors
      if (apiError instanceof Error) {
        // Rate limit error
        if (apiError.message.includes("Rate limit")) {
          const retryMatch = apiError.message.match(
            /retry after (\d+) seconds/i
          );
          const retryAfter = retryMatch ? parseInt(retryMatch[1]) : 60;

          return NextResponse.json(
            {
              success: false,
              error: {
                code: "API_RATE_LIMITED" as ErrorCode,
                message: apiError.message,
                recoverable: true,
                retryAfter,
              },
            } satisfies AnalyzeFaceResponse,
            {
              status: 429,
              headers: {
                "Retry-After": String(retryAfter),
              },
            }
          );
        }

        // API key/configuration error
        if (
          apiError.message.includes("API key") ||
          apiError.message.includes("not configured")
        ) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "API_ERROR" as ErrorCode,
                message:
                  "Service temporarily unavailable. Please try again later.",
                recoverable: true,
              },
            } satisfies AnalyzeFaceResponse,
            { status: 503 }
          );
        }

        // Network/timeout error
        if (
          apiError.message.includes("timeout") ||
          apiError.message.includes("network")
        ) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NETWORK_ERROR" as ErrorCode,
                message:
                  "Network error occurred. Please check your connection and try again.",
                recoverable: true,
              },
            } satisfies AnalyzeFaceResponse,
            { status: 503 }
          );
        }

        // Quota exceeded
        if (apiError.message.includes("quota")) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "API_RATE_LIMITED" as ErrorCode,
                message: "Daily API quota exceeded. Please try again tomorrow.",
                recoverable: false,
              },
            } satisfies AnalyzeFaceResponse,
            { status: 429 }
          );
        }

        // Failed after retries
        if (apiError.message.includes("after")) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "API_ERROR" as ErrorCode,
                message:
                  "Unable to analyze face after multiple attempts. Please try again later.",
                recoverable: true,
              },
            } satisfies AnalyzeFaceResponse,
            { status: 503 }
          );
        }

        // Generic API error
        console.error("Gemini API error:", apiError);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "API_ERROR" as ErrorCode,
              message:
                "Failed to analyze face. Please ensure the image clearly shows your face and try again.",
              recoverable: true,
            },
          } satisfies AnalyzeFaceResponse,
          { status: 500 }
        );
      }

      // Unknown error
      throw apiError;
    }
  } catch (error) {
    // Catch-all error handler
    console.error("Unexpected error in /api/analyze-face:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNKNOWN_ERROR" as ErrorCode,
          message:
            "An unexpected error occurred. Please try again or contact support if the problem persists.",
          recoverable: true,
        },
      } satisfies AnalyzeFaceResponse,
      { status: 500 }
    );
  }
}

/**
 * Validate base64 image data
 *
 * Checks:
 * - Proper base64 format (with or without data URI prefix)
 * - Supported MIME type (image/jpeg or image/png)
 * - Reasonable size limits (< 10MB encoded, ~7.5MB decoded)
 *
 * @param imageData Base64 encoded image string
 * @returns Validation result
 */
function validateImageData(imageData: string): {
  valid: boolean;
  error?: string;
} {
  // Check if empty
  if (!imageData || imageData.length === 0) {
    return { valid: false, error: "Image data is empty" };
  }

  // Check if it's a data URI
  let base64Data: string;
  let mimeType: string | null = null;

  if (imageData.startsWith("data:")) {
    // Extract MIME type and base64 data
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return {
        valid: false,
        error: "Invalid data URI format. Expected 'data:image/jpeg;base64,...'",
      };
    }

    mimeType = matches[1];
    base64Data = matches[2];

    // Validate MIME type
    if (mimeType !== "image/jpeg" && mimeType !== "image/png") {
      return {
        valid: false,
        error: `Unsupported image type: ${mimeType}. Only JPEG and PNG are supported.`,
      };
    }
  } else {
    // Assume raw base64 (no data URI prefix)
    base64Data = imageData;
  }

  // Validate base64 format
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Pattern.test(base64Data)) {
    return {
      valid: false,
      error: "Invalid base64 encoding. Image data contains invalid characters.",
    };
  }

  // Check size (base64 is ~4/3 of original size)
  // 10MB encoded ≈ 7.5MB decoded image
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (base64Data.length > maxSizeBytes) {
    const sizeMB = (base64Data.length / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Image too large: ${sizeMB}MB. Maximum size is 10MB.`,
    };
  }

  // Check minimum size (avoid empty/corrupt images)
  const minSizeBytes = 100; // 100 bytes (very small image)
  if (base64Data.length < minSizeBytes) {
    return {
      valid: false,
      error: "Image too small. Please provide a valid face photo.",
    };
  }

  return { valid: true };
}

/**
 * Validate client-side classification data
 *
 * Ensures classification object has required fields with valid values.
 *
 * @param classification Client classification object
 * @returns Validation result
 */
function validateClassification(classification: any): {
  valid: boolean;
  error?: string;
} {
  if (!classification || typeof classification !== "object") {
    return { valid: false, error: "Classification must be an object" };
  }

  // Validate shape
  const validShapes = ["oval", "round", "square", "heart", "oblong", "diamond"];
  if (!classification.shape || !validShapes.includes(classification.shape)) {
    return {
      valid: false,
      error: `Invalid shape: ${classification.shape}. Expected one of: ${validShapes.join(", ")}`,
    };
  }

  // Validate confidence
  if (
    typeof classification.confidence !== "number" ||
    classification.confidence < 50 ||
    classification.confidence > 100
  ) {
    return {
      valid: false,
      error: `Invalid confidence: ${classification.confidence}. Expected 50-100.`,
    };
  }

  // Validate reasoning (optional but should be string if present)
  if (
    classification.reasoning &&
    typeof classification.reasoning !== "string"
  ) {
    return {
      valid: false,
      error: "Reasoning must be a string",
    };
  }

  // Validate measurements (optional but should have required fields if present)
  if (classification.measurements) {
    const required = [
      "faceWidth",
      "faceHeight",
      "ratio",
      "jawWidth",
      "cheekboneWidth",
      "foreheadWidth",
    ];
    for (const field of required) {
      if (typeof classification.measurements[field] !== "number") {
        return {
          valid: false,
          error: `Missing or invalid measurement: ${field}`,
        };
      }
    }
  }

  return { valid: true };
}
