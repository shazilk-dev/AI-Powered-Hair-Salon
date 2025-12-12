/**
 * Hairstyle gallery component
 * Displays recommended hairstyles in a grid
 */

"use client";

import { Hairstyle } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HairstyleGalleryProps {
  hairstyles: Hairstyle[];
  selectedId?: string;
  onSelect: (hairstyle: Hairstyle) => void;
}

export function HairstyleGallery({
  hairstyles,
  selectedId,
  onSelect,
}: HairstyleGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {hairstyles.map((hairstyle) => {
        const isSelected = selectedId === hairstyle.id;

        return (
          <Card
            key={hairstyle.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(hairstyle)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted">
                {isSelected && (
                  <div className="absolute right-2 top-2 z-10 rounded-full bg-primary p-1">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                {/* Thumbnail will be loaded here in Day 4 */}
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {hairstyle.name}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 p-3">
              <p className="text-sm font-medium">{hairstyle.name}</p>
              <Badge variant="secondary" className="text-xs">
                {hairstyle.suitabilityScore}% match
              </Badge>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
