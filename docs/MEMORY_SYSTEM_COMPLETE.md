# Memory System - Complete Implementation

## Overview

The CODEEX Memory System provides long-term memory capabilities using vector embeddings and Firestore. It automatically extracts, stores, and recalls important information from conversations to provide personalized, context-aware responses.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY SYSTEM FLOW                        │
└─────────────────────────────────────────────────────────────┘

STEP 3: MEMORY RECALL (Before Response)
┌──────────────────────────────────────────────────────────┐
│ 1. User sends message                                     │
│ 2. Generate embedding (gemini-embedding-001)             │
│ 3. Search Firestore for similar memories (cosine sim)   │
│ 4. Inject top 5 memories into system prompt             │
│ 5. Generate response with memory context                │
└──────────────────────────────────────────────────────────┘

STEP 7: MEMORY EXTRACTION (After Response)
┌──────────────────────────────────────────────────────────┐
│ 1. Response sent to user                                 │
│ 2. Extract memories (Cerebras llama3.3-70b)            │
│ 3. Generate embeddings for each memory                  │
│ 4. Classify and score memories                          │
│ 5. Store in Firestore with metadata                     │
└──────────────────────────────────────────────────────────┘
```

## Components

### 1. Memory System Service (`memory-system-service.ts`)
Core service for memory storage and retrieval.

**Features:**
- Generate embeddings using `gemini-embedding-001`
- Store memories in Firestore with vector data
- Perform similarity search (cosine similarity)
- Categorize memories (PREFERENCE, FACT, CONTEXT, SKILL, CONVERSATION)
- Assign importance scores (0-1 range)
- Track access count and timestamps
- Prune old memories and consolidate duplicates

**Key Methods:**
```typescript
// Store a new memory
await memorySystem.storeMemory(userId, content, {
  category: 'PREFERENCE',
  importance: 0.8,
  tags: ['coding', 'python'],
});

// Search for relevant memories
const results = await memorySystem.searchMemories({
  userId: 'user123',
  queryText: 'What do I prefer for coding?',
  topK: 5,
  minSimilarity: 0.7,
});

// Inject memories into prompt
const enhancedPrompt = memorySystem.injectMemoriesIntoPrompt(
  originalPrompt,
  results
);
```

### 2. Memory Extraction Service (`memory-extraction-service.ts`)
Handles automatic memory extraction after conversations.

**Features:**
- Extract memories using Cerebras llama3.3-70b
- Classify memory types automatically
- Calculate importance scores
- Extract relevant tags
- Store with embeddings

**Usage:**
```typescript
const memoryService = getMemoryExtractionService();

await memoryService.extractAndStore({
  userMessage: 'I prefer Python for backend development',
  assistantResponse: 'Great choice! Python is excellent for backend...',
  userId: 'user123',
});
```

### 3. Memory Extraction API (`/api/extract-memories`)
REST endpoint for asynchronous memory extraction.

**Request:**
```json
POST /api/extract-memories
{
  "userMessage": "I'm working on a React project",
  "assistantResponse": "That's great! React is...",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "extracted": 2,
  "message": "Extracted and stored 2 memories"
}
```

### 4. Integration in Chat Flow

**Memory Recall (STEP 3):**
- Integrated in `generate-answer-from-context.ts` (lines 100-130)
- Automatically searches for relevant memories when `userId` is provided
- Injects memories into system prompt before generating response

**Memory Extraction (STEP 7):**
- Integrated in `chat-panel.tsx`
- Called asynchronously after response is sent (non-blocking)
- Extracts and stores memories in background

## Memory Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **PREFERENCE** | User preferences and likes | "Prefers dark mode", "Likes concise responses" |
| **FACT** | Factual information about user | "Name is Alex", "Works as software engineer" |
| **CONTEXT** | Current context and projects | "Working on React project", "Learning TypeScript" |
| **SKILL** | User skills and expertise | "Expert in Python", "Knows Docker" |
| **CONVERSATION** | Important conversation snippets | "Discussed API design patterns" |

## Importance Scoring

Memories are scored from 0.0 to 1.0 based on:

- **High (0.8-1.0)**: Personal information (name, email, location)
- **Medium-High (0.6-0.8)**: Preferences and skills
- **Medium (0.4-0.6)**: Current context and projects
- **Low (0.2-0.4)**: General facts and interests

## Firestore Schema

```typescript
// Collection: memories
{
  id: string;                    // Unique memory ID
  userId: string;                // User ID
  content: string;               // Memory content
  embedding: number[];           // Vector embedding (768 dimensions)
  metadata: {
    category: MemoryCategory;    // PREFERENCE | FACT | CONTEXT | SKILL | CONVERSATION
    importance: number;          // 0.0 - 1.0
    tags: string[];              // ['python', 'coding', 'backend']
    relatedMemoryIds?: string[]; // Related memory IDs
  };
  createdAt: Timestamp;          // Creation timestamp
  lastAccessed: Timestamp;       // Last access timestamp
  accessCount: number;           // Number of times recalled
}
```

## Configuration

### Environment Variables

```bash
# Enable memory system
ENABLE_MEMORY_SYSTEM=true

# Required for embeddings and memory extraction
GOOGLE_API_KEY=your_google_api_key
CEREBRAS_API_KEY=your_cerebras_api_key

# Firebase configuration (required)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

### Firebase Setup

1. **Enable Firestore:**
   - Go to Firebase Console → Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

2. **Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Memories collection
    match /memories/{memoryId} {
      // Users can only read/write their own memories
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Allow creation if userId matches auth
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Usage Examples

### Enable Memory System

```typescript
// In .env.local
ENABLE_MEMORY_SYSTEM=true
GOOGLE_API_KEY=your_key
CEREBRAS_API_KEY=your_key
```

### Manual Memory Storage

```typescript
import { getMemorySystemService } from '@/lib/memory-system-service';

const memorySystem = getMemorySystemService();

// Store a preference
await memorySystem.storeMemory('user123', 'User prefers dark mode', {
  category: 'PREFERENCE',
  importance: 0.7,
  tags: ['ui', 'preference'],
});

// Store a skill
await memorySystem.storeMemory('user123', 'User is expert in Python', {
  category: 'SKILL',
  importance: 0.9,
  tags: ['python', 'programming', 'skill'],
});
```

### Search Memories

```typescript
// Search for coding-related memories
const results = await memorySystem.searchMemories({
  userId: 'user123',
  queryText: 'What programming languages do I know?',
  topK: 5,
  minSimilarity: 0.7,
  categories: ['SKILL', 'PREFERENCE'],
});

results.forEach(result => {
  console.log(`[${result.similarity.toFixed(2)}] ${result.memory.content}`);
});
```

### Automatic Extraction

Memory extraction happens automatically after each conversation when:
1. `ENABLE_MEMORY_SYSTEM=true`
2. User is authenticated (`userId` available)
3. Cerebras API key is configured

No manual intervention needed!

## Performance Considerations

### Embedding Generation
- **Model**: `gemini-embedding-001` (768 dimensions)
- **Speed**: ~100-200ms per embedding
- **Cost**: Free tier (60 requests/minute)

### Memory Search
- **Algorithm**: Cosine similarity
- **Complexity**: O(n) where n = number of user memories
- **Optimization**: Limit search to recent 50 memories
- **Future**: Use Firebase Extensions for vector search

### Memory Extraction
- **Model**: Cerebras llama3.3-70b
- **Speed**: ~500-1000ms per extraction
- **Async**: Non-blocking (runs after response sent)

## Maintenance Operations

### Prune Old Memories

```typescript
// Delete memories not accessed in 90 days
const deleted = await memorySystem.pruneOldMemories('user123', 90);
console.log(`Deleted ${deleted} old memories`);
```

### Consolidate Duplicates

```typescript
// Merge similar memories (similarity > 0.9)
await memorySystem.consolidateMemories('user123');
```

### Delete All User Memories (GDPR)

```typescript
// Delete all memories for a user
const count = await memorySystem.deleteAllUserMemories('user123');
console.log(`Deleted ${count} memories`);
```

## Testing

### Test Memory Storage

```bash
# Start development server
npm run dev

# Enable memory system in .env.local
ENABLE_MEMORY_SYSTEM=true

# Have a conversation
# Check Firestore Console → memories collection
```

### Test Memory Recall

```typescript
// In browser console
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What do you remember about me?',
    userId: 'your-user-id',
  }),
});
```

### Test Memory Extraction

```bash
# Check server logs for:
[Memory Extraction] Processing conversation for user: user123
[Memory Extraction] Extracted 2 memories
[Memory Extraction] Stored: User prefers Python for backend...
```

## Troubleshooting

### No Memories Being Stored

1. Check `ENABLE_MEMORY_SYSTEM=true` in `.env.local`
2. Verify `CEREBRAS_API_KEY` is set
3. Check server logs for extraction errors
4. Verify Firebase Firestore is enabled

### No Memories Being Recalled

1. Check `GOOGLE_API_KEY` is set (for embeddings)
2. Verify `userId` is being passed to API
3. Check Firestore security rules allow read access
4. Verify memories exist in Firestore console

### Embedding Errors

```
Error: GOOGLE_AI_API_KEY not configured
```

**Solution**: Set `GOOGLE_API_KEY` in `.env.local`

### Extraction Errors

```
Error: Cerebras API error: 401 Unauthorized
```

**Solution**: Verify `CEREBRAS_API_KEY` is valid

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic memory storage and retrieval
- ✅ Vector embeddings with Gemini
- ✅ Automatic extraction with Cerebras
- ✅ Cosine similarity search

### Phase 2 (Planned)
- 🔄 Firebase Extensions for vector search
- 🔄 Memory importance decay over time
- 🔄 Memory clustering and relationships
- 🔄 User-controlled memory management UI

### Phase 3 (Future)
- ⏳ Multi-modal memories (images, code snippets)
- ⏳ Memory sharing between users (with permission)
- ⏳ Memory export/import (GDPR compliance)
- ⏳ Advanced memory analytics

## API Reference

### Memory System Service

```typescript
class MemorySystemService {
  // Storage
  storeMemory(userId: string, content: string, metadata: MemoryMetadata): Promise<MemoryEntry>
  updateMemory(memoryId: string, updates: Partial<MemoryEntry>): Promise<void>
  deleteMemory(memoryId: string): Promise<void>
  deleteAllUserMemories(userId: string): Promise<number>
  
  // Retrieval
  searchMemories(query: MemoryQuery): Promise<MemorySearchResult[]>
  getRecentMemories(userId: string, limit: number): Promise<MemoryEntry[]>
  getMemoriesByCategory(userId: string, category: MemoryCategory): Promise<MemoryEntry[]>
  
  // Utilities
  generateEmbedding(text: string): Promise<number[]>
  calculateSimilarity(embedding1: number[], embedding2: number[]): number
  injectMemoriesIntoPrompt(prompt: string, memories: MemorySearchResult[]): string
  
  // Maintenance
  pruneOldMemories(userId: string, olderThanDays: number): Promise<number>
  consolidateMemories(userId: string): Promise<void>
}
```

### Memory Extraction Service

```typescript
class MemoryExtractionService {
  extractAndStore(context: ConversationContext): Promise<number>
  isEnabled(): boolean
}
```

## Conclusion

The CODEEX Memory System provides a complete solution for long-term memory in AI conversations. It automatically extracts, stores, and recalls important information, making conversations more personalized and context-aware.

**Key Benefits:**
- 🧠 Personalized responses based on past conversations
- 🚀 Automatic extraction (no manual work)
- 🔒 Secure storage in Firebase
- ⚡ Fast similarity search
- 🎯 Smart importance scoring
- 🔄 Maintenance operations for data hygiene

For questions or issues, check the troubleshooting section or review the server logs.
