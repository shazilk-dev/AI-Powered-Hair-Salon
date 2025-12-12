/**
 * Custom hook for canvas overlay management
 */

import { useRef, useEffect } from "react";
import { FaceLandmark } from "@/types";
import { renderOverlay, setupHighDPICanvas } from "@/lib/overlayEngine";

export function useOverlay(
  userImage: HTMLImageElement | null,
  hairstyleImage: HTMLImageElement | null,
  landmarks: FaceLandmark[] | null
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup high DPI support
    setupHighDPICanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !userImage || !hairstyleImage || !landmarks) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Render the overlay
    renderOverlay(ctx, userImage, hairstyleImage, landmarks);
  }, [userImage, hairstyleImage, landmarks]);

  return {
    canvasRef,
  };
}
