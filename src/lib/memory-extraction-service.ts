/**
 * Memory Extraction Service
 * STEP 7: Extract and store memories after conversations
 * 
 * This service runs asynchronously after each conversation to:
 * 1. Extract important facts, preferences, and context
 * 2. Generate embeddings for each memory
 * 3. Store in Firestore with metadata
 */

import { getMemorySystemService } from './memory-system-service';
import type { MemoryCategory } from './memory-system-service';

export interface ConversationContext {
  userMessage: string;
  assistantResponse: string;
  userId: string;
}

/**
 * Memory Extraction Service for SOHAM
 */
export class MemoryExtractionService {
  private memorySystem = getMemorySystemService();

  /**
   * Extract and store memories from a conversation
   * This runs asynchronously and doesn't block the response
   */
  async extractAndStore(context: ConversationContext): Promise<number> {
    try {
      console.log('[Memory Extraction] Processing conversation for user:', context.userId);

      // Combine user message and assistant response
      const conversationText = `User: ${context.userMessage}\nAssistant: ${context.assistantResponse}`;

      // Use Cerebras to extract important memories
      const memories = await this.extractMemoriesWithCerebras(conversationText);

      if (memories.length === 0) {
        console.log('[Memory Extraction] No important memories found');
        return 0;
      }

      console.log(`[Memory Extraction] Extracted ${memories.length} memories`);

      // Store each memory with metadata
      let storedCount = 0;
      for (const memoryContent of memories) {
        try {
          // Classify memory type
          const category = this.classifyMemory(memoryContent);
          
          // Calculate importance
          const importance = this.calculateImportance(memoryContent);
          
          // Extract tags
          const tags = this.extractTags(memoryContent);

          // Store in Firestore (this also generates embeddings)
          await this.memorySystem.storeMemory(context.userId, memoryContent, {
            category,
            importance,
            tags,
          });

          storedCount++;
          console.log(`[Memory Extraction] Stored: ${memoryContent.substring(0, 60)}...`);
        } catch (error) {
          console.error('[Memory Extraction] Failed to store memory:', error);
        }
      }

      console.log(`[Memory Extraction] Successfully stored ${storedCount}/${memories.length} memories`);
      return storedCount;
    } catch (error) {
      console.error('[Memory Extraction] Failed:', error);
      return 0;
    }
  }

  /**
   * Extract memories using Cerebras llama-3.3-70b-versatile
   */
  private async extractMemoriesWithCerebras(conversationText: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `Extract important facts, preferences, skills, and context from this conversation that should be remembered long-term.

Return ONLY a JSON array of memory strings. Each memory should be:
- A complete, standalone statement
- Specific and actionable
- Worth remembering for future conversations
- Written in third person (e.g., "User prefers..." not "I prefer...")

Examples:
["User prefers dark mode for coding", "User is working on a React project with TypeScript", "User's name is Alex", "User is an expert in Python"]

If nothing important to remember, return: []`
            },
            { role: 'user', content: conversationText }
          ],
          temperature: 0.3,
          max_tokens: 512,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cerebras API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();

      // Parse JSON response
      try {
        const memories = JSON.parse(content);
        return Array.isArray(memories) ? memories : [];
      } catch {
        console.warn('[Memory Extraction] Failed to parse Cerebras response as JSON');
        return [];
      }
    } catch (error) {
      console.error('[Memory Extraction] Cerebras extraction failed:', error);
      return [];
    }
  }

  /**
   * Classify memory into categories
   */
  private classifyMemory(content: string): MemoryCategory {
    const lower = content.toLowerCase();

    // Check for preferences
    if (lower.includes('prefer') || lower.includes('like') || lower.includes('favorite') || 
        lower.includes('enjoys') || lower.includes('wants')) {
      return 'PREFERENCE';
    }

    // Check for skills
    if (lower.includes('expert') || lower.includes('skilled') || lower.includes('proficient') ||
        lower.includes('knows') || lower.includes('can code') || lower.includes('experienced')) {
      return 'SKILL';
    }

    // Check for context
    if (lower.includes('working on') || lower.includes('project') || lower.includes('currently') ||
        lower.includes('building') || lower.includes('developing')) {
      return 'CONTEXT';
    }

    // Check for conversation snippets
    if (lower.includes('discussed') || lower.includes('talked about') || lower.includes('mentioned')) {
      return 'CONVERSATION';
    }

    // Default to fact
    return 'FACT';
  }

  /**
   * Calculate importance score (0-1 range)
   */
  private calculateImportance(content: string): number {
    let score = 0.5; // Base score
    const lower = content.toLowerCase();

    // High importance: Personal information
    if (lower.includes('name is') || lower.includes('age') || lower.includes('location') ||
        lower.includes('email') || lower.includes('phone')) {
      score += 0.3;
    }

    // Medium-high importance: Preferences and skills
    if (lower.includes('prefer') || lower.includes('expert') || lower.includes('skilled')) {
      score += 0.2;
    }

    // Medium importance: Current context
    if (lower.includes('working on') || lower.includes('project')) {
      score += 0.15;
    }

    // Low importance: General facts
    if (lower.includes('likes') || lower.includes('enjoys')) {
      score += 0.1;
    }

    return Math.min(1.0, Math.max(0.1, score));
  }

  /**
   * Extract relevant tags from memory content
   */
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    const lower = content.toLowerCase();

    // Technology tags
    const techKeywords = [
      'python', 'javascript', 'typescript', 'react', 'node', 'java', 'c++', 'go',
      'rust', 'swift', 'kotlin', 'php', 'ruby', 'vue', 'angular', 'nextjs', 'django',
      'flask', 'express', 'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes'
    ];
    
    techKeywords.forEach(tech => {
      if (lower.includes(tech)) {
        tags.push(tech);
      }
    });

    // Category tags
    if (lower.includes('prefer')) tags.push('preference');
    if (lower.includes('project')) tags.push('project');
    if (lower.includes('work')) tags.push('work');
    if (lower.includes('learn')) tags.push('learning');
    if (lower.includes('skill') || lower.includes('expert')) tags.push('skill');
    if (lower.includes('name')) tags.push('personal');
    if (lower.includes('code') || lower.includes('coding')) tags.push('coding');

    return tags.length > 0 ? tags : ['general'];
  }

  /**
   * Check if memory extraction is enabled
   */
  isEnabled(): boolean {
    const enabled = process.env.ENABLE_MEMORY_SYSTEM === 'true';
    const hasKey = !!process.env.CEREBRAS_API_KEY;
    return enabled && hasKey;
  }
}

// Export singleton
let memoryExtractionService: MemoryExtractionService | null = null;

export function getMemoryExtractionService(): MemoryExtractionService {
  if (!memoryExtractionService) {
    memoryExtractionService = new MemoryExtractionService();
  }
  return memoryExtractionService;
}
