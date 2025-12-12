# 🤖 AI PROMPTS LIBRARY
## Spec-Driven Prompts for StyleAI Project

> **These prompts reference your spec files (CLAUDE.md, SPEC.md, etc.)**
> AI tools will generate more accurate code because they have full context.

---

## 📋 HOW TO USE

### For Claude CLI:
```bash
cd hair-salon-ai    # Navigate to project (has CLAUDE.md)
claude chat         # Claude auto-reads CLAUDE.md
# Then paste prompts below
```

### For GitHub Copilot Chat:
```
Press Ctrl+Shift+I in VS Code
# Copilot already has context from .github/copilot-instructions.md
# Paste prompts below
```

### Prompt Format:
All prompts reference spec files by section. Example:
```
Create X following:
- SPEC.md section 2.1 for types
- CONVENTIONS.md section 3 for patterns
```

---

## PHASE 1: PROJECT SETUP

### 1.1 Verify Project Understanding (Claude CLI)

```
I've set up the StyleAI project with spec files.

Confirm you can access:
1. CLAUDE.md - Project context
2. SPEC.md - Technical specifications
3. ARCHITECTURE.md - System design
4. CONVENTIONS.md - Coding standards

Tell me:
- What are the 6 face shapes we support?
- What's our tech stack?
- What are the key constraints?
```

### 1.2 Install Dependencies (Claude CLI)

```
Based on SPEC.md and ARCHITECTURE.md section 6.2 (Technology Stack):

Generate the exact pnpm commands to install all required dependencies.
Group them by: core, UI, dev dependencies.
```

### 1.3 Create Type Definitions (Claude CLI)

```
Create src/types/index.ts with ALL TypeScript interfaces from SPEC.md section 2.

Include:
- Section 2.1: Core Types (FaceShape, FaceLandmark, FaceDetectionResult, etc.)
- Section 2.2: API Types (AnalyzeFaceRequest, AnalyzeFaceResponse, etc.)

Export everything as named exports.
Follow CONVENTIONS.md section 2 for TypeScript standards.
```

### 1.4 Create Utils File (Copilot Chat)

```
Create src/lib/utils.ts following CONVENTIONS.md section 4.1:

Include:
- cn() helper for Tailwind class merging (use clsx + tailwind-merge)
- Any other utilities mentioned in CONVENTIONS.md
```

---

## PHASE 2: UI COMPONENTS

### 2.1 Landing Page (Copilot Chat)

```
Create src/app/page.tsx - the landing page for StyleAI.

Follow:
- CONVENTIONS.md section 3.1 for component structure
- CONVENTIONS.md section 4 for Tailwind patterns
- ARCHITECTURE.md section 2 for file location

Design:
- Hero section with "StyleAI" title
- Tagline: "Find Your Perfect Hairstyle with AI"
- 3 feature cards: Instant Analysis, Personalized Picks, Visual Preview
- Primary CTA button "Start Analysis" linking to /analyze
- Use lucide-react icons
- Responsive: mobile-first design
```

### 2.2 Camera Capture Component (Claude CLI)

```
Create src/components/CameraCapture.tsx

Follow:
- CONVENTIONS.md section 3.1 for component structure
- CONVENTIONS.md section 5 for error handling
- CONVENTIONS.md section 6 for accessibility

Props interface:
interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onError: (error: AppError) => void;  // AppError from SPEC.md section 2.1
}

Features:
1. Request camera permission (getUserMedia)
2. Display live video preview (16:9 aspect ratio)
3. SVG oval face guide overlay
4. "Position your face" instruction text
5. Capture button with camera icon
6. Permission denied error handling (use SPEC.md section 6.1 error codes)
7. "Upload Photo" alternative button
8. Captured image preview with confirm/retake options

Include proper ARIA labels per CONVENTIONS.md section 6.1.
```

### 2.3 Loading Overlay (Copilot Chat)

```
Create src/components/LoadingOverlay.tsx

Follow:
- CONVENTIONS.md section 3.1 for structure
- CONVENTIONS.md section 4 for styling

Props:
- isVisible: boolean
- message: string (e.g., "Detecting face...", "Analyzing features...")
- showCancel?: boolean
- onCancel?: () => void

Features:
- Full screen semi-transparent overlay
- Centered spinner animation
- Status message text
- Cancel button (appears after 10 seconds)
```

### 2.4 Error Message Component (Claude CLI)

```
Create src/components/ErrorMessage.tsx

Use error messages from SPEC.md section 6.1 (ERROR_MESSAGES object).

Props:
interface ErrorMessageProps {
  error: AppError;  // From SPEC.md section 2.1
  onRetry?: () => void;
  onDismiss?: () => void;
}

Features:
- Display title, message, action from SPEC.md section 6.1
- Appropriate icon per error type
- Retry button if error.recoverable is true
- Dismiss button
- Follow CONVENTIONS.md section 6 for accessibility
```

### 2.5 Face Shape Badge (Copilot Chat)

```
Create src/components/FaceShapeBadge.tsx

Follow CONVENTIONS.md for component structure.

Props:
- shape: FaceShape (from SPEC.md section 2.1)
- confidence: number
- showConfidence?: boolean

Display:
- Badge with face shape name (capitalize first letter)
- Icon representing the shape
- Optional confidence percentage
- Color coded by shape type
```

---

## PHASE 3: FACE DETECTION

### 3.1 Face Detection Library (Claude CLI)

```
Create src/lib/faceDetection.ts

Follow:
- SPEC.md section 3.1 for LANDMARK_INDICES
- SPEC.md section 2.1 for FaceLandmark and FaceDetectionResult types
- CONVENTIONS.md section 2 for TypeScript
- CONVENTIONS.md section 5 for error handling

Functions to implement:

1. initializeFaceLandmarker(): Promise<FaceLandmarker>
   - Initialize MediaPipe Face Landmarker
   - Use GPU delegate
   - Configure for VIDEO running mode
   - Handle WASM loading errors

2. detectFace(
     landmarker: FaceLandmarker, 
     video: HTMLVideoElement
   ): FaceDetectionResult | null
   - Run detection on video frame
   - Return null if no face detected
   - Extract 468 landmarks
   - Calculate bounding box
   - Return confidence score

3. extractKeyLandmarks(landmarks: FaceLandmark[]): KeyLandmarks
   - Extract landmarks using indices from SPEC.md section 3.1:
     - FOREHEAD_TOP: 10
     - CHIN_BOTTOM: 152
     - LEFT_CHEEKBONE: 234
     - RIGHT_CHEEKBONE: 454
     - etc.

Include JSDoc comments per CONVENTIONS.md section 10.1.
```

### 3.2 Face Detection Hook (Claude CLI)

```
Create src/hooks/useFaceDetection.ts

Follow:
- CONVENTIONS.md section 3.2 for hooks
- Types from SPEC.md section 2.1

Hook signature:
function useFaceDetection(
  videoRef: RefObject<HTMLVideoElement>
): {
  landmarks: FaceLandmark[] | null;
  boundingBox: BoundingBox | null;
  isDetecting: boolean;
  error: string | null;
  startDetection: () => void;
  stopDetection: () => void;
}

Implementation:
1. Initialize FaceLandmarker on mount
2. Run detection loop using requestAnimationFrame
3. Update landmarks state on each detection
4. Handle cleanup on unmount
5. Proper error handling per CONVENTIONS.md section 5
```

### 3.3 Face Shape Classifier (Claude CLI)

```
Create src/lib/faceShapeClassifier.ts

Implement EXACTLY as specified in SPEC.md:
- Section 3.2: Classification Algorithm (classifyFaceShape function)
- Section 3.3: Confidence Calculation (calculateConfidence function)

Use:
- FaceMeasurements interface from SPEC.md section 2.1
- FaceClassification interface from SPEC.md section 2.1
- LANDMARK_INDICES from SPEC.md section 3.1

Functions:

1. calculateMeasurements(landmarks: FaceLandmark[]): FaceMeasurements
   - Calculate face width, height, jaw width, etc.
   - Use landmark indices from SPEC.md section 3.1

2. classifyFaceShape(measurements: FaceMeasurements): FaceShape
   - Implement decision tree from SPEC.md section 3.2 EXACTLY
   - Follow the ratio thresholds specified

3. calculateConfidence(shape: FaceShape, measurements: FaceMeasurements): number
   - Implement from SPEC.md section 3.3
   - Use idealRanges as specified

4. analyzeFaceShape(landmarks: FaceLandmark[]): FaceClassification
   - Combine all above functions
   - Return complete classification result

Include detailed comments explaining the math.
```

### 3.4 Face Detector Component (Copilot Chat)

```
Create src/components/FaceDetector.tsx

Follow CONVENTIONS.md section 3.1 for structure.

Props:
- videoRef: RefObject<HTMLVideoElement>
- onDetection: (result: FaceDetectionResult) => void
- onClassification: (result: FaceClassification) => void
- showVisualization?: boolean

Features:
- Use useFaceDetection hook
- Use faceShapeClassifier
- Optional canvas overlay showing landmarks
- Real-time updates
```

---

## PHASE 4: AI INTEGRATION

### 4.1 Gemini API Client (Claude CLI)

```
Create src/lib/gemini.ts

Follow:
- CONVENTIONS.md section 5 for error handling
- Rate limit: 15 req/min (from CLAUDE.md constraints)

Functions:

1. initializeGemini(): GoogleGenerativeAI
   - Initialize with API key from env

2. analyzeWithGemini(imageBase64: string): Promise<GeminiAnalysisResult>
   - Send image to Gemini 1.5 Flash
   - Use this prompt:
     "Analyze this face photo and determine the face shape.
      Classify as exactly one of: oval, round, square, heart, oblong, diamond
      Provide: shape, confidence (0-100), reasoning (1-2 sentences)
      Return as JSON only: { shape, confidence, reasoning }"
   - Parse and validate response
   - Handle rate limits with exponential backoff
   - Max 3 retries

Include proper TypeScript types.
```

### 4.2 Analyze Face API Route (Claude CLI)

```
Create src/app/api/analyze-face/route.ts

Follow:
- API contract from SPEC.md section 2.2 (AnalyzeFaceRequest, AnalyzeFaceResponse)
- Error codes from SPEC.md section 6.1
- CONVENTIONS.md for API route patterns

Implementation:

export async function POST(request: NextRequest) {
  // 1. Parse and validate request body (AnalyzeFaceRequest)
  // 2. Validate image is present and is base64
  // 3. Call Gemini API using gemini.ts
  // 4. Handle errors:
  //    - 429: Return API_RATE_LIMITED error
  //    - 500: Return API_ERROR
  //    - Network: Return NETWORK_ERROR
  // 5. Return AnalyzeFaceResponse with proper structure

  // Response format:
  // Success: { success: true, data: { shape, confidence, reasoning, measurements } }
  // Error: { success: false, error: { code, message } }
}

Include rate limiting logic (track requests per minute).
```

### 4.3 Hairstyle Database (Claude CLI)

```
Create src/lib/hairstyleDatabase.ts

Copy the COMPLETE hairstyle database from SPEC.md section 4.1.

It should include:
- All 30 hairstyles (5 per face shape)
- Exact data structure from SPEC.md
- Helper functions:
  - getHairstylesByShape(shape: FaceShape): Hairstyle[]
  - getHairstyleById(id: string): Hairstyle | undefined

Export HAIRSTYLE_DATABASE as const.
Follow CONVENTIONS.md for code style.
```

### 4.4 Recommend API Route (Copilot Chat)

```
Create src/app/api/recommend/route.ts

Follow SPEC.md section 2.2 for RecommendResponse type.

export async function GET(request: NextRequest) {
  // 1. Get shape from query params: ?shape=oval
  // 2. Validate shape is valid FaceShape
  // 3. Query hairstyleDatabase
  // 4. Return top 5 hairstyles sorted by suitabilityScore
  // 5. Return RecommendResponse
}
```

---

## PHASE 5: VISUALIZATION

### 5.1 Overlay Engine (Claude CLI)

```
Create src/lib/overlayEngine.ts

Implement EXACTLY as specified in SPEC.md:
- Section 5.1: calculateOverlayPosition function
- Section 5.2: renderPreview function

Use:
- OverlayPosition interface from SPEC.md section 5.1
- LANDMARK_INDICES from SPEC.md section 3.1
- loadImage helper from SPEC.md section 5.2

Functions:

1. calculateOverlayPosition(
     landmarks: FaceLandmark[],
     canvasWidth: number,
     canvasHeight: number,
     templateAspectRatio: number
   ): OverlayPosition
   - Implement EXACTLY as in SPEC.md section 5.1

2. renderPreview(
     canvas: HTMLCanvasElement,
     userImageSrc: string,
     hairstyleImageSrc: string,
     landmarks: FaceLandmark[]
   ): Promise<void>
   - Implement EXACTLY as in SPEC.md section 5.2
   - Handle high DPI displays
   - Apply rotation based on eye line

3. loadImage(src: string): Promise<HTMLImageElement>
   - Helper to load images with crossOrigin

Include comments referencing SPEC.md sections.
```

### 5.2 Hairstyle Preview Component (Claude CLI)

```
Create src/components/HairstylePreview.tsx

Follow:
- CONVENTIONS.md section 3.1 for component structure
- SPEC.md section 5 for overlay logic

Props:
interface HairstylePreviewProps {
  userImage: string;  // Base64
  hairstyle: Hairstyle;  // From SPEC.md
  landmarks: FaceLandmark[];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

Features:
- Canvas element for rendering
- Use overlayEngine for positioning
- Loading state while rendering
- High DPI support (devicePixelRatio)
- Export method for download
```

### 5.3 Hairstyle Gallery (Claude CLI)

```
Create src/components/HairstyleGallery.tsx

Follow:
- CONVENTIONS.md section 3.1 for component structure
- CONVENTIONS.md section 6 for accessibility
- Hairstyle type from SPEC.md section 2.1

Props:
interface HairstyleGalleryProps {
  hairstyles: Hairstyle[];
  selectedId: string | null;
  onSelect: (hairstyle: Hairstyle) => void;
  isLoading?: boolean;
}

Features:
- Grid layout: 5 columns desktop, 3 tablet, 2 mobile
- Thumbnail cards showing hairstyle image and name
- Selected state: blue border, slight scale
- Hover effect: scale 1.05, shadow
- Loading skeleton when isLoading
- Keyboard navigation (arrow keys, Enter to select)
- ARIA labels: role="listbox", role="option"
- Focus visible indicators
```

### 5.4 Before/After Slider (Claude CLI)

```
Create src/components/BeforeAfterSlider.tsx

Follow:
- CONVENTIONS.md section 3.1 for structure
- CONVENTIONS.md section 6.3 for keyboard support

Props:
interface BeforeAfterSliderProps {
  beforeImage: string;  // Base64 - original photo
  afterImage: string;   // Base64 - with hairstyle overlay
  initialPosition?: number;  // 0-100, default 50
}

Features:
1. Canvas-based rendering for performance
2. Draggable vertical divider line
3. Touch support (touchstart, touchmove, touchend)
4. Mouse support (mousedown, mousemove, mouseup)
5. Keyboard support (Left/Right arrows adjust by 5%)
6. Labels: "Before" on left, "After" on right
7. Visible drag handle with grip icon
8. Smooth 60fps animation using requestAnimationFrame
9. ARIA attributes: role="slider", aria-valuemin, aria-valuemax, aria-valuenow
```

### 5.5 Download Button (Copilot Chat)

```
Create src/components/DownloadButton.tsx

Follow CONVENTIONS.md for component structure.

Props:
interface DownloadButtonProps {
  canvas: HTMLCanvasElement | null;
  faceShape: FaceShape;
  hairstyleName: string;
  disabled?: boolean;
}

Features:
1. Generate high-res PNG from canvas
2. Filename format: StyleAI_{shape}_{style}_{timestamp}.png
3. Loading state during generation
4. Success toast notification
5. Handle iOS Safari (open in new tab instead of download)
6. Disabled state when canvas not ready
```

---

## PHASE 6: RESULTS PAGE

### 6.1 Complete Results Page (Claude CLI)

```
Create src/app/analyze/page.tsx - the main analysis flow page.

Follow:
- ARCHITECTURE.md section 3.1 for user flow
- ARCHITECTURE.md section 4.1 for state structure (AppState)
- CONVENTIONS.md section 3.1 for component structure

This page orchestrates the entire flow:

State (based on ARCHITECTURE.md section 4.1):
- step: 'capture' | 'analyzing' | 'results'
- capturedImage: string | null
- landmarks: FaceLandmark[] | null
- classification: FaceClassification | null
- recommendations: Hairstyle[]
- selectedHairstyle: Hairstyle | null
- error: AppError | null
- isLoading: boolean

Flow:
1. CAPTURE step: Show CameraCapture component
2. ANALYZING step: Show LoadingOverlay, run detection + classification + API calls
3. RESULTS step: Show results UI

Results UI Layout:
- FaceShapeBadge (top)
- HairstyleGallery (5 recommendations)
- HairstylePreview (large canvas)
- BeforeAfterSlider
- "Why This Style" explanation text
- Action buttons: DownloadButton, "Try Another Photo"

Include:
- Error handling at each step
- Loading states
- Responsive layout (stack on mobile)
```

---

## PHASE 7: POLISH & TESTING

### 7.1 Error Handling Audit (Claude CLI)

```
Audit the entire codebase for error handling.

Check against SPEC.md section 6.1 error codes:
- CAMERA_PERMISSION_DENIED
- CAMERA_NOT_FOUND
- NO_FACE_DETECTED
- MULTIPLE_FACES
- POOR_LIGHTING
- IMAGE_TOO_BLURRY
- API_RATE_LIMITED
- API_ERROR
- NETWORK_ERROR
- UNKNOWN_ERROR

For each scenario:
1. Is it detected properly?
2. Is the correct error code used?
3. Is the message user-friendly (from SPEC.md section 6.1)?
4. Is there a recovery action?

List gaps and provide fixes.
```

### 7.2 Accessibility Audit (Claude CLI)

```
Audit accessibility against CONVENTIONS.md section 6:

Check:
1. Color contrast (CONVENTIONS.md 6.1) - 4.5:1 minimum
2. Keyboard navigation (CONVENTIONS.md 6.2) - all interactive elements
3. Focus indicators (CONVENTIONS.md 6.2) - visible focus states
4. ARIA labels (CONVENTIONS.md 6.1) - all interactive elements
5. Image alt text (CONVENTIONS.md 6.1)
6. Touch targets (44x44px minimum on mobile)

List issues with specific component names and fixes.
```

### 7.3 Performance Audit (Claude CLI)

```
Audit performance against SPEC.md section 7:

Targets:
- Initial page load: < 3 seconds
- Face detection: < 2 seconds
- Preview render: < 3 seconds
- Style switch: < 500ms

Check:
1. Bundle size (< 300KB initial)
2. Image optimization (next/image usage)
3. Code splitting (dynamic imports for MediaPipe)
4. Memoization (useMemo, useCallback usage)

List optimizations needed.
```

---

## PHASE 8: DOCUMENTATION

### 8.1 Generate README (Claude CLI)

```
Generate README.md for the StyleAI project.

Include:
1. Project title and description (from CLAUDE.md)
2. Live demo link placeholder
3. Screenshots placeholder
4. Features list (from CLAUDE.md section "Core User Flow")
5. Tech stack (from ARCHITECTURE.md section 6.2)
6. Getting started:
   - Prerequisites
   - Installation steps
   - Environment variables
   - Running locally
7. Project structure (from ARCHITECTURE.md section 2)
8. API documentation (from SPEC.md section 2.2)
9. Contributing guidelines
10. License (MIT)

Make it professional and portfolio-ready.
```

### 8.2 IEEE Paper Help (Claude CLI)

```
Help me write the IEEE paper for this HCI project.

Use information from:
- CLAUDE.md for project overview and HCI principles
- SPEC.md for technical methodology
- ARCHITECTURE.md for system design
- CONVENTIONS.md for implementation details

Generate these sections:
1. Abstract (200 words)
2. Introduction (500 words)
3. Related Work (400 words)
4. Methodology (600 words) - use SPEC.md
5. Implementation (400 words) - use ARCHITECTURE.md
6. Evaluation (placeholder for my test results)
7. Discussion (300 words)
8. Conclusion (200 words)

Use academic writing style.
```

---

## UTILITY PROMPTS

### Quick Type Check

```
Check if this code matches the types in SPEC.md section 2:

[paste code]

List any type mismatches.
```

### Convention Check

```
Review this component against CONVENTIONS.md:

[paste code]

Does it follow:
- Section 3.1 component structure?
- Section 4 Tailwind patterns?
- Section 5 error handling?
- Section 6 accessibility?

List violations and fixes.
```

### Architecture Check

```
Does this implementation match ARCHITECTURE.md?

[paste code or describe feature]

Check against:
- Section 2 component hierarchy
- Section 3 data flow
- Section 4 state management
```

### Debug With Spec Reference

```
This code isn't working as expected.

Expected behavior (from SPEC.md section X): [describe]
Actual behavior: [describe]

Code:
[paste code]

What's wrong?
```

### Generate Tests

```
Generate tests for [file] following:
- CONVENTIONS.md section 8 for test patterns
- Types from SPEC.md section 2

Include:
- Happy path tests
- Error case tests
- Edge case tests
```

---

## QUICK REFERENCE

### File → Section Lookup

| Need | File | Section |
|------|------|---------|
| TypeScript interfaces | SPEC.md | 2.1, 2.2 |
| Landmark indices | SPEC.md | 3.1 |
| Classification algorithm | SPEC.md | 3.2 |
| Confidence calculation | SPEC.md | 3.3 |
| Hairstyle data | SPEC.md | 4.1 |
| Overlay positioning | SPEC.md | 5.1 |
| Render pipeline | SPEC.md | 5.2 |
| Error messages | SPEC.md | 6.1 |
| Performance targets | SPEC.md | 7 |
| Component patterns | CONVENTIONS.md | 3 |
| Tailwind patterns | CONVENTIONS.md | 4 |
| Error handling | CONVENTIONS.md | 5 |
| Accessibility | CONVENTIONS.md | 6 |
| Component hierarchy | ARCHITECTURE.md | 2 |
| Data flows | ARCHITECTURE.md | 3 |
| State structure | ARCHITECTURE.md | 4 |
| Daily tasks | TASKS.md | Day 1-7 |

### Prompt Templates

**For generating code:**
```
Create [file] following:
- [SPEC.md section X] for [types/algorithm/data]
- [CONVENTIONS.md section Y] for [patterns/style]
- [ARCHITECTURE.md section Z] for [structure/flow]
```

**For reviewing code:**
```
Review [file] against:
- SPEC.md section X - correct types?
- CONVENTIONS.md section Y - correct patterns?
List issues and fixes.
```

**For debugging:**
```
This doesn't match SPEC.md section X.
Expected: [from spec]
Actual: [what's happening]
Fix it.
```

---

**These prompts + spec files = accurate code generation!** 🎯
