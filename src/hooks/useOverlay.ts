/**
 * Custom hook for canvas overlay management
 *
 * Manages hairstyle preview rendering with automatic updates
 * when user image, hairstyle, or face landmarks change.
 * Provides error handling and loading states for better UX.
 */

import { useRef, useEffect, useState } from "react";
import type { FaceLandmark, AppError } from "@/types";
import { renderPreview, setupHighDPICanvas } from "@/lib/overlayEngine";

interface UseOverlayProps {
  userImageSrc: string | null;
  hairstyleImageSrc: string | null;
  landmarks: FaceLandmark[] | null;
  onError?: (error: AppError) => void;
}

/**
 * Hook for managing hairstyle overlay canvas
 *
 * @param userImageSrc - User photo source (base64 or URL)
 * @param hairstyleImageSrc - Hairstyle template source (base64 or URL)
 * @param landmarks - MediaPipe face landmarks (468 points)
 * @param onError - Optional callback when rendering fails
 * @returns Canvas ref, loading state, and error state
 */
export function useOverlay({
  userImageSrc,
  hairstyleImageSrc,
  landmarks,
  onError,
}: UseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup high DPI support on mount
    setupHighDPICanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (
      !canvasRef.current ||
      !userImageSrc ||
      !hairstyleImageSrc ||
      !landmarks
    ) {
      return;
    }

    setIsRendering(true);
    setError(null);

    // Render preview with comprehensive error handling
    renderPreview(
      canvasRef.current,
      userImageSrc,
      hairstyleImageSrc,
      landmarks
    )
      .then(() => {
        setIsRendering(false);
      })
      .catch((err) => {
        console.error("Failed to render hairstyle preview:", err);

        const appError: AppError = {
          code: "UNKNOWN_ERROR",
          message:
            "Failed to render hairstyle preview. Please try a different style.",
          recoverable: true,
        };

        setError(appError);
        setIsRendering(false);

        // Notify parent component of error
        onError?.(appError);
      });
  }, [userImageSrc, hairstyleImageSrc, landmarks, onError]);

  return {
    canvasRef,
    isRendering,
    error,
  };
}
