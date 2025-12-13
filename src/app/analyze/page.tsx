/**
 * Analysis page
 * Main workflow for capturing photo and analyzing face shape
 *
 * Features:
 * - Camera capture with quality validation
 * - Real-time face detection and analysis
 * - Gemini AI validation of classification
 * - Error handling with retry logic
 * - Rate limit handling with countdown timer
 */

"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FaceShapeBadge } from "@/components/FaceShapeBadge";
import type { FaceClassification, AnalyzeFaceResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lazy load CameraCapture component for performance
 * - Reduces initial bundle size significantly
 * - Only loads when user actually starts analysis
 * - SSR disabled since camera only works client-side
 */
const CameraCapture = dynamic(
  () =>
    import("@/components/CameraCapture").then((mod) => ({
      default: mod.CameraCapture,
    })),
  {
    loading: () => (
      <Card>
        <CardContent className="p-12">
          <LoadingOverlay message="Loading camera interface..." />
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

type AnalysisState = "idle" | "capturing" | "analyzing" | "complete" | "error";

export default function AnalyzePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<FaceClassification | null>(null);
  const [error, setError] = useState<{
    message: string;
    code?: string;
    recoverable?: boolean;
    retryAfter?: number;
  } | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number>(0);
  const retryTimerRef = useRef<number | NodeJS.Timeout | null>(null);

  // Cleanup retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current);
      }
    };
  }, []);

  /**
   * Start retry countdown timer
   */
  const startRetryCountdown = (seconds: number) => {
    setRetryCountdown(seconds);

    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
    }

    retryTimerRef.current = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          if (retryTimerRef.current) {
            clearInterval(retryTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Analyze face image with Gemini API
   */
  const analyzeFace = async (imageData: string, isRetry = false) => {
    setState("analyzing");
    setError(null);

    try {
      const response = await fetch("/api/analyze-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data: AnalyzeFaceResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        setState("complete");

        // Show success message if this was a retry
        if (isRetry) {
          console.log("✅ Analysis succeeded after retry");
        }
      } else if (data.error) {
        // Handle API error response
        const errorData = data.error;

        setState("error");
        setError({
          message: errorData.message || "Analysis failed",
          code: errorData.code,
          recoverable: errorData.recoverable ?? true,
          retryAfter: errorData.retryAfter,
        });

        // Start countdown for rate limit errors
        if (errorData.retryAfter && errorData.retryAfter > 0) {
          startRetryCountdown(errorData.retryAfter);
        }
      }
    } catch (err) {
      // Network or unexpected error
      setState("error");
      setError({
        message:
          err instanceof Error
            ? err.message
            : "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        recoverable: true,
      });
      console.error("Analysis error:", err);
    }
  };

  /**
   * Handle photo capture from camera
   */
  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    await analyzeFace(imageData);
  };

  /**
   * Retry analysis with same image
   */
  const handleRetry = async () => {
    if (!capturedImage) return;
    await analyzeFace(capturedImage, true);
  };

  /**
   * Reset to capture new photo
   */
  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setState("idle");
    setRetryCountdown(0);

    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Analyze Your Face Shape</h1>
        <p className="mt-2 text-muted-foreground">
          Capture a photo to get AI-powered face shape analysis
        </p>
      </div>

      {/* Camera Capture */}
      {state === "idle" && !capturedImage && (
        <CameraCapture onCapture={handleCapture} />
      )}

      {/* Analyzing State */}
      {state === "analyzing" && (
        <Card>
          <CardContent className="p-12">
            <div className="space-y-4">
              <LoadingOverlay message="Analyzing your face shape with AI..." />
              <p className="text-center text-sm text-muted-foreground">
                This may take a few seconds
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {state === "error" && error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Error Icon and Message */}
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-destructive">
                    {error.code === "API_RATE_LIMITED"
                      ? "Rate Limit Exceeded"
                      : "Analysis Failed"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {error.message}
                  </p>

                  {/* Rate Limit Countdown */}
                  {error.code === "API_RATE_LIMITED" && retryCountdown > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Please wait{" "}
                        <span className="font-mono font-medium">
                          {retryCountdown}s
                        </span>{" "}
                        before retrying
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                {error.recoverable && (
                  <Button
                    onClick={handleRetry}
                    disabled={retryCountdown > 0}
                    variant="default"
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {retryCountdown > 0
                      ? `Retry in ${retryCountdown}s`
                      : "Retry Analysis"}
                  </Button>
                )}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take New Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {state === "complete" && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success Banner */}
          <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Analysis Complete!</span>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Face Shape Analysis</CardTitle>
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Another Photo
                </Button>
              </div>
              <CardDescription>
                AI-validated analysis using advanced facial recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Face Shape Result */}
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Your Face Shape
                </p>
                <FaceShapeBadge
                  shape={result.shape}
                  confidence={result.confidence}
                />
              </div>

              <Separator />

              {/* AI Reasoning */}
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Why This Shape?
                </p>
                <p className="text-sm leading-relaxed">{result.reasoning}</p>
              </div>

              <Separator />

              {/* Next Steps */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  What's Next?
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Based on your{" "}
                  <span className="font-semibold">{result.shape}</span> face
                  shape, we'll recommend hairstyles that complement your
                  features perfectly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Captured Photo Display */}
          {capturedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Your Photo</CardTitle>
                <CardDescription>The image used for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={capturedImage}
                    alt="Your captured photo"
                    className="h-full w-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
