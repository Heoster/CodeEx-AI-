/**
 * Browser-based Model Testing Script
 * Open this in browser console at http://localhost:3000/test-models-ui
 */

// Test all models with a simple problem
async function testAllModels() {
  const models = [
    'llama-3.1-8b-instant',
    'llama-3.1-8b-instruct-hf', 
    'deepseek-v3.2',
    'rnj-1-instruct',
    'gpt-oss-20b',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'auto'
  ];

  const testProblem = "What is 15 + 27?";
  const results = [];

  console.log('🚀 Starting browser-based model testing...');

  for (const model of models) {
    console.log(`Testing ${model}...`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: testProblem,
          tone: 'helpful',
          technicalLevel: 'beginner',
          preferredModel: model === 'auto' ? undefined : model
        })
      });

      const endTime = Date.now();
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      results.push({
        model,
        modelUsed: data.modelUsed,
        success: true,
        responseTime: endTime - startTime,
        response: data.solution?.substring(0, 100) + '...'
      });

      console.log(`✅ ${model} -> ${data.modelUsed} (${endTime - startTime}ms)`);
      
    } catch (error) {
      results.push({
        model,
        success: false,
        error: error.message
      });
      console.log(`❌ ${model}: ${error.message}`);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 Test Results Summary:');
  console.table(results);
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Success Rate: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
  
  return results;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🧪 Browser Model Testing Script Loaded');
  console.log('Run testAllModels() to start testing all models');
  
  // Make function globally available
  window.testAllModels = testAllModels;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAllModels };
}