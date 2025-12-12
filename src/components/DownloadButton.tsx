/**
 * Download button component
 * Exports styled image as PNG
 */

"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  filename?: string;
}

export function DownloadButton({
  canvasRef,
  filename = "styled-hair.png",
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      className="w-full md:w-auto"
    >
      <Download className="mr-2 h-5 w-5" />
      Download Image
    </Button>
  );
}
