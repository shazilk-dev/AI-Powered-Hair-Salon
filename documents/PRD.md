# **PROJECT REQUIREMENTS DOCUMENT**

## **AI-Powered Hair Salon Recommendation System**

---

## **DOCUMENT CONTROL**

| **Version**         | 1.0                          |
| ------------------- | ---------------------------- |
| **Date**            | December 2025                |
| **Project Type**    | HCI Course Project           |
| **Budget**          | $0 (Free tier services only) |
| **Duration**        | 7 Days                       |
| **Document Status** | Final                        |

---

## **1. EXECUTIVE SUMMARY**

### **1.1 Project Vision**

An intelligent, real-time web application that analyzes facial features through computer vision and recommends personalized hairstyles, providing users with instant visual previews through an intuitive interface.

### **1.2 Core Value Proposition**

- **User Benefit:** Eliminate hairstyle uncertainty before salon visits
- **Technical Innovation:** Combines AI face analysis with interactive visualization
- **HCI Excellence:** Demonstrates real-time feedback, visual affordances, and user control

### **1.3 Key Constraints**

- ✅ **Zero cost** - All technologies must be free tier
- ✅ **Solo development** - 1 developer, 7 days
- ✅ **No app store** - PWA deployment only
- ✅ **Academic focus** - HCI principles prioritized over CV research

---

## **2. PROJECT OBJECTIVES**

### **2.1 Primary Objectives**

1. **Functional:** Deliver a working hairstyle recommendation system with visual preview
2. **Academic:** Demonstrate 5+ HCI principles in practice
3. **Technical:** Showcase modern AI/ML integration in web applications
4. **Portfolio:** Create a deployable, shareable project for career advancement

### **2.2 Learning Outcomes**

- Apply user-centered design methodology
- Integrate computer vision APIs effectively
- Implement responsive, accessible web interfaces
- Conduct usability evaluation and iterate

---

## **3. SCOPE DEFINITION**

### **3.1 In Scope**

**Core Features:**

- ✅ Real-time webcam face capture
- ✅ Automated face detection with landmark visualization
- ✅ AI-powered face shape classification (6 categories)
- ✅ Personalized hairstyle recommendations (5 styles per shape)
- ✅ Interactive hairstyle preview system
- ✅ Before/after comparison interface
- ✅ Image download functionality
- ✅ Mobile-responsive design

**Deliverables:**

- ✅ Deployed Progressive Web App
- ✅ IEEE-format research paper (6-8 pages)
- ✅ Presentation slides (15-20 slides)
- ✅ Demo video (3-5 minutes)
- ✅ GitHub repository with documentation

### **3.2 Out of Scope**

- ❌ User authentication/accounts
- ❌ Hairstyle color customization
- ❌ 3D modeling or AR features
- ❌ Appointment booking system
- ❌ Payment processing
- ❌ Native mobile apps (iOS/Android)
- ❌ Backend database for user history
- ❌ AI model training from scratch

### **3.3 Future Enhancements (Post-Submission)**

- Virtual hair coloring
- Style history tracking
- Social sharing features
- Salon locator integration

---

## **4. FUNCTIONAL REQUIREMENTS**

### **4.1 User Stories**

**US-01: Image Capture**

- **As a** salon customer
- **I want to** take a photo using my device camera
- **So that** the system can analyze my face shape

**US-02: Face Analysis**

- **As a** user
- **I want** the system to automatically detect my face shape
- **So that** I receive personalized recommendations

**US-03: Style Recommendations**

- **As a** user
- **I want to** see 5 hairstyle suggestions for my face shape
- **So that** I can explore suitable options

**US-04: Visual Preview**

- **As a** user
- **I want to** see how each hairstyle looks on my actual photo
- **So that** I can make an informed decision

**US-05: Comparison**

- **As a** user
- **I want to** compare my original photo with styled versions
- **So that** I can see the transformation clearly

**US-06: Save Result**

- **As a** user
- **I want to** download my styled photo
- **So that** I can show it to my hairstylist

### **4.2 Functional Modules**

#### **Module 1: Image Acquisition**

**FR-01:** System shall access device camera with user permission  
**FR-02:** System shall capture still images at minimum 720p resolution  
**FR-03:** System shall allow retaking photo if user is unsatisfied  
**FR-04:** System shall provide visual framing guide for optimal face position  
**FR-05:** System shall validate image quality (blur detection, lighting check)

#### **Module 2: Face Detection & Analysis**

**FR-06:** System shall detect faces in captured images within 2 seconds  
**FR-07:** System shall identify 68 facial landmarks minimum  
**FR-08:** System shall visualize detected face boundaries  
**FR-09:** System shall calculate face shape using landmark geometry  
**FR-10:** System shall classify into 6 categories: Oval, Round, Square, Heart, Oblong, Diamond  
**FR-11:** System shall provide confidence score for classification

#### **Module 3: Recommendation Engine**

**FR-12:** System shall retrieve 5 pre-matched hairstyles per face shape  
**FR-13:** System shall rank recommendations by suitability score  
**FR-14:** System shall provide brief description for each style  
**FR-15:** System shall explain why each style suits the face shape  
**FR-16:** System shall use Gemini AI for contextual recommendations

#### **Module 4: Visualization**

**FR-17:** System shall overlay hairstyle templates on user photo  
**FR-18:** System shall align hairstyles using detected facial landmarks  
**FR-19:** System shall scale hairstyles proportionally to face size  
**FR-20:** System shall blend edges for natural appearance  
**FR-21:** System shall render previews within 3 seconds per style  
**FR-22:** System shall allow switching between styles instantly

#### **Module 5: User Interface**

**FR-23:** System shall display before/after slider for comparison  
**FR-24:** System shall show thumbnail grid of all recommended styles  
**FR-25:** System shall highlight currently selected style  
**FR-26:** System shall provide "Try Another Style" option  
**FR-27:** System shall show loading indicators during processing  
**FR-28:** System shall display error messages clearly

#### **Module 6: Output**

**FR-29:** System shall generate downloadable PNG image (1080p)  
**FR-30:** System shall embed face shape info in filename  
**FR-31:** System shall optimize file size (<2MB)

---

## **5. NON-FUNCTIONAL REQUIREMENTS**

### **5.1 Performance**

**NFR-01:** Face detection response time: <2 seconds  
**NFR-02:** Hairstyle overlay rendering: <3 seconds  
**NFR-03:** Total workflow completion: <15 seconds  
**NFR-04:** Page load time: <3 seconds (initial)  
**NFR-05:** API calls: Batch requests to minimize latency  
**NFR-06:** Client-side processing: Leverage browser for face detection

### **5.2 Usability (HCI Principles)**

**NFR-07:** **Visibility:** All system status visible (loading, progress, errors)  
**NFR-08:** **Feedback:** Immediate response to all user actions (<100ms acknowledgment)  
**NFR-09:** **Consistency:** Uniform button styles, colors, terminology  
**NFR-10:** **Error Prevention:** Disable invalid actions, validate inputs  
**NFR-11:** **Recognition over Recall:** Icons with labels, clear navigation  
**NFR-12:** **Flexibility:** Keyboard navigation support  
**NFR-13:** **Aesthetic:** Clean, professional interface (Gestalt principles)  
**NFR-14:** **Help:** Inline tooltips, first-time user guide

### **5.3 Accessibility (WCAG 2.1 Level AA)**

**NFR-15:** Minimum contrast ratio: 4.5:1 for text  
**NFR-16:** Keyboard navigation: All features accessible via keyboard  
**NFR-17:** Screen reader: ARIA labels on all interactive elements  
**NFR-18:** Focus indicators: Visible on all focusable elements  
**NFR-19:** Alternative text: Descriptive alt text for images  
**NFR-20:** Responsive design: Mobile (320px) to desktop (1920px)

### **5.4 Compatibility**

**NFR-21:** Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
**NFR-22:** Devices: Desktop, tablet, mobile (iOS 14+, Android 10+)  
**NFR-23:** Camera: WebRTC-compatible devices  
**NFR-24:** Screen sizes: 320px to 2560px width

### **5.5 Reliability**

**NFR-25:** Uptime: 99.5% (Vercel SLA)  
**NFR-26:** Error handling: Graceful degradation, no app crashes  
**NFR-27:** Offline: Display meaningful error if no internet  
**NFR-28:** Data loss: No user data stored = no data loss risk

### **5.6 Security & Privacy**

**NFR-29:** No image storage: All processing client-side or ephemeral  
**NFR-30:** HTTPS only: Enforced via Vercel  
**NFR-31:** No third-party tracking: No analytics/cookies  
**NFR-32:** Camera permission: Explicit user consent required  
**NFR-33:** Data transmission: Images only sent to Gemini API (encrypted)

### **5.7 Scalability**

**NFR-34:** Concurrent users: 50+ (Vercel free tier limit)  
**NFR-35:** API rate limiting: Handle Gemini's 15 req/min gracefully  
**NFR-36:** Stateless design: No backend bottlenecks

### **5.8 Maintainability**

**NFR-37:** Code documentation: JSDoc comments on all functions  
**NFR-38:** Type safety: TypeScript for all components  
**NFR-39:** Modular design: Reusable components  
**NFR-40:** Version control: Git with meaningful commits  
**NFR-41:** README: Setup instructions, architecture diagram

---

## **6. TECHNICAL ARCHITECTURE**

### **6.1 System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Browser)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js UI  │  │ MediaPipe.js │  │  Canvas API  │      │
│  │  (React)     │  │ (Face Detect)│  │  (Overlay)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Serverless)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Next.js API Routes (Vercel Edge Functions)      │   │
│  │  • /api/analyze-face (Gemini integration)            │   │
│  │  • /api/recommend (Logic layer)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES (Free Tier)               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Google Gemini Vision API (Free)              │   │
│  │         • Face shape analysis                        │   │
│  │         • Contextual recommendations                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### **6.2 Technology Stack (All Free Tier)**

| **Layer**            | **Technology**      | **Version** | **Cost** | **Purpose**                    |
| -------------------- | ------------------- | ----------- | -------- | ------------------------------ |
| **Frontend**         | Next.js             | 14.x        | Free     | React framework                |
|                      | TypeScript          | 5.x         | Free     | Type safety                    |
|                      | Tailwind CSS        | 3.x         | Free     | Styling                        |
|                      | Shadcn/ui           | Latest      | Free     | UI components                  |
| **Computer Vision**  | MediaPipe Face Mesh | Latest      | Free     | Face detection (468 landmarks) |
|                      | OR face-api.js      | 0.22.x      | Free     | Alternative face detection     |
| **AI/ML**            | Google Gemini       | 1.5 Flash   | Free     | Face analysis (15 req/min)     |
| **Image Processing** | Canvas API          | Native      | Free     | Browser-based manipulation     |
|                      | Fabric.js           | 5.x         | Free     | Advanced positioning           |
| **Hosting**          | Vercel              | Free Tier   | Free     | Deployment + CDN               |
| **Version Control**  | GitHub              | Free        | Free     | Code repository                |
| **Package Manager**  | npm/pnpm            | Latest      | Free     | Dependencies                   |

### **6.3 Data Flow Diagram**

```
User Action: Click "Capture Photo"
        ↓
[WebRTC Camera Access] → Display live preview
        ↓
User Action: Confirm Capture
        ↓
[Canvas API] → Capture image as base64
        ↓
[MediaPipe/face-api] → Detect face landmarks (client-side)
        ↓
Decision: Face detected?
    NO → Display error: "No face detected, please retry"
    YES ↓
[Calculate face measurements] → Width/height ratios from landmarks
        ↓
[Next.js API Route] → Send base64 + landmarks to backend
        ↓
[Gemini Vision API] → Analyze face shape + context
        ↓
[Recommendation Engine] → Match shape to hairstyle database
        ↓
[Return 5 hairstyles] → JSON response to frontend
        ↓
[Canvas + Fabric.js] → Overlay templates on user image
        ↓
[Display gallery] → Show all 5 previews
        ↓
User Action: Select favorite style
        ↓
[Before/After slider] → Interactive comparison
        ↓
User Action: Download
        ↓
[Canvas.toBlob()] → Generate PNG file
        ↓
[Browser download] → Save to device
```

### **6.4 Component Architecture**

```typescript
src/
├── app/
│   ├── page.tsx                    // Landing page
│   ├── analyze/page.tsx            // Main application
│   ├── api/
│   │   ├── analyze-face/route.ts   // Gemini integration
│   │   └── recommend/route.ts      // Recommendation logic
│   └── layout.tsx                  // Root layout
├── components/
│   ├── CameraCapture.tsx           // Webcam interface
│   ├── FaceDetector.tsx            // MediaPipe wrapper
│   ├── HairstyleGallery.tsx        // Style thumbnails
│   ├── HairstylePreview.tsx        // Overlay renderer
│   ├── BeforeAfter.tsx             // Comparison slider
│   └── DownloadButton.tsx          // Export functionality
├── lib/
│   ├── faceDetection.ts            // MediaPipe utilities
│   ├── faceShapeClassifier.ts     // Geometry calculations
│   ├── hairstyleDatabase.ts        // Style definitions
│   └── imageProcessing.ts          // Canvas operations
├── types/
│   └── index.ts                    // TypeScript interfaces
└── public/
    └── hairstyles/                 // PNG template library
        ├── oval/
        ├── round/
        ├── square/
        ├── heart/
        ├── oblong/
        └── diamond/
```

---

## **7. USER INTERFACE DESIGN**

### **7.1 Information Architecture**

```
Home Page
    └─→ Start Analysis (CTA)
            │
            ├─→ Camera Capture Screen
            │       ├─→ Live Preview
            │       ├─→ Framing Guide
            │       └─→ Capture Button
            │               │
            │               └─→ Face Detection (Auto)
            │                       │
            │                       ├─→ Success
            │                       │       │
            │                       │       └─→ Results Screen
            │                       │               ├─→ Face Shape Badge
            │                       │               ├─→ 5 Hairstyle Cards
            │                       │               ├─→ Preview Area
            │                       │               ├─→ Before/After Slider
            │                       │               └─→ Download Button
            │                       │
            │                       └─→ Failure
            │                               └─→ Error Message + Retry
            │
            └─→ Upload Photo (Alternative path - same flow)
```

### **7.2 Wireframes (Key Screens)**

**Screen 1: Landing Page**

```
┌────────────────────────────────────────┐
│           [App Logo]                   │
│                                        │
│   AI-Powered Hairstyle Recommender    │
│   Find Your Perfect Look Instantly     │
│                                        │
│        [Start Analysis →]              │
│                                        │
│   • Instant AI Analysis                │
│   • Personalized Recommendations       │
│   • Visual Preview                     │
└────────────────────────────────────────┘
```

**Screen 2: Camera Capture**

```
┌────────────────────────────────────────┐
│  [←Back]         Camera         [?Help]│
├────────────────────────────────────────┤
│                                        │
│    ╔══════════════════════════╗       │
│    ║                          ║       │
│    ║    [Live Camera Feed]    ║       │
│    ║                          ║       │
│    ║     ┌─────────────┐      ║       │
│    ║     │  Face Guide │      ║       │
│    ║     └─────────────┘      ║       │
│    ╚══════════════════════════╝       │
│                                        │
│  Position your face within the frame  │
│                                        │
│          [📷 Capture Photo]            │
│                                        │
└────────────────────────────────────────┘
```

**Screen 3: Results & Preview**

```
┌────────────────────────────────────────┐
│  Your Face Shape: OVAL ✓               │
├────────────────────────────────────────┤
│  Recommended Hairstyles:               │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌───│
│  │ S1  │ │ S2  │ │ S3  │ │ S4  │ │ S5│
│  └─────┘ └─────┘ └─────┘ └─────┘ └───│
│         [Currently viewing: Style 1]   │
├────────────────────────────────────────┤
│                                        │
│    [Interactive Before/After Image]    │
│            <═══ slider ═══>           │
│                                        │
├────────────────────────────────────────┤
│  Why This Works:                       │
│  "Long layers complement oval faces    │
│   by adding volume..."                 │
│                                        │
│  [Download Image] [Try Another Style]  │
└────────────────────────────────────────┘
```

### **7.3 UI Components Specification**

**Primary Button:**

- Background: #3B82F6 (blue-500)
- Hover: #2563EB (blue-600)
- Padding: 12px 24px
- Border-radius: 8px
- Font: 16px, semibold

**Hairstyle Card:**

- Size: 120px × 160px
- Border: 2px solid transparent
- Active: 2px solid #3B82F6
- Hover: Scale 1.05, shadow-lg
- Image: 120px × 120px (top)
- Label: 14px, center-aligned (bottom)

**Before/After Slider:**

- Handle: 40px circle, white with shadow
- Line: 2px solid white
- Drag: Cursor grab/grabbing
- Mobile: Touch-enabled

---

## **8. HAIRSTYLE DATABASE DESIGN**

### **8.1 Face Shape Categories & Characteristics**

| **Shape**   | **Measurements**           | **Characteristics**                             |
| ----------- | -------------------------- | ----------------------------------------------- |
| **Oval**    | Width 0.7-0.75 × Height    | Balanced proportions, slightly longer than wide |
| **Round**   | Width ≈ Height             | Width and height nearly equal, soft curves      |
| **Square**  | Width 0.85-1.0 × Height    | Wide forehead, strong jawline, angular          |
| **Heart**   | Wide forehead, narrow chin | Forehead wider than jaw, pointed chin           |
| **Oblong**  | Width < 0.65 × Height      | Significantly longer than wide                  |
| **Diamond** | Wide cheekbones            | Narrow forehead and jaw, wide mid-face          |

### **8.2 Hairstyle Recommendation Matrix**

**Oval Face (30 styles total - 5 featured):**

1. **Long Layers** - Adds movement
2. **Textured Crop** - Modern, versatile
3. **Side Part Classic** - Professional
4. **Messy Quiff** - Casual, trendy
5. **Slicked Back** - Formal

**Round Face (30 styles):**

1. **High Fade + Volume Top** - Creates height
2. **Angular Fringe** - Adds angles
3. **Side-Swept Undercut** - Asymmetry
4. **Pompadour** - Vertical emphasis
5. **Short Textured Crop** - Clean lines

**Square Face (30 styles):**

1. **Soft Waves** - Softens angles
2. **Layered Fringe** - Reduces forehead width
3. **Textured Brush Up** - Balances jaw
4. **Shoulder-Length Layers** - Adds softness
5. **Side Part with Texture** - Asymmetrical

**Heart Face (30 styles):**

1. **Full Fringe** - Balances forehead
2. **Chin-Length Bob** - Adds width at jaw
3. **Side Part Waves** - Widens lower face
4. **Textured Crop** - Proportional
5. **Layered Medium** - Fullness at jaw

**Oblong Face (30 styles):**

1. **Horizontal Layers** - Adds width
2. **Full Fringe** - Shortens appearance
3. **Chin-Length Blunt Cut** - Widens
4. **Side-Swept Bangs** - Breaks length
5. **Textured Crop** - Volume on sides

**Diamond Face (30 styles):**

1. **Side-Swept Fringe** - Balances cheekbones
2. **Chin-Length Layers** - Adds jaw width
3. **Textured Quiff** - Adds forehead width
4. **Full Beard + Short Hair** - Balances
5. **Slicked Side Part** - Smooth lines

### **8.3 Template File Structure**

```
/public/hairstyles/
├── oval/
│   ├── long-layers.png           (transparent PNG, 1500×2000px)
│   ├── textured-crop.png
│   ├── side-part-classic.png
│   ├── messy-quiff.png
│   └── slicked-back.png
├── round/
│   ├── high-fade-volume.png
│   └── ... (5 files)
├── square/
├── heart/
├── oblong/
└── diamond/

Total: 30 PNG files (6 categories × 5 styles)
```

**Template Specifications:**

- Format: PNG with alpha transparency
- Resolution: 1500×2000px (portrait)
- File size: <500KB each
- Hair only: No face/skin (transparent background)
- Anchor point: Top-center of forehead

---

## **9. TESTING STRATEGY**

### **9.1 Test Levels**

#### **Unit Testing**

- Face shape classification algorithm
- Landmark detection accuracy
- Image overlay positioning
- API request/response handlers

#### **Integration Testing**

- Camera → Detection → Analysis workflow
- API → Recommendation engine
- Overlay rendering pipeline

#### **System Testing**

- End-to-end user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

#### **Usability Testing**

- 5-8 participants (friends/classmates)
- Think-aloud protocol
- Task completion rates
- SUS (System Usability Scale) questionnaire

### **9.2 Test Cases (Sample)**

| **ID** | **Test Case**                    | **Expected Result**                  | **Priority** |
| ------ | -------------------------------- | ------------------------------------ | ------------ |
| TC-01  | User grants camera permission    | Camera feed displays                 | High         |
| TC-02  | User captures photo with face    | Face detected within 2s              | High         |
| TC-03  | User captures photo without face | Error message shown                  | High         |
| TC-04  | User selects hairstyle           | Preview renders in <3s               | High         |
| TC-05  | User downloads image             | PNG file saved correctly             | Medium       |
| TC-06  | User tries on mobile             | UI fully responsive                  | High         |
| TC-07  | Multiple faces in frame          | System handles gracefully            | Medium       |
| TC-08  | Poor lighting conditions         | Detection still works or error shown | Medium       |
| TC-09  | User navigates with keyboard     | All features accessible              | Low          |
| TC-10  | API rate limit exceeded          | Retry logic engages                  | Low          |

### **9.3 Usability Metrics**

**Quantitative:**

- Task success rate: Target >90%
- Time on task: <60 seconds (capture to download)
- Error rate: <10% (failed detections)
- SUS score: Target >70 (above average)

**Qualitative:**

- User satisfaction interviews
- Preference ranking of hairstyles
- Perceived realism of previews
- Improvement suggestions

---

## **10. IMPLEMENTATION TIMELINE**

### **Day 1 (December 12): Foundation**

**Morning (4 hours):**

- ✅ Initialize Next.js 14 project with TypeScript
- ✅ Setup Tailwind CSS + Shadcn/ui
- ✅ Configure Vercel deployment
- ✅ Create GitHub repository

**Afternoon (4 hours):**

- ✅ Build landing page UI
- ✅ Design camera capture component
- ✅ Implement WebRTC camera access
- ✅ Create basic navigation flow

**Deliverable:** Working UI skeleton deployed to Vercel

---

### **Day 2 (December 13): Computer Vision**

**Morning (4 hours):**

- ✅ Integrate MediaPipe Face Mesh
- ✅ Implement face detection visualization
- ✅ Create landmark extraction utilities
- ✅ Test detection accuracy (various angles/lighting)

**Afternoon (4 hours):**

- ✅ Build face shape classification algorithm
- ✅ Calculate width/height ratios
- ✅ Test with sample images
- ✅ Debug edge cases

**Deliverable:** Reliable face detection working locally

---

### **Day 3 (December 14): AI Integration**

**Morning (4 hours):**

- ✅ Setup Gemini API (free tier)
- ✅ Create `/api/analyze-face` endpoint
- ✅ Implement base64 image upload
- ✅ Parse Gemini responses

**Afternoon (4 hours):**

- ✅ Build recommendation engine logic
- ✅ Create hairstyle database structure
- ✅ Map face shapes to styles
- ✅ Test recommendation accuracy

**Deliverable:** AI analysis returning face shape + suggestions

---

### **Day 4 (December 15): Hairstyle Templates**

**Morning (4 hours):**

- ✅ Source/create 30 hairstyle PNG templates
- ✅ Optimize images (transparent backgrounds)
- ✅ Organize into folder structure
- ✅ Document each style (name, description)

**Afternoon (4 hours):**

- ✅ Implement Canvas-based overlay system
- ✅ Calculate hairstyle positioning from landmarks
- ✅ Add scaling and rotation logic
- ✅ Test alignment on various face sizes

**Deliverable:** Basic hairstyle overlay working

---

### **Day 5 (December 16): Interactive Preview**

**Morning (4 hours):**

- ✅ Build hairstyle gallery component
- ✅ Implement style switching
- ✅ Create before/after slider
- ✅ Add smooth transitions

**Afternoon (4 hours):**

- ✅ Refine overlay blending
- ✅ Improve rendering quality
- ✅ Optimize performance
- ✅ Add loading states

**Deliverable:** Full preview experience functional

---

### **Day 6 (December 17): Polish & Testing**

**Morning (4 hours):**

- ✅ Implement download functionality
- ✅ Add error handling throughout
- ✅ Create loading indicators
- ✅ Build help tooltips

**Afternoon (4 hours):**

- ✅ Mobile responsiveness fixes
- ✅ Cross-browser testing
- ✅ Performance optimization
- ✅ Accessibility improvements (ARIA labels)

**Evening (2 hours):**

- ✅ Conduct user testing (3-5 participants)
- ✅ Collect feedback
- ✅ Identify quick wins

**Deliverable:** Production-ready application

---

### **Day 7 (December 18): Documentation & Presentation**

**Morning (3 hours):**

- ✅ Record demo video (3-5 min)
- ✅ Write GitHub README
- ✅ Create architecture diagrams
- ✅ Document API usage

**Afternoon (5 hours):**

- ✅ Start IEEE paper (6-8 pages)
  - Abstract, Introduction, Related Work
  - Methodology, Implementation
  - Results, Discussion, Conclusion
- ✅ Create presentation slides (15-20)
- ✅ Prepare live demo script

**Deliverable:** All submission materials ready

---

### **Contingency Buffer**

**If ahead of schedule:**

- Add hairstyle color adjustment
- Implement style rating system
- Create admin panel for adding styles

**If behind schedule:**

- Reduce hairstyle templates to 3 per category (18 total)
- Simplify overlay to basic positioning (no blending)
- Use pre-recorded demo video instead of live

---

## **11. RISK MANAGEMENT**

| **Risk**                               | **Probability** | **Impact** | **Mitigation Strategy**                           |
| -------------------------------------- | --------------- | ---------- | ------------------------------------------------- |
| Camera access denied by browser        | Medium          | High       | Clear permission instructions, fallback to upload |
| Face detection fails in poor lighting  | High            | Medium     | Add lighting check, guide users, allow retakes    |
| Gemini API rate limit hit              | Low             | Medium     | Implement exponential backoff, cache results      |
| Hairstyle overlays look unrealistic    | Medium          | High       | Use high-quality templates, refine blending       |
| Cross-browser compatibility issues     | Medium          | Medium     | Test early on Chrome, Firefox, Safari             |
| Mobile performance lag                 | Medium          | High       | Optimize images, lazy load, reduce processing     |
| API costs exceed $0                    | Low             | High       | Monitor usage, use free tier only, no credit card |
| Usability testing reveals major issues | Medium          | High       | Test Day 6, allocate time for fixes               |
| Paper/presentation incomplete          | Low             | High       | Start documentation Day 7, use templates          |
| Scope creep (adding features)          | High            | Medium     | Strict scope adherence, defer enhancements        |

---

## **12. SUCCESS CRITERIA**

### **12.1 Functional Success**

- ✅ System detects faces with >85% accuracy
- ✅ Recommendations complete in <15 seconds
- ✅ Visual previews render correctly
- ✅ Download generates valid PNG files
- ✅ Works on desktop + mobile

### **12.2 Technical Success**

- ✅ Zero runtime errors in production
- ✅ 100% free tier usage (no costs)
- ✅ Deployed to public URL
- ✅ Code on GitHub with documentation

### **12.3 Academic Success**

- ✅ Demonstrates 5+ HCI principles
- ✅ IEEE paper completed (6-8 pages)
- ✅ Presentation ready (15-20 slides)
- ✅ Usability test conducted (5+ users)
- ✅ SUS score >70

### **12.4 Portfolio Success**

- ✅ Professional UI/UX design
- ✅ Demo video showcasing features
- ✅ Shareable link for recruiters
- ✅ Well-documented codebase

---

## **13. CONSTRAINTS & ASSUMPTIONS**

### **13.1 Hard Constraints**

1. **Budget:** $0 - No paid services allowed
2. **Time:** 7 days maximum
3. **Resources:** 1 developer (solo project)
4. **Technology:** Must use web technologies (no native apps)

### **13.2 Technical Assumptions**

1. Users have devices with cameras (webcam or phone)
2. Modern browser support (Chrome/Firefox/Safari latest)
3. Internet connection available (for API calls)
4. Gemini API free tier sufficient (15 req/min)
5. Vercel free tier handles expected traffic

### **13.3 User Assumptions**

1. Target users: Adults (18-45) considering hairstyle changes
2. Technical proficiency: Basic (can use camera on phone/laptop)
3. Use case: Pre-salon decision making
4. Testing pool: University students/friends available

### **13.4 Academic Assumptions**

1. Professors value working demo over perfect code
2. HCI principles application more important than CV novelty
3. Using pre-trained models acceptable (not building from scratch)
4. Usability testing with 5-8 participants sufficient
5. 6-8 page paper adequate for course requirements

---

## **14. APPENDICES**

### **Appendix A: HCI Principles Checklist**

**Nielsen's 10 Usability Heuristics:**

1. ✅ **Visibility of system status:** Loading indicators, progress bars
2. ✅ **Match system & real world:** "Capture Photo" not "Acquire Image"
3. ✅ **User control & freedom:** Retake photo, try different styles
4. ✅ **Consistency & standards:** Uniform buttons, terminology
5. ✅ **Error prevention:** Disable actions when invalid
6. ✅ **Recognition over recall:** Icons with labels, visible options
7. ✅ **Flexibility & efficiency:** Works for novices and power users
8. ✅ **Aesthetic & minimalist:** Clean UI, no clutter
9. ✅ **Help users recognize errors:** Clear error messages
10. ✅ **Help & documentation:** Inline tooltips, FAQ

**Additional HCI Concepts:**

- ✅ **Affordances:** Buttons look clickable, slider looks draggable
- ✅ **Feedback:** Immediate response to all actions
- ✅ **Constraints:** Physical (camera frame), logical (only one style at a time)
- ✅ **Mapping:** Slider position maps to before/after view
- ✅ **Gestalt Principles:** Grouping related elements, visual hierarchy

---

### **Appendix B: API Documentation (Gemini)**

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**Request:**

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Analyze this face and classify its shape (oval/round/square/heart/oblong/diamond). Provide confidence score and reasoning."
        },
        {
          "inline_data": { "mime_type": "image/jpeg", "data": "BASE64_STRING" }
        }
      ]
    }
  ]
}
```

**Response:**

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Face Shape: OVAL (85% confidence). Reasoning: Balanced proportions with width approximately 75% of height..."
          }
        ]
      }
    }
  ]
}
```

**Rate Limits (Free Tier):**

- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

---

### **Appendix C: Deployment Checklist**

**Pre-Deployment:**

- [ ] Remove console.logs
- [ ] Verify all images optimized
- [ ] Test on incognito/private mode
- [ ] Check HTTPS enforcement
- [ ] Validate meta tags (SEO)
- [ ] Test camera permissions flow

**Vercel Configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

**Post-Deployment:**

- [ ] Test on production URL
- [ ] Verify API calls working
- [ ] Check mobile responsiveness
- [ ] Monitor error logs (first 24h)
- [ ] Share link for feedback

---

### **Appendix D: Presentation Outline**

**Slide Structure (15-20 slides, 10-15 min):**

1. **Title Slide** - Project name, your name, date
2. **Problem Statement** - Hairstyle uncertainty before salon visits
3. **Solution Overview** - AI-powered recommendation system
4. **HCI Motivation** - Why this project matters for UX
5. **System Architecture** - High-level diagram
6. **Technology Stack** - Tools used (with logos)
7. **Face Detection** - MediaPipe demo
8. **AI Analysis** - Gemini integration
9. **Hairstyle Database** - Template approach
10. **User Interface** - Key screens walkthrough
11. **HCI Principles Applied** - Nielsen's heuristics
12. **Live Demo** - 3-minute interaction
13. **Usability Testing Results** - Key metrics
14. **Challenges & Solutions** - Technical hurdles
15. **Future Enhancements** - V2 features
16. **Conclusion** - Impact and learning
17. **Q&A** - Thank you slide

---

### **Appendix E: IEEE Paper Outline**

**Structure (6-8 pages):**

1. **Abstract (150-200 words)**

   - Problem, approach, results, conclusion

2. **Introduction (1 page)**

   - Motivation, problem definition, contribution

3. **Related Work (1 page)**

   - Face shape analysis systems
   - Virtual try-on technologies
   - HCI in beauty/fashion tech

4. **Methodology (2 pages)**

   - System architecture
   - Face detection approach
   - Classification algorithm
   - Recommendation logic

5. **Implementation (1.5 pages)**

   - Technology stack justification
   - Key technical decisions
   - UI/UX design process

6. **Evaluation (1 page)**

   - Usability testing methodology
   - Results & metrics
   - User feedback analysis

7. **Discussion (0.5 pages)**

   - Limitations
   - Ethical considerations
   - Scalability

8. **Conclusion & Future Work (0.5 pages)**

   - Summary, impact, next steps

9. **References (1 page)**
   - 15-20 academic sources

---

## **DOCUMENT APPROVAL**

This requirements document serves as the single source of truth for the project. All implementation decisions must trace back to these specifications.

**Version History:**

- v1.0 (December 11, 2025) - Initial complete specification

**Next Review:** Day 3 (December 14) - Validate technical feasibility

---

**END OF DOCUMENT**

---

## **QUICK START COMMAND**

```bash
# Initialize project immediately
npx create-next-app@latest hair-salon-ai --typescript --tailwind --app --eslint
cd hair-salon-ai
npx shadcn-ui@latest init
npm install @mediapipe/tasks-vision @google/generative-ai fabric
```

**You are now ready to build. Refer to Day 1 timeline for next steps.**
