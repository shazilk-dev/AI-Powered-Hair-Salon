# **PROJECT REQUIREMENTS DOCUMENT**

## **AI-Powered Hair Salon Recommendation System**

---

| **Document Information** |                                                 |
| ------------------------ | ----------------------------------------------- |
| **Project Title**        | AI-Powered Hair Salon Recommendation System     |
| **Document Version**     | 1.0                                             |
| **Date**                 | December 11, 2025                               |
| **Prepared By**          | [Student Name]                                  |
| **Project Type**         | Human-Computer Interaction (HCI) Course Project |
| **Institution**          | [University Name]                               |
| **Document Status**      | Approved for Implementation                     |
| **Confidentiality**      | Academic Use Only                               |

---

## **DOCUMENT REVISION HISTORY**

| **Version** | **Date**          | **Author**     | **Description**                    |
| ----------- | ----------------- | -------------- | ---------------------------------- |
| 1.0         | December 11, 2025 | [Student Name] | Initial requirements specification |

---

## **TABLE OF CONTENTS**

1. Executive Summary
2. Project Overview
   - 2.1 Background
   - 2.2 Problem Statement
   - 2.3 Project Objectives
   - 2.4 Project Scope
3. Stakeholder Analysis
4. Functional Requirements
   - 4.1 User Requirements
   - 4.2 System Requirements
   - 4.3 Functional Specifications
5. Non-Functional Requirements
   - 5.1 Performance Requirements
   - 5.2 Usability Requirements
   - 5.3 Reliability Requirements
   - 5.4 Security Requirements
   - 5.5 Compatibility Requirements
6. User Interface Requirements
7. System Architecture Requirements
8. Data Requirements
9. Constraints
10. Assumptions and Dependencies
11. Acceptance Criteria
12. Appendices

---

## **1. EXECUTIVE SUMMARY**

This document specifies the requirements for an AI-powered hairstyle recommendation system designed as a Human-Computer Interaction (HCI) course project. The system will utilize computer vision and artificial intelligence to analyze user facial features and provide personalized hairstyle recommendations with visual previews.

**Key Deliverables:**

- Web-based Progressive Web Application (PWA)
- AI-powered face shape analysis module
- Interactive hairstyle visualization system
- Academic research paper (IEEE format)
- Project presentation and demonstration

**Project Duration:** 7 days  
**Budget:** $0 (utilizing free-tier services only)  
**Development Model:** Agile, solo developer

---

## **2. PROJECT OVERVIEW**

### **2.1 Background**

Hair styling decisions significantly impact personal appearance and self-confidence. However, customers often struggle to visualize how different hairstyles will look on them before committing to a salon visit. Traditional approaches involve static reference images that do not account for individual facial features, leading to unsatisfactory outcomes and customer dissatisfaction.

Recent advances in computer vision and generative AI present opportunities to create interactive systems that provide personalized hairstyle recommendations based on facial geometry analysis. This project leverages these technologies to create an accessible, user-friendly solution that bridges the gap between hairstyle ideation and implementation.

### **2.2 Problem Statement**

**Primary Problem:**  
Salon customers lack effective tools to visualize how different hairstyles will complement their unique facial features before making styling decisions.

**Contributing Factors:**

- Generic hairstyle recommendation guides do not account for individual face shapes
- Static reference images fail to show personalized previews
- Professional consultation requires in-person visits
- Trial-and-error approach leads to unsatisfactory results

**Target Users:**

- Primary: Individuals (ages 18-45) considering hairstyle changes
- Secondary: Salon professionals seeking consultation tools

### **2.3 Project Objectives**

#### **2.3.1 Primary Objectives**

**PO-1: Functional Objective**  
Develop a fully functional web application that accurately detects facial features, classifies face shapes, and recommends suitable hairstyles with realistic visual previews.

**PO-2: Academic Objective**  
Demonstrate comprehensive understanding and practical application of Human-Computer Interaction principles, including usability, accessibility, and user-centered design methodologies.

**PO-3: Technical Objective**  
Successfully integrate modern AI/ML technologies (computer vision, generative AI) within a web-based application architecture while adhering to zero-cost constraints.

**PO-4: Research Objective**  
Conduct empirical evaluation through usability testing and document findings in an IEEE-format research paper suitable for academic submission.

#### **2.3.2 Secondary Objectives**

**SO-1:** Create a portfolio-quality project demonstrating full-stack development capabilities  
**SO-2:** Establish foundation for potential future commercialization or expansion  
**SO-3:** Contribute to HCI research in beauty/fashion technology domain

### **2.4 Project Scope**

#### **2.4.1 In Scope**

The project SHALL include:

- Real-time facial capture via device camera (webcam/mobile)
- Automated face detection and facial landmark identification
- AI-powered face shape classification (6 standard categories)
- Personalized hairstyle recommendation engine
- Interactive visual preview system with template overlay
- Before/after comparison interface
- Image export functionality
- Responsive design (mobile and desktop)
- Comprehensive project documentation
- Usability testing and evaluation
- IEEE-format research paper
- Academic presentation materials

#### **2.4.2 Out of Scope**

The project SHALL NOT include:

- User authentication or account management systems
- Backend database for storing user data or history
- Hair color modification or advanced editing features
- 3D modeling or augmented reality (AR) features
- Appointment booking or salon directory integration
- Payment processing or e-commerce functionality
- Native mobile applications (iOS/Android apps)
- Real-time hair simulation with physics
- Training custom machine learning models from scratch
- Multi-language support

#### **2.4.3 Future Enhancements (Post-Project)**

Potential features for subsequent versions:

- User account system with style history
- Virtual hair coloring and texture modification
- Social sharing capabilities
- Salon finder with style matching
- AI-generated custom hairstyles (beyond templates)
- Beard and facial hair recommendations
- Professional salon integration (B2B features)

---

## **3. STAKEHOLDER ANALYSIS**

### **3.1 Stakeholder Identification**

| **Stakeholder**               | **Role**            | **Interest**                                          | **Influence** |
| ----------------------------- | ------------------- | ----------------------------------------------------- | ------------- |
| Course Professor              | Academic Evaluator  | Assess HCI competency, grade project                  | High          |
| Project Developer (Student)   | Implementation Lead | Complete project, achieve learning objectives         | High          |
| End Users (Test Participants) | System Users        | Receive accurate recommendations, intuitive interface | Medium        |
| Academic Peers                | Reviewers           | Learn from presentation, provide feedback             | Low           |
| Future Employers              | Portfolio Reviewers | Evaluate technical and design capabilities            | Medium        |

### **3.2 Stakeholder Requirements**

**SR-1 (Professor):**

- Demonstration of HCI principles (Nielsen's heuristics, user-centered design)
- Rigorous usability evaluation with documented methodology
- Clear documentation of design decisions and trade-offs
- IEEE-standard research paper with proper citations
- Professional presentation with live demonstration

**SR-2 (Developer/Student):**

- Achievable scope within 7-day timeline
- Learning opportunities in AI/ML integration
- Portfolio-quality deliverable for career advancement
- Zero financial investment required
- Reusable codebase for future projects

**SR-3 (End Users):**

- Accurate face shape detection (>85% accuracy)
- Realistic hairstyle previews
- Fast processing (<15 seconds total workflow)
- Intuitive interface requiring no training
- Privacy-respecting (no data storage)

---

## **4. FUNCTIONAL REQUIREMENTS**

### **4.1 User Requirements**

#### **UR-1: Image Acquisition**

**UR-1.1:** The system SHALL provide users the ability to capture a photograph using their device's camera.

**UR-1.2:** The system SHALL allow users to upload an existing photograph from their device storage as an alternative to camera capture.

**UR-1.3:** The system SHALL display a live camera preview with visual framing guidance before photo capture.

**UR-1.4:** The system SHALL allow users to retake photographs if unsatisfied with the initial capture.

**UR-1.5:** The system SHALL validate image quality and prompt users to retake if the image is blurry, too dark, or lacks a detectable face.

#### **UR-2: Face Analysis**

**UR-2.1:** The system SHALL automatically detect faces in captured/uploaded images without requiring user intervention.

**UR-2.2:** The system SHALL visually indicate detected facial boundaries to provide user feedback.

**UR-2.3:** The system SHALL classify the user's face shape into one of six categories: Oval, Round, Square, Heart, Oblong, or Diamond.

**UR-2.4:** The system SHALL display the detected face shape classification to the user with clear labeling.

**UR-2.5:** The system SHALL provide a confidence score or explanation for the face shape classification.

#### **UR-3: Hairstyle Recommendations**

**UR-3.1:** The system SHALL present a minimum of five (5) hairstyle recommendations tailored to the user's detected face shape.

**UR-3.2:** The system SHALL display hairstyle recommendations as visual thumbnails in an organized gallery layout.

**UR-3.3:** The system SHALL provide descriptive names for each recommended hairstyle.

**UR-3.4:** The system SHALL include brief explanations of why each hairstyle suits the user's face shape.

**UR-3.5:** The system SHALL rank hairstyle recommendations by suitability score.

#### **UR-4: Visual Preview**

**UR-4.1:** The system SHALL generate a visual preview showing how each recommended hairstyle appears on the user's actual photograph.

**UR-4.2:** The system SHALL allow users to interactively switch between different hairstyle previews by clicking/tapping on hairstyle thumbnails.

**UR-4.3:** The system SHALL provide a before/after comparison interface with an interactive slider control.

**UR-4.4:** The system SHALL render hairstyle previews with realistic positioning, scaling, and alignment based on detected facial landmarks.

**UR-4.5:** The system SHALL clearly indicate which hairstyle is currently being previewed.

#### **UR-5: Result Export**

**UR-5.1:** The system SHALL enable users to download their styled photograph in PNG format.

**UR-5.2:** The system SHALL generate downloadable images with minimum resolution of 1080×1080 pixels.

**UR-5.3:** The system SHALL include face shape classification information in the downloaded filename for user reference.

**UR-5.4:** The system SHALL complete the download process within 3 seconds of user action.

#### **UR-6: Navigation and Control**

**UR-6.1:** The system SHALL provide clear navigation between major application screens (capture, analysis, results).

**UR-6.2:** The system SHALL allow users to restart the process at any time without losing current session data.

**UR-6.3:** The system SHALL provide a "Try Another Photo" option to begin a new analysis session.

**UR-6.4:** The system SHALL include contextual help/guidance for first-time users.

---

### **4.2 System Requirements**

#### **SR-1: Face Detection Module**

**SR-1.1:** The system SHALL utilize MediaPipe Face Mesh or face-api.js library for facial landmark detection.

**SR-1.2:** The system SHALL detect a minimum of 68 facial landmarks per face.

**SR-1.3:** The system SHALL complete face detection within 2 seconds of image submission.

**SR-1.4:** The system SHALL handle single-face images and reject images containing multiple faces with appropriate error messaging.

**SR-1.5:** The system SHALL process images ranging from 640×480 to 4096×4096 pixels.

#### **SR-2: Face Shape Classification Module**

**SR-2.1:** The system SHALL calculate geometric ratios (face width-to-height, jawline width-to-cheekbone width) from detected landmarks.

**SR-2.2:** The system SHALL implement a classification algorithm that maps geometric measurements to six standard face shape categories.

**SR-2.3:** The system SHALL integrate Google Gemini Vision API for contextual face shape analysis and validation.

**SR-2.4:** The system SHALL achieve minimum 85% classification accuracy based on standardized face shape definitions.

**SR-2.5:** The system SHALL handle ambiguous cases by selecting the most probable classification with confidence scoring.

#### **SR-3: Recommendation Engine**

**SR-3.1:** The system SHALL maintain a database of hairstyle templates organized by face shape category.

**SR-3.2:** The system SHALL store a minimum of 5 hairstyle templates per face shape category (30 total templates).

**SR-3.3:** The system SHALL implement a matching algorithm that selects appropriate hairstyles based on classified face shape.

**SR-3.4:** The system SHALL rank recommendations using a suitability scoring algorithm.

**SR-3.5:** The system SHALL support dynamic addition of new hairstyle templates without code modification.

#### **SR-4: Visualization Engine**

**SR-4.1:** The system SHALL utilize HTML5 Canvas API for image manipulation and overlay rendering.

**SR-4.2:** The system SHALL position hairstyle templates using facial landmark coordinates (specifically forehead, temples, and crown landmarks).

**SR-4.3:** The system SHALL scale hairstyle templates proportionally based on detected face dimensions.

**SR-4.4:** The system SHALL apply edge blending techniques to create natural-looking transitions between hairstyle templates and user images.

**SR-4.5:** The system SHALL render each hairstyle preview within 3 seconds.

**SR-4.6:** The system SHALL cache rendered previews to enable instant switching between previously viewed styles.

#### **SR-5: API Integration**

**SR-5.1:** The system SHALL integrate Google Gemini Vision API (1.5 Flash model) for face analysis.

**SR-5.2:** The system SHALL implement API request batching to minimize network latency.

**SR-5.3:** The system SHALL handle API errors gracefully with automatic retry logic (exponential backoff).

**SR-5.4:** The system SHALL respect API rate limits (15 requests/minute for Gemini free tier).

**SR-5.5:** The system SHALL transmit images to external APIs using base64 encoding over HTTPS.

---

### **4.3 Functional Specifications**

#### **FS-1: Camera Capture Workflow**

```
1. User navigates to application landing page
2. User clicks "Start Analysis" button
3. System requests camera permission via browser API
4. IF permission granted:
   a. System displays live camera feed
   b. System overlays face detection guide (oval frame)
   c. User positions face within guide
   d. User clicks "Capture" button
   e. System freezes frame and displays preview
   f. User confirms or retakes
5. IF permission denied:
   a. System displays error message
   b. System offers "Upload Photo" alternative
6. System proceeds to face detection
```

#### **FS-2: Face Detection and Classification Workflow**

```
1. System receives image (captured or uploaded)
2. System displays "Analyzing face..." loading indicator
3. System runs MediaPipe Face Mesh detection
4. IF face detected:
   a. System extracts 468 landmark coordinates
   b. System calculates geometric ratios:
      - Face width = distance(landmark_234 to landmark_454)
      - Face height = distance(landmark_10 to landmark_152)
      - Ratio = width / height
   c. System sends image + landmarks to Gemini API
   d. System receives face shape classification
   e. System combines local calculation + AI analysis
   f. System determines final classification with confidence
5. IF no face detected:
   a. System displays error: "No face detected"
   b. System provides troubleshooting tips
   c. System offers "Try Again" option
6. System displays classification result
7. System proceeds to recommendation generation
```

#### **FS-3: Hairstyle Recommendation Logic**

```
Classification: OVAL
→ Recommend: ["Long Layers", "Textured Crop", "Side Part", "Quiff", "Slicked Back"]
→ Rationale: "Oval faces have balanced proportions and can accommodate most styles"

Classification: ROUND
→ Recommend: ["High Fade Volume", "Angular Fringe", "Pompadour", "Undercut", "Crop"]
→ Rationale: "Add height and angles to elongate face appearance"

Classification: SQUARE
→ Recommend: ["Soft Waves", "Layered Fringe", "Textured Brush", "Side Part", "Layers"]
→ Rationale: "Soften angular features with textured, flowing styles"

Classification: HEART
→ Recommend: ["Full Fringe", "Chin Bob", "Side Waves", "Textured Crop", "Medium Layers"]
→ Rationale: "Balance wide forehead with fuller styles at jaw level"

Classification: OBLONG
→ Recommend: ["Horizontal Layers", "Full Fringe", "Blunt Cut", "Side Bangs", "Crop"]
→ Rationale: "Add width and reduce perceived face length"

Classification: DIAMOND
→ Recommend: ["Side Fringe", "Chin Layers", "Textured Quiff", "Beard Combo", "Side Part"]
→ Rationale: "Balance prominent cheekbones with forehead and jaw width"
```

#### **FS-4: Overlay Rendering Algorithm**

```
Function: renderHairstyle(userImage, hairstyleTemplate, landmarks)
{
  1. Extract key landmarks:
     - foreheadTop = landmark_10
     - templeLeft = landmark_234
     - templeRight = landmark_454

  2. Calculate hairstyle dimensions:
     - targetWidth = distance(templeLeft, templeRight) × 1.3
     - targetHeight = targetWidth × (template.height / template.width)

  3. Calculate position:
     - centerX = (templeLeft.x + templeRight.x) / 2
     - topY = foreheadTop.y - (targetHeight × 0.3)

  4. Create canvas context:
     - Draw user image as base layer
     - Scale hairstyle template to targetWidth × targetHeight
     - Position template at (centerX, topY)
     - Set composite operation: "source-over"

  5. Apply blending:
     - Create gradient mask at hairline
     - Apply feathering (5-pixel radius)

  6. Return: composite image as data URL
}
```

---

## **5. NON-FUNCTIONAL REQUIREMENTS**

### **5.1 Performance Requirements**

**NFR-P-1:** The system SHALL load the initial application page within 3 seconds on a standard broadband connection (5 Mbps).

**NFR-P-2:** The system SHALL complete face detection within 2 seconds of image submission.

**NFR-P-3:** The system SHALL generate all 5 hairstyle previews within 10 seconds total.

**NFR-P-4:** The system SHALL switch between hairstyle previews in less than 500 milliseconds after user selection.

**NFR-P-5:** The system SHALL complete the entire workflow (capture to download) within 30 seconds under normal conditions.

**NFR-P-6:** The system SHALL maintain responsive UI interactions with less than 100ms latency for button clicks and gestures.

**NFR-P-7:** The system SHALL optimize images to ensure total page weight does not exceed 5MB.

### **5.2 Usability Requirements**

**NFR-U-1 (Learnability):** First-time users SHALL successfully complete the primary workflow without external assistance or documentation.

**NFR-U-2 (Efficiency):** Experienced users SHALL complete the workflow within 15 seconds.

**NFR-U-3 (Memorability):** Users returning after 1 week SHALL recall how to use the system without relearning.

**NFR-U-4 (Error Tolerance):** The system SHALL prevent user errors through interface design and provide clear recovery paths when errors occur.

**NFR-U-5 (Satisfaction):** The system SHALL achieve a System Usability Scale (SUS) score of 70 or higher.

**NFR-U-6 (Visibility):** All system operations SHALL provide visible feedback within 100 milliseconds (loading indicators, state changes).

**NFR-U-7 (Consistency):** The system SHALL maintain consistent terminology, visual design, and interaction patterns across all screens.

**NFR-U-8 (Feedback):** The system SHALL provide immediate visual or textual confirmation for all user actions.

**NFR-U-9 (Error Messages):** Error messages SHALL be expressed in plain language, precisely indicate the problem, and constructively suggest solutions.

**NFR-U-10 (Help & Documentation):** The system SHALL provide contextual help tooltips for non-obvious features without cluttering the interface.

### **5.3 Reliability Requirements**

**NFR-R-1 (Availability):** The system SHALL maintain 99% uptime during the evaluation period (subject to hosting provider SLA).

**NFR-R-2 (Fault Tolerance):** The system SHALL handle API failures gracefully without crashing the application.

**NFR-R-3 (Error Handling):** The system SHALL catch and handle all exceptions to prevent white-screen errors.

**NFR-R-4 (Degradation):** If AI services are unavailable, the system SHALL fall back to geometric classification algorithms.

**NFR-R-5 (Recovery):** The system SHALL allow users to retry failed operations without restarting the entire workflow.

### **5.4 Security Requirements**

**NFR-S-1 (Data Privacy):** The system SHALL NOT store user photographs on any server or database.

**NFR-S-2 (Transmission Security):** All data transmission SHALL occur over HTTPS encrypted connections.

**NFR-S-3 (Third-Party Data):** Images sent to Gemini API SHALL be processed ephemerally without permanent storage by the provider.

**NFR-S-4 (Permission Management):** Camera access SHALL require explicit user consent via browser permission dialogs.

**NFR-S-5 (Client-Side Processing):** Face detection SHALL be performed client-side when possible to minimize data transmission.

**NFR-S-6 (No Tracking):** The system SHALL NOT implement analytics, cookies, or tracking mechanisms without explicit user consent.

### **5.5 Compatibility Requirements**

**NFR-C-1 (Browser Support):** The system SHALL function correctly on:

- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

**NFR-C-2 (Device Support):** The system SHALL operate on:

- Desktop computers (Windows, macOS, Linux)
- Mobile devices (iOS 14+, Android 10+)
- Tablets (iPad, Android tablets)

**NFR-C-3 (Screen Sizes):** The system SHALL provide optimized layouts for screen widths from 320px (mobile) to 2560px (large desktop).

**NFR-C-4 (Camera Support):** The system SHALL function with any WebRTC-compatible camera device.

**NFR-C-5 (Network Conditions):** The system SHALL degrade gracefully on slow connections (displaying appropriate loading states).

### **5.6 Accessibility Requirements (WCAG 2.1 Level AA)**

**NFR-A-1 (Color Contrast):** Text SHALL maintain a minimum contrast ratio of 4.5:1 against backgrounds.

**NFR-A-2 (Keyboard Navigation):** All interactive elements SHALL be accessible via keyboard alone.

**NFR-A-3 (Focus Indicators):** Keyboard focus SHALL be clearly visible on all focusable elements.

**NFR-A-4 (Screen Readers):** All interactive elements SHALL include appropriate ARIA labels and roles.

**NFR-A-5 (Alternative Text):** All images SHALL include descriptive alt text.

**NFR-A-6 (Responsive Text):** Text SHALL remain readable when zoomed to 200%.

**NFR-A-7 (Touch Targets):** Interactive elements SHALL have minimum touch target size of 44×44 pixels on mobile devices.

### **5.7 Maintainability Requirements**

**NFR-M-1 (Code Documentation):** All functions SHALL include JSDoc-style comments describing purpose, parameters, and return values.

**NFR-M-2 (Type Safety):** The system SHALL use TypeScript for type checking across all modules.

**NFR-M-3 (Modularity):** The system SHALL be structured in reusable, loosely-coupled components.

**NFR-M-4 (Version Control):** All code SHALL be maintained in Git with descriptive commit messages following conventional commit standards.

**NFR-M-5 (Code Style):** The system SHALL adhere to ESLint rules for consistent code formatting.

### **5.8 Scalability Requirements**

**NFR-SC-1:** The system architecture SHALL support 50 concurrent users without performance degradation (Vercel free tier limit).

**NFR-SC-2:** The system SHALL implement client-side processing where feasible to reduce server load.

**NFR-SC-3:** The system SHALL be stateless to enable horizontal scaling in future versions.

---

## **6. USER INTERFACE REQUIREMENTS**

### **6.1 General UI Principles**

**UIR-1 (Visual Hierarchy):** The interface SHALL use size, color, and spacing to establish clear information hierarchy.

**UIR-2 (White Space):** The interface SHALL utilize adequate spacing to prevent visual clutter (minimum 16px between major sections).

**UIR-3 (Responsive Layout):** The interface SHALL adapt fluidly to different screen sizes using CSS Grid and Flexbox.

**UIR-4 (Loading States):** All asynchronous operations SHALL display loading indicators with descriptive text.

**UIR-5 (Progressive Disclosure):** The interface SHALL reveal information progressively to avoid overwhelming users.

### **6.2 Screen-Specific Requirements**

#### **6.2.1 Landing Page**

**UIR-LP-1:** SHALL display application name and tagline prominently.

**UIR-LP-2:** SHALL include a clear call-to-action button ("Start Analysis").

**UIR-LP-3:** SHALL provide a brief 3-point value proposition (e.g., "Fast • Accurate • Free").

**UIR-LP-4:** SHALL include optional informational section explaining how the system works.

#### **6.2.2 Camera Capture Screen**

**UIR-CC-1:** SHALL display live camera preview occupying minimum 60% of viewport height.

**UIR-CC-2:** SHALL overlay a semi-transparent face outline guide centered in the camera view.

**UIR-CC-3:** SHALL include prominent "Capture Photo" button below camera preview.

**UIR-CC-4:** SHALL provide alternative "Upload Photo" option for users without cameras or experiencing technical issues.

**UIR-CC-5:** SHALL include brief instructional text (e.g., "Position your face within the frame").

**UIR-CC-6:** SHALL display back navigation option to return to landing page.

#### **6.2.3 Processing Screen**

**UIR-PS-1:** SHALL display animated loading indicator during face analysis.

**UIR-PS-2:** SHALL show status text indicating current processing step (e.g., "Detecting face...", "Analyzing features...").

**UIR-PS-3:** SHALL display the captured image with reduced opacity during processing to maintain context.

#### **6.2.4 Results Screen**

**UIR-RS-1:** SHALL display detected face shape prominently with visual badge/label.

**UIR-RS-2:** SHALL show 5 hairstyle recommendations as clickable thumbnails in a horizontal or grid layout.

**UIR-RS-3:** SHALL present selected hairstyle preview in a large display area (minimum 400×400px on desktop).

**UIR-RS-4:** SHALL implement before/after comparison slider with visible handle and labels.

**UIR-RS-5:** SHALL include brief explanation text for why each hairstyle suits the user's face shape.

**UIR-RS-6:** SHALL provide "Download Image" button with clear icon.

**UIR-RS-7:** SHALL include "Try Another Photo" button to restart workflow.

**UIR-RS-8:** SHALL highlight currently selected hairstyle thumbnail with border or background color.

### **6.3 Design System Specifications**

**UIR-DS-1 (Color Palette):**

- Primary: #3B82F6 (Blue 500)
- Secondary: #10B981 (Green 500)
- Neutral: #6B7280 (Gray 500)
- Background: #FFFFFF (White) / #F9FAFB (Gray 50)
- Text: #111827 (Gray 900)
- Error: #EF4444 (Red 500)

**UIR-DS-2 (Typography):**

- Headings: Inter/Poppins, 600-700 weight
- Body: Inter/Open Sans, 400 weight
- Sizes: Base 16px, scale 1.25 (20px, 25px, 31px, 39px)

**UIR-DS-3 (Spacing System):**

- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**UIR-DS-4 (Border Radius):**

- Small: 4px (inputs, small buttons)
- Medium: 8px (cards, main buttons)
- Large: 12px (containers, images)

**UIR-DS-5 (Shadows):**

- Small: 0 1px 2px rgba(0,0,0,0.05)
- Medium: 0 4px 6px rgba(0,0,0,0.1)
- Large: 0 10px 15px rgba(0,0,0,0.1)

---

## **7. SYSTEM ARCHITECTURE REQUIREMENTS**

### **7.1 Architectural Style**

**SAR-1:** The system SHALL implement a Progressive Web Application (PWA) architecture.

**SAR-2:** The system SHALL follow a client-server model with serverless backend functions.

**SAR-3:** The system SHALL utilize a component-based frontend architecture (React/Next.js).

**SAR-4:** The system SHALL implement separation of concerns with distinct presentation, business logic, and data layers.

### **7.2 Technology Stack Requirements**

**SAR-5 (Frontend Framework):** The system SHALL use Next.js 14+ with App Router for the frontend application.

**SAR-6 (Programming Language):** The system SHALL use TypeScript for type safety and improved developer experience.

**SAR-7 (Styling):** The system SHALL use Tailwind CSS for responsive styling.

**SAR-8 (Computer Vision):** The system SHALL use MediaPipe Face Mesh (primary) or face-api.js (fallback) for client-side face detection.

**SAR-9 (AI Integration):** The system SHALL use Google Gemini Vision API (1.5 Flash model) for face shape analysis.

**SAR-10 (Image Processing):** The system SHALL use HTML5 Canvas API for image manipulation and overlay rendering.

**SAR-11 (Hosting):** The system SHALL be deployed on Vercel platform (free tier).

**SAR-12 (Version Control):** The system SHALL maintain source code in a Git repository (GitHub).

### **7.3 Component Architecture**

**SAR-13:** The system SHALL implement the following component hierarchy:

```
App Root
├── Landing Page Component
├── Camera Capture Component
│   ├── Camera Preview Subcomponent
│   ├── Capture Button Subcomponent
│   └── Upload Alternative Subcomponent
├── Face Detection Component
│   └── MediaPipe Integration Module
├── Analysis Screen Component
│   └── Loading Indicator Subcomponent
├── Results Component
│   ├── Face Shape Badge Subcomponent
│   ├── Hairstyle Gallery Subcomponent
│   ├── Preview Canvas Subcomponent
│   ├── Before/After Slider Subcomponent
│   └── Download Button Subcomponent
└── Shared Components
    ├── Button Component
    ├── Loading Spinner Component
    └── Error Message Component
```

### **7.4 API Architecture**

**SAR-14:** The system SHALL implement the following API endpoints:

- `POST /api/analyze-face` - Accepts base64 image, returns face shape classification
- `GET /api/recommend` - Accepts face shape parameter, returns hairstyle recommendations

**SAR-15:** API endpoints SHALL be implemented as Next.js API routes (serverless functions).

**SAR-16:** API responses SHALL follow standardized JSON structure with status codes.

### **7.5 Data Flow Requirements**

**SAR-17:** Image data SHALL flow as follows:

1. Browser camera/upload → Client-side state (React)
2. Client-side → MediaPipe (WASM module)
3. Client-side → API Route (Next.js serverless)
4. API Route → Gemini API (HTTPS)
5. Gemini API → API Route (JSON response)
6. API Route → Client-side (JSON)
7. Client-side → Canvas rendering → User display

**SAR-18:** The system SHALL minimize client-server round trips by performing face detection entirely client-side.

---

## **8. DATA REQUIREMENTS**

### **8.1 Data Models**

#### **8.1.1 FaceLandmarks Interface**

```typescript
interface FaceLandmarks {
  landmarks: Array<{
    x: number; // X coordinate (0-1 normalized)
    y: number; // Y coordinate (0-1 normalized)
    z: number; // Depth coordinate
  }>;
  boundingBox: {
    xMin: number;
    yMin: number;
    width: number;
    height: number;
  };
  confidence: number; // Detection confidence (0-1)
}
```

#### **8.1.2 FaceShape Interface**

```typescript
interface FaceShape {
  classification: "oval" | "round" | "square" | "heart" | "oblong" | "diamond";
  confidence: number; // Classification confidence (0-1)
  measurements: {
    faceWidth: number; // Width in pixels
    faceHeight: number; // Height in pixels
    ratio: number; // Width/height ratio
    jawWidth: number;
    cheekboneWidth: number;
  };
  explanation: string; // Why this shape was detected
}
```

#### **8.1.3 Hairstyle Interface**

```typescript
interface Hairstyle {
  id: string;
  name: string;
  category: "oval" | "round" | "square" | "heart" | "oblong" | "diamond";
  imagePath: string; // Path to PNG template
  description: string; // Brief description
  suitabilityScore: number; // 0-100 rating for this face shape
  reasoning: string; // Why it suits this face shape
  tags: string[]; // e.g., ['professional', 'casual', 'modern']
}
```

#### **8.1.4 AnalysisResult Interface**

```typescript
interface AnalysisResult {
  faceShape: FaceShape;
  recommendations: Hairstyle[];
  processingTime: number; // Milliseconds
  timestamp: Date;
}
```

### **8.2 Data Storage Requirements**

**DR-1:** The system SHALL NOT persist user images to any permanent storage system.

**DR-2:** The system SHALL store hairstyle template images as static assets in the public directory.

**DR-3:** Hairstyle metadata (names, descriptions, categories) SHALL be defined in TypeScript constant files.

**DR-4:** Temporary analysis results MAY be stored in browser session storage for navigation persistence within a session.

**DR-5:** Cached API responses MAY be stored in browser memory (React state) for the duration of a user session.

### **8.3 Hairstyle Database Requirements**

**DR-6:** The system SHALL maintain a minimum of 30 hairstyle templates (5 per face shape category).

**DR-7:** Hairstyle templates SHALL be stored as PNG files with alpha transparency.

**DR-8:** Template files SHALL be optimized to <500KB each while maintaining visual quality.

**DR-9:** Templates SHALL have standardized dimensions (1500×2000px portrait orientation).

**DR-10:** The hairstyle database SHALL be organized in the following directory structure:

```
/public/hairstyles/
├── oval/
├── round/
├── square/
├── heart/
├── oblong/
└── diamond/
```

---

## **9. CONSTRAINTS**

### **9.1 Financial Constraints**

**C-F-1:** The project budget is **$0.00 USD** - all technologies and services MUST be free tier.

**C-F-2:** No credit card MAY be required for any service registration.

**C-F-3:** API usage MUST remain within free tier limits throughout development and evaluation period.

### **9.2 Time Constraints**

**C-T-1:** The complete project MUST be completed within **7 calendar days**.

**C-T-2:** Daily progress MUST be achievable by a single developer working 6-8 hours per day.

**C-T-3:** Implementation MUST be prioritized over feature completeness; MVP functionality is mandatory.

### **9.3 Resource Constraints**

**C-R-1:** The project SHALL be developed by a **single student developer** (solo project).

**C-R-2:** Development SHALL occur on standard consumer hardware (no specialized equipment).

**C-R-3:** Testing SHALL be conducted with 5-8 volunteer participants (friends/classmates).

### **9.4 Technical Constraints**

**C-TC-1:** The application MUST be web-based (no native mobile app development).

**C-TC-2:** All AI/ML models MUST be pre-trained (no custom model training).

**C-TC-3:** Backend infrastructure MUST be serverless (no dedicated server management).

**C-TC-4:** Image processing MUST leverage browser capabilities where possible to minimize API calls.

**C-TC-5:** The system MUST function in modern browsers supporting WebRTC and Canvas API.

### **9.5 Regulatory Constraints**

**C-REG-1:** The system MUST comply with university academic integrity policies.

**C-REG-2:** User testing MUST obtain verbal consent from participants.

**C-REG-3:** No personal data MAY be stored without explicit consent mechanisms.

**C-REG-4:** The system MUST comply with GDPR principles (privacy by design) despite academic context.

### **9.6 Scope Constraints**

**C-SC-1:** Feature additions beyond the defined scope MUST be deferred to post-project phases.

**C-SC-2:** The project MUST prioritize HCI demonstration over technical complexity.

**C-SC-3:** Documentation MUST be sufficient for academic evaluation but need not be production-grade.

---

## **10. ASSUMPTIONS AND DEPENDENCIES**

### **10.1 Assumptions**

#### **10.1.1 User Assumptions**

**A-U-1:** Users have access to devices with functional cameras (webcam or smartphone camera).

**A-U-2:** Users have basic technical literacy (can navigate web applications, grant browser permissions).

**A-U-3:** Users have stable internet connections (minimum 3 Mbps) for API calls.

**A-U-4:** Users are adults (18+) or have guardian consent for participation in testing.

**A-U-5:** Users will primarily access the system in well-lit environments suitable for photography.

#### **10.1.2 Technical Assumptions**

**A-T-1:** Modern browsers will continue supporting WebRTC and Canvas APIs without breaking changes during the project timeline.

**A-T-2:** Google Gemini API free tier will remain available and accessible throughout development and evaluation.

**A-T-3:** Vercel free tier will provide sufficient resources for anticipated traffic during testing.

**A-T-4:** MediaPipe Face Mesh library will reliably detect faces with >90% accuracy in typical conditions.

**A-T-5:** Open-source hairstyle template images or creation tools are available for the hairstyle database.

#### **10.1.3 Academic Assumptions**

**A-AC-1:** Course instructors will evaluate the project based on HCI principles rather than production-readiness.

**A-AC-2:** Using pre-trained models and APIs is acceptable and does not violate academic integrity policies.

**A-AC-3:** A functional prototype with limited hairstyle options is preferable to an incomplete system with extensive features.

**A-AC-4:** Usability testing with 5-8 participants is sufficient for academic evaluation.

**A-AC-5:** The IEEE research paper may include preliminary results rather than extensive longitudinal studies.

### **10.2 Dependencies**

#### **10.2.1 External Service Dependencies**

**D-ES-1:** **Google Gemini API**

- Dependency Type: Critical
- Purpose: Face shape analysis and contextual recommendations
- Risk: Service downtime or API changes
- Mitigation: Implement fallback to geometric classification algorithm

**D-ES-2:** **Vercel Hosting Platform**

- Dependency Type: Critical
- Purpose: Application hosting and serverless functions
- Risk: Deployment issues or platform outages
- Mitigation: Maintain local development environment for demonstrations

**D-ES-3:** **npm/pnpm Package Registry**

- Dependency Type: High
- Purpose: Dependency management and library access
- Risk: Package unavailability or breaking updates
- Mitigation: Lock dependency versions in package-lock.json

#### **10.2.2 Library Dependencies**

**D-L-1:** **Next.js Framework** (v14+)

- Purpose: React framework and routing
- Stability: High (major framework, well-maintained)

**D-L-2:** **MediaPipe Face Mesh** or **face-api.js**

- Purpose: Client-side face detection
- Stability: High (Google-maintained / established library)

**D-L-3:** **@google/generative-ai** (Gemini SDK)

- Purpose: Simplified API integration
- Stability: Medium (relatively new but officially supported)

**D-L-4:** **Tailwind CSS**

- Purpose: Utility-first styling
- Stability: High (industry standard)

**D-L-5:** **TypeScript**

- Purpose: Type safety
- Stability: High (Microsoft-maintained)

#### **10.2.3 Resource Dependencies**

**D-R-1:** **Hairstyle Template Images**

- Dependency Type: High
- Source: Free stock photos, created/edited images, or generated templates
- Risk: Insufficient quality or quantity
- Mitigation: Allocate Day 4 entirely to template acquisition/creation

**D-R-2:** **Test Participants**

- Dependency Type: Medium
- Source: University classmates, friends, family
- Risk: Insufficient participants or scheduling conflicts
- Mitigation: Recruit 10+ participants to ensure 5-8 complete sessions

**D-R-3:** **Development Hardware**

- Dependency Type: Critical
- Requirements: Laptop with camera, modern browser, internet access
- Risk: Hardware failure during development
- Mitigation: Regular Git commits, cloud-based code backup

---

## **11. ACCEPTANCE CRITERIA**

### **11.1 Functional Acceptance Criteria**

**AC-F-1:** The system successfully captures or accepts uploaded images from users.

**AC-F-2:** The system detects faces in images with >85% accuracy in well-lit conditions.

**AC-F-3:** The system classifies face shapes into one of six categories with >80% accuracy based on standardized definitions.

**AC-F-4:** The system presents exactly 5 hairstyle recommendations tailored to the detected face shape.

**AC-F-5:** The system generates visual previews showing hairstyles overlaid on user images.

**AC-F-6:** The system enables users to interactively switch between different hairstyle previews.

**AC-F-7:** The system provides a before/after comparison interface with functional slider control.

**AC-F-8:** The system allows users to download styled images in PNG format.

**AC-F-9:** The complete workflow (capture to download) executes in <30 seconds under normal conditions.

**AC-F-10:** The system handles error cases gracefully (no face detected, poor image quality, API failures) with clear messaging and recovery options.

### **11.2 Non-Functional Acceptance Criteria**

**AC-NF-1:** The system achieves a System Usability Scale (SUS) score of ≥70 in usability testing.

**AC-NF-2:** The system demonstrates responsive design functioning correctly on mobile devices (320px width) and desktops (1920px width).

**AC-NF-3:** The system loads the initial page in <3 seconds on a standard broadband connection.

**AC-NF-4:** The system maintains consistent visual design and interaction patterns across all screens.

**AC-NF-5:** The system implements keyboard navigation for all interactive elements.

**AC-NF-6:** The system meets WCAG 2.1 Level A accessibility requirements (minimum).

**AC-NF-7:** The system operates entirely within free tier limits of all services (zero cost verified).

**AC-NF-8:** The system functions correctly in Chrome, Firefox, and Safari latest versions.

### **11.3 Academic Acceptance Criteria**

**AC-A-1:** The project demonstrates application of at least 5 HCI principles with clear documentation.

**AC-A-2:** Usability testing is conducted with minimum 5 participants using standardized methodology.

**AC-A-3:** An IEEE-format research paper (6-8 pages) is completed documenting the project.

**AC-A-4:** A presentation (15-20 slides) is created with live demonstration capability.

**AC-A-5:** Source code is available in a GitHub repository with comprehensive README documentation.

**AC-A-6:** The application is deployed to a public URL accessible for evaluation.

**AC-A-7:** A demonstration video (3-5 minutes) showcasing the full workflow is produced.

### **11.4 Quality Acceptance Criteria**

**AC-Q-1:** The system contains no critical bugs that prevent core functionality.

**AC-Q-2:** The codebase follows consistent coding standards (ESLint compliance).

**AC-Q-3:** All components include TypeScript type definitions.

**AC-Q-4:** The system includes basic error handling for all user-facing operations.

**AC-Q-5:** The interface provides loading indicators for all asynchronous operations.

### **11.5 Test Scenarios for Acceptance**

**Test Scenario 1: Happy Path**

```
GIVEN: A user accesses the application with a device camera
WHEN: The user captures a clear frontal face photo
AND: Proceeds through the analysis workflow
AND: Selects a recommended hairstyle
AND: Downloads the styled image
THEN: The system completes all steps without errors
AND: The downloaded image shows the hairstyle appropriately overlaid
```

**Test Scenario 2: Error Handling**

```
GIVEN: A user captures an image without a detectable face
WHEN: The system attempts face detection
THEN: A clear error message is displayed
AND: The user is prompted to retake the photo
AND: The system does not crash or become unresponsive
```

**Test Scenario 3: Mobile Experience**

```
GIVEN: A user accesses the application on a mobile device (iPhone/Android)
WHEN: The user navigates through the complete workflow
THEN: All interfaces are readable and interactive elements are easily tappable
AND: The camera integration functions correctly
AND: Images render appropriately for mobile screen sizes
```

**Test Scenario 4: Performance**

```
GIVEN: A user with a standard internet connection (5 Mbps)
WHEN: The user completes the full workflow from capture to download
THEN: The total time does not exceed 30 seconds
AND: No operation feels unresponsive or frozen
```

**Test Scenario 5: Accessibility**

```
GIVEN: A user navigating with keyboard only (no mouse)
WHEN: The user attempts to complete the workflow
THEN: All interactive elements can be reached and activated via keyboard
AND: Focus indicators are clearly visible
```

---

## **12. APPENDICES**

### **Appendix A: Glossary of Terms**

| **Term**                         | **Definition**                                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Face Landmarks**               | Specific points on a face (e.g., eyes, nose, mouth corners) detected by computer vision algorithms              |
| **Face Shape Classification**    | The process of categorizing facial geometry into standard shape types (oval, round, square, etc.)               |
| **Hairstyle Template**           | A pre-created image of a hairstyle with transparent background designed for overlay on user photos              |
| **Overlay Rendering**            | The technique of compositing one image (hairstyle) onto another (user photo) with proper alignment and blending |
| **Progressive Web App (PWA)**    | A web application that uses modern web capabilities to provide app-like experiences                             |
| **System Usability Scale (SUS)** | A standardized questionnaire for measuring perceived usability (10 questions, 5-point Likert scale)             |
| **WebRTC**                       | Web Real-Time Communication API enabling camera access in browsers                                              |
| **Gemini Vision API**            | Google's AI service for analyzing and understanding visual content                                              |
| **MediaPipe**                    | Google's cross-platform ML framework for building multimodal applied ML pipelines                               |

### **Appendix B: Reference Documents**

1. Nielsen, J. (1994). _Usability Engineering_. Morgan Kaufmann.
2. WCAG 2.1 Guidelines - W3C Web Accessibility Initiative
3. ISO 9241-11:2018 - Ergonomics of human-system interaction (Usability)
4. Google Gemini API Documentation - https://ai.google.dev/docs
5. MediaPipe Face Mesh Guide - https://developers.google.com/mediapipe
6. IEEE Standard for Software Requirements Specifications (IEEE 830-1998)

### **Appendix C: HCI Principles Mapping**

This project demonstrates the following HCI principles:

| **Principle**                                  | **Implementation**                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| **Visibility of System Status**                | Loading indicators, progress feedback, classification result display       |
| **User Control & Freedom**                     | Retake photo option, try different styles, restart workflow                |
| **Consistency & Standards**                    | Uniform button styles, consistent terminology, predictable navigation      |
| **Error Prevention**                           | Image quality validation, face detection verification, disabled states     |
| **Recognition Rather Than Recall**             | Visual thumbnails, labeled buttons, visible current selections             |
| **Flexibility & Efficiency**                   | Works for first-time and returning users, optional upload vs. camera       |
| **Aesthetic & Minimalist Design**              | Clean interface, progressive disclosure, focused information               |
| **Help Users Recognize & Recover from Errors** | Clear error messages, specific guidance, retry options                     |
| **Affordances**                                | Buttons appear clickable, sliders appear draggable, clear interaction cues |
| **Feedback**                                   | Immediate visual response to all actions, state changes, confirmations     |

### **Appendix D: Risk Register**

| **Risk ID** | **Risk Description**                | **Probability** | **Impact** | **Mitigation**                                           | **Owner** |
| ----------- | ----------------------------------- | --------------- | ---------- | -------------------------------------------------------- | --------- |
| R-01        | API rate limits exceeded            | Low             | Medium     | Implement request throttling, cache results              | Developer |
| R-02        | Poor face detection accuracy        | Medium          | High       | Provide clear framing guide, image quality validation    | Developer |
| R-03        | Hairstyle overlays look unrealistic | Medium          | High       | Use high-quality templates, refine positioning algorithm | Developer |
| R-04        | Insufficient test participants      | Medium          | Medium     | Recruit 10+ participants early, offer incentives         | Developer |
| R-05        | Cross-browser compatibility issues  | Medium          | Medium     | Test early and continuously on target browsers           | Developer |
| R-06        | Scope creep delaying core features  | High            | High       | Strict adherence to MVP requirements, defer enhancements | Developer |
| R-07        | Gemini API service disruption       | Low             | High       | Implement fallback classification algorithm              | Developer |
| R-08        | Mobile performance issues           | Medium          | High       | Optimize images, reduce processing complexity            | Developer |

### **Appendix E: Success Metrics Dashboard**

The following metrics will be tracked to measure project success:

**Technical Metrics:**

- Face detection success rate: Target >85%
- Average classification confidence: Target >75%
- Workflow completion time: Target <30s
- Page load time: Target <3s
- Error rate: Target <5%

**Usability Metrics:**

- SUS Score: Target ≥70
- Task success rate: Target >90%
- User satisfaction rating: Target ≥4/5
- Error recovery success: Target >95%

**Academic Metrics:**

- HCI principles demonstrated: Target ≥5
- Paper completion: 6-8 pages
- Presentation quality: Professional standard
- Code documentation: Comprehensive

**Portfolio Metrics:**

- GitHub stars/forks: Tracked
- LinkedIn engagement: Tracked
- Demo video views: Tracked

---

## **DOCUMENT APPROVAL**

### **Sign-Off**

This Project Requirements Document has been reviewed and approved by the following stakeholders:

| **Role**              | **Name**          | **Signature**      | **Date**          |
| --------------------- | ----------------- | ------------------ | ----------------- |
| **Project Developer** | [Student Name]    | ********\_******** | December 11, 2025 |
| **Faculty Advisor**   | [Professor Name]  | ********\_******** | ******\_******    |
| **Course Instructor** | [Instructor Name] | ********\_******** | ******\_******    |

### **Change Control**

Any changes to the requirements defined in this document must follow the change control process:

1. **Request Submission:** Change requests must be documented with justification
2. **Impact Analysis:** Assess impact on timeline, scope, and resources
3. **Approval:** Requires developer acknowledgment (academic project exception)
4. **Documentation:** Update this PRD and maintain version history
5. **Communication:** Notify faculty advisor of significant scope changes

### **Document Distribution**

This document will be distributed to:

- Project Developer (Student)
- Course Instructor
- Faculty Advisor (if assigned)
- Academic Department (if required)

### **Review Schedule**

| **Review Milestone**  | **Scheduled Date** | **Purpose**                                               |
| --------------------- | ------------------ | --------------------------------------------------------- |
| Mid-Project Review    | December 14, 2025  | Validate technical feasibility, adjust scope if necessary |
| Pre-Submission Review | December 18, 2025  | Ensure all requirements met, final quality check          |

---

## **APPENDIX F: TRACEABILITY MATRIX**

This matrix maps high-level objectives to specific requirements:

| **Objective**                | **Related Requirements**                         |
| ---------------------------- | ------------------------------------------------ |
| Accurate face detection      | FR-06, FR-07, FR-08, SR-1.1-SR-1.5, NFR-P-2      |
| Personalized recommendations | FR-12, FR-13, FR-14, FR-15, SR-3.1-SR-3.5        |
| Visual previews              | FR-17, FR-18, FR-19, FR-20, FR-21, SR-4.1-SR-4.6 |
| Usability excellence         | NFR-U-1 through NFR-U-10, UIR-1 through UIR-5    |
| Zero-cost implementation     | C-F-1, C-F-2, C-F-3, SAR-11                      |
| Accessibility                | NFR-A-1 through NFR-A-7, UIR-DS-1                |

---

**END OF PROJECT REQUIREMENTS DOCUMENT**

---

**Document Prepared By:** [Student Name]  
**Institution:** [University Name]  
**Course:** Human-Computer Interaction  
**Semester:** Fall 2025  
**Submission Date:** December 11, 2025

**Total Pages:** 31  
**Word Count:** ~12,500 words  
**Status:** FINAL - Ready for Implementation
