# Netlify Environment Variables - Quick Visual Guide

## 🎯 Goal
Configure environment variables in Netlify so your AI service works in production.

## ⏱️ Time Required
5-10 minutes

## 📋 Prerequisites
- Access to Netlify dashboard
- Your `.env.local` file with actual values

---

## Step-by-Step Instructions

### Step 1: Get Your Environment Variables
Open your `.env.local` file and copy all the values. You'll need them in the next steps.

**Windows PowerShell:**
```powershell
Get-Content .env.local
```

**Git Bash:**
```bash
cat .env.local
```

Keep this window open so you can copy values easily.

---

### Step 2: Open Netlify Dashboard

1. Go to: https://app.netlify.com/
2. Log in if needed
3. Click on your site: **codeex-ai**

---

### Step 3: Navigate to Environment Variables

1. Click **Site settings** (in the top navigation)
2. In the left sidebar, click **Environment variables** (under "Build & deploy")
3. You'll see a page titled "Environment variables"

---

### Step 4: Add Variables One by One

For each variable below, click **Add a variable** or **Add a single variable**:

#### 🔴 CRITICAL - AI Provider (Required)
```
Key: GROQ_API_KEY
Value: [Copy from your .env.local - starts with gsk_]
Scopes: All scopes
```

#### 🔴 CRITICAL - Firebase (Required - 7 variables)
```
Key: NEXT_PUBLIC_FIREBASE_API_KEY
Value: [Copy from your .env.local - starts with AIza]
Scopes: All scopes
```

```
Key: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: [Copy from your .env.local - ends with .firebaseapp.com]
Scopes: All scopes
```

```
Key: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: [Copy from your .env.local]
Scopes: All scopes
```

```
Key: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: [Copy from your .env.local - ends with .firebasestorage.app]
Scopes: All scopes
```

```
Key: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: [Copy from your .env.local - numbers only]
Scopes: All scopes
```

```
Key: NEXT_PUBLIC_FIREBASE_APP_ID
Value: [Copy from your .env.local - format: 1:xxx:web:xxx]
Scopes: All scopes
```

```
Key: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: [Copy from your .env.local - starts with G-]
Scopes: All scopes
```

#### 🔴 CRITICAL - App URL (Required)
```
Key: NEXT_PUBLIC_APP_URL
Value: https://codeex-ai.netlify.app
Scopes: All scopes
```

#### 🟡 RECOMMENDED - Fallback Providers (Optional but recommended)
```
Key: CEREBRAS_API_KEY
Value: [Copy from your .env.local - starts with csk_]
Scopes: All scopes
```

```
Key: GOOGLE_API_KEY
Value: [Copy from your .env.local - starts with AIza]
Scopes: All scopes
```

```
Key: HUGGINGFACE_API_KEY
Value: [Copy from your .env.local - starts with hf_]
Scopes: All scopes
```

#### 🟢 OPTIONAL - Feature Flags
```
Key: ENABLE_SAFETY_GUARD
Value: true
Scopes: All scopes
```

```
Key: ENABLE_MEMORY_SYSTEM
Value: false
Scopes: All scopes
```

---

### Step 5: Verify Variables Added

After adding all variables, you should see them listed on the Environment variables page. Count them:
- **Minimum required:** 9 variables (GROQ_API_KEY + 7 Firebase + APP_URL)
- **Recommended:** 12 variables (+ 3 fallback providers)
- **Full setup:** 14 variables (+ 2 feature flags)

---

### Step 6: Trigger New Deployment

**Option A: Using Netlify UI**
1. Click **Deploys** tab (top navigation)
2. Click **Trigger deploy** button (top right)
3. Select **Deploy site**
4. Wait 2-3 minutes for deployment to complete

**Option B: Push to GitHub**
```bash
git commit --allow-empty -m "Trigger rebuild with env vars"
git push origin main
```

---

### Step 7: Test Your Deployment

1. Wait for deployment to finish (watch the progress in Netlify)
2. Once deployed, visit: https://codeex-ai.netlify.app
3. Try these tests:
   - ✅ Homepage loads
   - ✅ Sign in / Sign up works
   - ✅ Send a message to AI
   - ✅ AI responds (not "service unavailable")
   - ✅ TTS works (click speaker icon)
   - ✅ Account page accessible

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ AI responds to your messages (no "service unavailable" error)
- ✅ Authentication works (can sign in/up)
- ✅ TTS plays audio with Orpheus voices
- ✅ No console errors about missing environment variables

---

## ❌ Troubleshooting

### AI Still Says "Service Unavailable"
1. Check browser console (F12) for errors
2. Verify GROQ_API_KEY is correct (no typos)
3. Check Groq API key is valid: https://console.groq.com/keys
4. Check function logs in Netlify: Deploys → Latest deploy → Function logs

### Authentication Not Working
1. Verify all 7 NEXT_PUBLIC_FIREBASE_* variables are correct
2. Check Firebase Console: https://console.firebase.google.com/
3. Ensure Netlify domain is in Firebase authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add: `codeex-ai.netlify.app`

### Variables Not Taking Effect
1. Make sure you triggered a NEW deployment after adding variables
2. Old deployments don't have the new variables
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Still Having Issues?
1. Check Netlify build logs: Deploys → Latest deploy → Deploy log
2. Check function logs: Deploys → Latest deploy → Function logs
3. Verify environment variables are saved: Site settings → Environment variables

---

## 📚 Additional Resources

- **Detailed Guide:** `NETLIFY_ENV_SETUP.md`
- **Deployment Status:** `DEPLOYMENT_STATUS.md`
- **Environment Template:** `.env.local.example`
- **Netlify Docs:** https://docs.netlify.com/environment-variables/overview/

---

## 🚀 After Success

Once everything works:
1. ✅ Test all features thoroughly
2. ✅ Share with friends for feedback
3. ✅ Monitor Groq API usage: https://console.groq.com/
4. ✅ Check Firebase usage: https://console.firebase.google.com/

---

**Need Help?** Check the troubleshooting section above or review the detailed guide in `NETLIFY_ENV_SETUP.md`.
