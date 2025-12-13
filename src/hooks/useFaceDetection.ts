/**
 * Custom hook for real-time face detection
 *
 * Integrates MediaPipe FaceLandmarker with React component lifecycle.
 * Provides face landmarks, detection status, and error handling.
 *
 * Features:
 * - Real-time face tracking at ~30 FPS
 * - Automatic initialization and cleanup
 * - Error recovery with retry logic
 * - Performance optimized (requestAnimationFrame)
 *
 * @see CONVENTIONS.md section 3.2 for hook patterns
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { FaceLandmark, AppError } from "@/types";
import {
  initializeFaceLandmarker,
  detectFace,
  cleanupFaceLandmarker,
  type FaceDetectionResult,
} from "@/lib/faceDetection";

/**
 * Hook configuration options
 */
interface UseFaceDetectionOptions {
  /** Enable/disable face detection */
  enabled?: boolean;
  /** Callback when face detected */
  onFaceDetected?: (result: FaceDetectionResult) => void;
  /** Callback when no face detected */
  onNoFace?: () => void;
  /** Callback on error */
  onError?: (error: AppError) => void;
  /** Detection frame rate throttle (ms) */
  throttle?: number;
}

/**
 * Hook return value
 */
interface UseFaceDetectionReturn {
  /** Detected face landmarks (468 points) */
  landmarks: FaceLandmark[] | null;
  /** Face detection bounding box */
  boundingBox: { x: number; y: number; width: number; height: number } | null;
  /** Detection confidence score (0-1) */
  confidence: number | null;
  /** Whether face detection is currently running */
  isDetecting: boolean;
  /** Whether MediaPipe is being initialized */
  isInitializing: boolean;
  /** Current error state */
  error: AppError | null;
  /** Manually trigger detection on current frame */
  detectNow: () => void;
  /** Reset error state */
  clearError: () => void;
}

/**
 * Real-time face detection hook
 *
 * Automatically initializes MediaPipe FaceLandmarker, runs detection loop
 * on video frames, and cleans up resources on unmount.
 *
 * @param videoRef Ref to video element showing camera stream
 * @param options Configuration options
 * @returns Face detection state and controls
 *
 * @example
 * ```typescript
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { landmarks, isDetecting, error } = useFaceDetection(videoRef, {
 *   enabled: true,
 *   onFaceDetected: (result) => console.log('Face found!', result)
 * });
 * ```
 */
export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: UseFaceDetectionOptions = {}
): UseFaceDetectionReturn {
  const {
    enabled = true,
    onFaceDetected,
    onNoFace,
    onError,
    throttle = 0,
  } = options;

  // State
  const [landmarks, setLandmarks] = useState<FaceLandmark[] | null>(null);
  const [boundingBox, setBoundingBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  // Refs for animation loop
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastDetectionTimeRef = useRef<number>(0);
  const isActiveRef = useRef(false);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle detection errors
   */
  const handleError = useCallback(
    (err: unknown, code: AppError["code"] = "UNKNOWN_ERROR") => {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const appError: AppError = {
        code,
        message: errorMessage,
        recoverable: true,
      };
      setError(appError);
      onError?.(appError);
    },
    [onError]
  );

  /**
   * Detect face in current video frame
   */
  const detectNow = useCallback(
    (timestamp?: number) => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        return;
      }

      try {
        const ts = timestamp ?? performance.now();

        // Throttle detection if configured
        if (throttle > 0 && ts - lastDetectionTimeRef.current < throttle) {
          return;
        }

        lastDetectionTimeRef.current = ts;

        // Detect face
        const result = detectFace(video, ts);

        if (result) {
          // Face detected
          setLandmarks(result.landmarks);
          setBoundingBox(result.boundingBox);
          setConfidence(result.confidence);
          setError(null);
          onFaceDetected?.(result);
        } else {
          // No face detected
          setLandmarks(null);
          setBoundingBox(null);
          setConfidence(null);
          onNoFace?.();

          // Set error if this persists
          if (landmarks !== null) {
            // Only set error if we previously had a face
            const noFaceError: AppError = {
              code: "NO_FACE_DETECTED",
              message:
                "No face detected. Please position your face in the frame.",
              recoverable: true,
            };
            setError(noFaceError);
          }
        }
      } catch (err) {
        console.error("Detection error:", err);

        // Check for specific error types from faceDetection.ts
        const errorMessage = err instanceof Error ? err.message : String(err);

        // Handle MULTIPLE_FACES error from SPEC.md section 6.1
        if (errorMessage.includes("MULTIPLE_FACES")) {
          handleError(err, "MULTIPLE_FACES");
        } else {
          handleError(err, "UNKNOWN_ERROR");
        }

        setLandmarks(null);
        setBoundingBox(null);
        setConfidence(null);
      }
    },
    [videoRef, throttle, landmarks, onFaceDetected, onNoFace, handleError]
  );

  /**
   * Detection loop
   */
  const detectionLoop = useCallback(() => {
    if (!isActiveRef.current) return;

    detectNow();

    // Schedule next frame
    // eslint-disable-next-line react-hooks/immutability
    animationFrameRef.current = requestAnimationFrame(detectionLoop);
  }, [detectNow]);

  /**
   * Initialize MediaPipe and start detection
   */
  useEffect(() => {
    if (!enabled) {
      // Cleanup if disabled
      isActiveRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsDetecting(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const initialize = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        // Initialize MediaPipe FaceLandmarker
        await initializeFaceLandmarker();

        if (!isMounted) return;

        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (video.readyState >= 2) {
            resolve();
            return;
          }

          const handleLoadedData = () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
            resolve();
          };

          const handleError = () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
            reject(new Error("Video failed to load"));
          };

          video.addEventListener("loadeddata", handleLoadedData);
          video.addEventListener("error", handleError);

          // Timeout after 10 seconds
          setTimeout(() => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
            reject(new Error("Video load timeout"));
          }, 10000);
        });

        if (!isMounted) return;

        // Start detection loop
        isActiveRef.current = true;
        setIsDetecting(true);
        setIsInitializing(false);
        detectionLoop();
      } catch (err) {
        console.error("Failed to initialize face detection:", err);
        if (isMounted) {
          setIsInitializing(false);
          handleError(err, "UNKNOWN_ERROR");
        }
      }
    };

    initialize();

    // Cleanup
    return () => {
      isMounted = false;
      isActiveRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsDetecting(false);
      setIsInitializing(false);
    };
  }, [enabled, videoRef, detectionLoop, handleError]);

  /**
   * Cleanup MediaPipe on unmount
   */
  useEffect(() => {
    return () => {
      cleanupFaceLandmarker();
    };
  }, []);

  return {
    landmarks,
    boundingBox,
    confidence,
    isDetecting,
    isInitializing,
    error,
    detectNow,
    clearError,
  };
}
