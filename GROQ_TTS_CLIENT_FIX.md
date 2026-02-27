# Groq TTS Client-Side Fix

## Problem Identified
Groq TTS was not working and falling back to browser TTS because:

1. **Root Cause**: `hybrid-tts.ts` was calling `getUnifiedVoiceService()` directly on the client side
2. **Environment Variable Issue**: Client-side code cannot access `process.env.GROQ_API_KEY` (only `NEXT_PUBLIC_*` variables are available on the client)
3. **Debug Logs Showed**: `[Groq TTS] isAvailable check: {hasKey: false, keyPrefix: undefined}`

## Solution Implemented

### Modified `src/lib/hybrid-tts.ts`
Changed the TTS flow to use the API route instead of direct service calls:

**Before (Client-Side Direct Call)**:
```typescript
// Called unified-voice-service directly on client
const result = await this.voiceService.textToSpeech(options.text, {...});
```

**After (Server-Side API Route)**:
```typescript
// Call /api/tts route which runs server-side
const response = await fetch('/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: options.text,
    voice: options.voice || 'troy',
    speed: options.rate || 1.0,
  }),
});
```

### Key Changes

1. **Removed Direct Service Import**
   - Removed `import { getUnifiedVoiceService } from './unified-voice-service'`
   - Removed `private voiceService = getUnifiedVoiceService()`

2. **Updated speak() Method**
   - Now calls `/api/tts` POST endpoint
   - Converts base64 response to ArrayBuffer
   - Maintains fallback chain: Groq Orpheus → Edge TTS → Browser TTS

3. **Updated playAudio() Method**
   - Added `contentType` parameter (defaults to 'audio/wav')
   - Supports both WAV (Orpheus) and MP3 (ElevenLabs) formats

4. **Updated getVoices() Method**
   - Changed from PlayAI voices to Orpheus voices
   - Voices: troy, diana, hannah, autumn, austin, daniel

## How It Works Now

### Correct Flow
```
Client (hybrid-tts.ts)
  ↓ fetch('/api/tts')
Server (/api/tts/route.ts)
  ↓ has access to GROQ_API_KEY
Unified Voice Service
  ↓
Groq Orpheus TTS API
  ↓
Returns WAV audio
  ↓
Client plays audio
```

### Fallback Chain
1. **Groq Orpheus** (via `/api/tts` route) - Primary
2. **Edge TTS** (client-side) - First fallback
3. **Browser TTS** (Web Speech API) - Final fallback

## Testing

To verify the fix works:

1. **Check Console Logs**:
   ```
   [Hybrid TTS] Calling /api/tts with voice: troy
   [Unified Voice] TTS request: {...}
   [Groq TTS] isAvailable check: {hasKey: true, keyPrefix: "gsk_..."}
   [Groq TTS] Generating speech with Orpheus...
   [Groq TTS] Speech generated successfully
   [Hybrid TTS] Groq TTS successful, provider: groq
   ```

2. **Test in Browser**:
   - Send a message to the AI
   - Enable voice responses in settings
   - Should hear Groq Orpheus TTS (not browser TTS)

3. **Verify API Route**:
   ```bash
   curl -X POST http://localhost:3000/api/tts \
     -H "Content-Type: application/json" \
     -d '{"text":"Hello world","voice":"troy"}'
   ```

## Files Modified
- `src/lib/hybrid-tts.ts` - Fixed to use API route instead of direct service

## Related Files (No Changes Needed)
- `src/app/api/tts/route.ts` - Already correctly implemented
- `src/lib/unified-voice-service.ts` - Works correctly server-side
- `src/lib/groq-tts-service.ts` - Works correctly server-side

## Environment Variables Required
- `GROQ_API_KEY` - Must be set in `.env.local` (server-side only)
- No `NEXT_PUBLIC_*` prefix needed (keeps API key secure)

## Benefits
1. ✅ Groq TTS now works correctly
2. ✅ API key stays secure (server-side only)
3. ✅ Maintains fallback chain for reliability
4. ✅ Better separation of concerns (client/server)
5. ✅ Consistent with Next.js best practices
