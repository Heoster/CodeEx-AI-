# CodeEx AI - Complete System Knowledge Base

## 🎯 What is CodeEx AI?

CodeEx AI is a **free, open-source AI platform** that provides access to 35+ AI models through a unified interface. Built by **Heoster (Harsh)**, a 16-year-old developer from Khatauli, India, CodeEx democratizes AI access for everyone.

**Version:** 2.0.0  
**Tech Stack:** Next.js 14, TypeScript, Firebase, Genkit AI, Tailwind CSS  
**Deployment:** Netlify (Production), Vercel (Alternative)

---

## 🏗️ Architecture Overview

### Multi-Provider AI System

CodeEx uses an intelligent routing system that automatically selects the best AI model for each task:

**Primary Providers:**
- **Groq** - Ultra-fast inference (14,400 requests/day free)
- **Google Gemini** - Advanced reasoning and multimodal
- **Cerebras** - Fastest inference available
- **HuggingFace** - Open-source models and image generation

**Routing Strategy:**
1. **Auto Mode** - AI automatically selects best model based on query type
2. **Manual Mode** - User selects specific model
3. **Fallback Chain** - If primary fails, automatically tries alternatives

### Core Technologies

**Frontend:**
- Next.js 14 (App Router)
- React 18 with Server Components
- Tailwind CSS + shadcn/ui
- TypeScript (strict mode)

**Backend:**
- Next.js API Routes
- Firebase (Auth + Firestore + Storage)
- Genkit AI (Google's AI framework)
- Local file storage (replaced Firebase Storage)

**AI Integration:**
- Groq API (llama-3.3-70b, mixtral-8x7b, gemma-2-9b)
- Google Gemini (gemini-1.5-flash, gemini-2.5-pro)
- Cerebras (llama3.1-8b, gpt-oss-120b)
- HuggingFace (FLUX.1-schnell for images)

---

## 📱 User Interface & Pages

### Main Pages

#### 1. **Home Page** (`/`)
- Hero section with gradient animations
- Feature showcase (8 main features)
- Model selector preview
- Quick start guide
- Developer information
- Call-to-action buttons

#### 2. **Chat Page** (`/chat`)
**The main AI interaction interface**

**Features:**
- Multi-model selector (35+ models)
- Real-time streaming responses
- Message history with local storage
- Voice input (Groq Whisper V3 Turbo)
- Voice output (Groq PlayAI TTS)
- Image upload and analysis
- Camera capture
- Audio recording
- Code syntax highlighting
- Markdown rendering
- Message sharing (Twitter, LinkedIn, copy)
- PDF export
- Conversation management

**UI Components:**
- Left sidebar: Conversation history
- Center: Chat messages
- Right sidebar: Model selector + settings
- Bottom: Input area with multimodal buttons

**Settings Panel:**
- Model selection (auto or manual)
- Tone (helpful, formal, casual)
- Technical level (beginner, intermediate, expert)
- Voice settings (enable/disable, voice selection)
- Personality system (coming soon)

#### 3. **Login/Signup Page** (`/login`)
- Email/password authentication
- Google OAuth integration
- Email verification
- Password reset flow
- Welcome email automation
- Modern gradient design

#### 4. **User Management** (`/user-management`)
**Feature dashboard showing all capabilities**

**8 Feature Cards:**
1. **Multi-Model AI** - 35+ models, auto-routing
2. **Image Generation** - SOHAM pipeline with FLUX.1
3. **Video Generation** - Google Veo 3.1
4. **Web Search** - Coming soon (You.com removed)
5. **Speech-to-Text** - Groq Whisper V3 Turbo
6. **Text-to-Speech** - Groq PlayAI with 6 voices
7. **Smart Intent Detection** - Auto-routing
8. **Memory System** - Vector embeddings (optional)

**Account Information:**
- User profile display
- Account creation date
- Quick links to features
- Settings access

#### 5. **Account Settings** (`/account-settings`)
**3-Tab Layout:**

**Profile Tab:**
- Display name
- Email address
- Profile picture upload
- Account information

**Security Tab:**
- Email verification
- Password change
- Re-authentication dialog
- Security status indicators

**Danger Zone Tab:**
- Account deletion
- DELETE confirmation required
- Warning messages

#### 6. **About Page** (`/about`)
- Developer story (Heoster)
- Mission and vision
- Technology stack
- Open-source commitment
- Contact information
- Social media links

#### 7. **Documentation** (`/documentation`)
**Comprehensive guides:**
- Quick Start
- API Reference
- Model Comparison
- Feature Guides
- Integration Examples
- Troubleshooting

#### 8. **Pricing Page** (`/pricing`)
- Free tier (current)
- Future premium plans
- Feature comparison
- FAQ section

#### 9. **Models Page** (`/models`)
- Complete model list (35+ models)
- Provider information
- Capabilities comparison
- Speed benchmarks
- Context window sizes
- Pricing (all free currently)

#### 10. **Support Pages**
- **Contact** (`/contact`) - EmailJS integration
- **Privacy Policy** (`/privacy`) - GDPR compliant
- **Terms of Service** (`/terms`) - Legal terms
- **FAQ** - Common questions

---

## 🎨 Design System

### Color Palette
- **Primary:** Blue gradient (#3b82f6 to #8b5cf6)
- **Background:** Dark mode (#0a0a0a)
- **Cards:** Semi-transparent with blur
- **Accents:** Purple, cyan, pink gradients

### Typography
- **Font:** Inter (system font stack)
- **Headings:** Bold, gradient text effects
- **Body:** Regular, high contrast

### Components (shadcn/ui)
- Button, Input, Textarea
- Dialog, Sheet, Popover
- Card, Badge, Avatar
- Dropdown, Select, Tabs
- Toast notifications
- Loading spinners

### Animations
- Fade in/out
- Slide transitions
- Gradient animations
- Pulse effects
- Smooth scrolling

---

## 🚀 Key Features

### 1. Multi-Model AI Chat
**35+ Models Available:**
- Groq: llama-3.3-70b, mixtral-8x7b, gemma-2-9b, llama-3.1-8b
- Google: gemini-1.5-flash, gemini-2.5-pro, gemini-2.0-flash
- Cerebras: llama3.1-8b, gpt-oss-120b
- HuggingFace: Various open-source models

**Auto-Routing Intelligence:**
- Coding queries → Specialized coding models
- Math problems → Math-optimized models
- General chat → Conversational models
- Multimodal → Vision-capable models

### 2. SOHAM Image Generation Pipeline
**3-Step Process:**
1. **Prompt Enhancement** - Cerebras llama3.1-8b improves user prompt
2. **Image Generation** - HuggingFace FLUX.1-schnell creates image
3. **Response Formatting** - Returns markdown with image + download link

**Features:**
- Free unlimited generation
- Fast inference (5-10 seconds)
- High-quality outputs
- Style options (realistic, anime, sketch, artistic)
- Local storage (public/uploads/)
- Auto-cleanup after 1 hour

### 3. Video Generation (Veo 3.1)
**Google's Latest Video Model:**
- 5-second video clips
- Text-to-video generation
- High-quality output
- Stored locally
- Auto-cleanup

### 4. Voice Features

**Speech-to-Text (STT):**
- Primary: Groq Whisper V3 Turbo (fastest)
- Fallback: Groq Whisper V3 (most accurate)
- Browser Web Speech API (client-side fallback)
- Supports multiple languages
- Real-time transcription

**Text-to-Speech (TTS):**
- Primary: Groq PlayAI TTS 1.0
- Fallback: ElevenLabs (if configured)
- Fallback: Edge TTS
- Fallback: Browser TTS
- 6 voice options: alloy, echo, fable, onyx, nova, shimmer
- Speed control
- Inline playback in chat

### 5. Smart Intent Detection
**Automatic Query Classification:**
- WEB_SEARCH (70% confidence) - Falls back to conversation
- IMAGE_GENERATION (70% confidence) - Routes to SOHAM
- VIDEO_GENERATION (70% confidence) - Routes to Veo
- CODE_GENERATION (60% confidence) - Uses coding models
- EXPLANATION (60% confidence) - Uses teaching models
- CHAT (default) - Conversational response

**50+ Trigger Phrases:**
- Image: "generate image", "create picture", "draw", "paint"
- Video: "generate video", "create animation", "make video"
- Search: "search for", "look up", "find information"

### 6. Memory System (Optional)
**Vector-Based Memory:**
- Extracts key information from conversations
- Stores in Firebase Firestore
- Uses Google embeddings
- Recalls relevant memories in future chats
- Privacy-focused (user-specific)

**Configuration:**
- Disabled by default
- Enable via `ENABLE_MEMORY_SYSTEM=true`
- Requires Google API key
- Requires Firebase Firestore

### 7. Multimodal Capabilities
**Image Upload:**
- File picker integration
- Drag-and-drop support
- Camera capture
- Image analysis with vision models
- Max 20MB per image

**Audio Recording:**
- Real-time recording
- Waveform visualization
- Automatic transcription
- Multiple format support

### 8. Message Management
**Export Options:**
- PDF export with formatting
- Copy to clipboard
- Share to Twitter
- Share to LinkedIn
- Download as file

**Conversation Features:**
- Save conversations
- Load previous chats
- Delete conversations
- Search history
- Auto-save to localStorage

---

## 🔧 API Endpoints

### Chat & AI
- `POST /api/chat-direct` - Direct chat with model
- `POST /api/chat-direct-personality` - Chat with personality
- `POST /api/test-chat` - Test chat endpoint

### Media Generation
- `POST /api/generate-image` - SOHAM image generation
- `POST /api/generate-video` - Veo video generation
- `POST /api/upload-image` - Image upload handler

### Voice
- `POST /api/tts` - Text-to-speech (Groq PlayAI)
- `POST /api/transcribe` - Speech-to-text (Groq Whisper)

### Memory
- `POST /api/extract-memories` - Extract conversation memories

### Authentication
- `POST /api/auth/password-reset` - Send password reset email
- `POST /api/auth/verify-email` - Send verification email
- `POST /api/auth/change-email` - Change user email

### User Management
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile

### Utilities
- `GET /api/health` - Health check
- `POST /api/storage/cleanup` - Clean old files
- `GET /api/debug/errors` - Debug errors
- `GET /api/debug/providers` - Debug providers

---

## 🎯 User Experience Flow

### First-Time User Journey

1. **Landing** → User arrives at homepage
2. **Explore** → Sees features, models, developer info
3. **Try Chat** → Clicks "Start Chatting" or "Try for Free"
4. **Guest Mode** → Can use chat without login (limited)
5. **Sign Up** → Creates account for full features
6. **Welcome Email** → Receives automated welcome
7. **Dashboard** → Sees user-management page
8. **Chat** → Starts using AI with all features

### Returning User Journey

1. **Login** → Email/password or Google OAuth
2. **Dashboard** → User management page
3. **Chat** → Continues previous conversations
4. **Settings** → Adjusts preferences
5. **Features** → Uses image gen, voice, etc.

### Chat Interaction Flow

1. **Select Model** → Auto or manual selection
2. **Type/Speak** → Enter query via text or voice
3. **Intent Detection** → System classifies query
4. **Routing** → Routes to appropriate handler
5. **Processing** → Shows thinking animation
6. **Response** → Streams answer in real-time
7. **Actions** → Copy, share, speak, export
8. **Memory** → Extracts key info (if enabled)

---

## 💡 Best Practices for AI Responses

### When Users Ask About CodeEx

**DO:**
- Explain features clearly and concisely
- Mention it's free and open-source
- Highlight the 35+ models available
- Explain auto-routing benefits
- Show enthusiasm about the platform

**DON'T:**
- Claim features that don't exist
- Promise web search (it's removed)
- Guarantee 100% uptime
- Make false comparisons to paid services

### Feature Explanations

**Image Generation:**
"I can generate images using the SOHAM pipeline! Just describe what you want, and I'll create it using HuggingFace's FLUX.1 model. Try: 'generate an image of a sunset over mountains'"

**Voice Features:**
"I support voice input and output! Click the microphone to speak your question, or click the speaker icon on my responses to hear them aloud. I use Groq's Whisper and PlayAI models."

**Model Selection:**
"I have 35+ AI models available! You can let me auto-select the best one, or choose manually from the model selector. Different models excel at different tasks."

**Memory System:**
"I can remember important details from our conversations (if enabled). This helps me provide more personalized responses over time."

### Troubleshooting Guidance

**Common Issues:**
1. **API Errors** → Check API keys in .env.local
2. **404 Errors** → Clear cache: `npm run clear-cache`
3. **Build Errors** → Check TypeScript: `npm run typecheck`
4. **Image Gen Fails** → Check HuggingFace API key
5. **Voice Not Working** → Check Groq API key

**Quick Fixes:**
- Clear browser cache
- Restart dev server
- Check environment variables
- Review console errors
- Check API rate limits

---

## 🔐 Security & Privacy

### Authentication
- Firebase Authentication
- Email/password + Google OAuth
- Email verification required
- Password reset via email
- Secure session management

### Data Storage
- **Local Storage:** Conversation history (client-side)
- **Firebase Firestore:** User profiles, memories (optional)
- **Local Files:** Generated images/videos (auto-delete after 1 hour)
- **No tracking:** Privacy-focused, minimal analytics

### API Security
- Environment variables for keys
- CORS protection
- Rate limiting (planned)
- Input validation
- Error handling

---

## 📊 Performance Metrics

### Speed Benchmarks
- **Groq:** 500-800 tokens/second (fastest)
- **Cerebras:** 400-600 tokens/second
- **Google Gemini:** 100-200 tokens/second
- **Image Generation:** 5-10 seconds
- **Video Generation:** 30-60 seconds

### Limits (Free Tier)
- **Groq:** 14,400 requests/day
- **Google:** 60 requests/minute
- **HuggingFace:** Unlimited (rate-limited)
- **Cerebras:** Varies by model

---

## 🎓 Developer Information

### About Heoster (Harsh)
- **Age:** 16 years old
- **Location:** Khatauli, Uttar Pradesh, India
- **Email:** codeex@email.com
- **GitHub:** github.com/heoster
- **Mission:** Democratize AI access for everyone

### Friends & Testers
A dedicated group of friends who help test and provide valuable feedback:
- **Vidhan** - Early tester and feedback provider
- **Avineet** - User experience tester
- **Vansh** - Feature testing and suggestions
- **Aayush** - Platform testing and feedback
- **Varun** - Real-world usage testing
- **Pankaj** - Feature validation
- **Masum** - User perspective testing
- **Sachin** - Functionality testing
- **Pardhuman** - Platform feedback
- **Shivansh** - Feature exploration
- **Vaibhav** - User testing
- **Kartik** - Platform validation

These friends provide crucial non-technical user perspectives, helping ensure CodeEx is accessible and user-friendly for everyone, regardless of technical background.

### Tech Philosophy
- **Open Source:** All code publicly available
- **Free Forever:** Core features always free
- **Privacy First:** Minimal data collection
- **User Focused:** Built for real needs
- **Community Driven:** Open to contributions
- **Tested by Real Users:** Friends provide authentic feedback

---

## 🚀 Future Roadmap

### Planned Features
1. **Web Search Integration** - New provider (You.com removed)
2. **Advanced Memory System** - Better context retention
3. **Personality Customization** - Custom AI personalities
4. **Code Execution** - Run code in sandbox
5. **File Analysis** - PDF, DOCX, CSV support
6. **Team Collaboration** - Shared conversations
7. **API Access** - Developer API keys
8. **Mobile Apps** - iOS and Android

### Improvements
- Faster response times
- More models
- Better UI/UX
- Enhanced voice quality
- Improved image generation
- Video editing features

---

## 📝 How to Use This Knowledge

### As the AI Assistant

**When users ask "What can you do?":**
"I'm CodeEx AI! I can help you with:
- Chat using 35+ AI models (auto-selected or manual)
- Generate images with SOHAM pipeline
- Create videos with Google Veo
- Voice input/output with Groq Whisper & PlayAI
- Code, math, research, and general questions
- Remember our conversations (if memory enabled)

Try asking me to generate an image, solve a problem, or just chat!"

**When users ask "How do I...?":**
- Reference specific pages and features
- Provide step-by-step instructions
- Mention keyboard shortcuts
- Link to documentation
- Offer examples

**When users report issues:**
- Check common problems first
- Suggest cache clearing
- Verify API keys
- Check browser console
- Recommend testing scripts

---

## ✅ Quality Checklist

Before responding to users, ensure:
- [ ] Information is accurate and current
- [ ] Features mentioned actually exist
- [ ] Links and paths are correct
- [ ] Code examples are tested
- [ ] Security best practices followed
- [ ] Privacy considerations addressed
- [ ] Tone is helpful and friendly
- [ ] Response is concise and clear

---

**Last Updated:** 2024
**Version:** 2.0.0
**Status:** Production Ready ✅
