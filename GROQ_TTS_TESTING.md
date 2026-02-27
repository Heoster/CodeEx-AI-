# Groq PlayAI TTS Testing Guide

## Overview

This guide explains how to test the Groq PlayAI Text-to-Speech (TTS) service used in CodeEx AI.

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
- Test the `alloy` voice
- Generate a short audio sample
- Save the MP3 file to `test-output/`
- Show performance metrics

### 2. Full Test Suite

Run all tests with 6 voices and various configurations:

```bash
npm run test:tts
```

This tests:
- All 6 voices (alloy, echo, fable, onyx, nova, shimmer)
- Different speeds (0.5x, 1.0x, 1.5x)
- Long text handling
- Special characters

### 3. Full Test with Audio Files

Run all tests and save audio files:

```bash
npm run test:tts:save
```

Audio files will be saved to `test-output/` directory.

## Test Cases

The test suite includes 10 comprehensive test cases:

### Voice Tests
1. **Alloy Voice** - Default, balanced voice
2. **Echo Voice** - Clear, professional voice
3. **Fable Voice** - Storytelling voice
4. **Onyx Voice** - Deep, authoritative voice
5. **Nova Voice** - Energetic voice
6. **Shimmer Voice** - Soft, gentle voice

### Speed Tests
7. **Slow Speed (0.5x)** - Half speed for clarity
8. **Fast Speed (1.5x)** - 1.5x speed for efficiency

### Content Tests
9. **Long Text** - Tests extended content handling
10. **Special Characters** - Tests numbers and punctuation

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
║   Groq PlayAI TTS Testing Suite               ║
╚════════════════════════════════════════════════╝

✓ API Key found
Running 10 tests...

Testing: Basic Test - Alloy Voice
  Text: "Hello! This is a test of Groq PlayAI text to speech."
  Voice: alloy
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
  alloy: 4 tests, 1150ms avg, 40.25 KB avg
  echo: 1 tests, 1200ms avg, 43.00 KB avg
  fable: 1 tests, 1250ms avg, 44.50 KB avg
  onyx: 1 tests, 1180ms avg, 41.75 KB avg
  nova: 1 tests, 1220ms avg, 42.80 KB avg
  shimmer: 1 tests, 1190ms avg, 42.20 KB avg

═══════════════════════════════════════════════
```

### Audio Files

When using `--save` flag, audio files are saved to `test-output/`:

```
test-output/
├── groq-tts-alloy-1.0x-1234567890.mp3
├── groq-tts-echo-1.0x-1234567891.mp3
├── groq-tts-fable-1.0x-1234567892.mp3
└── ...
```

File naming format: `groq-tts-{voice}-{speed}x-{timestamp}.mp3`

## Voice Characteristics

### Alloy (Default)
- **Best for:** General purpose, balanced
- **Tone:** Neutral, clear
- **Use case:** Default voice for most content

### Echo
- **Best for:** Professional content
- **Tone:** Clear, authoritative
- **Use case:** Business, educational content

### Fable
- **Best for:** Storytelling
- **Tone:** Expressive, engaging
- **Use case:** Stories, narratives

### Onyx
- **Best for:** Serious content
- **Tone:** Deep, authoritative
- **Use case:** News, formal announcements

### Nova
- **Best for:** Energetic content
- **Tone:** Bright, enthusiastic
- **Use case:** Marketing, upbeat content

### Shimmer
- **Best for:** Gentle content
- **Tone:** Soft, soothing
- **Use case:** Meditation, calm content

## Speed Settings

- **Minimum:** 0.25x (very slow)
- **Default:** 1.0x (normal)
- **Maximum:** 4.0x (very fast)
- **Recommended:** 0.5x - 1.5x for best quality

## Troubleshooting

### API Key Not Found

```
✗ Error: GROQ_API_KEY not found in .env.local
```

**Solution:** Add your Groq API key to `.env.local`:
```env
GROQ_API_KEY=gsk_your_api_key_here
```

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
| Voices Available | 6 |
| Speed Range | 0.25x - 4.0x |

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
    "voice": "alloy",
    "speed": 1.0
  }'
```

## Best Practices

1. **Test Before Deployment** - Always test TTS before deploying
2. **Monitor Performance** - Track generation times and audio quality
3. **Use Appropriate Voices** - Match voice to content type
4. **Optimize Speed** - Use 1.0x for best quality
5. **Handle Errors** - Implement fallback chains
6. **Cache Audio** - Consider caching for repeated phrases

## Rate Limits

Groq API rate limits (free tier):
- **Requests:** 14,400 per day
- **Concurrent:** Reasonable concurrent requests
- **Text Length:** Up to 4096 characters per request

## Next Steps

1. Run the quick test to verify setup
2. Test all voices to choose favorites
3. Integrate into your application
4. Monitor usage and performance
5. Implement caching if needed

## Support

For issues or questions:
- Check GROQ_VOICE_SETUP.md for setup details
- Review API documentation at https://console.groq.com/docs
- Contact support at the.heoster@mail.com

---

**Last Updated:** 2024  
**Version:** 2.0.0  
**Status:** Production Ready ✅
