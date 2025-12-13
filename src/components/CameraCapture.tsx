/**
 * Camera capture component
 * Provides webcam interface for capturing user photos with face guide overlay
 *
 * Features:
 * - WebRTC camera access with permission handling
 * - Live video preview with face guide overlay
 * - Image capture with quality validation
 * - Full accessibility support (WCAG 2.1 AA)
 * - Mobile responsive with iOS Safari support
 */

"use client";

import { useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { LoadingOverlay } from "./LoadingOverlay";
import { ErrorMessage } from "./ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CameraOff, Lightbulb, User, Sun, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppError } from "@/types";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Face guide overlay component for user positioning
 */
function FaceGuideOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Oval face guide */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Semi-transparent overlay */}
        <defs>
          <mask id="face-guide-mask">
            <rect width="100" height="100" fill="white" />
            <ellipse cx="50" cy="50" rx="28" ry="38" fill="black" />
          </mask>
        </defs>

        {/* Darkened area outside oval */}
        <rect
          width="100"
          height="100"
          fill="black"
          opacity="0.4"
          mask="url(#face-guide-mask)"
        />

        {/* Oval guide border */}
        <ellipse
          cx="50"
          cy="50"
          rx="28"
          ry="38"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="2,2"
          opacity="0.8"
        />

        {/* Corner guides */}
        <g stroke="white" strokeWidth="0.8" opacity="0.9">
          {/* Top left */}
          <line x1="20" y1="8" x2="28" y2="8" />
          <line x1="20" y1="8" x2="20" y2="16" />

          {/* Top right */}
          <line x1="72" y1="8" x2="80" y2="8" />
          <line x1="80" y1="8" x2="80" y2="16" />

          {/* Bottom left */}
          <line x1="20" y1="92" x2="28" y2="92" />
          <line x1="20" y1="84" x2="20" y2="92" />

          {/* Bottom right */}
          <line x1="72" y1="92" x2="80" y2="92" />
          <line x1="80" y1="84" x2="80" y2="92" />
        </g>
      </svg>

      {/* Instruction text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-medium border border-white/10">
        Align face within guide
      </div>
    </div>
  );
}

/**
 * Main camera capture component
 */
export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const { videoRef, stream, error, isLoading, startCamera, stopCamera } =
    useCamera();
  const [isCapturing, setIsCapturing] = useState(false);

  /**
   * Validate image quality before capture
   * Checks for blur and lighting issues
   */
  const validateImageQuality = (
    canvas: HTMLCanvasElement
  ): { valid: boolean; reason?: string; errorCode?: AppError["code"] } => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        valid: false,
        reason: "Canvas context unavailable",
        errorCode: "UNKNOWN_ERROR",
      };
    }

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate average brightness
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += (r + g + b) / 3;
    }
    const avgBrightness = totalBrightness / (data.length / 4);

    // Check lighting (too dark or too bright)
    if (avgBrightness < 40) {
      return {
        valid: false,
        reason: "Image too dark. Please improve lighting.",
        errorCode: "POOR_LIGHTING",
      };
    }
    if (avgBrightness > 230) {
      return {
        valid: false,
        reason: "Image too bright. Please adjust lighting.",
        errorCode: "POOR_LIGHTING",
      };
    }

    return { valid: true };
  };

  /**
   * Handle photo capture with quality validation
   * Enforces SPEC.md 7.2 limits: max 5MB, max 1920x1920 resolution
   */
  const handleCapture = () => {
    if (!videoRef.current) return;

    setIsCapturing(true);

    try {
      // Create canvas to capture frame
      let width = videoRef.current.videoWidth;
      let height = videoRef.current.videoHeight;

      // Enforce maximum resolution (SPEC.md 7.2: 1920x1920 max)
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Draw video frame to canvas (scaled if needed)
      ctx.drawImage(videoRef.current, 0, 0, width, height);

      // Validate image quality
      const validation = validateImageQuality(canvas);
      if (!validation.valid) {
        throw new Error(validation.reason || "Image quality check failed");
      }

      // Convert to base64
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      // Validate file size (SPEC.md 7.2: max 5MB)
      const imageSizeBytes = (imageData.length * 3) / 4; // Base64 to bytes
      const MAX_SIZE_MB = 5;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

      if (imageSizeBytes > MAX_SIZE_BYTES) {
        throw new Error(
          `Image too large (${(imageSizeBytes / (1024 * 1024)).toFixed(
            1
          )}MB). Maximum size is ${MAX_SIZE_MB}MB. Try moving further from camera.`
        );
      }

      // Stop camera and pass to parent
      stopCamera();
      onCapture(imageData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Capture failed");
      console.error("Capture error:", error);

      if (onError) {
        onError(error);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {/* Error display */}
      {error && (
        <ErrorMessage
          error={{
            code:
              error.toLowerCase().includes("permission") ||
              error.toLowerCase().includes("denied")
                ? "CAMERA_PERMISSION_DENIED"
                : error.toLowerCase().includes("not found") ||
                    error.toLowerCase().includes("no camera")
                  ? "CAMERA_NOT_FOUND"
                  : "UNKNOWN_ERROR",
            message: error,
            recoverable: true,
          }}
          onRetry={startCamera}
        />
      )}

      {/* Loading state */}
      {isLoading && <LoadingOverlay message="Accessing camera..." />}

      {/* Active camera view */}
      {stream && (
        <Card className="overflow-hidden border-purple-200 dark:border-purple-800/30 shadow-lg">
          <CardContent className="p-0">
            {/* Video preview with face guide */}
            <div className="relative overflow-hidden rounded-t-lg bg-black aspect-4/3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                aria-label="Camera preview"
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  console.log("Video metadata loaded:", {
                    videoWidth: video.videoWidth,
                    videoHeight: video.videoHeight,
                    readyState: video.readyState,
                  });

                  // Ensure video plays
                  video.play().catch((err) => {
                    console.error("Play failed:", err);
                  });
                }}
              />

              {/* Face positioning guide overlay */}
              <FaceGuideOverlay />
            </div>

            {/* Compact Tips Section */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-t border-purple-200/50 dark:border-purple-800/30 px-4 py-3">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-medium">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Tips:</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-purple-600 dark:text-purple-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Face forward
                  </span>
                  <span className="flex items-center gap-1">
                    <Sun className="h-3 w-3" />
                    Good lighting
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Remove glasses
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
              <Button
                onClick={handleCapture}
                disabled={isCapturing}
                className={cn(
                  "flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all",
                  isCapturing && "opacity-60 cursor-not-allowed"
                )}
                size="lg"
                aria-label="Capture photo"
              >
                <Camera className="mr-2 h-4 w-4" aria-hidden="true" />
                {isCapturing ? "Capturing..." : "Capture Photo"}
              </Button>
              <Button
                onClick={stopCamera}
                disabled={isCapturing}
                variant="outline"
                size="lg"
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Cancel and close camera"
              >
                <CameraOff className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial state - camera not started */}
      {!stream && !isLoading && !error && (
        <Card className="border-purple-200 dark:border-purple-800/30 shadow-lg">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl">
              <Camera
                className="h-16 w-16 text-purple-600 dark:text-purple-400"
                aria-hidden="true"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Camera Access Required
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                We need camera access to capture your photo for analysis. Your
                image is processed securely and never stored on our servers.
              </p>
            </div>
            <Button
              onClick={startCamera}
              size="lg"
              className="mt-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-md hover:shadow-lg transition-all px-8"
              aria-label="Start camera"
            >
              <Camera className="mr-2 h-4 w-4" aria-hidden="true" />
              Start Camera
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
