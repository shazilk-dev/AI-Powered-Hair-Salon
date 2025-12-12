/**
 * Landing Page
 * Entry point for StyleAI application
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Sparkles, Scissors } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="w-full max-w-4xl space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
            StyleAI
          </h1>
          <p className="text-xl text-gray-700 md:text-2xl">
            AI-Powered Hair Salon Recommendations
          </p>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover your perfect hairstyle with computer vision and AI.
            We analyze your face shape and recommend personalized styles that suit you best.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Capture Your Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Use your camera or upload a photo to get started
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI analyzes your face shape using advanced computer vision
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                <Scissors className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Personalized Styles</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get 5 hairstyle recommendations tailored to your face shape
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link href="/analyze">
            <Button size="lg" className="text-lg">
              Start Analysis
            </Button>
          </Link>
        </div>

        <Separator className="my-8" />

        {/* Footer Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">
            Fast • Private • Free
          </p>
          <p>
            Your photos are processed locally and never stored
          </p>
        </div>
      </main>
    </div>
  );
}
