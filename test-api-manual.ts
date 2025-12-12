/**
 * Manual Test Script for Gemini API Integration
 *
 * Run with: npx ts-node test-api-manual.ts
 *
 * Requires:
 * - NEXT_PUBLIC_GEMINI_API_KEY in .env.local
 * - test-face.jpg in project root
 */

import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Import Gemini functions
import {
  analyzeFaceWithGemini,
  getRateLimitStatus,
  checkGeminiHealth,
} from "./src/lib/gemini";

const TEST_IMAGE_PATH = "./test-face.jpg";

async function main() {
  console.log("🧪 Gemini API Integration Tests\n");

  // Test 1: Health Check
  console.log("Test 1: API Health Check");
  try {
    const isHealthy = await checkGeminiHealth();
    console.log(isHealthy ? "✅ API is healthy" : "❌ API is not healthy");
  } catch (error) {
    console.error("❌ Health check failed:", (error as Error).message);
  }
  console.log("");

  // Test 2: Rate Limit Status
  console.log("Test 2: Rate Limit Status");
  const status = getRateLimitStatus();
  console.log(
    `✅ Current: ${status.current}/${status.limit} (${status.available} available)`
  );
  console.log("");

  // Test 3: Face Analysis
  console.log("Test 3: Face Analysis");

  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    console.log(
      "⚠️  No test image found. Create test-face.jpg with a face photo."
    );
    console.log("   Skipping face analysis test.");
    return;
  }

  try {
    // Read and encode image
    const imageBuffer = fs.readFileSync(TEST_IMAGE_PATH);
    const base64 = imageBuffer.toString("base64");
    const imageData = `data:image/jpeg;base64,${base64}`;

    console.log(`📷 Image size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    console.log("🔄 Analyzing face...");

    const startTime = Date.now();
    const result = await analyzeFaceWithGemini(imageData);
    const duration = Date.now() - startTime;

    console.log(`✅ Analysis complete in ${duration}ms`);
    console.log(`   Shape: ${result.shape}`);
    console.log(`   Confidence: ${result.confidence}%`);
    console.log(`   Reasoning: ${result.reasoning}`);
    console.log(
      `   Measurements: ${JSON.stringify(result.measurements, null, 2)}`
    );
  } catch (error) {
    console.error("❌ Face analysis failed:", (error as Error).message);
  }
  console.log("");

  // Test 4: Rate Limit After Request
  console.log("Test 4: Rate Limit After Request");
  const newStatus = getRateLimitStatus();
  console.log(
    `✅ Current: ${newStatus.current}/${newStatus.limit} (${newStatus.available} available)`
  );
  console.log("");

  // Test 5: Multiple Requests (Rate Limit Test)
  console.log("Test 5: Rate Limit Enforcement (15 req/min)");
  console.log(
    "⚠️  This test makes 16 requests. Run only if you want to test rate limiting."
  );
  console.log("   Uncomment the code below to run.");

  /*
  try {
    const testImage = 'data:image/jpeg;base64,' + 'A'.repeat(1000);
    
    for (let i = 1; i <= 16; i++) {
      console.log(`Request ${i}...`);
      try {
        await analyzeFaceWithGemini(testImage);
        console.log(`  ✅ Success`);
      } catch (error) {
        console.error(`  ❌ Failed: ${(error as Error).message}`);
        break;
      }
    }
  } catch (error) {
    console.error('Rate limit test failed:', error);
  }
  */

  console.log("\n✅ All tests complete!");
}

main().catch(console.error);
