# Local Testing Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

### Required API Keys

#### 1. Groq API Key (REQUIRED - Primary AI Provider)
- Visit: https://console.groq.com/keys
- Sign up for free account
- Create new API key
- Copy to `.env.local` as `GROQ_API_KEY`
- Free tier: 14,400 requests/day

#### 2. Google AI API Key (OPTIONAL - Fallback Provider)
- Visit: https://aistudio.google.com/app/apikey
- Sign in with Google account
- Create API key
- Copy to `.env.local` as `GOOGLE_API_KEY`
- Free tier: 60 requests/minute

#### 3. Cerebras API Key (OPTIONAL - Fast Inference)
- Visit: https://cloud.cerebras.ai/
- Sign up for account
- Get API key from dashboard
- Copy to `.env.local` as `CEREBRAS_API_KEY`

#### 4. Hugging Face API Key (OPTIONAL - Open Source Models)
- Visit: https://huggingface.co/settings/tokens
- Create new token with "Read" access
- Copy to `.env.local` as `HUGGINGFACE_API_KEY`
- Free tier available

#### 5. Firebase Configuration (REQUIRED - Authentication & Database)
- Visit: https://console.firebase.google.com/
- Create new project or use existing
- Go to Project Settings > General
- Scroll to "Your apps" section
- Click "Web" icon to add web app
- Copy all configuration values to `.env.local`:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Optional Services

#### EmailJS (Contact Form & Welcome Emails)
- Visit: https://www.emailjs.com/
- Sign up for free account
- Create email service
- Create email templates
- Copy credentials to `.env.local`:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_USER_ID`

#### Python TTS Server (Optional - Enhanced Text-to-Speech)
- Set `USE_PYTHON_TTS=false` for local testing (uses browser TTS)
- Or follow `python/README.md` to set up Python TTS server

## Step 3: Update .env.local File

Copy the template and fill in your actual values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual API keys (see Step 2 above).

## Step 4: Verify Configuration

Check if all required environment variables are set:

```bash
npm run dev
```

Then visit: http://localhost:3000/api/health

This endpoint will show:
- ✅ Which AI providers are configured
- ✅ Firebase configuration status
- ✅ System information
- ⚠️ Any missing or invalid API keys

## Step 5: Test AI Chat

1. Start the development server:
```bash
npm run dev
```

2. Open browser: http://localhost:3000

3. Test AI chat:
   - Type a message: "Hello, test message"
   - Should get response within 4-8 seconds
   - Check browser console for any errors

4. Test model switching:
   - Click model selector dropdown
   - Try different models (Groq, Google, Cerebras, HuggingFace)
   - Verify each model works

## Step 6: Test Authentication

1. Click "Sign In" button
2. Try Google Sign-In
3. Try Email/Password registration
4. Verify user profile loads
5. Test sign out

## Step 7: Test Other Features

### Text-to-Speech
- Send a message
- Click speaker icon on AI response
- Should hear voice (browser TTS)

### Export Features
- Test "Copy" button
- Test "Download as Text"
- Test "Download as PDF"
- Test "Share" functionality

### User Management (Admin)
- Visit: http://localhost:3000/user-management
- Requires admin authentication
- Test user list, search, filters

## Step 8: Check for Errors

Open browser DevTools (F12) and check:
- Console tab: No red errors
- Network tab: All API calls return 200/201
- Application tab: Firebase auth working

## Step 9: Build Test

Test production build locally:

```bash
npm run build
npm start
```

Visit: http://localhost:3000

Verify everything works in production mode.

## Common Issues & Solutions

### Issue: "GROQ_API_KEY not configured"
**Solution**: Add valid Groq API key to `.env.local`

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check Firebase configuration in `.env.local`

### Issue: "AI processing failed: fetch failed"
**Solution**: 
- Check internet connection
- Verify API keys are valid
- Check API provider status pages

### Issue: "Request timeout"
**Solution**: 
- Normal for first request (cold start)
- Retry after 30 seconds
- Check if API provider is down

### Issue: TTS not working
**Solution**: 
- Browser TTS should work automatically
- Check browser permissions for audio
- Try different browser (Chrome recommended)

## Environment Variables Checklist

### Required (Minimum to run app)
- [ ] `GROQ_API_KEY` - At least one AI provider
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_APP_URL` (set to http://localhost:3000)

### Optional (Enhanced features)
- [ ] `GOOGLE_API_KEY` - Google AI fallback
- [ ] `CEREBRAS_API_KEY` - Fast inference
- [ ] `HUGGINGFACE_API_KEY` - Open source models
- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - Contact form
- [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - Email templates
- [ ] `NEXT_PUBLIC_EMAILJS_USER_ID` - EmailJS user
- [ ] `USE_PYTHON_TTS` - Python TTS server (set to false)

## Ready for Production?

After local testing passes:

1. ✅ All features work locally
2. ✅ No console errors
3. ✅ Build completes successfully
4. ✅ Production mode works (`npm start`)
5. ✅ All API keys are valid
6. ✅ Firebase rules are configured

Then proceed to deploy to Netlify/Vercel.

## Next Steps

1. Test locally with this guide
2. Fix any issues found
3. Add environment variables to Netlify dashboard
4. Deploy to production
5. Test production deployment
6. Monitor for errors

## Support

If you encounter issues:
1. Check `/api/health` endpoint
2. Check browser console for errors
3. Check Netlify function logs
4. Verify all API keys are valid
5. Check API provider status pages
