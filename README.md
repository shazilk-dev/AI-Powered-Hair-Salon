# StyleAI - AI-Powered Hair Salon Recommendation System

A web application that uses computer vision to analyze facial features, classifies face shapes using AI, and recommends personalized hairstyles with interactive visual previews.

## Overview

StyleAI is an HCI course project that demonstrates Nielsen's 10 usability heuristics through a practical, user-focused application. Users can capture or upload a photo, have their face shape analyzed in real-time, and receive 5 personalized hairstyle recommendations with live preview capabilities.

### Key Features

- **Real-time Face Detection** - MediaPipe Face Mesh (468 facial landmarks)
- **AI-Powered Analysis** - Google Gemini 1.5 Flash for face shape classification
- **Smart Recommendations** - 30 curated hairstyles across 6 face shape categories
- **Interactive Previews** - Canvas-based hairstyle overlay with before/after comparison
- **Privacy-First** - Client-side processing, no user data storage
- **Zero Cost** - Built entirely on free-tier services
- **Mobile Responsive** - Works on devices from 320px to 2560px

## Architecture

### High-Level System Architecture

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

### User Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Landing  │────▶│ Capture  │────▶│ Analyze  │────▶│ Results  │
│  Page    │     │  Photo   │     │   Face   │     │  Page    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

1. User opens app and clicks "Start Analysis"
2. User captures photo via webcam or uploads image
3. System detects face using MediaPipe
4. AI classifies face shape (Oval, Round, Square, Heart, Oblong, Diamond)
5. User receives 5 personalized hairstyle recommendations
6. User previews hairstyles overlaid on their photo
7. User downloads styled image

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React

### Computer Vision & AI
- **Face Detection:** MediaPipe Face Mesh (@mediapipe/tasks-vision)
- **AI Classification:** Google Gemini 1.5 Flash
- **Image Processing:** HTML5 Canvas API

### Deployment
- **Platform:** Vercel (free tier)
- **CI/CD:** Automatic deployment on push to main

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm
- Google Gemini API key (free tier)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-hair-salon.git
cd ai-hair-salon
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

To get a free Gemini API key:
- Visit https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy and paste into `.env.local`

4. Run the development server

```bash
pnpm dev
```

5. Open http://localhost:3000 in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

### Deployment

Deploy to Vercel with one click:

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments on push.

## API Documentation

### POST /api/analyze-face

Analyzes a face image and returns the classified face shape.

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
    shape: FaceShape;           // "oval" | "round" | "square" | "heart" | "oblong" | "diamond"
    confidence: number;         // 0-100
    reasoning: string;          // AI explanation
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

**Example:**

```bash
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

**Rate Limits:**
- 15 requests per minute (Gemini free tier)
- Automatic retry with exponential backoff

**Error Codes:**
- `NO_FACE_DETECTED` - No face found in image
- `MULTIPLE_FACES` - More than one face detected
- `API_RATE_LIMITED` - Rate limit exceeded
- `API_ERROR` - Gemini API error
- `NETWORK_ERROR` - Connection failure

---

### GET /api/recommend

Retrieves hairstyle recommendations for a given face shape.

**Query Parameters:**

```
shape: FaceShape (required)
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    faceShape: FaceShape;
    recommendations: Hairstyle[];  // Array of 5 hairstyles
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**Hairstyle Object:**

```typescript
{
  id: string;
  name: string;
  category: FaceShape;
  imagePath: string;
  thumbnailPath: string;
  description: string;
  suitabilityScore: number;  // 0-100
  reasoning: string;
  tags: string[];
}
```

**Example:**

```bash
curl http://localhost:3000/api/recommend?shape=oval
```

**Response:**

```json
{
  "success": true,
  "data": {
    "faceShape": "oval",
    "recommendations": [
      {
        "id": "oval-1",
        "name": "Long Layers",
        "category": "oval",
        "imagePath": "/hairstyles/oval/long-layers.png",
        "description": "Flowing, face-framing layers...",
        "suitabilityScore": 95,
        "reasoning": "Oval faces can pull off almost any style...",
        "tags": ["versatile", "feminine", "professional"]
      }
      // ... 4 more recommendations
    ]
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles
│   ├── analyze/
│   │   └── page.tsx               # Main analysis flow
│   └── api/
│       ├── analyze-face/
│       │   └── route.ts           # Face analysis endpoint
│       └── recommend/
│           └── route.ts           # Recommendations endpoint
│
├── components/
│   ├── ui/                        # Shadcn UI primitives
│   ├── CameraCapture.tsx          # Webcam interface
│   ├── FaceDetector.tsx           # MediaPipe integration
│   ├── HairstyleGallery.tsx       # Recommendations grid
│   ├── HairstylePreview.tsx       # Canvas overlay
│   └── BeforeAfterSlider.tsx      # Comparison UI
│
├── lib/
│   ├── faceDetection.ts           # MediaPipe utilities
│   ├── faceShapeClassifier.ts     # Classification algorithm
│   ├── hairstyleDatabase.ts       # Hairstyle data
│   ├── overlayEngine.ts           # Canvas rendering
│   ├── gemini.ts                  # Gemini API client
│   └── utils.ts                   # Helper functions
│
├── hooks/
│   ├── useCamera.ts               # Camera access hook
│   ├── useFaceDetection.ts        # Detection hook
│   └── useOverlay.ts              # Canvas management
│
└── types/
    └── index.ts                   # TypeScript interfaces
```

## Face Shape Categories

| Shape | Characteristics | Width:Height Ratio |
|-------|----------------|-------------------|
| **Oval** | Balanced, slightly longer than wide | 0.70 - 0.75 |
| **Round** | Width ≈ height, soft curves | > 0.85 |
| **Square** | Strong jaw, angular features | 0.85 - 1.0 |
| **Heart** | Wide forehead, narrow chin | Variable |
| **Oblong** | Long face, narrow width | < 0.65 |
| **Diamond** | Wide cheekbones, narrow forehead/jaw | Variable |

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial page load | < 3 seconds |
| Face detection | < 2 seconds |
| Style preview render | < 3 seconds |
| Style switching | < 500ms |
| Total workflow | < 30 seconds |
| Lighthouse score | > 90 |

## HCI Principles Demonstrated

This project implements Nielsen's 10 Usability Heuristics:

1. **Visibility of System Status** - Loading indicators, progress feedback
2. **User Control & Freedom** - Back buttons, retry options, restart capability
3. **Consistency & Standards** - Uniform styling, predictable behavior
4. **Error Prevention** - Validation, disabled states, confirmations
5. **Recognition over Recall** - Visual thumbnails, clear labels
6. **Flexibility & Efficiency** - Works for novice and expert users
7. **Aesthetic & Minimalist Design** - Clean UI, no clutter
8. **Help Users with Errors** - Clear messages, recovery options
9. **Feedback** - Immediate response to all actions
10. **Affordances** - Buttons look clickable, sliders look draggable

## Development Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm type-check            # TypeScript check

# Testing
pnpm test                   # Run tests
pnpm test:coverage         # With coverage

# Deployment
vercel                      # Deploy preview
vercel --prod              # Deploy production
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Note: MediaPipe requires WebAssembly support.

## Privacy & Security

- **No Data Storage:** Images are processed in-memory only
- **Client-Side Processing:** Face detection runs in the browser
- **Ephemeral API Calls:** Gemini API processes images without retention
- **No Tracking:** No cookies, analytics, or user accounts
- **HTTPS Only:** Secure communication enforced by Vercel

## Known Limitations

- Requires good lighting for accurate detection
- Works best with front-facing photos
- One face per image
- Gemini API limited to 15 requests/minute (free tier)

## Contributing

This is an academic project for HCI coursework. While contributions are not actively sought, feedback and suggestions are welcome.

## License

This project is developed as coursework and is not licensed for commercial use.

## Acknowledgments

- **MediaPipe** - Google's open-source face detection
- **Gemini AI** - Google's generative AI for classification
- **Shadcn/ui** - Beautiful UI components
- **Vercel** - Hosting and deployment platform

## Project Timeline

**Duration:** 7 Days
**Status:** In Development
**Deadline:** December 18, 2025

---

**Developer:** Solo Project
**Course:** Human-Computer Interaction
**Institution:** [Your Institution]
**Year:** 2025

For questions or support, please open an issue on GitHub.
