/**
 * Error message display component
 */

import { AppError } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: AppError | string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const errorMessage = typeof error === "string" ? error : error.message;
  const isRecoverable = typeof error === "object" && error.recoverable;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
        {isRecoverable && onRetry && (
          <Button
            onClick={onRetry}
            variant="destructive"
            className="mt-4"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
