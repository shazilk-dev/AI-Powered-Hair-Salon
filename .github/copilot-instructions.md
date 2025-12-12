# GitHub Copilot Instructions

> Custom instructions for GitHub Copilot when working on the StyleAI project.
> Place this file at `.github/copilot-instructions.md` in your repository.

## Project Context

This is **StyleAI**, an AI-powered hairstyle recommendation system built as an HCI course project.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui, MediaPipe, Google Gemini API

**Timeline:** 7 days | **Budget:** $0 | **Developer:** Solo

## Code Generation Rules

### TypeScript

```typescript
// ✅ ALWAYS use strict TypeScript
// ✅ ALWAYS define interfaces for props and state
// ✅ ALWAYS use proper return types on functions
// ✅ NEVER use 'any' type - use 'unknown' if truly unknown

// Good
interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onError: (error: Error) => void;
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps): JSX.Element {
  // ...
}

// Bad
export function CameraCapture(props: any) {
  // ...
}
```

### React Components

```typescript
// ✅ Use functional components with hooks
// ✅ Use 'use client' directive for client components
// ✅ Destructure props in function signature
// ✅ Export named functions, not default anonymous
// ✅ Include proper accessibility attributes

'use client';

import { useState, useCallback } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  onClick, 
  children, 
  disabled = false,
  variant = 'primary' 
}: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Tailwind CSS

```typescript
// ✅ Use Tailwind utility classes
// ✅ Use cn() helper for conditional classes
// ✅ Follow mobile-first responsive design
// ✅ Use design system values (not arbitrary)

// Good
<div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 lg:p-8">

// Bad - arbitrary values
<div className="flex flex-col gap-[17px] p-[13px]">

// Good - conditional classes
<div className={cn(
  'rounded-lg border p-4',
  isSelected && 'border-blue-500 bg-blue-50',
  isDisabled && 'opacity-50'
)}>
```

### File Naming

```
✅ Components: PascalCase.tsx (CameraCapture.tsx)
✅ Hooks: camelCase with use prefix (useFaceDetection.ts)
✅ Utilities: camelCase.ts (faceShapeClassifier.ts)
✅ Types: index.ts in types/ folder
✅ API Routes: route.ts in folder (api/analyze-face/route.ts)
```

### Import Order

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import Image from 'next/image';

// 2. Third-party libraries
import { Camera } from 'lucide-react';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { HairstyleGallery } from '@/components/HairstyleGallery';

// 4. Internal utilities
import { classifyFaceShape } from '@/lib/faceShapeClassifier';
import { cn } from '@/lib/utils';

// 5. Types
import type { FaceShape, Hairstyle } from '@/types';
```

### Error Handling

```typescript
// ✅ ALWAYS wrap async operations in try-catch
// ✅ ALWAYS provide user-friendly error messages
// ✅ ALWAYS include recovery options

async function analyzeFace(image: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze-face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Log for debugging
    console.error('Face analysis error:', error);
    
    // Throw user-friendly error
    throw new Error(
      'Unable to analyze your photo. Please try again or use a different image.'
    );
  }
}
```

### Accessibility

```typescript
// ✅ ALWAYS include ARIA labels on interactive elements
// ✅ ALWAYS ensure keyboard navigation works
// ✅ ALWAYS maintain focus management

<button
  onClick={handleCapture}
  aria-label="Capture photo"
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <Camera className="w-6 h-6" aria-hidden="true" />
  <span>Capture</span>
</button>

// For images
<Image
  src={hairstyle.imagePath}
  alt={`${hairstyle.name} hairstyle preview`}
  width={200}
  height={250}
/>
```

### State Management

```typescript
// ✅ Use React useState for local state
// ✅ Use React Context for shared state (if needed)
// ✅ NEVER use external state libraries (Redux, Zustand)

// Local component state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [selectedStyle, setSelectedStyle] = useState<Hairstyle | null>(null);

// For complex state, use useReducer
type State = {
  step: 'capture' | 'analyzing' | 'results';
  image: string | null;
  faceShape: FaceShape | null;
  selectedHairstyle: Hairstyle | null;
};

type Action = 
  | { type: 'CAPTURE_IMAGE'; payload: string }
  | { type: 'SET_FACE_SHAPE'; payload: FaceShape }
  | { type: 'SELECT_HAIRSTYLE'; payload: Hairstyle }
  | { type: 'RESET' };
```

### API Routes (Next.js)

```typescript
// ✅ Use Next.js 14 App Router API routes
// ✅ Include proper HTTP status codes
// ✅ Validate input data
// ✅ Handle rate limiting

// app/api/analyze-face/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Image is required' } },
        { status: 400 }
      );
    }

    // Process...
    const result = await analyzeWithGemini(body.image);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Analysis failed' } },
      { status: 500 }
    );
  }
}
```

### Comments and Documentation

```typescript
// ✅ Use JSDoc for functions
// ✅ Explain WHY, not WHAT
// ✅ Document complex algorithms

/**
 * Classifies face shape based on facial landmark measurements.
 * Uses width-to-height ratios and jaw-to-cheekbone proportions.
 * 
 * @param landmarks - Array of 468 MediaPipe face landmarks
 * @returns Classification result with shape and confidence score
 * 
 * @example
 * const result = classifyFaceShape(landmarks);
 * // { shape: 'oval', confidence: 0.87 }
 */
export function classifyFaceShape(landmarks: FaceLandmark[]): ClassificationResult {
  // Calculate face width using cheekbone landmarks (234 and 454)
  // These points provide the most reliable width measurement
  const faceWidth = calculateDistance(
    landmarks[234], 
    landmarks[454]
  );
  
  // ...
}
```

## Domain-Specific Patterns

### Face Detection Hook

```typescript
// Pattern for MediaPipe integration
export function useFaceDetection(videoRef: RefObject<HTMLVideoElement>) {
  const [landmarks, setLandmarks] = useState<FaceLandmark[] | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker | null = null;
    let animationId: number;

    async function initializeDetector() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
        );
        
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        });

        detectFaces();
      } catch (err) {
        setError('Failed to initialize face detection');
      }
    }

    function detectFaces() {
      // Detection loop...
    }

    initializeDetector();

    return () => {
      cancelAnimationFrame(animationId);
      faceLandmarker?.close();
    };
  }, [videoRef]);

  return { landmarks, isDetecting, error };
}
```

### Canvas Overlay Pattern

```typescript
// Pattern for hairstyle overlay rendering
export function renderHairstyleOverlay(
  ctx: CanvasRenderingContext2D,
  userImage: HTMLImageElement,
  hairstyleImage: HTMLImageElement,
  landmarks: FaceLandmark[]
): void {
  const { width, height } = ctx.canvas;
  
  // Draw user image as base
  ctx.drawImage(userImage, 0, 0, width, height);

  // Calculate hairstyle position from landmarks
  const foreheadTop = landmarks[10];
  const leftTemple = landmarks[234];
  const rightTemple = landmarks[454];

  const faceWidth = Math.abs(rightTemple.x - leftTemple.x) * width;
  const hairstyleWidth = faceWidth * 1.3;
  const hairstyleHeight = hairstyleWidth * (hairstyleImage.height / hairstyleImage.width);

  const centerX = ((leftTemple.x + rightTemple.x) / 2) * width;
  const topY = foreheadTop.y * height - hairstyleHeight * 0.3;

  // Draw hairstyle overlay
  ctx.drawImage(
    hairstyleImage,
    centerX - hairstyleWidth / 2,
    topY,
    hairstyleWidth,
    hairstyleHeight
  );
}
```

## Things to Remember

1. **This is a 7-day project** - Keep solutions simple
2. **Zero budget** - Only free tier services
3. **HCI focus** - Every UI element should be intentional
4. **Mobile first** - Test on small screens
5. **Accessibility matters** - It's an academic requirement
6. **Error handling everywhere** - Users shouldn't see crashes

## Avoid These Patterns

```typescript
// ❌ Don't use 'any'
const data: any = response.json();

// ❌ Don't use inline styles
<div style={{ padding: '20px' }}>

// ❌ Don't forget loading states
const [data] = useState(fetchData()); // Missing loading

// ❌ Don't ignore errors
fetch('/api').then(res => res.json()); // No catch

// ❌ Don't use class components
class MyComponent extends React.Component {}

// ❌ Don't hardcode values
<div className="w-[347px]"> // Use design system

// ❌ Don't forget accessibility
<div onClick={handleClick}> // Use button
```

## Quick Reference

| Pattern | Example |
|---------|---------|
| Component file | `HairstyleGallery.tsx` |
| Hook file | `useFaceDetection.ts` |
| Utility file | `faceShapeClassifier.ts` |
| API route | `api/analyze-face/route.ts` |
| Type import | `import type { X } from '@/types'` |
| Conditional class | `cn('base', condition && 'active')` |
| Async handler | `try { await fn() } catch { setError() }` |

---

*These instructions help Copilot generate code consistent with the project's patterns and requirements.*
