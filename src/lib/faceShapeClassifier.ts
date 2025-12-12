/**
 * Face Shape Classification Algorithm
 *
 * Analyzes facial landmarks to determine face shape category.
 * Implements decision tree from SPEC.md section 3.2 with confidence
 * scoring from section 3.3.
 *
 * Categories: Oval, Round, Square, Heart, Oblong, Diamond
 *
 * @see SPEC.md sections 3.2 and 3.3
 */

import type {
  FaceLandmark,
  FaceClassification,
  FaceShape,
  FaceMeasurements,
} from "@/types";
import {
  extractKeyLandmarks,
  calculateDistance,
  type KeyLandmarks,
} from "./faceDetection";

/**
 * Classification thresholds based on SPEC.md section 3.2
 */
const CLASSIFICATION_THRESHOLDS = {
  OVAL: {
    widthHeightRatio: { min: 0.7, max: 0.75 },
    jawCheekRatio: { min: 0.75, max: 0.85 },
  },
  ROUND: {
    widthHeightRatio: { min: 0.85, max: 1.1 },
    jawCheekRatio: { min: 0.85, max: 1.0 },
  },
  SQUARE: {
    widthHeightRatio: { min: 0.85, max: 1.0 },
    jawCheekRatio: { min: 0.9, max: 1.1 },
  },
  HEART: {
    foreheadJawRatio: { min: 1.15, max: 1.5 },
    jawCheekRatio: { max: 0.75 },
  },
  OBLONG: {
    widthHeightRatio: { max: 0.65 },
  },
  DIAMOND: {
    // Wide cheekbones, narrow forehead and jaw
    jawCheekRatio: { min: 0.7, max: 0.85 },
    foreheadCheekRatio: { max: 0.95 },
  },
} as const;

/**
 * Classify face shape based on facial landmarks
 *
 * Extracts key measurements from landmarks and applies decision tree
 * to determine the most likely face shape category.
 *
 * @param landmarks Complete array of 468 MediaPipe face landmarks
 * @param imageWidth Width of source image (for denormalization)
 * @param imageHeight Height of source image (for denormalization)
 * @returns FaceClassification with shape, confidence, reasoning, and measurements
 *
 * @throws {Error} If landmarks array is invalid
 *
 * @example
 * ```typescript
 * const classification = classifyFaceShape(landmarks, 1280, 720);
 * console.log(`Face shape: ${classification.shape} (${classification.confidence}% confident)`);
 * ```
 */
export function classifyFaceShape(
  landmarks: FaceLandmark[],
  imageWidth: number = 1,
  imageHeight: number = 1
): FaceClassification {
  // Extract key landmarks
  const keyLandmarks = extractKeyLandmarks(landmarks);

  // Calculate measurements
  const measurements = calculateFaceMeasurements(
    keyLandmarks,
    imageWidth,
    imageHeight
  );

  // Determine face shape using decision tree
  const shape = determineFaceShape(measurements);

  // Calculate confidence score
  const confidence = calculateConfidence(shape, measurements);

  // Generate reasoning
  const reasoning = generateReasoning(shape, measurements);

  return {
    shape,
    confidence,
    reasoning,
    measurements,
  };
}

/**
 * Calculate facial measurements from key landmarks
 *
 * Computes distances and ratios needed for classification:
 * - Face width (cheekbone to cheekbone)
 * - Face height (forehead to chin)
 * - Jaw width
 * - Forehead width
 * - Width-to-height ratio
 * - Jaw-to-cheek ratio
 * - Forehead-to-jaw ratio
 *
 * @param keyLandmarks Extracted key landmark points
 * @param imageWidth Width for denormalization
 * @param imageHeight Height for denormalization
 * @returns FaceMeasurements object with all ratios
 */
export function calculateFaceMeasurements(
  keyLandmarks: KeyLandmarks,
  imageWidth: number,
  imageHeight: number
): FaceMeasurements {
  // Face height: forehead top to chin bottom
  const faceHeight = calculateDistance(
    keyLandmarks.foreheadTop,
    keyLandmarks.chinBottom,
    imageWidth,
    imageHeight
  );

  // Face width: left cheekbone to right cheekbone (widest point)
  const faceWidth = calculateDistance(
    keyLandmarks.leftCheekbone,
    keyLandmarks.rightCheekbone,
    imageWidth,
    imageHeight
  );

  // Jaw width: left jaw point to right jaw point
  const jawWidth = calculateDistance(
    keyLandmarks.leftJaw,
    keyLandmarks.rightJaw,
    imageWidth,
    imageHeight
  );

  // Forehead width: left forehead to right forehead
  const foreheadWidth = calculateDistance(
    keyLandmarks.leftForehead,
    keyLandmarks.rightForehead,
    imageWidth,
    imageHeight
  );

  // Cheekbone width (same as face width - widest point)
  const cheekboneWidth = faceWidth;

  // Calculate ratios for classification
  const widthHeightRatio = faceWidth / faceHeight;
  const jawCheekRatio = jawWidth / cheekboneWidth;
  const foreheadJawRatio = foreheadWidth / jawWidth;
  const foreheadCheekRatio = foreheadWidth / cheekboneWidth;

  return {
    faceWidth,
    faceHeight,
    ratio: widthHeightRatio,
    jawWidth,
    cheekboneWidth,
    foreheadWidth,
    // Additional computed ratios
    widthHeightRatio,
    jawCheekRatio,
    foreheadJawRatio,
    foreheadCheekRatio,
  };
}

/**
 * Determine face shape using decision tree algorithm
 *
 * Implements classification logic from SPEC.md section 3.2:
 *
 * Decision Logic:
 * 1. Calculate ratios (width/height, jaw/cheek, forehead/jaw)
 * 2. Apply classification rules in order:
 *    - OVAL: ratio 0.70-0.75, balanced proportions
 *    - ROUND: ratio > 0.85, jaw ≈ cheek width
 *    - SQUARE: ratio 0.85-1.0, wide jaw (jaw/cheek > 0.90)
 *    - HEART: forehead/jaw > 1.15, narrow chin
 *    - OBLONG: ratio < 0.65, long face
 *    - DIAMOND: wide cheekbones, narrow forehead & jaw
 *
 * @param measurements Calculated face measurements
 * @returns FaceShape classification
 */
export function determineFaceShape(measurements: FaceMeasurements): FaceShape {
  const {
    widthHeightRatio = measurements.ratio,
    jawCheekRatio = measurements.jawWidth / measurements.cheekboneWidth,
    foreheadJawRatio = measurements.foreheadWidth / measurements.jawWidth,
    foreheadCheekRatio = measurements.foreheadWidth /
      measurements.cheekboneWidth,
  } = measurements;

  // OVAL: Balanced proportions, slightly longer than wide
  // Width 70-75% of height, jaw slightly narrower than cheeks
  if (
    widthHeightRatio >= CLASSIFICATION_THRESHOLDS.OVAL.widthHeightRatio.min &&
    widthHeightRatio <= CLASSIFICATION_THRESHOLDS.OVAL.widthHeightRatio.max &&
    jawCheekRatio >= CLASSIFICATION_THRESHOLDS.OVAL.jawCheekRatio.min &&
    jawCheekRatio <= CLASSIFICATION_THRESHOLDS.OVAL.jawCheekRatio.max
  ) {
    return "oval";
  }

  // ROUND: Width approximately equals height
  // Soft curves, jaw width close to cheek width
  if (
    widthHeightRatio > CLASSIFICATION_THRESHOLDS.ROUND.widthHeightRatio.min &&
    jawCheekRatio > CLASSIFICATION_THRESHOLDS.ROUND.jawCheekRatio.min
  ) {
    return "round";
  }

  // SQUARE: Wide jaw, angular features
  // Similar width and height, but with strong jawline
  if (
    widthHeightRatio >= CLASSIFICATION_THRESHOLDS.SQUARE.widthHeightRatio.min &&
    widthHeightRatio <= CLASSIFICATION_THRESHOLDS.SQUARE.widthHeightRatio.max &&
    jawCheekRatio >= CLASSIFICATION_THRESHOLDS.SQUARE.jawCheekRatio.min
  ) {
    return "square";
  }

  // HEART: Wide forehead, narrow chin
  // Forehead significantly wider than jaw
  if (
    foreheadJawRatio >= CLASSIFICATION_THRESHOLDS.HEART.foreheadJawRatio.min &&
    jawCheekRatio < CLASSIFICATION_THRESHOLDS.HEART.jawCheekRatio.max!
  ) {
    return "heart";
  }

  // OBLONG: Significantly longer than wide
  // Long face with narrow width
  if (
    widthHeightRatio < CLASSIFICATION_THRESHOLDS.OBLONG.widthHeightRatio.max!
  ) {
    return "oblong";
  }

  // DIAMOND: Wide cheekbones, narrow forehead and jaw
  // Cheekbones are the widest point
  if (
    foreheadCheekRatio! <
      CLASSIFICATION_THRESHOLDS.DIAMOND.foreheadCheekRatio.max! &&
    jawCheekRatio >= CLASSIFICATION_THRESHOLDS.DIAMOND.jawCheekRatio.min &&
    jawCheekRatio <= CLASSIFICATION_THRESHOLDS.DIAMOND.jawCheekRatio.max
  ) {
    return "diamond";
  }

  // Default fallback: OVAL (most common and versatile)
  return "oval";
}

/**
 * Calculate confidence score for classification
 *
 * Implements confidence calculation from SPEC.md section 3.3.
 * Measures how closely measurements match the ideal ranges for the classified shape.
 *
 * Scoring:
 * - 90-98: Strong match to shape characteristics
 * - 75-89: Good match with minor deviations
 * - 50-74: Weak match, borderline case
 *
 * @param shape Classified face shape
 * @param measurements Face measurements
 * @returns Confidence score (50-98)
 */
export function calculateConfidence(
  shape: FaceShape,
  measurements: FaceMeasurements
): number {
  // Ensure we have all required ratios with fallback calculations
  const widthHeightRatio = measurements.widthHeightRatio ?? measurements.ratio;
  const jawCheekRatio =
    measurements.jawCheekRatio ??
    measurements.jawWidth / measurements.cheekboneWidth;
  const foreheadJawRatio =
    measurements.foreheadJawRatio ??
    measurements.foreheadWidth / measurements.jawWidth;
  const foreheadCheekRatio =
    measurements.foreheadCheekRatio ??
    measurements.foreheadWidth / measurements.cheekboneWidth;

  let confidence = 50; // Base confidence

  switch (shape) {
    case "oval": {
      // Check width/height ratio (ideal: 0.72)
      const ratioScore = calculateRangeScore(
        widthHeightRatio,
        CLASSIFICATION_THRESHOLDS.OVAL.widthHeightRatio.min,
        CLASSIFICATION_THRESHOLDS.OVAL.widthHeightRatio.max
      );

      // Check jaw/cheek ratio (ideal: 0.80)
      const jawScore = calculateRangeScore(
        jawCheekRatio,
        CLASSIFICATION_THRESHOLDS.OVAL.jawCheekRatio.min,
        CLASSIFICATION_THRESHOLDS.OVAL.jawCheekRatio.max
      );

      confidence = 50 + ratioScore * 24 + jawScore * 24;
      break;
    }

    case "round": {
      // Width ≈ height (ratio close to 1.0)
      const ratioScore = 1 - Math.abs(widthHeightRatio - 0.95) / 0.3;

      // Jaw width close to cheek width
      const jawScore = 1 - Math.abs(jawCheekRatio - 0.92) / 0.2;

      confidence =
        50 + Math.max(0, ratioScore) * 24 + Math.max(0, jawScore) * 24;
      break;
    }

    case "square": {
      // Strong jaw (jaw/cheek close to 1.0)
      const jawScore = 1 - Math.abs(jawCheekRatio - 0.95) / 0.15;

      // Width/height in range
      const ratioScore = calculateRangeScore(
        widthHeightRatio,
        CLASSIFICATION_THRESHOLDS.SQUARE.widthHeightRatio.min,
        CLASSIFICATION_THRESHOLDS.SQUARE.widthHeightRatio.max
      );

      confidence = 50 + Math.max(0, jawScore) * 28 + ratioScore * 20;
      break;
    }

    case "heart": {
      // Wide forehead relative to jaw
      const foreheadScore =
        foreheadJawRatio > 1.15
          ? Math.min(1, (foreheadJawRatio - 1.15) / 0.35)
          : 0;

      // Narrow jaw relative to cheeks
      const jawScore = jawCheekRatio < 0.75 ? (0.75 - jawCheekRatio) / 0.15 : 0;

      confidence = 50 + foreheadScore * 28 + jawScore * 20;
      break;
    }

    case "oblong": {
      // Very low width/height ratio
      const ratioScore =
        widthHeightRatio < 0.65 ? (0.65 - widthHeightRatio) / 0.15 : 0;

      confidence = 50 + Math.min(1, ratioScore) * 48;
      break;
    }

    case "diamond": {
      // Narrow forehead
      const foreheadScore =
        foreheadCheekRatio! < 0.95 ? (0.95 - foreheadCheekRatio!) / 0.2 : 0;

      // Moderate jaw width
      const jawScore = calculateRangeScore(
        jawCheekRatio,
        CLASSIFICATION_THRESHOLDS.DIAMOND.jawCheekRatio.min,
        CLASSIFICATION_THRESHOLDS.DIAMOND.jawCheekRatio.max
      );

      confidence = 50 + Math.min(1, foreheadScore) * 24 + jawScore * 24;
      break;
    }
  }

  // Clamp to range [50, 98]
  return Math.round(Math.min(98, Math.max(50, confidence)));
}

/**
 * Calculate score for value within range
 *
 * Returns 1.0 if value is perfectly centered in range,
 * decreasing to 0.0 at the boundaries.
 *
 * @param value Measured value
 * @param min Minimum acceptable value
 * @param max Maximum acceptable value
 * @returns Score 0.0-1.0
 */
function calculateRangeScore(value: number, min: number, max: number): number {
  if (value < min || value > max) {
    // Outside range - calculate how far outside
    const distance = value < min ? min - value : value - max;
    const range = max - min;
    return Math.max(0, 1 - distance / range);
  }

  // Inside range - calculate distance from center
  const center = (min + max) / 2;
  const halfRange = (max - min) / 2;
  const distanceFromCenter = Math.abs(value - center);

  return 1 - (distanceFromCenter / halfRange) * 0.2; // Max 20% penalty for being off-center
}

/**
 * Generate human-readable reasoning for classification
 *
 * Explains why the face was classified as a particular shape
 * based on key measurements.
 *
 * @param shape Classified face shape
 * @param measurements Face measurements
 * @returns Reasoning text
 */
export function generateReasoning(
  shape: FaceShape,
  measurements: FaceMeasurements
): string {
  // Ensure we have all required ratios
  const widthHeightRatio = measurements.widthHeightRatio ?? measurements.ratio;
  const jawCheekRatio =
    measurements.jawCheekRatio ??
    measurements.jawWidth / measurements.cheekboneWidth;
  const foreheadJawRatio =
    measurements.foreheadJawRatio ??
    measurements.foreheadWidth / measurements.jawWidth;

  const reasoningMap: Record<FaceShape, string> = {
    oval: `Balanced proportions with width-to-height ratio of ${widthHeightRatio.toFixed(2)} (ideal: 0.70-0.75). The face is slightly longer than wide with gradual curves and a jaw width that's ${Math.round(jawCheekRatio * 100)}% of cheekbone width, creating harmonious proportions.`,

    round: `Nearly equal width and height with ratio of ${widthHeightRatio.toFixed(2)} (close to 1.0). Soft, curved features with jaw width at ${Math.round(jawCheekRatio * 100)}% of cheekbone width, creating a circular appearance.`,

    square: `Strong, angular features with width-to-height ratio of ${widthHeightRatio.toFixed(2)}. Prominent jawline measuring ${Math.round(jawCheekRatio * 100)}% of cheekbone width (>90%), creating defined, geometric proportions.`,

    heart: `Wide forehead tapering to narrow chin. Forehead is ${Math.round(foreheadJawRatio * 100)}% wider than jaw, with jaw width only ${Math.round(jawCheekRatio * 100)}% of cheekbone width, creating an inverted triangle shape.`,

    oblong: `Elongated face with width-to-height ratio of ${widthHeightRatio.toFixed(2)} (<0.65). The face is significantly longer than wide, creating vertical emphasis.`,

    diamond: `Prominent cheekbones with narrow forehead and jaw. Cheekbones are the widest point, with forehead and jaw both narrower, creating angular, faceted appearance.`,
  };

  return reasoningMap[shape];
}

/**
 * Get recommended adjustments for face shape
 *
 * Provides styling suggestions to balance proportions.
 *
 * @param shape Face shape
 * @returns Array of styling recommendations
 */
export function getStyleRecommendations(shape: FaceShape): string[] {
  const recommendations: Record<FaceShape, string[]> = {
    oval: [
      "Most versatile face shape - suits almost any hairstyle",
      "Can experiment with both short and long styles",
      "Center or side parts both work well",
    ],
    round: [
      "Add height and volume on top to elongate",
      "Avoid chin-length cuts that emphasize width",
      "Side parts and angular styles add definition",
    ],
    square: [
      "Soften angles with layers and waves",
      "Avoid blunt, straight cuts at jawline",
      "Side-swept styles balance strong jaw",
    ],
    heart: [
      "Add width at jawline with chin-length styles",
      "Side-swept bangs balance wide forehead",
      "Avoid excessive volume on top",
    ],
    oblong: [
      "Add width with horizontal layers",
      "Bangs shorten face appearance",
      "Avoid excessive height on top",
    ],
    diamond: [
      "Add width at forehead and chin",
      "Side-swept styles balance cheekbones",
      "Chin-length cuts add jaw width",
    ],
  };

  return recommendations[shape];
}
