#!/usr/bin/env node

/**
 * Deployment Readiness Check
 * Verifies that all required configurations are in place before deploying
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚀 CODEEX AI - Deployment Readiness Check\n');
console.log('='.repeat(70));

let allChecks = true;

// Check 1: .env.local exists
console.log('\n📋 Checking local environment configuration...\n');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  // Load and parse .env.local
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      envVars[key] = value;
    }
  });
  
  // Check critical variables
  const criticalVars = [
    'GROQ_API_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];
  
  let missingVars = [];
  let placeholderVars = [];
  
  criticalVars.forEach(varName => {
    const value = envVars[varName];
    if (!value) {
      missingVars.push(varName);
    } else if (value.includes('your_') || value.includes('_here') || value.includes('your-project')) {
      placeholderVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('❌ Missing critical variables:');
    missingVars.forEach(v => console.log(`   - ${v}`));
    allChecks = false;
  }
  
  if (placeholderVars.length > 0) {
    console.log('⚠️  Variables with placeholder values:');
    placeholderVars.forEach(v => console.log(`   - ${v}`));
    allChecks = false;
  }
  
  if (missingVars.length === 0 && placeholderVars.length === 0) {
    console.log('✅ All critical environment variables are configured');
  }
  
} else {
  console.log('❌ .env.local file not found');
  console.log('   Run: cp .env.local.example .env.local');
  allChecks = false;
}

// Check 2: Git status
console.log('\n📋 Checking git status...\n');

try {
  const { execSync } = require('child_process');
  
  // Check if there are uncommitted changes
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (status.trim()) {
    console.log('⚠️  You have uncommitted changes:');
    console.log(status.split('\n').slice(0, 5).join('\n'));
    if (status.split('\n').length > 5) {
      console.log(`   ... and ${status.split('\n').length - 5} more files`);
    }
    console.log('\n   Consider committing before deployment');
  } else {
    console.log('✅ No uncommitted changes');
  }
  
  // Check current branch
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  console.log(`✅ Current branch: ${branch}`);
  
  // Check if branch is pushed
  try {
    execSync('git diff origin/' + branch + ' --quiet', { encoding: 'utf-8' });
    console.log('✅ Branch is up to date with remote');
  } catch (e) {
    console.log('⚠️  Local branch has unpushed commits');
    console.log('   Run: git push origin ' + branch);
  }
  
} catch (error) {
  console.log('⚠️  Could not check git status');
}

// Check 3: Required files
console.log('\n📋 Checking required files...\n');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'netlify.toml',
  'public/manifest.json',
  'firestore.rules',
];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} not found`);
    allChecks = false;
  }
});

// Check 4: Documentation
console.log('\n📋 Checking deployment documentation...\n');

const docFiles = [
  'NETLIFY_ENV_SETUP.md',
  'DEPLOYMENT_STATUS.md',
  '.env.local.example',
];

docFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} not found`);
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n📊 DEPLOYMENT READINESS SUMMARY:\n');

if (allChecks) {
  console.log('✅ All critical checks passed!');
  console.log('✅ Your local environment is properly configured');
  console.log('\n📝 NEXT STEPS FOR NETLIFY DEPLOYMENT:\n');
  console.log('1. Go to Netlify Dashboard: https://app.netlify.com/');
  console.log('2. Select your site: codeex-ai');
  console.log('3. Navigate to: Site settings → Environment variables');
  console.log('4. Copy ALL variables from your .env.local file');
  console.log('5. Add them to Netlify (see NETLIFY_ENV_SETUP.md for details)');
  console.log('6. Trigger new deployment');
  console.log('7. Test at: https://codeex-ai.netlify.app');
  console.log('\n📖 See NETLIFY_ENV_SETUP.md for detailed instructions');
} else {
  console.log('❌ Some checks failed!');
  console.log('❌ Please fix the issues above before deploying');
  console.log('\n📖 See .env.local.example for required environment variables');
}

console.log('\n' + '='.repeat(70));
console.log('\n💡 TIP: Run "npm run verify-env" to check environment variables\n');

process.exit(allChecks ? 0 : 1);
