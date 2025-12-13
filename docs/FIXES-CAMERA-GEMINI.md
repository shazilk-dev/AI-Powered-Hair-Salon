# Camera & Gemini API Fixes

## Issues Fixed (December 12, 2025)

### 1. ❌ Gemini API 404 Error

**Problem:**

```
[404 Not Found] models/gemini-1.5-flash is not found for API version v1beta
```

**Root Cause:**  
Using incorrect model name `gemini-1.5-flash` which is not available in the v1beta API.

**Solution:**  
Updated to `gemini-1.5-flash-latest` which is the correct stable API endpoint.

**File Changed:** [src/lib/gemini.ts](src/lib/gemini.ts)

```typescript
// Before
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// After
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
```

**Available Models:**

- ✅ `gemini-1.5-flash-latest` (stable, recommended)
- ✅ `gemini-1.5-pro-latest` (more capable, slower)
- ✅ `gemini-2.0-flash-exp` (experimental, fastest)

---

### 2. ❌ Camera Black Screen Issue

**Problem:**  
After granting camera permission, video preview shows black screen instead of camera feed.

**Root Cause:**  
Video element's `srcObject` was set but `play()` was not called at the right time. The video needs to wait for metadata to load before attempting playback.

**Solution:**  
Added `onloadedmetadata` event handler to ensure playback starts after video metadata is loaded.

**File Changed:** [src/hooks/useCamera.ts](src/hooks/useCamera.ts)

```typescript
// Added metadata handler
videoRef.current.onloadedmetadata = () => {
  console.log("Video metadata loaded, attempting to play...");
  videoRef.current
    ?.play()
    .then(() => console.log("Video playback started successfully"))
    .catch((playError) => {
      console.warn("Autoplay failed:", playError);
    });
};

// Also try immediate play if metadata already loaded
if (videoRef.current.readyState >= 2) {
  await videoRef.current.play();
}
```

**Also Added:** Double handler in [src/components/CameraCapture.tsx](src/components/CameraCapture.tsx)

```tsx
<video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  onLoadedMetadata={(e) => {
    const video = e.currentTarget;
    video.play().catch((err) => console.error("Play failed:", err));
  }}
  className="w-full h-full object-cover"
/>
```

---

## Testing

### Test Gemini API

```bash
npm run dev
# Navigate to /analyze
# Capture photo - should now work without 404 errors
```

### Test Camera

```bash
npm run dev
# Navigate to /analyze
# Click "Start Camera"
# Camera feed should appear (not black screen)
# Face guide overlay should be visible
```

---

## Build Status

✅ **Build Successful** - No TypeScript errors

```bash
npm run build
# ✓ Compiled successfully
```

---

## Related Files

- [src/lib/gemini.ts](src/lib/gemini.ts) - Gemini API client
- [src/hooks/useCamera.ts](src/hooks/useCamera.ts) - Camera hook with stream handling
- [src/components/CameraCapture.tsx](src/components/CameraCapture.tsx) - Camera UI component
- [src/app/api/analyze-face/route.ts](src/app/api/analyze-face/route.ts) - API route using Gemini

---

## Notes

- Camera requires HTTPS in production (or localhost for dev)
- Gemini API has rate limits: 15 req/min, 1500 req/day
- Video playback may fail on some browsers if not user-initiated
- Always check browser console for video playback errors
