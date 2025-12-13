# StyleAI - Futuristic UI Design System

## 🎨 Design Philosophy

**Theme:** Cyber-Futuristic with Glassmorphism  
**Color Palette:** Purple → Indigo → Cyan gradient  
**Style:** Clean, Modern, Cinematic, High-tech  
**Inspiration:** Sci-fi interfaces, Apple Vision Pro, Tesla UI

---

## 🌈 Color System

### Primary Colors

- **Purple Primary:** `oklch(0.65 0.25 290)` - #A855F7
- **Cyan Secondary:** `oklch(0.55 0.15 200)` - #22D3EE
- **Background:** `oklch(0.12 0.02 270)` - Deep purple-black

### Gradient Combinations

```css
/* Main Brand Gradient */
background: linear-gradient(135deg,
  oklch(0.65 0.25 290),  /* Purple */
  oklch(0.55 0.2 250),   /* Indigo */
  oklch(0.55 0.15 200)   /* Cyan */
);

/* Hero Gradient */
from-purple-950 via-slate-900 to-cyan-950

/* Button Gradient */
from-purple-600 to-cyan-600
```

---

## 🔮 Key Visual Elements

### 1. Glassmorphism Cards

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Usage:**

- Feature cards
- Modal dialogs
- Navigation bars
- Info panels

### 2. Glow Effects

```css
.glow-purple {
  box-shadow:
    0 0 20px rgba(168, 85, 247, 0.4),
    0 0 40px rgba(168, 85, 247, 0.2),
    0 0 60px rgba(168, 85, 247, 0.1);
}

.glow-cyan {
  box-shadow:
    0 0 20px rgba(34, 211, 238, 0.4),
    0 0 40px rgba(34, 211, 238, 0.2);
}
```

**Usage:**

- CTA buttons
- Active elements
- Focus states
- Important badges

### 3. Animated Background

- Particle system with floating orbs
- Gradient radial pulse
- Grid overlay (subtle)
- Vignette effect

---

## 📐 Spacing & Layout

### Container Sizes

- **XS:** 320px - 640px
- **SM:** 640px - 768px
- **MD:** 768px - 1024px
- **LG:** 1024px - 1280px
- **XL:** 1280px - 1536px

### Padding Scale

- **2XS:** 0.25rem (4px)
- **XS:** 0.5rem (8px)
- **SM:** 1rem (16px)
- **MD:** 1.5rem (24px)
- **LG:** 2rem (32px)
- **XL:** 3rem (48px)
- **2XL:** 4rem (64px)

### Border Radius

- **SM:** 0.5rem (8px)
- **MD:** 0.75rem (12px)
- **LG:** 1rem (16px)
- **XL:** 1.5rem (24px)
- **2XL:** 2rem (32px)
- **FULL:** 9999px

---

## 🔤 Typography

### Font Stack

- **Sans:** Geist Sans (Primary)
- **Mono:** Geist Mono (Code)

### Font Sizes

- **Display:** 6rem (96px) - Hero titles
- **H1:** 3.75rem (60px) - Page titles
- **H2:** 3rem (48px) - Section headers
- **H3:** 2.25rem (36px) - Card titles
- **H4:** 1.5rem (24px) - Subsections
- **Body:** 1rem (16px) - Default text
- **Small:** 0.875rem (14px) - Captions

### Font Weights

- **Light:** 300
- **Normal:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Text Effects

```css
/* Gradient Text */
.gradient-text {
  background: linear-gradient(
    135deg,
    var(--gradient-start),
    var(--gradient-end)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glow Text */
.text-glow {
  text-shadow:
    0 0 20px rgba(168, 85, 247, 0.5),
    0 0 40px rgba(168, 85, 247, 0.3);
}
```

---

## 🎬 Animations

### Transition Durations

- **Fast:** 150ms
- **Normal:** 300ms
- **Slow:** 500ms
- **Slower:** 800ms

### Easing Functions

- **Ease Out:** Good for entrances
- **Ease In:** Good for exits
- **Ease In Out:** Good for loops

### Key Animations

**Fade In Up**

```typescript
{
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}
```

**Scale In**

```typescript
{
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}
```

**Float**

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

**Gradient Shift**

```css
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

---

## 🧩 Component Patterns

### Buttons

**Primary CTA**

```tsx
<Button
  className="
  bg-linear-to-r from-purple-600 to-cyan-600
  hover:scale-105 transition-all
  glow-purple rounded-2xl
"
>
  Start Analysis
</Button>
```

**Secondary**

```tsx
<Button
  className="
  glass-strong border-white/20
  hover:bg-white/10
"
>
  Learn More
</Button>
```

### Cards

**Feature Card**

```tsx
<Card
  className="
  glass-strong 
  border-purple-500/20 
  hover:border-purple-500/40
  hover:scale-105 hover:glow-purple
  transition-all duration-300
"
>
  {content}
</Card>
```

**Info Card**

```tsx
<Card
  className="
  glass rounded-3xl
  border-cyan-500/30
"
>
  {content}
</Card>
```

### Badges

**Status Badge**

```tsx
<Badge
  className="
  glass px-4 py-2 rounded-full
  text-cyan-300
"
>
  <Star className="fill-cyan-300" />
  Featured
</Badge>
```

---

## 🎯 Interactive States

### Hover

- **Scale:** 1.05
- **Brightness:** +10%
- **Glow:** Increase intensity
- **Border:** Brighter color

### Active

- **Scale:** 0.98
- **Brightness:** +5%

### Focus

- **Ring:** 3px solid primary
- **Ring Opacity:** 50%
- **Outline:** None

### Disabled

- **Opacity:** 50%
- **Cursor:** not-allowed
- **Pointer Events:** none

---

## 📱 Responsive Design

### Mobile First Approach

```tsx
// Base styles for mobile
className = "text-base p-4";

// Tablet
className = "md:text-lg md:p-6";

// Desktop
className = "lg:text-xl lg:p-8";
```

### Breakpoint Strategy

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1279px
- **Large:** 1280px+

---

## ♿ Accessibility

### Requirements

1. **ARIA Labels:** All interactive elements
2. **Keyboard Navigation:** Tab order logical
3. **Focus Indicators:** Visible ring/outline
4. **Color Contrast:** WCAG AA minimum (4.5:1)
5. **Alt Text:** All images

### Implementation

```tsx
<button aria-label="Capture photo" className="focus:ring-2 focus:ring-primary">
  <Camera aria-hidden="true" />
  Capture
</button>
```

---

## 🎨 Design Tokens

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### Glow Shadows

```css
--glow-purple: 0 0 20px rgba(168, 85, 247, 0.4);
--glow-cyan: 0 0 20px rgba(34, 211, 238, 0.4);
```

---

## 🔧 Implementation Checklist

### Page-by-Page

**Home Page** ✅

- [x] Animated background
- [x] Gradient text hero
- [x] Glassmorphism cards
- [x] Framer Motion animations
- [x] Trust indicators

**Analyze Page** 🚧

- [ ] Glass camera interface
- [ ] Animated loading states
- [ ] Glow effects on capture
- [ ] Smooth transitions

**Results Page** 🚧

- [ ] Gallery grid with hover effects
- [ ] Preview panel glassmorphism
- [ ] Before/after slider with glow
- [ ] Download button enhancement

---

## 📚 Resources

### Tools Used

- **Framer Motion:** Animations
- **Tailwind CSS:** Utility classes
- **Lucide React:** Icons
- **Radix UI:** Accessible components

### References

- Apple Vision Pro UI
- Cyberpunk 2077 interface design
- Stripe redesign 2023
- Linear app design system

---

_Last Updated: December 13, 2025_
