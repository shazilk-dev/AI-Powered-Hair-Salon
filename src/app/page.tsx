/* eslint-disable @next/next/no-img-element */
/**
 * Landing Page - Professional AI Hair Salon
 * Clean, modern, sophisticated design
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Camera,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-slate-900 via-purple-950/20 to-slate-900" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-purple-800">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">StyleAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/analyze">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/5"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Face Analysis</span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={fadeInUp}
                className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                Discover Your Perfect
                <span className="block bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Hairstyle Match
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeInUp}
                className="mb-10 text-lg text-gray-400 sm:text-xl"
              >
                Professional AI analysis meets personalized recommendations.
                Find hairstyles that complement your unique facial features.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-4 sm:flex-row lg:justify-start justify-center"
              >
                <Link href="/analyze">
                  <Button
                    size="lg"
                    className="group relative h-12 overflow-hidden bg-linear-to-r from-purple-600 to-purple-700 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Free Analysis
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 z-0 bg-linear-to-r from-purple-600 to-purple-800 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-gray-700 bg-transparent px-8 text-base font-semibold text-gray-300 backdrop-blur-sm hover:border-gray-600 hover:bg-white/5 hover:text-white"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  See How It Works
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex flex-wrap items-center gap-8 text-sm text-gray-500 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span>Instant Results</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:block hidden"
            >
              {/* Placeholder for hero image */}
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 via-slate-900/20 to-purple-900/20">
                {/* Image will go here */}
                <img
                  src="/hero-salon.png"
                  alt="Professional hair styling consultation"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback: Show placeholder gradient
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          AI-Powered Analysis
                        </p>
                        <p className="text-xs text-gray-400">
                          6 Face Shapes Supported
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div variants={fadeInUp}>
              <Card className="group h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-gray-900/80">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                    <Camera className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    Smart Face Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Real-time face detection powered by MediaPipe ensures
                    accurate feature analysis for precise recommendations.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="group h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-gray-900/80">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    AI-Powered Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Google Gemini AI analyzes facial structure, proportions, and
                    features to determine your face shape.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="group h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-gray-900/80">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 transition-colors group-hover:bg-purple-500/20">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    Personalized Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Receive 5 curated hairstyle recommendations specifically
                    matched to complement your features.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="text-lg text-gray-400">
                Three simple steps to find your perfect hairstyle
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div variants={fadeInUp} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-400">
                  1
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Capture Photo
                </h3>
                <p className="text-gray-400">
                  Take a clear front-facing photo or upload an existing one from
                  your device.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-400">
                  2
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  AI Analysis
                </h3>
                <p className="text-gray-400">
                  Our AI analyzes your facial features and determines your
                  unique face shape.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-400">
                  3
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Get Recommendations
                </h3>
                <p className="text-gray-400">
                  Browse personalized hairstyle suggestions tailored to enhance
                  your features.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm md:p-12"
          >
            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-white">
                  {"< 5s"}
                </div>
                <div className="text-sm text-gray-400">
                  Average Analysis Time
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Privacy Protected</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-white">Free</div>
                <div className="text-sm text-gray-400">Forever</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Find Your Perfect Style?
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Join thousands who&apos;ve discovered their ideal hairstyle with
              AI
            </p>
            <Link href="/analyze">
              <Button
                size="lg"
                className="h-12 bg-linear-to-r from-purple-600 to-purple-700 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-purple-800">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">StyleAI</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 StyleAI. Your photos are never stored.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
