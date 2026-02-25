/**
 * Memory System Service
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Vector-based memory storage using Google embeddings and Firestore for context-aware responses.
 * 
 * Features:
 * - Generate embeddings using gemini-embedding-001
 * - Store memories in Firestore with vector data
 * - Perform similarity search for relevant context
 * - Categorize memories (PREFERENCE, FACT, CONTEXT, SKILL, CONVERSATION)
 * - Assign importance scores (0-1 range)
 * - Track access count and last accessed timestamp
 * - Prune old memories and consolidate duplicates
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.8, 7.9, 7.11
 */

import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { app } from './firebase';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Memory category types
 */
export type MemoryCategory = 
  | 'PREFERENCE'    // User preferences (e.g., "prefers concise responses")
  | 'FACT'          // Factual information about the user (e.g., "works as a software engineer")
  | 'CONTEXT'       // Contextual information (e.g., "working on a React project")
  | 'SKILL'         // User skills and expertise (e.g., "expert in TypeScript")
  | 'CONVERSATION'; // Important conversation snippets

/**
 * Memory entry stored in Firestore
 */
export interface MemoryEntry {
  id: string;
  userId: string;
  content: string;
  embedding: number[];
  metadata: MemoryMetadata;
  createdAt: string;
  lastAccessed: string;
  accessCount: number;
}

/**
 * Memory metadata
 */
export interface MemoryMetadata {
  category: MemoryCategory;
  importance: number;           // 0-1 score
  tags: string[];
  relatedMemoryIds?: string[];
}

/**
 * Memory query parameters
 */
export interface MemoryQuery {
  userId: string;
  queryText: string;
  topK?: number;                // Number of results to return (default: 5)
  minSimilarity?: number;       // Minimum similarity threshold (default: 0.5)
  categories?: MemoryCategory[];
}

/**
 * Memory search result with similarity score
 */
export interface MemorySearchResult {
  memory: MemoryEntry;
  similarity: number;
  relevanceScore: number;
}

// ============================================================================
// Memory System Service Class
// ============================================================================

/**
 * Memory System Service for storing and retrieving user memories
 */
export class MemorySystemService {
  private db;
  private memoriesCollection = 'memories';
  private embeddingModel = 'gemini-embedding-001';

  constructor() {
    this.db = getFirestore(app);
  }

  // ============================================================================
  // Storage Operations
  // ============================================================================

  /**
   * Store a new memory entry
   * 
   * @param userId - User ID
   * @param content - Memory content
   * @param metadata - Memory metadata
   * @returns The created memory entry
   */
  async storeMemory(
    userId: string,
    content: string,
    metadata: MemoryMetadata
  ): Promise<MemoryEntry> {
    // Generate embedding for the content
    const embedding = await this.generateEmbedding(content);

    // Create memory entry
    const memoryId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const memory: MemoryEntry = {
      id: memoryId,
      userId,
      content,
      embedding,
      metadata,
      createdAt: now,
      lastAccessed: now,
      accessCount: 0,
    };

    // Store in Firestore
    const memoryRef = doc(this.db, this.memoriesCollection, memoryId);
    await setDoc(memoryRef, {
      ...memory,
      createdAt: Timestamp.fromDate(new Date(memory.createdAt)),
      lastAccessed: Timestamp.fromDate(new Date(memory.lastAccessed)),
    });

    return memory;
  }

  /**
   * Update an existing memory entry
   * 
   * @param memoryId - Memory ID
   * @param updates - Partial updates to apply
   */
  async updateMemory(
    memoryId: string,
    updates: Partial<Omit<MemoryEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    const memoryRef = doc(this.db, this.memoriesCollection, memoryId);
    
    // Convert date strings to Timestamps if present
    const firestoreUpdates: any = { ...updates };
    if (updates.lastAccessed) {
      firestoreUpdates.lastAccessed = Timestamp.fromDate(new Date(updates.lastAccessed));
    }

    await updateDoc(memoryRef, firestoreUpdates);
  }

  /**
   * Delete a memory entry
   * 
   * @param memoryId - Memory ID
   */
  async deleteMemory(memoryId: string): Promise<void> {
    const memoryRef = doc(this.db, this.memoriesCollection, memoryId);
    await deleteDoc(memoryRef);
  }

  /**
   * Delete all memories for a user (GDPR-compliant data deletion)
   * 
   * @param userId - User ID
   * @returns Number of memories deleted
   */
  async deleteAllUserMemories(userId: string): Promise<number> {
    const q = query(
      collection(this.db, this.memoriesCollection),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    let deletedCount = 0;

    // Delete all memories for this user
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
      deletedCount++;
    }

    return deletedCount;
  }

  // ============================================================================
  // Retrieval Operations
  // ============================================================================

  /**
   * Search for relevant memories using similarity search
   * 
   * @param queryParams - Query parameters
   * @returns Array of memory search results sorted by relevance
   */
  async searchMemories(queryParams: MemoryQuery): Promise<MemorySearchResult[]> {
    const {
      userId,
      queryText,
      topK = 5,
      minSimilarity = 0.5,
      categories,
    } = queryParams;

    // Generate embedding for the query
    const queryEmbedding = await this.generateEmbedding(queryText);

    // Get all memories for the user
    let q = query(
      collection(this.db, this.memoriesCollection),
      where('userId', '==', userId)
    );

    // Filter by categories if specified
    if (categories && categories.length > 0) {
      q = query(q, where('metadata.category', 'in', categories));
    }

    const snapshot = await getDocs(q);
    const memories: MemoryEntry[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      memories.push({
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        lastAccessed: data.lastAccessed?.toDate?.()?.toISOString() || data.lastAccessed,
      } as MemoryEntry);
    });

    // Calculate similarity scores
    const results: MemorySearchResult[] = memories
      .map((memory) => {
        const similarity = this.calculateSimilarity(queryEmbedding, memory.embedding);
        const relevanceScore = this.calculateRelevanceScore(memory, similarity);

        return {
          memory,
          similarity,
          relevanceScore,
        };
      })
      .filter((result) => result.similarity >= minSimilarity)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topK);

    // Update access count and last accessed timestamp for retrieved memories
    for (const result of results) {
      await this.updateMemory(result.memory.id, {
        accessCount: result.memory.accessCount + 1,
        lastAccessed: new Date().toISOString(),
      });
    }

    return results;
  }

  /**
   * Get recent memories for a user
   * 
   * @param userId - User ID
   * @param limitCount - Number of memories to return
   * @returns Array of recent memory entries
   */
  async getRecentMemories(userId: string, limitCount: number = 10): Promise<MemoryEntry[]> {
    const q = query(
      collection(this.db, this.memoriesCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const memories: MemoryEntry[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      memories.push({
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        lastAccessed: data.lastAccessed?.toDate?.()?.toISOString() || data.lastAccessed,
      } as MemoryEntry);
    });

    return memories;
  }

  /**
   * Get memories by category
   * 
   * @param userId - User ID
   * @param category - Memory category
   * @returns Array of memory entries in the specified category
   */
  async getMemoriesByCategory(
    userId: string,
    category: MemoryCategory
  ): Promise<MemoryEntry[]> {
    const q = query(
      collection(this.db, this.memoriesCollection),
      where('userId', '==', userId),
      where('metadata.category', '==', category),
      orderBy('metadata.importance', 'desc')
    );

    const snapshot = await getDocs(q);
    const memories: MemoryEntry[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      memories.push({
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        lastAccessed: data.lastAccessed?.toDate?.()?.toISOString() || data.lastAccessed,
      } as MemoryEntry);
    });

    return memories;
  }

  // ============================================================================
  // Embedding Operations
  // ============================================================================

  /**
   * Generate embedding for text using gemini-embedding-001
   * 
   * @param text - Text to generate embedding for
   * @returns Embedding vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.embeddingModel}:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: {
              parts: [{ text }],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Embedding generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two embeddings
   * 
   * @param embedding1 - First embedding vector
   * @param embedding2 - Second embedding vector
   * @returns Similarity score (0-1 range)
   */
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    if (magnitude === 0) return 0;

    // Cosine similarity ranges from -1 to 1, normalize to 0-1
    const cosineSimilarity = dotProduct / magnitude;
    return (cosineSimilarity + 1) / 2;
  }

  /**
   * Calculate relevance score combining similarity and importance
   * 
   * @param memory - Memory entry
   * @param similarity - Similarity score
   * @returns Relevance score (0-1 range)
   */
  private calculateRelevanceScore(memory: MemoryEntry, similarity: number): number {
    // Combine similarity (70%) and importance (30%)
    return similarity * 0.7 + memory.metadata.importance * 0.3;
  }

  // ============================================================================
  // Context Injection
  // ============================================================================

  /**
   * Inject relevant memories into a prompt
   * 
   * @param prompt - Original prompt
   * @param memories - Memory search results
   * @returns Prompt with injected memories
   */
  injectMemoriesIntoPrompt(prompt: string, memories: MemorySearchResult[]): string {
    if (memories.length === 0) {
      return prompt;
    }

    const memoryContext = memories
      .map((result, index) => {
        const { memory } = result;
        return `[Memory ${index + 1}] (${memory.metadata.category}, importance: ${memory.metadata.importance.toFixed(2)}): ${memory.content}`;
      })
      .join('\n');

    return `Context from previous interactions:
${memoryContext}

Current request:
${prompt}`;
  }

  // ============================================================================
  // Maintenance Operations
  // ============================================================================

  /**
   * Prune old memories that haven't been accessed recently
   * 
   * @param userId - User ID
   * @param olderThanDays - Delete memories older than this many days
   * @returns Number of memories deleted
   */
  async pruneOldMemories(userId: string, olderThanDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const q = query(
      collection(this.db, this.memoriesCollection),
      where('userId', '==', userId),
      where('lastAccessed', '<', Timestamp.fromDate(cutoffDate))
    );

    const snapshot = await getDocs(q);
    let deletedCount = 0;

    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
      deletedCount++;
    }

    return deletedCount;
  }

  /**
   * Consolidate duplicate or similar memories
   * 
   * @param userId - User ID
   */
  async consolidateMemories(userId: string): Promise<void> {
    const memories = await this.getRecentMemories(userId, 100);

    // Group similar memories (similarity > 0.9)
    const groups: MemoryEntry[][] = [];

    for (const memory of memories) {
      let addedToGroup = false;

      for (const group of groups) {
        const similarity = this.calculateSimilarity(
          memory.embedding,
          group[0].embedding
        );

        if (similarity > 0.9) {
          group.push(memory);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push([memory]);
      }
    }

    // For each group with multiple memories, keep the most important one
    for (const group of groups) {
      if (group.length > 1) {
        // Sort by importance and access count
        group.sort((a, b) => {
          const scoreA = a.metadata.importance * 0.7 + (a.accessCount / 100) * 0.3;
          const scoreB = b.metadata.importance * 0.7 + (b.accessCount / 100) * 0.3;
          return scoreB - scoreA;
        });

        // Keep the first (most important), delete the rest
        for (let i = 1; i < group.length; i++) {
          await this.deleteMemory(group[i].id);
        }
      }
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let memorySystemInstance: MemorySystemService | null = null;

/**
 * Get the singleton MemorySystemService instance
 */
export function getMemorySystemService(): MemorySystemService {
  if (!memorySystemInstance) {
    memorySystemInstance = new MemorySystemService();
  }
  return memorySystemInstance;
}

/**
 * Reset the memory system (useful for testing)
 */
export function resetMemorySystemService(): void {
  memorySystemInstance = null;
}
