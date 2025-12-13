# Hairstyle Images

## Directory Structure

This directory contains hairstyle template images for the StyleAI project.

```
public/hairstyles/
├── oval/
│   ├── long-layers.png
│   ├── textured-crop.png
│   ├── side-part.png
│   ├── messy-quiff.png
│   ├── slicked-back.png
│   └── thumbs/
│       └── (auto-generated thumbnails)
├── round/
│   ├── high-fade-volume.png
│   ├── angular-fringe.png
│   ├── pompadour.png
│   ├── undercut.png
│   ├── textured-crop.png
│   └── thumbs/
│       └── (auto-generated thumbnails)
├── square/
│   ├── soft-waves.png
│   ├── layered-fringe.png
│   ├── textured-brush-up.png
│   ├── medium-layers.png
│   ├── soft-side-part.png
│   └── thumbs/
│       └── (auto-generated thumbnails)
├── heart/
│   ├── full-fringe.png
│   ├── chin-bob.png
│   ├── side-waves.png
│   ├── textured-crop.png
│   ├── medium-layers.png
│   └── thumbs/
│       └── (auto-generated thumbnails)
├── oblong/
│   ├── horizontal-layers.png
│   ├── full-fringe.png
│   ├── chin-blunt.png
│   ├── side-bangs.png
│   ├── volume-crop.png
│   └── thumbs/
│       └── (auto-generated thumbnails)
├── diamond/
│   ├── side-fringe.png
│   ├── chin-layers.png
│   ├── textured-quiff.png
│   ├── beard-combo.png
│   ├── slick-side.png
│   └── thumbs/
│       └── (auto-generated thumbnails)
```

## Image Requirements

- **Format:** PNG with transparent background
- **Dimensions:** 800x1200px (portrait, 2:3 ratio)
- **File size:** < 500KB each
- **Thumbnails:** 150x150px, < 50KB

## File Checklist

### OVAL Face (5 images)
- [ ] `long-layers.png`
- [ ] `textured-crop.png`
- [ ] `side-part.png`
- [ ] `messy-quiff.png`
- [ ] `slicked-back.png`

### ROUND Face (5 images)
- [ ] `high-fade-volume.png`
- [ ] `angular-fringe.png`
- [ ] `pompadour.png`
- [ ] `undercut.png`
- [ ] `textured-crop.png`

### SQUARE Face (5 images)
- [ ] `soft-waves.png`
- [ ] `layered-fringe.png`
- [ ] `textured-brush-up.png`
- [ ] `medium-layers.png`
- [ ] `soft-side-part.png`

### HEART Face (5 images)
- [ ] `full-fringe.png`
- [ ] `chin-bob.png`
- [ ] `side-waves.png`
- [ ] `textured-crop.png`
- [ ] `medium-layers.png`

### OBLONG Face (5 images)
- [ ] `horizontal-layers.png`
- [ ] `full-fringe.png`
- [ ] `chin-blunt.png`
- [ ] `side-bangs.png`
- [ ] `volume-crop.png`

### DIAMOND Face (5 images)
- [ ] `side-fringe.png`
- [ ] `chin-layers.png`
- [ ] `textured-quiff.png`
- [ ] `beard-combo.png`
- [ ] `slick-side.png`

## Generation Instructions

See **HAIRSTYLE_PROMPTS.md** in the project root for AI generation prompts.

## Processing Instructions

After placing PNG files in their respective directories:

```bash
# Install dependencies
pnpm install

# Process and optimize images
pnpm run process-images
```

This will:
1. Optimize images to meet size requirements
2. Generate thumbnails automatically
3. Validate transparency
4. Create processing report

## Notes

- All images must have transparent backgrounds
- Front-facing view only
- No face or body parts visible
- Hairstyle isolated in space
- See SPEC.md section 4.1 for detailed requirements
