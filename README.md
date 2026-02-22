# CODEEX AI - Free AI Platform with 35+ Models

<div align="center">

![CODEEX AI](./public/Multi-Chat.png)

**Revolutionary AI platform built by a 16-year-old developer from India**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/heoster/codeex-ai)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/heoster)

[Live Demo](https://codeex-ai.netlify.app) • [Documentation](./docs) • [Report Bug](https://github.com/heoster/codeex-ai/issues) • [Request Feature](https://github.com/heoster/codeex-ai/issues)

</div>

---

## 🌟 About CODEEX AI

CODEEX AI is a **100% free** AI platform featuring **35+ models** from leading providers (Groq, Google Gemini, Cerebras, Hugging Face). Built by **Heoster (Harsh)**, a 16-year-old developer from Khatauli, Uttar Pradesh, India, with a vision to **democratize AI education** and make advanced technology accessible to every student.

### 🎯 Mission
> "Building the world's most comprehensive free AI platform to empower the next generation of innovators and creators."

### 📊 Platform Stats
- 🤖 **35+ AI Models** across 4 providers
- 👥 **1,000+ Daily Users** worldwide
- 🌍 **100+ Countries** reached
- ⚡ **99.9% Uptime** reliability
- 📝 **50,000+ Lines of Code**
- 🎨 **200+ Components**
- 🚀 **Lighthouse Score 95+**

---

## ✨ Features

### 🤖 AI Models (35+)

#### Groq (Lightning Fast)
- Llama 3.1 8B Instant
- Llama 3.1 70B Versatile
- Llama 3.3 70B Versatile
- Mixtral 8x7B
- Gemma 2 9B

#### Google Gemini (Advanced)
- Gemini 2.5 Flash (1M context)
- Gemini 2.5 Flash-8B
- Gemini 2.0 Flash Experimental

#### Cerebras (Ultra Fast)
- Llama 3.1 8B
- Llama 3.3 70B
- Qwen 3 235B Instruct
- Qwen 3 32B
- GLM 4.7
- GPT-OSS

#### Hugging Face (Specialized)
- DeepSeek R1
- DeepSeek R1 Distill Llama 70B
- RNJ-1
- And more...

### 🎨 Core Features

#### 💬 AI Chat
- Real-time streaming responses
- 35+ model selection
- Smart auto-routing
- Context-aware conversations
- Code syntax highlighting
- Math equation rendering (KaTeX)

#### 🔍 Web Search
- Privacy-first search integration
- AI-powered answer synthesis
- Source citations
- Real-time results

#### 📄 PDF Analysis
- Upload PDFs up to 5MB
- Intelligent document Q&A
- Text extraction
- Summary generation

#### 🖼️ Image Equation Solver
- Upload images up to 5MB
- Mathematical equation recognition
- Step-by-step solutions
- Visual problem solving

#### 🎤 Voice Features
- Text-to-Speech (Edge TTS)
- Multiple voice options
- Browser TTS fallback
- Symbol filtering for natural speech

#### 📝 Smart Notes
- AI-powered note-taking
- Six Souls workflow
- Automatic organization
- Export capabilities

#### 🎯 Advanced Features
- Share & Export (TXT, MD, PDF)
- Regenerate responses
- Copy to clipboard
- Dark/Light theme
- Mobile-optimized PWA
- Offline support
- Real-time thinking animation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heoster/codeex-ai.git
   cd codeex-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your API keys** (see [API Keys Setup](#-api-keys-setup))

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔑 API Keys Setup

### Required API Keys (All FREE)

#### 1. Groq API (Required)
- Visit: [https://console.groq.com/keys](https://console.groq.com/keys)
- Create account (free)
- Generate API key
- Add to `.env.local`:
  ```env
  GROQ_API_KEY=gsk_your_key_here
  ```
- **Free Tier**: 14,400 requests/day

#### 2. Google Gemini API (Required)
- Visit: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Create account (free)
- Generate API key
- Add to `.env.local`:
  ```env
  GOOGLE_API_KEY=your_key_here
  ```
- **Free Tier**: 15 requests/min, 1,500 requests/day

#### 3. Hugging Face API (Required)
- Visit: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Create account (free)
- Generate access token
- Add to `.env.local`:
  ```env
  HUGGINGFACE_API_KEY=hf_your_key_here
  ```
- **Free Tier**: Generous limits

#### 4. Cerebras API (Optional)
- Visit: [https://cloud.cerebras.ai](https://cloud.cerebras.ai)
- Create account (free)
- Generate API key
- Add to `.env.local`:
  ```env
  CEREBRAS_API_KEY=your_key_here
  ```

#### 5. Firebase (Required for Auth)
- Visit: [https://console.firebase.google.com](https://console.firebase.google.com)
- Create new project (free)
- Enable Authentication & Firestore
- Get configuration from Project Settings
- Add to `.env.local`:
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=your_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  ```

#### 6. EmailJS (Optional for Contact Form)
- Visit: [https://www.emailjs.com](https://www.emailjs.com)
- Create account (free)
- Set up email service
- Add to `.env.local`:
  ```env
  NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
  ```

### Environment Variables Template

See `.env.example` for complete template with all required variables.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Math Rendering**: KaTeX
- **Markdown**: react-markdown

### Backend
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage

### AI Integration
- **Groq**: Lightning-fast inference
- **Google Gemini**: Advanced reasoning
- **Cerebras**: Ultra-fast processing
- **Hugging Face**: Specialized models
- **Custom Adapters**: Multi-provider architecture

### DevOps
- **Deployment**: Netlify
- **Version Control**: Git/GitHub
- **CI/CD**: Netlify Auto-deploy
- **Monitoring**: Built-in error tracking

---

## 📱 Progressive Web App (PWA)

CODEEX AI is a fully-featured PWA that works on all devices:

### Installation

#### 📱 iPhone/iPad
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

#### 🤖 Android
1. Open in Chrome
2. Tap install banner
3. Or: Menu → "Install app"

#### 💻 Windows/Mac
1. Open in Chrome/Edge
2. Click install icon in address bar
3. Or: Menu → "Install CODEEX AI"

### PWA Benefits
- ⚡ **10-15x faster** repeat loads
- 📶 **Works offline** with cached content
- 🎯 **Fullscreen experience** (no browser UI)
- 🔄 **Auto-updates** in background
- 🏠 **Home screen icon**
- ⌨️ **App shortcuts** for quick actions

### PWA Documentation
Complete PWA guides available in `/docs/`:
- [PWA README](./docs/PWA_README.md) - Quick start
- [PWA Deployment](./docs/PWA_DEPLOYMENT_CHECKLIST.md) - Deploy guide
- [PWA Testing](./docs/PWA_TESTING_GUIDE.md) - Test procedures
- [PWA Verification](./docs/PWA_VERIFICATION_REPORT.md) - Technical details

---

## 🏗️ Project Structure

```
codeex-ai/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── chat/              # Chat interface
│   │   ├── documentation/     # Docs pages
│   │   └── ...
│   ├── components/            # React components
│   │   ├── chat/             # Chat components
│   │   ├── ui/               # UI components (shadcn)
│   │   └── ...
│   ├── lib/                   # Utilities & configs
│   │   ├── ai/               # AI adapters
│   │   ├── models-config.json # Model definitions
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   └── styles/                # Global styles
├── public/                    # Static assets
│   ├── icons/                # PWA icons
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── docs/                      # Documentation
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── package.json              # Dependencies
```

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # TypeScript type checking

# Testing
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Utilities
npm run clean           # Clean build artifacts
npm run format          # Format code with Prettier
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks (optional)

---

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.local`

4. **Deploy**
   - Click "Deploy site"
   - Automatic deployments on git push

### Vercel

1. **Import Project**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Connect GitHub repository

2. **Configure**
   - Framework: Next.js
   - Add environment variables

3. **Deploy**
   - Automatic deployment

### Custom Server

```bash
# Build
npm run build

# Start
npm run start

# Or use PM2
pm2 start npm --name "codeex-ai" -- start
```

---

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100
- **PWA**: ✓ Installable

### Metrics
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Total Bundle Size**: <200KB gzipped

### Optimizations
- Code splitting
- Image optimization
- Font optimization
- Service worker caching
- Edge function deployment
- CDN distribution

---

## 🔒 Security

### Best Practices
- ✅ All API keys server-side only
- ✅ Input validation & sanitization
- ✅ Rate limiting on API routes
- ✅ HTTPS only (enforced)
- ✅ Content Security Policy
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure headers

### Firebase Security
- Firestore security rules
- Authentication required
- Role-based access control

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow existing code style
- Write clear commit messages

---

## 👨‍💻 About the Developer

### Heoster (Harsh)
- **Age**: 16 years old
- **Location**: Khatauli, Uttar Pradesh, India
- **Education**: Class 11 PCM, Maples Academy
- **Role**: Founder & Lead Developer, CODEEX AI

### Vision
> "To democratize AI education in India and make advanced technology accessible to every student, regardless of their background or resources."

### Achievements
- Built CODEEX AI with 35+ models at age 16
- 50,000+ lines of code written
- 200+ components developed
- 1,000+ daily users worldwide
- 100+ countries reached
- 99.9% uptime maintained

### Connect
- 📧 Email: [the.heoster@mail.com](mailto:the.heoster@mail.com)
- 💼 LinkedIn: [codeex-heoster](https://in.linkedin.com/in/codeex-heoster-4b60b8399)
- 🐙 GitHub: [@heoster](https://github.com/heoster)
- 🐦 Twitter: [@The_Heoster_](https://twitter.com/The_Heoster_)
- 📸 Instagram: [@heoster_official](https://instagram.com/heoster_official)

---

## 📚 Documentation

### Main Docs
- [Features Guide](./docs/FEATURES.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Reference](./docs/blueprint.md)
- [Email Setup](./docs/emailjs-setup.md)

### PWA Docs
- [PWA Quick Start](./docs/PWA_README.md)
- [PWA Testing](./docs/PWA_TESTING_GUIDE.md)
- [PWA Deployment](./docs/PWA_DEPLOYMENT_CHECKLIST.md)
- [PWA Technical](./docs/PWA_VERIFICATION_REPORT.md)
- [PWA Summary](./docs/PWA_FINAL_SUMMARY.md)

### Platform Specific
- [Android Setup](./docs/ANDROID.md)
- [Share & Export](./docs/SHARE_EXPORT_GUIDE.md)

---

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### API Key Issues
- Verify all keys in `.env.local`
- Check key format (no quotes needed)
- Ensure keys are active

#### Firebase Issues
- Check Firebase project settings
- Verify Firestore rules
- Enable required services

#### PWA Not Installing
- Must be served over HTTPS
- Check manifest.json
- Verify service worker registration

### Getting Help
- 📖 Check [Documentation](./docs)
- 🐛 Report [Issues](https://github.com/heoster/codeex-ai/issues)
- 💬 Join [Discussions](https://github.com/heoster/codeex-ai/discussions)
- 📧 Email: [the.heoster@mail.com](mailto:the.heoster@mail.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 🙏 Acknowledgments

### AI Providers
- [Groq](https://groq.com) - Lightning-fast AI inference
- [Google AI](https://ai.google.dev) - Advanced Gemini models
- [Cerebras](https://cerebras.ai) - Ultra-fast processing
- [Hugging Face](https://huggingface.co) - Specialized models

### Technologies
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) - Beautiful components
- [Lucide](https://lucide.dev) - Icon library
- [Firebase](https://firebase.google.com) - Backend services
- [Netlify](https://netlify.com) - Deployment platform

### Community
- All contributors and testers
- Open source community
- Early adopters and users
- Friends who provided feedback

---

## 🌟 Star History

If you find CODEEX AI useful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=heoster/codeex-ai&type=Date)](https://star-history.com/#heoster/codeex-ai&Date)

---

## 📈 Roadmap

### Current (v2.0)
- ✅ 35+ AI models
- ✅ Multi-provider architecture
- ✅ PWA support
- ✅ Voice synthesis
- ✅ PDF analysis
- ✅ Image solver

### Upcoming (v2.1)
- 🔄 Native mobile apps (iOS/Android)
- 🔄 Advanced voice features
- 🔄 Collaborative features
- 🔄 API marketplace
- 🔄 Plugin system

### Future (v3.0)
- 📋 AI model training
- 📋 Custom model fine-tuning
- 📋 Enterprise features
- 📋 White-label solution
- 📋 Educational curriculum

---

## 💖 Support the Project

### Ways to Support
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔀 Submit pull requests
- 📢 Share with others
- 💬 Join discussions

### Spread the Word
- Share on social media
- Write blog posts
- Create tutorials
- Make videos
- Give talks

---

<div align="center">

### Built with ❤️ by a 16-year-old for the AI community

**[Website](https://codeex-ai.netlify.app)** • **[GitHub](https://github.com/heoster/codeex-ai)** • **[LinkedIn](https://in.linkedin.com/in/codeex-heoster-4b60b8399)** • **[Twitter](https://twitter.com/The_Heoster_)**

© 2024-2026 CODEEX AI. All rights reserved.

Made in 🇮🇳 India with passion for democratizing AI education

</div>
