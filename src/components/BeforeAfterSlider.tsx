/**
 * Before/After comparison slider component
 */

"use client";

import { useState } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative h-96">
        {/* Before image */}
        <div className="absolute inset-0">
          <img
            src={beforeImage}
            alt="Before"
            className="h-full w-full object-cover"
          />
        </div>

        {/* After image with clip */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={afterImage}
            alt="After"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        />
      </div>

      {/* Slider control */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="mt-4 w-full"
      />

      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>Before</span>
        <span>After</span>
      </div>
    </div>
  );
}
