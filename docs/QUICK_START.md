# 🚀 Quick Start Guide - Local Testing

## 1. Install Dependencies (1 minute)

```bash
npm install
```

## 2. Set Up Environment Variables (5 minutes)

### Copy the template:
```bash
cp .env.local.example .env.local
```

### Get your API keys:

#### A. Groq API Key (REQUIRED - 2 minutes)
1. Visit: https://console.groq.com/keys
2. Sign up with Google/GitHub
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)
5. Paste in `.env.local` as `GROQ_API_KEY=gsk_your_key_here`

#### B. Firebase Config (REQUIRED - 3 minutes)
1. Visit: https://console.firebase.google.com/
2. Create new project (or use existing)
3. Click ⚙️ Settings > Project Settings
4. Scroll to "Your apps" > Click Web icon (</>) 
5. Register app, copy all config values
6. Paste in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
   ```

#### C. Set App URL
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### D. Optional: Disable Python TTS (for local testing)
```
USE_PYTHON_TTS=false
```

## 3. Verify Configuration (30 seconds)

```bash
npm run verify-env
```

You should see:
```
✅ All required environment variables are configured!
✅ You can start the development server with: npm run dev
```

If you see ❌ errors, check your `.env.local` file.

## 4. Start Development Server (1 minute)

```bash
npm run dev
```

Wait for:
```
✓ Ready in 3.5s
○ Local:   http://localhost:3000
```

## 5. Test the App (2 minutes)

### A. Open Browser
Visit: http://localhost:3000

### B. Check Health Status
Visit: http://localhost:3000/api/health

Should show:
```json
{
  "status": "healthy",
  "providers": {
    "groq": { "available": true, "configured": true }
  }
}
```

### C. Test AI Chat
1. Type: "Hello, this is a test"
2. Press Enter or click Send
3. Should get AI response in 2-4 seconds
4. Check browser console (F12) - should be no red errors

### D. Test Authentication
1. Click "Sign In" button
2. Try Google Sign-In
3. Should redirect to Google auth
4. After sign-in, should see your profile

## 6. Test Production Build (2 minutes)

```bash
npm run build
```

Should complete with:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization
```

Then start production server:
```bash
npm start
```

Visit: http://localhost:3000

Test again - everything should work.

## 7. Common Issues & Quick Fixes

### ❌ "GROQ_API_KEY not configured"
**Fix**: Add valid Groq API key to `.env.local`
```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

### ❌ "Firebase: Error (auth/invalid-api-key)"
**Fix**: Check Firebase config in `.env.local` - copy exact values from Firebase console

### ❌ "AI processing failed: fetch failed"
**Fix**: 
- Check internet connection
- Verify Groq API key is valid
- Try regenerating API key at https://console.groq.com/keys

### ❌ Port 3000 already in use
**Fix**: 
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### ⚠️ "Module not found" errors
**Fix**: 
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## 8. Ready for Production? ✅

After all tests pass:

1. ✅ `npm run verify-env` passes
2. ✅ `npm run dev` works - AI chat responds
3. ✅ `npm run build` completes successfully
4. ✅ `npm start` works - production mode
5. ✅ No console errors in browser
6. ✅ Authentication works
7. ✅ All features tested

## 9. Deploy to Production

### Add Environment Variables to Netlify:

1. Go to: https://app.netlify.com/
2. Select your site
3. Go to: Site settings > Environment variables
4. Add all variables from `.env.local`:
   - `GROQ_API_KEY`
   - `GOOGLE_API_KEY` (optional)
   - `CEREBRAS_API_KEY` (optional)
   - `HUGGINGFACE_API_KEY` (optional)
   - All `NEXT_PUBLIC_FIREBASE_*` variables
   - `NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app`
   - All other optional variables

### Deploy:

```bash
git add .
git commit -m "Fix: Netlify timeout issue - reduce adapter timeouts and limit fallback"
git push origin main
```

Netlify will auto-deploy.

### Test Production:

1. Visit: https://your-site.netlify.app
2. Test AI chat
3. Check: https://your-site.netlify.app/api/health
4. Monitor Netlify function logs for errors

## 10. Need Help?

- 📖 Full guide: `LOCAL_TESTING_SETUP.md`
- 🔧 Timeout fix: `NETLIFY_TIMEOUT_FIX.md`
- 🐛 Check logs: Browser DevTools (F12) > Console
- 🏥 Health check: http://localhost:3000/api/health

## Total Time: ~10 minutes

That's it! You're ready to develop and deploy CODEEX AI. 🎉
