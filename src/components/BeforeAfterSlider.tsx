/**
 * Before/After comparison slider component
 *
 * High-performance canvas-based image comparison with:
 * - Touch and mouse drag support
 * - Keyboard navigation (Arrow keys, Home, End)
 * - 60fps smooth animation with RAF
 * - Responsive and accessible
 *
 * @see CONVENTIONS.md section 6.3 - Keyboard Navigation
 */

"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  TouchEvent,
  MouseEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  initialPosition?: number; // 0-100
  className?: string;
}

/**
 * Before/After image comparison slider with canvas rendering
 */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  initialPosition = 50,
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beforeImgRef = useRef<HTMLImageElement | null>(null);
  const afterImgRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetPositionRef = useRef(initialPosition);

  /**
   * Load images
   */
  useEffect(() => {
    const beforeImg = new Image();
    const afterImg = new Image();

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        beforeImgRef.current = beforeImg;
        afterImgRef.current = afterImg;
        setImagesLoaded(true);
      }
    };

    beforeImg.crossOrigin = "anonymous";
    afterImg.crossOrigin = "anonymous";
    beforeImg.onload = onLoad;
    afterImg.onload = onLoad;
    beforeImg.onerror = () => console.error("Failed to load before image");
    afterImg.onerror = () => console.error("Failed to load after image");
    beforeImg.src = beforeImage;
    afterImg.src = afterImage;

    return () => {
      beforeImg.onload = null;
      afterImg.onload = null;
    };
  }, [beforeImage, afterImage]);

  /**
   * Render canvas with 60fps animation
   */
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const beforeImg = beforeImgRef.current;
    const afterImg = afterImgRef.current;

    if (!canvas || !beforeImg || !afterImg || !imagesLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Smooth animation towards target position
    const diff = targetPositionRef.current - sliderPosition;
    if (Math.abs(diff) > 0.1) {
      setSliderPosition((prev) => prev + diff * 0.15);
      animationFrameRef.current = requestAnimationFrame(renderCanvas);
    } else {
      setSliderPosition(targetPositionRef.current);
    }

    const { width, height } = canvas;
    const splitX = (sliderPosition / 100) * width;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw before image (left side)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, height);
    ctx.clip();
    ctx.drawImage(beforeImg, 0, 0, width, height);
    ctx.restore();

    // Draw after image (right side)
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, width - splitX, height);
    ctx.clip();
    ctx.drawImage(afterImg, 0, 0, width, height);
    ctx.restore();

    // Draw divider line
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, height);
    ctx.stroke();
  }, [sliderPosition, imagesLoaded]);

  /**
   * Start animation loop when images are loaded
   */
  useEffect(() => {
    if (imagesLoaded) {
      renderCanvas();
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [imagesLoaded, renderCanvas]);

  /**
   * Setup canvas dimensions
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      renderCanvas();
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [renderCanvas]);

  /**
   * Update slider position from coordinates
   */
  const updatePosition = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      targetPositionRef.current = percentage;
      if (isDragging) {
        setSliderPosition(percentage); // Immediate update while dragging
      }
    },
    [isDragging]
  );

  /**
   * Mouse handlers
   */
  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        updatePosition(e.clientX);
      }
    },
    [isDragging, updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Touch handlers
   */
  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX);
      }
    },
    [updatePosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Keyboard navigation (CONVENTIONS.md section 6.3)
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          targetPositionRef.current = Math.max(0, sliderPosition - 5);
          break;

        case "ArrowRight":
          e.preventDefault();
          targetPositionRef.current = Math.min(100, sliderPosition + 5);
          break;

        case "Home":
          e.preventDefault();
          targetPositionRef.current = 0;
          break;

        case "End":
          e.preventDefault();
          targetPositionRef.current = 100;
          break;
      }
    },
    [sliderPosition]
  );

  /**
   * Global mouse up listener for drag outside
   */
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      const handleGlobalMouseMove = (e: globalThis.MouseEvent) =>
        updatePosition(e.clientX);

      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mousemove", handleGlobalMouseMove);

      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("mousemove", handleGlobalMouseMove);
      };
    }
  }, [isDragging, updatePosition]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Canvas container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Before and after comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuetext={`${Math.round(sliderPosition)}% showing after image`}
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-lg bg-muted",
          "cursor-col-resize touch-none select-none outline-none",
          "focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 flex items-center pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
          aria-hidden="true"
        >
          <div className="absolute -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg">
            <ChevronLeft className="w-4 h-4 text-gray-700 absolute left-1" />
            <ChevronRight className="w-4 h-4 text-gray-700 absolute right-1" />
          </div>
        </div>

        {/* Loading state */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-sm text-muted-foreground">
              Loading images...
            </div>
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full bg-blue-500"
            aria-hidden="true"
          />
          <span className="font-medium">Before</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">After</span>
          <div
            className="w-3 h-3 rounded-full bg-green-500"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-center text-muted-foreground">
        Drag the slider or use arrow keys to compare
      </p>
    </div>
  );
}
