# CodeEx AI - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account with CodeEx AI repository
- Vercel account (free tier works)
- Environment variables ready (from `.env.local`)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure All Files Are Committed
```bash
git add -A
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Configuration Files
The following files are already configured for Vercel:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `next.config.mjs` - Next.js configuration
- ✅ `package.json` - Dependencies and scripts

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com/
   - Click "Sign Up" or "Log In"
   - Choose "Continue with GitHub"

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `CodeEx-AI-`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables** (CRITICAL)
   Click "Environment Variables" and add:

   ```env
   # Required - Groq API
   GROQ_API_KEY=gsk_your_groq_api_key_here

   # Required - Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza_your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

   # Required - App URL (update after deployment)
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

   # Optional - Additional AI Providers (Fallback Chain)
   CEREBRAS_API_KEY=csk_your_cerebras_key
   GOOGLE_API_KEY=AIza_your_google_ai_key
   HUGGINGFACE_API_KEY=hf_your_huggingface_key

   # Optional - ElevenLabs TTS (Fallback)
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key

   # Optional - Email Service
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://codeex-ai.vercel.app`

6. **Update App URL**
   - Go to Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
   - Redeploy: Deployments → ⋯ → Redeploy

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to link project
```

---

## Step 3: Configure Custom Domain (Optional)

1. **Go to Project Settings**
   - Select your project
   - Go to "Settings" → "Domains"

2. **Add Domain**
   - Enter your domain: `codeex.ai` or `app.codeex.ai`
   - Follow DNS configuration instructions
   - Vercel provides automatic HTTPS

3. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy

---

## Step 4: Verify Deployment

### 4.1 Check Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-28T...",
  "environment": "production",
  "providers": {
    "groq": true,
    "cerebras": true,
    "google": true
  }
}
```

### 4.2 Test Core Features
- [ ] Homepage loads
- [ ] User can sign up/login
- [ ] Chat interface works
- [ ] AI responds to messages
- [ ] TTS works (if enabled)
- [ ] Settings save correctly
- [ ] Account page accessible

### 4.3 Check Console Logs
- Open browser DevTools → Console
- Look for any errors
- Verify API calls succeed

---

## Step 5: Firebase Configuration

### 5.1 Add Vercel Domain to Firebase
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to "Authentication" → "Settings" → "Authorized domains"
4. Add your Vercel domain: `your-app.vercel.app`
5. If using custom domain, add that too

### 5.2 Update Firestore Rules (if needed)
Your `firestore.rules` are already configured, but verify they're deployed:
```bash
firebase deploy --only firestore:rules
```

---

## Vercel-Specific Features

### Automatic Deployments
- Every push to `main` branch triggers production deployment
- Pull requests get preview deployments
- Rollback to previous deployments anytime

### Environment Variables
- Set different values for Production, Preview, Development
- Encrypted and secure
- Never exposed in client-side code (except NEXT_PUBLIC_*)

### Edge Functions
- API routes run on Vercel Edge Network
- Low latency worldwide
- Automatic scaling

### Analytics (Optional)
- Enable Vercel Analytics in project settings
- Track page views, performance, Web Vitals
- Free tier includes basic analytics

---

## Troubleshooting

### Build Fails
**Error**: `Module not found` or `Cannot find module`
```bash
# Clear cache and rebuild locally
rm -rf .next node_modules
npm install
npm run build
```

**Error**: `Type errors in production build`
```bash
# Run typecheck locally
npm run typecheck
# Fix any errors before deploying
```

### Environment Variables Not Working
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding/changing variables
4. Remember: Only `NEXT_PUBLIC_*` variables are available client-side

### API Routes Timeout
- Vercel free tier: 10s timeout
- Vercel Pro: 60s timeout (configured in `vercel.json`)
- Consider upgrading if AI responses take longer

### Firebase Authentication Issues
1. Verify domain is authorized in Firebase Console
2. Check Firebase config variables are correct
3. Ensure `NEXT_PUBLIC_APP_URL` matches deployment URL

### TTS Not Working
1. Verify `GROQ_API_KEY` is set
2. Check API route: `/api/tts`
3. Look for errors in Vercel Function Logs
4. Fallback to Edge TTS or Browser TTS should work

---

## Performance Optimization

### 1. Enable Vercel Speed Insights
```bash
npm install @vercel/speed-insights
```

Add to `src/app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 2. Enable Image Optimization
Already configured in `next.config.mjs`:
```javascript
images: {
  domains: ['firebasestorage.googleapis.com'],
  formats: ['image/avif', 'image/webp'],
}
```

### 3. Enable Compression
Vercel automatically compresses responses with Brotli/Gzip

---

## Monitoring & Logs

### View Function Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments" → Select deployment
4. Click "Functions" tab
5. View logs for each API route

### Real-time Logs
```bash
vercel logs --follow
```

### Error Tracking (Optional)
Consider integrating:
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/
- Datadog: https://www.datadoghq.com/

---

## Cost Estimation

### Vercel Free Tier (Hobby)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Edge Network
- ⚠️ 10s function timeout
- ⚠️ 1 concurrent build

### Vercel Pro ($20/month)
- ✅ 1 TB bandwidth/month
- ✅ 60s function timeout
- ✅ 12 concurrent builds
- ✅ Team collaboration
- ✅ Advanced analytics

**Recommendation**: Start with Free tier, upgrade if needed

---

## Comparison: Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Next.js Support | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐⭐ Plugin |
| Build Speed | Fast | Fast |
| Edge Functions | Yes | Yes |
| Free Tier Bandwidth | 100 GB | 100 GB |
| Function Timeout (Free) | 10s | 10s |
| Function Timeout (Paid) | 60s | 26s |
| Custom Domains | Free | Free |
| Analytics | Built-in | Built-in |
| Preview Deployments | Yes | Yes |

**Verdict**: Vercel is optimized for Next.js (created by same team)

---

## Security Checklist

- [x] Environment variables encrypted
- [x] API keys not in code
- [x] HTTPS enabled automatically
- [x] Security headers configured
- [x] Firebase rules properly set
- [x] CORS configured for API routes
- [x] XSS protection enabled
- [x] Content Security Policy headers

---

## Post-Deployment Tasks

### 1. Update Documentation
- Update README.md with production URL
- Update API documentation
- Share deployment URL with team

### 2. Set Up Monitoring
- Enable Vercel Analytics
- Set up error tracking
- Configure uptime monitoring

### 3. Test with Friends
Share with your testing team:
- Vidhan, Avineet, Vansh, Aayush
- Varun, Pankaj, Masum, Sachin
- Pardhuman, Shivansh, Vaibhav, Kartik

### 4. SEO Configuration
- Submit sitemap to Google Search Console
- Verify domain ownership
- Set up Google Analytics (optional)

---

## Support & Resources

### Vercel Documentation
- Docs: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Environment Variables: https://vercel.com/docs/environment-variables

### Community
- Vercel Discord: https://vercel.com/discord
- Next.js Discord: https://nextjs.org/discord
- GitHub Discussions: https://github.com/vercel/next.js/discussions

### Get Help
- Vercel Support: support@vercel.com
- Next.js Issues: https://github.com/vercel/next.js/issues

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs

# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add VARIABLE_NAME

# Remove deployment
vercel rm deployment-url
```

---

**Last Updated**: February 28, 2026
**Vercel Version**: Latest
**Next.js Version**: 14.x

**Ready to deploy?** Follow Step 2 above! 🚀
