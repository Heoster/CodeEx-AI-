import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge TTS API Endpoint
 * Routes to Python-based Edge TTS server for reliable speech generation
 * Falls back to direct API calls if Python server is unavailable
 */

const PYTHON_TTS_SERVER = process.env.PYTHON_TTS_SERVER_URL || 'http://localhost:8765/tts';
const USE_PYTHON_SERVER = process.env.USE_PYTHON_TTS === 'true';

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'en-US-AriaNeural', rate = '+0%', pitch = '+0Hz' } = await request.json();

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Valid text is required' }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long (max 5000 characters)' }, { status: 400 });
    }

    // Removed console logs to reduce noise

    // Try Python server first if enabled
    if (USE_PYTHON_SERVER) {
      try {
        const pythonResponse = await fetch(PYTHON_TTS_SERVER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, voice, rate, pitch }),
        });

        if (pythonResponse.ok) {
          const audioBuffer = await pythonResponse.arrayBuffer();
          
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      } catch (pythonError) {
        // Python server unavailable, fall through to direct API
      }
    }

    // Fallback to direct API calls
    return await generateWithDirectAPI(text, voice, rate, pitch);

  } catch (error) {
    // Don't log TTS errors to avoid console spam
    // TTS is an optional feature and should fail silently
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Return a more graceful error that won't spam the console
    return NextResponse.json(
      { 
        error: 'TTS_UNAVAILABLE',
        message: 'Text-to-speech is temporarily unavailable',
        fallback: 'browser',
      }, 
      { status: 503 } // Use 503 instead of 500 to indicate service unavailable
    );
  }
}

async function generateWithDirectAPI(text: string, voice: string, rate: string, pitch: string) {
  // Sanitize text for SSML
  const sanitizedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Build SSML for Edge TTS
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${voice}"><prosody rate="${rate}" pitch="${pitch}">${sanitizedText}</prosody></voice></speak>`;

  // Try multiple Edge TTS endpoints (updated for 2026)
  const endpoints = [
    'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1',
    'https://westus.tts.speech.microsoft.com/cognitiveservices/v1',
    'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  ];

  let lastError = null;
  
  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced to 15s

      const ttsResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
          'Origin': 'https://azure.microsoft.com',
          'Referer': 'https://azure.microsoft.com/',
        },
        body: ssml,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!ttsResponse.ok) {
        lastError = new Error(`Edge TTS API error: ${ttsResponse.status}`);
        continue; // Try next endpoint
      }

      const audioBuffer = await ttsResponse.arrayBuffer();

      if (audioBuffer.byteLength === 0) {
        lastError = new Error('Empty audio response');
        continue; // Try next endpoint
      }

      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        lastError = new Error('TTS request timeout');
      } else {
        lastError = fetchError;
      }
      continue; // Try next endpoint
    }
  }

  // All endpoints failed
  throw lastError || new Error('All TTS endpoints failed');
}
