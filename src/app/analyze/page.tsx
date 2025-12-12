/**
 * Analysis page
 * Main workflow for capturing photo and analyzing face shape
 */

"use client";

import { useState } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FaceShapeBadge } from "@/components/FaceShapeBadge";
import { FaceClassification } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";

export default function AnalyzePage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FaceClassification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsAnalyzing(true);
    setError(null);

    try {
      // Call analyze API
      const response = await fetch("/api/analyze-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError("Failed to analyze face. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Analyze Your Face Shape</h1>
        <p className="mt-2 text-muted-foreground">
          Capture a photo to get personalized hairstyle recommendations
        </p>
      </div>

      {!capturedImage && <CameraCapture onCapture={handleCapture} />}

      {isAnalyzing && (
        <Card>
          <CardContent className="p-8">
            <LoadingOverlay message="Analyzing your face shape..." />
          </CardContent>
        </Card>
      )}

      {error && <ErrorMessage error={error} onRetry={handleReset} />}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Result</CardTitle>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Another Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Your Face Shape
                </p>
                <FaceShapeBadge shape={result.shape} confidence={result.confidence} />
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Why This Shape?
                </p>
                <p className="text-sm">{result.reasoning}</p>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Measurements
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">Ratio:</span>{" "}
                    <span className="font-medium">{result.measurements.ratio.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Width:</span>{" "}
                    <span className="font-medium">{result.measurements.faceWidth.toFixed(0)}px</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Height:</span>{" "}
                    <span className="font-medium">{result.measurements.faceHeight.toFixed(0)}px</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {capturedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Your Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full rounded-lg shadow-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
