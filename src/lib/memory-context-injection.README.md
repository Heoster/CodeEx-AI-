# Memory Context Injection

## Overview

The Memory Context Injection feature automatically retrieves and injects relevant memories from previous interactions into the prompt context during request processing. This enables context-aware, personalized responses that remember user preferences, facts, and conversation history.

## Requirements Implemented

- **Requirement 7.7**: Inject relevant memories into prompt context
- **Requirement 7.12**: Continue without memory injection when system is unavailable
- **Requirement 12.7**: Handle memory system failures gracefully

## Architecture

### Integration Points

The memory context injection is integrated into the request processing flow at the following points:

1. **`generate-answer-from-context.ts`**: Main integration point where memories are retrieved and injected before model execution
2. **`process-user-message.ts`**: Passes userId from the request to enable memory retrieval
3. **`types.ts`**: Extended ProcessUserMessageInput to include optional userId field

### Flow Diagram

```
User Request (with userId)
    ↓
Check Feature Flag (ENABLE_MEMORY_SYSTEM)
    ↓
Search Memories (if enabled & userId present)
    ↓
Inject Memories into Prompt (if memories found)
    ↓
Continue with Enhanced Prompt
    ↓
Generate Response
```

## Configuration

### Feature Flag

The memory system is controlled by the `ENABLE_MEMORY_SYSTEM` environment variable:

```bash
# Enable memory system (default: false)
ENABLE_MEMORY_SYSTEM=true
```

### Memory Search Parameters

The following parameters are used for memory retrieval:

- **topK**: 5 (retrieve top 5 most relevant memories)
- **minSimilarity**: 0.7 (only include memories with >70% similarity)

These parameters can be adjusted in `generate-answer-from-context.ts` if needed.

## Usage

### Basic Usage

Memory injection happens automatically when:

1. The memory system is enabled (`ENABLE_MEMORY_SYSTEM=true`)
2. A userId is provided in the request
3. Relevant memories exist for the user

No additional code is required - the system handles everything automatically.

### Providing User ID

To enable memory injection, include the userId in your request:

```typescript
import { processUserMessage } from '@/ai/flows/process-user-message';

const result = await processUserMessage({
  message: 'How should I structure my React components?',
  history: [],
  settings: {
    model: 'auto',
    tone: 'helpful',
    technicalLevel: 'intermediate',
    enableSpeech: false,
    voice: 'Algenib',
  },
  userId: 'user123', // Include userId for memory injection
});
```

### Memory Format

Memories are injected into the prompt in the following format:

```
Context from previous interactions:
[Memory 1] (PREFERENCE, importance: 0.90): User prefers TypeScript over JavaScript
[Memory 2] (FACT, importance: 0.85): User is building a chat application
[Memory 3] (CONTEXT, importance: 0.80): User is using React with Next.js

Current request:
How should I structure my React components?
```

This format:
- Clearly separates memory context from the current request
- Includes memory metadata (category, importance)
- Numbers memories for easy reference
- Works with all AI providers (Groq, Cerebras, Google, Hugging Face)

## Error Handling

### Graceful Degradation

The memory system is designed to fail gracefully:

1. **Memory System Disabled**: Requests proceed normally without memory injection
2. **No User ID**: Requests proceed without memory injection
3. **Memory Search Fails**: Error is logged, request continues with original prompt
4. **No Memories Found**: Request continues with original prompt

### Error Logging

Memory system errors are logged with the `[Memory System]` prefix:

```typescript
// Success
console.log('[Memory System] Injected 3 relevant memories for user user123');

// No memories found
console.log('[Memory System] No relevant memories found for user user123');

// Error
console.warn('[Memory System] Failed to retrieve memories, continuing without memory context:', error);
```

## Performance

### Target Metrics

- **Memory Search**: <100ms (Requirement 13.10)
- **Memory Injection**: <10ms (formatting is fast)
- **Total Overhead**: <110ms

### Optimization

The memory system is optimized for performance:

1. **Vector Similarity Search**: Uses efficient cosine similarity calculation
2. **Top-K Retrieval**: Only retrieves the most relevant memories
3. **Similarity Threshold**: Filters out low-relevance memories
4. **Async Processing**: Memory retrieval doesn't block other operations

## Testing

### Unit Tests

Run the memory context injection tests:

```bash
npm test -- src/lib/memory-context-injection.test.ts
```

### Test Coverage

The test suite covers:

- Feature flag checking
- Memory injection with valid userId
- Handling missing userId
- Handling memory system failures
- Memory format validation
- Search parameter validation
- Error handling and logging

## Examples

See `memory-context-injection.example.ts` for comprehensive examples including:

1. Basic memory injection flow
2. Feature flag checking
3. Complete request processing
4. Category-specific memory retrieval
5. Handling missing user ID
6. Performance monitoring
7. Provider-specific formatting

## Integration with Other Components

### Memory System Service

The memory context injection uses the `MemorySystemService` for:

- **searchMemories()**: Retrieve relevant memories based on query
- **injectMemoriesIntoPrompt()**: Format memories for prompt injection

### Intelligent Router

The memory-enhanced prompt is passed to the intelligent router, which:

1. Classifies the request (with memory context)
2. Selects the optimal model
3. Executes the request with the enhanced prompt

### Safety Guard

The safety guard validates:

1. **Input**: Original user message (before memory injection)
2. **Output**: Model response (after generation)

Memory content is not separately validated, as it comes from the user's own history.

## Future Enhancements

Potential improvements for future versions:

1. **Dynamic topK**: Adjust number of memories based on context window
2. **Category Weighting**: Prioritize certain memory categories
3. **Temporal Decay**: Weight recent memories higher
4. **Cross-User Memories**: Share relevant memories across users (with privacy controls)
5. **Memory Summarization**: Compress multiple similar memories
6. **Provider-Specific Formatting**: Optimize format for each AI provider

## Troubleshooting

### Memory System Not Working

1. **Check Feature Flag**: Ensure `ENABLE_MEMORY_SYSTEM=true` in `.env.local`
2. **Check User ID**: Verify userId is being passed in the request
3. **Check Memories**: Verify memories exist for the user
4. **Check Logs**: Look for `[Memory System]` log messages

### No Memories Retrieved

1. **Check Similarity Threshold**: Memories may not meet 0.7 similarity threshold
2. **Check Memory Content**: Ensure memories are relevant to the query
3. **Check Embeddings**: Verify embeddings are being generated correctly

### Performance Issues

1. **Check Memory Count**: Large numbers of memories may slow search
2. **Check Embedding Generation**: Ensure embeddings are cached
3. **Check Firestore**: Verify Firestore queries are optimized

## Related Documentation

- [Memory System Service](./memory-system-service.README.md)
- [Intelligent Router Service](./intelligent-router-service.README.md)
- [Task Classifier Service](./task-classifier-service.README.md)
- [Safety Guard Service](./safety-guard-service.README.md)

## Support

For issues or questions about memory context injection:

1. Check the test suite for examples
2. Review the example file for usage patterns
3. Check the logs for error messages
4. Verify feature flag and configuration
