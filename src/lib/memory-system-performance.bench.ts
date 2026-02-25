/**
 * Memory System Performance Benchmark
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Benchmarks to verify <100ms performance target for similarity search
 * Requirement: 13.10 - Memory System SHALL complete similarity search in under 100ms
 */

import { MemorySystemService } from './memory-system-service';
import type { MemoryEntry } from './memory-system-service';

/**
 * Generate a realistic embedding vector (768 dimensions like gemini-embedding-001)
 */
function generateRealisticEmbedding(): number[] {
  return Array(768).fill(0).map(() => Math.random() * 2 - 1); // Range: -1 to 1
}

/**
 * Generate mock memory entries
 */
function generateMockMemories(count: number): MemoryEntry[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `memory_${i}`,
    userId: 'benchmark_user',
    content: `Memory content ${i}: This is a test memory entry with some realistic text content that might be stored in the system.`,
    embedding: generateRealisticEmbedding(),
    metadata: {
      category: ['PREFERENCE', 'FACT', 'CONTEXT', 'SKILL', 'CONVERSATION'][i % 5] as any,
      importance: Math.random(),
      tags: [`tag${i % 10}`, `category${i % 5}`],
    },
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    accessCount: Math.floor(Math.random() * 100),
  }));
}

/**
 * Benchmark similarity search performance
 */
function benchmarkSimilaritySearch(memoryCount: number, iterations: number = 100): {
  avgTime: number;
  minTime: number;
  maxTime: number;
  p95Time: number;
  p99Time: number;
} {
  const service = new MemorySystemService();
  const memories = generateMockMemories(memoryCount);
  const queryEmbedding = generateRealisticEmbedding();
  
  const times: number[] = [];

  // Warm-up run
  for (let i = 0; i < 10; i++) {
    const results = memories.map((memory) => {
      const similarity = service.calculateSimilarity(queryEmbedding, memory.embedding);
      return { memory, similarity, relevanceScore: similarity * 0.7 + memory.metadata.importance * 0.3 };
    });
    results
      .filter((result) => result.similarity >= 0.5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  }

  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    const results = memories.map((memory) => {
      const similarity = service.calculateSimilarity(queryEmbedding, memory.embedding);
      return { memory, similarity, relevanceScore: similarity * 0.7 + memory.metadata.importance * 0.3 };
    });
    
    results
      .filter((result) => result.similarity >= 0.5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
    
    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  times.sort((a, b) => a - b);
  
  return {
    avgTime: times.reduce((sum, t) => sum + t, 0) / times.length,
    minTime: times[0],
    maxTime: times[times.length - 1],
    p95Time: times[Math.floor(times.length * 0.95)],
    p99Time: times[Math.floor(times.length * 0.99)],
  };
}

/**
 * Run comprehensive benchmarks
 */
function runBenchmarks() {
  console.log('='.repeat(80));
  console.log('Memory System Performance Benchmark');
  console.log('Target: <100ms for similarity search (Requirement 13.10)');
  console.log('='.repeat(80));
  console.log();

  const testCases = [
    { memories: 10, description: 'Small dataset (10 memories)' },
    { memories: 50, description: 'Medium dataset (50 memories)' },
    { memories: 100, description: 'Large dataset (100 memories)' },
    { memories: 200, description: 'Very large dataset (200 memories)' },
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.description}`);
    const results = benchmarkSimilaritySearch(testCase.memories, 100);
    
    console.log(`  Average time: ${results.avgTime.toFixed(2)}ms`);
    console.log(`  Min time:     ${results.minTime.toFixed(2)}ms`);
    console.log(`  Max time:     ${results.maxTime.toFixed(2)}ms`);
    console.log(`  P95 time:     ${results.p95Time.toFixed(2)}ms`);
    console.log(`  P99 time:     ${results.p99Time.toFixed(2)}ms`);
    
    const meetsTarget = results.p95Time < 100;
    console.log(`  Status:       ${meetsTarget ? '✓ PASS' : '✗ FAIL'} (P95 < 100ms)`);
    console.log();
  }

  // Test individual operations
  console.log('Individual Operation Benchmarks:');
  console.log('-'.repeat(80));
  
  const service = new MemorySystemService();
  const embedding1 = generateRealisticEmbedding();
  const embedding2 = generateRealisticEmbedding();
  
  // Benchmark single similarity calculation
  const singleCalcTimes: number[] = [];
  for (let i = 0; i < 10000; i++) {
    const start = performance.now();
    service.calculateSimilarity(embedding1, embedding2);
    const end = performance.now();
    singleCalcTimes.push(end - start);
  }
  
  const avgSingleCalc = singleCalcTimes.reduce((sum, t) => sum + t, 0) / singleCalcTimes.length;
  console.log(`  Single similarity calculation: ${avgSingleCalc.toFixed(4)}ms (avg over 10,000 runs)`);
  
  // Estimate throughput
  const throughput = 1000 / avgSingleCalc;
  console.log(`  Throughput: ~${Math.floor(throughput)} calculations/second`);
  console.log();

  console.log('='.repeat(80));
  console.log('Benchmark Complete');
  console.log('='.repeat(80));
}

// Run benchmarks if executed directly
if (require.main === module) {
  runBenchmarks();
}

export { benchmarkSimilaritySearch, runBenchmarks };
