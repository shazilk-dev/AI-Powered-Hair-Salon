# ARCHITECTURE.md - System Architecture

> Visual and descriptive documentation of the StyleAI system architecture.
> Use this to understand how components connect and data flows.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              StyleAI Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────┐
                                    │    User     │
                                    │   Browser   │
                                    └──────┬──────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Next.js App Router                           │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │  Landing  │  │  Capture  │  │  Analyze  │  │  Results  │        │   │
│  │  │   Page    │  │   Page    │  │   Page    │  │   Page    │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐   │
│  │    MediaPipe WASM    │  │    Canvas Engine     │  │  React State   │   │
│  │   (Face Detection)   │  │   (Image Overlay)    │  │  (App State)   │   │
│  └──────────────────────┘  └──────────────────────┘  └────────────────┘   │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │ HTTPS
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVER LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js API Routes (Vercel Edge)                  │   │
│  │  ┌─────────────────────────┐  ┌─────────────────────────┐          │   │
│  │  │   /api/analyze-face     │  │     /api/recommend      │          │   │
│  │  │   - Validate input      │  │   - Get face shape      │          │   │
│  │  │   - Call Gemini API     │  │   - Query database      │          │   │
│  │  │   - Return results      │  │   - Return hairstyles   │          │   │
│  │  └─────────────────────────┘  └─────────────────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         │ HTTPS
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                  │
│  │   Google Gemini API     │  │   Vercel CDN/Edge       │                  │
│  │   (Face Analysis)       │  │   (Static Assets)       │                  │
│  │   - 1.5 Flash Model     │  │   - Hairstyle PNGs      │                  │
│  │   - 15 req/min free     │  │   - Global delivery     │                  │
│  └─────────────────────────┘  └─────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (/)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── analyze/
│   │   └── page.tsx              # Main analysis flow (/analyze)
│   │
│   └── api/                      # API Routes (Serverless)
│       ├── analyze-face/
│       │   └── route.ts          # POST /api/analyze-face
│       └── recommend/
│           └── route.ts          # GET /api/recommend
│
├── components/                   # React Components
│   ├── ui/                       # Shadcn UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── slider.tsx
│   │   └── toast.tsx
│   │
│   ├── CameraCapture.tsx         # Webcam interface
│   ├── FaceDetector.tsx          # MediaPipe integration
│   ├── FaceShapeBadge.tsx        # Shape display
│   ├── HairstyleGallery.tsx      # Recommendations grid
│   ├── HairstylePreview.tsx      # Canvas overlay
│   ├── BeforeAfterSlider.tsx     # Comparison slider
│   ├── DownloadButton.tsx        # Export PNG
│   ├── LoadingOverlay.tsx        # Loading states
│   └── ErrorMessage.tsx          # Error handling
│
├── lib/                          # Core Logic
│   ├── faceDetection.ts          # MediaPipe utilities
│   ├── faceShapeClassifier.ts    # Classification algorithm
│   ├── hairstyleDatabase.ts      # Hairstyle data
│   ├── overlayEngine.ts          # Canvas rendering
│   ├── gemini.ts                 # Gemini API client
│   └── utils.ts                  # Helpers (cn, etc.)
│
├── hooks/                        # Custom Hooks
│   ├── useCamera.ts              # Camera access
│   ├── useFaceDetection.ts       # Detection loop
│   └── useOverlay.ts             # Canvas management
│
└── types/                        # TypeScript Types
    └── index.ts                  # All interfaces
```

---

## 3. Data Flow Diagrams

### 3.1 User Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Landing  │────▶│ Capture  │────▶│ Analyze  │────▶│ Results  │
│  Page    │     │  Photo   │     │   Face   │     │  Page    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                 │                │
                      ▼                 ▼                ▼
               ┌──────────┐     ┌──────────┐     ┌──────────┐
               │  WebRTC  │     │MediaPipe │     │  Canvas  │
               │  Camera  │     │+ Gemini  │     │ Overlay  │
               └──────────┘     └──────────┘     └──────────┘
```

### 3.2 Face Analysis Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FACE ANALYSIS FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

Step 1: Image Capture
┌──────────┐        ┌──────────┐        ┌──────────┐
│  Camera  │───────▶│  Canvas  │───────▶│ Base64   │
│  Stream  │        │ Capture  │        │  Image   │
└──────────┘        └──────────┘        └────┬─────┘
                                             │
                                             ▼
Step 2: Client-Side Detection         ┌──────────────┐
                                      │   MediaPipe  │
                                      │  Face Mesh   │
                                      │  (Browser)   │
                                      └──────┬───────┘
                                             │
                                             ▼
Step 3: Local Classification          ┌──────────────┐
                                      │   Calculate  │
                                      │ Measurements │
                                      │ & Classify   │
                                      └──────┬───────┘
                                             │
                                             ▼
Step 4: AI Validation (Optional)      ┌──────────────┐
                                      │   Gemini     │
                                      │   API Call   │
                                      │  (Validate)  │
                                      └──────┬───────┘
                                             │
                                             ▼
Step 5: Combine Results               ┌──────────────┐
                                      │    Final     │
                                      │ Face Shape   │
                                      │ + Confidence │
                                      └──────────────┘
```

### 3.3 Recommendation Data Flow

```
┌────────────┐        ┌────────────┐        ┌────────────┐
│   Face     │───────▶│   Query    │───────▶│ Hairstyle  │
│   Shape    │        │  Database  │        │   List     │
└────────────┘        └────────────┘        └─────┬──────┘
                                                  │
                           ┌──────────────────────┴──────────────────────┐
                           │                                             │
                           ▼                                             ▼
                    ┌────────────┐                               ┌────────────┐
                    │   Sort by  │                               │    Load    │
                    │  Score     │                               │  Images    │
                    └────────────┘                               └────────────┘
                           │                                             │
                           └──────────────────────┬──────────────────────┘
                                                  │
                                                  ▼
                                           ┌────────────┐
                                           │  Display   │
                                           │  Gallery   │
                                           └────────────┘
```

### 3.4 Preview Rendering Flow

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│   User     │   │  Hairstyle │   │  Landmarks │   │   Canvas   │
│   Image    │   │  Template  │   │   Array    │   │  Context   │
└─────┬──────┘   └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
      │                │                │                │
      │                │                │                │
      └────────────────┼────────────────┼────────────────┘
                       │                │
                       ▼                │
              ┌────────────────┐        │
              │   Calculate    │◀───────┘
              │   Position     │
              │   & Scale      │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │     Draw       │
              │   User Image   │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │     Draw       │
              │   Hairstyle    │
              │   (Overlay)    │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │    Display     │
              │    Preview     │
              └────────────────┘
```

---

## 4. State Management

### 4.1 Application State Structure

```typescript
// Global application state (React Context or props drilling)
interface AppState {
  // Current step in the flow
  step: 'landing' | 'capture' | 'analyzing' | 'results';
  
  // Captured image data
  capturedImage: string | null;  // Base64
  
  // Detection results
  landmarks: FaceLandmark[] | null;
  
  // Classification results
  classification: FaceClassification | null;
  
  // Recommendations
  recommendations: Hairstyle[];
  selectedHairstyle: Hairstyle | null;
  
  // UI state
  isLoading: boolean;
  loadingMessage: string;
  error: AppError | null;
}
```

### 4.2 State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                       STATE MACHINE                              │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │ LANDING  │
                    └────┬─────┘
                         │ [Start Analysis]
                         ▼
                    ┌──────────┐
         ┌─────────│ CAPTURE  │◀─────────┐
         │         └────┬─────┘          │
         │              │ [Capture/Upload]
         │              ▼                │
         │         ┌──────────┐          │
         │   ┌────▶│ANALYZING │──────────┤ [Error]
         │   │     └────┬─────┘          │
         │   │          │ [Success]      │
         │   │          ▼                │
         │   │     ┌──────────┐          │
         │   │     │ RESULTS  │──────────┘ [Try Another]
         │   │     └────┬─────┘
         │   │          │ [Start Over]
         │   │          │
         └───┴──────────┘
```

---

## 5. API Architecture

### 5.1 API Route Structure

```
/api
├── /analyze-face
│   └── route.ts
│       ├── POST - Analyze face shape
│       │   ├── Input: { image: base64 }
│       │   ├── Process: Validate → Gemini API → Parse
│       │   └── Output: { shape, confidence, reasoning }
│       │
│       └── Rate Limit: 15 req/min
│
└── /recommend
    └── route.ts
        └── GET - Get hairstyle recommendations
            ├── Input: ?shape=oval
            ├── Process: Query database → Sort → Return
            └── Output: { recommendations: Hairstyle[] }
```

### 5.2 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING                              │
└─────────────────────────────────────────────────────────────────┘

           ┌──────────────┐
           │   API Call   │
           └──────┬───────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
  ┌──────────┐        ┌──────────┐
  │ Success  │        │  Error   │
  └────┬─────┘        └────┬─────┘
       │                   │
       │          ┌────────┴────────┐
       │          │                 │
       │          ▼                 ▼
       │    ┌──────────┐     ┌──────────┐
       │    │Retryable │     │  Fatal   │
       │    │  Error   │     │  Error   │
       │    └────┬─────┘     └────┬─────┘
       │         │                │
       │         ▼                ▼
       │    ┌──────────┐     ┌──────────┐
       │    │  Retry   │     │  Show    │
       │    │ (3 max)  │     │  Error   │
       │    └────┬─────┘     │  + Help  │
       │         │           └──────────┘
       │         │
       └─────────┘
```

---

## 6. Performance Architecture

### 6.1 Loading Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOADING STRATEGY                             │
└─────────────────────────────────────────────────────────────────┘

Initial Load (Critical Path):
┌─────────────────────────────────────────────────────────────────┐
│  HTML → CSS → JS (Next.js bundle) → React Hydration             │
│  Target: < 3 seconds                                             │
└─────────────────────────────────────────────────────────────────┘

Deferred Load (On Demand):
┌─────────────────────────────────────────────────────────────────┐
│  MediaPipe WASM ─────▶ Load when camera opens                    │
│  Hairstyle images ───▶ Load when recommendations shown           │
│  Gemini request ─────▶ After local detection completes           │
└─────────────────────────────────────────────────────────────────┘

Preload Strategy:
┌─────────────────────────────────────────────────────────────────┐
│  1. Landing page loads                                           │
│  2. Prefetch MediaPipe WASM in background                       │
│  3. User clicks "Start" → WASM ready immediately                │
│  4. Face detected → Prefetch top 2 hairstyle images             │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     CACHING LAYERS                               │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Browser Cache (Static Assets)
├── Hairstyle PNGs ──────▶ Cache-Control: max-age=31536000
├── MediaPipe WASM ──────▶ Cache-Control: max-age=31536000
└── JS/CSS bundles ──────▶ Content hashed filenames

Layer 2: React State (Session)
├── Captured image ──────▶ useState (current session)
├── Landmarks ───────────▶ useState (current session)
└── Rendered previews ───▶ useMemo (avoid re-render)

Layer 3: API Response (Request)
├── Gemini results ──────▶ Don't cache (per-image)
└── Recommendations ─────▶ Static data, no API needed
```

---

## 7. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                             │
└─────────────────────────────────────────────────────────────────┘

1. Data Privacy
   ├── No user images stored on server
   ├── Images processed client-side when possible
   ├── Gemini API processes ephemerally
   └── No cookies or tracking

2. API Security
   ├── HTTPS only (Vercel enforced)
   ├── Rate limiting (15 req/min)
   ├── Input validation
   └── API key in environment variables

3. Client Security
   ├── Camera permission explicit consent
   ├── No localStorage of sensitive data
   ├── CSP headers (Next.js default)
   └── XSS prevention (React default)

4. Code Security
   ├── TypeScript strict mode
   ├── ESLint security rules
   ├── No eval() or unsafe patterns
   └── Dependency audit (npm audit)
```

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL DEPLOYMENT                              │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │   GitHub    │
                         │ Repository  │
                         └──────┬──────┘
                                │ Push to main
                                ▼
                         ┌─────────────┐
                         │   Vercel    │
                         │   CI/CD     │
                         └──────┬──────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │   Build    │   │  Deploy    │   │  Assign    │
       │  Next.js   │   │   Edge     │   │   Domain   │
       └────────────┘   └────────────┘   └────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │                     │
              ┌─────┴─────┐         ┌─────┴─────┐
              │  Static   │         │   Edge    │
              │   CDN     │         │ Functions │
              │ (Assets)  │         │  (APIs)   │
              └───────────┘         └───────────┘
```

---

*End of Architecture Documentation*
