# Fetch Failed Error - Fixed

## Problem
Users experiencing "AI processing failed: fetch failed" error in production (Netlify/Vercel).

## Root Cause
The "fetch failed" error occurs when:
1. **Environment variables (API keys) are not configured in production** (most common)
2. Network timeout - requests taking too long without timeout handling
3. DNS resolution issues
4. Network connectivity problems

## Solution Implemented

### 1. Added Fetch Timeout (30 seconds)
All AI adapters now have 30-second timeout to prevent hanging requests:

**Files Updated:**
- `src/ai/adapters/groq-adapter.ts`
- `src/ai/adapters/google-adapter.ts`
- `src/ai/adapters/cerebras-adapter.ts`

**Implementation:**
```typescript
// Create AbortController for timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

const response = await fetch(API_URL, {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify(requestBody),
  signal: controller.signal, // Add abort signal
});

clearTimeout(timeoutId);
```

### 2. Enhanced Error Handling

**Groq Adapter** (`src/ai/adapters/groq-adapter.ts`):
- Detects `AbortError` (timeout) and provides clear message
- Detects `fetch failed` and suggests checking API key configuration
- Better error messages for debugging

**Google Adapter** (`src/ai/adapters/google-adapter.ts`):
- Same timeout and error handling improvements

**Cerebras Adapter** (`src/ai/adapters/cerebras-adapter.ts`):
- Same timeout and error handling improvements

### 3. Smart Fallback Improvements

**File:** `src/ai/smart-fallback.ts`

Added "fetch failed" and "Network error" to critical failure patterns:
```typescript
const criticalPatterns = [
  'Model is currently loading',
  'Service Unavailable',
  '503', '502', '504',
  'timeout',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'fetch failed',      // NEW
  'Network error',     // NEW
  'Model.*is currently loading',
  'estimated_time',
];
```

Updated friendly error messages:
```typescript
if (errorMessage.includes('timeout') || errorMessage.includes('network') || errorMessage.includes('fetch failed')) {
  return 'Network error. Please check your internet connection and API key configuration.';
}
```

### 4. Better API Error Messages

**File:** `src/app/api/chat-direct/route.ts`

Added specific error handling for "fetch failed":
```typescript
if (errorMessage.includes('fetch failed')) {
  return NextResponse.json(
    { 
      error: 'Unable to connect to AI service. This usually means API keys are not configured in production. Please check your deployment environment variables.',
      details: 'Visit /api/health to check configuration status.',
    },
    { status: 500 }
  );
}
```

### 5. Health Check Endpoint

**New File:** `src/app/api/health/route.ts`

Created diagnostic endpoint to check configuration status:

**Usage:**
```bash
# Check if environment variables are configured
curl https://codeex-ai.netlify.app/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-22T...",
  "environment": "production",
  "ai": {
    "configured": true,
    "providers": ["Groq", "Google"],
    "count": 2
  },
  "firebase": {
    "configured": true
  },
  "optional": {
    "emailjs": true,
    "resend": false,
    "elevenlabs": false
  },
  "warnings": []
}
```

If API keys are missing:
```json
{
  "status": "ok",
  "ai": {
    "configured": false,
    "providers": [],
    "count": 0
  },
  "warnings": [
    "No AI providers configured. Add at least one: GROQ_API_KEY, GOOGLE_API_KEY, CEREBRAS_API_KEY, or HUGGINGFACE_API_KEY"
  ]
}
```

## How to Fix in Production

### Step 1: Check Configuration Status
Visit: `https://codeex-ai.netlify.app/api/health`

If you see warnings about missing API keys, proceed to Step 2.

### Step 2: Add Environment Variables to Netlify

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Select your site (codeex-ai)

2. **Add Environment Variables**
   - Go to: Site settings → Environment variables
   - Click "Add a variable"
   - Add at least ONE of these:

   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   # OR
   GOOGLE_API_KEY=AIzaSy_your_actual_key_here
   # OR
   CEREBRAS_API_KEY=csk_your_actual_key_here
   ```

3. **Add Firebase Variables** (required for auth)
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Redeploy**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait 2-3 minutes

5. **Verify**
   - Visit `/api/health` again
   - Should show `"configured": true`
   - Test chat functionality

## Error Messages Guide

### Before Fix
```
AI processing failed: fetch failed
```
- Unclear what the problem is
- No guidance on how to fix

### After Fix
```
Unable to connect to AI service. This usually means API keys are not configured in production. Please check your deployment environment variables.
Details: Visit /api/health to check configuration status.
```
- Clear explanation of the problem
- Actionable steps to fix
- Link to diagnostic endpoint

## Testing

### Local Testing
```bash
# Should work if .env.local is configured
npm run dev
# Visit http://localhost:3000
# Try sending a chat message
```

### Production Testing
```bash
# 1. Check health endpoint
curl https://codeex-ai.netlify.app/api/health

# 2. Test chat API
curl -X POST https://codeex-ai.netlify.app/api/chat-direct \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[],"settings":{"tone":"friendly","technicalLevel":"intermediate"}}'

# Should return AI response, not "fetch failed"
```

## Files Changed

1. `src/ai/adapters/groq-adapter.ts` - Added timeout + fetch failed handling
2. `src/ai/adapters/google-adapter.ts` - Added timeout + fetch failed handling
3. `src/ai/adapters/cerebras-adapter.ts` - Added timeout + fetch failed handling
4. `src/ai/smart-fallback.ts` - Added fetch failed to critical patterns
5. `src/app/api/chat-direct/route.ts` - Better error messages
6. `src/app/api/health/route.ts` - NEW: Diagnostic endpoint

## Benefits

1. **30-second timeout** prevents hanging requests
2. **Clear error messages** guide users to fix the issue
3. **Health check endpoint** helps diagnose configuration problems
4. **Better fallback** automatically tries other providers
5. **Production-ready** handles network issues gracefully

## Next Steps for User

1. Visit `/api/health` to check configuration
2. Add missing environment variables to Netlify dashboard
3. Redeploy the site
4. Test chat functionality
5. If still having issues, check build logs for specific errors

## Documentation References

- Complete setup guide: `PRODUCTION_ENV_SETUP.md`
- How to get API keys: See "How to Get API Keys" section in `PRODUCTION_ENV_SETUP.md`
- Troubleshooting: See "Troubleshooting" section in `PRODUCTION_ENV_SETUP.md`

---

**Status:** ✅ Fixed  
**Date:** February 22, 2026  
**Priority:** High - Production Issue  
**Impact:** All AI functionality in production
