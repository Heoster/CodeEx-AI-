#!/usr/bin/env node

/**
 * Test script for Firebase Auth Services
 * Tests password reset and email change endpoints
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testPasswordReset() {
  console.log('\n🔐 Testing Password Reset...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Password Reset API: Working');
      console.log(`   Message: ${result.message}`);
    } else {
      console.log('⚠️  Password Reset API: Responded with error');
      console.log(`   Message: ${result.message}`);
    }
  } catch (error) {
    console.log('❌ Password Reset API: Failed');
    console.log(`   Error: ${error.message}`);
  }
}

async function testEmailChange() {
  console.log('\n📧 Testing Email Change...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/change-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        newEmail: 'new@example.com',
        idToken: 'test-token' // Will fail auth, but tests endpoint
      })
    });

    const result = await response.json();
    
    if (response.status === 401) {
      console.log('✅ Email Change API: Working (requires authentication)');
      console.log(`   Message: ${result.message}`);
    } else {
      console.log('⚠️  Email Change API: Unexpected response');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${result.message}`);
    }
  } catch (error) {
    console.log('❌ Email Change API: Failed');
    console.log(`   Error: ${error.message}`);
  }
}

async function testEmailVerification() {
  console.log('\n✉️  Testing Email Verification...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'test-token' })
    });

    const result = await response.json();
    
    if (response.status === 401) {
      console.log('✅ Email Verification API: Working (requires authentication)');
      console.log(`   Message: ${result.message}`);
    } else {
      console.log('⚠️  Email Verification API: Unexpected response');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${result.message}`);
    }
  } catch (error) {
    console.log('❌ Email Verification API: Failed');
    console.log(`   Error: ${error.message}`);
  }
}

async function checkPages() {
  console.log('\n📄 Checking Pages...');
  
  const pages = [
    { name: 'Password Reset', path: '/reset-password' },
    { name: 'Account Settings', path: '/account-settings' }
  ];

  for (const page of pages) {
    try {
      const response = await fetch(`${BASE_URL}${page.path}`);
      if (response.ok) {
        console.log(`✅ ${page.name} page: Accessible`);
      } else {
        console.log(`⚠️  ${page.name} page: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page.name} page: Failed to load`);
    }
  }
}

async function runTests() {
  console.log('🧪 Firebase Auth Services Test Suite');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log('=' .repeat(50));

  await testPasswordReset();
  await testEmailChange();
  await testEmailVerification();
  await checkPages();

  console.log('\n' + '='.repeat(50));
  console.log('✨ Test suite completed!');
  console.log('\n💡 Tips:');
  console.log('   - Start dev server: npm run dev');
  console.log('   - Run tests: node scripts/test-auth-services.js');
  console.log('   - Test with production: TEST_URL=https://your-domain.com node scripts/test-auth-services.js');
}

// Run tests
runTests().catch(console.error);
