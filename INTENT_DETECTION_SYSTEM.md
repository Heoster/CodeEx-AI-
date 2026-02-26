# Intent Detection Brain System

## Overview

The Intent Detection Brain is an intelligent system that automatically detects user intent and routes requests to the appropriate service. Similar to the SOHAM image generation pipeline, it uses pattern matching and confidence scoring to understand what the user wants.

## Supported Intents

### 1. WEB_SEARCH
Automatically detects when users want to search the web.

**Trigger Phrases:**
- "search for latest AI news"
- "look up Python tutorials"
- "find information about Next.js 14"
- "what is the latest on climate change"
- "current news about technology"
- "web search quantum computing"
- "tell me about machine learning"
- "show me information on blockchain"
- "what's new with ChatGPT"
- "what's happening with Tesla"
- "today's news on AI"
- "breaking news about space"
- "latest updates on cryptocurrency"
- "recent trends in web development"
- "price of Bitcoin"
- "reviews of iPhone 15"
- "comparison of React vs Vue"
- "who is Elon Musk"
- "where is the Eiffel Tower"
- "when was JavaScript created"
- "why is Python popular"
- "how does blockchain work"

**Confidence Threshold:** 70%

**Routes to:** Conversational response (no web search provider configured)

---

### 2. IMAGE_GENERATION
Automatically detects when users want to generate images.

**Trigger Phrases:**
- "generate an image of a sunset"
- "create a picture of a mountain"
- "draw a cat"
- "make an illustration of a robot"
- "paint a landscape"
- "design a logo"
- "produce artwork of space"
- "realistic image of a car"
- "anime style character"
- "sketch of a building"
- "cartoon dog"
- "3d render of a house"
- "photorealistic portrait"
- "abstract art"
- "minimalist design"
- "vintage poster"
- "visualize a futuristic city"
- "show me an image of ocean waves"
- "I want to see a picture of northern lights"
- "a beautiful sunset over mountains"
- "a serene forest scene"
- "a bustling city at night"

**Confidence Threshold:** 70%

**Routes to:** SOHAM Image Pipeline (HuggingFace FLUX.1-schnell)

---

### 3. VIDEO_GENERATION
Automatically detects when users want to generate videos.

**Trigger Phrases:**
- "generate a video of waves crashing"
- "create an animation of a spinning cube"
- "make a video showing a sunset"
- "produce a clip of a flying bird"
- "animate a bouncing ball"
- "video of a rotating planet"
- "moving scene of clouds"
- "dynamic visualization of data"
- "flowing water animation"

**Confidence Threshold:** 70%

**Routes to:** Google Veo 3.1 Video Generation

---

### 4. CODE_GENERATION
Detects code-related requests.

**Trigger Phrases:**
- "write a function to sort an array"
- "create a React component"
- "generate a Python script"
- "make an API endpoint"
- "build a class for user management"
- "code a login form"
- "implement a binary search"
- "develop a REST API"
- "Python code for web scraping"
- "JavaScript function for validation"
- "TypeScript interface for user data"

**Confidence Threshold:** 60%

**Routes to:** Standard AI model (with code-optimized prompt)

---

### 5. EXPLANATION
Detects when users want explanations.

**Trigger Phrases:**
- "explain how React works"
- "describe the concept of recursion"
- "what is machine learning"
- "what are neural networks"
- "define blockchain"
- "clarify the difference between let and const"
- "how does async/await work"
- "why does JavaScript use prototypes"
- "tell me about quantum computing"
- "teach me about algorithms"
- "help me understand closures"

**Confidence Threshold:** 60%

**Routes to:** Standard AI model (with explanation-focused prompt)

---

### 6. CHAT (Default)
General conversation when no specific intent is detected.

**Confidence:** 100% (fallback)

**Routes to:** Standard AI model

---

## How It Works

### 1. Pattern Matching
The system uses regex patterns to match user input against known intent patterns.

### 2. Confidence Scoring
Each pattern has a weight (0.0 to 1.0) that determines confidence:
- **1.0** = Perfect match (e.g., "search for...")
- **0.9** = Strong match (e.g., "tell me about...")
- **0.8** = Good match (e.g., "what is the latest...")
- **0.7** = Moderate match (e.g., time-sensitive queries)
- **0.6** = Weak match (e.g., general questions)

### 3. Query Extraction
The system automatically extracts the relevant query from the user's message:
- Input: "search for latest AI news"
- Extracted: "latest AI news"

### 4. Routing
Based on intent and confidence, the request is routed to the appropriate service:
```
User Message → Intent Detector → Route to Service → Return Result
```

---

## Architecture

```
src/lib/intent-detector.ts
├── IntentDetector class
│   ├── detect() - Main detection method
│   ├── detectWebSearch() - Web search patterns
│   ├── detectImageGeneration() - Image gen patterns
│   ├── detectVideoGeneration() - Video gen patterns
│   ├── detectCodeGeneration() - Code patterns
│   └── detectExplanation() - Explanation patterns
└── getIntentDetector() - Singleton instance

src/ai/flows/process-user-message.ts
├── Step 1: Intent Detection
├── Step 2: Image Generation Routing
├── Step 3: Video Generation Routing
├── Step 4: Web Search Routing
└── Step 5: Standard AI Processing
```

---

## Benefits

1. **Natural Language Understanding**: Users don't need to use specific commands
2. **Automatic Routing**: System intelligently routes to the best service
3. **High Accuracy**: Confidence scoring ensures correct intent detection
4. **Extensible**: Easy to add new intents and patterns
5. **User-Friendly**: Works with natural conversational input

---

## Examples

### Web Search
```
User: "what's the latest news on AI?"
Intent: WEB_SEARCH (confidence: 0.9)
Query: "latest news on AI"
Route: You.com API
```

### Image Generation
```
User: "create a realistic image of a sunset over mountains"
Intent: IMAGE_GENERATION (confidence: 1.0)
Query: "sunset over mountains"
Route: SOHAM Pipeline → HuggingFace FLUX.1-schnell
```

### Video Generation
```
User: "generate a video of waves crashing on the beach"
Intent: VIDEO_GENERATION (confidence: 1.0)
Query: "waves crashing on the beach"
Route: Google Veo 3.1
```

### General Chat
```
User: "how are you today?"
Intent: CHAT (confidence: 1.0)
Query: "how are you today?"
Route: Standard AI Model
```

---

## Configuration

No configuration needed! The system works out of the box with intelligent defaults.

To adjust confidence thresholds, edit `src/ai/flows/process-user-message.ts`:

```typescript
// Current thresholds
if (intentResult.confidence > 0.7) { // Image/Video/Search
if (intentResult.confidence > 0.6) { // Code/Explanation
```

---

## Future Enhancements

- [ ] Add AUDIO_GENERATION intent
- [ ] Add DATA_ANALYSIS intent
- [ ] Add TRANSLATION intent
- [ ] Machine learning-based intent classification
- [ ] User feedback loop for improving accuracy
- [ ] Multi-language support
- [ ] Context-aware intent detection

---

## Testing

Test the intent detector with various phrases:

```bash
# Web Search
"search for Python tutorials"
"what's the latest on climate change"
"find information about Next.js"

# Image Generation
"generate an image of a sunset"
"create a realistic portrait"
"draw an anime character"

# Video Generation
"make a video of ocean waves"
"animate a spinning cube"

# Code
"write a function to sort an array"
"create a React component"

# Explanation
"explain how async/await works"
"what is machine learning"
```

---

## Status

✅ **IMPLEMENTED AND ACTIVE**

The Intent Detection Brain is fully integrated and running in production.
