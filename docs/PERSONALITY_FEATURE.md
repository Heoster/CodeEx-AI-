# CodeEx AI Personality Feature

## Overview

The Personality Feature enables CodeEx AI to provide more natural, context-aware interactions by:
- Matching the user's communication style
- Remembering relevant information across conversations
- Being direct and concise without filler phrases
- Maintaining continuity across devices

## Behavioral Rules

### 1. Communication Style Matching
The AI automatically detects and adapts to your communication style:
- **Direct**: Short, to-the-point responses
- **Detailed**: Comprehensive explanations with examples
- **Casual**: Conversational and relaxed tone
- **Technical**: Precise terminology and technical depth

### 2. Memory Integration
The AI remembers:
- Your preferences (e.g., "I prefer TypeScript over JavaScript")
- Facts about you (e.g., "I work as a backend developer")
- Your skills (e.g., "I know React and Node.js")
- Context from previous conversations

Memories are used naturally without announcing them (no "I recall from my memory").

### 3. Directness
No filler phrases like:
- ❌ "Great question!"
- ❌ "I'd be happy to help!"
- ❌ "Let me explain..."
- ✅ Just direct answers

### 4. Ambiguity Handling
If your message is unclear, the AI asks ONE specific clarifying question instead of guessing.

### 5. Continuity
The AI is one continuous intelligence across all devices. It shares memory and context seamlessly.

### 6. Natural Learning
When the AI learns something new about you, it integrates it naturally without announcing "I'll remember that."

### 7. Response Length
Responses are concise by default. Detailed explanations are provided only when:
- You explicitly ask for detail
- The topic requires comprehensive coverage
- Your profile indicates a preference for detailed responses

### 8. Honesty
If the AI doesn't know something, it says so immediately. No hedging or lengthy disclaimers.

## API Usage

### Enable Personality Feature

```javascript
const response = await fetch('/api/chat-direct', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Your message here',
    userId: 'user123', // Required for personality features
    enablePersonality: true, // Default: true
    history: [],
    settings: {
      model: 'auto',
      tone: 'helpful',
      technicalLevel: 'intermediate',
      enableSpeech: false,
      voice: 'Algenib'
    }
  })
});
```

### Manage User Profile

#### Get Profile
```javascript
const response = await fetch('/api/profile?userId=user123');
const { profile } = await response.json();
```

#### Update Profile
```javascript
const response = await fetch('/api/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    communicationStyle: 'technical', // 'direct' | 'detailed' | 'casual' | 'technical'
    preferences: {
      responseLength: 'concise', // 'concise' | 'balanced' | 'detailed'
      codeExamples: true,
      explanationStyle: 'advanced' // 'simple' | 'moderate' | 'advanced'
    }
  })
});
```

#### Clear Memories
```javascript
const response = await fetch('/api/profile?userId=user123&action=clearMemories', {
  method: 'DELETE'
});
```

#### Delete Profile
```javascript
const response = await fetch('/api/profile?userId=user123&action=deleteProfile', {
  method: 'DELETE'
});
```

## How It Works

### 1. Communication Style Detection
The AI analyzes your message to detect your communication style:
- **Word count**: Short messages → direct style
- **Sentence length**: Long sentences → detailed style
- **Technical jargon**: Code terms → technical style
- **Casual markers**: "hey", "cool", "thanks" → casual style

### 2. Memory Extraction
The AI automatically extracts memories from conversations:
- **Preferences**: "I prefer...", "I like...", "I always..."
- **Facts**: "I am...", "I work...", "I live..."
- **Skills**: "I know...", "I can...", "I'm familiar with..."

### 3. Memory Relevance
When you send a message, the AI:
1. Retrieves relevant memories based on keyword matching
2. Scores memories by relevance (0-1)
3. Includes top 5 most relevant memories in context
4. Uses them naturally in responses

### 4. Automatic Profile Updates
- First message: AI detects your communication style
- Subsequent messages: AI refines understanding
- Memories: Automatically extracted and stored (max 50)
- Old memories: Automatically pruned to keep most relevant

## Examples

### Example 1: Direct Style
**User**: "Fix this bug"
**AI**: "The issue is in line 23. Change `==` to `===` for strict equality."

### Example 2: Detailed Style
**User**: "Can you explain how async/await works in JavaScript?"
**AI**: "Async/await is syntactic sugar over Promises that makes asynchronous code look synchronous. Here's how it works:

1. The `async` keyword before a function makes it return a Promise
2. The `await` keyword pauses execution until the Promise resolves
3. Error handling uses try/catch blocks

Example:
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

This is cleaner than chaining `.then()` calls and makes error handling more intuitive."

### Example 3: Memory Usage
**User**: "I prefer TypeScript over JavaScript"
**AI**: "Got it. TypeScript provides type safety and better tooling."

*Later in conversation:*

**User**: "Should I use any for this variable?"
**AI**: "No. Since you're using TypeScript, use a specific type instead of `any`. This maintains type safety and catches errors at compile time."

## Storage

Currently, profiles are stored in-memory. For production:
1. Extend `UserProfileService` to use Firestore
2. Add Firestore collection: `userProfiles`
3. Implement data persistence and retrieval

## Privacy

- Memories are stored per user (userId required)
- Users can clear memories anytime
- Users can delete their profile completely
- No data is shared between users

## Future Enhancements

1. **Firestore Integration**: Persistent storage across sessions
2. **Memory Categories**: Better organization of memories
3. **Memory Search**: Find specific memories by keyword
4. **Profile Export**: Download your profile and memories
5. **Memory Importance**: AI learns which memories are most useful
6. **Cross-Device Sync**: Real-time profile updates across devices
