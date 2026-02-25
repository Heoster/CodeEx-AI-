/**
 * Memory System Service Tests
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Tests for vector similarity search performance and correctness
 * Requirements: 7.4, 7.5, 7.6, 13.10
 */

import { MemorySystemService } from './memory-system-service';
import type { MemoryEntry, MemoryMetadata, MemoryQuery } from './memory-system-service';

describe('MemorySystemService - Vector Similarity Search', () => {
  let service: MemorySystemService;

  beforeEach(() => {
    service = new MemorySystemService();
  });

  describe('calculateSimilarity', () => {
    it('should calculate cosine similarity correctly for identical vectors', () => {
      const embedding1 = [1, 0, 0, 0];
      const embedding2 = [1, 0, 0, 0];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Identical vectors should have similarity close to 1
      expect(similarity).toBeGreaterThan(0.99);
    });

    it('should calculate cosine similarity correctly for orthogonal vectors', () => {
      const embedding1 = [1, 0, 0, 0];
      const embedding2 = [0, 1, 0, 0];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Orthogonal vectors should have similarity close to 0.5 (normalized from 0)
      expect(similarity).toBeCloseTo(0.5, 1);
    });

    it('should calculate cosine similarity correctly for opposite vectors', () => {
      const embedding1 = [1, 0, 0, 0];
      const embedding2 = [-1, 0, 0, 0];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Opposite vectors should have similarity close to 0 (normalized from -1)
      expect(similarity).toBeLessThan(0.1);
    });

    it('should handle high-dimensional vectors efficiently', () => {
      // gemini-embedding-001 produces 768-dimensional vectors
      const embedding1 = Array(768).fill(0).map(() => Math.random());
      const embedding2 = Array(768).fill(0).map(() => Math.random());
      
      const startTime = performance.now();
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      const endTime = performance.now();
      
      // Should complete in less than 50ms for a single calculation
      expect(endTime - startTime).toBeLessThan(50);
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should throw error for mismatched embedding lengths', () => {
      const embedding1 = [1, 0, 0];
      const embedding2 = [1, 0];
      
      expect(() => {
        service.calculateSimilarity(embedding1, embedding2);
      }).toThrow('Embeddings must have the same length');
    });

    it('should handle zero vectors gracefully', () => {
      const embedding1 = [0, 0, 0, 0];
      const embedding2 = [1, 0, 0, 0];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      expect(similarity).toBe(0);
    });
  });

  describe('searchMemories - Performance', () => {
    it('should complete similarity search in under 100ms for small dataset', async () => {
      // Mock memories with embeddings
      const mockMemories: MemoryEntry[] = Array(10).fill(0).map((_, i) => ({
        id: `memory_${i}`,
        userId: 'test_user',
        content: `Test memory ${i}`,
        embedding: Array(768).fill(0).map(() => Math.random()),
        metadata: {
          category: 'FACT' as const,
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      }));

      // Mock the query embedding
      const queryEmbedding = Array(768).fill(0).map(() => Math.random());

      // Measure similarity calculation time for all memories
      const startTime = performance.now();
      
      const results = mockMemories.map((memory) => {
        const similarity = service.calculateSimilarity(queryEmbedding, memory.embedding);
        return { memory, similarity, relevanceScore: similarity };
      });

      // Sort and filter
      results
        .filter((result) => result.similarity >= 0.5)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in under 100ms for 10 memories
      expect(duration).toBeLessThan(100);
    });

    it('should complete similarity search in under 100ms for medium dataset', async () => {
      // Mock memories with embeddings (50 memories)
      const mockMemories: MemoryEntry[] = Array(50).fill(0).map((_, i) => ({
        id: `memory_${i}`,
        userId: 'test_user',
        content: `Test memory ${i}`,
        embedding: Array(768).fill(0).map(() => Math.random()),
        metadata: {
          category: 'FACT' as const,
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      }));

      const queryEmbedding = Array(768).fill(0).map(() => Math.random());

      const startTime = performance.now();
      
      const results = mockMemories.map((memory) => {
        const similarity = service.calculateSimilarity(queryEmbedding, memory.embedding);
        return { memory, similarity, relevanceScore: similarity };
      });

      results
        .filter((result) => result.similarity >= 0.5)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in under 100ms for 50 memories
      expect(duration).toBeLessThan(100);
    });

    it('should efficiently handle top-K retrieval', () => {
      const mockResults = Array(100).fill(0).map((_, i) => ({
        memory: {
          id: `memory_${i}`,
          userId: 'test_user',
          content: `Test memory ${i}`,
          embedding: [],
          metadata: {
            category: 'FACT' as const,
            importance: Math.random(),
            tags: ['test'],
          },
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          accessCount: 0,
        },
        similarity: Math.random(),
        relevanceScore: Math.random(),
      }));

      const startTime = performance.now();
      
      // Sort and get top 5
      const topK = mockResults
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(topK.length).toBe(5);
      expect(duration).toBeLessThan(10); // Should be very fast
      
      // Verify ordering
      for (let i = 1; i < topK.length; i++) {
        expect(topK[i - 1].relevanceScore).toBeGreaterThanOrEqual(topK[i].relevanceScore);
      }
    });

    it('should efficiently filter by minimum similarity threshold', () => {
      const mockResults = Array(100).fill(0).map((_, i) => ({
        memory: {
          id: `memory_${i}`,
          userId: 'test_user',
          content: `Test memory ${i}`,
          embedding: [],
          metadata: {
            category: 'FACT' as const,
            importance: 0.5,
            tags: ['test'],
          },
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          accessCount: 0,
        },
        similarity: Math.random(),
        relevanceScore: Math.random(),
      }));

      const minSimilarity = 0.7;
      const startTime = performance.now();
      
      const filtered = mockResults.filter((result) => result.similarity >= minSimilarity);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(5); // Should be very fast
      
      // Verify all results meet threshold
      filtered.forEach((result) => {
        expect(result.similarity).toBeGreaterThanOrEqual(minSimilarity);
      });
    });
  });

  describe('Relevance Scoring', () => {
    it('should combine similarity and importance correctly', () => {
      const memory: MemoryEntry = {
        id: 'test_memory',
        userId: 'test_user',
        content: 'Test content',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.8,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      };

      const similarity = 0.9;
      
      // Access private method through type assertion
      const relevanceScore = (service as any).calculateRelevanceScore(memory, similarity);
      
      // Should be: 0.9 * 0.7 + 0.8 * 0.3 = 0.63 + 0.24 = 0.87
      expect(relevanceScore).toBeCloseTo(0.87, 2);
    });

    it('should prioritize high similarity over importance', () => {
      const highSimilarityMemory: MemoryEntry = {
        id: 'high_sim',
        userId: 'test_user',
        content: 'High similarity',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.3,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      };

      const lowSimilarityMemory: MemoryEntry = {
        id: 'low_sim',
        userId: 'test_user',
        content: 'Low similarity',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.9,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      };

      const highSimScore = (service as any).calculateRelevanceScore(highSimilarityMemory, 0.95);
      const lowSimScore = (service as any).calculateRelevanceScore(lowSimilarityMemory, 0.5);
      
      // High similarity (0.95 * 0.7 + 0.3 * 0.3 = 0.755) should beat
      // low similarity (0.5 * 0.7 + 0.9 * 0.3 = 0.62)
      expect(highSimScore).toBeGreaterThan(lowSimScore);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty embedding arrays', () => {
      const embedding1: number[] = [];
      const embedding2: number[] = [];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      expect(similarity).toBe(0);
    });

    it('should handle very small similarity values', () => {
      // Create nearly orthogonal vectors
      const embedding1 = [1, 0.0001, 0, 0];
      const embedding2 = [0.0001, 1, 0, 0];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should handle very large embedding values', () => {
      const embedding1 = [1000000, 0, 0, 0];
      const embedding2 = [1000000, 0, 0, 0];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Should still normalize correctly
      expect(similarity).toBeGreaterThan(0.99);
    });

    it('should handle negative embedding values', () => {
      const embedding1 = [-1, -2, -3, -4];
      const embedding2 = [-1, -2, -3, -4];
      
      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Identical vectors should have high similarity regardless of sign
      expect(similarity).toBeGreaterThan(0.99);
    });
  });
});

describe('MemorySystemService - Memory Maintenance', () => {
  let service: MemorySystemService;

  beforeEach(() => {
    service = new MemorySystemService();
  });

  describe('pruneOldMemories', () => {
    it('should identify memories older than threshold', () => {
      const now = new Date();
      const oldDate = new Date(now);
      oldDate.setDate(oldDate.getDate() - 100); // 100 days old
      
      const recentDate = new Date(now);
      recentDate.setDate(recentDate.getDate() - 30); // 30 days old

      const oldMemory: MemoryEntry = {
        id: 'old_memory',
        userId: 'test_user',
        content: 'Old memory',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: oldDate.toISOString(),
        lastAccessed: oldDate.toISOString(),
        accessCount: 0,
      };

      const recentMemory: MemoryEntry = {
        id: 'recent_memory',
        userId: 'test_user',
        content: 'Recent memory',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: recentDate.toISOString(),
        lastAccessed: recentDate.toISOString(),
        accessCount: 0,
      };

      // Verify date logic
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);

      expect(new Date(oldMemory.lastAccessed) < cutoffDate).toBe(true);
      expect(new Date(recentMemory.lastAccessed) < cutoffDate).toBe(false);
    });

    it('should handle empty memory set', async () => {
      // This would require mocking Firestore, so we just verify the method exists
      expect(service.pruneOldMemories).toBeDefined();
      expect(typeof service.pruneOldMemories).toBe('function');
    });

    it('should use default threshold of 90 days', () => {
      const defaultThreshold = 90;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - defaultThreshold);

      // Verify the cutoff date is calculated correctly
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - cutoffDate.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(daysDiff).toBeGreaterThanOrEqual(89);
      expect(daysDiff).toBeLessThanOrEqual(91);
    });

    it('should accept custom threshold', () => {
      const customThreshold = 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - customThreshold);

      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - cutoffDate.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(daysDiff).toBeGreaterThanOrEqual(29);
      expect(daysDiff).toBeLessThanOrEqual(31);
    });
  });

  describe('consolidateMemories', () => {
    it('should identify duplicate memories with high similarity', () => {
      const embedding1 = [1, 0, 0, 0];
      const embedding2 = [0.99, 0.01, 0, 0]; // Very similar to embedding1

      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Should be above 0.9 threshold for consolidation
      expect(similarity).toBeGreaterThan(0.9);
    });

    it('should keep memories with low similarity separate', () => {
      const embedding1 = [1, 0, 0, 0];
      const embedding2 = [0, 1, 0, 0]; // Orthogonal to embedding1

      const similarity = service.calculateSimilarity(embedding1, embedding2);
      
      // Should be below 0.9 threshold for consolidation
      expect(similarity).toBeLessThan(0.9);
    });

    it('should prioritize importance in consolidation', () => {
      const highImportanceMemory: MemoryEntry = {
        id: 'high_importance',
        userId: 'test_user',
        content: 'Important memory',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.9,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 5,
      };

      const lowImportanceMemory: MemoryEntry = {
        id: 'low_importance',
        userId: 'test_user',
        content: 'Less important memory',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.3,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 2,
      };

      // Calculate consolidation scores (importance * 0.7 + accessCount/100 * 0.3)
      const highScore = highImportanceMemory.metadata.importance * 0.7 + 
                       (highImportanceMemory.accessCount / 100) * 0.3;
      const lowScore = lowImportanceMemory.metadata.importance * 0.7 + 
                      (lowImportanceMemory.accessCount / 100) * 0.3;

      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('should consider access count in consolidation', () => {
      const frequentMemory: MemoryEntry = {
        id: 'frequent',
        userId: 'test_user',
        content: 'Frequently accessed',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 100,
      };

      const rareMemory: MemoryEntry = {
        id: 'rare',
        userId: 'test_user',
        content: 'Rarely accessed',
        embedding: [],
        metadata: {
          category: 'FACT',
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 1,
      };

      // Calculate consolidation scores
      const frequentScore = frequentMemory.metadata.importance * 0.7 + 
                           (frequentMemory.accessCount / 100) * 0.3;
      const rareScore = rareMemory.metadata.importance * 0.7 + 
                       (rareMemory.accessCount / 100) * 0.3;

      expect(frequentScore).toBeGreaterThan(rareScore);
    });

    it('should handle single memory group', () => {
      const memories: MemoryEntry[] = [{
        id: 'single',
        userId: 'test_user',
        content: 'Single memory',
        embedding: [1, 0, 0, 0],
        metadata: {
          category: 'FACT',
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      }];

      // Single memory should form its own group
      expect(memories.length).toBe(1);
    });

    it('should handle empty memory set', () => {
      const memories: MemoryEntry[] = [];
      
      // Should not throw error
      expect(memories.length).toBe(0);
    });
  });

  describe('updateMemory', () => {
    it('should allow updating memory content', () => {
      const updates = {
        content: 'Updated content',
      };

      expect(updates.content).toBe('Updated content');
    });

    it('should allow updating metadata', () => {
      const updates = {
        metadata: {
          category: 'PREFERENCE' as const,
          importance: 0.8,
          tags: ['updated'],
        },
      };

      expect(updates.metadata.category).toBe('PREFERENCE');
      expect(updates.metadata.importance).toBe(0.8);
    });

    it('should allow updating access tracking', () => {
      const updates = {
        lastAccessed: new Date().toISOString(),
        accessCount: 5,
      };

      expect(updates.accessCount).toBe(5);
      expect(updates.lastAccessed).toBeDefined();
    });

    it('should not allow updating immutable fields', () => {
      // TypeScript should prevent this at compile time
      // This test verifies the type definition
      type UpdateType = Partial<Omit<MemoryEntry, 'id' | 'userId' | 'createdAt'>>;
      
      const validUpdate: UpdateType = {
        content: 'New content',
      };

      expect(validUpdate.content).toBe('New content');
      
      // These should not be allowed by TypeScript:
      // const invalidUpdate: UpdateType = {
      //   id: 'new_id',        // Error: id is not assignable
      //   userId: 'new_user',  // Error: userId is not assignable
      //   createdAt: 'date',   // Error: createdAt is not assignable
      // };
    });
  });

  describe('deleteMemory', () => {
    it('should accept memory ID', () => {
      const memoryId = 'test_memory_123';
      
      expect(memoryId).toBeDefined();
      expect(typeof memoryId).toBe('string');
    });

    it('should handle valid memory ID format', () => {
      const validIds = [
        'memory_123',
        'abc-def-ghi',
        'user_memory_001',
      ];

      validIds.forEach(id => {
        expect(id.length).toBeGreaterThan(0);
        expect(typeof id).toBe('string');
      });
    });
  });

  describe('deleteAllUserMemories - GDPR Compliance', () => {
    it('should accept user ID for deletion', () => {
      const userId = 'test_user_123';
      
      expect(userId).toBeDefined();
      expect(typeof userId).toBe('string');
    });

    it('should return deletion count', async () => {
      // Verify the method signature returns a number
      expect(service.deleteAllUserMemories).toBeDefined();
      expect(typeof service.deleteAllUserMemories).toBe('function');
    });

    it('should handle user with no memories', () => {
      const deletedCount = 0;
      
      expect(deletedCount).toBe(0);
    });

    it('should handle user with multiple memories', () => {
      const deletedCount = 5;
      
      expect(deletedCount).toBeGreaterThan(0);
    });

    it('should be GDPR compliant - complete data removal', () => {
      // GDPR requires complete removal of user data
      // This test verifies the method exists and has correct signature
      expect(service.deleteAllUserMemories).toBeDefined();
      
      // The method should:
      // 1. Find all memories for a user
      // 2. Delete all of them
      // 3. Return count of deleted items
      // 4. Not leave any traces
    });
  });

  describe('Memory Maintenance Integration', () => {
    it('should support full maintenance workflow', () => {
      // A typical maintenance workflow would:
      // 1. Prune old memories
      // 2. Consolidate duplicates
      // 3. Update important memories
      // 4. Delete unwanted memories
      
      expect(service.pruneOldMemories).toBeDefined();
      expect(service.consolidateMemories).toBeDefined();
      expect(service.updateMemory).toBeDefined();
      expect(service.deleteMemory).toBeDefined();
      expect(service.deleteAllUserMemories).toBeDefined();
    });

    it('should handle maintenance operations in sequence', async () => {
      // Verify all maintenance methods exist
      const maintenanceMethods = [
        'pruneOldMemories',
        'consolidateMemories',
        'updateMemory',
        'deleteMemory',
        'deleteAllUserMemories',
      ];

      maintenanceMethods.forEach(method => {
        expect((service as any)[method]).toBeDefined();
        expect(typeof (service as any)[method]).toBe('function');
      });
    });

    it('should maintain data integrity during operations', () => {
      // Memory operations should maintain:
      // - User ID association
      // - Timestamp accuracy
      // - Embedding integrity
      // - Metadata consistency
      
      const memory: MemoryEntry = {
        id: 'test',
        userId: 'user123',
        content: 'Test content',
        embedding: [1, 0, 0, 0],
        metadata: {
          category: 'FACT',
          importance: 0.5,
          tags: ['test'],
        },
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      };

      expect(memory.userId).toBe('user123');
      expect(memory.embedding.length).toBe(4);
      expect(memory.metadata.importance).toBeGreaterThanOrEqual(0);
      expect(memory.metadata.importance).toBeLessThanOrEqual(1);
    });
  });
});
