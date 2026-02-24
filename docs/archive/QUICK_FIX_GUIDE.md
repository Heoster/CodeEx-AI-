# Quick Fix Guide - AI Not Working in Production

## 🚨 Problem
"AI processing failed: fetch failed" error in production

## ✅ Solution (5 Minutes)

### Step 1: Check What's Missing
Visit: **https://codeex-ai.netlify.app/api/health**

Look for warnings like:
```json
{
  "warnings": [
    "No AI providers configured. Add at least one: GROQ_API_KEY..."
  ]
}
```

### Step 2: Get API Key (Choose ONE)

#### Option A: Groq (Recommended - Fastest)
1. Go to https://console.groq.com
2. Sign up (free)
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with `gsk_`)

#### Option B: Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy`)

#### Option C: Cerebras
1. Go to https://cloud.cerebras.ai
2. Sign up
3. Go to API Keys → Create new key
4. Copy the key (starts with `csk_`)

### Step 3: Add to Netlify

1. **Go to Netlify Dashboard**
   - https://app.netlify.com
   - Select your site: **codeex-ai**

2. **Add Environment Variable**
   - Click "Site settings"
   - Click "Environment variables"
   - Click "Add a variable"
   
   **For Groq:**
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_actual_key_here`
   
   **For Google:**
   - Key: `GOOGLE_API_KEY`
   - Value: `AIzaSy_your_actual_key_here`
   
   **For Cerebras:**
   - Key: `CEREBRAS_API_KEY`
   - Value: `csk_your_actual_key_here`

3. **Save and Redeploy**
   - Click "Save"
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait 2-3 minutes

### Step 4: Verify It Works

1. **Check Health Endpoint Again**
   - Visit: https://codeex-ai.netlify.app/api/health
   - Should show: `"configured": true`

2. **Test Chat**
   - Go to: https://codeex-ai.netlify.app/chat
   - Send a message: "Hello, are you working?"
   - Should get AI response ✅

## 🔧 What Was Fixed

### 1. Added 30-Second Timeout
All API requests now timeout after 30 seconds instead of hanging forever.

### 2. Better Error Messages
Before:
```
AI processing failed: fetch failed
```

After:
```
Unable to connect to AI service. This usually means API keys are not 
configured in production. Please check your deployment environment variables.
Details: Visit /api/health to check configuration status.
```

### 3. Health Check Endpoint
New endpoint `/api/health` shows:
- Which AI providers are configured
- Firebase configuration status
- Missing environment variables
- Warnings and issues

### 4. Smart Fallback
If one AI provider fails, automatically tries others:
- Groq → Google → Cerebras → Hugging Face

## 📋 Complete Environment Variables Checklist

### Required for AI (Add at least ONE)
- [ ] `GROQ_API_KEY` (Recommended)
- [ ] `GOOGLE_API_KEY` (Alternative)
- [ ] `CEREBRAS_API_KEY` (Alternative)
- [ ] `HUGGINGFACE_API_KEY` (Alternative)

### Required for Authentication
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Optional
- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_USER_ID`

## 🐛 Still Not Working?

### Check Build Logs
1. Go to Netlify → Deploys
2. Click on latest deploy
3. Look for errors in logs

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages

### Test API Directly
```bash
curl -X POST https://codeex-ai.netlify.app/api/chat-direct \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[],"settings":{"tone":"friendly","technicalLevel":"intermediate"}}'
```

Should return AI response, not error.

## 📚 More Information

- **Complete Guide:** `PRODUCTION_ENV_SETUP.md`
- **Technical Details:** `FETCH_FAILED_ERROR_FIXED.md`
- **Deployment Guide:** `docs/DEPLOYMENT.md`

## 💡 Pro Tips

1. **Add Multiple Providers** for redundancy:
   - If Groq is down, Google takes over
   - If Google is down, Cerebras takes over

2. **Monitor Usage:**
   - Groq: 14,400 requests/day (free)
   - Google: 1,500 requests/day (free)
   - Cerebras: Check their limits

3. **Set Up Alerts:**
   - Monitor `/api/health` endpoint
   - Get notified if providers go down

## 🎯 Expected Results

After following this guide:
- ✅ `/api/health` shows configured providers
- ✅ Chat works in production
- ✅ No more "fetch failed" errors
- ✅ Automatic fallback between providers
- ✅ Clear error messages if something goes wrong

---

**Last Updated:** February 22, 2026  
**Status:** ✅ Fixed and Tested  
**Build:** Successful (58 pages, 0 errors)
