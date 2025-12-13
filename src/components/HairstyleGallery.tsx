/**
 * Hairstyle gallery component
 *
 * Displays recommended hairstyles in a responsive grid with:
 * - Visual selection indicators
 * - Full keyboard navigation (Arrow keys, Enter, Space)
 * - ARIA attributes for screen readers
 * - Focus management
 *
 * Performance Optimizations:
 * - Memoized to prevent unnecessary re-renders
 * - Callbacks wrapped in useCallback
 * - Only re-renders when hairstyles or selection changes
 *
 * @see CONVENTIONS.md section 3.1 - Component Structure
 * @see CONVENTIONS.md section 6 - Accessibility Standards
 * @see SPEC.md section 2.1 - Hairstyle type definition
 */

"use client";

import React, { useRef, useCallback, KeyboardEvent } from "react";
import type { Hairstyle } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HairstyleGalleryProps {
  hairstyles: Hairstyle[];
  selectedId?: string;
  onSelect: (hairstyle: Hairstyle) => void;
}

/**
 * Grid gallery for displaying hairstyle recommendations
 * with keyboard navigation and accessibility support
 */
export const HairstyleGallery = React.memo(function HairstyleGallery({
  hairstyles,
  selectedId,
  onSelect,
}: HairstyleGalleryProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /**
   * Focus a specific hairstyle card by index
   */
  const focusCard = useCallback(
    (index: number) => {
      if (index < 0 || index >= hairstyles.length) return;

      const hairstyle = hairstyles[index];
      const card = cardRefs.current.get(hairstyle.id);
      if (card) {
        card.focus();
      }
    },
    [hairstyles]
  );

  /**
   * Handle keyboard navigation
   * Arrow keys: Navigate between items
   * Enter/Space: Select item
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, hairstyle: Hairstyle, index: number) => {
      const columns =
        window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 2;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          focusCard(index + 1);
          break;

        case "ArrowLeft":
          e.preventDefault();
          focusCard(index - 1);
          break;

        case "ArrowDown":
          e.preventDefault();
          focusCard(index + columns);
          break;

        case "ArrowUp":
          e.preventDefault();
          focusCard(index - columns);
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          onSelect(hairstyle);
          break;

        case "Home":
          e.preventDefault();
          focusCard(0);
          break;

        case "End":
          e.preventDefault();
          focusCard(hairstyles.length - 1);
          break;
      }
    },
    [focusCard, onSelect, hairstyles.length]
  );

  /**
   * Handle card click
   */
  const handleClick = useCallback(
    (hairstyle: Hairstyle) => {
      onSelect(hairstyle);
    },
    [onSelect]
  );

  // Empty state
  if (hairstyles.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-muted-foreground">No hairstyles available</p>
      </div>
    );
  }

  return (
    <div
      role="grid"
      aria-label="Hairstyle recommendations"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
    >
      {hairstyles.map((hairstyle, index) => {
        const isSelected = selectedId === hairstyle.id;

        return (
          <div
            key={hairstyle.id}
            role="gridcell"
            ref={(el) => {
              if (el) {
                cardRefs.current.set(hairstyle.id, el);
              } else {
                cardRefs.current.delete(hairstyle.id);
              }
            }}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleClick(hairstyle)}
            onKeyDown={(e) => handleKeyDown(e, hairstyle, index)}
            aria-selected={isSelected}
            aria-label={`${hairstyle.name}, ${hairstyle.suitabilityScore}% match. ${hairstyle.description}`}
            className={cn(
              "cursor-pointer outline-none transition-all",
              "focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "hover:scale-[1.02]"
            )}
          >
            <Card
              className={cn(
                "h-full transition-all hover:shadow-lg",
                isSelected && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                  {/* Selection indicator */}
                  {isSelected && (
                    <div
                      className="absolute right-2 top-2 z-10 rounded-full bg-primary p-1 shadow-lg"
                      aria-hidden="true"
                    >
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  {/* Placeholder for hairstyle image (Day 4) */}
                  <div className="flex h-full items-center justify-center p-4 text-center">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        {hairstyle.name}
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        Image preview
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col items-start gap-2 p-3">
                <p className="text-sm font-medium leading-tight">
                  {hairstyle.name}
                </p>
                <div className="flex w-full items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {hairstyle.suitabilityScore}% match
                  </Badge>
                  {hairstyle.tags && hairstyle.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {hairstyle.tags[0]}
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
});
