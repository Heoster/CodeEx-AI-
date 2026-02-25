/**
 * Memory System Service - Usage Examples
 * 
 * This file demonstrates how to use the Memory System Service
 * for storing and retrieving user memories with vector embeddings.
 */

import { getMemorySystemService, type MemoryCategory } from './memory-system-service';

/**
 * Example 1: Store a user preference
 */
async function exampleStorePreference() {
  const memoryService = getMemorySystemService();
  
  const memory = await memoryService.storeMemory(
    'user123',
    'User prefers concise responses without too much explanation',
    {
      category: 'PREFERENCE',
      importance: 0.9,
      tags: ['response-style', 'concise'],
    }
  );
  
  console.log('Stored preference memory:', memory.id);
}

/**
 * Example 2: Store a factual memory
 */
async function exampleStoreFact() {
  const memoryService = getMemorySystemService();
  
  const memory = await memoryService.storeMemory(
    'user123',
    'User is a senior software engineer working with TypeScript and React',
    {
      category: 'FACT',
      importance: 0.8,
      tags: ['profession', 'skills', 'typescript', 'react'],
    }
  );
  
  console.log('Stored fact memory:', memory.id);
}

/**
 * Example 3: Store contextual information
 */
async function exampleStoreContext() {
  const memoryService = getMemorySystemService();
  
  const memory = await memoryService.storeMemory(
    'user123',
    'User is currently working on a Next.js project with Firebase integration',
    {
      category: 'CONTEXT',
      importance: 0.7,
      tags: ['current-project', 'nextjs', 'firebase'],
    }
  );
  
  console.log('Stored context memory:', memory.id);
}

/**
 * Example 4: Search for relevant memories
 */
async function exampleSearchMemories() {
  const memoryService = getMemorySystemService();
  
  const results = await memoryService.searchMemories({
    userId: 'user123',
    queryText: 'How should I structure my React components?',
    topK: 3,
    minSimilarity: 0.5,
  });
  
  console.log(`Found ${results.length} relevant memories:`);
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. Similarity: ${result.similarity.toFixed(3)}, Relevance: ${result.relevanceScore.toFixed(3)}`);
    console.log(`   Category: ${result.memory.metadata.category}`);
    console.log(`   Content: ${result.memory.content}`);
  });
}

/**
 * Example 5: Search memories by category
 */
async function exampleSearchByCategory() {
  const memoryService = getMemorySystemService();
  
  const results = await memoryService.searchMemories({
    userId: 'user123',
    queryText: 'coding preferences',
    topK: 5,
    minSimilarity: 0.4,
    categories: ['PREFERENCE', 'SKILL'],
  });
  
  console.log(`Found ${results.length} preference/skill memories`);
}

/**
 * Example 6: Get recent memories
 */
async function exampleGetRecentMemories() {
  const memoryService = getMemorySystemService();
  
  const memories = await memoryService.getRecentMemories('user123', 10);
  
  console.log(`Retrieved ${memories.length} recent memories:`);
  memories.forEach((memory, index) => {
    console.log(`\n${index + 1}. ${memory.metadata.category} (importance: ${memory.metadata.importance})`);
    console.log(`   ${memory.content}`);
    console.log(`   Created: ${memory.createdAt}`);
  });
}

/**
 * Example 7: Get memories by category
 */
async function exampleGetMemoriesByCategory() {
  const memoryService = getMemorySystemService();
  
  const preferences = await memoryService.getMemoriesByCategory('user123', 'PREFERENCE');
  
  console.log(`Found ${preferences.length} preference memories`);
}

/**
 * Example 8: Inject memories into a prompt
 */
async function exampleInjectMemories() {
  const memoryService = getMemorySystemService();
  
  // Search for relevant memories
  const results = await memoryService.searchMemories({
    userId: 'user123',
    queryText: 'How do I implement authentication in my app?',
    topK: 3,
    minSimilarity: 0.5,
  });
  
  // Inject into prompt
  const originalPrompt = 'How do I implement authentication in my Next.js app?';
  const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(originalPrompt, results);
  
  console.log('Enhanced prompt with memories:');
  console.log(enhancedPrompt);
}

/**
 * Example 9: Update a memory
 */
async function exampleUpdateMemory() {
  const memoryService = getMemorySystemService();
  
  // First, get a memory
  const memories = await memoryService.getRecentMemories('user123', 1);
  if (memories.length > 0) {
    const memory = memories[0];
    
    // Update its importance
    await memoryService.updateMemory(memory.id, {
      metadata: {
        ...memory.metadata,
        importance: 0.95,
      },
    });
    
    console.log('Updated memory importance');
  }
}

/**
 * Example 10: Delete a memory
 */
async function exampleDeleteMemory() {
  const memoryService = getMemorySystemService();
  
  // Get a memory to delete
  const memories = await memoryService.getRecentMemories('user123', 1);
  if (memories.length > 0) {
    await memoryService.deleteMemory(memories[0].id);
    console.log('Deleted memory');
  }
}

/**
 * Example 11: Prune old memories
 */
async function examplePruneOldMemories() {
  const memoryService = getMemorySystemService();
  
  // Delete memories not accessed in the last 90 days
  const deletedCount = await memoryService.pruneOldMemories('user123', 90);
  
  console.log(`Pruned ${deletedCount} old memories`);
}

/**
 * Example 12: Consolidate duplicate memories
 */
async function exampleConsolidateMemories() {
  const memoryService = getMemorySystemService();
  
  await memoryService.consolidateMemories('user123');
  
  console.log('Consolidated duplicate memories');
}

/**
 * Example 13: Complete workflow - Store and retrieve
 */
async function exampleCompleteWorkflow() {
  const memoryService = getMemorySystemService();
  const userId = 'user123';
  
  // 1. Store some memories
  console.log('1. Storing memories...');
  await memoryService.storeMemory(userId, 'User prefers TypeScript over JavaScript', {
    category: 'PREFERENCE',
    importance: 0.9,
    tags: ['language', 'typescript'],
  });
  
  await memoryService.storeMemory(userId, 'User is building a real-time chat application', {
    category: 'CONTEXT',
    importance: 0.8,
    tags: ['project', 'chat', 'realtime'],
  });
  
  await memoryService.storeMemory(userId, 'User has experience with Firebase and Firestore', {
    category: 'SKILL',
    importance: 0.85,
    tags: ['firebase', 'firestore', 'database'],
  });
  
  // 2. Search for relevant memories
  console.log('\n2. Searching for relevant memories...');
  const results = await memoryService.searchMemories({
    userId,
    queryText: 'What database should I use for my chat app?',
    topK: 3,
    minSimilarity: 0.4,
  });
  
  console.log(`Found ${results.length} relevant memories`);
  
  // 3. Inject into prompt
  console.log('\n3. Creating enhanced prompt...');
  const prompt = 'What database should I use for my real-time chat application?';
  const enhancedPrompt = memoryService.injectMemoriesIntoPrompt(prompt, results);
  console.log(enhancedPrompt);
  
  // 4. Get statistics
  console.log('\n4. Memory statistics:');
  const allMemories = await memoryService.getRecentMemories(userId, 100);
  console.log(`Total memories: ${allMemories.length}`);
  
  const byCategory: Record<MemoryCategory, number> = {
    PREFERENCE: 0,
    FACT: 0,
    CONTEXT: 0,
    SKILL: 0,
    CONVERSATION: 0,
  };
  
  allMemories.forEach(memory => {
    byCategory[memory.metadata.category]++;
  });
  
  console.log('By category:', byCategory);
}

// Export examples for use in other files
export {
  exampleStorePreference,
  exampleStoreFact,
  exampleStoreContext,
  exampleSearchMemories,
  exampleSearchByCategory,
  exampleGetRecentMemories,
  exampleGetMemoriesByCategory,
  exampleInjectMemories,
  exampleUpdateMemory,
  exampleDeleteMemory,
  examplePruneOldMemories,
  exampleConsolidateMemories,
  exampleCompleteWorkflow,
};
