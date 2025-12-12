/**
 * Hairstyle preview component
 * Renders hairstyle overlay on user photo using Canvas
 */

"use client";

import { useOverlay } from "@/hooks/useOverlay";
import { FaceLandmark, Hairstyle } from "@/types";

interface HairstylePreviewProps {
  userImage: string; // Base64
  hairstyle: Hairstyle;
  landmarks: FaceLandmark[];
}

export function HairstylePreview({
  userImage,
  hairstyle,
  landmarks,
}: HairstylePreviewProps) {
  // TODO: Load images and setup overlay
  // This will be fully implemented in Day 5

  return (
    <div className="relative">
      <canvas className="w-full rounded-lg shadow-lg" />
      <p className="mt-2 text-center text-sm text-gray-600">
        Preview: {hairstyle.name}
      </p>
    </div>
  );
}
