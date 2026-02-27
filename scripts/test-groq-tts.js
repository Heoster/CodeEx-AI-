#!/usr/bin/env node
/**
 * Groq Orpheus TTS Testing Script
 * Tests the Groq Orpheus TTS service with various voices and options
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BASE_URL = 'https://api.groq.com/openai/v1/audio/speech';
const MODEL = 'canopylabs/orpheus-v1-english'; // Groq uses Orpheus TTS

// Available voices for Orpheus English
const AVAILABLE_VOICES = ['autumn', 'diana', 'hannah', 'austin', 'daniel', 'troy'];

// Test configurations
const TEST_CASES = [
  {
    name: 'Basic Test - Troy Voice',
    text: 'Hello! This is a test of Groq Orpheus text to speech.',
    voice: 'troy',
    speed: 1.0,
  },
  {
    name: 'Diana Voice',
    text: 'Testing the Diana voice with Groq Orpheus.',
    voice: 'diana',
    speed: 1.0,
  },
  {
    name: 'Hannah Voice',
    text: 'This is the Hannah voice speaking clearly.',
    voice: 'hannah',
    speed: 1.0,
  },
  {
    name: 'Autumn Voice',
    text: 'Autumn voice test with Groq Orpheus.',
    voice: 'autumn',
    speed: 1.0,
  },
  {
    name: 'Austin Voice',
    text: 'Austin voice test for text to speech.',
    voice: 'austin',
    speed: 1.0,
  },
  {
    name: 'Daniel Voice',
    text: 'Daniel voice test with expressive speech.',
    voice: 'daniel',
    speed: 1.0,
  },
  {
    name: 'Speed Test - Slow (0.5x)',
    text: 'This is a slow speed test.',
    voice: 'troy',
    speed: 0.5,
  },
  {
    name: 'Speed Test - Fast (1.5x)',
    text: 'This is a fast speed test.',
    voice: 'troy',
    speed: 1.5,
  },
  {
    name: 'Long Text Test',
    text: 'This is a longer text to test how Groq Orpheus handles extended content. It includes multiple sentences and should demonstrate the quality of the text to speech synthesis over a longer duration.',
    voice: 'troy',
    speed: 1.0,
  },
  {
    name: 'Vocal Directions Test',
    text: '[cheerful] Welcome to Groq Orpheus! [serious] This demonstrates vocal direction support.',
    voice: 'troy',
    speed: 1.0,
  },
];

/**
 * Test Groq PlayAI TTS
 */
async function testGroqTTS(testCase, saveAudio = false) {
  const { name, text, voice, speed } = testCase;

  try {
    console.log(`\n${colors.cyan}Testing: ${name}${colors.reset}`);
    console.log(`  Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    console.log(`  Voice: ${voice}`);
    console.log(`  Speed: ${speed}x`);

    const startTime = Date.now();

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        input: text,
        voice: voice,
        speed: speed,
        response_format: 'wav', // Orpheus uses WAV format
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioSize = audioBuffer.byteLength;

    console.log(`  ${colors.green}✓ Success${colors.reset}`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Audio Size: ${(audioSize / 1024).toFixed(2)} KB`);

    // Save audio file if requested
    if (saveAudio) {
      const outputDir = path.join(process.cwd(), 'test-output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = `groq-orpheus-${voice}-${speed}x-${Date.now()}.wav`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, Buffer.from(audioBuffer));
      console.log(`  ${colors.blue}Saved: ${filename}${colors.reset}`);
    }

    return {
      success: true,
      name,
      duration,
      audioSize,
      voice,
      speed,
    };
  } catch (error) {
    console.log(`  ${colors.red}✗ Failed: ${error.message}${colors.reset}`);
    return {
      success: false,
      name,
      error: error.message,
      voice,
      speed,
    };
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║   Groq Orpheus TTS Testing Suite              ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════╝${colors.reset}`);

  // Check API key
  if (!GROQ_API_KEY) {
    console.log(`\n${colors.red}✗ Error: GROQ_API_KEY not found in .env.local${colors.reset}`);
    console.log(`${colors.yellow}Please add your Groq API key to .env.local${colors.reset}`);
    process.exit(1);
  }

  console.log(`\n${colors.green}✓ API Key found${colors.reset}`);
  console.log(`${colors.cyan}Running ${TEST_CASES.length} tests...${colors.reset}`);

  const results = [];
  const saveAudio = process.argv.includes('--save');

  if (saveAudio) {
    console.log(`${colors.blue}Audio files will be saved to test-output/${colors.reset}`);
  }

  // Run tests sequentially to avoid rate limiting
  for (const testCase of TEST_CASES) {
    const result = await testGroqTTS(testCase, saveAudio);
    results.push(result);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}Test Summary${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`${colors.green}Passed: ${successful.length}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed.length}${colors.reset}`);

  if (successful.length > 0) {
    const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
    const avgSize = successful.reduce((sum, r) => sum + r.audioSize, 0) / successful.length;
    
    console.log(`\n${colors.cyan}Performance Metrics:${colors.reset}`);
    console.log(`  Average Duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`  Average Audio Size: ${(avgSize / 1024).toFixed(2)} KB`);
  }

  if (failed.length > 0) {
    console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
    failed.forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }

  // Voice comparison
  console.log(`\n${colors.cyan}Voice Comparison:${colors.reset}`);
  const voiceResults = {};
  successful.forEach(r => {
    if (!voiceResults[r.voice]) {
      voiceResults[r.voice] = [];
    }
    voiceResults[r.voice].push(r);
  });

  Object.keys(voiceResults).forEach(voice => {
    const tests = voiceResults[voice];
    const avgDuration = tests.reduce((sum, r) => sum + r.duration, 0) / tests.length;
    const avgSize = tests.reduce((sum, r) => sum + r.audioSize, 0) / tests.length;
    console.log(`  ${voice}: ${tests.length} tests, ${avgDuration.toFixed(0)}ms avg, ${(avgSize / 1024).toFixed(2)} KB avg`);
  });

  console.log(`\n${colors.cyan}═══════════════════════════════════════════════${colors.reset}`);

  if (saveAudio) {
    console.log(`\n${colors.blue}Audio files saved to: test-output/${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}Tip: Use --save flag to save audio files${colors.reset}`);
    console.log(`${colors.yellow}Example: node scripts/test-groq-tts.js --save${colors.reset}`);
  }

  return failed.length === 0;
}

/**
 * Quick test function
 */
async function quickTest() {
  console.log(`${colors.cyan}Running Quick Test...${colors.reset}\n`);

  const result = await testGroqTTS({
    name: 'Quick Test',
    text: 'Hello! This is a quick test of Groq Orpheus text to speech.',
    voice: 'troy',
    speed: 1.0,
  }, true);

  if (result.success) {
    console.log(`\n${colors.green}✓ Quick test passed!${colors.reset}`);
    console.log(`${colors.blue}Audio saved to: test-output/${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Quick test failed${colors.reset}`);
  }

  return result.success;
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${colors.cyan}Groq Orpheus TTS Testing Script${colors.reset}

Usage:
  node scripts/test-groq-tts.js [options]

Options:
  --save        Save generated audio files to test-output/
  --quick       Run a quick single test
  --help, -h    Show this help message

Examples:
  node scripts/test-groq-tts.js
  node scripts/test-groq-tts.js --save
  node scripts/test-groq-tts.js --quick --save

Model: canopylabs/orpheus-v1-english

Available Voices:
  - troy (default) - Balanced, clear voice
  - diana - Professional, authoritative
  - hannah - Warm, expressive
  - autumn - Soft, gentle
  - austin - Energetic, bright
  - daniel - Deep, commanding

Speed Range: 0.25 to 4.0 (default: 1.0)

Vocal Directions: Use [cheerful], [serious], [whisper], etc. in text
  `);
  process.exit(0);
}

if (args.includes('--quick')) {
  quickTest()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error(`${colors.red}Error:${colors.reset}`, error);
      process.exit(1);
    });
} else {
  runAllTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error(`${colors.red}Error:${colors.reset}`, error);
      process.exit(1);
    });
}
