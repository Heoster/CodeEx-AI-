import { UserProfile, UserMemory } from './types';

/**
 * Personality System for CodeEx AI
 * Implements behavioral rules for natural, context-aware interactions
 */

export interface PersonalityConfig {
  profile?: UserProfile;
  enableMemory: boolean;
  enableStyleMatching: boolean;
}

/**
 * Generate system instructions based on user profile and behavioral rules
 */
export function generatePersonalityInstructions(config: PersonalityConfig): string {
  const { profile, enableMemory, enableStyleMatching } = config;

  let instructions = `## Behavioral Rules

1. **Communication Style**: ${getStyleInstructions(profile?.communicationStyle, enableStyleMatching)}

2. **Memory Integration**: ${getMemoryInstructions(profile?.memories, enableMemory)}

3. **Directness**: Be direct and concise. Skip filler phrases like:
   - "Great question!"
   - "I'd be happy to help!"
   - "Let me explain..."
   Just answer directly.

4. **Ambiguity Handling**: If the user's message is unclear, ask ONE specific clarifying question. Don't guess or provide multiple interpretations.

5. **Continuity**: You are one continuous intelligence across all devices. Never say "I can't see what's on your other device." You share memory and context.

6. **Learning**: When you learn something new about the user, integrate it naturally without announcing it (e.g., don't say "I'll remember that").

7. **Response Length**: ${getResponseLengthInstructions(profile?.preferences?.responseLength)}

8. **Honesty**: If you don't know something, say so immediately. No hedging or lengthy disclaimers.
`;

  return instructions;
}

function getStyleInstructions(style?: string, enabled?: boolean): string {
  if (!enabled || !style) {
    return 'Use a balanced, professional yet friendly tone.';
  }

  switch (style) {
    case 'direct':
      return 'Match the user\'s direct style. Short sentences. No fluff. Get to the point.';
    case 'detailed':
      return 'Match the user\'s preference for thorough explanations. Provide context, examples, and comprehensive answers.';
    case 'casual':
      return 'Match the user\'s casual tone. Be conversational, use contractions, keep it relaxed.';
    case 'technical':
      return 'Match the user\'s technical communication. Use precise terminology, assume technical knowledge, focus on accuracy.';
    default:
      return 'Adapt to the user\'s communication style naturally.';
  }
}

function getMemoryInstructions(memories?: UserMemory[], enabled?: boolean): string {
  if (!enabled || !memories || memories.length === 0) {
    return 'No prior context available. Treat this as a fresh conversation.';
  }

  const relevantMemories = memories
    .filter(m => m.relevance > 0.5)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  if (relevantMemories.length === 0) {
    return 'No highly relevant memories. Focus on the current request.';
  }

  const memoryContext = relevantMemories
    .map(m => `- ${m.content}`)
    .join('\n');

  return `Use this context naturally (don't say "I recall from memory"):\n${memoryContext}`;
}

function getResponseLengthInstructions(preference?: string): string {
  switch (preference) {
    case 'concise':
      return 'Keep responses brief. One or two paragraphs maximum unless detail is explicitly requested.';
    case 'detailed':
      return 'Provide comprehensive responses with examples, context, and thorough explanations.';
    default:
      return 'Keep responses concise unless the user asks for detail. Default to brevity.';
  }
}

/**
 * Extract potential memories from conversation
 */
export function extractMemories(
  userMessage: string,
  assistantResponse: string,
  existingMemories: UserMemory[] = []
): UserMemory[] {
  const newMemories: UserMemory[] = [];
  const timestamp = new Date().toISOString();

  // Pattern matching for memory extraction
  const patterns = {
    preference: /I (prefer|like|want|need|always|usually)/i,
    fact: /I (am|work|study|live|have been)/i,
    skill: /I (know|can|understand|am familiar with)/i,
  };

  // Check user message for memory-worthy content
  for (const [category, pattern] of Object.entries(patterns)) {
    if (pattern.test(userMessage)) {
      // Extract the relevant sentence
      const sentences = userMessage.split(/[.!?]+/);
      const relevantSentence = sentences.find(s => pattern.test(s));
      
      if (relevantSentence && relevantSentence.trim().length > 10) {
        // Check if similar memory already exists
        const isDuplicate = existingMemories.some(
          m => m.content.toLowerCase().includes(relevantSentence.trim().toLowerCase().substring(0, 20))
        );

        if (!isDuplicate) {
          newMemories.push({
            id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: relevantSentence.trim(),
            category: category as 'preference' | 'fact' | 'skill' | 'context',
            timestamp,
            relevance: 0.8,
          });
        }
      }
    }
  }

  return newMemories;
}

/**
 * Detect user's communication style from their message
 */
export function detectCommunicationStyle(message: string): string {
  const wordCount = message.split(/\s+/).length;
  const sentenceCount = message.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  const hasJargon = /\b(API|SDK|CLI|async|await|function|class|interface|type|const|let|var)\b/i.test(message);
  const hasCasualMarkers = /\b(hey|hi|thanks|cool|awesome|yeah|nah|gonna|wanna)\b/i.test(message);

  // Technical: uses jargon, moderate length
  if (hasJargon && avgWordsPerSentence > 10) {
    return 'technical';
  }

  // Direct: short sentences, few words
  if (avgWordsPerSentence < 8 && wordCount < 30) {
    return 'direct';
  }

  // Casual: casual markers, moderate length
  if (hasCasualMarkers) {
    return 'casual';
  }

  // Detailed: long sentences, many words
  if (avgWordsPerSentence > 15 || wordCount > 50) {
    return 'detailed';
  }

  return 'balanced';
}
