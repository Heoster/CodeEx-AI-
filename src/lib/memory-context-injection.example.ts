/**
 * @fileOverview Examples of Memory Context Injection in Request Processing
 * 
 * This file demonstrates how the memory system integrates with the request
 * processing flow to provide context-aware responses.
 * 
 * Requirements Implemented:
 * - 7.7: Inject relevant memories into prompt context
 * - 7.12: Continue without memory injection when system is unavailable
 * - 12.7: Handle memory system failures gracefully
 */

import { getMemorySystemService } from './memory-system-service';
import type { ProcessUserMessageInput } from './types';

/**
 * Example 1: Basic Memory Context Injection Flow
 * 
 * This example shows how memories are retrieved and injected during
 * request processing when the memory system is enabled.
 */
export async function exampleBasicMemoryInjection() {
  const memoryService = getMemorySystemService();
  const userId = 'user123';
  const userMessage = 'How should I structure my React components?';
  
  // Step 1: Search for relevant memories
  const memoryResults = await memoryService.searchMemories({
    userId,
    queryText: userMessage,
    topK: 5, // Retrieve top 5 most relevant memories
    minSimilarity: 0.7, // Only include memories with >70% similarity
  });
  
  console.log(`Found ${memoryResults.length} relevant memories`);
  
  // Step 2: Inject memories into prompt
  if (memoryResults.length > 0) {
    const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
      userMessage,
      memoryResults
    );
    
    console.log('Enhanced prompt with memory context:');
    console.log(enhancedPrompt);
    
    // The enhanced prompt now includes:
    // - Context from previous interactions
    // - Memory content with category and importance
    // - Original user message
  } else {
    console.log('No relevant memories found, using original prompt');
  }
}

/**
 * Example 2: Memory Injection with Feature Flag Check
 * 
 * This example demonstrates how to check if the memory system is enabled
 * before attempting to retrieve memories.
 */
export async function exampleMemoryInjectionWithFeatureFlag() {
  const { env } = await import('./env-config');
  
  // Check if memory system is enabled
  if (!env.features.enableMemorySystem) {
    console.log('Memory system is disabled, skipping memory injection');
    return;
  }
  
  const userId = 'user123';
  const userMessage = 'What database should I use for my chat app?';
  
  try {
    const memoryService = getMemorySystemService();
    
    const memoryResults = await memoryService.searchMemories({
      userId,
      queryText: userMessage,
      topK: 5,
      minSimilarity: 0.7,
    });
    
    if (memoryResults.length > 0) {
      const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
        userMessage,
        memoryResults
      );
      
      console.log(`Injected ${memoryResults.length} memories into prompt`);
      return enhancedPrompt;
    }
  } catch (error) {
    // Gracefully handle memory system failures
    console.warn('Memory system error, continuing without memories:', error);
  }
  
  // Return original message if memory system fails or no memories found
  return userMessage;
}

/**
 * Example 3: Complete Request Processing with Memory Injection
 * 
 * This example shows the full flow of processing a user request with
 * memory context injection integrated.
 */
export async function exampleCompleteRequestProcessing(
  input: ProcessUserMessageInput
): Promise<string> {
  const { message, userId } = input;
  const { env } = await import('./env-config');
  
  let enhancedMessage = message;
  
  // Memory injection step (Requirements 7.7, 7.12, 12.7)
  if (env.features.enableMemorySystem && userId) {
    try {
      const memoryService = getMemorySystemService();
      
      // Search for relevant memories
      const memoryResults = await memoryService.searchMemories({
        userId,
        queryText: message,
        topK: 5,
        minSimilarity: 0.7,
      });
      
      // Inject memories if found
      if (memoryResults.length > 0) {
        enhancedMessage = memoryService.injectMemoriesIntoPrompt(
          message,
          memoryResults
        );
        
        console.log(`[Memory System] Injected ${memoryResults.length} memories for user ${userId}`);
      } else {
        console.log(`[Memory System] No relevant memories found for user ${userId}`);
      }
    } catch (error) {
      // Requirement 7.12 & 12.7: Handle failures gracefully
      console.warn('[Memory System] Failed to retrieve memories, continuing without memory context:', error);
      // Continue with original message - don't fail the request
    }
  }
  
  // Continue with request processing using enhanced message
  return enhancedMessage;
}

/**
 * Example 4: Memory Injection with Different Categories
 * 
 * This example shows how to filter memories by category for more
 * targeted context injection.
 */
export async function exampleMemoryInjectionByCategory() {
  const memoryService = getMemorySystemService();
  const userId = 'user123';
  const userMessage = 'What are my coding preferences?';
  
  // Search for preference-specific memories
  const memoryResults = await memoryService.searchMemories({
    userId,
    queryText: userMessage,
    topK: 5,
    minSimilarity: 0.7,
    categories: ['PREFERENCE'], // Only retrieve preference memories
  });
  
  console.log(`Found ${memoryResults.length} preference memories`);
  
  if (memoryResults.length > 0) {
    const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
      userMessage,
      memoryResults
    );
    
    console.log('Enhanced prompt with preference context:');
    console.log(enhancedPrompt);
  }
}

/**
 * Example 5: Handling Missing User ID
 * 
 * This example demonstrates how the system handles requests without
 * a user ID (anonymous users or unauthenticated requests).
 */
export async function exampleHandlingMissingUserId(
  message: string,
  userId?: string
) {
  const { env } = await import('./env-config');
  
  // Check both feature flag and userId presence
  if (!env.features.enableMemorySystem || !userId) {
    console.log('Memory injection skipped: system disabled or no userId');
    return message; // Return original message
  }
  
  // Proceed with memory injection only if both conditions are met
  try {
    const memoryService = getMemorySystemService();
    
    const memoryResults = await memoryService.searchMemories({
      userId,
      queryText: message,
      topK: 5,
      minSimilarity: 0.7,
    });
    
    if (memoryResults.length > 0) {
      return memoryService.injectMemoriesIntoPrompt(message, memoryResults);
    }
  } catch (error) {
    console.warn('Memory system error:', error);
  }
  
  return message;
}

/**
 * Example 6: Memory Injection Performance Monitoring
 * 
 * This example shows how to monitor the performance of memory injection
 * to ensure it meets the <100ms requirement.
 */
export async function exampleMemoryInjectionPerformance() {
  const memoryService = getMemorySystemService();
  const userId = 'user123';
  const userMessage = 'How do I optimize my React app?';
  
  // Measure memory search performance
  const startTime = Date.now();
  
  try {
    const memoryResults = await memoryService.searchMemories({
      userId,
      queryText: userMessage,
      topK: 5,
      minSimilarity: 0.7,
    });
    
    const searchTime = Date.now() - startTime;
    
    console.log(`Memory search completed in ${searchTime}ms`);
    
    // Requirement 13.10: Memory search should complete in <100ms
    if (searchTime > 100) {
      console.warn(`Memory search exceeded 100ms target: ${searchTime}ms`);
    }
    
    // Inject memories
    if (memoryResults.length > 0) {
      const injectionStart = Date.now();
      const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
        userMessage,
        memoryResults
      );
      const injectionTime = Date.now() - injectionStart;
      
      console.log(`Memory injection completed in ${injectionTime}ms`);
      console.log(`Total memory processing time: ${searchTime + injectionTime}ms`);
      
      return enhancedPrompt;
    }
  } catch (error) {
    console.error('Memory system error:', error);
  }
  
  return userMessage;
}

/**
 * Example 7: Provider-Specific Memory Formatting
 * 
 * This example demonstrates how memories are formatted appropriately
 * for different AI providers.
 */
export async function exampleProviderSpecificFormatting() {
  const memoryService = getMemorySystemService();
  const userId = 'user123';
  const userMessage = 'Explain async/await in JavaScript';
  
  // Retrieve memories
  const memoryResults = await memoryService.searchMemories({
    userId,
    queryText: userMessage,
    topK: 5,
    minSimilarity: 0.7,
  });
  
  if (memoryResults.length > 0) {
    // The injectMemoriesIntoPrompt method formats memories in a
    // provider-agnostic way that works with all AI providers
    const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(
      userMessage,
      memoryResults
    );
    
    console.log('Memory format (works with all providers):');
    console.log(enhancedPrompt);
    
    // The format includes:
    // 1. Clear section header: "Context from previous interactions:"
    // 2. Numbered memories with metadata (category, importance)
    // 3. Clear separator: "Current request:"
    // 4. Original user message
    
    // This format is compatible with:
    // - Groq models (Llama, Mistral)
    // - Cerebras models (Llama, GPT-OSS, DeepSeek)
    // - Google models (Gemini)
    // - Hugging Face models
  }
}

// Export all examples for documentation
export const examples = {
  exampleBasicMemoryInjection,
  exampleMemoryInjectionWithFeatureFlag,
  exampleCompleteRequestProcessing,
  exampleMemoryInjectionByCategory,
  exampleHandlingMissingUserId,
  exampleMemoryInjectionPerformance,
  exampleProviderSpecificFormatting,
};
