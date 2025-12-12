/**
 * Custom hook for face detection
 */

import { useState, useEffect } from "react";
import { FaceLandmark } from "@/types";
import { detectFaceLandmarks } from "@/lib/faceDetection";

export function useFaceDetection(
  videoElement: HTMLVideoElement | null,
  enabled: boolean = false
) {
  const [landmarks, setLandmarks] = useState<FaceLandmark[] | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !videoElement) {
      return;
    }

    let animationId: number;
    let isActive = true;

    const detectFrame = async () => {
      if (!isActive) return;

      try {
        setIsDetecting(true);
        const detected = await detectFaceLandmarks(videoElement);

        if (detected) {
          setLandmarks(detected);
          setError(null);
        } else {
          setError("No face detected");
        }
      } catch (err) {
        console.error("Face detection error:", err);
        setError("Face detection failed");
      } finally {
        setIsDetecting(false);
      }

      if (isActive) {
        animationId = requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();

    return () => {
      isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [videoElement, enabled]);

  return {
    landmarks,
    isDetecting,
    error,
  };
}
