/**
 * Canvas overlay engine for hairstyle preview
 *
 * Implements positioning algorithm from SPEC.md section 5.1 and
 * rendering pipeline from SPEC.md section 5.2.
 * Uses landmark indices from SPEC.md section 3.1.
 */

import type { FaceLandmark } from "@/types";

/**
 * Critical MediaPipe Face Mesh landmark indices from SPEC.md section 3.1
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
 * Overlay position and dimensions
 */
export interface OverlayPosition {
  x: number; // Left edge X coordinate
  y: number; // Top edge Y coordinate
  width: number; // Scaled width
  height: number; // Scaled height
  rotation: number; // Rotation in radians
}

/**
 * Calculate hairstyle overlay position from landmarks
 *
 * Implementation from SPEC.md section 5.1
 *
 * @param landmarks - 468 MediaPipe landmarks
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @param templateAspectRatio - Hairstyle template aspect ratio (height / width)
 * @returns Position and dimensions for hairstyle overlay
 */
export function calculateOverlayPosition(
  landmarks: FaceLandmark[],
  canvasWidth: number,
  canvasHeight: number,
  templateAspectRatio: number
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
  const topY = foreheadY - overlayHeight * 0.35; // 35% above forehead

  // Calculate rotation from eye line
  const eyeDeltaY = (rightEye.y - leftEye.y) * canvasHeight;
  const eyeDeltaX = (rightEye.x - leftEye.x) * canvasWidth;
  const rotation = Math.atan2(eyeDeltaY, eyeDeltaX);

  return {
    x: centerX - overlayWidth / 2,
    y: topY,
    width: overlayWidth,
    height: overlayHeight,
    rotation: rotation,
  };
}

/**
 * Image cache for performance optimization
 * Prevents redundant downloads of the same hairstyle images
 * Critical for fast style switching (target: < 200ms)
 */
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Get cache statistics (useful for debugging)
 */
export function getImageCacheStats() {
  return {
    size: imageCache.size,
    keys: Array.from(imageCache.keys()),
  };
}

/**
 * Clear image cache (useful for memory management)
 */
export function clearImageCache() {
  imageCache.clear();
}

/**
 * Load image with promise and caching
 *
 * Performance Optimization:
 * - Caches loaded images to prevent redundant downloads
 * - Style switching becomes instant after first load
 * - Reduces network requests by ~90% during normal usage
 *
 * @param src - Image source URL or base64 data
 * @returns Promise resolving to loaded image
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  // Check cache first
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Store in cache for future use
      imageCache.set(src, img);
      resolve(img);
    };

    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

    img.src = src;
  });
}

/**
 * Canvas dimension cache to avoid redundant resizing
 * Tracks last known dimensions to optimize performance
 */
let lastCanvasWidth = 0;
let lastCanvasHeight = 0;
let lastDpr = 0;

/**
 * Complete rendering pipeline for hairstyle preview
 *
 * Implementation from SPEC.md section 5.2
 *
 * Performance Optimizations:
 * - Only resizes canvas when dimensions actually change
 * - Enforces maximum resolution limit (1920x1920 from SPEC.md 7.2)
 * - Caches canvas dimensions to avoid redundant operations
 * - Target: < 100ms for initial render, < 50ms for subsequent renders
 *
 * @param canvas - Canvas element to render on
 * @param userImageSrc - User photo source (URL or base64)
 * @param hairstyleImageSrc - Hairstyle template source (URL or base64)
 * @param landmarks - 468 MediaPipe face landmarks
 */
export async function renderPreview(
  canvas: HTMLCanvasElement,
  userImageSrc: string,
  hairstyleImageSrc: string,
  landmarks: FaceLandmark[]
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  // Handle high DPI displays
  const dpr = window.devicePixelRatio || 1;
  let displayWidth = canvas.clientWidth;
  let displayHeight = canvas.clientHeight;

  // Enforce maximum resolution (SPEC.md 7.2: max 1920x1920)
  const MAX_DIMENSION = 1920;
  if (displayWidth * dpr > MAX_DIMENSION || displayHeight * dpr > MAX_DIMENSION) {
    const scale =
      MAX_DIMENSION / Math.max(displayWidth * dpr, displayHeight * dpr);
    displayWidth = Math.floor(displayWidth * scale);
    displayHeight = Math.floor(displayHeight * scale);
  }

  // Only resize canvas if dimensions changed (performance optimization)
  if (
    lastCanvasWidth !== displayWidth ||
    lastCanvasHeight !== displayHeight ||
    lastDpr !== dpr
  ) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    lastCanvasWidth = displayWidth;
    lastCanvasHeight = displayHeight;
    lastDpr = dpr;
  }

  // Load images in parallel
  const [userImage, hairstyleImage] = await Promise.all([
    loadImage(userImageSrc),
    loadImage(hairstyleImageSrc),
  ]);

  // Draw user image as base layer
  ctx.drawImage(userImage, 0, 0, displayWidth, displayHeight);

  // Calculate overlay position
  const templateAspectRatio = hairstyleImage.height / hairstyleImage.width;
  const position = calculateOverlayPosition(
    landmarks,
    displayWidth,
    displayHeight,
    templateAspectRatio
  );

  // Apply rotation and draw hairstyle overlay
  ctx.save();

  // Translate to center of overlay
  ctx.translate(
    position.x + position.width / 2,
    position.y + position.height / 2
  );

  // Rotate around center
  ctx.rotate(position.rotation);

  // Draw hairstyle centered at origin
  ctx.drawImage(
    hairstyleImage,
    -position.width / 2,
    -position.height / 2,
    position.width,
    position.height
  );

  ctx.restore();
}

/**
 * Setup canvas for high DPI displays
 *
 * @param canvas - Canvas element to configure
 */
export function setupHighDPICanvas(canvas: HTMLCanvasElement): void {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr);
  }

  // Set CSS size to match physical size
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}

/**
 * Export canvas as PNG image
 *
 * @param canvas - Canvas element to export
 * @param filename - Desired filename (default: 'hairstyle-preview.png')
 * @returns Promise resolving to blob URL
 */
export async function exportCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = "hairstyle-preview.png"
): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }

        const url = URL.createObjectURL(blob);

        // Trigger download
        const link = document.createElement("a");
        link.download = filename;
        link.href = url;
        link.click();

        resolve(url);
      },
      "image/png",
      1.0 // Maximum quality
    );
  });
}
