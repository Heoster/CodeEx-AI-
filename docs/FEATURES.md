# CODEEX AI - Complete Feature Documentation

## Table of Contents
1. [Multi-Model AI System](#multi-model-ai-system)
2. [Smart Auto-Routing](#smart-auto-routing)
3. [Chat Interface](#chat-interface)
4. [Slash Commands](#slash-commands)
5. [Web Search](#web-search)
6. [Visual Math Solver](#visual-math-solver)
7. [PDF Analyzer](#pdf-analyzer)
8. [Voice Features](#voice-features)
9. [Mobile Features](#mobile-features)
10. [Settings & Customization](#settings--customization)

---

## Multi-Model AI System

CODEEX AI supports 14+ AI models from multiple providers, giving you the flexibility to choose the best model for your task.

### Available Models

#### General Purpose Models
| Model | Provider | Description | Best For |
|-------|----------|-------------|----------|
| Gemini 2.5 Flash | Google AI | Fast, capable general model | Quick responses, general tasks |
| Gemini 1.5 Pro | Google AI | Advanced with 1M token context | Long documents, complex reasoning |
| Gemini 1.5 Flash | Google AI | Speed-optimized | Real-time applications |
| Gemini Pro | Google AI | Balanced performance | General use |
| Qwen 2.5 72B | Hugging Face | Multilingual, strong reasoning | Code, math, multiple languages |
| Llama 2 70B | Hugging Face | Strong analytical capabilities | Analysis, reasoning |

#### Coding Models
| Model | Provider | Description | Best For |
|-------|----------|-------------|----------|
| DeepSeek Coder 33B | Hugging Face | Superior code generation | Writing code, debugging |
| WizardCoder Python 34B | Hugging Face | Python-focused | Python development |

#### Math Models
| Model | Provider | Description | Best For |
|-------|----------|-------------|----------|
| WizardMath 70B | Hugging Face | Mathematical reasoning | Complex math problems |

#### Conversation Models
| Model | Provider | Description | Best For |
|-------|----------|-------------|----------|
| DialoGPT Large | Hugging Face | Optimized for dialogue | Casual conversation |
| BlenderBot 400M | Hugging Face | Lightweight chat | Quick responses |

#### Multimodal Models
| Model | Provider | Description | Best For |
|-------|----------|-------------|----------|
| Gemini Pro Vision | Google AI | Text and image understanding | Image analysis |
| Kosmos-2 | Hugging Face | Vision + language | Visual tasks |
| BLIP-2 | Hugging Face | Image understanding | Image descriptions |

### How to Select a Model

1. **Desktop**: Click the model dropdown in Settings
2. **Mobile**: Tap the model button to open the bottom sheet selector
3. **Auto Mode**: Select "Auto" to let the AI choose the best model

---

## Smart Auto-Routing

When you select "Auto" mode, CODEEX AI automatically analyzes your query and routes it to the most appropriate model.

### How It Works

1. **Query Classification**: Your message is analyzed for keywords and patterns
2. **Category Detection**: The system identifies if your query is about:
   - Coding (programming, debugging, algorithms)
   - Math (calculations, equations, statistics)
   - Conversation (greetings, casual chat)
   - Multimodal (images, visual content)
   - General (everything else)
3. **Model Selection**: The best available model for that category is selected
4. **Fallback**: If the preferred model is unavailable, a fallback is used

### Classification Patterns

**Coding Detection:**
- Keywords: code, function, debug, error, algorithm, API, database
- Languages: JavaScript, Python, TypeScript, Java, etc.
- Code blocks in messages

**Math Detection:**
- Keywords: calculate, solve, equation, formula, derivative
- Mathematical expressions: +, -, *, /, ^, =
- Math functions: sin, cos, log, sqrt

**Conversation Detection:**
- Greetings: hello, hi, hey, good morning
- Social phrases: how are you, thank you, please

### Model Attribution

Every AI response shows:
- **Model Name**: Which model generated the response
- **Category Icon**: Visual indicator of the model type
- **Auto Badge**: Shows if auto-routing was used
- **Reasoning**: Hover/tap for explanation of model selection

---

## Chat Interface

### Starting a Conversation

1. Log in to your account
2. Click "New Chat" or start typing
3. Your message is sent to the AI
4. Responses appear with model attribution

### Chat Features

- **Multiple Chats**: Create and switch between conversations
- **Chat History**: All messages are saved and searchable
- **Markdown Support**: AI responses support rich formatting
- **Code Highlighting**: Syntax highlighting for code blocks
- **LaTeX Math**: Mathematical equations rendered beautifully
- **Links**: Clickable links open in new tabs

### Message Types

- **User Messages**: Your messages appear on the right
- **AI Responses**: AI messages appear on the left with model info
- **System Messages**: Notifications and status updates

---

## Slash Commands

Use slash commands for specific tasks:

### /solve - Problem Solver
Solve math problems, equations, or coding challenges.

```
/solve x^2 + 5x + 6 = 0
/solve Write a function to reverse a string in Python
/solve What is the derivative of sin(x) * cos(x)?
```

**Features:**
- Step-by-step solutions
- LaTeX formatting for math
- Code with explanations
- Routes to math or coding models automatically

### /search - Web Search
Search the web for current information.

```
/search latest news on artificial intelligence
/search weather in New York today
/search how to deploy Next.js to Netlify
```

**Features:**
- DuckDuckGo primary search (privacy-focused)
- Google Search grounding fallback
- Source citations included
- Real-time information

### /summarize - Text Summarizer
Summarize long text or articles.

```
/summarize [paste your long text here]
```

**Features:**
- Concise summaries
- Key points extraction
- Maintains important details

---

## Web Search

CODEEX AI can search the web for current information.

### Search Providers

1. **DuckDuckGo** (Primary)
   - Privacy-focused
   - No tracking
   - Fast results

2. **Google Search Grounding** (Fallback)
   - Comprehensive results
   - Source citations
   - Used when DuckDuckGo fails

### How to Search

1. Use the `/search` command
2. Or ask questions that require current information
3. Results are summarized by the AI
4. Sources are cited when available

### Example Queries

```
/search What are the latest developments in AI?
/search Current stock price of Apple
/search Weather forecast for tomorrow
```

---

## Visual Math Solver

Upload images of handwritten or printed math problems for step-by-step solutions.

### How to Use

1. Navigate to Visual Math page
2. Upload an image or take a photo (mobile)
3. The AI recognizes the equation
4. Get step-by-step solution

### Supported Problems

- Algebraic equations
- Calculus (derivatives, integrals)
- Trigonometry
- Statistics
- Geometry
- Word problems

### Tips for Best Results

- Write clearly and legibly
- Good lighting for photos
- One problem per image works best
- Avoid blurry images

---

## PDF Analyzer

Upload PDF documents and ask questions about their content.

### How to Use

1. Navigate to PDF Analyzer page
2. Upload your PDF document
3. Ask questions about the content
4. Get AI-powered answers

### Features

- Text extraction from PDFs
- Question answering
- Summarization
- Key information extraction

### Supported Documents

- Research papers
- Reports
- Articles
- Manuals
- Any text-based PDF

---

## Voice Features

### Speech Input

1. Click the microphone icon in the chat input
2. Speak your message
3. Your speech is converted to text
4. Send the message

**Requirements:**
- Microphone permission
- Supported browser (Chrome, Edge, Safari)

### Speech Output

1. Enable "Speech Output" in Settings
2. Choose your preferred voice
3. AI responses are read aloud

**Available Voices:**
- Algenib (Female)
- Achernar (Female)
- Enceladus (Male)
- Heka (Male)

---

## Mobile Features

CODEEX AI is optimized for mobile devices, especially Android.

### Installation (Android)

1. Open in Chrome browser
2. Tap menu (⋮) → "Add to Home Screen"
3. App installs like a native app
4. Access from home screen

### Mobile-Specific Features

- **Bottom Sheet Model Selector**: Easy thumb access
- **Swipe Gestures**: Swipe down to dismiss dialogs
- **Touch-Friendly**: All buttons are 44x44px minimum
- **Camera Access**: Take photos for visual math
- **Offline Mode**: Works without internet
- **Responsive Design**: Adapts to any screen size

### Offline Capabilities

When offline, you can:
- View previous conversations
- Access the app interface
- Queue messages (sent when online)

---

## Settings & Customization

### AI Settings

| Setting | Options | Description |
|---------|---------|-------------|
| AI Model | Auto, or specific model | Choose which AI model to use |
| Tone | Helpful, Formal, Casual | Adjust response style |
| Technical Level | Beginner, Intermediate, Expert | Adjust complexity |

### Appearance

| Setting | Options | Description |
|---------|---------|-------------|
| Theme | Light, Dark, System | Color scheme |

### Voice Settings

| Setting | Options | Description |
|---------|---------|-------------|
| Speech Output | On/Off | Enable text-to-speech |
| Voice | 4 options | Choose voice for speech |

### How to Access Settings

1. Click the gear icon in the header
2. Adjust your preferences
3. Changes save automatically

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Send message |
| Shift + Enter | New line in message |
| Ctrl/Cmd + K | Focus search/input |

---

## Troubleshooting

### Common Issues

**AI not responding:**
- Check your internet connection
- Verify API keys are configured
- Try refreshing the page

**Model unavailable:**
- The selected model's provider may be down
- Try switching to a different model
- Use "Auto" mode for automatic fallback

**Voice not working:**
- Grant microphone permission
- Use a supported browser
- Check device microphone settings

**Images not uploading:**
- Check file size (max 10MB)
- Use supported formats (PNG, JPG, WEBP)
- Grant camera/storage permissions on mobile

---

## Support

For help and support:
- Email: codeex@email.com
- GitHub Issues: Report bugs and request features
- In-app Contact: Use the Contact page

---

*Documentation last updated: December 2024*
