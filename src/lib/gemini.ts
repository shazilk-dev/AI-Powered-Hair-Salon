/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Google Gemini API Client
 *
 * Integrates with Gemini 1.5 Flash for face shape validation and analysis.
 * Includes rate limiting, retry logic, and error handling.
 *
 * Free Tier Limits:
 * - 15 requests per minute
 * - 1,500 requests per day
 * - 1 million tokens per month
 *
 * @see https://ai.google.dev/gemini-api/docs
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FaceClassification, FaceLandmark } from "@/types";

/**
 * Initialize Gemini API client
 */
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

/**
 * Rate limiter for Gemini API
 * Tracks requests per minute to stay under 15 req/min limit
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly limit = 15; // requests per minute
  private readonly window = 60000; // 1 minute in ms

  /**
   * Check if request can proceed
   */
  canProceed(): boolean {
    const now = Date.now();
    // Remove requests older than 1 minute
    this.requests = this.requests.filter((time) => now - time < this.window);
    return this.requests.length < this.limit;
  }

  /**
   * Record a request
   */
  recordRequest(): void {
    this.requests.push(Date.now());
  }

  /**
   * Get time until next available slot (ms)
   */
  getRetryAfter(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    const timeUntilExpiry = this.window - (Date.now() - oldestRequest);
    return Math.max(0, timeUntilExpiry);
  }

  /**
   * Get current request count
   */
  getCurrentCount(): number {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.window);
    return this.requests.length;
  }

  /**
   * Reset rate limiter (for testing)
   */
  reset(): void {
    this.requests = [];
  }
}

const rateLimiter = new RateLimiter();

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffMultiplier: 2,
};

/**
 * Analyze face shape using Gemini 1.5 Flash
 *
 * Sends image to Gemini API for face shape classification.
 * Includes local classification data as context for validation.
 *
 * @param imageBase64 Base64 encoded image (with data:image prefix)
 * @param localClassification Optional client-side classification for validation
 * @param landmarks Optional facial landmarks for additional context
 * @returns Face classification result
 *
 * @throws {Error} If rate limit exceeded
 * @throws {Error} If API call fails after retries
 *
 * @example
 * ```typescript
 * const result = await analyzeFaceWithGemini(
 *   imageData,
 *   clientClassification,
 *   landmarks
 * );
 * ```
 */
export async function analyzeFaceWithGemini(
  imageBase64: string,
  localClassification?: FaceClassification,
  landmarks?: FaceLandmark[]
): Promise<FaceClassification> {
  // Check rate limit
  if (!rateLimiter.canProceed()) {
    const retryAfter = rateLimiter.getRetryAfter();
    throw new Error(
      `Rate limit exceeded. Please retry after ${Math.ceil(retryAfter / 1000)} seconds. Current: ${rateLimiter.getCurrentCount()}/15 requests per minute.`
    );
  }

  // Validate API key
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable."
    );
  }

  // Record request
  rateLimiter.recordRequest();

  // Retry logic
  let lastError: Error | null = null;
  let delay = RETRY_CONFIG.initialDelay;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await performAnalysis(
        imageBase64,
        localClassification,
        landmarks
      );
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `Gemini API attempt ${attempt + 1} failed:`,
        lastError.message
      );

      // Don't retry on rate limit or validation errors
      if (
        lastError.message.includes("Rate limit") ||
        lastError.message.includes("Invalid") ||
        lastError.message.includes("API key")
      ) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < RETRY_CONFIG.maxRetries) {
        await sleep(delay);
        delay = Math.min(
          delay * RETRY_CONFIG.backoffMultiplier,
          RETRY_CONFIG.maxDelay
        );
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to analyze face after ${RETRY_CONFIG.maxRetries + 1} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Perform actual Gemini API call
 */
async function performAnalysis(
  imageBase64: string,
  localClassification?: FaceClassification,
  landmarks?: FaceLandmark[]
): Promise<FaceClassification> {
  // Get model from environment or use default
  // Options: gemini-2.5-flash (recommended), gemini-3-pro-preview (newest), gemini-2.5-flash-lite (fastest)
  const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  // Build prompt with optional context
  let prompt = `Analyze this face image and determine the face shape.

Face Shape Categories:
- **Oval**: Balanced proportions, width 70-75% of height, slightly longer than wide
- **Round**: Width ≈ height, soft curves, circular appearance
- **Square**: Strong jaw, width 85-100% of height, angular features
- **Heart**: Wide forehead, narrow chin, forehead significantly wider than jaw
- **Oblong**: Significantly longer than wide, width < 65% of height
- **Diamond**: Wide cheekbones, narrow forehead and jaw

`;

  // Add local classification context if provided
  if (localClassification) {
    prompt += `\nClient-side analysis suggests: ${localClassification.shape} (${localClassification.confidence}% confidence)
Reasoning: ${localClassification.reasoning}

Please validate or correct this classification based on the image.
`;
  }

  // Add landmark context if provided
  if (landmarks && landmarks.length > 0) {
    prompt += `\nFacial landmarks detected: ${landmarks.length} points
`;
  }

  prompt += `\nProvide your analysis in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "shape": "oval|round|square|heart|oblong|diamond",
  "confidence": 85-98,
  "reasoning": "Brief explanation (2-3 sentences) of why this shape was chosen based on visible features"
}`;

  try {
    // Prepare image data
    const imageData = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    // Call Gemini API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    // Parse JSON response

    let parsed: any;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", cleanedText);
      throw new Error(
        `Invalid JSON response from Gemini API. Response: ${cleanedText.substring(0, 200)}`
      );
    }

    // Validate response structure
    if (!parsed.shape || !parsed.confidence || !parsed.reasoning) {
      throw new Error(
        `Incomplete response from Gemini API. Missing required fields: ${JSON.stringify(parsed)}`
      );
    }

    // Validate shape value
    const validShapes = [
      "oval",
      "round",
      "square",
      "heart",
      "oblong",
      "diamond",
    ];
    if (!validShapes.includes(parsed.shape)) {
      throw new Error(
        `Invalid shape value from Gemini API: ${parsed.shape}. Expected one of: ${validShapes.join(", ")}`
      );
    }

    // Validate confidence range
    const confidence = Number(parsed.confidence);
    if (isNaN(confidence) || confidence < 50 || confidence > 100) {
      throw new Error(
        `Invalid confidence value from Gemini API: ${parsed.confidence}. Expected 50-100.`
      );
    }

    // Build final classification
    const classification: FaceClassification = {
      shape: parsed.shape,
      confidence: Math.round(confidence),
      reasoning: parsed.reasoning,
      measurements: localClassification?.measurements || {
        faceWidth: 0,
        faceHeight: 0,
        ratio: 0,
        jawWidth: 0,
        cheekboneWidth: 0,
        foreheadWidth: 0,
      },
    };

    return classification;
  } catch (error) {
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error(
          "Invalid Gemini API key. Please check your configuration."
        );
      }
      if (error.message.includes("quota")) {
        throw new Error("Gemini API quota exceeded. Please try again later.");
      }
      if (error.message.includes("timeout")) {
        throw new Error("Gemini API request timed out. Please try again.");
      }
    }

    console.error("Gemini API error:", error);
    throw error;
  }
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check Gemini API health
 *
 * Verifies API key is valid and service is accessible.
 *
 * @returns True if API is healthy
 */
export async function checkGeminiHealth(): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return false;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      "Say 'OK' if you can receive this."
    );
    const response = await result.response;
    const text = response.text();

    return text.toLowerCase().includes("ok");
  } catch (error) {
    console.error("Gemini health check failed:", error);
    return false;
  }
}

/**
 * Get current rate limit status
 *
 * @returns Object with current count and limit
 */
export function getRateLimitStatus(): {
  current: number;
  limit: number;
  available: number;
} {
  const current = rateLimiter.getCurrentCount();
  return {
    current,
    limit: 15,
    available: 15 - current,
  };
}
/**
 * Reset rate limiter (for testing only)
 * @internal
 */
export function resetRateLimiter(): void {
  (rateLimiter as any).reset();
}
