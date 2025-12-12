# API Integration Testing Guide

## Gemini API Integration Tests

### Manual Testing Checklist

#### ✅ Rate Limiting (15 req/min)

```bash
# Test rate limit enforcement
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'

# Repeat 16 times rapidly - 16th should return 429
```

**Expected Results:**

- First 15 requests: 200 OK
- 16th request: 429 Too Many Requests
- Response includes `Retry-After` header
- Error message: "Rate limit exceeded. Please retry after X seconds"

#### ✅ Input Validation

**Test Case 1: Missing Image**

```bash
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected: 400 Bad Request, error code `INVALID_INPUT`

**Test Case 2: Invalid Base64**

```bash
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,!!!invalid!!!"}'
```

Expected: 400 Bad Request, message contains "Invalid base64"

**Test Case 3: Unsupported MIME Type**

```bash
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/gif;base64,R0lGODlh"}'
```

Expected: 400 Bad Request, message contains "Unsupported image type"

**Test Case 4: Image Too Large (>10MB)**

```bash
# Generate large base64 string
node -e "console.log('data:image/jpeg;base64,' + 'A'.repeat(11*1024*1024))" > large.txt
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"$(cat large.txt)\"}"
```

Expected: 400 Bad Request, message contains "too large"

**Test Case 5: Valid Request**

```bash
# Use real image (captured from camera or test image)
curl -X POST http://localhost:3000/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,[VALID_BASE64]"}'
```

Expected: 200 OK with classification response

#### ✅ Retry Logic

**Test Case 1: Network Timeout**

- Temporarily disable network
- Make request
- Expected: Retry 3 times with exponential backoff (1s, 2s, 4s)
- Final error: "Unable to analyze face after multiple attempts"

**Test Case 2: API Key Error**

- Remove `NEXT_PUBLIC_GEMINI_API_KEY` from `.env.local`
- Make request
- Expected: 503 Service Unavailable (no retries)
- Error: "Service temporarily unavailable"

#### ✅ Response Validation

**Test Case 1: Successful Response**

```json
{
  "success": true,
  "data": {
    "shape": "oval",
    "confidence": 87,
    "reasoning": "Face shows balanced proportions...",
    "measurements": {
      "faceWidth": 150,
      "faceHeight": 200,
      "ratio": 0.75,
      "jawWidth": 120,
      "cheekboneWidth": 150,
      "foreheadWidth": 145
    }
  }
}
```

**Test Case 2: Error Response**

```json
{
  "success": false,
  "error": {
    "code": "API_RATE_LIMITED",
    "message": "Rate limit exceeded. Please retry after 45 seconds.",
    "recoverable": true,
    "retryAfter": 45
  }
}
```

#### ✅ Error Code Mapping

| Scenario        | HTTP Status | Error Code       | Recoverable |
| --------------- | ----------- | ---------------- | ----------- |
| Missing image   | 400         | INVALID_INPUT    | true        |
| Invalid base64  | 400         | INVALID_INPUT    | true        |
| Rate limit hit  | 429         | API_RATE_LIMITED | true        |
| API key missing | 503         | API_ERROR        | true        |
| Network timeout | 503         | NETWORK_ERROR    | true        |
| Quota exceeded  | 429         | API_RATE_LIMITED | false       |
| Unknown error   | 500         | UNKNOWN_ERROR    | true        |

### Automated Test Commands

```bash
# Run all tests
npm test

# Run Gemini tests specifically
npm test gemini.test.ts

# Run with coverage
npm test:coverage

# Watch mode
npm test:watch
```

### Integration Test with Real API

Create `test-real-api.ts` for manual testing:

```typescript
import { analyzeFaceWithGemini } from "./src/lib/gemini";
import fs from "fs";

async function testRealAPI() {
  // Read test image
  const imageBuffer = fs.readFileSync("./test-image.jpg");
  const base64 = imageBuffer.toString("base64");
  const imageData = `data:image/jpeg;base64,${base64}`;

  console.log("Testing Gemini API...");

  try {
    const result = await analyzeFaceWithGemini(imageData);
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testRealAPI();
```

Run with:

```bash
npx ts-node test-real-api.ts
```

### Performance Testing

**Rate Limit Behavior:**

```bash
# Make 20 requests in 10 seconds
for i in {1..20}; do
  echo "Request $i at $(date +%s)"
  curl -X POST http://localhost:3000/api/analyze-face \
    -H "Content-Type: application/json" \
    -d '{"image":"data:image/jpeg;base64,..."}'
  sleep 0.5
done
```

Expected: First 15 succeed, rest fail with 429

**Retry Timing:**

- First attempt: immediate
- Second attempt: after 1s delay
- Third attempt: after 2s delay (total 3s)
- Fourth attempt: after 4s delay (total 7s, capped at 5s max)

### Monitoring

**Rate Limit Status Endpoint:**

```typescript
// Add to your dev tools
import { getRateLimitStatus } from "@/lib/gemini";

console.log(getRateLimitStatus());
// { current: 5, limit: 15, available: 10 }
```

### Common Issues

**Issue: Tests fail with "Rate limit exceeded"**

- Solution: Rate limiter persists across tests. Call `resetRateLimiter()` in `beforeEach()`

**Issue: Mock not working**

- Solution: Ensure `jest.mock('@/lib/gemini')` is at top of file before imports

**Issue: Next.js Request not defined**

- Solution: API route tests need Next.js environment. Use manual testing with `curl` or create mock request class

**Issue: Timeout errors in tests**

- Solution: Mock Gemini API calls return slowly. Increase test timeout:
  ```typescript
  it('should work', async () => { ... }, 10000); // 10s timeout
  ```

### Success Criteria

✅ All validation tests pass (400 errors for invalid input)
✅ Rate limiting enforces 15 req/min
✅ Retry logic attempts 3 times with backoff
✅ Error responses match SPEC.md format
✅ Successful requests return proper classification
✅ No TypeScript errors
✅ API responds within 5 seconds (Gemini + retries)

### Next Steps

1. Test with real Gemini API key
2. Integrate with frontend camera capture
3. Add user feedback for rate limit hits
4. Monitor API usage in production
