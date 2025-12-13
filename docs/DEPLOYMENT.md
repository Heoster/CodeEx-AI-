# CODEEX AI - Deployment Guide

## Netlify Deployment (Recommended)

### Prerequisites

1. GitHub account with repository access
2. Netlify account (free tier works)
3. API keys ready:
   - Google AI API key (required)
   - Firebase project credentials (required)
   - Hugging Face API key (optional)
   - OpenRouter API key (optional)

### Step 1: Connect Repository

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository
5. Netlify auto-detects Next.js configuration

### Step 2: Configure Build Settings

Netlify should auto-detect these from `netlify.toml`:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | 20 |

### Step 3: Add Environment Variables

Go to **Site Settings** → **Environment Variables** and add:

#### Required Variables

```
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Optional Variables

```
HUGGINGFACE_API_KEY=your_huggingface_token
OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for build to complete (3-5 minutes)
3. Your site is live at `https://your-site.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **Domain settings**
2. Click "Add custom domain"
3. Follow DNS configuration instructions

---

## Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name
4. Enable/disable Google Analytics
5. Click "Create project"

### Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)
4. Add your domain to **Authorized domains**

### Get Configuration

1. Go to **Project settings** → **General**
2. Scroll to "Your apps"
3. Click web icon (</>) to add web app
4. Copy the configuration values

---

## Google AI Setup

### Get API Key

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click "New token" (100% FREE - no credit card required)
3. Copy the token
4. Add to environment variables as `HUGGINGFACE_API_KEY`

### Available Free Models

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Generative Language API"

---

## Hugging Face Setup (Optional)

### Get API Token

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Name it and select "Read" access
4. Copy the token
5. Add to environment variables as `HUGGINGFACE_API_KEY`

---

## OpenRouter Setup (Optional)

### Get API Key

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Create an account
3. Generate API key
4. Add to environment variables as `OPENROUTER_API_KEY`

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Authentication works (login/signup)
- [ ] Chat functionality works
- [ ] AI responses are generated
- [ ] Model selection works
- [ ] Web search returns results
- [ ] Visual math solver works
- [ ] PDF analyzer works
- [ ] Voice features work (if enabled)
- [ ] PWA installs correctly on mobile
- [ ] Offline page shows when disconnected

---

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
npm install --legacy-peer-deps
```

**Error: TypeScript errors**
- Check `next.config.js` has `ignoreBuildErrors: false` for production
- Fix any TypeScript errors before deploying

### Runtime Errors

**AI not responding**
- Verify `HUGGINGFACE_API_KEY` is set correctly
- Check API token has proper permissions
- Look at Netlify function logs

**Authentication fails**
- Verify Firebase config is correct
- Add Netlify domain to Firebase authorized domains
- Check browser console for errors

### PWA Issues

**App not installable**
- Verify `manifest.json` is accessible
- Check HTTPS is enabled (Netlify provides this)
- Verify icons exist in `/public/icons/`

---

## Performance Optimization

### Netlify Settings

1. Enable **Asset optimization**
2. Enable **Pretty URLs**
3. Configure **Cache headers** (already in netlify.toml)

### Next.js Optimization

The app is already configured with:
- Image optimization
- Code splitting
- Static generation where possible
- PWA caching strategies

---

## Monitoring

### Netlify Analytics

1. Go to **Analytics** in Netlify dashboard
2. View page views, visitors, bandwidth

### Error Tracking

1. Check **Functions** logs for server errors
2. Use browser DevTools for client errors

---

## Updating the App

### Automatic Deploys

With GitHub connected, every push to main branch triggers a deploy.

### Manual Deploy

```bash
# Build locally
npm run build

# Deploy via CLI
netlify deploy --prod
```

### Rollback

1. Go to **Deploys** in Netlify
2. Find previous working deploy
3. Click "Publish deploy"

---

## Security Considerations

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable Firebase security rules** for production
4. **Review Netlify headers** in `netlify.toml`

---

*Deployment guide last updated: December 2024*
