/**
 * Firebase Memory Service
 * Long-term memory storage with embeddings in Firestore
 */

import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getServerApp } from './firebase-server';

export interface Memory {
  id?: string;
  userId: string;
  content: string;
  embedding: number[];
  type: 'preference' | 'fact' | 'context' | 'skill';
  importance: number; // 1-10
  tags: string[];
  timesRecalled: number;
  createdAt: Date;
  lastRecalledAt?: Date;
}

export interface MemorySearchResult {
  memory: Memory;
  similarity: number;
}

/**
 * Firebase Memory Service for SOHAM
 */
export class FirebaseMemoryService {
  private db;

  constructor() {
    this.db = getFirestore(getServerApp());
  }

  /**
   * Store a new memory
   */
  async storeMemory(memory: Omit<Memory, 'id' | 'timesRecalled' | 'createdAt'>): Promise<string> {
    const memoriesRef = collection(this.db, 'memories');
    
    const docRef = await addDoc(memoriesRef, {
      ...memory,
      timesRecalled: 0,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  }

  /**
   * Search memories by vector similarity
   * Note: This is a basic implementation. For production, use Firebase Extensions for vector search
   */
  async searchMemories(
    userId: string,
    queryEmbedding: number[],
    topK: number = 5
  ): Promise<MemorySearchResult[]> {
    const memoriesRef = collection(this.db, 'memories');
    const q = query(
      memoriesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50) // Get recent memories for similarity calculation
    );

    const snapshot = await getDocs(q);
    const memories: Memory[] = [];

    snapshot.forEach(doc => {
      memories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        lastRecalledAt: doc.data().lastRecalledAt?.toDate(),
      } as Memory);
    });

    // Calculate cosine similarity
    const results = memories.map(memory => ({
      memory,
      similarity: this.cosineSimilarity(queryEmbedding, memory.embedding),
    }));

    // Sort by similarity and return top K
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  /**
   * Get recent memories for a user
   */
  async getRecentMemories(userId: string, count: number = 10): Promise<Memory[]> {
    const memoriesRef = collection(this.db, 'memories');
    const q = query(
      memoriesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(count)
    );

    const snapshot = await getDocs(q);
    const memories: Memory[] = [];

    snapshot.forEach(doc => {
      memories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        lastRecalledAt: doc.data().lastRecalledAt?.toDate(),
      } as Memory);
    });

    return memories;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }

  /**
   * Extract memories from conversation
   */
  async extractMemories(
    userId: string,
    conversationText: string
  ): Promise<string[]> {
    // Use Cerebras to extract memories
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
            content: `Extract important facts, preferences, and context from this conversation that should be remembered long-term.

Return ONLY a JSON array of memory strings. Each memory should be:
- A complete, standalone statement
- Specific and actionable
- Worth remembering for future conversations

Example: ["User prefers dark mode", "User is working on a React project", "User's name is Alex"]

If nothing important to remember, return: []`
          },
          { role: 'user', content: conversationText }
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  }
}

// Export singleton
let memoryService: FirebaseMemoryService | null = null;

export function getFirebaseMemoryService(): FirebaseMemoryService {
  if (!memoryService) {
    memoryService = new FirebaseMemoryService();
  }
  return memoryService;
}
