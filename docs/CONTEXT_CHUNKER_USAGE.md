# Context Chunker Service Usage Guide

## Overview

The Context Chunker Service automatically handles requests that exceed the 1M token context window by intelligently splitting content into manageable chunks, processing them, and synthesizing the results.

## Features

- **Automatic Token Counting**: Uses tiktoken (GPT-4 encoding) for accurate token estimation
- **Three Chunking Strategies**:
  - `SLIDING_WINDOW`: Fixed-size chunks with overlap (default)
  - `SEMANTIC`: Chunks at natural paragraph boundaries
  - `HIERARCHICAL`: Chunks at section/subsection boundaries
- **Intelligent Strategy Selection**: Automatically selects the best strategy based on content type
- **Overlap Support**: Maintains context continuity between chunks
- **Response Synthesis**: Combines chunk responses into coherent output

## Installation

The service requires the `tiktoken` package:

```bash
npm install tiktoken
```

## Basic Usage

```typescript
import { getContextChunker } from '@/lib/context-chunker-service';
import type { GenerateRequest } from '@/ai/adapters/types';

// Get singleton instance
const chunker = getContextChunker();

// Create a request
const request: GenerateRequest = {
  model: myModel,
  prompt: 'Your very long prompt here...',
  history: conversationHistory,
};

// Check if chunking is needed
if (chunker.shouldChunk(request)) {
  console.log('Request exceeds 1M tokens, chunking required');
  
  // Select optimal strategy
  const strategy = chunker.selectOptimalStrategy(request);
  console.log(`Using ${strategy.type} strategy`);
  
  // Chunk the request
  const chunked = chunker.chunkRequest(request, strategy);
  console.log(`Created ${chunked.chunks.length} chunks`);
  
  // Process chunks (integrate with your router)
  const result = await chunker.processChunks(chunked);
  console.log(`Synthesized response: ${result.synthesizedResponse}`);
  console.log(`Total processing time: ${result.totalProcessingTime}ms`);
} else {
  // Process normally without chunking
  console.log('Request is within context window');
}
```

## Token Counting

```typescript
const chunker = getContextChunker();

// Estimate tokens for any text
const text = 'Your text here...';
const tokenCount = chunker.estimateTokenCount(text);
console.log(`Estimated tokens: ${tokenCount}`);
```

## Chunking Strategies

### SLIDING_WINDOW

Best for: Unstructured content, code, mixed content

```typescript
const strategy = {
  type: 'SLIDING_WINDOW',
  chunkSize: 100_000,  // 100K tokens per chunk
  overlapSize: 5_000,  // 5K token overlap
};

const chunked = chunker.chunkRequest(request, strategy);
```

### SEMANTIC

Best for: Natural language, articles, documentation

```typescript
const strategy = {
  type: 'SEMANTIC',
  chunkSize: 100_000,
  overlapSize: 5_000,
};

const chunked = chunker.chunkRequest(request, strategy);
```

### HIERARCHICAL

Best for: Structured documents with headers, technical documentation

```typescript
const strategy = {
  type: 'HIERARCHICAL',
  chunkSize: 150_000,
  overlapSize: 10_000,
};

const chunked = chunker.chunkRequest(request, strategy);
```

## Automatic Strategy Selection

The service analyzes content to select the optimal strategy:

```typescript
const chunker = getContextChunker();
const strategy = chunker.selectOptimalStrategy(request);

// Strategy selection considers:
// - Content structure (headers, sections)
// - Presence of code blocks
// - Average paragraph length
// - Total token count
```

## Working with Chunks

### Chunk Structure

```typescript
interface RequestChunk {
  id: string;              // e.g., "chunk-0", "chunk-1"
  content: string;         // The chunk content
  tokenCount: number;      // Tokens in this chunk
  sequenceNumber: number;  // Order in sequence
  metadata: {
    startPosition: number;     // Token position in original
    endPosition: number;       // Token position in original
    hasOverlap: boolean;       // Whether chunk has overlap
    relatedChunkIds: string[]; // IDs of related chunks
  };
}
```

### Processing Chunks

```typescript
const chunked = chunker.chunkRequest(request, strategy);

// Process each chunk
for (const chunk of chunked.chunks) {
  console.log(`Processing chunk ${chunk.sequenceNumber}`);
  console.log(`Content: ${chunk.content.substring(0, 100)}...`);
  console.log(`Tokens: ${chunk.tokenCount}`);
  console.log(`Has overlap: ${chunk.metadata.hasOverlap}`);
}
```

## Response Synthesis

```typescript
// After processing chunks, synthesize responses
const responseChunks = [
  {
    chunkId: 'chunk-0',
    response: 'First part of response...',
    modelUsed: 'gemini-2.5-flash',
    processingTime: 1200,
  },
  {
    chunkId: 'chunk-1',
    response: 'Second part of response...',
    modelUsed: 'gemini-2.5-flash',
    processingTime: 1150,
  },
];

const synthesized = chunker.synthesizeResponses(responseChunks);
console.log(synthesized);
// Output: "First part of response...\n\nSecond part of response..."
```

## Integration with Router

```typescript
import { getContextChunker } from '@/lib/context-chunker-service';
import { getAdapter } from '@/ai/adapters';

async function processRequest(request: GenerateRequest) {
  const chunker = getContextChunker();
  
  // Check if chunking is needed
  if (!chunker.shouldChunk(request)) {
    // Process normally
    const adapter = getAdapter(request.model.provider);
    return await adapter.generate(request);
  }
  
  // Chunk and process
  const strategy = chunker.selectOptimalStrategy(request);
  const chunked = chunker.chunkRequest(request, strategy);
  
  console.log(`⚠️ Content chunked into ${chunked.chunks.length} parts`);
  
  const responseChunks = [];
  const adapter = getAdapter(request.model.provider);
  
  for (const chunk of chunked.chunks) {
    const chunkRequest = {
      ...request,
      prompt: chunk.content,
    };
    
    const startTime = Date.now();
    const response = await adapter.generate(chunkRequest);
    
    responseChunks.push({
      chunkId: chunk.id,
      response: response.text,
      modelUsed: response.modelUsed,
      processingTime: Date.now() - startTime,
    });
  }
  
  const synthesized = chunker.synthesizeResponses(responseChunks);
  
  return {
    text: synthesized,
    modelUsed: request.model.id,
    chunked: true,
    chunkCount: chunked.chunks.length,
  };
}
```

## Configuration

### Constants

```typescript
const MAX_CONTEXT_TOKENS = 1_000_000;  // 1M token threshold
const DEFAULT_CHUNK_SIZE = 100_000;    // 100K tokens per chunk
const DEFAULT_OVERLAP_SIZE = 5_000;    // 5K token overlap
```

### Custom Strategy

```typescript
// Create a custom strategy
const customStrategy = {
  type: 'SLIDING_WINDOW' as const,
  chunkSize: 50_000,   // Smaller chunks
  overlapSize: 2_500,  // Smaller overlap
};

const chunked = chunker.chunkRequest(request, customStrategy);
```

## Performance Considerations

### Token Counting Performance

- Token counting uses tiktoken (fast, accurate)
- Fallback to character-based estimation if encoding fails
- Approximate: 1 token ≈ 4 characters

### Memory Usage

- Large documents are processed in chunks to manage memory
- Encoder is reused across requests (singleton pattern)
- Call `disposeContextChunker()` to free resources when done

### Parallel Processing

```typescript
// TODO: Implement parallel chunk processing
// Current implementation processes chunks sequentially
// Future: Process chunks in parallel when rate limits allow
```

## Error Handling

```typescript
try {
  const chunker = getContextChunker();
  
  if (chunker.shouldChunk(request)) {
    const strategy = chunker.selectOptimalStrategy(request);
    const chunked = chunker.chunkRequest(request, strategy);
    const result = await chunker.processChunks(chunked);
    return result.synthesizedResponse;
  }
} catch (error) {
  console.error('Chunking error:', error);
  // Fallback to truncation or error message
  throw new Error('Failed to process large request');
}
```

## Cleanup

```typescript
import { disposeContextChunker } from '@/lib/context-chunker-service';

// When shutting down or no longer needed
disposeContextChunker();
```

## Testing

```typescript
import { ContextChunkerService } from '@/lib/context-chunker-service';

describe('Context Chunking', () => {
  let service: ContextChunkerService;
  
  beforeEach(() => {
    service = new ContextChunkerService();
  });
  
  afterEach(() => {
    service.dispose();
  });
  
  it('should chunk large content', () => {
    const largeContent = 'word '.repeat(1_000_000);
    const request = { model: mockModel, prompt: largeContent };
    
    expect(service.shouldChunk(request)).toBe(true);
    
    const strategy = service.selectOptimalStrategy(request);
    const chunked = service.chunkRequest(request, strategy);
    
    expect(chunked.chunks.length).toBeGreaterThan(1);
  });
});
```

## Best Practices

1. **Always check if chunking is needed** before processing
2. **Use automatic strategy selection** unless you have specific requirements
3. **Monitor chunk count** - too many chunks may indicate issues
4. **Warn users** when content is chunked (processing takes longer)
5. **Consider rate limits** when processing multiple chunks
6. **Implement retry logic** for failed chunks
7. **Cache results** when possible to avoid reprocessing

## Limitations

- Maximum context window: 1M tokens
- Sequential chunk processing (parallel processing planned)
- Response synthesis is simple concatenation (advanced synthesis planned)
- No automatic summarization of chunk responses

## Future Enhancements

- [ ] Parallel chunk processing with rate limit awareness
- [ ] Advanced response synthesis with summarization
- [ ] Chunk caching for repeated requests
- [ ] Progress callbacks for long-running operations
- [ ] Adaptive chunk sizing based on model performance
- [ ] Support for streaming chunk responses

## Related Documentation

- [Model Registry V3](./MODEL_REGISTRY_V3.md)
- [Intelligent Router](./INTELLIGENT_ROUTER.md)
- [Rate Limiter Service](./RATE_LIMITER.md)
- [Requirements Document](../.kiro/specs/codeex-v3-3-multi-model-router/requirements.md)
- [Design Document](../.kiro/specs/codeex-v3-3-multi-model-router/design.md)
