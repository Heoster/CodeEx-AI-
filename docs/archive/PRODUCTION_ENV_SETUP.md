# Production Environment Variables Setup

## 🚨 URGENT: AI Not Working in Production

The AI is not working because the API keys are not configured in Netlify/Vercel. You need to add environment variables to your deployment platform.

## 📋 Required Environment Variables

### Minimum Required (AI will work)

At least ONE of these AI provider keys is required:

```env
# Groq (Recommended - Fast & Free)
GROQ_API_KEY=gsk_your_groq_api_key_here

# OR Google Gemini (Free tier available)
GOOGLE_API_KEY=AIzaSy_your_google_api_key_here

# OR Cerebras (Fast inference)
CEREBRAS_API_KEY=csk_your_cerebras_api_key_here

# OR Hugging Face
HUGGINGFACE_API_KEY=hf_your_huggingface_api_key_here
```

### Firebase (Required for Authentication)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Optional (For Additional Features)

```env
# EmailJS (for contact forms)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID=your_welcome_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id

# Site URL
NEXT_PUBLIC_SITE_URL=https://codeex-ai.netlify.app
```

## 🔧 How to Add Environment Variables

### Netlify

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Select your site (codeex-ai)

2. **Navigate to Environment Variables**
   - Click "Site settings"
   - Click "Environment variables" in the left sidebar
   - Or go directly to: Site settings → Build & deploy → Environment

3. **Add Variables**
   - Click "Add a variable" or "Add environment variable"
   - For each variable:
     - Key: `GROQ_API_KEY` (for example)
     - Value: `gsk_your_actual_key_here`
     - Scopes: Select "All" or "Production"
   - Click "Create variable"

4. **Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Or push a new commit to trigger automatic deployment

### Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (codeex-ai)

2. **Navigate to Environment Variables**
   - Click "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Add Variables**
   - For each variable:
     - Name: `GROQ_API_KEY` (for example)
     - Value: `gsk_your_actual_key_here`
     - Environment: Select "Production" (and optionally "Preview" and "Development")
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger automatic deployment

## 🔑 How to Get API Keys

### Groq (Recommended - Fast & Free)

1. Visit https://console.groq.com
2. Sign up for free account
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)
6. Add to Netlify/Vercel as `GROQ_API_KEY`

**Models Available:**
- Llama 3.1 8B (Fast)
- Llama 3.1 70B (Powerful)
- Llama 3.3 70B (Latest)
- Mixtral 8x7B
- Gemma 2 9B

### Google Gemini (Free Tier)

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy`)
5. Add to Netlify/Vercel as `GOOGLE_API_KEY`

**Models Available:**
- Gemini 2.0 Flash
- Gemini 1.5 Pro
- Gemini 1.5 Flash

### Cerebras (Fast Inference)

1. Visit https://cloud.cerebras.ai
2. Sign up for account
3. Go to API Keys section
4. Create new API key
5. Copy the key (starts with `csk_`)
6. Add to Netlify/Vercel as `CEREBRAS_API_KEY`

**Models Available:**
- Llama 3.3 70B
- Llama 3.1 8B
- Llama 3.1 70B

### Hugging Face

1. Visit https://huggingface.co/settings/tokens
2. Sign up/login
3. Click "New token"
4. Give it a name and select "Read" access
5. Copy the token (starts with `hf_`)
6. Add to Netlify/Vercel as `HUGGINGFACE_API_KEY`

## ✅ Verification Steps

### 1. Check Environment Variables

After adding variables in Netlify/Vercel:

```bash
# In Netlify, go to:
Site settings → Environment variables

# Verify you see:
✓ GROQ_API_KEY (or another AI provider)
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

### 2. Trigger Redeploy

**Netlify:**
```
Deploys → Trigger deploy → Deploy site
```

**Vercel:**
```
Deployments → ... → Redeploy
```

### 3. Test the Deployment

1. Wait for deployment to complete (2-5 minutes)
2. Visit your site: https://codeex-ai.netlify.app
3. Go to chat page
4. Send a test message: "Hello, are you working?"
5. You should get a response from the AI

### 4. Check for Errors

If still not working:

1. **Check Build Logs**
   - Netlify: Deploys → Click on latest deploy → View logs
   - Vercel: Deployments → Click on latest → View logs
   - Look for errors related to environment variables

2. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors
   - Common issues:
     - "API key is missing" → Add the API key
     - "All models failed" → Check API key is valid
     - "Firebase error" → Check Firebase config

3. **Test API Endpoint**
   ```bash
   # Test if API is working
   curl -X POST https://codeex-ai.netlify.app/api/chat-direct \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello","history":[],"settings":{"tone":"friendly","technicalLevel":"intermediate"}}'
   ```

## 🐛 Troubleshooting

### Error: "Groq API key is missing"

**Solution:**
1. Get Groq API key from https://console.groq.com
2. Add to Netlify/Vercel as `GROQ_API_KEY`
3. Redeploy

### Error: "All AI models are currently unavailable"

**Solution:**
1. Check that at least ONE AI provider key is set
2. Verify the key is valid (not expired)
3. Check API provider status page
4. Try adding a different provider as backup

### Error: "Firebase error"

**Solution:**
1. Check all Firebase environment variables are set
2. Verify they start with `NEXT_PUBLIC_`
3. Make sure values don't have quotes or extra spaces
4. Redeploy after fixing

### AI works locally but not in production

**Solution:**
1. Environment variables in `.env.local` are NOT deployed
2. You MUST add them manually in Netlify/Vercel dashboard
3. After adding, trigger a new deployment

## 📝 Complete Environment Variables Checklist

Copy this checklist and add to Netlify/Vercel:

### Required for AI to Work

- [ ] `GROQ_API_KEY` (or `GOOGLE_API_KEY` or `CEREBRAS_API_KEY`)

### Required for Authentication

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Optional but Recommended

- [ ] `NEXT_PUBLIC_SITE_URL` (set to your production URL)
- [ ] `GOOGLE_API_KEY` (backup AI provider)
- [ ] `CEREBRAS_API_KEY` (backup AI provider)
- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_USER_ID`

## 🚀 Quick Fix (5 Minutes)

1. **Get Groq API Key** (fastest option)
   - Go to https://console.groq.com
   - Sign up (free)
   - Create API key
   - Copy it

2. **Add to Netlify**
   - Go to https://app.netlify.com
   - Select your site
   - Site settings → Environment variables
   - Add variable:
     - Key: `GROQ_API_KEY`
     - Value: `gsk_your_key_here`
   - Save

3. **Redeploy**
   - Deploys → Trigger deploy
   - Wait 2-3 minutes

4. **Test**
   - Visit your site
   - Try sending a chat message
   - Should work now! ✅

## 📞 Support

If you're still having issues:

1. Check the build logs for specific errors
2. Verify all environment variables are set correctly
3. Make sure you redeployed after adding variables
4. Test with a simple message first
5. Check browser console for client-side errors

**Contact:**
- Email: codeex@email.com
- GitHub: @Heoster

---

**Last Updated**: February 22, 2026  
**Status**: Production Environment Setup Guide  
**Priority**: 🚨 URGENT - Required for AI to work
