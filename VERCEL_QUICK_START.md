# 🚀 CodeEx AI - Vercel Quick Start

## Deploy in 5 Minutes

### Step 1: Push to GitHub (if not already done)
```bash
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Visit**: https://vercel.com/new
2. **Import**: Select your `CodeEx-AI-` repository
3. **Configure**: Framework preset will auto-detect as Next.js
4. **Add Environment Variables**: Click "Environment Variables" dropdown

### Step 3: Copy-Paste Environment Variables

Get your values from `.env.local` and paste into Vercel:

```bash
# Windows PowerShell
Get-Content .env.local

# Git Bash / Linux / Mac
cat .env.local
```

**Required Variables** (copy from your `.env.local`):
```
GROQ_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Optional Variables** (for fallback providers):
```
CEREBRAS_API_KEY=
GOOGLE_API_KEY=
HUGGINGFACE_API_KEY=
NEXT_PUBLIC_ELEVENLABS_API_KEY=
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Get your URL: `https://codeex-ai-xxx.vercel.app`

### Step 5: Update App URL
1. Copy your Vercel URL
2. Go to: **Project Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL` to your actual URL
4. Click **"Redeploy"** from Deployments tab

### Step 6: Configure Firebase
1. Go to: https://console.firebase.google.com/
2. Select your project
3. **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `codeex-ai-xxx.vercel.app`

### Step 7: Test
Visit your app and verify:
- ✅ Homepage loads
- ✅ Can sign up/login
- ✅ AI chat works
- ✅ Settings save

---

## 🎉 Done!

Your CodeEx AI is now live on Vercel!

**Next Steps:**
- Share with friends for testing
- Set up custom domain (optional)
- Enable Vercel Analytics (optional)

**Need Help?** See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## Common Issues

### "Build failed"
- Check Vercel build logs
- Verify all environment variables are set
- Try: `npm run build` locally first

### "AI not responding"
- Verify `GROQ_API_KEY` is set correctly
- Check `/api/health` endpoint
- Look at Function Logs in Vercel

### "Login not working"
- Add Vercel domain to Firebase authorized domains
- Verify Firebase config variables
- Check browser console for errors

---

**Deployment Time**: ~5 minutes
**Build Time**: ~2-3 minutes
**Cost**: Free (Hobby tier)
