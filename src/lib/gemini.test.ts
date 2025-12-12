/**
 * Test suite for Gemini API Integration
 *
 * Tests rate limiting, retry logic, validation, and error handling
 * per SPEC.md sections 2.2, 5.3, and 6.1.
 *
 * @see SPEC.md Section 2.2 - API Endpoints
 * @see SPEC.md Section 5.3 - Rate Limits
 * @see SPEC.md Section 6.1 - Error Handling
 */

import {
  analyzeFaceWithGemini,
  checkGeminiHealth,
  getRateLimitStatus,
  resetRateLimiter,
} from "./gemini";
import type { FaceClassification } from "@/types";

// Mock @google/generative-ai
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn(),
    }),
  })),
}));

import { GoogleGenerativeAI } from "@google/generative-ai";

// ===== Test Setup =====

const MOCK_IMAGE_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

const MOCK_CLASSIFICATION: FaceClassification = {
  shape: "oval",
  confidence: 87,
  reasoning: "Face shows balanced proportions with width about 70% of height",
  measurements: {
    faceWidth: 150,
    faceHeight: 200,
    ratio: 0.75,
    jawWidth: 120,
    cheekboneWidth: 150,
    foreheadWidth: 145,
  },
};

// ===== Helper Functions =====

function mockSuccessfulResponse(
  classification: Partial<FaceClassification> = {}
) {
  const response = {
    shape: classification.shape || "oval",
    confidence: classification.confidence || 87,
    reasoning: classification.reasoning || "Test reasoning",
  };

  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: () => JSON.stringify(response),
    },
  });

  (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  }));

  return mockGenerateContent;
}

function mockErrorResponse(errorMessage: string) {
  const mockGenerateContent = jest
    .fn()
    .mockRejectedValue(new Error(errorMessage));

  (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  }));

  return mockGenerateContent;
}

function mockMarkdownResponse() {
  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: () =>
        "```json\n" +
        JSON.stringify({
          shape: "round",
          confidence: 85,
          reasoning: "Face wrapped in markdown",
        }) +
        "\n```",
    },
  });

  (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: mockGenerateContent,
    }),
  }));

  return mockGenerateContent;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== Test Suites =====

describe("Gemini API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetRateLimiter(); // Reset rate limiter between tests
    // Set mock API key
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-api-key";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  });

  // ===== Basic Functionality =====

  describe("analyzeFaceWithGemini", () => {
    it("should successfully analyze face and return classification", async () => {
      mockSuccessfulResponse();

      const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);

      expect(result).toMatchObject({
        shape: "oval",
        confidence: 87,
        reasoning: expect.any(String),
      });
    });

    it("should handle base64 data with data URI prefix", async () => {
      mockSuccessfulResponse();

      const result = await analyzeFaceWithGemini(
        "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
      );

      expect(result.shape).toBe("oval");
    });

    it("should handle base64 data without data URI prefix", async () => {
      mockSuccessfulResponse();

      const result = await analyzeFaceWithGemini("/9j/4AAQSkZJRg==");

      expect(result.shape).toBe("oval");
    });

    it("should include client classification context when provided", async () => {
      const mockGenerate = mockSuccessfulResponse();

      await analyzeFaceWithGemini(MOCK_IMAGE_BASE64, MOCK_CLASSIFICATION);

      const callArgs = mockGenerate.mock.calls[0][0];
      expect(callArgs[0]).toContain("Client-side analysis suggests: oval");
    });

    it("should include landmarks context when provided", async () => {
      const mockGenerate = mockSuccessfulResponse();

      const mockLandmarks = Array(468)
        .fill(null)
        .map(() => ({ x: 0.5, y: 0.5, z: 0 }));
      await analyzeFaceWithGemini(MOCK_IMAGE_BASE64, undefined, mockLandmarks);

      const callArgs = mockGenerate.mock.calls[0][0];
      expect(callArgs[0]).toContain("468 points");
    });
  });

  // ===== Response Parsing =====

  describe("Response Parsing", () => {
    it("should parse clean JSON response", async () => {
      mockSuccessfulResponse({ shape: "square", confidence: 92 });

      const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);

      expect(result.shape).toBe("square");
      expect(result.confidence).toBe(92);
    });

    it("should handle markdown-wrapped JSON response", async () => {
      mockMarkdownResponse();

      const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);

      expect(result.shape).toBe("round");
      expect(result.confidence).toBe(85);
    });

    it("should validate shape value", async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              shape: "invalid_shape",
              confidence: 85,
              reasoning: "Test",
            }),
        },
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Invalid shape value"
      );
    });

    it("should validate confidence range", async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              shape: "oval",
              confidence: 150, // Invalid: > 100
              reasoning: "Test",
            }),
        },
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Invalid confidence value"
      );
    });

    it("should reject incomplete response", async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              shape: "oval",
              // Missing confidence and reasoning
            }),
        },
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Incomplete response"
      );
    });

    it("should reject malformed JSON", async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        response: {
          text: () => "{ not valid json }",
        },
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Invalid JSON response"
      );
    });
  });

  // ===== Rate Limiting =====

  describe("Rate Limiting", () => {
    it("should allow requests under 15 per minute", async () => {
      mockSuccessfulResponse();

      // Make 14 requests (under limit)
      const promises = Array(14)
        .fill(null)
        .map(() => analyzeFaceWithGemini(MOCK_IMAGE_BASE64));

      await expect(Promise.all(promises)).resolves.toBeDefined();
    });

    it("should reject 16th request in same minute", async () => {
      mockSuccessfulResponse();

      // Make 15 requests (at limit)
      await Promise.all(
        Array(15)
          .fill(null)
          .map(() => analyzeFaceWithGemini(MOCK_IMAGE_BASE64))
      );

      // 16th request should fail
      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Rate limit exceeded"
      );
    });

    it("should include retry after seconds in rate limit error", async () => {
      mockSuccessfulResponse();

      // Fill rate limit
      await Promise.all(
        Array(15)
          .fill(null)
          .map(() => analyzeFaceWithGemini(MOCK_IMAGE_BASE64))
      );

      // Next request should fail with retry info
      try {
        await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);
        fail("Expected rate limit error");
      } catch (error) {
        expect((error as Error).message).toMatch(/retry after \d+ seconds/i);
      }
    });

    it("should reset rate limit after 60 seconds", async () => {
      jest.useFakeTimers();
      mockSuccessfulResponse();

      // Fill rate limit
      await Promise.all(
        Array(15)
          .fill(null)
          .map(() => analyzeFaceWithGemini(MOCK_IMAGE_BASE64))
      );

      // Should fail immediately
      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Rate limit exceeded"
      );

      // Advance time by 61 seconds
      jest.advanceTimersByTime(61000);

      // Should succeed now
      await expect(
        analyzeFaceWithGemini(MOCK_IMAGE_BASE64)
      ).resolves.toBeDefined();

      jest.useRealTimers();
    });

    it("getRateLimitStatus should return current usage", async () => {
      mockSuccessfulResponse();

      const initialStatus = getRateLimitStatus();
      expect(initialStatus.current).toBe(0);
      expect(initialStatus.limit).toBe(15);
      expect(initialStatus.available).toBe(15);

      // Make 5 requests
      await Promise.all(
        Array(5)
          .fill(null)
          .map(() => analyzeFaceWithGemini(MOCK_IMAGE_BASE64))
      );

      const afterStatus = getRateLimitStatus();
      expect(afterStatus.current).toBe(5);
      expect(afterStatus.available).toBe(10);
    });
  });

  // ===== Retry Logic =====

  describe("Retry Logic", () => {
    it("should retry on transient failures", async () => {
      const mockGenerate = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network timeout"))
        .mockRejectedValueOnce(new Error("Connection reset"))
        .mockResolvedValueOnce({
          response: {
            text: () =>
              JSON.stringify({
                shape: "oval",
                confidence: 87,
                reasoning: "Success after retries",
              }),
          },
        });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);

      expect(result.shape).toBe("oval");
      expect(mockGenerate).toHaveBeenCalledTimes(3);
    });

    it("should not retry on rate limit errors", async () => {
      // Fill rate limit first
      mockSuccessfulResponse();
      await Promise.all(
        Array(15)
          .fill(null)
          .map(() => analyzeFaceWithGemini(MOCK_IMAGE_BASE64))
      );

      // Next request should fail immediately without retry
      const startTime = Date.now();
      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Rate limit exceeded"
      );
      const duration = Date.now() - startTime;

      // Should fail fast (< 100ms)
      expect(duration).toBeLessThan(100);
    });

    it("should not retry on validation errors", async () => {
      mockErrorResponse("Invalid API key");

      const startTime = Date.now();
      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow();
      const duration = Date.now() - startTime;

      // Should fail fast without retry
      expect(duration).toBeLessThan(100);
    });

    it("should fail after max retries", async () => {
      mockErrorResponse("Network error");

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        /Failed to analyze face after \d+ attempts/
      );
    });

    it("should use exponential backoff", async () => {
      jest.useFakeTimers();

      const mockGenerate = jest.fn().mockRejectedValue(new Error("Timeout"));

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      const promise = analyzeFaceWithGemini(MOCK_IMAGE_BASE64);

      // First attempt - immediate
      await jest.advanceTimersByTimeAsync(0);
      expect(mockGenerate).toHaveBeenCalledTimes(1);

      // Second attempt - after 1000ms
      await jest.advanceTimersByTimeAsync(1000);
      expect(mockGenerate).toHaveBeenCalledTimes(2);

      // Third attempt - after 2000ms (exponential backoff)
      await jest.advanceTimersByTimeAsync(2000);
      expect(mockGenerate).toHaveBeenCalledTimes(3);

      // Fourth attempt - after 4000ms
      await jest.advanceTimersByTimeAsync(4000);
      expect(mockGenerate).toHaveBeenCalledTimes(4);

      await expect(promise).rejects.toThrow();

      jest.useRealTimers();
    });
  });

  // ===== Error Handling =====

  describe("Error Handling", () => {
    it("should handle missing API key", async () => {
      delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "API key not configured"
      );
    });

    it("should handle invalid API key", async () => {
      mockErrorResponse("API key not valid");

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Invalid Gemini API key"
      );
    });

    it("should handle quota exceeded", async () => {
      mockErrorResponse("quota exceeded");

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "quota exceeded"
      );
    });

    it("should handle timeout errors", async () => {
      mockErrorResponse("request timeout");

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "timed out"
      );
    });
  });

  // ===== Health Check =====

  describe("checkGeminiHealth", () => {
    it("should return true when API is healthy", async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        response: {
          text: () => "OK",
        },
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      const isHealthy = await checkGeminiHealth();
      expect(isHealthy).toBe(true);
    });

    it("should return false when API key is missing", async () => {
      delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      const isHealthy = await checkGeminiHealth();
      expect(isHealthy).toBe(false);
    });

    it("should return false when API is unreachable", async () => {
      mockErrorResponse("Network error");

      const isHealthy = await checkGeminiHealth();
      expect(isHealthy).toBe(false);
    });
  });

  // ===== Face Shape Validation =====

  describe("Face Shape Validation", () => {
    const validShapes: Array<
      "oval" | "round" | "square" | "heart" | "oblong" | "diamond"
    > = ["oval", "round", "square", "heart", "oblong", "diamond"];

    validShapes.forEach((shape) => {
      it(`should accept valid shape: ${shape}`, async () => {
        mockSuccessfulResponse({ shape, confidence: 85 });

        const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);
        expect(result.shape).toBe(shape);
      });
    });
  });

  // ===== Confidence Scoring =====

  describe("Confidence Scoring", () => {
    it("should accept confidence at minimum (50)", async () => {
      mockSuccessfulResponse({ confidence: 50 });

      const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);
      expect(result.confidence).toBe(50);
    });

    it("should accept confidence at maximum (100)", async () => {
      mockSuccessfulResponse({ confidence: 100 });

      const result = await analyzeFaceWithGemini(MOCK_IMAGE_BASE64);
      expect(result.confidence).toBe(100);
    });

    it("should reject confidence below 50", async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              shape: "oval",
              confidence: 45,
              reasoning: "Test",
            }),
        },
      });

      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
        getGenerativeModel: () => ({ generateContent: mockGenerate }),
      }));

      await expect(analyzeFaceWithGemini(MOCK_IMAGE_BASE64)).rejects.toThrow(
        "Invalid confidence value"
      );
    });
  });
});
