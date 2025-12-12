/**
 * TypeScript interfaces and types for StyleAI
 */

// Face shape categories
export type FaceShape =
  | "oval"
  | "round"
  | "square"
  | "heart"
  | "oblong"
  | "diamond";

// MediaPipe face landmark point
export interface FaceLandmark {
  x: number;
  y: number;
  z?: number;
}

// Face measurements
export interface FaceMeasurements {
  faceWidth: number;
  faceHeight: number;
  ratio: number;
  jawWidth: number;
  cheekboneWidth: number;
  foreheadWidth: number;
}

// Face classification result
export interface FaceClassification {
  shape: FaceShape;
  confidence: number; // 0-100
  reasoning: string;
  measurements: FaceMeasurements;
}

// Hairstyle recommendation
export interface Hairstyle {
  id: string;
  name: string;
  category: FaceShape;
  imagePath: string;
  thumbnailPath: string;
  description: string;
  suitabilityScore: number; // 85-98
  reasoning: string;
  tags: string[];
}

// Application state
export interface AppState {
  step: "landing" | "capture" | "analyzing" | "results";
  capturedImage: string | null; // Base64
  landmarks: FaceLandmark[] | null;
  classification: FaceClassification | null;
  recommendations: Hairstyle[];
  selectedHairstyle: Hairstyle | null;
  isLoading: boolean;
  loadingMessage: string;
  error: AppError | null;
}

// Error types
export type ErrorCode =
  | "CAMERA_PERMISSION_DENIED"
  | "CAMERA_NOT_FOUND"
  | "CAMERA_ERROR"
  | "NO_FACE_DETECTED"
  | "MULTIPLE_FACES"
  | "POOR_LIGHTING"
  | "IMAGE_TOO_BLURRY"
  | "API_RATE_LIMITED"
  | "API_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface AppError {
  code: ErrorCode;
  message: string;
  recoverable: boolean;
  details?: string;
}

// API response types
export interface AnalyzeFaceResponse {
  success: boolean;
  data?: FaceClassification;
  error?: {
    code: string;
    message: string;
  };
}

export interface RecommendResponse {
  success: boolean;
  data?: {
    faceShape: FaceShape;
    recommendations: Hairstyle[];
  };
  error?: {
    code: string;
    message: string;
  };
}
