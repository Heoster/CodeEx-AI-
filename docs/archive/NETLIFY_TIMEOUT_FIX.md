# Netlify Timeout Fix - AI Response Generation

## Problem
AI was not generating responses in production with `ERR_INVALID_RESPONSE` error.

## Root Cause
Netlify serverless functions have a **10-second timeout limit**. The smart fallback system was exceeding this:
- Each AI adapter had 8s timeout
- Each model had 2 retries (maxRetries = 2)
- System tried all 4 providers sequentially
- Total time: 4 models × 8s = 32 seconds (exceeds 10s limit)

## Solution Applied

### 1. Reduced Adapter Timeouts (8s → 4s)
Updated all AI adapters to use 4-second timeout:
- `src/ai/adapters/groq-adapter.ts`
- `src/ai/adapters/google-adapter.ts`
- `src/ai/adapters/cerebras-adapter.ts`
- `src/ai/adapters/huggingface-adapter.ts`

### 2. Disabled Retries (2 → 0)
Changed `maxRetries` from 2 to 0 in `src/ai/smart-fallback.ts`:
```typescript
async function tryGenerateWithModel(
  model: ModelConfig,
  request: Omit<GenerateRequest, 'model'>,
  maxRetries: number = 0  // Changed from 2
)
```

### 3. Limited Fallback Models (4 → 2)
Restricted smart fallback to try maximum 2 models:
```typescript
// Limit to 2 models maximum for Netlify timeout constraints
const maxModelsToTry = Math.min(modelsToTry.length, 2);
```

### 4. Added Total Function Timeout (9s)
Added 9-second total timeout check with 1s buffer:
```typescript
const startTime = Date.now();
const MAX_TOTAL_TIME = 9000; // 9 seconds total for Netlify (leave 1s buffer)

// Check if we're approaching timeout
const elapsed = Date.now() - startTime;
if (elapsed > MAX_TOTAL_TIME) {
  throw new Error('Request timeout - exceeded maximum processing time');
}
```

## Expected Behavior
- First model attempt: 4s max
- Second model attempt (if first fails): 4s max
- Total time: ~8s maximum (within Netlify's 10s limit)
- Early exit if approaching 9s total

## Files Modified
1. `src/ai/adapters/groq-adapter.ts` - Timeout 8s → 4s
2. `src/ai/adapters/google-adapter.ts` - Timeout 8s → 4s
3. `src/ai/adapters/cerebras-adapter.ts` - Timeout 8s → 4s
4. `src/ai/adapters/huggingface-adapter.ts` - Timeout 8s → 4s
5. `src/ai/smart-fallback.ts` - Retries 2 → 0, Max models 4 → 2, Added 9s total timeout

## Testing
Deploy to Netlify and test AI response generation. Should now complete within 10s limit.

## Status
✅ All changes applied
✅ No TypeScript errors
✅ Ready for deployment
