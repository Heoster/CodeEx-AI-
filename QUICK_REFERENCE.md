# Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Clone & Install
git clone <repo-url>
cd CodeEx-AI-ver-2.0-main
npm install

# 2. Configure (FREE API key)
cp .env.example .env.local
# Edit .env.local and add:
# HUGGINGFACE_API_KEY=hf_xxxxx (Get from https://huggingface.co/settings/tokens)

# 3. Run
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

### Required (FREE)
```bash
HUGGINGFACE_API_KEY=hf_xxxxx  # FREE from huggingface.co
```

### Firebase (for auth)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
```

---

## 🤖 Available Models (All FREE)

| Model | Category | Use Case |
|-------|----------|----------|
| DialoGPT Medium | Conversation | Chat, dialogue |
| FLAN-T5 Base | General | General tasks |
| DistilBERT Base | General | Text analysis |
| BlenderBot Small | Conversation | Quick chat |
| BLOOM 560M | General | Multilingual |

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Quality
npm run lint             # Run ESLint
npx tsc --noEmit        # Type check
npm audit               # Security check

# Deployment
netlify deploy --prod    # Deploy to Netlify
vercel --prod           # Deploy to Vercel
firebase deploy         # Deploy to Firebase
```

---

## 🛠️ Key Files

```
src/
├── ai/
│   ├── smart-fallback.ts          # Smart fallback engine
│   ├── multi-provider-router.ts   # Model routing
│   └── adapters/
│       └── huggingface-adapter.ts # HF integration
├── lib/
│   ├── models-config.json         # Model configuration
│   └── model-registry.ts          # Model management
└── components/
    ├── model-selector.tsx         # Desktop selector
    └── mobile-model-selector.tsx  # Mobile selector
```

---

## 🔄 Smart Fallback Flow

```
User Request
    ↓
Try Preferred Model (2 retries)
    ↓ (if fails)
Try Other Models in Category
    ↓ (if fails)
Try All Available Models
    ↓ (if all fail)
User-Friendly Error Message
```

---

## 🐛 Troubleshooting

### AI Not Responding
```bash
# Check API key
echo $HUGGINGFACE_API_KEY

# Test API key
curl -H "Authorization: Bearer $HUGGINGFACE_API_KEY" \
  https://huggingface.co/api/whoami
```

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules .next
npm install
npm run build
```

### Port 3000 In Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📊 API Endpoints

```bash
# Problem Solving
POST /api/ai/solve
Body: {"problem": "What is 2+2?"}

# Summarization
POST /api/ai/summarize
Body: {"text": "Long text...", "style": "brief"}

# Web Search
POST /api/ai/search
Body: {"query": "What is AI?"}
```

---

## 🎨 Slash Commands

| Command | Description |
|---------|-------------|
| `/solve` | Solve problems step-by-step |
| `/summarize` | Summarize long text |
| `/search` | Search the web |

---

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/chat` | Main chat interface |
| `/login` | Authentication |
| `/visual-math` | Visual math solver |
| `/pdf-analyzer` | PDF analysis |
| `/documentation` | Docs |

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local`
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Validate all user inputs

---

## 📈 Performance Tips

1. **Use Auto Mode** - Let smart routing pick best model
2. **Enable Caching** - Cache common responses
3. **Optimize Images** - Use Next.js Image component
4. **Enable PWA** - Better mobile experience
5. **Monitor Logs** - Track model performance

---

## 🆘 Quick Fixes

### Model Loading Error
```
Error: "Model is currently loading"
Fix: Wait 20-30 seconds, retry automatically happens
```

### Rate Limit Error
```
Error: "Rate limit exceeded"
Fix: Wait a moment, smart fallback tries other models
```

### Network Error
```
Error: "Network error"
Fix: Check internet connection, retry
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Getting started |
| `SETUP_GUIDE.md` | Detailed setup |
| `TESTING_GUIDE.md` | Testing procedures |
| `DEPLOYMENT_CHECKLIST.md` | Deployment steps |
| `SMART_FALLBACK_SYSTEM.md` | Fallback system |
| `PROJECT_STATUS.md` | Current status |

---

## 💰 Cost Breakdown

```
Hugging Face API:  $0.00 (FREE)
Firebase (Spark):  $0.00 (FREE tier)
Netlify Hosting:   $0.00 (FREE tier)
─────────────────────────────────
Total Monthly:     $0.00 💰
```

---

## 🎯 Quick Tests

```bash
# Test homepage
curl -I http://localhost:3000

# Test chat page
curl -I http://localhost:3000/chat

# Test API
curl -X POST http://localhost:3000/api/ai/solve \
  -H "Content-Type: application/json" \
  -d '{"problem": "What is 2+2?"}'
```

---

## 🔗 Useful Links

- **Hugging Face**: https://huggingface.co
- **Get Free API Key**: https://huggingface.co/settings/tokens
- **HF Status**: https://status.huggingface.co
- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs

---

## 📞 Support

1. Check logs: `npm run dev` (watch console)
2. Review docs: See files above
3. Test API key: Use curl command above
4. Check HF status: https://status.huggingface.co

---

**Version**: 2.0  
**Cost**: $0.00 (100% FREE)  
**Status**: Production Ready ✅

---

*Keep this card handy for quick reference!*
