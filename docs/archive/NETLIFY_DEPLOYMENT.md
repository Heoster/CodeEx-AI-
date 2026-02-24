# 🚀 Netlify Deployment Guide for CODEEX AI

Complete guide to deploy CODEEX AI to Netlify with all features working.

## 📋 Prerequisites

- GitHub repository with CODEEX AI code
- Netlify account (free tier works)
- API keys for AI providers (all free)

## 🔑 Required Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

### AI Provider Keys (Required)
```bash
# Groq (Fast inference - 14,400 req/day)
GROQ_API_KEY=your_groq_api_key_here

# Hugging Face (Router API - FREE)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Google Gemini (FREE - 15 req/min, 1500 req/day)
GOOGLE_API_KEY=your_google_api_key_here
```

### Firebase Configuration (Required)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Build Configuration (Required)
```bash
NODE_VERSION=20
NPM_FLAGS=--legacy-peer-deps
NEXT_TELEMETRY_DISABLED=1
SKIP_ENV_VALIDATION=true
```

### Optional Variables
```bash
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id
```

## 🚀 Deployment Steps

### 1. Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select the CODEEX AI repository

### 2. Configure Build Settings
- **Build command**: `npm run build:netlify`
- **Publish directory**: `.next`
- **Node version**: `20`

### 3. Set Environment Variables
1. Go to Site Settings → Environment Variables
2. Add all required variables listed above
3. Save changes

### 4. Deploy
1. Click "Deploy site"
2. Wait for build to complete (5-10 minutes)
3. Site will be available at `https://your-site-name.netlify.app`

## ✅ Verification

After deployment, verify everything works:

### Automatic Verification
```bash
npm run verify:deployment
```

### Manual Verification
1. **Health Check**: Visit `/api/health`
2. **Main App**: Visit `/`
3. **Chat Interface**: Visit `/chat`
4. **Documentation**: Visit `/documentation`

## 🔧 Build Optimization

The app includes several Netlify optimizations:

### Next.js Configuration
- PWA support with service worker
- Image optimization
- Compression enabled
- TypeScript/ESLint error handling

### Netlify Configuration
- Next.js plugin for optimal performance
- Security headers
- Caching strategies
- API route optimization

### Build Process
- Custom build script with error handling
- Dependency optimization
- Environment validation
- Build verification

## 🐛 Troubleshooting

### Build Fails
1. Check environment variables are set
2. Verify Node version is 20
3. Check build logs for specific errors

### API Routes Not Working
1. Verify environment variables
2. Check function logs in Netlify dashboard
3. Test individual endpoints

### PWA Not Installing
1. Check service worker registration
2. Verify manifest.json is accessible
3. Test on HTTPS (required for PWA)

## 📊 Performance

Expected performance metrics:
- **Build Time**: 5-10 minutes
- **Cold Start**: < 2 seconds
- **Page Load**: < 3 seconds
- **Lighthouse Score**: 95+

## 🔄 Updates

To update the deployment:
1. Push changes to GitHub
2. Netlify auto-deploys from main branch
3. Monitor build in Netlify dashboard

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally first with `npm run build`
4. Check the health endpoint `/api/health`

---

**Ready to deploy!** 🚀

Your CODEEX AI app will be live with all 8 AI models working perfectly.