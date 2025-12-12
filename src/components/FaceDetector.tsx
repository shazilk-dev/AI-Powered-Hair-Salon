/**
 * Face Detector Component
 *
 * Wraps useFaceDetection hook with visual feedback and canvas overlay.
 * Shows real-time face detection status with landmark visualization.
 *
 * Features:
 * - Real-time landmark detection
 * - Visual feedback (detecting, success, error)
 * - Optional landmark overlay on canvas
 * - Face alignment warnings
 * - Performance monitoring
 */

"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  extractKeyLandmarks,
  drawLandmarks,
  isFaceAligned,
  type FaceDetectionResult,
} from "@/lib/faceDetection";
import type { FaceLandmark } from "@/types";

interface FaceDetectorProps {
  /** Ref to video element showing camera */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** Whether to enable face detection */
  enabled?: boolean;
  /** Show landmark overlay on video */
  showLandmarks?: boolean;
  /** Callback when face detected */
  onFaceDetected?: (result: FaceDetectionResult) => void;
  /** Callback when no face detected */
  onNoFace?: () => void;
  /** Compact mode (minimal UI) */
  compact?: boolean;
}

/**
 * Face Detector Component
 *
 * Displays face detection status and optionally overlays landmarks on video.
 *
 * @example
 * ```tsx
 * <FaceDetector
 *   videoRef={videoRef}
 *   enabled={true}
 *   showLandmarks={true}
 *   onFaceDetected={(result) => console.log('Face found!', result)}
 * />
 * ```
 */
export function FaceDetector({
  videoRef,
  enabled = true,
  showLandmarks = false,
  onFaceDetected,
  onNoFace,
  compact = false,
}: FaceDetectorProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fpsDisplay, setFpsDisplay] = useState<number>(0);
  const [isAligned, setIsAligned] = useState<boolean>(true);
  // eslint-disable-next-line react-hooks/purity
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  // Use face detection hook
  const {
    landmarks,
    boundingBox,
    confidence,
    isDetecting,
    isInitializing,
    error,
  } = useFaceDetection(videoRef, {
    enabled,
    onFaceDetected: (result) => {
      // Calculate FPS
      const now = performance.now();
      frameCountRef.current++;
      const elapsed = now - lastFrameTimeRef.current;
      if (elapsed >= 1000) {
        setFpsDisplay(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      // Check face alignment
      try {
        const keyLandmarks = extractKeyLandmarks(result.landmarks);
        setIsAligned(isFaceAligned(keyLandmarks));
      } catch {
        setIsAligned(false);
      }

      onFaceDetected?.(result);
    },
    onNoFace,
  });

  // Draw landmarks on canvas overlay
  useEffect(() => {
    if (
      !showLandmarks ||
      !landmarks ||
      !canvasRef.current ||
      !videoRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Match canvas size to video
    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;

    // Clear canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks
    drawLandmarks(canvas, landmarks, "#00ff00", 1);

    // Draw bounding box
    if (boundingBox) {
      ctx.strokeStyle = isAligned ? "#00ff00" : "#ffaa00";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        boundingBox.x * canvas.width,
        boundingBox.y * canvas.height,
        boundingBox.width * canvas.width,
        boundingBox.height * canvas.height
      );
    }
  }, [showLandmarks, landmarks, boundingBox, isAligned, videoRef]);

  // Compact mode - minimal UI
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {isInitializing && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-gray-600">Initializing...</span>
          </>
        )}
        {error && (
          <>
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-600">Detection error</span>
          </>
        )}
        {landmarks && !error && (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-600">Face detected</span>
          </>
        )}
        {isDetecting && !landmarks && !error && !isInitializing && (
          <>
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">Looking for face...</span>
          </>
        )}
      </div>
    );
  }

  // Full mode - detailed UI
  return (
    <div className="space-y-2">
      {/* Canvas overlay for landmarks */}
      {showLandmarks && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Status card */}
      <Card className="border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Status icon */}
              {isInitializing && (
                <Loader2
                  className="h-5 w-5 animate-spin text-blue-500"
                  aria-hidden="true"
                />
              )}
              {error && (
                <AlertCircle
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              )}
              {landmarks && !error && (
                <CheckCircle
                  className="h-5 w-5 text-green-500"
                  aria-hidden="true"
                />
              )}
              {isDetecting && !landmarks && !error && !isInitializing && (
                <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}

              {/* Status text */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {isInitializing && "Initializing face detection..."}
                  {error && "Detection error"}
                  {landmarks && !error && "Face detected"}
                  {isDetecting &&
                    !landmarks &&
                    !error &&
                    !isInitializing &&
                    "Looking for face..."}
                </span>
                {error && (
                  <span className="text-xs text-red-600">{error.message}</span>
                )}
              </div>
            </div>

            {/* Info badges */}
            <div className="flex items-center gap-2">
              {landmarks && confidence && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(confidence * 100)}% confident
                </Badge>
              )}
              {isDetecting && fpsDisplay > 0 && (
                <Badge variant="outline" className="text-xs">
                  {fpsDisplay} FPS
                </Badge>
              )}
            </div>
          </div>

          {/* Face alignment warning */}
          {landmarks && !isAligned && (
            <div className="mt-2 flex items-start gap-2 rounded-md bg-orange-50 p-2">
              <AlertCircle
                className="h-4 w-4 text-orange-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs text-orange-800">
                Please face the camera directly for best results
              </p>
            </div>
          )}

          {/* Detection details */}
          {landmarks && !error && (
            <div className="mt-2 text-xs text-gray-600">
              <p>
                Detected {landmarks.length} landmarks •{" "}
                {boundingBox
                  ? `${Math.round(boundingBox.width * 100)}% face width`
                  : ""}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
