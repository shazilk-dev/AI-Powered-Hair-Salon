/**
 * Custom hook for camera access
 * Handles WebRTC camera permissions and error states
 */

import { useState, useEffect, useRef } from "react";
import type { ErrorCode } from "@/types";

interface CameraError {
  code: ErrorCode;
  message: string;
}

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Request camera access with proper error handling
   */
  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw {
          code: "CAMERA_NOT_FOUND",
          message: "Camera not supported on this device",
        } as CameraError;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      setStream(mediaStream);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);

      // Map browser error to our error codes
      let errorMessage = "Failed to access camera";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage =
          "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        errorMessage =
          "No camera found. Please connect a camera and try again.";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        errorMessage = "Camera is already in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Camera doesn't meet requirements. Try another camera.";
      } else if (err.name === "TypeError") {
        errorMessage = "Camera not supported on this device.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Stop camera stream and release resources
   */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera,
  };
}
