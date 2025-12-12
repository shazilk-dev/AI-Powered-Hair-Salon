# CLAUDE.md - Project Context for AI Assistants

> This file provides context for Claude CLI and other AI assistants working on this project.
> Read this file first to understand the project before making any changes.

## Project Overview

**Name:** StyleAI - AI-Powered Hair Salon Recommendation System  
**Type:** HCI Course Project (Academic)  
**Duration:** 7 Days  
**Developer:** Solo  
**Budget:** $0 (Free tier services only)

### One-Line Description

A web application that uses computer vision to analyze facial features, classifies face shapes using AI, and recommends personalized hairstyles with interactive visual previews.

### Core User Flow

```
1. User opens app → Landing page
2. User clicks "Start Analysis" → Camera screen
3. User captures/uploads photo → Processing screen
4. System detects face → Analyzes shape → Shows results
5. User browses 5 recommended hairstyles → Clicks to preview
6. User sees hairstyle overlaid on their photo → Before/after comparison
7. User downloads styled image → Done
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion (optional)

### Computer Vision
- **Face Detection:** MediaPipe Face Mesh (@mediapipe/tasks-vision)
- **Landmarks:** 468 facial points
- **Processing:** Client-side (browser)

### AI/ML
- **API:** Google Gemini 1.5 Flash
- **Purpose:** Face shape classification validation
- **Rate Limit:** 15 requests/minute (free tier)

### Image Processing
- **Rendering:** HTML5 Canvas API
- **Operations:** Overlay, scaling, blending

### Deployment
- **Platform:** Vercel (free tier)
- **CI/CD:** GitHub Actions (optional)

## Project Structure

```
hair-salon-ai/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot context
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles
│   │   ├── analyze/
│   │   │   └── page.tsx           # Main analysis flow
│   │   └── api/
│   │       ├── analyze-face/
│   │       │   └── route.ts       # Gemini API integration
│   │       └── recommend/
│   │           └── route.ts       # Recommendation logic
│   ├── components/
│   │   ├── ui/                    # Shadcn components
│   │   ├── CameraCapture.tsx      # Webcam interface
│   │   ├── FaceDetector.tsx       # MediaPipe wrapper
│   │   ├── FaceShapeBadge.tsx     # Shape display
│   │   ├── HairstyleGallery.tsx   # Style thumbnails
│   │   ├── HairstylePreview.tsx   # Canvas overlay
│   │   ├── BeforeAfterSlider.tsx  # Comparison UI
│   │   ├── DownloadButton.tsx     # Export feature
│   │   ├── LoadingOverlay.tsx     # Loading states
│   │   └── ErrorMessage.tsx       # Error display
│   ├── lib/
│   │   ├── faceDetection.ts       # MediaPipe utilities
│   │   ├── faceShapeClassifier.ts # Classification algorithm
│   │   ├── hairstyleDatabase.ts   # Style data
│   │   ├── overlayEngine.ts       # Canvas rendering
│   │   ├── gemini.ts              # API client
│   │   └── utils.ts               # Helper functions
│   ├── hooks/
│   │   ├── useCamera.ts           # Camera access
│   │   ├── useFaceDetection.ts    # Detection hook
│   │   └── useOverlay.ts          # Overlay hook
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── public/
│   └── hairstyles/                # PNG templates (transparent)
│       ├── oval/                  # 5 styles
│       ├── round/                 # 5 styles
│       ├── square/                # 5 styles
│       ├── heart/                 # 5 styles
│       ├── oblong/                # 5 styles
│       └── diamond/               # 5 styles
├── CLAUDE.md                      # This file
├── SPEC.md                        # Technical specification
├── ARCHITECTURE.md                # System architecture
├── CONVENTIONS.md                 # Coding standards
├── TASKS.md                       # Progress tracking
└── package.json
```

## Key Domain Concepts

### Face Shapes (6 Categories)

| Shape | Characteristics | Width:Height Ratio |
|-------|----------------|-------------------|
| **Oval** | Balanced, slightly longer than wide | 0.70 - 0.75 |
| **Round** | Width ≈ height, soft curves | > 0.85 |
| **Square** | Strong jaw, angular features | 0.85 - 1.0 |
| **Heart** | Wide forehead, narrow chin | Variable |
| **Oblong** | Long face, narrow width | < 0.65 |
| **Diamond** | Wide cheekbones, narrow forehead/jaw | Variable |

### Key MediaPipe Landmarks

```typescript
// Critical landmark indices for face shape calculation
const LANDMARKS = {
  FOREHEAD_TOP: 10,      // Top of forehead (face height start)
  CHIN: 152,             // Bottom of chin (face height end)
  LEFT_CHEEK: 234,       // Left cheekbone (face width)
  RIGHT_CHEEK: 454,      // Right cheekbone (face width)
  LEFT_JAW: 58,          // Left jaw point
  RIGHT_JAW: 288,        // Right jaw point
  LEFT_FOREHEAD: 103,    // Left forehead edge
  RIGHT_FOREHEAD: 332,   // Right forehead edge
};
```

### Hairstyle Database Structure

```typescript
interface Hairstyle {
  id: string;                    // e.g., "oval-1"
  name: string;                  // e.g., "Long Layers"
  category: FaceShape;           // e.g., "oval"
  imagePath: string;             // e.g., "/hairstyles/oval/long-layers.png"
  thumbnailPath: string;         // Smaller preview image
  description: string;           // 2-3 sentences
  suitabilityScore: number;      // 85-98
  reasoning: string;             // Why it suits this face shape
  tags: string[];                // ["professional", "casual", "modern"]
}
```

## API Contracts

### POST /api/analyze-face

**Request:**
```typescript
{
  image: string;        // Base64 encoded image
  landmarks?: object;   // Optional pre-detected landmarks
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    shape: FaceShape;
    confidence: number;      // 0-100
    reasoning: string;
    measurements: {
      faceWidth: number;
      faceHeight: number;
      ratio: number;
      jawWidth: number;
      cheekboneWidth: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}
```

### GET /api/recommend?shape={faceShape}

**Response:**
```typescript
{
  success: boolean;
  data?: {
    faceShape: FaceShape;
    recommendations: Hairstyle[];  // Array of 5
  };
  error?: {
    code: string;
    message: string;
  };
}
```

## Critical Constraints

### Must Follow
- ✅ Zero cost - all services must be free tier
- ✅ Client-side face detection (minimize API calls)
- ✅ No user data storage (privacy by design)
- ✅ Mobile responsive (320px to 2560px)
- ✅ Accessible (WCAG 2.1 Level AA)
- ✅ Works offline after initial load (graceful degradation)

### Must Avoid
- ❌ No user authentication/accounts
- ❌ No backend database
- ❌ No paid APIs or services
- ❌ No native mobile apps
- ❌ No custom ML model training
- ❌ No 3D/AR features

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial page load | < 3 seconds |
| Face detection | < 2 seconds |
| Style preview render | < 3 seconds |
| Style switching | < 500ms |
| Total workflow | < 30 seconds |
| Lighthouse score | > 90 |

## HCI Principles to Demonstrate

This is an academic project. These principles MUST be visible:

1. **Visibility of System Status** - Loading indicators, progress feedback
2. **User Control & Freedom** - Back buttons, retry options, restart
3. **Consistency & Standards** - Uniform styling, predictable behavior
4. **Error Prevention** - Validation, disabled states, confirmations
5. **Recognition over Recall** - Visual thumbnails, clear labels
6. **Flexibility & Efficiency** - Works for novice and expert users
7. **Aesthetic & Minimalist Design** - Clean UI, no clutter
8. **Help Users with Errors** - Clear messages, recovery options
9. **Feedback** - Immediate response to all actions
10. **Affordances** - Buttons look clickable, sliders look draggable

## Current Development Phase

**Phase:** [UPDATE THIS AS YOU PROGRESS]

- [ ] Day 1: Project setup, UI skeleton
- [ ] Day 2: Face detection integration
- [ ] Day 3: Gemini API integration
- [ ] Day 4: Hairstyle templates
- [ ] Day 5: Preview system
- [ ] Day 6: Testing & polish
- [ ] Day 7: Documentation

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm lint                   # Run ESLint
pnpm type-check            # TypeScript check

# Deployment
vercel                      # Deploy preview
vercel --prod              # Deploy production

# Testing
pnpm test                   # Run tests
pnpm test:coverage         # With coverage
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Known Issues & Workarounds

### MediaPipe WASM Loading
MediaPipe requires WASM files. If loading fails:
```typescript
// Ensure proper path in next.config.js
// Use dynamic import with SSR disabled
```

### iOS Safari Camera
iOS requires specific attributes:
```tsx
<video autoPlay playsInline muted />
```

### Canvas High DPI
For sharp rendering on retina:
```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

## Files AI Should Not Modify

- `package-lock.json` / `pnpm-lock.yaml` - Auto-generated
- `.next/` - Build output
- `node_modules/` - Dependencies
- `.env.local` - Secrets

## How to Help

When assisting with this project:

1. **Follow the tech stack** - Use Next.js 14 App Router patterns
2. **Use TypeScript** - Always include proper types
3. **Apply Tailwind** - No inline styles or CSS modules
4. **Consider HCI** - Every UI decision should reference principles
5. **Keep it simple** - This is a 7-day project, avoid over-engineering
6. **Test on mobile** - Responsive design is critical
7. **Handle errors** - Every async operation needs error handling
8. **Document code** - JSDoc comments on functions

## Questions to Ask Before Coding

1. Does this stay within free tier limits?
2. Does this work on mobile?
3. Is this accessible?
4. What happens if this fails?
5. Does this demonstrate an HCI principle?
6. Can this be simpler?

---

*Last updated: December 11, 2025*
*Project deadline: December 18, 2025*
