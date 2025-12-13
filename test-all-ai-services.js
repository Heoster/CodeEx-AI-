/**
 * Comprehensive AI Services Test Suite
 * Tests all 5 AI services with different models and scenarios
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Global fetch for Node.js
const fetch = globalThis.fetch;

const APP_URL = 'http://localhost:3000';

// Test models from different providers
const testModels = [
  'llama-3.1-8b-instant',        // Groq - Fast
  'llama-3.1-8b-instruct-hf',   // HF - Coding
  'deepseek-v3.2',               // HF - Coding
  'rnj-1-instruct',              // HF - Conversation
  'gpt-oss-20b',                 // HF - General
  'gemini-2.5-flash',            // Google - Multimodal
  'gemini-flash-latest',         // Google - Latest
  'gemini-2.5-flash-lite',       // Google - Lite
  'auto'                         // Auto routing
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Create simple test image (base64 encoded 1x1 pixel PNG)
const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
// Create simple test PDF (minimal base64 encoded PDF)
const testPdfBase64 = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCAxMjAgMTIwXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMTAgMDAwMDAgbgowMDAwMDAwMDUzIDAwMDAwIG4KMDAwMDAwMDEyNSAwMDAwMCBuCnRyYWlsZXIKPDwKL1NpemUgNAovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMTg0CiUlRU9G';

/**
 * Test 1: Problem Solving Service
 */
async function testSolveService() {
  log('cyan', '\n🧮 Testing Problem Solving Service...');
  
  const testCases = [
    {
      name: 'Math Problem',
      data: {
        problem: 'What is 15 + 27?',
        tone: 'helpful',
        technicalLevel: 'beginner'
      }
    },
    {
      name: 'Coding Problem',
      data: {
        problem: 'Write a simple Python function to reverse a string',
        tone: 'formal',
        technicalLevel: 'intermediate'
      }
    },
    {
      name: 'Logic Problem',
      data: {
        problem: 'If all roses are flowers and some flowers are red, can we conclude that some roses are red?',
        tone: 'casual',
        technicalLevel: 'expert'
      }
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    for (const model of testModels.slice(0, 2)) { // Test with fewer models for speed
      log('yellow', `  Testing ${testCase.name} with ${model}...`);
      
      try {
        const response = await fetch(`${APP_URL}/api/ai/solve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...testCase.data,
            preferredModel: model === 'auto' ? undefined : model
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        results.push({
          service: 'solve',
          testCase: testCase.name,
          model,
          success: true,
          modelUsed: data.modelUsed,
          responseLength: data.solution?.length || 0
        });

        log('green', `    ✅ ${testCase.name} (${model}): ${data.solution?.substring(0, 50)}...`);
        log('blue', `       Model used: ${data.modelUsed}`);
        
      } catch (error) {
        results.push({
          service: 'solve',
          testCase: testCase.name,
          model,
          success: false,
          error: error.message
        });
        log('red', `    ❌ ${testCase.name} (${model}): ${error.message}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
/**
 * Test 2: Summarization Service
 */
async function testSummarizeService() {
  log('cyan', '\n📝 Testing Summarization Service...');
  
  const testCases = [
    {
      name: 'Short Article',
      data: {
        text: 'Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can think and work like humans. Some of the activities computers with artificial intelligence are designed for include speech recognition, learning, planning, and problem solving. AI is used in various industries including healthcare, finance, transportation, and entertainment. Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed.',
        style: 'brief'
      }
    },
    {
      name: 'Technical Content',
      data: {
        text: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Facebook and the community. The main purpose of React is to be fast, scalable, and simple. It works only on user interfaces in the application. This corresponds to the view in the MVC template. It can be used with a combination of other JavaScript libraries or frameworks, such as Angular JS in MVC. React allows developers to create large web applications that can change data, without reloading the page. The main purpose of React is to be fast, scalable, and simple.',
        style: 'detailed'
      }
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    for (const model of testModels.slice(0, 2)) { // Test with fewer models
      log('yellow', `  Testing ${testCase.name} with ${model}...`);
      
      try {
        const response = await fetch(`${APP_URL}/api/ai/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...testCase.data,
            preferredModel: model === 'auto' ? undefined : model
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        results.push({
          service: 'summarize',
          testCase: testCase.name,
          model,
          success: true,
          modelUsed: data.modelUsed,
          responseLength: data.summary?.length || 0
        });

        log('green', `    ✅ ${testCase.name} (${model}): ${data.summary?.substring(0, 50)}...`);
        log('blue', `       Model used: ${data.modelUsed}`);
        
      } catch (error) {
        results.push({
          service: 'summarize',
          testCase: testCase.name,
          model,
          success: false,
          error: error.message
        });
        log('red', `    ❌ ${testCase.name} (${model}): ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
/**
 * Test 3: Search Service
 */
async function testSearchService() {
  log('cyan', '\n🔍 Testing Search Service...');
  
  const testCases = [
    {
      name: 'Tech Query',
      data: {
        query: 'What is the latest version of Node.js?'
      }
    },
    {
      name: 'General Knowledge',
      data: {
        query: 'What is the capital of Japan?'
      }
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    for (const model of testModels.slice(0, 2)) { // Test with fewer models
      log('yellow', `  Testing ${testCase.name} with ${model}...`);
      
      try {
        const response = await fetch(`${APP_URL}/api/ai/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...testCase.data,
            preferredModel: model === 'auto' ? undefined : model
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        results.push({
          service: 'search',
          testCase: testCase.name,
          model,
          success: true,
          modelUsed: data.modelUsed,
          responseLength: data.answer?.length || 0,
          sourcesCount: data.sources?.length || 0
        });

        log('green', `    ✅ ${testCase.name} (${model}): ${data.answer?.substring(0, 50)}...`);
        log('magenta', `       Sources: ${data.sources?.length || 0} found`);
        log('blue', `       Model used: ${data.modelUsed}`);
        
      } catch (error) {
        results.push({
          service: 'search',
          testCase: testCase.name,
          model,
          success: false,
          error: error.message
        });
        log('red', `    ❌ ${testCase.name} (${model}): ${error.message}`);
      }
      
      // Longer delay for search as it involves external API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}
/**
 * Test 4: Image Solver Service
 */
async function testImageSolverService() {
  log('cyan', '\n🖼️ Testing Image Solver Service...');
  
  // Only test with multimodal models for image processing
  const multimodalModels = ['gemini-2.5-flash', 'auto'];
  
  const testCases = [
    {
      name: 'Math Problem Image',
      data: {
        imageDataUri: testImageBase64,
        problemType: 'math'
      }
    },
    {
      name: 'General Image Analysis',
      data: {
        imageDataUri: testImageBase64,
        problemType: 'general'
      }
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    for (const model of multimodalModels) {
      log('yellow', `  Testing ${testCase.name} with ${model}...`);
      
      try {
        const response = await fetch(`${APP_URL}/api/ai/image-solver`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...testCase.data,
            preferredModel: model === 'auto' ? undefined : model
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        results.push({
          service: 'image-solver',
          testCase: testCase.name,
          model,
          success: true,
          modelUsed: data.modelUsed,
          responseLength: data.solution?.length || 0,
          recognized: !!data.recognizedContent
        });

        log('green', `    ✅ ${testCase.name} (${model}): ${data.solution?.substring(0, 50)}...`);
        log('magenta', `       Recognized: ${data.recognizedContent?.substring(0, 30)}...`);
        log('blue', `       Model used: ${data.modelUsed}`);
        
      } catch (error) {
        results.push({
          service: 'image-solver',
          testCase: testCase.name,
          model,
          success: false,
          error: error.message
        });
        log('red', `    ❌ ${testCase.name} (${model}): ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}
/**
 * Test 5: PDF Analyzer Service
 */
async function testPdfAnalyzerService() {
  log('cyan', '\n📄 Testing PDF Analyzer Service...');
  
  // Test with models that can handle document analysis
  const documentModels = ['gemini-2.5-flash', 'auto'];
  
  const testCases = [
    {
      name: 'PDF Analysis',
      data: {
        pdfDataUri: testPdfBase64,
        question: 'What is the content of this PDF?'
      }
    },
    {
      name: 'PDF Summary',
      data: {
        pdfDataUri: testPdfBase64,
        question: 'Summarize the main points of this document.'
      }
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    for (const model of documentModels) {
      log('yellow', `  Testing ${testCase.name} with ${model}...`);
      
      try {
        const response = await fetch(`${APP_URL}/api/ai/pdf-analyzer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...testCase.data,
            preferredModel: model === 'auto' ? undefined : model
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        results.push({
          service: 'pdf-analyzer',
          testCase: testCase.name,
          model,
          success: true,
          modelUsed: data.modelUsed,
          responseLength: data.answer?.length || 0
        });

        log('green', `    ✅ ${testCase.name} (${model}): ${data.answer?.substring(0, 50)}...`);
        log('blue', `       Model used: ${data.modelUsed}`);
        
      } catch (error) {
        results.push({
          service: 'pdf-analyzer',
          testCase: testCase.name,
          model,
          success: false,
          error: error.message
        });
        log('red', `    ❌ ${testCase.name} (${model}): ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}
/**
 * Generate comprehensive test report
 */
function generateReport(allResults) {
  log('bold', '\n📊 COMPREHENSIVE TEST REPORT');
  log('bold', '='.repeat(50));
  
  // Calculate statistics
  let totalTests = 0;
  let totalSuccess = 0;
  const serviceStats = {};
  const modelStats = {};
  
  allResults.forEach(result => {
    totalTests++;
    if (result.success) totalSuccess++;
    
    // Service statistics
    if (!serviceStats[result.service]) {
      serviceStats[result.service] = { total: 0, success: 0 };
    }
    serviceStats[result.service].total++;
    if (result.success) serviceStats[result.service].success++;
    
    // Model statistics
    if (result.modelUsed) {
      if (!modelStats[result.modelUsed]) {
        modelStats[result.modelUsed] = { total: 0, success: 0 };
      }
      modelStats[result.modelUsed].total++;
      if (result.success) modelStats[result.modelUsed].success++;
    }
  });
  
  // Overall statistics
  const rate = Math.round(totalSuccess/totalTests*100);
  const status = rate === 100 ? '✅' : rate >= 80 ? '⚠️' : '❌';
  log('green', `\n✅ Overall Success Rate: ${totalSuccess}/${totalTests} (${rate}%)`);
  
  // Service breakdown
  log('cyan', '\n📋 Service Breakdown:');
  Object.entries(serviceStats).forEach(([service, stats]) => {
    const rate = Math.round(stats.success/stats.total*100);
    const status = rate === 100 ? '✅' : rate >= 80 ? '⚠️' : '❌';
    log('blue', `  ${status} ${service}: ${stats.success}/${stats.total} (${rate}%)`);
  });
  
  // Model performance
  log('cyan', '\n🤖 Model Performance:');
  Object.entries(modelStats).forEach(([model, stats]) => {
    const rate = Math.round(stats.success/stats.total*100);
    const status = rate === 100 ? '✅' : rate >= 80 ? '⚠️' : '❌';
    log('magenta', `  ${status} ${model}: ${stats.success}/${stats.total} (${rate}%)`);
  });
  
  // Failed tests
  const failures = allResults.filter(r => !r.success);
  if (failures.length > 0) {
    log('red', '\n❌ Failed Tests:');
    failures.forEach(failure => {
      log('red', `     ${failure.service}/${failure.testCase} (${failure.model}): ${failure.error}`);
    });
  }

  // Save detailed report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    totalTests: totalTests,
    successfulTests: totalSuccess,
    successRate: rate,
    serviceStats,
    modelStats,
    allResults
  };
  
  fs.writeFileSync('ai-services-test-report.json', JSON.stringify(reportData, null, 2));
  log('blue', '\n📄 Detailed report saved to: ai-services-test-report.json');
  
  log('green', '\n🎉 Test Suite Complete!');
}
/**
 * Main test runner
 */
async function runAllTests() {
  log('bold', '🚀 Starting Comprehensive AI Services Test Suite...');
  log('yellow', 'Testing all 5 AI services with multiple models and scenarios\n');
  
  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const allResults = [];
  
  try {
    // Run all service tests
    log('bold', '🧮 Testing Problem Solving Service...');
    const solveResults = await testSolveService();
    allResults.push(...solveResults);
    
    log('bold', '📝 Testing Summarization Service...');
    const summarizeResults = await testSummarizeService();
    allResults.push(...summarizeResults);
    
    log('bold', '🔍 Testing Search Service...');
    const searchResults = await testSearchService();
    allResults.push(...searchResults);
    
    log('bold', '🖼️ Testing Image Solver Service...');
    const imageResults = await testImageSolverService();
    allResults.push(...imageResults);
    
    log('bold', '📄 Testing PDF Analyzer Service...');
    const pdfResults = await testPdfAnalyzerService();
    allResults.push(...pdfResults);
    
    // Generate comprehensive report
    generateReport(allResults);
    
  } catch (error) {
    log('red', `\n💥 Test suite failed: ${error.message}`);
    console.error(error);
  }
}

// Run the test suite
runAllTests();