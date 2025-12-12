/**
 * Face shape badge display component
 */

import { FaceShape } from "@/types";
import { Badge } from "@/components/ui/badge";

interface FaceShapeBadgeProps {
  shape: FaceShape;
  confidence: number;
}

export function FaceShapeBadge({ shape, confidence }: FaceShapeBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant="default" className="px-4 py-2 text-base">
        <span className="capitalize">{shape}</span>
      </Badge>
      <span className="text-sm text-muted-foreground">
        {confidence}% confidence
      </span>
    </div>
  );
}
