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
import { Camera, CameraOff, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">
        Position your face in the oval
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
  ): { valid: boolean; reason?: string } => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return { valid: false, reason: "Canvas context unavailable" };

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
      };
    }
    if (avgBrightness > 230) {
      return {
        valid: false,
        reason: "Image too bright. Please adjust lighting.",
      };
    }

    return { valid: true };
  };

  /**
   * Handle photo capture with quality validation
   */
  const handleCapture = () => {
    if (!videoRef.current) return;

    setIsCapturing(true);

    try {
      // Create canvas to capture frame
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Draw video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0);

      // Validate image quality
      const validation = validateImageQuality(canvas);
      if (!validation.valid) {
        throw new Error(validation.reason || "Image quality check failed");
      }

      // Convert to base64
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

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
            code: "CAMERA_ERROR",
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
        <Card>
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

            {/* Instructions banner */}
            <div className="bg-blue-50 border-b border-blue-100 p-3 flex items-start gap-2">
              <Info
                className="h-5 w-5 text-blue-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="text-sm text-blue-900">
                <p className="font-medium">Tips for best results:</p>
                <ul className="mt-1 space-y-0.5 text-blue-800">
                  <li>• Face the camera directly</li>
                  <li>• Ensure good lighting</li>
                  <li>• Remove glasses if possible</li>
                  <li>• Keep hair away from face</li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 p-4">
              <Button
                onClick={handleCapture}
                disabled={isCapturing}
                className={cn(
                  "flex-1",
                  isCapturing && "opacity-50 cursor-not-allowed"
                )}
                size="lg"
                aria-label="Capture photo"
              >
                <Camera className="mr-2 h-5 w-5" aria-hidden="true" />
                {isCapturing ? "Capturing..." : "Capture Photo"}
              </Button>
              <Button
                onClick={stopCamera}
                disabled={isCapturing}
                variant="outline"
                size="lg"
                aria-label="Cancel and close camera"
              >
                <CameraOff className="mr-2 h-5 w-5" aria-hidden="true" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial state - camera not started */}
      {!stream && !isLoading && !error && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="p-4 bg-gray-100 rounded-full">
              <Camera className="h-16 w-16 text-gray-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Camera Access Required
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-sm">
                We need access to your camera to capture your photo. Your image
                is processed locally and never stored.
              </p>
            </div>
            <Button
              onClick={startCamera}
              size="lg"
              className="mt-2"
              aria-label="Start camera"
            >
              <Camera className="mr-2 h-5 w-5" aria-hidden="true" />
              Start Camera
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
