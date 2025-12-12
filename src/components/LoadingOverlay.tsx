/**
 * Loading overlay component
 */

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
