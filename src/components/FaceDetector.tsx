/**
 * Face detector component wrapper
 * Integrates MediaPipe face detection
 */

"use client";

import { useFaceDetection } from "@/hooks/useFaceDetection";
import { FaceLandmark } from "@/types";

interface FaceDetectorProps {
  videoElement: HTMLVideoElement | null;
  onDetection: (landmarks: FaceLandmark[]) => void;
  enabled?: boolean;
}

export function FaceDetector({
  videoElement,
  onDetection,
  enabled = true,
}: FaceDetectorProps) {
  const { landmarks, isDetecting, error } = useFaceDetection(videoElement, enabled);

  // Call callback when landmarks are detected
  if (landmarks && !error) {
    onDetection(landmarks);
  }

  return (
    <div className="text-sm text-gray-600">
      {isDetecting && <p>Detecting face...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {landmarks && !error && <p className="text-green-600">Face detected!</p>}
    </div>
  );
}
