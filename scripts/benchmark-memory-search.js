/**
 * Memory System Performance Benchmark Script
 * Verifies <100ms performance target for similarity search
 */

// Simple cosine similarity implementation
function calculateSimilarity(embedding1, embedding2) {
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

  const cosineSimilarity = dotProduct / magnitude;
  return (cosineSimilarity + 1) / 2;
}

// Generate realistic embedding
function generateEmbedding() {
  return Array(768).fill(0).map(() => Math.random() * 2 - 1);
}

// Generate mock memories
function generateMemories(count) {
  return Array(count).fill(0).map((_, i) => ({
    id: `memory_${i}`,
    embedding: generateEmbedding(),
    importance: Math.random(),
  }));
}

// Benchmark similarity search
function benchmarkSearch(memoryCount, iterations = 100) {
  const memories = generateMemories(memoryCount);
  const queryEmbedding = generateEmbedding();
  const times = [];

  // Warm-up
  for (let i = 0; i < 10; i++) {
    const results = memories.map((memory) => {
      const similarity = calculateSimilarity(queryEmbedding, memory.embedding);
      return { memory, similarity, relevanceScore: similarity * 0.7 + memory.importance * 0.3 };
    });
    results
      .filter((r) => r.similarity >= 0.5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
  }

  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    const results = memories.map((memory) => {
      const similarity = calculateSimilarity(queryEmbedding, memory.embedding);
      return { memory, similarity, relevanceScore: similarity * 0.7 + memory.importance * 0.3 };
    });
    
    results
      .filter((r) => r.similarity >= 0.5)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);
    
    const end = performance.now();
    times.push(end - start);
  }

  times.sort((a, b) => a - b);
  
  return {
    avg: times.reduce((sum, t) => sum + t, 0) / times.length,
    min: times[0],
    max: times[times.length - 1],
    p95: times[Math.floor(times.length * 0.95)],
    p99: times[Math.floor(times.length * 0.99)],
  };
}

// Run benchmarks
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
  const results = benchmarkSearch(testCase.memories, 100);
  
  console.log(`  Average time: ${results.avg.toFixed(2)}ms`);
  console.log(`  Min time:     ${results.min.toFixed(2)}ms`);
  console.log(`  Max time:     ${results.max.toFixed(2)}ms`);
  console.log(`  P95 time:     ${results.p95.toFixed(2)}ms`);
  console.log(`  P99 time:     ${results.p99.toFixed(2)}ms`);
  
  const meetsTarget = results.p95 < 100;
  console.log(`  Status:       ${meetsTarget ? '✓ PASS' : '✗ FAIL'} (P95 < 100ms)`);
  console.log();
}

console.log('='.repeat(80));
console.log('Benchmark Complete');
console.log('='.repeat(80));
