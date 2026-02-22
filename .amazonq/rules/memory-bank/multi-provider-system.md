# Multi-Provider AI System

## Overview
CODEEX AI implements a robust multi-provider system with automatic fallback to ensure high availability and reliability.

## Architecture

### Provider Adapters
Located in `src/ai/adapters/`:
- **HuggingFaceAdapter**: Primary and only provider using 100% free Hugging Face models (DialoGPT, FLAN-T5, DistilBERT, BlenderBot, BLOOM)

### Multi-Provider Router
Located in `src/ai/multi-provider-router.ts`:
- Automatic fallback across providers
- Intelligent model selection based on task category
- Error handling and retry logic
- Provider availability tracking

## Fallback Strategy

### 1. Model Selection Priority
```typescript
1. Preferred model (if specified by user)
2. Fallback model in same category
3. Default model from available providers
4. Any available model
```

### 2. Provider Fallback Order
```typescript
1. Hugging Face (100% free models - no paid alternatives)
```

### 3. Error Handling
- **Retryable Errors**: Rate limits, network issues, temporary unavailability
- **Non-Retryable Errors**: Authentication failures, invalid API keys
- **Automatic Provider Marking**: Failed providers marked as unavailable

## Enhanced Flows

### Summarization (`enhanced-summarize.ts`)
- Multi-provider support
- Style options: brief, detailed, bullets, eli5
- Automatic token limit adjustment based on text length
- Category: general

### Problem Solving (`enhanced-solve.ts`)
- Multi-provider support
- Tone options: helpful, formal, casual
- Technical level: beginner, intermediate, expert
- Category: math (with fallback to coding for code problems)

### Web Search (`enhanced-search.ts`)
- DuckDuckGo integration for privacy-focused search
- AI-powered answer synthesis
- Source citations
- Fallback to direct AI generation if search fails
- Category: general

### Image Problem Solver (`enhanced-image-solver.ts`)
- 5MB image support
- Automatic size validation
- OCR and problem recognition
- Step-by-step solutions
- Category: multimodal

### PDF Analyzer (`enhanced-pdf-analyzer.ts`)
- 5MB PDF support
- Automatic size validation
- Document comprehension
- Question answering
- Category: multimodal

## API Endpoints

### Endpoint Structure
All endpoints follow consistent pattern:
```typescript
POST /api/ai/{endpoint}
Content-Type: application/json

{
  "input": "...",
  "preferredModel": "optional",
  ...options
}
```

### Available Endpoints
1. `/api/ai/summarize` - Text summarization
2. `/api/ai/solve` - Problem solving
3. `/api/ai/search` - Web search with AI
4. `/api/ai/image-solver` - Image problem solving
5. `/api/ai/pdf-analyzer` - PDF document analysis

## Error Handling

### Client-Side
```typescript
try {
  const response = await fetch('/api/ai/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem: 'x^2 = 16' })
  });
  
  if (!response.ok) {
    const error = await response.json();
    // Handle error
  }
  
  const data = await response.json();
  // Use data.modelUsed to show which provider was used
} catch (error) {
  // Handle network error
}
```

### Server-Side
```typescript
// Automatic fallback in multi-provider-router.ts
1. Try preferred model
2. Try fallback models in same category
3. Try models from other providers
4. Return error only if all fail
```

## Configuration

### Environment Variables
```bash
# Hugging Face (Required - 100% FREE)
HUGGINGFACE_API_KEY=your_key
```

### Model Registry
Located in `src/lib/model-registry.ts`:
- Centralized model configuration
- Provider availability checking
- Model categorization
- Fallback model selection

## File Size Limits

### Images
- Maximum: 5MB
- Validation: Automatic in enhanced-image-solver.ts
- Error: Clear message with actual size

### PDFs
- Maximum: 5MB
- Validation: Automatic in enhanced-pdf-analyzer.ts
- Error: Clear message with actual size

## DuckDuckGo Integration

### Features
- Privacy-focused search
- No tracking
- Real-time results
- Source citations

### Implementation
Located in `src/lib/duckduckgo.ts`:
- Search query encoding
- Result parsing
- AI-friendly formatting
- Error handling with fallback

### Usage in Search Flow
```typescript
1. Try DuckDuckGo search
2. Format results for AI
3. Generate AI answer with sources
4. Fallback to direct AI if search fails
```

## Best Practices

### 1. Always Specify Category
```typescript
await generateWithFallback({
  prompt: '...',
  category: 'math', // Helps select optimal model
});
```

### 2. Handle All Error Cases
```typescript
try {
  const result = await enhancedSolve(input);
} catch (error) {
  // All providers failed
  // Show user-friendly error
}
```

### 3. Validate Input Size
```typescript
// For images and PDFs
if (file.size > 5 * 1024 * 1024) {
  throw new Error('File exceeds 5MB limit');
}
```

### 4. Use Preferred Model When Available
```typescript
const result = await enhancedSummarize({
  text: '...',
  preferredModel: 'huggingface/flan-t5-base', // Optional
});
```

## Monitoring

### Response Tracking
All responses include:
- `modelUsed`: Which model generated the response
- `attemptedProviders`: Which providers were tried (in router)
- `fallbackUsed`: Whether fallback was needed (in router)

### Logging
```typescript
console.error('Provider error:', error);
console.warn('Provider unavailable:', provider);
console.log('Using fallback model:', model);
```

## Future Enhancements
- [ ] Streaming responses
- [ ] Response caching
- [ ] Provider health monitoring
- [ ] Automatic provider rotation
- [ ] Usage analytics per provider
- [ ] Cost optimization
