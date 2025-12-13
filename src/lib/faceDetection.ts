/**
 * Face Detection Utilities
 * MediaPipe FaceLandmarker integration for real-time face detection
 *
 * Provides:
 * - Face landmark detection (468 points)
 * - Key landmark extraction
 * - Face boundary detection
 * - Initialization and cleanup
 *
 * Performance Optimization:
 * - MediaPipe is lazy-loaded to reduce initial bundle size (~500KB savings)
 * - Only loaded when face detection is actually needed
 *
 * @see https://developers.google.com/mediapipe/solutions/vision/face_landmarker
 */

import type { FaceLandmark } from "@/types";

/**
 * Lazy-loaded MediaPipe types
 * These are loaded dynamically when initializeFaceLandmarker() is called
 */
type FaceLandmarkerType = any;
type FilesetResolverType = any;
type FaceLandmarkerResultType = any;

/**
 * MediaPipe module cache
 * Stores the dynamically imported module to avoid re-importing
 */
let mediaPipeModule: any = null;

/**
 * Critical MediaPipe Face Mesh landmark indices
 * Based on 468-point face model
 */
export const LANDMARK_INDICES = {
  // Face outline
  FOREHEAD_TOP: 10,
  CHIN_BOTTOM: 152,

  // Face width points
  LEFT_CHEEKBONE: 234,
  RIGHT_CHEEKBONE: 454,

  // Jaw points
  LEFT_JAW: 58,
  RIGHT_JAW: 288,

  // Forehead points
  LEFT_FOREHEAD: 103,
  RIGHT_FOREHEAD: 332,

  // Eye reference (for rotation calculation)
  LEFT_EYE_OUTER: 33,
  RIGHT_EYE_OUTER: 263,

  // Nose (center reference)
  NOSE_TIP: 4,
} as const;

/**
 * Face detection result with bounding box
 */
export interface FaceDetectionResult {
  landmarks: FaceLandmark[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

/**
 * Key landmarks extracted for face shape analysis
 */
export interface KeyLandmarks {
  foreheadTop: FaceLandmark;
  chinBottom: FaceLandmark;
  leftCheekbone: FaceLandmark;
  rightCheekbone: FaceLandmark;
  leftJaw: FaceLandmark;
  rightJaw: FaceLandmark;
  leftForehead: FaceLandmark;
  rightForehead: FaceLandmark;
  leftEyeOuter: FaceLandmark;
  rightEyeOuter: FaceLandmark;
  noseTip: FaceLandmark;
}

/**
 * MediaPipe configuration for optimal performance
 */
const MEDIAPIPE_CONFIG = {
  baseOptions: {
    modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    delegate: "GPU" as const,
  },
  runningMode: "VIDEO" as const,
  numFaces: 1, // Detect single face for performance
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  outputFaceBlendshapes: false,
  outputFacialTransformationMatrixes: false,
};

/**
 * Singleton instance of FaceLandmarker
 */
let faceLandmarkerInstance: FaceLandmarkerType | null = null;

/**
 * Initialize MediaPipe FaceLandmarker
 *
 * Performance Optimization:
 * - Lazy loads MediaPipe library (~500KB) only when needed
 * - Downloads WASM files and creates FaceLandmarker instance
 * - Safe to call multiple times - returns existing instance if already initialized
 *
 * @throws {Error} If MediaPipe fails to initialize
 * @returns Promise<FaceLandmarker> Initialized face landmarker
 *
 * @example
 * ```typescript
 * const landmarker = await initializeFaceLandmarker();
 * ```
 */
export async function initializeFaceLandmarker(): Promise<FaceLandmarkerType> {
  // Return existing instance if already initialized
  if (faceLandmarkerInstance) {
    return faceLandmarkerInstance;
  }

  try {
    // Lazy load MediaPipe module (only on first call)
    if (!mediaPipeModule) {
      console.log("📦 Lazy loading MediaPipe library...");
      mediaPipeModule = await import("@mediapipe/tasks-vision");
      console.log("✅ MediaPipe library loaded");
    }

    const { FaceLandmarker, FilesetResolver } = mediaPipeModule;

    // Load MediaPipe Vision WASM files
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    // Create FaceLandmarker instance
    faceLandmarkerInstance = await FaceLandmarker.createFromOptions(
      vision,
      MEDIAPIPE_CONFIG
    );

    return faceLandmarkerInstance;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to initialize MediaPipe FaceLandmarker:", error);
    throw new Error(
      `MediaPipe initialization failed: ${errorMessage}. Please refresh the page and try again.`
    );
  }
}

/**
 * Detect face in video frame
 *
 * Processes a single video frame and returns detected face landmarks.
 * Must be called after initializeFaceLandmarker().
 *
 * @param video HTMLVideoElement with active video stream
 * @param timestamp Current timestamp in milliseconds (performance.now())
 * @returns FaceDetectionResult or null if no face detected
 *
 * @throws {Error} If FaceLandmarker not initialized
 *
 * @example
 * ```typescript
 * const result = detectFace(videoElement, performance.now());
 * if (result) {
 *   console.log(`Detected ${result.landmarks.length} landmarks`);
 * }
 * ```
 */
export function detectFace(
  video: HTMLVideoElement,
  timestamp: number
): FaceDetectionResult | null {
  if (!faceLandmarkerInstance) {
    throw new Error(
      "FaceLandmarker not initialized. Call initializeFaceLandmarker() first."
    );
  }

  try {
    // Detect face landmarks in video frame
    const results: FaceLandmarkerResultType =
      faceLandmarkerInstance.detectForVideo(video, timestamp);

    // Check if face detected
    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      return null;
    }

    // Check for multiple faces (error code from SPEC.md section 6.1)
    if (results.faceLandmarks.length > 1) {
      throw new Error(
        "MULTIPLE_FACES: Please ensure only one person is in the frame."
      );
    }

    // Get first face (we only detect one)
    const faceLandmarks = results.faceLandmarks[0];

    // Convert MediaPipe landmarks to our format
    const landmarks: FaceLandmark[] = faceLandmarks.map((landmark: any) => ({
      x: landmark.x,
      y: landmark.y,
      z: landmark.z || 0,
    }));

    // Calculate bounding box from landmarks
    const boundingBox = calculateBoundingBox(landmarks);

    // Detection confidence (use a reasonable default if not provided)
    const confidence = 0.9; // MediaPipe doesn't provide per-detection confidence in VIDEO mode

    return {
      landmarks,
      boundingBox,
      confidence,
    };
  } catch (error) {
    console.error("Face detection error:", error);
    throw new Error(
      "Face detection failed. Please ensure your face is visible and try again."
    );
  }
}

/**
 * Calculate bounding box from landmarks
 *
 * @param landmarks Array of face landmarks
 * @returns Bounding box coordinates
 */
function calculateBoundingBox(landmarks: FaceLandmark[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (landmarks.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  // Find min/max coordinates
  let minX = landmarks[0].x;
  let maxX = landmarks[0].x;
  let minY = landmarks[0].y;
  let maxY = landmarks[0].y;

  for (const landmark of landmarks) {
    minX = Math.min(minX, landmark.x);
    maxX = Math.max(maxX, landmark.x);
    minY = Math.min(minY, landmark.y);
    maxY = Math.max(maxY, landmark.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Extract key landmarks for face shape analysis
 *
 * Extracts the 11 critical landmarks needed for face shape classification.
 * These landmarks define the face outline and proportions.
 *
 * @param landmarks Complete array of 468 face landmarks
 * @returns KeyLandmarks object with named landmark points
 *
 * @throws {Error} If landmarks array is invalid
 *
 * @example
 * ```typescript
 * const keyLandmarks = extractKeyLandmarks(allLandmarks);
 * const faceWidth = calculateDistance(
 *   keyLandmarks.leftCheekbone,
 *   keyLandmarks.rightCheekbone
 * );
 * ```
 */
export function extractKeyLandmarks(landmarks: FaceLandmark[]): KeyLandmarks {
  if (!landmarks || landmarks.length < 468) {
    throw new Error(
      `Invalid landmarks array. Expected 468 landmarks, got ${landmarks?.length || 0}.`
    );
  }

  return {
    foreheadTop: landmarks[LANDMARK_INDICES.FOREHEAD_TOP],
    chinBottom: landmarks[LANDMARK_INDICES.CHIN_BOTTOM],
    leftCheekbone: landmarks[LANDMARK_INDICES.LEFT_CHEEKBONE],
    rightCheekbone: landmarks[LANDMARK_INDICES.RIGHT_CHEEKBONE],
    leftJaw: landmarks[LANDMARK_INDICES.LEFT_JAW],
    rightJaw: landmarks[LANDMARK_INDICES.RIGHT_JAW],
    leftForehead: landmarks[LANDMARK_INDICES.LEFT_FOREHEAD],
    rightForehead: landmarks[LANDMARK_INDICES.RIGHT_FOREHEAD],
    leftEyeOuter: landmarks[LANDMARK_INDICES.LEFT_EYE_OUTER],
    rightEyeOuter: landmarks[LANDMARK_INDICES.RIGHT_EYE_OUTER],
    noseTip: landmarks[LANDMARK_INDICES.NOSE_TIP],
  };
}

/**
 * Calculate Euclidean distance between two landmarks
 *
 * Used for face measurements and proportions.
 * Accounts for normalized coordinates (0-1 range).
 *
 * @param point1 First landmark point
 * @param point2 Second landmark point
 * @param imageWidth Width of the image/video (for denormalization)
 * @param imageHeight Height of the image/video (for denormalization)
 * @returns Distance in pixels
 *
 * @example
 * ```typescript
 * const faceWidth = calculateDistance(
 *   leftCheek,
 *   rightCheek,
 *   videoWidth,
 *   videoHeight
 * );
 * ```
 */
export function calculateDistance(
  point1: FaceLandmark,
  point2: FaceLandmark,
  imageWidth: number,
  imageHeight: number
): number {
  // Denormalize coordinates
  const x1 = point1.x * imageWidth;
  const y1 = point1.y * imageHeight;
  const x2 = point2.x * imageWidth;
  const y2 = point2.y * imageHeight;

  // Euclidean distance
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate face rotation angle
 *
 * Determines if face is tilted using eye landmarks.
 * Returns angle in radians.
 *
 * @param leftEye Left eye outer corner landmark
 * @param rightEye Right eye outer corner landmark
 * @returns Rotation angle in radians (positive = clockwise)
 *
 * @example
 * ```typescript
 * const angle = calculateFaceRotation(leftEye, rightEye);
 * const degrees = (angle * 180) / Math.PI;
 * ```
 */
export function calculateFaceRotation(
  leftEye: FaceLandmark,
  rightEye: FaceLandmark
): number {
  const deltaY = rightEye.y - leftEye.y;
  const deltaX = rightEye.x - leftEye.x;
  return Math.atan2(deltaY, deltaX);
}

/**
 * Draw landmarks on canvas for visualization
 *
 * Useful for debugging and showing detection overlay.
 * Draws all 468 landmarks as small circles.
 *
 * @param canvas Canvas element to draw on
 * @param landmarks Array of face landmarks
 * @param color Color for landmark dots (default: lime green)
 * @param radius Radius of landmark dots (default: 1)
 *
 * @example
 * ```typescript
 * drawLandmarks(canvasElement, detectedLandmarks, '#00ff00', 2);
 * ```
 */
export function drawLandmarks(
  canvas: HTMLCanvasElement,
  landmarks: FaceLandmark[],
  color: string = "#00ff00",
  radius: number = 1
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = color;

  for (const landmark of landmarks) {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * Draw key landmarks with labels
 *
 * Visualizes the 11 key landmarks used for face shape analysis.
 * Shows larger dots and optional labels.
 *
 * @param canvas Canvas element to draw on
 * @param keyLandmarks Key landmarks object
 * @param showLabels Whether to show landmark labels (default: false)
 *
 * @example
 * ```typescript
 * const key = extractKeyLandmarks(landmarks);
 * drawKeyLandmarks(canvasElement, key, true);
 * ```
 */
export function drawKeyLandmarks(
  canvas: HTMLCanvasElement,
  keyLandmarks: KeyLandmarks,
  showLabels: boolean = false
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const points: [string, FaceLandmark][] = [
    ["Forehead", keyLandmarks.foreheadTop],
    ["Chin", keyLandmarks.chinBottom],
    ["L Cheek", keyLandmarks.leftCheekbone],
    ["R Cheek", keyLandmarks.rightCheekbone],
    ["L Jaw", keyLandmarks.leftJaw],
    ["R Jaw", keyLandmarks.rightJaw],
    ["L Forehead", keyLandmarks.leftForehead],
    ["R Forehead", keyLandmarks.rightForehead],
    ["Nose", keyLandmarks.noseTip],
  ];

  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.font = "10px sans-serif";

  for (const [label, landmark] of points) {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;

    // Draw dot
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw label
    if (showLabels) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeText(label, x + 5, y - 5);
      ctx.fillText(label, x + 5, y - 5);
      ctx.fillStyle = "#ff0000";
      ctx.lineWidth = 2;
    }
  }
}

/**
 * Cleanup MediaPipe resources
 *
 * Call this when face detection is no longer needed.
 * Releases WASM memory and GPU resources.
 *
 * @example
 * ```typescript
 * // In component cleanup
 * useEffect(() => {
 *   return () => {
 *     cleanupFaceLandmarker();
 *   };
 * }, []);
 * ```
 */
export function cleanupFaceLandmarker(): void {
  if (faceLandmarkerInstance) {
    faceLandmarkerInstance.close();
    faceLandmarkerInstance = null;
  }
}

/**
 * Check if face is properly aligned
 *
 * Validates face orientation for optimal detection.
 * Returns true if face is frontal (not too tilted).
 *
 * @param keyLandmarks Key landmarks object
 * @param maxAngleDegrees Maximum allowed tilt angle (default: 15 degrees)
 * @returns True if face is properly aligned
 *
 * @example
 * ```typescript
 * if (!isFaceAligned(keyLandmarks)) {
 *   showWarning("Please face the camera directly");
 * }
 * ```
 */
export function isFaceAligned(
  keyLandmarks: KeyLandmarks,
  maxAngleDegrees: number = 15
): boolean {
  const angle = calculateFaceRotation(
    keyLandmarks.leftEyeOuter,
    keyLandmarks.rightEyeOuter
  );
  const degrees = Math.abs((angle * 180) / Math.PI);
  return degrees <= maxAngleDegrees;
}
