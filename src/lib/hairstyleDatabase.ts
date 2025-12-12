/**
 * Hairstyle database and recommendation engine
 */

import { Hairstyle, FaceShape } from "@/types";

/**
 * Hairstyle database (will be expanded with actual data)
 */
const hairstyleDatabase: Hairstyle[] = [
  // Oval face shapes (5 styles)
  {
    id: "oval-1",
    name: "Long Layers",
    category: "oval",
    imagePath: "/hairstyles/oval/long-layers.png",
    thumbnailPath: "/hairstyles/oval/thumbs/long-layers.png",
    description: "Versatile layered cut that enhances your balanced proportions.",
    suitabilityScore: 95,
    reasoning: "Oval faces can pull off most styles. Layers add movement and dimension.",
    tags: ["versatile", "professional", "modern"],
  },
  // TODO: Add remaining 29 hairstyles (Day 4)
];

/**
 * Get hairstyle recommendations for a face shape
 */
export function getRecommendations(faceShape: FaceShape): Hairstyle[] {
  const recommendations = hairstyleDatabase
    .filter((style) => style.category === faceShape)
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
    .slice(0, 5);

  return recommendations;
}

/**
 * Get a specific hairstyle by ID
 */
export function getHairstyleById(id: string): Hairstyle | undefined {
  return hairstyleDatabase.find((style) => style.id === id);
}

/**
 * Get all hairstyles for a category
 */
export function getHairstylesByCategory(category: FaceShape): Hairstyle[] {
  return hairstyleDatabase.filter((style) => style.category === category);
}
