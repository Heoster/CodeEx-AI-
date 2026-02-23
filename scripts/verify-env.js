#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * Checks if all required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

// Load .env.local if it exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

console.log('\n🔍 CODEEX AI - Environment Variables Check\n');
console.log('='.repeat(60));

// Required variables
const required = {
  'AI Providers (at least one required)': {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  },
  'Firebase (required)': {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  'Application (required)': {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

// Optional variables
const optional = {
  'Email Service (optional)': {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
  },
  'Python TTS (optional)': {
    USE_PYTHON_TTS: process.env.USE_PYTHON_TTS,
    PYTHON_TTS_SERVER_URL: process.env.PYTHON_TTS_SERVER_URL,
  },
  'Analytics (optional)': {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
};

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('\n📋 REQUIRED CONFIGURATION:\n');

Object.entries(required).forEach(([category, vars]) => {
  console.log(`\n${category}:`);
  
  Object.entries(vars).forEach(([key, value]) => {
    const isSet = value && value !== 'your_' && !value.includes('_here') && !value.includes('your-project');
    const status = isSet ? '✅' : '❌';
    const preview = isSet ? `${value.substring(0, 20)}...` : 'NOT SET';
    
    console.log(`  ${status} ${key}: ${preview}`);
    
    if (!isSet) {
      hasErrors = true;
    }
  });
});

// Special check: At least one AI provider must be configured
const aiProviders = [
  process.env.GROQ_API_KEY,
  process.env.GOOGLE_API_KEY,
  process.env.CEREBRAS_API_KEY,
  process.env.HUGGINGFACE_API_KEY,
].filter(key => key && key !== 'your_' && !key.includes('_here'));

if (aiProviders.length === 0) {
  console.log('\n❌ CRITICAL: No AI providers configured!');
  console.log('   At least one of GROQ_API_KEY, GOOGLE_API_KEY, CEREBRAS_API_KEY, or HUGGINGFACE_API_KEY is required.');
  hasErrors = true;
} else {
  console.log(`\n✅ ${aiProviders.length} AI provider(s) configured`);
}

// Check optional variables
console.log('\n\n📋 OPTIONAL CONFIGURATION:\n');

Object.entries(optional).forEach(([category, vars]) => {
  console.log(`\n${category}:`);
  
  Object.entries(vars).forEach(([key, value]) => {
    const isSet = value && value !== 'your_' && !value.includes('_here');
    const status = isSet ? '✅' : '⚠️';
    const preview = isSet ? `${value.substring(0, 20)}...` : 'NOT SET';
    
    console.log(`  ${status} ${key}: ${preview}`);
    
    if (!isSet) {
      hasWarnings = true;
    }
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 SUMMARY:\n');

if (!hasErrors) {
  console.log('✅ All required environment variables are configured!');
  console.log('✅ You can start the development server with: npm run dev');
  console.log('✅ Visit http://localhost:3000 to test the app');
  console.log('✅ Check http://localhost:3000/api/health for detailed status');
} else {
  console.log('❌ Some required environment variables are missing!');
  console.log('❌ Please update your .env.local file before starting the app');
  console.log('\n📖 See LOCAL_TESTING_SETUP.md for detailed setup instructions');
}

if (hasWarnings) {
  console.log('\n⚠️  Some optional features are not configured');
  console.log('   The app will work, but some features may be limited');
}

console.log('\n' + '='.repeat(60));

// Exit with error code if required vars are missing
if (hasErrors) {
  console.log('\n❌ Environment check failed!\n');
  process.exit(1);
} else {
  console.log('\n✅ Environment check passed!\n');
  process.exit(0);
}
