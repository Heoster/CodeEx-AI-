# CODEEX AI - Deployment URLs

## Production Deployments

### Primary Deployment (Netlify)
- **URL**: https://codeex-ai.netlify.app
- **Status**: Active
- **Platform**: Netlify
- **Auto-deploy**: Yes (from main branch)
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`

### Secondary Deployment (Vercel)
- **URL**: https://codeex-ai.vercel.app
- **Status**: Active
- **Platform**: Vercel
- **Auto-deploy**: Yes (from main branch)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## Key URLs

### Main Application
- Netlify: https://codeex-ai.netlify.app
- Vercel: https://codeex-ai.vercel.app

### Chat Interface
- Netlify: https://codeex-ai.netlify.app/chat
- Vercel: https://codeex-ai.vercel.app/chat

### Documentation
- Netlify: https://codeex-ai.netlify.app/documentation
- Vercel: https://codeex-ai.vercel.app/documentation

### API Endpoints
- Netlify: https://codeex-ai.netlify.app/api
- Vercel: https://codeex-ai.vercel.app/api

## Sitemaps

### Netlify
- Sitemap: https://codeex-ai.netlify.app/sitemap.xml
- Robots: https://codeex-ai.netlify.app/robots.txt

### Vercel
- Sitemap: https://codeex-ai.vercel.app/sitemap.xml
- Robots: https://codeex-ai.vercel.app/robots.txt

## Google Search Console

Both URLs should be added to Google Search Console:

1. **Netlify Property**: https://codeex-ai.netlify.app
   - Verification Code 1: `RY6Rmrn0nrzaZO8QXaazCfjsnLoEBKT8-oJxBc_l_9U`
   - Verification Code 2: `BOhoSA2Bv_SY0gWI4wdYE6gPRxqXimqYLLMrYQxVN4k`
   - Submit Sitemap: `sitemap.xml`

2. **Vercel Property**: https://codeex-ai.vercel.app
   - Verification Code 1: `RY6Rmrn0nrzaZO8QXaazCfjsnLoEBKT8-oJxBc_l_9U`
   - Verification Code 2: `BOhoSA2Bv_SY0gWI4wdYE6gPRxqXimqYLLMrYQxVN4k`
   - Submit Sitemap: `sitemap.xml`

## Environment Variables

Both deployments use the same environment variables. Set these in:
- **Netlify**: Site settings → Environment variables
- **Vercel**: Project settings → Environment Variables

Required variables:
```env
NEXT_PUBLIC_SITE_URL=https://codeex-ai.netlify.app  # or vercel.app
NEXT_PUBLIC_APP_URL=https://codeex-ai.netlify.app   # or vercel.app
GROQ_API_KEY=your_key
GOOGLE_API_KEY=your_key
HUGGINGFACE_API_KEY=your_key
CEREBRAS_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment Status

### Netlify
- Build Status: Check at https://app.netlify.com/sites/[your-site]/deploys
- Build Time: ~2-3 minutes
- CDN: Global edge network
- SSL: Automatic (Let's Encrypt)

### Vercel
- Build Status: Check at https://vercel.com/[your-username]/[project]/deployments
- Build Time: ~2-3 minutes
- CDN: Global edge network
- SSL: Automatic

## DNS Configuration

If using custom domain:
- Point DNS to both platforms
- Or use one as primary and other as backup
- Configure redirects if needed

## Monitoring

Monitor both deployments:
- Uptime monitoring
- Performance metrics
- Error tracking
- Analytics

## Failover Strategy

If one deployment fails:
1. Check build logs
2. Verify environment variables
3. Test the other deployment
4. Update DNS if needed

## Notes

- Both deployments auto-update from GitHub main branch
- Environment variables must be set separately on each platform
- Service workers and PWA features work on both
- API routes function identically on both platforms

---

**Last Updated**: February 22, 2026  
**Maintained By**: Heoster (Harsh)  
**Contact**: codeex@email.com
