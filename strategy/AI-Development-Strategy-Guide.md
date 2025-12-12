# 🚀 AI-DRIVEN DEVELOPMENT STRATEGY GUIDE

## AI-Powered Hair Salon Recommendation System

---

| **Document Info** |                                    |
| ----------------- | ---------------------------------- |
| **Project**       | StyleAI - Hair Salon Recommendation System |
| **Duration**      | 7 Days                             |
| **AI Tools**      | GitHub Copilot Premium + Claude Pro (CLI) |
| **Budget**        | $0 (Free tier services only)       |
| **Approach**      | Spec-Driven AI Development         |
| **Created**       | December 11, 2025                  |

---

## 📋 TABLE OF CONTENTS

1. [Spec-Driven Development Overview](#1-spec-driven-development-overview)
2. [Project Files & Their Purpose](#2-project-files--their-purpose)
3. [AI Tools Setup & Configuration](#3-ai-tools-setup--configuration)
4. [Pre-Development Phase (Day 0)](#4-pre-development-phase-day-0)
5. [Day 1: Foundation & UI Skeleton](#5-day-1-foundation--ui-skeleton)
6. [Day 2: Computer Vision Integration](#6-day-2-computer-vision-integration)
7. [Day 3: AI/ML Integration (Gemini)](#7-day-3-aiml-integration-gemini)
8. [Day 4: Hairstyle Templates & Database](#8-day-4-hairstyle-templates--database)
9. [Day 5: Interactive Preview System](#9-day-5-interactive-preview-system)
10. [Day 6: Polish, Testing & Optimization](#10-day-6-polish-testing--optimization)
11. [Day 7: Documentation & Presentation](#11-day-7-documentation--presentation)
12. [AI Prompting Techniques](#12-ai-prompting-techniques)
13. [Troubleshooting & Recovery](#13-troubleshooting--recovery)

---

## 1. SPEC-DRIVEN DEVELOPMENT OVERVIEW

### 1.1 What is Spec-Driven AI Development?

Spec-Driven Development means **providing AI tools with comprehensive specifications BEFORE coding**. Instead of describing what you want in each prompt, you give AI tools access to detailed spec files that contain:

- Project context and constraints
- Technical specifications and types
- Architecture and data flows
- Coding conventions and patterns
- Progress tracking

**Result:** AI tools generate more accurate, consistent code with fewer iterations.

### 1.2 The Spec-Driven Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SPEC-DRIVEN AI WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐                                                   │
│  │  SPEC FILES  │ ◀── You created these (CLAUDE.md, SPEC.md, etc.) │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     AI TOOLS READ SPECS                       │  │
│  │  ┌─────────────┐              ┌─────────────┐                │  │
│  │  │ Claude CLI  │              │   Copilot   │                │  │
│  │  │ reads       │              │   reads     │                │  │
│  │  │ CLAUDE.md   │              │ .github/    │                │  │
│  │  │ first       │              │ copilot-    │                │  │
│  │  │             │              │ instructions│                │  │
│  │  └─────────────┘              └─────────────┘                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              AI GENERATES CODE FOLLOWING SPECS                │  │
│  │  • Correct types from SPEC.md                                 │  │
│  │  • Proper patterns from CONVENTIONS.md                        │  │
│  │  • Right architecture from ARCHITECTURE.md                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐                                                   │
│  │   YOU CODE   │ ◀── Less back-and-forth, more accurate results   │
│  └──────────────┘                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 Benefits of This Approach

| Traditional Prompting | Spec-Driven Prompting |
|-----------------------|----------------------|
| Describe everything each time | AI already knows context |
| Inconsistent code style | Follows CONVENTIONS.md |
| Wrong types/interfaces | Uses types from SPEC.md |
| Re-explain architecture | Understands from ARCHITECTURE.md |
| Many iterations needed | Often correct first time |

---

## 2. PROJECT FILES & THEIR PURPOSE

### 2.1 File Overview

```
hair-salon-ai/
├── CLAUDE.md                    # 🤖 PRIMARY: Claude CLI context
├── SPEC.md                      # 📋 Technical specification
├── ARCHITECTURE.md              # 🏗️ System architecture
├── CONVENTIONS.md               # 📝 Coding standards
├── TASKS.md                     # ✅ Progress tracking
├── .github/
│   └── copilot-instructions.md  # 🐙 GitHub Copilot rules
└── [your code files]
```

### 2.2 Detailed File Purposes

#### CLAUDE.md (Primary Context File)
**Location:** Project root  
**Read by:** Claude CLI (automatically)  
**Contains:**
- Project overview and constraints
- Tech stack details
- Domain concepts (face shapes, landmarks)
- API contracts
- Current development phase
- Questions AI should ask before coding

**How Claude CLI uses it:**
```bash
cd hair-salon-ai
claude chat  # Claude automatically reads CLAUDE.md
```

#### .github/copilot-instructions.md
**Location:** `.github/` folder  
**Read by:** GitHub Copilot (automatically)  
**Contains:**
- TypeScript rules
- React component patterns
- Tailwind CSS conventions
- Import order
- Error handling patterns
- Domain-specific code examples

**How Copilot uses it:** Automatically applied to all suggestions in VS Code.

#### SPEC.md (Technical Specification)
**Location:** Project root  
**Read by:** Both (when referenced)  
**Contains:**
- All TypeScript interfaces
- Face shape classification algorithm
- Complete hairstyle database
- Canvas overlay positioning formulas
- API request/response schemas
- Error codes and messages

**How to reference:**
```
See SPEC.md section 2.1 for the FaceLandmark interface
```

#### ARCHITECTURE.md
**Location:** Project root  
**Read by:** Both (when referenced)  
**Contains:**
- System architecture diagrams
- Component hierarchy
- Data flow diagrams
- State management structure
- API architecture
- Deployment architecture

**How to reference:**
```
Follow the component structure in ARCHITECTURE.md section 2
```

#### CONVENTIONS.md
**Location:** Project root  
**Read by:** Both (when referenced)  
**Contains:**
- File naming rules
- Import organization
- TypeScript standards
- React patterns
- Tailwind conventions
- Error handling patterns
- Accessibility requirements
- Testing conventions

**How to reference:**
```
Follow the React component structure from CONVENTIONS.md section 3.1
```

#### TASKS.md
**Location:** Project root  
**Used by:** You (manual updates)  
**Contains:**
- Daily task checklists
- Progress tracking
- Known issues log
- Daily standup template

**How to use:** Update checkboxes as you complete tasks each day.

---

## 3. AI TOOLS SETUP & CONFIGURATION

### 3.1 GitHub Copilot Premium Setup

#### Step 1: Install VS Code Extensions

```bash
# Open VS Code and install:
# 1. GitHub Copilot
# 2. GitHub Copilot Chat
```

#### Step 2: Verify Copilot Instructions are Active

GitHub Copilot automatically reads `.github/copilot-instructions.md`. Verify it's working:

1. Open any `.tsx` file
2. Start typing a component
3. Check if suggestions follow your conventions

#### Step 3: Configure VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "typescript": true,
    "typescriptreact": true,
    "markdown": true
  },
  "editor.inlineSuggest.enabled": true
}
```

#### Step 4: Essential Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Accept suggestion | `Tab` |
| Dismiss suggestion | `Esc` |
| Next suggestion | `Alt + ]` |
| Previous suggestion | `Alt + [` |
| Open Copilot Chat | `Ctrl + Shift + I` |
| Inline Copilot | `Ctrl + I` |

### 3.2 Claude CLI Setup

#### Step 1: Install Claude CLI

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

#### Step 2: Authenticate

```bash
claude auth login
# Follow browser prompts
```

#### Step 3: Configure for Your Project

Claude CLI automatically reads `CLAUDE.md` from the current directory. Just navigate to your project:

```bash
cd ~/hair-salon-ai
claude chat
# Claude now has full project context!
```

#### Step 4: Useful Claude CLI Commands

```bash
# Start chat with project context
claude chat

# Ask about specific file
claude "explain src/lib/faceDetection.ts"

# Generate code
claude "create the CameraCapture component following CONVENTIONS.md"

# Review code
claude "review src/components/HairstyleGallery.tsx against CONVENTIONS.md"

# Fix issues
claude "fix TypeScript errors in src/lib/classifier.ts"
```

### 3.3 Workflow Integration

**Daily Development Pattern:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY WORKFLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MORNING: Plan with Claude CLI                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  $ cd hair-salon-ai                                        │ │
│  │  $ claude chat                                             │ │
│  │  > "What should I build today? Check TASKS.md"             │ │
│  │  > "Design the FaceDetector component architecture"        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  CODING: Build with Copilot                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  1. Open VS Code                                           │ │
│  │  2. Create file, write comment describing intent           │ │
│  │  3. Let Copilot suggest code (follows copilot-instructions)│ │
│  │  4. Accept/modify suggestions                              │ │
│  │  5. Use Copilot Chat for complex components                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  REVIEW: Verify with Claude CLI                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  $ claude "review today's code against CONVENTIONS.md"     │ │
│  │  $ claude "check if FaceDetector follows ARCHITECTURE.md"  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  END OF DAY: Update TASKS.md                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  - Check off completed tasks                               │ │
│  │  - Note any blockers                                       │ │
│  │  - Update "Current Phase" in CLAUDE.md                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. PRE-DEVELOPMENT PHASE (DAY 0)

### 4.1 Environment Setup Checklist

```bash
# 1. Check prerequisites
node --version    # Should be 18+
npm --version     # Should be 9+
git --version     # Any recent version

# 2. Install global tools
npm install -g pnpm
npm install -g @anthropic-ai/claude-code
npm install -g vercel

# 3. Authenticate services
claude auth login
vercel login
```

### 4.2 Project Initialization

```bash
# Create Next.js project
npx create-next-app@latest hair-salon-ai \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd hair-salon-ai
```

### 4.3 Add Spec Files to Project

```bash
# Copy all spec files to project root
# (Download from the files I provided)

# Your project should now have:
hair-salon-ai/
├── CLAUDE.md
├── SPEC.md
├── ARCHITECTURE.md
├── CONVENTIONS.md
├── TASKS.md
├── .github/
│   └── copilot-instructions.md
├── src/
├── package.json
└── ...
```

### 4.4 Verify AI Tools Have Context

**Test Claude CLI:**
```bash
cd hair-salon-ai
claude chat
> "What is this project about?"
# Should describe StyleAI hair salon project
> "What face shapes do we support?"
# Should list: oval, round, square, heart, oblong, diamond
```

**Test Copilot:**
1. Open VS Code in project
2. Create `src/test.tsx`
3. Type: `// React component for camera capture`
4. Copilot should suggest code following your conventions

### 4.5 Get API Keys

**Google Gemini API:**
1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create new key
4. Save to `.env.local`:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

---

## 5. DAY 1: FOUNDATION & UI SKELETON

### 5.1 Morning Session (4 hours)

#### Start with Claude CLI Planning

```bash
cd hair-salon-ai
claude chat
```

**Prompt 1: Verify Setup**
```
I'm starting Day 1 of the StyleAI project. 
Check TASKS.md for today's tasks.
What should I do first?
```

**Prompt 2: Install Dependencies**
```
Based on SPEC.md and ARCHITECTURE.md, what npm packages do I need to install?
Give me the exact pnpm commands.
```

**Expected Response Will Include:**
```bash
pnpm add @mediapipe/tasks-vision @google/generative-ai clsx tailwind-merge lucide-react
pnpm add -D @types/node prettier
npx shadcn@latest init
npx shadcn@latest add button card dialog slider toast
```

#### Create Core Files with Copilot

Open VS Code and create files. Copilot will follow `copilot-instructions.md`:

**File: `src/types/index.ts`**
```typescript
// Copy all types from SPEC.md section 2.1
// Copilot will help complete based on conventions
```

**File: `src/lib/utils.ts`**
```typescript
// Utility functions following CONVENTIONS.md
// cn() helper for Tailwind class merging
```

### 5.2 Afternoon Session (4 hours)

#### Build Landing Page with Copilot Chat

Press `Ctrl+Shift+I` in VS Code:

```
Create the landing page for StyleAI following:
- ARCHITECTURE.md section 2 for component structure
- CONVENTIONS.md section 3 for React patterns
- CONVENTIONS.md section 4 for Tailwind usage

Include:
- Hero with "StyleAI" name and tagline
- 3 feature cards
- Primary CTA "Start Analysis"
- Responsive layout
```

#### Build Camera Component

**In Copilot Chat:**
```
Create CameraCapture.tsx component following:
- Interface from SPEC.md (if there's a CameraCaptureProps)
- Component structure from CONVENTIONS.md section 3.1
- Accessibility from CONVENTIONS.md section 6

Features:
- WebRTC camera access
- Live video preview
- Face guide overlay
- Capture button
- Permission error handling
```

### 5.3 End of Day 1

**Review with Claude CLI:**
```bash
claude chat
> "Review src/app/page.tsx against CONVENTIONS.md. Any issues?"
> "Does CameraCapture.tsx follow the patterns in copilot-instructions.md?"
```

**Update TASKS.md:**
- Check off completed items
- Note any issues

**Update CLAUDE.md:**
Change "Current Phase" to:
```markdown
**Phase:** Day 1 Complete
- [x] Day 1: Project setup, UI skeleton
- [ ] Day 2: Face detection integration
```

---

## 6. DAY 2: COMPUTER VISION INTEGRATION

### 6.1 Morning Session

#### Start with Claude CLI

```bash
claude chat
```

**Prompt:**
```
I'm starting Day 2 - Face Detection.

Look at:
- SPEC.md section 3 for landmark indices and classification algorithm
- ARCHITECTURE.md section 3.2 for data flow
- TASKS.md Day 2 checklist

Help me understand the MediaPipe integration approach.
```

#### Create Face Detection Module

**Use Claude CLI for complex logic:**
```
Create src/lib/faceDetection.ts following:
- Landmark indices from SPEC.md section 3.1
- The exact TypeScript interfaces from SPEC.md section 2.1
- Error handling from CONVENTIONS.md section 5

Include:
- initializeFaceLandmarker()
- detectFace(video)
- extractKeyLandmarks(landmarks)
```

**Then use Copilot for the hook:**

In `src/hooks/useFaceDetection.ts`, write:
```typescript
// Custom hook for real-time face detection
// Uses MediaPipe FaceLandmarker
// Returns: { landmarks, isDetecting, error }
// Follow CONVENTIONS.md section 3.2 for hooks
```

### 6.2 Afternoon Session

#### Build Classification Algorithm

**Claude CLI Prompt:**
```
Create src/lib/faceShapeClassifier.ts implementing:
- The exact algorithm from SPEC.md section 3.2
- The confidence calculation from SPEC.md section 3.3
- TypeScript types from SPEC.md section 2.1

Follow CONVENTIONS.md for code style.
```

#### Test Classification

**Claude CLI:**
```
Generate test cases for faceShapeClassifier.ts based on:
- The classification rules in SPEC.md section 3.2
- Test conventions from CONVENTIONS.md section 8
```

### 6.3 End of Day 2

**Review:**
```bash
claude "Review all Day 2 code against SPEC.md. Are the landmark indices correct?"
```

**Update TASKS.md and CLAUDE.md**

---

## 7. DAY 3: AI/ML INTEGRATION (GEMINI)

### 7.1 Morning Session

#### API Route with Claude CLI

```
Create src/app/api/analyze-face/route.ts following:
- API contract from SPEC.md section 2.2 (AnalyzeFaceRequest/Response)
- Error codes from SPEC.md section 6.1
- CONVENTIONS.md section for API routes

Include:
- Input validation
- Gemini API call
- Rate limiting (15 req/min)
- Retry logic
- Proper error responses
```

### 7.2 Afternoon Session

#### Hairstyle Database

**Claude CLI:**
```
The hairstyle database in SPEC.md section 4.1 is complete.
Create src/lib/hairstyleDatabase.ts that exports this exact data.
Follow the Hairstyle interface from SPEC.md section 2.1.
```

#### Recommendation API

**Copilot Chat:**
```
Create /api/recommend route following:
- RecommendResponse from SPEC.md section 2.2
- Return 5 hairstyles for given face shape
- Use hairstyleDatabase.ts
```

---

## 8. DAY 4: HAIRSTYLE TEMPLATES & DATABASE

### 8.1 Morning Session

#### Image Processing Strategy

**Claude CLI:**
```
I need 30 hairstyle PNG templates (5 per face shape).
Based on SPEC.md section 4.1 hairstyle database, what images do I need?
Suggest free sources and processing workflow.
```

### 8.2 Afternoon Session

#### Overlay Engine

**Claude CLI:**
```
Create src/lib/overlayEngine.ts implementing:
- Position calculation from SPEC.md section 5.1
- Rendering pipeline from SPEC.md section 5.2
- Use landmark indices from SPEC.md section 3.1

Follow CONVENTIONS.md for TypeScript and comments.
```

---

## 9. DAY 5: INTERACTIVE PREVIEW SYSTEM

### 9.1 Morning Session

#### Gallery Component

**Copilot Chat:**
```
Create HairstyleGallery.tsx following:
- Component structure from CONVENTIONS.md section 3.1
- Accessibility from CONVENTIONS.md section 6
- Hairstyle type from SPEC.md section 2.1

Features: grid layout, selection state, keyboard navigation
```

#### Before/After Slider

**Claude CLI:**
```
Create BeforeAfterSlider.tsx with:
- Touch + mouse support
- Keyboard accessibility (CONVENTIONS.md section 6.3)
- 60fps animation
- Canvas-based rendering
```

### 9.2 Afternoon Session

#### Assemble Results Page

**Claude CLI:**
```
Create the complete Results page following:
- Layout from ARCHITECTURE.md section 3 (User Flow)
- State structure from ARCHITECTURE.md section 4.1
- All components we've built

Reference SPEC.md for data types throughout.
```

---

## 10. DAY 6: POLISH, TESTING & OPTIMIZATION

### 10.1 Morning Session

#### Error Handling Audit

**Claude CLI:**
```
Audit the entire codebase for error handling:
- Check against error codes in SPEC.md section 6.1
- Verify all errors have user-friendly messages
- Ensure recovery actions exist

List any gaps and provide fixes.
```

#### Performance Check

**Claude CLI:**
```
Review performance against SPEC.md section 7:
- Initial load < 3s
- Face detection < 2s
- Preview render < 3s

What optimizations are needed?
```

### 10.2 Afternoon Session

#### Accessibility Audit

**Claude CLI:**
```
Audit accessibility against CONVENTIONS.md section 6:
- Color contrast
- Keyboard navigation
- ARIA labels
- Focus indicators

List issues and fixes.
```

---

## 11. DAY 7: DOCUMENTATION & PRESENTATION

### 11.1 Morning Session

**Claude CLI:**
```
Generate a comprehensive README.md that includes:
- Project description from CLAUDE.md
- Architecture diagram from ARCHITECTURE.md
- Setup instructions
- API documentation from SPEC.md section 2.2
```

### 11.2 Afternoon Session

**Claude CLI:**
```
Help me write the IEEE paper. Use:
- Project overview from CLAUDE.md
- Technical details from SPEC.md
- Architecture from ARCHITECTURE.md
- HCI principles from CLAUDE.md "HCI Principles to Demonstrate"
```

---

## 12. AI PROMPTING TECHNIQUES

### 12.1 Reference Spec Files Explicitly

**Good Prompt:**
```
Create the FaceDetector component following:
- Props interface from SPEC.md section 2.1
- Landmark indices from SPEC.md section 3.1
- Component patterns from CONVENTIONS.md section 3.1
```

**Bad Prompt:**
```
Create a face detector component
```

### 12.2 Use Section Numbers

```
Implement the classification algorithm from SPEC.md section 3.2 exactly.
```

### 12.3 Ask for Verification

```
After creating this, verify it matches:
- Types in SPEC.md
- Patterns in CONVENTIONS.md
- Architecture in ARCHITECTURE.md
```

### 12.4 Update Context

When you make significant changes:
```
I've updated the FaceDetector to use a different approach.
Update your understanding: [describe changes]
```

---

## 13. TROUBLESHOOTING & RECOVERY

### 13.1 If AI Generates Wrong Code

```
The generated code doesn't match SPEC.md section X.
Specifically, [describe issue].
Please regenerate following the spec exactly.
```

### 13.2 If Behind Schedule

Check TASKS.md for priority cuts:
- Day 4: Reduce to 3 hairstyles per shape
- Day 5: Skip before/after slider
- Day 6: Minimal testing

### 13.3 If API Issues

SPEC.md section 6 has fallback strategies. Reference it:
```
Gemini API is failing. Implement the fallback 
classification from SPEC.md that uses local geometry only.
```

---

## 📋 QUICK REFERENCE

### Daily Workflow

```
MORNING:
  $ claude chat
  > "Check TASKS.md, what's today's priority?"

CODING:
  - Write comments describing intent
  - Let Copilot suggest (follows copilot-instructions.md)
  - Use Copilot Chat for complex components

REVIEW:
  $ claude "Review today's code against CONVENTIONS.md"

END OF DAY:
  - Update TASKS.md checkboxes
  - Update CLAUDE.md current phase
```

### Essential Prompts

```bash
# Planning
claude "What should I build today? Check TASKS.md"

# Generating
claude "Create X following SPEC.md section Y and CONVENTIONS.md section Z"

# Reviewing
claude "Review X against CONVENTIONS.md"

# Debugging
claude "This doesn't match SPEC.md section X. Fix it."
```

### File Reference Quick Guide

| Need | Reference |
|------|-----------|
| TypeScript types | SPEC.md section 2 |
| Landmark indices | SPEC.md section 3.1 |
| Classification algorithm | SPEC.md section 3.2 |
| Hairstyle data | SPEC.md section 4 |
| Overlay positioning | SPEC.md section 5 |
| Error messages | SPEC.md section 6 |
| Component patterns | CONVENTIONS.md section 3 |
| Tailwind usage | CONVENTIONS.md section 4 |
| Data flow | ARCHITECTURE.md section 3 |
| State structure | ARCHITECTURE.md section 4 |

---

**You're ready to build! The spec files give AI tools everything they need.** 🚀
