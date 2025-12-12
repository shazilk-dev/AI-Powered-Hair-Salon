/**
 * Face shape classification algorithm
 */

import { FaceLandmark, FaceClassification, FaceShape } from "@/types";
import { calculateDistance } from "./utils";

/**
 * Classify face shape based on landmarks
 */
export function classifyFaceShape(
  landmarks: FaceLandmark[]
): FaceClassification {
  // Get key measurements
  const measurements = calculateMeasurements(landmarks);

  // Determine face shape using decision tree
  const shape = determineShape(measurements);

  return {
    shape,
    confidence: 90, // Will be refined with actual algorithm
    reasoning: `Based on face width/height ratio of ${measurements.ratio.toFixed(2)}`,
    measurements,
  };
}

/**
 * Calculate face measurements from landmarks
 */
function calculateMeasurements(landmarks: FaceLandmark[]) {
  const foreheadTop = landmarks[10];
  const chin = landmarks[152];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];
  const leftJaw = landmarks[58];
  const rightJaw = landmarks[288];
  const leftForehead = landmarks[103];
  const rightForehead = landmarks[332];

  const faceHeight = calculateDistance(
    foreheadTop.x,
    foreheadTop.y,
    chin.x,
    chin.y
  );

  const faceWidth = calculateDistance(
    leftCheek.x,
    leftCheek.y,
    rightCheek.x,
    rightCheek.y
  );

  const jawWidth = calculateDistance(
    leftJaw.x,
    leftJaw.y,
    rightJaw.x,
    rightJaw.y
  );

  const foreheadWidth = calculateDistance(
    leftForehead.x,
    leftForehead.y,
    rightForehead.x,
    rightForehead.y
  );

  const ratio = faceWidth / faceHeight;

  return {
    faceWidth,
    faceHeight,
    ratio,
    jawWidth,
    cheekboneWidth: faceWidth,
    foreheadWidth,
  };
}

/**
 * Determine face shape using measurements
 */
function determineShape(measurements: any): FaceShape {
  const { ratio, jawWidth, cheekboneWidth, foreheadWidth } = measurements;

  // Classification rules based on CLAUDE.md
  if (ratio >= 0.7 && ratio <= 0.75) {
    return "oval";
  }

  if (ratio > 0.85) {
    // Could be round or square
    if (jawWidth / cheekboneWidth > 0.9) {
      return "square";
    }
    return "round";
  }

  if (ratio < 0.65) {
    return "oblong";
  }

  // Heart or diamond based on forehead width
  if (foreheadWidth > cheekboneWidth) {
    return "heart";
  }

  return "diamond";
}
