/**
 * Hairstyle database and recommendation engine
 * 
 * Complete database of 30 hairstyles (5 per face shape) from SPEC.md section 4.1
 */

import { Hairstyle, FaceShape } from "@/types";

/**
 * Complete hairstyle database with 30 styles
 */
export const HAIRSTYLE_DATABASE: Hairstyle[] = [
  // ===== OVAL FACE =====
  {
    id: 'oval-1',
    name: 'Long Layers',
    category: 'oval',
    imagePath: '/hairstyles/oval/long-layers.png',
    thumbnailPath: '/hairstyles/oval/thumbs/long-layers.png',
    description: 'Flowing, face-framing layers that add movement and dimension. Works beautifully with oval faces by complementing natural proportions.',
    suitabilityScore: 95,
    reasoning: 'Oval faces can pull off almost any style, and long layers enhance natural symmetry.',
    tags: ['versatile', 'feminine', 'professional'],
  },
  {
    id: 'oval-2',
    name: 'Textured Crop',
    category: 'oval',
    imagePath: '/hairstyles/oval/textured-crop.png',
    thumbnailPath: '/hairstyles/oval/thumbs/textured-crop.png',
    description: 'A modern, low-maintenance cut with textured top and tapered sides. Adds personality while keeping a clean look.',
    suitabilityScore: 92,
    reasoning: 'The balanced proportions of oval faces allow for versatile shorter styles.',
    tags: ['modern', 'casual', 'low-maintenance'],
  },
  {
    id: 'oval-3',
    name: 'Classic Side Part',
    category: 'oval',
    imagePath: '/hairstyles/oval/side-part.png',
    thumbnailPath: '/hairstyles/oval/thumbs/side-part.png',
    description: 'Timeless, sophisticated side-parted style suitable for any occasion. Clean lines with natural movement.',
    suitabilityScore: 90,
    reasoning: 'A classic choice that works with oval face symmetry without overwhelming features.',
    tags: ['classic', 'professional', 'formal'],
  },
  {
    id: 'oval-4',
    name: 'Messy Quiff',
    category: 'oval',
    imagePath: '/hairstyles/oval/messy-quiff.png',
    thumbnailPath: '/hairstyles/oval/thumbs/messy-quiff.png',
    description: 'Relaxed, textured volume on top with an effortlessly styled appearance. Perfect for a casual yet put-together look.',
    suitabilityScore: 88,
    reasoning: 'Adds height and texture without disrupting the balanced oval shape.',
    tags: ['casual', 'trendy', 'youthful'],
  },
  {
    id: 'oval-5',
    name: 'Slicked Back',
    category: 'oval',
    imagePath: '/hairstyles/oval/slicked-back.png',
    thumbnailPath: '/hairstyles/oval/thumbs/slicked-back.png',
    description: 'Smooth, swept-back style that creates a polished, refined appearance. Best with medium to longer length.',
    suitabilityScore: 86,
    reasoning: 'Showcases the natural symmetry and proportions of an oval face beautifully.',
    tags: ['elegant', 'formal', 'sophisticated'],
  },

  // ===== ROUND FACE =====
  {
    id: 'round-1',
    name: 'High Fade Volume',
    category: 'round',
    imagePath: '/hairstyles/round/high-fade-volume.png',
    thumbnailPath: '/hairstyles/round/thumbs/high-fade-volume.png',
    description: 'Height-building style with a high fade on the sides. Creates the illusion of a longer face shape.',
    suitabilityScore: 96,
    reasoning: 'Adds vertical height to elongate round face appearance while keeping sides sleek.',
    tags: ['modern', 'structured', 'face-slimming'],
  },
  {
    id: 'round-2',
    name: 'Angular Fringe',
    category: 'round',
    imagePath: '/hairstyles/round/angular-fringe.png',
    thumbnailPath: '/hairstyles/round/thumbs/angular-fringe.png',
    description: 'Asymmetrical fringe that creates angles and dimension. Adds structure to softer facial features.',
    suitabilityScore: 93,
    reasoning: 'Diagonal lines break up roundness and create the appearance of angles.',
    tags: ['edgy', 'modern', 'angular'],
  },
  {
    id: 'round-3',
    name: 'Pompadour',
    category: 'round',
    imagePath: '/hairstyles/round/pompadour.png',
    thumbnailPath: '/hairstyles/round/thumbs/pompadour.png',
    description: 'Classic volume style with height at the front. A bold choice that transforms face proportions.',
    suitabilityScore: 91,
    reasoning: 'Significant height on top elongates the face and adds dramatic proportions.',
    tags: ['bold', 'classic', 'statement'],
  },
  {
    id: 'round-4',
    name: 'Undercut',
    category: 'round',
    imagePath: '/hairstyles/round/undercut.png',
    thumbnailPath: '/hairstyles/round/thumbs/undercut.png',
    description: 'Dramatic contrast between longer top and closely-shaved sides. Creates strong visual lines.',
    suitabilityScore: 89,
    reasoning: 'The contrast and clean sides help define facial structure against soft curves.',
    tags: ['bold', 'modern', 'contrast'],
  },
  {
    id: 'round-5',
    name: 'Textured Crop',
    category: 'round',
    imagePath: '/hairstyles/round/textured-crop.png',
    thumbnailPath: '/hairstyles/round/thumbs/textured-crop.png',
    description: 'Textured movement on top with clean sides. Adds interest without bulk on sides.',
    suitabilityScore: 87,
    reasoning: 'Keeps sides minimal while adding textured height to create vertical emphasis.',
    tags: ['trendy', 'textured', 'low-maintenance'],
  },

  // ===== SQUARE FACE =====
  {
    id: 'square-1',
    name: 'Soft Waves',
    category: 'square',
    imagePath: '/hairstyles/square/soft-waves.png',
    thumbnailPath: '/hairstyles/square/thumbs/soft-waves.png',
    description: 'Flowing waves that soften angular features. Creates movement and reduces harsh lines.',
    suitabilityScore: 95,
    reasoning: 'Curved lines contrast with and soften the angular jaw and forehead.',
    tags: ['soft', 'romantic', 'feminine'],
  },
  {
    id: 'square-2',
    name: 'Layered Fringe',
    category: 'square',
    imagePath: '/hairstyles/square/layered-fringe.png',
    thumbnailPath: '/hairstyles/square/thumbs/layered-fringe.png',
    description: 'Layered bangs that sweep across the forehead. Reduces the appearance of a wide forehead.',
    suitabilityScore: 92,
    reasoning: 'Breaks up the strong horizontal line of the forehead with soft layers.',
    tags: ['soft', 'face-framing', 'versatile'],
  },
  {
    id: 'square-3',
    name: 'Textured Brush Up',
    category: 'square',
    imagePath: '/hairstyles/square/textured-brush-up.png',
    thumbnailPath: '/hairstyles/square/thumbs/textured-brush-up.png',
    description: 'Textured top brushed upward and back. Adds height without accentuating width.',
    suitabilityScore: 89,
    reasoning: 'Vertical lift draws attention upward away from the strong jawline.',
    tags: ['modern', 'textured', 'height'],
  },
  {
    id: 'square-4',
    name: 'Medium Layers',
    category: 'square',
    imagePath: '/hairstyles/square/medium-layers.png',
    thumbnailPath: '/hairstyles/square/thumbs/medium-layers.png',
    description: 'Shoulder-length layers that frame the face. Versatile for professional and casual settings.',
    suitabilityScore: 88,
    reasoning: 'Layers add movement and soften the angular jaw structure.',
    tags: ['professional', 'versatile', 'layered'],
  },
  {
    id: 'square-5',
    name: 'Soft Side Part',
    category: 'square',
    imagePath: '/hairstyles/square/soft-side-part.png',
    thumbnailPath: '/hairstyles/square/thumbs/soft-side-part.png',
    description: 'Gentle side part with soft styling. Creates asymmetry to balance strong features.',
    suitabilityScore: 86,
    reasoning: 'Asymmetrical styling breaks up the symmetry of a square face.',
    tags: ['classic', 'soft', 'professional'],
  },

  // ===== HEART FACE =====
  {
    id: 'heart-1',
    name: 'Full Fringe',
    category: 'heart',
    imagePath: '/hairstyles/heart/full-fringe.png',
    thumbnailPath: '/hairstyles/heart/thumbs/full-fringe.png',
    description: 'Full bangs that cover the forehead. Creates balance by reducing forehead prominence.',
    suitabilityScore: 96,
    reasoning: 'Minimizes the appearance of a wider forehead while framing the face.',
    tags: ['balancing', 'bangs', 'face-framing'],
  },
  {
    id: 'heart-2',
    name: 'Chin-Length Bob',
    category: 'heart',
    imagePath: '/hairstyles/heart/chin-bob.png',
    thumbnailPath: '/hairstyles/heart/thumbs/chin-bob.png',
    description: 'Classic bob that ends at the chin. Adds width at the jawline for balance.',
    suitabilityScore: 94,
    reasoning: 'The volume at chin level balances the wider forehead.',
    tags: ['classic', 'balancing', 'chic'],
  },
  {
    id: 'heart-3',
    name: 'Side-Swept Waves',
    category: 'heart',
    imagePath: '/hairstyles/heart/side-waves.png',
    thumbnailPath: '/hairstyles/heart/thumbs/side-waves.png',
    description: 'Waves that sweep to one side. Creates volume at the lower face while minimizing forehead.',
    suitabilityScore: 91,
    reasoning: 'Asymmetry draws attention from forehead while waves add jaw-level fullness.',
    tags: ['romantic', 'feminine', 'asymmetrical'],
  },
  {
    id: 'heart-4',
    name: 'Textured Crop',
    category: 'heart',
    imagePath: '/hairstyles/heart/textured-crop.png',
    thumbnailPath: '/hairstyles/heart/thumbs/textured-crop.png',
    description: 'Short, textured style with fringe. Modern and low-maintenance with balancing effect.',
    suitabilityScore: 88,
    reasoning: 'Textured fringe softens the forehead while keeping a modern look.',
    tags: ['modern', 'textured', 'short'],
  },
  {
    id: 'heart-5',
    name: 'Medium Layers',
    category: 'heart',
    imagePath: '/hairstyles/heart/medium-layers.png',
    thumbnailPath: '/hairstyles/heart/thumbs/medium-layers.png',
    description: 'Layered style with volume concentrated at jaw level. Balances face proportions.',
    suitabilityScore: 87,
    reasoning: 'Layers add width at the narrower chin area for better proportion.',
    tags: ['layered', 'versatile', 'balancing'],
  },

  // ===== OBLONG FACE =====
  {
    id: 'oblong-1',
    name: 'Horizontal Layers',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/horizontal-layers.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/horizontal-layers.png',
    description: 'Layers that add width to the sides. Creates the illusion of a wider, shorter face.',
    suitabilityScore: 95,
    reasoning: 'Side volume counteracts the length of an oblong face.',
    tags: ['width-adding', 'layered', 'balancing'],
  },
  {
    id: 'oblong-2',
    name: 'Full Fringe',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/full-fringe.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/full-fringe.png',
    description: 'Thick bangs that visually shorten the face. Covers forehead to reduce length appearance.',
    suitabilityScore: 93,
    reasoning: 'Bangs create a horizontal line that visually shortens the face.',
    tags: ['bangs', 'face-shortening', 'bold'],
  },
  {
    id: 'oblong-3',
    name: 'Chin-Length Blunt',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/chin-blunt.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/chin-blunt.png',
    description: 'Blunt cut at chin level with volume. Adds width and creates a more balanced proportion.',
    suitabilityScore: 90,
    reasoning: 'The horizontal blunt line adds visual width and stops vertical eye movement.',
    tags: ['blunt', 'structured', 'width-adding'],
  },
  {
    id: 'oblong-4',
    name: 'Side-Swept Bangs',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/side-bangs.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/side-bangs.png',
    description: 'Angled bangs that sweep across the forehead. Softens the face length while adding style.',
    suitabilityScore: 88,
    reasoning: 'Diagonal lines across the forehead help break up the vertical length.',
    tags: ['soft', 'angled', 'feminine'],
  },
  {
    id: 'oblong-5',
    name: 'Volume Crop',
    category: 'oblong',
    imagePath: '/hairstyles/oblong/volume-crop.png',
    thumbnailPath: '/hairstyles/oblong/thumbs/volume-crop.png',
    description: 'Short style with side volume. Keeps proportions balanced with width at the sides.',
    suitabilityScore: 86,
    reasoning: 'Side volume creates width to balance the longer face shape.',
    tags: ['short', 'voluminous', 'modern'],
  },

  // ===== DIAMOND FACE =====
  {
    id: 'diamond-1',
    name: 'Side-Swept Fringe',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/side-fringe.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/side-fringe.png',
    description: 'Soft fringe swept to the side. Adds width to the narrow forehead area.',
    suitabilityScore: 95,
    reasoning: 'Side fringe creates volume at the forehead to balance prominent cheekbones.',
    tags: ['balancing', 'soft', 'face-framing'],
  },
  {
    id: 'diamond-2',
    name: 'Chin-Length Layers',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/chin-layers.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/chin-layers.png',
    description: 'Layers that add width at the chin. Balances the narrow jaw against wide cheekbones.',
    suitabilityScore: 93,
    reasoning: 'Fullness at chin level creates balance with the widest point at cheekbones.',
    tags: ['layered', 'balancing', 'feminine'],
  },
  {
    id: 'diamond-3',
    name: 'Textured Quiff',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/textured-quiff.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/textured-quiff.png',
    description: 'Volume on top with textured styling. Adds width at the forehead area.',
    suitabilityScore: 90,
    reasoning: 'Top volume balances the narrow forehead against prominent cheekbones.',
    tags: ['modern', 'voluminous', 'textured'],
  },
  {
    id: 'diamond-4',
    name: 'Full Beard Combo',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/beard-combo.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/beard-combo.png',
    description: 'Hairstyle paired with a fuller beard. The beard adds width at the narrow jaw.',
    suitabilityScore: 88,
    reasoning: 'A fuller beard adds crucial width to the narrow jawline for balance.',
    tags: ['masculine', 'balanced', 'complete-look'],
  },
  {
    id: 'diamond-5',
    name: 'Slicked Side Part',
    category: 'diamond',
    imagePath: '/hairstyles/diamond/slick-side.png',
    thumbnailPath: '/hairstyles/diamond/thumbs/slick-side.png',
    description: 'Smooth, side-parted style with volume. Creates a polished look with forehead width.',
    suitabilityScore: 86,
    reasoning: 'The volume at the part adds width to the forehead while maintaining elegance.',
    tags: ['elegant', 'professional', 'smooth'],
  },
];

/**
 * Get hairstyle recommendations for a face shape
 * Returns top 5 hairstyles sorted by suitability score
 */
export function getRecommendations(faceShape: FaceShape): Hairstyle[] {
  return HAIRSTYLE_DATABASE
    .filter((style) => style.category === faceShape)
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 5);
}

/**
 * Get a specific hairstyle by ID
 */
export function getHairstyleById(id: string): Hairstyle | undefined {
  return HAIRSTYLE_DATABASE.find((style) => style.id === id);
}

/**
 * Get all hairstyles for a category
 */
export function getHairstylesByCategory(category: FaceShape): Hairstyle[] {
  return HAIRSTYLE_DATABASE.filter((style) => style.category === category)
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
