# CODEEX AI v2.0 - Multi-Provider AI Assistant

A powerful, multi-provider AI assistant with smart routing, web search capabilities, and mobile-first design. Built with Next.js 14, featuring automatic fallback between AI providers and comprehensive document analysis.

## 🚀 Features

### Core AI Capabilities
- **Multi-Provider Support**: Groq + Google Gemini with automatic routing
- **Smart Fallback**: Seamless switching when models are unavailable
- **Web Search Integration**: Real-time search with AI-powered synthesis
- **Document Analysis**: PDF processing and intelligent Q&A (5MB limit)
- **Image Problem Solving**: Mathematical equation recognition and solving (5MB limit)
- **Voice Synthesis**: Text-to-speech with multiple voice options

### User Experience
- **Enhanced Mobile Selector**: Search, swipe-to-dismiss, category filtering
- **Real-time Chat**: Instant AI responses with typing indicators
- **Model Selection**: Choose specific AI models or use auto-routing
- **Dark/Light Theme**: Automatic theme switching
- **Progressive Web App**: Install as native app on iOS, Android, Windows ([PWA Documentation](./docs/PWA_README.md))

### Technical Features
- **100% Free Models**: No paid API dependencies
- **Smart Caching**: Optimized performance and reduced API calls
- **Error Handling**: Graceful degradation and user-friendly messages
- **Type Safety**: Full TypeScript implementation
- **Testing Suite**: Comprehensive test coverage

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Integration**: Multi-provider (Groq + Google) with fallback
- **Database**: Firebase (Authentication & Storage)
- **Deployment**: Netlify with edge functions
- **Testing**: Vitest + Testing Library

## 🤖 AI Models

### Google Gemini Models (Free Tier: 15 req/min, 1500 req/day)
- **Gemini 2.5 Flash**: Latest model with enhanced performance and multimodal capabilities (1M context)

### Groq Models (Free Tier: 14,400 req/day)
- **Llama 3.1 70B**: Most capable for complex reasoning (131K context)
- **Llama 3.1 8B Instant**: Fast conversations (131K context)
- **Mixtral 8x7B**: Excellent for code generation (32K context)
- **Llama 3.2 90B**: Advanced math reasoning (131K context)

All models are completely free with generous rate limits.

## 📱 Mobile & PWA Features

### Progressive Web App (PWA)
CODEEX AI is a fully-featured Progressive Web App with enterprise-grade support:

**Installation**:
- 📱 **iPhone/iPad**: Open in Safari → Share → "Add to Home Screen"
- 🤖 **Android**: Open in Chrome → Tap install banner
- 💻 **Windows**: Open in Edge → ... → "Install this site as an app"

**Capabilities**:
- ⚡ **10-15x faster** repeat loads (with intelligent caching)
- 📶 **Works offline** with cached content
- 🎯 **Fullscreen app experience** (no browser UI)
- 🔄 **Auto-updates** in background
- ⌨️ **App shortcuts** for quick actions

### PWA Documentation
Complete PWA implementation documentation available in `/docs/`:

- **[PWA_README.md](./docs/PWA_README.md)** - Quick start guide
- **[PWA_FINAL_SUMMARY.md](./docs/PWA_FINAL_SUMMARY.md)** - Executive summary
- **[PWA_VERIFICATION_REPORT.md](./docs/PWA_VERIFICATION_REPORT.md)** - Technical details
- **[PWA_TESTING_GUIDE.md](./docs/PWA_TESTING_GUIDE.md)** - Testing procedures
- **[PWA_QUICK_REFERENCE.md](./docs/PWA_QUICK_REFERENCE.md)** - Quick lookup
- **[PWA_DEPLOYMENT_CHECKLIST.md](./docs/PWA_DEPLOYMENT_CHECKLIST.md)** - Deployment guide
- **[PWA_DOCUMENTATION_INDEX.md](./docs/PWA_DOCUMENTATION_INDEX.md)** - Documentation index
- **[PWA_TECHNOLOGY_SUMMARY.md](./docs/PWA_TECHNOLOGY_SUMMARY.md)** - Complete overview

### Mobile Features
- **Enhanced Mobile Selector**: Search, swipe-to-dismiss, category filtering
- **Touch-Optimized**: Gesture-based navigation with 48px+ touch targets
- **Offline Support**: PWA capabilities with service worker
- **Voice Input**: Speech-to-text integration
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Fast Loading**: Optimized bundle sizes and caching

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (free)
- Groq account (free)
- Google AI Studio account (free)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codeex-ai.git
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

4. **Configure API keys** (see setup section below)

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### Groq (Required - FREE)
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create a new API key
3. Add to `.env.local`: `GROQ_API_KEY=gsk_your_key_here`

### Google Gemini (Required - FREE)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`: `GOOGLE_API_KEY=your_key_here`

### Firebase (Required - FREE)
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and Firestore
3. Add configuration to `.env.local`

### EmailJS (Optional - FREE)
1. Sign up at [EmailJS](https://www.emailjs.com)
2. Create email service and templates
3. Add credentials to `.env.local`

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy!

### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy automatically

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2.5s
- **Bundle Size**: <200KB gzipped
- **Mobile Performance**: Optimized for 3G networks

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck

# Build test
npm run build
```

## 📚 API Endpoints

- `/api/ai/summarize` - Text summarization with multiple styles
- `/api/ai/solve` - Problem solving for math, coding, and general questions
- `/api/ai/search` - Web search with AI-powered answers
- `/api/ai/image-solver` - Image-based problem solving (5MB support)
- `/api/ai/pdf-analyzer` - PDF document analysis (5MB support)

## 🔒 Security

- **No API Keys in Client**: All sensitive operations server-side
- **Input Validation**: Comprehensive sanitization
- **Rate Limiting**: Built-in protection against abuse
- **HTTPS Only**: Secure communication
- **Content Security Policy**: XSS protection

## 🌟 Key Features Deep Dive

### Multi-Provider AI Architecture
Automatically selects the best AI provider based on:
- Model availability and performance
- Query type and complexity (general, coding, math, conversation)
- Provider rate limits and quotas
- Smart fallback strategies for reliability

### Enhanced Mobile Experience
- **Search Functionality**: Real-time model filtering
- **Swipe Gestures**: Intuitive navigation
- **Category Badges**: Visual model organization
- **Auto-expand**: Smart category selection
- **Touch Optimization**: 48px+ touch targets

### Web Search Integration
- **Privacy-First**: DuckDuckGo integration
- **Real-Time Results**: Live search with caching
- **AI Synthesis**: Intelligent answer generation
- **Source Citations**: Transparent information sourcing

### Document Processing
- **PDF Analysis**: Extract and analyze content (5MB limit)
- **Image OCR**: Mathematical equation recognition (5MB limit)
- **Multi-Format Support**: Various document types
- **Intelligent Q&A**: Context-aware responses

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com) for lightning-fast AI inference
- [Google AI](https://ai.google.dev) for advanced Gemini models
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Lucide](https://lucide.dev) for consistent icons
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling

## 📞 Support & Documentation

### Main Documentation
- **[Features](./docs/FEATURES.md)** - Detailed feature documentation
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Android App](./docs/ANDROID.md)** - Android-specific setup
- **[Email Setup](./docs/emailjs-setup.md)** - EmailJS configuration

### PWA Documentation
- **[PWA Quick Start](./docs/PWA_README.md)** - Get started with PWA
- **[PWA Testing Guide](./docs/PWA_TESTING_GUIDE.md)** - Test PWA locally
- **[PWA Deployment](./docs/PWA_DEPLOYMENT_CHECKLIST.md)** - Deploy PWA
- **[PWA Technical Details](./docs/PWA_VERIFICATION_REPORT.md)** - Technical specifications
- **[PWA Quick Reference](./docs/PWA_QUICK_REFERENCE.md)** - Quick lookup
- **[PWA Summary](./docs/PWA_FINAL_SUMMARY.md)** - Overview & status
- **[PWA Technology](./docs/PWA_TECHNOLOGY_SUMMARY.md)** - Complete overview
- **[PWA Index](./docs/PWA_DOCUMENTATION_INDEX.md)** - Documentation navigation

### Community & Support
- **Issues**: Report bugs on [GitHub Issues](https://github.com/heoster/codeex-ai/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/heoster/codeex-ai/discussions)
- **Email**: Contact us at support@codeex-ai.com
- **Documentation**: Check our [docs](./docs/) folder for comprehensive guides

---

**Built with ❤️ for the AI community**#   c o d e e x - v 3  
 