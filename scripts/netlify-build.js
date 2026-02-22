#!/usr/bin/env node

/**
 * Netlify Build Script for CODEEX AI
 * Handles pre-build optimizations and environment setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build for CODEEX AI...');

// Check if required environment variables are set
const requiredEnvVars = [
  'GROQ_API_KEY',
  'HUGGINGFACE_API_KEY', 
  'GOOGLE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:', missingVars.join(', '));
  console.warn('⚠️  Build will continue but some features may not work properly.');
}

// Set build-specific environment variables
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SKIP_ENV_VALIDATION = 'true';

// Clean up any previous builds
console.log('🧹 Cleaning previous build artifacts...');
try {
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('ℹ️  No previous build artifacts to clean');
}

// Install dependencies with legacy peer deps flag
console.log('📦 Installing dependencies...');
try {
  execSync('npm ci --legacy-peer-deps', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  npm ci failed, trying npm install...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
}

// Run type checking (optional, will warn but not fail)
console.log('🔍 Running type check...');
try {
  execSync('npm run typecheck', { stdio: 'inherit' });
  console.log('✅ Type check passed');
} catch (error) {
  console.warn('⚠️  Type check failed, continuing build...');
}

// Run the actual build
console.log('🏗️  Building Next.js application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Verify build output
const buildDir = '.next';
if (fs.existsSync(buildDir)) {
  const stats = fs.statSync(buildDir);
  console.log(`📊 Build output size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('✅ Build verification passed');
} else {
  console.error('❌ Build output directory not found');
  process.exit(1);
}

console.log('🎉 Netlify build completed successfully!');