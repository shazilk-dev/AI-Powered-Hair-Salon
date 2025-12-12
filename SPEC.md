# SPEC.md - Technical Specification

> Complete technical specification for the StyleAI hairstyle recommendation system.
> Reference this document for implementation details and data structures.

---

## 1. System Overview

### 1.1 Purpose

StyleAI analyzes user facial features through computer vision, classifies face shape using AI, and provides personalized hairstyle recommendations with interactive visual previews.

### 1.2 System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                           StyleAI System                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Capture    │───▶│   Analyze    │───▶│   Recommend  │          │
│  │   Module     │    │   Module     │    │   Module     │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│         │                   │                   │                   │
│         ▼                   ▼                   ▼                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   WebRTC     │    │  MediaPipe   │    │  Hairstyle   │          │
│  │   Camera     │    │  + Gemini    │    │  Database    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐          │
│  │                  Visualization Module                 │          │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │          │
│  │  │   Canvas    │  │  Before/    │  │   Export    │  │          │
│  │  │   Overlay   │  │  After      │  │   PNG       │  │          │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Types & Interfaces

### 2.1 Core Types

```typescript
// src/types/index.ts

/**
 * Six standard face shape categories
 */
export type FaceShape = 
  | 'oval' 
  | 'round' 
  | 'square' 
  | 'heart' 
  | 'oblong' 
  | 'diamond';

/**
 * Single facial landmark point from MediaPipe
 */
export interface FaceLandmark {
  x: number;  // Normalized 0-1 (left to right)
  y: number;  // Normalized 0-1 (top to bottom)
  z: number;  // Depth (negative = closer to camera)
}

/**
 * Complete face detection result
 */
export interface FaceDetectionResult {
  landmarks: FaceLandmark[];  // 468 points
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;  // 0-1
}

/**
 * Facial measurements for classification
 */
export interface FaceMeasurements {
  faceWidth: number;       // Cheekbone to cheekbone (pixels)
  faceHeight: number;      // Forehead to chin (pixels)
  jawWidth: number;        // Jaw point to jaw point (pixels)
  foreheadWidth: number;   // Forehead edge to edge (pixels)
  cheekboneWidth: number;  // Widest point of face (pixels)
  widthHeightRatio: number;
  jawCheekRatio: number;
  foreheadJawRatio: number;
}

/**
 * Face shape classification result
 */
export interface FaceClassification {
  shape: FaceShape;
  confidence: number;  // 0-100
  measurements: FaceMeasurements;
  reasoning: string;
}

/**
 * Hairstyle recommendation data
 */
export interface Hairstyle {
  id: string;
  name: string;
  category: FaceShape;
  imagePath: string;
  thumbnailPath: string;
  description: string;
  suitabilityScore: number;  // 0-100
  reasoning: string;
  tags: string[];
}

/**
 * Complete analysis result
 */
export interface AnalysisResult {
  classification: FaceClassification;
  recommendations: Hairstyle[];
  processingTime: number;  // milliseconds
  timestamp: string;       // ISO date
}

/**
 * Application state
 */
export interface AppState {
  step: 'landing' | 'capture' | 'analyzing' | 'results';
  capturedImage: string | null;
  landmarks: FaceLandmark[] | null;
  classification: FaceClassification | null;
  recommendations: Hairstyle[];
  selectedHairstyle: Hairstyle | null;
  error: AppError | null;
  isLoading: boolean;
}

/**
 * Structured error type
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  recoverable: boolean;
}

export type ErrorCode =
  | 'CAMERA_PERMISSION_DENIED'
  | 'CAMERA_NOT_FOUND'
  | 'NO_FACE_DETECTED'
  | 'MULTIPLE_FACES'
  | 'POOR_LIGHTING'
  | 'IMAGE_TOO_BLURRY'
  | 'API_RATE_LIMITED'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';
```

### 2.2 API Types

```typescript
// src/types/api.ts

/**
 * POST /api/analyze-face request
 */
export interface AnalyzeFaceRequest {
  image: string;  // Base64 encoded
  landmarks?: FaceLandmark[];  // Optional pre-detected
}

/**
 * POST /api/analyze-face response
 */
export interface AnalyzeFaceResponse {
  success: boolean;
  data?: {
    shape: FaceShape;
    confidence: number;
    reasoning: string;
    measurements: FaceMeasurements;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * GET /api/recommend response
 */
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
```

---

## 3. Face Shape Classification

### 3.1 Landmark Indices

```typescript
// Critical MediaPipe Face Mesh landmark indices
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
```

### 3.2 Classification Algorithm

```typescript
/**
 * Face shape classification decision tree
 * 
 * Input: FaceMeasurements
 * Output: FaceShape
 * 
 * Decision Logic:
 * 
 * 1. Calculate ratios:
 *    - widthHeightRatio = faceWidth / faceHeight
 *    - jawCheekRatio = jawWidth / cheekboneWidth
 *    - foreheadJawRatio = foreheadWidth / jawWidth
 * 
 * 2. Classification rules:
 * 
 *    OVAL:
 *    - widthHeightRatio: 0.70 - 0.75
 *    - jawCheekRatio: 0.75 - 0.85
 *    - Gradual curves, balanced proportions
 * 
 *    ROUND:
 *    - widthHeightRatio: > 0.85
 *    - jawCheekRatio: > 0.85
 *    - Width approximately equals height
 * 
 *    SQUARE:
 *    - widthHeightRatio: 0.85 - 1.0
 *    - jawCheekRatio: > 0.90
 *    - Angular jaw, wide forehead
 * 
 *    HEART:
 *    - foreheadJawRatio: > 1.15
 *    - Wide forehead, narrow chin
 *    - jawCheekRatio: < 0.75
 * 
 *    OBLONG:
 *    - widthHeightRatio: < 0.65
 *    - Face significantly longer than wide
 * 
 *    DIAMOND:
 *    - cheekboneWidth > foreheadWidth AND jawWidth
 *    - Prominent cheekbones
 *    - Narrow forehead and jaw
 */

export function classifyFaceShape(measurements: FaceMeasurements): FaceShape {
  const { widthHeightRatio, jawCheekRatio, foreheadJawRatio } = measurements;
  
  // Check for oblong first (most distinctive)
  if (widthHeightRatio < 0.65) {
    return 'oblong';
  }
  
  // Check for round
  if (widthHeightRatio > 0.85 && jawCheekRatio > 0.85) {
    return 'round';
  }
  
  // Check for square
  if (widthHeightRatio >= 0.85 && jawCheekRatio > 0.90) {
    return 'square';
  }
  
  // Check for heart
  if (foreheadJawRatio > 1.15 && jawCheekRatio < 0.75) {
    return 'heart';
  }
  
  // Check for diamond
  if (measurements.cheekboneWidth > measurements.foreheadWidth &&
      measurements.cheekboneWidth > measurements.jawWidth) {
    return 'diamond';
  }
  
  // Default to oval (most common, balanced)
  return 'oval';
}
```

### 3.3 Confidence Calculation

```typescript
/**
 * Calculate classification confidence based on how clearly
 * the measurements match the expected ranges for a shape.
 */
export function calculateConfidence(
  shape: FaceShape,
  measurements: FaceMeasurements
): number {
  const { widthHeightRatio, jawCheekRatio, foreheadJawRatio } = measurements;
  
  // Define ideal ranges for each shape
  const idealRanges: Record<FaceShape, { wh: [number, number]; jc: [number, number] }> = {
    oval: { wh: [0.70, 0.75], jc: [0.75, 0.85] },
    round: { wh: [0.85, 1.0], jc: [0.85, 1.0] },
    square: { wh: [0.85, 1.0], jc: [0.90, 1.0] },
    heart: { wh: [0.65, 0.80], jc: [0.60, 0.75] },
    oblong: { wh: [0.50, 0.65], jc: [0.70, 0.85] },
    diamond: { wh: [0.70, 0.85], jc: [0.65, 0.80] },
  };
  
  const range = idealRanges[shape];
  
  // Calculate how close to ideal range
  const whScore = calculateRangeScore(widthHeightRatio, range.wh);
  const jcScore = calculateRangeScore(jawCheekRatio, range.jc);
  
  // Weight and combine scores
  const confidence = (whScore * 0.6 + jcScore * 0.4) * 100;
  
  return Math.round(Math.min(98, Math.max(50, confidence)));
}

function calculateRangeScore(value: number, range: [number, number]): number {
  const [min, max] = range;
  const mid = (min + max) / 2;
  
  if (value >= min && value <= max) {
    // Within range - calculate closeness to center
    const distFromMid = Math.abs(value - mid);
    const maxDist = (max - min) / 2;
    return 1 - (distFromMid / maxDist) * 0.2;
  } else {
    // Outside range - penalize based on distance
    const dist = value < min ? min - value : value - max;
    return Math.max(0, 1 - dist * 2);
  }
}
```

---

## 4. Hairstyle Database

### 4.1 Database Structure

```typescript
// src/lib/hairstyleDatabase.ts

export const HAIRSTYLE_DATABASE: Hairstyle[] = [
  // ===== OVAL FACE =====
  {
    id: 'oval-1',
    name: 'Long Layers',
    category: 'oval',
    imagePath: '/hairstyles/oval/long-layers.png',
    thumbnailPath: '/hairstyles/oval/thumbs/long-layers.png',
    description: 'Flowing, face-framing layers that add movement and dimension. Works beautifully with oval faces by complementing natural proportions.',
    suitabilityScore: 95,
    reasoning: 'Oval faces can pull off almost any style, and long layers enhance natural symmetry.',
    tags: ['versatile', 'feminine', 'professional'],
  },
  {
    id: 'oval-2',
    name: 'Textured Crop',
    category: 'oval',
    imagePath: '/hairstyles/oval/textured-crop.png',
    thumbnailPath: '/hairstyles/oval/thumbs/textured-crop.png',
    description: 'A modern, low-maintenance cut with textured top and tapered sides. Adds personality while keeping a clean look.',
    suitabilityScore: 92,
    reasoning: 'The balanced proportions of oval faces allow for versatile shorter styles.',
    tags: ['modern', 'casual', 'low-maintenance'],
  },
  {
    id: 'oval-3',
    name: 'Classic Side Part',
    category: 'oval',
    imagePath: '/hairstyles/oval/side-part.png',
    thumbnailPath: '/hairstyles/oval/thumbs/side-part.png',
    description: 'Timeless, sophisticated side-parted style suitable for any occasion. Clean lines with natural movement.',
    suitabilityScore: 90,
    reasoning: 'A classic choice that works with oval face symmetry without overwhelming features.',
    tags: ['classic', 'professional', 'formal'],
  },
  {
    id: 'oval-4',
    name: 'Messy Quiff',
    category: 'oval',
    imagePath: '/hairstyles/oval/messy-quiff.png',
    thumbnailPath: '/hairstyles/oval/thumbs/messy-quiff.png',
    description: 'Relaxed, textured volume on top with an effortlessly styled appearance. Perfect for a casual yet put-together look.',
    suitabilityScore: 88,
    reasoning: 'Adds height and texture without disrupting the balanced oval shape.',
    tags: ['casual', 'trendy', 'youthful'],
  },
  {
    id: 'oval-5',
    name: 'Slicked Back',
    category: 'oval',
    imagePath: '/hairstyles/oval/slicked-back.png',
    thumbnailPath: '/hairstyles/oval/thumbs/slicked-back.png',
    description: 'Smooth, swept-back style that creates a polished, refined appearance. Best with medium to longer length.',
    suitabilityScore: 86,
    reasoning: 'Showcases the natural symmetry and proportions of an oval face beautifully.',
    tags: ['elegant', 'formal', 'sophisticated'],
  },

  // ===== ROUND FACE =====
  {
    id: 'round-1',
    name: 'High Fade Volume',
    category: 'round',
    imagePath: '/hairstyles/round/high-fade-volume.png',
    thumbnailPath: '/hairstyles/round/thumbs/high-fade-volume.png',
    description: 'Height-building style with a high fade on the sides. Creates the illusion of a longer face shape.',
    suitabilityScore: 96,
    reasoning: 'Adds vertical height to elongate round face appearance while keeping sides sleek.',
    tags: ['modern', 'structured', 'face-slimming'],
  },
  {
    id: 'round-2',
    name: 'Angular Fringe',
    category: 'round',
    imagePath: '/hairstyles/round/angular-fringe.png',
    thumbnailPath: '/hairstyles/round/thumbs/angular-fringe.png',
    description: 'Asymmetrical fringe that creates angles and dimension. Adds structure to softer facial features.',
    suitabilityScore: 93,
    reasoning: 'Diagonal lines break up roundness and create the appearance of angles.',
    tags: ['edgy', 'modern', 'angular'],
  },
  {
    id: 'round-3',
    name: 'Pompadour',
    category: 'round',
    imagePath: '/hairstyles/round/pompadour.png',
    thumbnailPath: '/hairstyles/round/thumbs/pompadour.png',
    description: 'Classic volume style with height at the front. A bold choice that transforms face proportions.',
    suitabilityScore: 91,
    reasoning: 'Significant height on top elongates the face and adds dramatic proportions.',
    tags: ['bold', 'classic', 'statement'],
  },
  {
    id: 'round-4',
    name: 'Undercut',
    category: 'round',
    imagePath: '/hairstyles/round/undercut.png',
    thumbnailPath: '/hairstyles/round/thumbs/undercut.png',
    description: 'Dramatic contrast between longer top and closely-shaved sides. Creates strong visual lines.',
    suitabilityScore: 89,
    reasoning: 'The contrast and clean sides help define facial structure against soft curves.',
    tags: ['bold', 'modern', 'contrast'],
  },
  {
    id: 'round-5',
    name: 'Textured Crop',
    category: 'round',
    imagePath: '/hairstyles/round/textured-crop.png',
    thumbnailPath: '/hairstyles/round/thumbs/textured-crop.png',
    description: 'Textured movement on top with clean sides. Adds interest without bulk on sides.',
    suitabilityScore: 87,
    reasoning: 'Keeps sides minimal while adding textured height to create vertical emphasis.',
    tags: ['trendy', 'textured', 'low-maintenance'],
  },

  // ===== SQUARE FACE =====
  {
    id: 'square-1',
    name: 'Soft Waves',
    category: 'square',
    imagePath: '/hairstyles/square/soft-waves.png',
    thumbnailPath: '/hairstyles/square/thumbs/soft-waves.png',
    description: 'Flowing waves that soften angular features. Creates movement and reduces harsh lines.',
    suitabilityScore: 95,
    reasoning: 'Curved lines contrast with and soften the angular jaw and forehead.',
    tags: ['soft', 'romantic', 'feminine'],
  },
  {
    id: 'square-2',
    name: 'Layered Fringe',
    category: 'square',
    imagePath: '/hairstyles/square/layered-fringe.png',
    thumbnailPath: '/hairstyles/square/thumbs/layered-fringe.png',
    description: 'Layered bangs that sweep across the forehead. Reduces the appearance of a wide forehead.',
    suitabilityScore: 92,
    reasoning: 'Breaks up the strong horizontal line of the forehead with soft layers.',
    tags: ['soft', 'face-framing', 'versatile'],
  },
  {
    id: 'square-3',
    name: 'Textured Brush Up',
    category: 'square',
    imagePath: '/hairstyles/square/textured-brush-up.png',
    thumbnailPath: '/hairstyles/square/thumbs/textured-brush-up.png',
    description: 'Textured top brushed upward and back. Adds height without accentuating width.',
    suitabilityScore: 89,
    reasoning: 'Vertical lift draws attention upward away from the strong jawline.',
    tags: ['modern', 'textured', 'height'],
  },
  {
    id: 'square-4',
    name: 'Medium Layers',
    category: 'square',
    imagePath: '/hairstyles/square/medium-layers.png',
    thumbnailPath: '/hairstyles/square/thumbs/medium-layers.png',
    description: 'Shoulder-length layers that frame the face. Versatile for professional and casual settings.',
    suitabilityScore: 88,
    reasoning: 'Layers add movement and soften the angular jaw structure.',
    tags: ['professional', 'versatile', 'layered'],
  },
  {
    id: 'square-5',
    name: 'Soft Side Part',
    category: 'square',
    imagePath: '/hairstyles/square/soft-side-part.png',
    thumbnailPath: '/hairstyles/square/thumbs/soft-side-part.png',
    description: 'Gentle side part with soft styling. Creates asymmetry to balance strong features.',
    suitabilityScore: 86,
    reasoning: 'Asymmetrical styling breaks up the symmetry of a square face.',
    tags: ['classic', 'soft', 'professional'],
  },

  // ===== HEART FACE =====
  {
    id: 'heart-1',
    name: 'Full Fringe',
    category: 'heart',
    imagePath: '/hairstyles/heart/full-fringe.png',
    thumbnailPath: '/hairstyles/heart/thumbs/full-fringe.png',
    description: 'Full bangs that cover the forehead. Creates balance by reducing forehead prominence.',
    suitabilityScore: 96,
    reasoning: 'Minimizes the appearance of a wider forehead while framing the face.',
    tags: ['balancing', 'bangs', 'face-framing'],
  },
  {
    id: 'heart-2',
    name: 'Chin-Length Bob',
    category: 'heart',
    imagePath: '/hairstyles/heart/chin-bob.png',
    thumbnailPath: '/hairstyles/heart/thumbs/chin-bob.png',
    description: 'Classic bob that ends at the chin. Adds width at the jawline for balance.',
    suitabilityScore: 94,
    reasoning: 'The volume at chin level balances the wider forehead.',
    tags: ['classic', 'balancing', 'chic'],
  },
  {
    id: 'heart-3',
    name: 'Side-Swept Waves',
    category: 'heart',
    imagePath: '/hairstyles/heart/side-waves.png',
    thumbnailPath: '/hairstyles/heart/thumbs/side-waves.png',
    description: 'Waves that sweep to one side. Creates volume at the lower face while minimizing forehead.',
    suitabilityScore: 91,
    reasoning: 'Asymmetry draws attention from forehead while waves add jaw-level fullness.',
    tags: ['romantic', 'feminine', 'asymmetrical'],
  },
  {
    id: 'heart-4',
    name: 'Textured Crop',
    category: 'heart',
    imagePath: '/hairstyles/heart/textured-crop.png',
    thumbnailPath: '/hairstyles/heart/thumbs/textured-crop.png',
    description: 'Short, textured style with fringe. Modern and low-maintenance with balancing effect.',
    suitabilityScore: 88,
    reasoning: 'Textured fringe softens the forehead while keeping a modern look.',
    tags: ['modern', 'textured', 'short'],
  },
  {
    id: 'heart-5',
    name: 'Medium Layers',
    category: 'heart',
    imagePath: '/hairstyles/heart/medium-layers.png',
    thumbnailPath: '/hairstyles/heart/thumbs/medium-layers.png',
    description: 'Layered style with volume concentrated at jaw level. Balances face proportions.',
    suitabilityScore: 87,
    reasoning: 'Layers add width at the narrower chin area for better proportion.',
    tags: ['layered', 'versatile', 'balancing'],
  },

  // ===== OBLONG FACE =====
  {
    id: 'oblong-1',
    name: 'Horizontal Layers',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/horizontal-layers.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/horizontal-layers.png',
    description: 'Layers that add width to the sides. Creates the illusion of a wider, shorter face.',
    suitabilityScore: 95,
    reasoning: 'Side volume counteracts the length of an oblong face.',
    tags: ['width-adding', 'layered', 'balancing'],
  },
  {
    id: 'oblong-2',
    name: 'Full Fringe',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/full-fringe.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/full-fringe.png',
    description: 'Thick bangs that visually shorten the face. Covers forehead to reduce length appearance.',
    suitabilityScore: 93,
    reasoning: 'Bangs create a horizontal line that visually shortens the face.',
    tags: ['bangs', 'face-shortening', 'bold'],
  },
  {
    id: 'oblong-3',
    name: 'Chin-Length Blunt',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/chin-blunt.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/chin-blunt.png',
    description: 'Blunt cut at chin level with volume. Adds width and creates a more balanced proportion.',
    suitabilityScore: 90,
    reasoning: 'The horizontal blunt line adds visual width and stops vertical eye movement.',
    tags: ['blunt', 'structured', 'width-adding'],
  },
  {
    id: 'oblong-4',
    name: 'Side-Swept Bangs',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/side-bangs.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/side-bangs.png',
    description: 'Angled bangs that sweep across the forehead. Softens the face length while adding style.',
    suitabilityScore: 88,
    reasoning: 'Diagonal lines across the forehead help break up the vertical length.',
    tags: ['soft', 'angled', 'feminine'],
  },
  {
    id: 'oblong-5',
    name: 'Volume Crop',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/volume-crop.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/volume-crop.png',
    description: 'Short style with side volume. Keeps proportions balanced with width at the sides.',
    suitabilityScore: 86,
    reasoning: 'Side volume creates width to balance the longer face shape.',
    tags: ['short', 'voluminous', 'modern'],
  },

  // ===== DIAMOND FACE =====
  {
    id: 'diamond-1',
    name: 'Side-Swept Fringe',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/side-fringe.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/side-fringe.png',
    description: 'Soft fringe swept to the side. Adds width to the narrow forehead area.',
    suitabilityScore: 95,
    reasoning: 'Side fringe creates volume at the forehead to balance prominent cheekbones.',
    tags: ['balancing', 'soft', 'face-framing'],
  },
  {
    id: 'diamond-2',
    name: 'Chin-Length Layers',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/chin-layers.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/chin-layers.png',
    description: 'Layers that add width at the chin. Balances the narrow jaw against wide cheekbones.',
    suitabilityScore: 93,
    reasoning: 'Fullness at chin level creates balance with the widest point at cheekbones.',
    tags: ['layered', 'balancing', 'feminine'],
  },
  {
    id: 'diamond-3',
    name: 'Textured Quiff',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/textured-quiff.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/textured-quiff.png',
    description: 'Volume on top with textured styling. Adds width at the forehead area.',
    suitabilityScore: 90,
    reasoning: 'Top volume balances the narrow forehead against prominent cheekbones.',
    tags: ['modern', 'voluminous', 'textured'],
  },
  {
    id: 'diamond-4',
    name: 'Full Beard Combo',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/beard-combo.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/beard-combo.png',
    description: 'Hairstyle paired with a fuller beard. The beard adds width at the narrow jaw.',
    suitabilityScore: 88,
    reasoning: 'A fuller beard adds crucial width to the narrow jawline for balance.',
    tags: ['masculine', 'balanced', 'complete-look'],
  },
  {
    id: 'diamond-5',
    name: 'Slicked Side Part',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/slick-side.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/slick-side.png',
    description: 'Smooth, side-parted style with volume. Creates a polished look with forehead width.',
    suitabilityScore: 86,
    reasoning: 'The volume at the part adds width to the forehead while maintaining elegance.',
    tags: ['elegant', 'professional', 'smooth'],
  },
];

// Helper functions
export function getHairstylesByShape(shape: FaceShape): Hairstyle[] {
  return HAIRSTYLE_DATABASE
    .filter(h => h.category === shape)
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

export function getHairstyleById(id: string): Hairstyle | undefined {
  return HAIRSTYLE_DATABASE.find(h => h.id === id);
}
```

---

## 5. Canvas Overlay Specification

### 5.1 Positioning Algorithm

```typescript
/**
 * Calculate hairstyle overlay position from landmarks
 * 
 * @param landmarks - 468 MediaPipe landmarks
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns Position and dimensions for hairstyle overlay
 */
export interface OverlayPosition {
  x: number;       // Left edge X coordinate
  y: number;       // Top edge Y coordinate
  width: number;   // Scaled width
  height: number;  // Scaled height
  rotation: number; // Rotation in radians
}

export function calculateOverlayPosition(
  landmarks: FaceLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  templateAspectRatio: number  // height / width
): OverlayPosition {
  // Get key landmark positions
  const foreheadTop = landmarks[LANDMARK_INDICES.FOREHEAD_TOP];
  const leftTemple = landmarks[LANDMARK_INDICES.LEFT_CHEEKBONE];
  const rightTemple = landmarks[LANDMARK_INDICES.RIGHT_CHEEKBONE];
  const leftEye = landmarks[LANDMARK_INDICES.LEFT_EYE_OUTER];
  const rightEye = landmarks[LANDMARK_INDICES.RIGHT_EYE_OUTER];

  // Calculate face width in pixels
  const faceWidth = Math.abs(rightTemple.x - leftTemple.x) * canvasWidth;
  
  // Hairstyle should be ~130% of face width for natural coverage
  const overlayWidth = faceWidth * 1.3;
  const overlayHeight = overlayWidth * templateAspectRatio;

  // Calculate center X position
  const centerX = ((leftTemple.x + rightTemple.x) / 2) * canvasWidth;
  
  // Calculate top Y position (above forehead)
  const foreheadY = foreheadTop.y * canvasHeight;
  const topY = foreheadY - (overlayHeight * 0.35); // 35% above forehead

  // Calculate rotation from eye line
  const eyeDeltaY = (rightEye.y - leftEye.y) * canvasHeight;
  const eyeDeltaX = (rightEye.x - leftEye.x) * canvasWidth;
  const rotation = Math.atan2(eyeDeltaY, eyeDeltaX);

  return {
    x: centerX - (overlayWidth / 2),
    y: topY,
    width: overlayWidth,
    height: overlayHeight,
    rotation: rotation,
  };
}
```

### 5.2 Rendering Pipeline

```typescript
/**
 * Complete rendering pipeline for hairstyle preview
 */
export async function renderPreview(
  canvas: HTMLCanvasElement,
  userImageSrc: string,
  hairstyleImageSrc: string,
  landmarks: FaceLandmark[]
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Handle high DPI displays
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.scale(dpr, dpr);

  // Load images
  const [userImage, hairstyleImage] = await Promise.all([
    loadImage(userImageSrc),
    loadImage(hairstyleImageSrc),
  ]);

  // Draw user image
  ctx.drawImage(userImage, 0, 0, displayWidth, displayHeight);

  // Calculate overlay position
  const templateAspectRatio = hairstyleImage.height / hairstyleImage.width;
  const position = calculateOverlayPosition(
    landmarks,
    displayWidth,
    displayHeight,
    templateAspectRatio
  );

  // Apply rotation and draw hairstyle
  ctx.save();
  ctx.translate(position.x + position.width / 2, position.y + position.height / 2);
  ctx.rotate(position.rotation);
  ctx.drawImage(
    hairstyleImage,
    -position.width / 2,
    -position.height / 2,
    position.width,
    position.height
  );
  ctx.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
```

---

## 6. Error Handling Specification

### 6.1 Error Codes and Messages

```typescript
export const ERROR_MESSAGES: Record<ErrorCode, { title: string; message: string; action: string }> = {
  CAMERA_PERMISSION_DENIED: {
    title: 'Camera Access Needed',
    message: 'Please allow camera access to take a photo for analysis.',
    action: 'Check your browser settings and try again.',
  },
  CAMERA_NOT_FOUND: {
    title: 'No Camera Found',
    message: 'We couldn\'t detect a camera on your device.',
    action: 'Try uploading a photo instead.',
  },
  NO_FACE_DETECTED: {
    title: 'No Face Detected',
    message: 'We couldn\'t find a face in your photo.',
    action: 'Make sure your face is clearly visible and well-lit.',
  },
  MULTIPLE_FACES: {
    title: 'Multiple Faces Found',
    message: 'Please use a photo with only one person.',
    action: 'Take a new photo with just yourself.',
  },
  POOR_LIGHTING: {
    title: 'Lighting Too Dark',
    message: 'The photo is too dark for accurate analysis.',
    action: 'Move to a brighter area and try again.',
  },
  IMAGE_TOO_BLURRY: {
    title: 'Image Too Blurry',
    message: 'The photo is too blurry to analyze.',
    action: 'Hold still and ensure the camera is focused.',
  },
  API_RATE_LIMITED: {
    title: 'Service Busy',
    message: 'Our AI service is experiencing high demand.',
    action: 'Please wait a moment and try again.',
  },
  API_ERROR: {
    title: 'Analysis Failed',
    message: 'Something went wrong during analysis.',
    action: 'Please try again. If the problem persists, try a different photo.',
  },
  NETWORK_ERROR: {
    title: 'Connection Problem',
    message: 'Unable to connect to our servers.',
    action: 'Check your internet connection and try again.',
  },
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred.',
    action: 'Please refresh the page and try again.',
  },
};
```

---

## 7. Performance Specifications

### 7.1 Timing Requirements

| Operation | Target | Maximum |
|-----------|--------|---------|
| Initial page load | 2s | 3s |
| Camera initialization | 1s | 2s |
| Face detection (per frame) | 33ms | 50ms |
| Face classification | 500ms | 2s |
| Gemini API call | 1s | 5s |
| Hairstyle overlay render | 100ms | 500ms |
| Style switch preview | 200ms | 500ms |
| Image export | 500ms | 2s |
| **Total workflow** | **15s** | **30s** |

### 7.2 Resource Limits

| Resource | Limit |
|----------|-------|
| Initial bundle size | < 300KB |
| Total page weight | < 2MB |
| Hairstyle template size | < 500KB each |
| Maximum image upload | 5MB |
| Canvas resolution | 1920×1920 max |
| Memory usage | < 100MB |

---

*End of Technical Specification*
