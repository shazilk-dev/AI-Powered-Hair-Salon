/**
 * Canvas overlay engine for hairstyle preview
 */

import { FaceLandmark } from "@/types";

/**
 * Calculate position for hairstyle overlay based on face landmarks
 */
export function calculateOverlayPosition(landmarks: FaceLandmark[]) {
  const foreheadTop = landmarks[10];
  const chin = landmarks[152];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  // Calculate center point
  const centerX = (leftCheek.x + rightCheek.x) / 2;
  const centerY = (foreheadTop.y + chin.y) / 2;

  return { x: centerX, y: centerY };
}

/**
 * Calculate scale factor for hairstyle based on face width
 */
export function calculateScale(
  landmarks: FaceLandmark[],
  hairstyleWidth: number
): number {
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
  const scale = faceWidth / hairstyleWidth;

  return scale;
}

/**
 * Render hairstyle overlay on canvas
 */
export function renderOverlay(
  ctx: CanvasRenderingContext2D,
  userImage: HTMLImageElement,
  hairstyleImage: HTMLImageElement,
  landmarks: FaceLandmark[]
): void {
  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw user image
  ctx.drawImage(userImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

  // Calculate position and scale
  const position = calculateOverlayPosition(landmarks);
  const scale = calculateScale(landmarks, hairstyleImage.width);

  // Draw hairstyle overlay
  const scaledWidth = hairstyleImage.width * scale;
  const scaledHeight = hairstyleImage.height * scale;

  ctx.drawImage(
    hairstyleImage,
    position.x - scaledWidth / 2,
    position.y - scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );
}

/**
 * Handle high DPI displays
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
}
