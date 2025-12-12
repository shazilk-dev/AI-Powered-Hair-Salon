/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Test script for /api/recommend endpoint
 *
 * Tests all 6 face shapes to ensure database works correctly
 */

const API_BASE = "http://localhost:3000";

async function testRecommendAPI(faceShape: string) {
  console.log(`\n🔍 Testing ${faceShape.toUpperCase()} face shape...`);

  try {
    const response = await fetch(
      `${API_BASE}/api/recommend?shape=${faceShape}`
    );
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Error: ${data.error?.message || "Unknown error"}`);
      return;
    }

    if (!data.success) {
      console.error(`❌ Request failed: ${data.error?.message}`);
      return;
    }

    console.log(
      `✅ Success! Received ${data.data.recommendations.length} recommendations`
    );

    // Display recommendations
    data.data.recommendations.forEach((rec: any, idx: number) => {
      console.log(
        `   ${idx + 1}. ${rec.name} (Score: ${rec.suitabilityScore})`
      );
      console.log(`      ${rec.description}`);
    });
  } catch (error) {
    console.error(`❌ Network error:`, error);
  }
}

async function runAllTests() {
  console.log("🧪 Testing Recommendation API");
  console.log("=".repeat(60));

  const shapes = ["oval", "round", "square", "heart", "oblong", "diamond"];

  for (const shape of shapes) {
    await testRecommendAPI(shape);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay between requests
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ All tests complete!");
}

// Run tests
runAllTests().catch(console.error);
