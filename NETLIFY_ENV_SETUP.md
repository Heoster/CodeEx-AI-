# Netlify Environment Variables Setup Guide

## Current Issue
Your Netlify deployment is building successfully, but the AI service is unavailable because environment variables are not configured in Netlify. The `.env.local` file is gitignored (as it should be for security), so Netlify doesn't have access to your API keys.

## Required Steps

### 1. Access Netlify Dashboard
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: **codeex-ai**
3. Navigate to: **Site settings** → **Environment variables**

### 2. Add Required Environment Variables

#### CRITICAL - AI Provider (Required)
```
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```
**Without this, AI responses will not work at all.**

#### CRITICAL - Firebase Configuration (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza_your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```
**Without these, authentication and data storage will not work.**

#### CRITICAL - Application URL (Required)
```
NEXT_PUBLIC_APP_URL=https://codeex-ai.netlify.app
```

#### OPTIONAL - Fallback AI Providers (Recommended)
```
CEREBRAS_API_KEY=csk_your_cerebras_api_key_here
GOOGLE_API_KEY=AIza_your_google_api_key_here
HUGGINGFACE_API_KEY=hf_your_huggingface_token_here
```
**These enable the fallback chain: Groq → Cerebras → Google → HuggingFace**

#### OPTIONAL - Feature Flags
```
ENABLE_SAFETY_GUARD=true
ENABLE_MEMORY_SYSTEM=false
```

#### OPTIONAL - EmailJS (Contact Form)
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_USER_ID=user_xxxxxxxxxxxxxxxxxxxx
```

#### OPTIONAL - Google Analytics
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. How to Add Variables in Netlify

**Option A: Using the UI**
1. Click **Add a variable** or **Add a single variable**
2. Enter the **Key** (e.g., `GROQ_API_KEY`)
3. Enter the **Value** (your actual API key)
4. Select scope: **All scopes** (or specific deploy contexts)
5. Click **Create variable**
6. Repeat for each variable

**Option B: Using Netlify CLI**
```bash
netlify env:set GROQ_API_KEY "gsk_your_actual_key_here"
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "AIza_your_actual_key"
# ... repeat for each variable
```

### 4. Get Your Actual Values

#### From Your Local `.env.local` File
Your local `.env.local` file already has the correct values. Copy them from there:

**Windows PowerShell:**
```powershell
Get-Content .env.local
```

**Windows CMD:**
```cmd
type .env.local
```

**Git Bash:**
```bash
cat .env.local
```

#### If You Don't Have Local Values
- **Groq API Key**: https://console.groq.com/keys
- **Firebase Config**: https://console.firebase.google.com/ → Project Settings → General → Your apps
- **Cerebras API Key**: https://cloud.cerebras.ai/
- **Google AI API Key**: https://aistudio.google.com/app/apikey
- **HuggingFace Token**: https://huggingface.co/settings/tokens

### 5. Trigger New Deployment

After adding all environment variables:

**Option A: Using Netlify UI**
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

**Option B: Push a Small Change**
```bash
git commit --allow-empty -m "Trigger rebuild with env vars"
git push origin main
```

**Option C: Using Netlify CLI**
```bash
netlify deploy --prod
```

### 6. Verify Deployment

1. Wait for deployment to complete (2-3 minutes)
2. Visit: https://codeex-ai.netlify.app
3. Try sending a message to the AI
4. Check health endpoint: https://codeex-ai.netlify.app/api/health

### 7. Troubleshooting

#### AI Still Not Working?
1. Check browser console for errors (F12)
2. Verify all NEXT_PUBLIC_* variables are set correctly
3. Verify GROQ_API_KEY is valid and has quota remaining
4. Check Netlify function logs: **Deploys** → Latest deploy → **Function logs**

#### Authentication Not Working?
1. Verify all NEXT_PUBLIC_FIREBASE_* variables are correct
2. Check Firebase Console → Authentication → Sign-in method
3. Ensure your Netlify domain is added to Firebase authorized domains

#### Build Failing?
1. Check build logs in Netlify dashboard
2. Ensure all required variables are set
3. Try clearing cache: **Site settings** → **Build & deploy** → **Clear cache and retry deploy**

## Security Notes

1. ✅ **NEXT_PUBLIC_*** variables are safe to expose (they're in client-side code)
2. ✅ **API keys** are server-side only and not exposed to clients
3. ✅ Never commit `.env.local` to git (already in `.gitignore`)
4. ✅ Rotate API keys regularly
5. ✅ Use different keys for development and production if possible

## Current Fallback Chain

With all providers configured, your app will automatically fallback:
1. **Groq** (Primary - Fast, free tier)
2. **Cerebras** (Fallback 1 - Ultra-fast inference)
3. **Google Gemini** (Fallback 2 - Reliable, good free tier)
4. **HuggingFace** (Fallback 3 - Open source models)

## Next Steps

1. ✅ Add environment variables to Netlify (see steps above)
2. ✅ Trigger new deployment
3. ✅ Test AI responses on production site
4. ✅ Share with your friends: Vidhan, Avineet, Vansh, Aayush, Varun, Pankaj, Masum, Sachin, Pardhuman, Shivansh, Vaibhav, Kartik

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com/environment-variables/overview/
- Firebase Docs: https://firebase.google.com/docs/web/setup
- Groq Docs: https://console.groq.com/docs
