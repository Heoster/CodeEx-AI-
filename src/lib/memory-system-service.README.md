# Memory System Service

Vector-based memory storage using Google embeddings and Firestore for context-aware AI responses.

## Overview

The Memory System Service provides intelligent memory storage and retrieval for the CODEEX V3.3 Multi-Model AI Router. It uses Google's `gemini-embedding-001` model to generate vector embeddings and stores them in Firestore for efficient similarity search.

## Features

- **Vector Embeddings**: Generate embeddings using gemini-embedding-001
- **Similarity Search**: Find relevant memories using cosine similarity
- **Memory Categories**: Organize memories into 5 categories (PREFERENCE, FACT, CONTEXT, SKILL, CONVERSATION)
- **Importance Scoring**: Assign importance scores (0-1 range) to prioritize memories
- **Access Tracking**: Track access count and last accessed timestamp
- **Context Injection**: Automatically inject relevant memories into prompts
- **Memory Maintenance**: Prune old memories and consolidate duplicates
- **GDPR Compliance**: Complete user data deletion support

## Requirements

This implementation satisfies the following requirements:
- **7.1**: Store important information as memory entries
- **7.2**: Generate embeddings using gemini-embedding-001
- **7.3**: Store memory entries in Firestore with vector data
- **7.8**: Categorize memories (PREFERENCE, FACT, CONTEXT, SKILL, CONVERSATION)
- **7.9**: Assign importance scores (0-1 range)
- **7.11**: Track access count and last accessed timestamp

## Installation

The service is already integrated into the project. Ensure you have:

1. Firebase configured in `src/lib/firebase.ts`
2. Google AI API key in environment variables (`GOOGLE_AI_API_KEY`)
3. Firestore rules updated to allow memory collection access

## Usage

### Basic Usage

```typescript
import { getMemorySystemService } from './lib/memory-system-service';

const memoryService = getMemorySystemService();
```

### Store a Memory

```typescript
const memory = await memoryService.storeMemory(
  'user123',
  'User prefers concise responses',
  {
    category: 'PREFERENCE',
    importance: 0.9,
    tags: ['response-style', 'concise'],
  }
);
```

### Search for Relevant Memories

```typescript
const results = await memoryService.searchMemories({
  userId: 'user123',
  queryText: 'How should I format my responses?',
  topK: 5,
  minSimilarity: 0.5,
});

results.forEach(result => {
  console.log(`Similarity: ${result.similarity}`);
  console.log(`Content: ${result.memory.content}`);
});
```

### Inject Memories into Prompt

```typescript
const results = await memoryService.searchMemories({
  userId: 'user123',
  queryText: 'Help me with React',
  topK: 3,
});

const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
  'How do I implement authentication in React?',
  results
);
```

### Get Recent Memories

```typescript
const recentMemories = await memoryService.getRecentMemories('user123', 10);
```

### Get Memories by Category

```typescript
const preferences = await memoryService.getMemoriesByCategory(
  'user123',
  'PREFERENCE'
);
```

### Update a Memory

```typescript
await memoryService.updateMemory(memoryId, {
  metadata: {
    category: 'PREFERENCE',
    importance: 0.95,
    tags: ['updated-tag'],
  },
});
```

### Delete a Memory

```typescript
await memoryService.deleteMemory(memoryId);
```

### Delete All User Memories (GDPR-Compliant)

```typescript
// Delete all memories for a user (for GDPR data deletion requests)
const deletedCount = await memoryService.deleteAllUserMemories('user123');
console.log(`Deleted ${deletedCount} memories`);
```

### Maintenance Operations

```typescript
// Prune memories not accessed in 90 days
const deletedCount = await memoryService.pruneOldMemories('user123', 90);

// Consolidate duplicate memories
await memoryService.consolidateMemories('user123');
```

## Memory Categories

| Category | Description | Example |
|----------|-------------|---------|
| `PREFERENCE` | User preferences and settings | "Prefers concise responses" |
| `FACT` | Factual information about the user | "Works as a software engineer" |
| `CONTEXT` | Contextual information | "Working on a Next.js project" |
| `SKILL` | User skills and expertise | "Expert in TypeScript" |
| `CONVERSATION` | Important conversation snippets | "Previously discussed authentication" |

## Memory Metadata

Each memory has metadata with the following fields:

```typescript
interface MemoryMetadata {
  category: MemoryCategory;
  importance: number;           // 0-1 score
  tags: string[];
  relatedMemoryIds?: string[];
}
```

### Importance Scoring Guidelines

- **0.9-1.0**: Critical preferences or facts (e.g., "User is allergic to X")
- **0.7-0.9**: Important preferences or context (e.g., "Prefers TypeScript")
- **0.5-0.7**: Useful context or skills (e.g., "Working on React project")
- **0.3-0.5**: Minor preferences or conversation snippets
- **0.0-0.3**: Low-priority information

## Similarity Search

The service uses cosine similarity to find relevant memories:

1. Generate embedding for the query text
2. Calculate cosine similarity with all user memories
3. Filter by minimum similarity threshold (default: 0.5)
4. Calculate relevance score (70% similarity + 30% importance)
5. Return top K results sorted by relevance

### Similarity Thresholds

- **0.9-1.0**: Highly similar (near-duplicate)
- **0.7-0.9**: Very relevant
- **0.5-0.7**: Moderately relevant
- **0.3-0.5**: Somewhat relevant
- **0.0-0.3**: Low relevance

## Context Injection

The `injectMemoriesIntoPrompt` method formats memories for inclusion in prompts:

```
Context from previous interactions:
[Memory 1] (PREFERENCE, importance: 0.90): User prefers concise responses
[Memory 2] (SKILL, importance: 0.85): User is expert in TypeScript
[Memory 3] (CONTEXT, importance: 0.75): User is working on a Next.js project

Current request:
How do I implement authentication in my app?
```

## Performance

- **Embedding Generation**: ~200-500ms per request
- **Similarity Search**: <100ms for up to 1000 memories
- **Storage**: ~1KB per memory entry (including embedding)

## Firestore Schema

```typescript
{
  id: string;                    // Unique memory ID
  userId: string;                // User ID
  content: string;               // Memory content
  embedding: number[];           // Vector embedding (768 dimensions)
  metadata: {
    category: string;            // Memory category
    importance: number;          // 0-1 score
    tags: string[];              // Tags for filtering
    relatedMemoryIds?: string[]; // Related memory IDs
  };
  createdAt: Timestamp;          // Creation timestamp
  lastAccessed: Timestamp;       // Last access timestamp
  accessCount: number;           // Access count
}
```

## Security

Firestore rules ensure:
- Users can only access their own memories
- Memory content is limited to 5000 characters
- Importance scores are validated (0-1 range)
- Category values are validated against allowed types

### GDPR Compliance

The service supports GDPR-compliant data deletion:
- `deleteAllUserMemories(userId)` removes all memories for a user
- Returns count of deleted memories for audit purposes
- Ensures complete data removal with no traces left
- Can be used to fulfill "right to be forgotten" requests

## Error Handling

The service handles errors gracefully:

```typescript
try {
  const memory = await memoryService.storeMemory(userId, content, metadata);
} catch (error) {
  if (error.message.includes('GOOGLE_AI_API_KEY')) {
    // API key not configured
  } else if (error.message.includes('Embedding generation failed')) {
    // Embedding API error
  } else {
    // Other errors (Firestore, network, etc.)
  }
}
```

## Best Practices

1. **Store Selectively**: Only store important information, not every conversation
2. **Use Appropriate Categories**: Choose the right category for each memory
3. **Set Importance Scores**: Assign meaningful importance scores
4. **Add Tags**: Use tags for better organization and filtering
5. **Regular Maintenance**: Periodically prune old memories and consolidate duplicates
6. **Handle Failures**: Gracefully handle memory system failures (system should continue without memories)

## Integration with Router

The Memory System Service integrates with the AI router to provide context-aware responses:

```typescript
// 1. Search for relevant memories
const memories = await memoryService.searchMemories({
  userId,
  queryText: userMessage,
  topK: 3,
  minSimilarity: 0.5,
});

// 2. Inject into prompt
const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
  userMessage,
  memories
);

// 3. Send to AI model
const response = await generateResponse(enhancedPrompt);

// 4. Store important information from response
if (shouldStoreAsMemory(response)) {
  await memoryService.storeMemory(userId, extractMemory(response), {
    category: 'CONVERSATION',
    importance: 0.6,
    tags: ['conversation'],
  });
}
```

## Feature Flag

The memory system can be disabled via the `ENABLE_MEMORY_SYSTEM` environment variable:

```typescript
const ENABLE_MEMORY_SYSTEM = process.env.ENABLE_MEMORY_SYSTEM === 'true';

if (ENABLE_MEMORY_SYSTEM) {
  // Use memory system
} else {
  // Skip memory operations
}
```

## Examples

See `src/lib/memory-system-service.example.ts` for comprehensive usage examples.

## Testing

The service includes methods for testing:

```typescript
import { resetMemorySystemService } from './lib/memory-system-service';

// Reset singleton for testing
resetMemorySystemService();
```

## Future Enhancements

- **Semantic Chunking**: Split long memories into smaller chunks
- **Memory Clustering**: Group related memories automatically
- **Temporal Decay**: Reduce importance of old memories over time
- **Cross-User Insights**: Aggregate anonymized patterns across users
- **Multi-Modal Memories**: Store image and audio memories
- **Memory Graphs**: Build knowledge graphs from memories

## References

- [Google AI Embeddings API](https://ai.google.dev/docs/embeddings_guide)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Vector Databases](https://www.pinecone.io/learn/vector-database/)
