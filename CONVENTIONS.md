# CONVENTIONS.md - Coding Standards & Patterns

> Coding conventions, naming standards, and patterns for the StyleAI project.
> Follow these guidelines for consistency across the codebase.

---

## 1. File Organization

### 1.1 File Naming

```
✅ Components:     PascalCase.tsx      (HairstyleGallery.tsx)
✅ Hooks:          camelCase.ts        (useFaceDetection.ts)
✅ Utilities:      camelCase.ts        (faceShapeClassifier.ts)
✅ Types:          camelCase.ts        (index.ts in types/)
✅ API Routes:     route.ts            (in folder structure)
✅ Constants:      SCREAMING_SNAKE.ts  (if standalone file)
✅ Test files:     *.test.ts(x)        (ComponentName.test.tsx)
```

### 1.2 Import Order

Always organize imports in this order, with blank lines between groups:

```typescript
// 1. React and Next.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 2. Third-party libraries
import { Camera, Download, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 3. Internal components (absolute imports)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HairstyleGallery } from '@/components/HairstyleGallery';

// 4. Internal utilities and hooks
import { classifyFaceShape } from '@/lib/faceShapeClassifier';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { cn } from '@/lib/utils';

// 5. Types (use 'import type' when possible)
import type { FaceShape, Hairstyle, AppError } from '@/types';

// 6. Styles (if any CSS modules)
import styles from './Component.module.css';
```

### 1.3 Export Style

```typescript
// ✅ Named exports for components
export function HairstyleGallery({ ... }: Props) { ... }

// ✅ Named exports for utilities
export function classifyFaceShape(landmarks: FaceLandmark[]): FaceShape { ... }

// ✅ Named exports for hooks
export function useFaceDetection() { ... }

// ✅ Named exports for types
export interface Hairstyle { ... }
export type FaceShape = 'oval' | 'round' | ...;

// ❌ Avoid default exports (except for pages)
export default function Page() { ... }  // Only for Next.js pages
```

---

## 2. TypeScript Standards

### 2.1 Type Definitions

```typescript
// ✅ Use interfaces for object shapes
interface HairstyleProps {
  hairstyle: Hairstyle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// ✅ Use type for unions and intersections
type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong' | 'diamond';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// ✅ Use type for function signatures
type OnSelectHandler = (id: string) => void;
type ClassifyFunction = (landmarks: FaceLandmark[]) => FaceClassification;

// ✅ Use 'import type' for type-only imports
import type { FaceShape, Hairstyle } from '@/types';

// ❌ Never use 'any'
const data: any = response;  // Bad

// ✅ Use 'unknown' if type is truly unknown, then narrow
const data: unknown = response;
if (isValidResponse(data)) {
  // Now data is typed
}
```

### 2.2 Strict Null Checks

```typescript
// ✅ Handle nullable values explicitly
interface Props {
  hairstyle: Hairstyle | null;  // Explicitly nullable
  error?: string;               // Optional (undefined)
}

// ✅ Use optional chaining
const name = hairstyle?.name ?? 'Unknown';

// ✅ Use nullish coalescing
const score = classification?.confidence ?? 0;

// ✅ Early return for null checks
function processHairstyle(hairstyle: Hairstyle | null) {
  if (!hairstyle) {
    return null;
  }
  // TypeScript now knows hairstyle is not null
  return hairstyle.name;
}
```

### 2.3 Function Typing

```typescript
// ✅ Always type parameters and return values
function classifyFaceShape(
  landmarks: FaceLandmark[],
  options?: ClassificationOptions
): FaceClassification {
  // ...
}

// ✅ Use arrow functions for callbacks
const handleSelect = (id: string): void => {
  setSelectedId(id);
};

// ✅ Type async functions properly
async function analyzeFace(image: string): Promise<AnalysisResult> {
  // ...
}
```

---

## 3. React Patterns

### 3.1 Component Structure

```typescript
'use client';  // If needed (client component)

import { useState, useCallback } from 'react';
// ... other imports

// Types at the top
interface ComponentProps {
  prop1: string;
  prop2: number;
  onAction: () => void;
  children?: React.ReactNode;
}

// Constants (if component-specific)
const ANIMATION_DURATION = 300;

/**
 * Component description
 * @description What this component does
 */
export function ComponentName({
  prop1,
  prop2,
  onAction,
  children,
}: ComponentProps): JSX.Element {
  // 1. Hooks (in order: state, context, refs, effects)
  const [state, setState] = useState<StateType>(initialState);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 2. Derived state / memoized values
  const computedValue = useMemo(() => {
    return expensiveComputation(prop1);
  }, [prop1]);

  // 3. Callbacks
  const handleClick = useCallback(() => {
    setState(newValue);
    onAction();
  }, [onAction]);

  // 4. Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependency]);

  // 5. Early returns (loading, error states)
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  // 6. Main render
  return (
    <div className="...">
      {children}
    </div>
  );
}
```

### 3.2 Hooks Usage

```typescript
// ✅ Custom hooks start with 'use'
export function useFaceDetection(videoRef: RefObject<HTMLVideoElement>) {
  const [landmarks, setLandmarks] = useState<FaceLandmark[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Detection logic
  }, [videoRef]);
  
  return { landmarks, error };
}

// ✅ Memoize expensive computations
const sortedHairstyles = useMemo(() => {
  return hairstyles.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}, [hairstyles]);

// ✅ Memoize callbacks passed to children
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);  // Empty deps if no dependencies

// ✅ Use refs for DOM elements and mutable values
const canvasRef = useRef<HTMLCanvasElement>(null);
const animationFrameRef = useRef<number>();
```

### 3.3 Event Handlers

```typescript
// ✅ Name handlers with 'handle' prefix
const handleClick = () => { ... };
const handleSubmit = (e: FormEvent) => { ... };
const handleKeyDown = (e: KeyboardEvent) => { ... };

// ✅ Pass handlers directly (don't create new functions in render)
<Button onClick={handleClick} />  // Good
<Button onClick={() => handleClick()} />  // Avoid if handleClick has no params

// ✅ For items in lists, use data attributes or closure
{items.map(item => (
  <Button 
    key={item.id}
    onClick={() => handleItemClick(item.id)}  // Acceptable
  />
))}
```

---

## 4. Styling Conventions

### 4.1 Tailwind CSS

```typescript
// ✅ Use cn() helper for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  // Base styles first
  'rounded-lg border p-4',
  // Responsive styles
  'md:p-6 lg:p-8',
  // State-based styles
  isSelected && 'border-blue-500 bg-blue-50',
  isDisabled && 'opacity-50 cursor-not-allowed',
  // Custom className from props (last to allow overrides)
  className
)} />

// ✅ Order of classes: layout → spacing → sizing → visual → interactive → responsive
<button className="
  flex items-center justify-center    // Layout
  gap-2 px-4 py-2                     // Spacing
  w-full h-12                         // Sizing
  rounded-lg bg-blue-500 text-white   // Visual
  hover:bg-blue-600 focus:ring-2      // Interactive
  md:w-auto                           // Responsive
" />

// ❌ Avoid arbitrary values
<div className="w-[347px] p-[13px]" />  // Bad

// ✅ Use design system values
<div className="w-80 p-4" />  // Good
```

### 4.2 Component Styling Patterns

```typescript
// ✅ Define variants as objects
const buttonVariants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100',
};

<button className={cn(
  'px-4 py-2 rounded-lg font-medium transition-colors',
  buttonVariants[variant]
)} />

// ✅ Use consistent spacing scale
// 1 = 0.25rem = 4px
// 2 = 0.5rem = 8px
// 4 = 1rem = 16px
// 6 = 1.5rem = 24px
// 8 = 2rem = 32px
```

---

## 5. Error Handling

### 5.1 Try-Catch Pattern

```typescript
// ✅ Wrap async operations
async function analyzeFace(image: string): Promise<Result> {
  try {
    const response = await fetch('/api/analyze-face', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}`, response.status);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Log for debugging
    console.error('Face analysis failed:', error);
    
    // Return structured error
    return {
      success: false,
      error: normalizeError(error),
    };
  }
}
```

### 5.2 Error Normalization

```typescript
// ✅ Normalize errors to consistent structure
function normalizeError(error: unknown): AppError {
  if (error instanceof ApiError) {
    return {
      code: error.statusCode === 429 ? 'API_RATE_LIMITED' : 'API_ERROR',
      message: error.message,
      recoverable: error.statusCode === 429,
    };
  }

  if (error instanceof TypeError) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to the server',
      recoverable: true,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    recoverable: false,
  };
}
```

### 5.3 Error Boundaries

```typescript
// ✅ Use error boundaries for component trees
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

---

## 6. Accessibility Standards

### 6.1 Required Attributes

```typescript
// ✅ Interactive elements need accessible names
<button aria-label="Capture photo">
  <Camera className="w-6 h-6" aria-hidden="true" />
</button>

// ✅ Images need alt text
<Image
  src={hairstyle.imagePath}
  alt={`${hairstyle.name} hairstyle preview`}
  width={200}
  height={250}
/>

// ✅ Form inputs need labels
<label htmlFor="upload-input" className="sr-only">
  Upload photo
</label>
<input
  id="upload-input"
  type="file"
  accept="image/*"
  onChange={handleFileChange}
/>

// ✅ Decorative images are hidden
<div aria-hidden="true">
  <DecorativePattern />
</div>
```

### 6.2 Focus Management

```typescript
// ✅ Visible focus indicators
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-blue-500 
  focus:ring-offset-2
">

// ✅ Focus trap in modals
<Dialog>
  <DialogContent>
    {/* Focus is trapped here */}
  </DialogContent>
</Dialog>

// ✅ Programmatic focus
useEffect(() => {
  if (isOpen && firstButtonRef.current) {
    firstButtonRef.current.focus();
  }
}, [isOpen]);
```

### 6.3 Keyboard Navigation

```typescript
// ✅ Support keyboard events
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>

// ✅ Arrow key navigation for lists
const handleKeyDown = (e: KeyboardEvent, index: number) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      focusItem(index + 1);
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      focusItem(index - 1);
      break;
  }
};
```

---

## 7. Performance Patterns

### 7.1 Memoization

```typescript
// ✅ Memoize expensive computations
const sortedItems = useMemo(() => {
  return items
    .filter(item => item.active)
    .sort((a, b) => b.score - a.score);
}, [items]);

// ✅ Memoize callback functions
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ✅ Memoize components that receive object props
const MemoizedGallery = memo(HairstyleGallery);
```

### 7.2 Code Splitting

```typescript
// ✅ Dynamic imports for heavy components
const MediaPipeDetector = dynamic(
  () => import('@/components/FaceDetector'),
  { 
    ssr: false,  // Don't render on server
    loading: () => <LoadingSpinner />,
  }
);

// ✅ Route-based splitting (automatic with Next.js App Router)
// Each page.tsx is automatically code-split
```

### 7.3 Image Optimization

```typescript
// ✅ Use next/image for automatic optimization
import Image from 'next/image';

<Image
  src={hairstyle.thumbnailPath}
  alt={hairstyle.name}
  width={120}
  height={160}
  placeholder="blur"
  blurDataURL={hairstyle.blurDataUrl}
  priority={index < 2}  // Prioritize above-fold images
/>
```

---

## 8. Testing Conventions

### 8.1 Test File Organization

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx       # Co-located test
├── lib/
│   ├── classifier.ts
│   └── classifier.test.ts    # Co-located test
└── __tests__/                 # Integration tests
    └── analyze-flow.test.tsx
```

### 8.2 Test Naming

```typescript
// ✅ Descriptive test names
describe('FaceShapeClassifier', () => {
  describe('classifyFaceShape', () => {
    it('returns oval for balanced width-height ratio', () => { ... });
    it('returns round when width equals height', () => { ... });
    it('handles missing landmarks gracefully', () => { ... });
  });
});

// ✅ Use test.each for multiple cases
test.each([
  { ratio: 0.72, expected: 'oval' },
  { ratio: 0.90, expected: 'round' },
  { ratio: 0.60, expected: 'oblong' },
])('classifies ratio $ratio as $expected', ({ ratio, expected }) => {
  expect(classifyByRatio(ratio)).toBe(expected);
});
```

---

## 9. Git Conventions

### 9.1 Commit Messages

```
Format: <type>(<scope>): <description>

Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation
- style:    Formatting (no code change)
- refactor: Code restructuring
- test:     Adding tests
- chore:    Maintenance

Examples:
feat(camera): add webcam capture component
fix(detection): handle missing landmarks gracefully
docs(readme): add setup instructions
refactor(classifier): simplify ratio calculation
test(gallery): add selection state tests
chore(deps): update mediapipe to 0.10.x
```

### 9.2 Branch Naming

```
feature/camera-capture
feature/face-detection
fix/ios-camera-black-screen
refactor/classification-algorithm
docs/api-documentation
```

---

## 10. Documentation Standards

### 10.1 JSDoc Comments

```typescript
/**
 * Classifies face shape based on facial landmark measurements.
 * 
 * @description Uses width-to-height and jaw-to-cheekbone ratios
 * to determine the closest matching face shape category.
 * 
 * @param landmarks - Array of 468 MediaPipe face landmarks
 * @param options - Optional classification parameters
 * @returns Classification result with shape and confidence
 * 
 * @example
 * ```typescript
 * const result = classifyFaceShape(landmarks);
 * console.log(result.shape); // 'oval'
 * console.log(result.confidence); // 85
 * ```
 * 
 * @throws {Error} If landmarks array is empty or invalid
 */
export function classifyFaceShape(
  landmarks: FaceLandmark[],
  options?: ClassificationOptions
): FaceClassification {
  // Implementation
}
```

### 10.2 Component Documentation

```typescript
/**
 * Interactive hairstyle gallery component.
 * 
 * Displays a grid of hairstyle recommendations with selection state,
 * keyboard navigation, and accessibility support.
 * 
 * @component
 * @example
 * ```tsx
 * <HairstyleGallery
 *   hairstyles={recommendations}
 *   selectedId={currentStyle?.id}
 *   onSelect={handleStyleSelect}
 * />
 * ```
 */
export function HairstyleGallery({ ... }: HairstyleGalleryProps) {
  // Implementation
}
```

---

*End of Coding Conventions*
