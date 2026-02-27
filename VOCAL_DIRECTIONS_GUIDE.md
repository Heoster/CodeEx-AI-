# Vocal Directions Guide for AI

## Overview

The AI can now use vocal directions to enhance TTS output with emotional cues. These directions are **hidden from users** but affect how the speech sounds.

## How It Works

1. AI adds vocal directions in square brackets: `[cheerful]`, `[whisper]`, etc.
2. The voice filter automatically removes these from displayed text
3. The TTS engine (Groq Orpheus) interprets the directions for speech output
4. Users hear the emotion but never see the tags

## Available Directions

### Basic Emotions
- `[cheerful]` - Happy, upbeat tone
- `[excited]` - Energetic, enthusiastic
- `[serious]` - Formal, grave tone
- `[sad]` - Melancholic, somber

### Special Effects
- `[whisper]` - Quiet, intimate tone
- `[menacing whisper]` - Dark, threatening whisper
- `[dark chuckle]` - Evil laugh
- `[sigh]` - Exhale sound

## Usage Examples

### Example 1: Welcoming User
```
[cheerful] Welcome back! I'm so glad to see you again! [serious] Now, let's tackle that coding problem you mentioned.
```

**User sees:**
> Welcome back! I'm so glad to see you again! Now, let's tackle that coding problem you mentioned.

**User hears:**
> (cheerful tone) Welcome back! I'm so glad to see you again! (serious tone) Now, let's tackle that coding problem you mentioned.

### Example 2: Explaining Complex Topic
```
[serious] This is a critical security vulnerability. [whisper] Between you and me, many developers overlook this. [excited] But you're going to fix it right now!
```

**User sees:**
> This is a critical security vulnerability. Between you and me, many developers overlook this. But you're going to fix it right now!

**User hears:**
> (serious) This is a critical security vulnerability. (whisper) Between you and me, many developers overlook this. (excited) But you're going to fix it right now!

### Example 3: Dramatic Effect
```
[menacing whisper] The bug lurks in the shadows of your code... [dark chuckle] waiting to strike when you least expect it. [serious] Let's hunt it down together.
```

**User sees:**
> The bug lurks in the shadows of your code... waiting to strike when you least expect it. Let's hunt it down together.

**User hears:**
> (menacing whisper) The bug lurks in the shadows of your code... (dark chuckle) waiting to strike when you least expect it. (serious) Let's hunt it down together.

## Best Practices

### DO:
✅ Use directions to enhance emotional impact
✅ Match direction to content context
✅ Use sparingly for maximum effect
✅ Combine multiple directions in one response
✅ Use [cheerful] for greetings and positive news
✅ Use [serious] for important warnings
✅ Use [whisper] for tips and secrets

### DON'T:
❌ Overuse directions (makes speech sound unnatural)
❌ Use conflicting directions close together
❌ Use directions in every sentence
❌ Use directions for technical code explanations
❌ Mention the directions to users

## When to Use

### Good Use Cases:
- Greetings and farewells
- Delivering good/bad news
- Sharing tips or secrets
- Creating dramatic effect
- Emphasizing important points
- Making jokes or humor
- Expressing empathy

### Avoid Using:
- In code blocks or technical explanations
- In error messages (unless appropriate)
- In mathematical formulas
- In file paths or commands
- When user disabled speech

## Technical Implementation

### Voice Filter
The `VoiceFilter` class in `src/lib/voice-filter.ts` automatically:
1. Detects vocal direction patterns: `\[([^\]]+)\]`
2. Removes them from displayed text
3. Preserves them for TTS processing

### TTS Integration
Groq Orpheus TTS natively supports vocal directions:
- Directions are passed in the text to the TTS API
- The model interprets them for speech synthesis
- No additional processing needed

## Examples by Scenario

### Coding Help
```
[cheerful] Great question! [serious] Let me explain how async/await works. [excited] It's going to make your code so much cleaner!
```

### Error Explanation
```
[serious] This error occurs because of a null reference. [whisper] A common mistake, but easy to fix. [cheerful] Let's solve it together!
```

### Encouragement
```
[excited] You're doing amazing! [cheerful] Keep going, you're almost there! [serious] Just one more step to complete this feature.
```

### Warning
```
[serious] Warning: This operation is irreversible. [menacing whisper] Once deleted, your data is gone forever. [cheerful] But don't worry, I'll help you back it up first!
```

## Testing

To test vocal directions:
1. Enable speech in settings
2. Send a message to the AI
3. Listen to the response
4. Check that directions are hidden in text
5. Verify emotional tone in speech

## Notes

- Vocal directions are a **hidden feature** - users don't know about them
- They enhance the user experience without cluttering the UI
- The AI should use them naturally and appropriately
- Not all TTS engines support all directions (Orpheus does)
- Fallback TTS (browser) may ignore directions

---

**Status:** Active  
**Supported by:** Groq Orpheus TTS  
**Hidden from Users:** Yes  
**Version:** 2.0.0
