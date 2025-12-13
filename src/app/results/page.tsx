/**
 * Results Page
 *
 * Displays face shape analysis results and hairstyle recommendations.
 *
 * Features:
 * - Face shape badge with confidence
 * - Hairstyle gallery with selection
 * - Canvas-based preview overlay
 * - Before/After comparison slider
 * - Download PNG export
 * - Try another photo option
 *
 * @see ARCHITECTURE.md section 3.1 - User Flow
 * @see ARCHITECTURE.md section 4.1 - State Structure
 * @see SPEC.md - Data Types
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { FaceClassification, Hairstyle, FaceLandmark } from "@/types";
import { HairstyleGallery } from "@/components/HairstyleGallery";
import { FaceShapeBadge } from "@/components/FaceShapeBadge";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

/**
 * Application state following ARCHITECTURE.md 4.1
 */
interface ResultsState {
  // Captured image data
  capturedImage: string | null;

  // Detection results
  landmarks: FaceLandmark[] | null;

  // Classification results
  classification: FaceClassification | null;

  // Recommendations
  recommendations: Hairstyle[];
  selectedHairstyle: Hairstyle | null;

  // UI state
  isLoading: boolean;
  error: string | null;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<ResultsState>({
    capturedImage: null,
    landmarks: null,
    classification: null,
    recommendations: [],
    selectedHairstyle: null,
    isLoading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<"preview" | "compare">("preview");

  /**
   * Load data from URL params or redirect if missing
   */
  useEffect(() => {
    const shape = searchParams.get("shape");
    const confidence = searchParams.get("confidence");
    const reasoning = searchParams.get("reasoning");
    const image = searchParams.get("image");

    // Validate required parameters
    if (!shape || !confidence || !image) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Missing analysis data. Please capture a photo first.",
      }));
      return;
    }

    // Set classification from URL params
    const classification: FaceClassification = {
      shape: shape as FaceClassification["shape"],
      confidence: parseInt(confidence, 10),
      reasoning: reasoning || "No reasoning provided",
      measurements: {
        faceWidth: 0,
        faceHeight: 0,
        jawWidth: 0,
        foreheadWidth: 0,
        cheekboneWidth: 0,
        ratio: 0,
      },
    };

    setState((prev) => ({
      ...prev,
      capturedImage: decodeURIComponent(image),
      classification,
    }));

    // Fetch recommendations
    fetchRecommendations(shape);
  }, [searchParams]);

  /**
   * Fetch hairstyle recommendations from API
   */
  const fetchRecommendations = async (shape: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/recommend?shape=${shape}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error?.message || "Failed to fetch recommendations"
        );
      }

      setState((prev) => ({
        ...prev,
        recommendations: data.data.recommendations,
        selectedHairstyle: data.data.recommendations[0] || null,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          err instanceof Error ? err.message : "Failed to load recommendations",
      }));
    }
  };

  /**
   * Handle hairstyle selection
   */
  const handleSelectHairstyle = (hairstyle: Hairstyle) => {
    setState((prev) => ({ ...prev, selectedHairstyle: hairstyle }));
  };

  /**
   * Handle try another photo
   */
  const handleTryAnother = () => {
    router.push("/analyze");
  };

  // Error state
  if (state.error) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <ErrorMessage error={state.error} onRetry={handleTryAnother} />
      </div>
    );
  }

  // Missing data state
  if (!state.classification || !state.capturedImage) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Analysis Data</CardTitle>
            <CardDescription>
              Please capture a photo first to see your results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTryAnother} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-12">
      <div className="container mx-auto max-w-7xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleTryAnother} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try Another Photo
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Your Perfect Hairstyles
              </h1>
              <p className="mt-2 text-muted-foreground">
                Based on your face shape analysis
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Analysis Complete
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Results & Gallery */}
          <div className="space-y-6 lg:col-span-2">
            {/* Face Shape Result */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Face Shape
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FaceShapeBadge
                  shape={state.classification.shape}
                  confidence={state.classification.confidence}
                />

                <Separator />

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    AI Analysis
                  </p>
                  <p className="text-sm leading-relaxed">
                    {state.classification.reasoning}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hairstyle Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Recommended Hairstyles ({state.recommendations.length})
                </CardTitle>
                <CardDescription>
                  Click on any style to see how it looks on you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HairstyleGallery
                  hairstyles={state.recommendations}
                  selectedId={state.selectedHairstyle?.id}
                  onSelect={handleSelectHairstyle}
                />
              </CardContent>
            </Card>

            {/* Selected Hairstyle Details */}
            {state.selectedHairstyle && (
              <Card>
                <CardHeader>
                  <CardTitle>{state.selectedHairstyle.name}</CardTitle>
                  <CardDescription>
                    {state.selectedHairstyle.suitabilityScore}% match for your
                    face shape
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    {state.selectedHairstyle.description}
                  </p>

                  <Separator />

                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Why This Style Works
                    </p>
                    <p className="text-sm leading-relaxed">
                      {state.selectedHairstyle.reasoning}
                    </p>
                  </div>

                  {state.selectedHairstyle.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                          Style Tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {state.selectedHairstyle.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview</CardTitle>
                  <CardDescription>
                    See how the style looks on you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as typeof activeTab)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="preview"
                        aria-label="Preview hairstyle overlay on your photo"
                      >
                        Overlay
                      </TabsTrigger>
                      <TabsTrigger
                        value="compare"
                        aria-label="Compare before and after photos"
                      >
                        Compare
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="mt-4">
                      {state.selectedHairstyle ? (
                        <div className="space-y-4">
                          {/* Coming Soon Notice */}
                          <div className="aspect-square flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 p-6 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Interactive Preview Coming Soon
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Full overlay preview with your photo will be
                              available in Day 5
                            </p>
                            {/* Show selected style info */}
                            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 w-full max-w-xs">
                              <div className="relative w-full h-32 mb-3">
                                <Image
                                  src={state.selectedHairstyle.imagePath}
                                  alt={state.selectedHairstyle.name}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="(max-width: 320px) 100vw, 320px"
                                />
                              </div>
                              <p className="font-medium text-gray-900 text-sm">
                                {state.selectedHairstyle.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {state.selectedHairstyle.category}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center rounded-lg bg-muted">
                          <p className="text-sm text-muted-foreground">
                            Select a hairstyle to preview
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="compare" className="mt-4">
                      <div className="aspect-square flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 p-6 text-center">
                        <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Before/After Comparison Coming Soon
                        </h3>
                        <p className="text-sm text-gray-600">
                          Interactive slider to compare your photo with the
                          hairstyle will be available in Day 5
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Pro Tip</p>
                      <p className="text-muted-foreground">
                        Show this preview to your hairstylist for the best
                        results!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div
            className="text-center space-y-4"
            role="status"
            aria-live="polite"
          >
            <Sparkles
              className="h-12 w-12 text-primary animate-pulse mx-auto"
              aria-hidden="true"
            />
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
