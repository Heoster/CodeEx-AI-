# API Endpoints Documentation

## Overview
CODEEX AI provides RESTful API endpoints for AI-powered operations with automatic multi-provider fallback and robust error handling.

## Core Features
- **Multi-Provider Support**: Automatic fallback between Google AI, Hugging Face, and OpenRouter
- **Error Resilience**: If one provider fails, automatically tries alternative providers
- **5MB File Support**: Enhanced support for larger images and PDFs
- **DuckDuckGo Integration**: Privacy-focused web search with AI-powered summarization

## Available Endpoints

### 1. Summarization API
**Endpoint**: `POST /api/ai/summarize`

**Purpose**: Summarize text content with multiple style options

**Request Body**:
```json
{
  "text": "string (required)",
  "style": "brief | detailed | bullets | eli5 (optional)",
  "preferredModel": "string (optional)"
}
```

**Response**:
```json
{
  "summary": "string",
  "modelUsed": "string"
}
```

**Example Usage**:
```typescript
const response = await fetch('/api/ai/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Long text to summarize...',
    style: 'bullets'
  })
});
const data = await response.json();
```

### 2. Problem Solver API
**Endpoint**: `POST /api/ai/solve`

**Purpose**: Solve math problems, quizzes, coding challenges, and general questions

**Request Body**:
```json
{
  "problem": "string (required)",
  "tone": "helpful | formal | casual (optional)",
  "technicalLevel": "beginner | intermediate | expert (optional)",
  "preferredModel": "string (optional)"
}
```

**Response**:
```json
{
  "solution": "string",
  "modelUsed": "string"
}
```

**Example Usage**:
```typescript
const response = await fetch('/api/ai/solve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    problem: 'Solve: 2x + 5 = 15',
    technicalLevel: 'beginner'
  })
});
const data = await response.json();
```

### 3. Web Search API
**Endpoint**: `POST /api/ai/search`

**Purpose**: Search the web using DuckDuckGo and provide AI-powered answers with citations

**Request Body**:
```json
{
  "query": "string (required)",
  "preferredModel": "string (optional)"
}
```

**Response**:
```json
{
  "answer": "string",
  "sources": [
    {
      "title": "string",
      "url": "string",
      "snippet": "string"
    }
  ],
  "modelUsed": "string"
}
```

**Example Usage**:
```typescript
const response = await fetch('/api/ai/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'What is the latest news about AI?'
  })
});
const data = await response.json();
```

### 4. Image Problem Solver API
**Endpoint**: `POST /api/ai/image-solver`

**Purpose**: Solve problems from images (math equations, quizzes, etc.) - Supports up to 5MB

**Request Body**:
```json
{
  "imageDataUri": "string (required, data URI format)",
  "problemType": "math | quiz | general (optional)",
  "preferredModel": "string (optional)"
}
```

**Response**:
```json
{
  "recognizedContent": "string",
  "solution": "string",
  "isSolvable": "boolean",
  "modelUsed": "string"
}
```

**Example Usage**:
```typescript
// Convert image to data URI first
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = async (e) => {
  const response = await fetch('/api/ai/image-solver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageDataUri: e.target.result,
      problemType: 'math'
    })
  });
  const data = await response.json();
};

reader.readAsDataURL(file);
```

### 5. PDF Analyzer API
**Endpoint**: `POST /api/ai/pdf-analyzer`

**Purpose**: Analyze PDF documents and answer questions - Supports up to 5MB

**Request Body**:
```json
{
  "pdfDataUri": "string (required, data URI format)",
  "question": "string (required)",
  "preferredModel": "string (optional)"
}
```

**Response**:
```json
{
  "answer": "string",
  "modelUsed": "string"
}
```

**Example Usage**:
```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = async (e) => {
  const response = await fetch('/api/ai/pdf-analyzer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pdfDataUri: e.target.result,
      question: 'What is the main topic of this document?'
    })
  });
  const data = await response.json();
};

reader.readAsDataURL(file);
```

## Error Handling

### Standard Error Response
```json
{
  "error": "string"
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid input)
- `500`: Internal Server Error (AI service failure)

### Multi-Provider Fallback
All endpoints automatically handle provider failures:
1. Try preferred model (if specified)
2. Try fallback models in the same category
3. Try models from alternative providers
4. Return error only if all providers fail

### Example Error Handling
```typescript
try {
  const response = await fetch('/api/ai/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem: 'Solve x^2 = 16' })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    return;
  }
  
  const data = await response.json();
  console.log('Solution:', data.solution);
  console.log('Model used:', data.modelUsed);
} catch (error) {
  console.error('Network error:', error);
}
```

## Rate Limiting & Quotas
- Rate limits depend on the AI provider being used
- Automatic fallback to alternative providers when rate limits are hit
- No application-level rate limiting (relies on provider limits)

## Authentication
- Currently no authentication required for API endpoints
- Consider adding authentication for production deployments
- Firebase Auth can be integrated for user-specific rate limiting

## Best Practices

### 1. File Size Management
```typescript
// Check file size before upload (5MB limit)
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_SIZE) {
  alert('File size exceeds 5MB limit');
  return;
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/ai/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem: userInput })
    });
    const data = await response.json();
    // Handle response
  } finally {
    setLoading(false);
  }
};
```

### 3. Retry Logic
```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 400) throw new Error('Bad request');
      // Retry on 500 errors
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Integration with Existing Commands

### Slash Commands
The API endpoints integrate with existing slash commands:
- `/solve` → Uses `/api/ai/solve`
- `/summarize` → Uses `/api/ai/summarize`
- `/search` → Uses `/api/ai/search`

### Command Router Integration
```typescript
// In command-router.ts
if (command === '/solve') {
  const response = await fetch('/api/ai/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem: args })
  });
  return await response.json();
}
```

## Provider Configuration

### Required Environment Variables
```bash
# Hugging Face (Required - 100% FREE)
HUGGINGFACE_API_KEY=your_key_here
```

### Provider Priority
1. **Google AI** (Primary) - Most reliable, best for multimodal
2. **OpenRouter** (Secondary) - Access to multiple models
3. **Hugging Face** (Tertiary) - Open-source models

## Monitoring & Debugging

### Server-Side Logging
All endpoints log errors to console:
```typescript
console.error('Solve API error:', error);
```

### Client-Side Debugging
```typescript
// Enable verbose logging
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', requestBody);
  console.log('Response:', responseData);
  console.log('Model used:', responseData.modelUsed);
}
```

## Future Enhancements
- [ ] Add authentication and user-specific rate limiting
- [ ] Implement caching for repeated queries
- [ ] Add streaming responses for long-running operations
- [ ] Add webhook support for async processing
- [ ] Implement request queuing for high load
- [ ] Add analytics and usage tracking
