// Simple Node.js script to test the TTS API endpoint
const fetch = require('node-fetch');

async function testTTS() {
  console.log('Testing TTS API endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello, this is a test.',
        voice: 'en-US-AriaNeural',
      }),
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('\nError Response:', errorText);
      return;
    }

    const buffer = await response.arrayBuffer();
    console.log('Audio Size:', buffer.byteLength, 'bytes');
    console.log('\n✅ TTS API is working!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testTTS();
