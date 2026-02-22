#!/usr/bin/env node

/**
 * Deployment Verification Script for CODEEX AI
 * Verifies that the Netlify deployment is working correctly
 */

const https = require('https');

const SITE_URL = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://codeex-ai.netlify.app';

console.log(`🔍 Verifying deployment at: ${SITE_URL}`);

// Test endpoints to verify
const endpoints = [
  '/',
  '/api/health',
  '/chat',
  '/documentation',
];

async function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = `${SITE_URL}${path}`;
    console.log(`Testing: ${url}`);
    
    https.get(url, (res) => {
      console.log(`✅ ${path}: ${res.statusCode}`);
      resolve({ path, status: res.statusCode, success: res.statusCode < 400 });
    }).on('error', (err) => {
      console.log(`❌ ${path}: ${err.message}`);
      resolve({ path, error: err.message, success: false });
    });
  });
}

async function verifyDeployment() {
  console.log('🚀 Starting deployment verification...');
  
  const results = await Promise.all(endpoints.map(testEndpoint));
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${successful}/${total} endpoints working`);
  
  if (successful === total) {
    console.log('🎉 Deployment verification passed!');
    process.exit(0);
  } else {
    console.log('❌ Deployment verification failed');
    process.exit(1);
  }
}

verifyDeployment();