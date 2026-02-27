# Groq Orpheus TTS Testing Guide

## Overview

This guide explains how to test the Groq Orpheus Text-to-Speech (TTS) service from Canopy Labs used in CodeEx AI.

## Prerequisites

- Node.js installed
- Groq API key configured in `.env.local`
- Internet connection

## Quick Start

### 1. Quick Test (Recommended)

Run a quick test with a single voice and save the audio:

```bash
npm run test:tts:quick
```

This will:
- Test the `troy` voice (default)
- Generate a short audio sample
- Save the WAV file to `test-output/`
- Show performance metrics

### 2. Full Test Suite

Run all tests with 6 voices and various configurations:

```bash
npm run test:tts
```

This tests:
- All 6 voices (troy, diana, hannah, autumn, austin, daniel)
- Different speeds (0.5x, 1.0x, 1.5x)
- Long text handling
- Vocal directions ([cheerful], [serious], etc.)

### 3. Full Test with Audio Files

Run all tests and save audio files:

```bash
npm run test:tts:save
```

Audio files will be saved to `test-output/` directory.

## Test Cases

The test suite includes 10 comprehensive test cases:

### Voice Tests
1. **Troy Voice** - Default, balanced voice
2. **Diana Voice** - Professional, authoritative voice
3. **Hannah Voice** - Warm, expressive voice
4. **Autumn Voice** - Soft, gentle voice
5. **Austin Voice** - Energetic, bright voice
6. **Daniel Voice** - Deep, commanding voice

### Speed Tests
7. **Slow Speed (0.5x)** - Half speed for clarity
8. **Fast Speed (1.5x)** - 1.5x speed for efficiency

### Content Tests
9. **Long Text** - Tests extended content handling
10. **Vocal Directions** - Tests emotional cues like [cheerful], [serious]

## Command Options

### Basic Usage

```bash
node scripts/test-groq-tts.js [options]
```

### Options

- `--save` - Save generated audio files to test-output/
- `--quick` - Run a quick single test
- `--help` or `-h` - Show help message

### Examples

```bash
# Run all tests without saving audio
node scripts/test-groq-tts.js

# Run all tests and save audio files
node scripts/test-groq-tts.js --save

# Quick test with audio file
node scripts/test-groq-tts.js --quick --save

# Show help
node scripts/test-groq-tts.js --help
```

## NPM Scripts

For convenience, use these npm scripts:

```bash
# Quick test (saves audio)
npm run test:tts:quick

# Full test suite (no audio files)
npm run test:tts

# Full test suite (saves audio files)
npm run test:tts:save
```

## Output

### Console Output

The test script provides detailed console output:

```
╔════════════════════════════════════════════════╗
║   Groq Orpheus TTS Testing Suite              ║
╚════════════════════════════════════════════════╝

✓ API Key found
Running 10 tests...

Testing: Basic Test - Troy Voice
  Text: "Hello! This is a test of Groq Orpheus text to speech."
  Voice: troy
  Speed: 1.0x
  ✓ Success
  Duration: 1234ms
  Audio Size: 45.67 KB

...

═══════════════════════════════════════════════
Test Summary
═══════════════════════════════════════════════

Total Tests: 10
Passed: 10
Failed: 0

Performance Metrics:
  Average Duration: 1200ms
  Average Audio Size: 42.50 KB

Voice Comparison:
  troy: 4 tests, 1150ms avg, 40.25 KB avg
  diana: 1 tests, 1200ms avg, 43.00 KB avg
  hannah: 1 tests, 1250ms avg, 44.50 KB avg
  autumn: 1 tests, 1180ms avg, 41.75 KB avg
  austin: 1 tests, 1220ms avg, 42.80 KB avg
  daniel: 1 tests, 1190ms avg, 42.20 KB avg

═══════════════════════════════════════════════
```

### Audio Files

When using `--save` flag, audio files are saved to `test-output/`:

```
test-output/
├── groq-orpheus-troy-1.0x-1234567890.wav
├── groq-orpheus-diana-1.0x-1234567891.wav
├── groq-orpheus-hannah-1.0x-1234567892.wav
└── ...
```

File naming format: `groq-orpheus-{voice}-{speed}x-{timestamp}.wav`

## Voice Characteristics

### Troy (Default)
- **Best for:** General purpose, balanced
- **Tone:** Clear, neutral
- **Use case:** Default voice for most content

### Diana
- **Best for:** Professional content
- **Tone:** Authoritative, confident
- **Use case:** Business, educational content

### Hannah
- **Best for:** Warm communication
- **Tone:** Expressive, engaging
- **Use case:** Stories, friendly content

### Autumn
- **Best for:** Gentle content
- **Tone:** Soft, soothing
- **Use case:** Meditation, calm content

### Austin
- **Best for:** Energetic content
- **Tone:** Bright, enthusiastic
- **Use case:** Marketing, upbeat content

### Daniel
- **Best for:** Commanding presence
- **Tone:** Deep, powerful
- **Use case:** Announcements, serious content

## Speed Settings

- **Minimum:** 0.25x (very slow)
- **Default:** 1.0x (normal)
- **Maximum:** 4.0x (very fast)
- **Recommended:** 0.5x - 1.5x for best quality

## Vocal Directions

Orpheus supports emotional cues directly in text:

```typescript
const text = '[cheerful] Welcome to CodeEx! [serious] This is important.';
```

Available directions:
- `[cheerful]` - Happy, upbeat tone
- `[serious]` - Formal, grave tone
- `[whisper]` - Quiet, intimate tone
- `[excited]` - Energetic, enthusiastic tone
- `[sad]` - Melancholic tone

## Troubleshooting

### API Key Not Found

```
✗ Error: GROQ_API_KEY not found in .env.local
```

**Solution:** Add your Groq API key to `.env.local`:
```env
GROQ_API_KEY=gsk_your_api_key_here
```

### Model Not Found Error

```
✗ Failed: API Error 404: model not found
```

**Solution:** Ensure you're using the correct model name: `canopylabs/orpheus-v1-english`

### API Error 401

```
✗ Failed: API Error 401: Unauthorized
```

**Solution:** Check that your API key is valid and active.

### API Error 429

```
✗ Failed: API Error 429: Rate limit exceeded
```

**Solution:** Wait a moment and try again. The script includes delays between tests to avoid rate limiting.

### Network Error

```
✗ Failed: fetch failed
```

**Solution:** Check your internet connection and try again.

## Performance Benchmarks

Based on typical test results:

| Metric | Value |
|--------|-------|
| Average Generation Time | 1.0 - 1.5 seconds |
| Average Audio Size | 40 - 50 KB |
| Supported Text Length | Up to 4096 characters |
| Voices Available | 6 (troy, diana, hannah, autumn, austin, daniel) |
| Speed Range | 0.25x - 4.0x |
| Audio Format | WAV |

## Integration with CodeEx

The TTS service is integrated into CodeEx AI:

1. **Chat Interface** - Click speaker icon on AI messages
2. **API Endpoint** - `/api/tts` for programmatic access
3. **Unified Service** - Part of fallback chain with ElevenLabs and Browser TTS

## API Endpoint Testing

You can also test via the API endpoint:

```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, this is a test",
    "voice": "troy",
    "speed": 1.0
  }'
```

## Direct Groq API Testing

Test the Groq API directly:

```bash
curl https://api.groq.com/openai/v1/audio/speech \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "canopylabs/orpheus-v1-english",
    "input": "Hello from Orpheus!",
    "voice": "troy",
    "response_format": "wav"
  }' \
  --output test.wav
```

## Best Practices

1. **Test Before Deployment** - Always test TTS before deploying
2. **Monitor Performance** - Track generation times and audio quality
3. **Use Appropriate Voices** - Match voice to content type (Zeus for authority, Artemis for calm)
4. **Optimize Speed** - Use 1.0x for best quality
5. **Handle Errors** - Implement fallback chains
6. **Cache Audio** - Consider caching for repeated phrases
7. **Use Vocal Directions** - Add emotional cues for better expression

## Rate Limits

Groq API rate limits (free tier):
- **Requests:** 14,400 per day
- **Concurrent:** Reasonable concurrent requests
- **Text Length:** Up to 4096 characters per request

## Next Steps

1. Run the quick test to verify setup
2. Test all voices to choose favorites
3. Experiment with vocal directions
4. Integrate into your application
5. Monitor usage and performance
6. Implement caching if needed

## Support

For issues or questions:
- Check GROQ_VOICE_SETUP.md for setup details
- Review API documentation at https://console.groq.com/docs
- Contact support at the.heoster@mail.com

---

**Model:** canopylabs/orpheus-v1-english  
**Provider:** Canopy Labs via Groq  
**Last Updated:** 2024  
**Version:** 2.0.0  
**Status:** Production Ready ✅
