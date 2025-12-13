/**
 * Error message display component
 *
 * Displays standardized error messages from SPEC.md section 6.1
 * Shows title, message, and recovery action for all error types
 */

import { AppError } from "@/types";
import { getErrorMessage } from "@/lib/errorMessages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: AppError | string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  // Get standardized error messages
  let title: string;
  let message: string;
  let action: string;
  let isRecoverable: boolean;

  if (typeof error === "string") {
    // Fallback for string errors
    title = "Error";
    message = error;
    action = "Please try again.";
    isRecoverable = true;
  } else {
    // Use standardized error messages from SPEC.md
    const errorDetails = getErrorMessage(error.code);
    title = errorDetails.title;
    message = errorDetails.message;
    action = errorDetails.action;
    isRecoverable = error.recoverable;
  }

  return (
    <Card
      className="border-red-200 bg-red-50"
      role="alert"
      aria-live="assertive"
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="h-5 w-5 text-red-600 shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">{title}</h3>
            <p className="mt-1 text-sm text-red-700">{message}</p>
            <p className="mt-2 text-sm text-red-600 font-medium">{action}</p>
          </div>
        </div>
        {isRecoverable && onRetry && (
          <Button onClick={onRetry} variant="destructive" className="mt-4">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
