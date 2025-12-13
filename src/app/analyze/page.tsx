/* eslint-disable @next/next/no-img-element */
/**
 * Analysis page - Futuristic Cinematic Design
 * Main workflow for capturing photo and analyzing face shape
 *
 * Features:
 * - Camera capture with quality validation
 * - Real-time face detection and analysis
 * - Gemini AI validation of classification
 * - Error handling with retry logic
 * - Rate limit handling with countdown timer
 * - Futuristic glassmorphism UI
 * - Smooth Framer Motion animations
 */

"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

import { LoadingOverlay } from "@/components/LoadingOverlay";
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
  Sparkles,
  ArrowLeft,
  Brain,
} from "lucide-react";
import Link from "next/link";

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
      <Card className="glass-strong border-purple-500/20">
        <CardContent className="p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingOverlay message="Initializing camera interface..." />
          </motion.div>
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
    <div className="relative min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-gray-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            AI Face Analysis
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI analyzes your unique facial features to recommend the perfect
            hairstyles
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Camera Capture */}
          {state === "idle" && !capturedImage && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CameraCapture onCapture={handleCapture} />
            </motion.div>
          )}

          {/* Analyzing State */}
          {state === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-purple-200 dark:border-purple-800/30 shadow-xl">
                <CardContent className="p-12">
                  <div className="space-y-6 text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mx-auto w-fit p-6 bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl"
                    >
                      <Brain className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Analyzing Your Features
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        AI is processing your facial structure and landmarks...
                      </p>

                      <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium">
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        <span>Processing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error State */}
          {state === "error" && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-950/10 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Error Icon and Message */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold text-base text-red-900 dark:text-red-200">
                          {error.code === "API_RATE_LIMITED"
                            ? "Rate Limit Exceeded"
                            : "Analysis Failed"}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {error.message}
                        </p>

                        {/* Rate Limit Countdown */}
                        {error.code === "API_RATE_LIMITED" &&
                          retryCountdown > 0 && (
                            <motion.div
                              className="flex items-center gap-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 p-3"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm text-purple-900 dark:text-purple-200">
                                Please wait{" "}
                                <span className="font-mono font-semibold text-purple-700 dark:text-purple-300">
                                  {retryCountdown}s
                                </span>{" "}
                                before retrying
                              </span>
                            </motion.div>
                          )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {error.recoverable && (
                        <Button
                          onClick={handleRetry}
                          disabled={retryCountdown > 0}
                          className="flex-1 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
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
                        className="flex-1 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Take New Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results Display */}
          {state === "complete" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Success Banner */}
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-950/20 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">Analysis Complete</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Analysis Results */}
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="border-purple-200 dark:border-purple-800/30 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900 dark:text-gray-100 text-xl md:text-2xl">
                        Your Face Shape Analysis
                      </CardTitle>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retry
                      </Button>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      AI-validated analysis using advanced facial recognition
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Face Shape Result */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Detected Face Shape
                      </p>
                      <FaceShapeBadge
                        shape={result.shape}
                        confidence={result.confidence}
                      />
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-800" />

                    {/* AI Reasoning */}
                    <div>
                      <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Analysis Details
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {result.reasoning}
                      </p>
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-800" />

                    {/* Next Steps */}
                    <div className="rounded-xl bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 p-6 border border-purple-200 dark:border-purple-800/30">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Ready for Recommendations
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            Based on your{" "}
                            <span className="font-semibold text-purple-700 dark:text-purple-300">
                              {result.shape}
                            </span>{" "}
                            face shape, we&apos;ll show you hairstyles that
                            complement your features perfectly.
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          // Store image in sessionStorage instead of URL (prevents 431 error)
                          if (capturedImage) {
                            sessionStorage.setItem(
                              "styleai_captured_image",
                              capturedImage
                            );
                          }

                          const params = new URLSearchParams({
                            shape: result.shape,
                            confidence: result.confidence.toString(),
                            reasoning: result.reasoning,
                          });
                          window.location.href = `/results?${params.toString()}`;
                        }}
                        className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                        size="lg"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        View Recommendations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Captured Photo Display */}
              {capturedImage && (
                <motion.div
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card className="border-purple-200 dark:border-purple-800/30 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-gray-100">
                        Your Photo
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Image used for analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-3/4 w-full max-w-md mx-auto overflow-hidden rounded-xl border border-purple-200 dark:border-purple-800/30 shadow-md">
                        <img
                          src={capturedImage}
                          alt="Your captured photo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
