# Model Selection Test Guide

## What Was Fixed

1. **Settings Persistence**: Settings now persist to localStorage instead of resetting on page reload
2. **Debug Logging**: Added comprehensive logging to track model selection through the entire flow
3. **API Key Validation**: Enhanced validation to detect placeholder API keys

## How to Test

### Step 1: Check Provider Availability
1. Open http://localhost:3000/test-providers.html
2. Verify which providers show as "✓ Available" and "✓ Configured"
3. Only models from available providers can be selected

### Step 2: Configure API Keys (if needed)
If providers show as "⚠ Placeholder" or "✗ Missing":

1. Edit `.env.local` file
2. Replace placeholder values with real API keys:
   ```
   GROQ_API_KEY=gsk_your_actual_groq_key
   HUGGINGFACE_API_KEY=hf_your_actual_hf_key
   GOOGLE_API_KEY=AIza_your_actual_google_key
   CEREBRAS_API_KEY=your_actual_cerebras_key
   ```
3. Restart the dev server: `npm run dev`
4. Refresh test-providers.html to verify

### Step 3: Test Model Selection
1. Open http://localhost:3000/chat
2. Open browser DevTools Console (F12)
3. Click Settings → AI Model
4. Select a different model (e.g., from HuggingFace or Google)
5. Check console for: `[Settings] Model changed to: <model-id>`
6. Close settings dialog
7. Send a test message
8. Check console logs:
   ```
   [ChatPanel] Current settings: {model: "your-selected-model", ...}
   [ChatPanel] Selected model: your-selected-model
   [Actions] User selected model: your-selected-model
   [Smart Fallback] Preferred model your-selected-model: found=true, available=true
   [Actions] Response generated with model: your-selected-model, fallback triggered: false
   ```
9. Verify the model badge below the AI response shows the correct model name

### Step 4: Test Settings Persistence
1. Select a specific model in settings
2. Refresh the page (F5)
3. Open settings again
4. Verify the selected model is still selected (not reset to "Auto")
5. Send a message and verify it uses the selected model

## Expected Console Output

### When Model Selection Works:
```
[Settings] Model changed to: gemini-2.5-flash
[ChatPanel] Current settings: {model: "gemini-2.5-flash", tone: "helpful", ...}
[ChatPanel] Selected model: gemini-2.5-flash
[Actions] User selected model: gemini-2.5-flash
[Smart Fallback] Preferred model gemini-2.5-flash: found=true, available=true
[Smart Fallback] Attempting generation with Gemini 2.5 Flash (gemini-2.5-flash)...
[Actions] Response generated with model: gemini-2.5-flash, fallback triggered: false
```

### When Provider Not Configured:
```
[Settings] Model changed to: cerebras-gpt-oss
[ChatPanel] Current settings: {model: "cerebras-gpt-oss", tone: "helpful", ...}
[ChatPanel] Selected model: cerebras-gpt-oss
[Actions] User selected model: cerebras-gpt-oss
[Smart Fallback] Preferred model cerebras-gpt-oss: found=true, available=false
[Smart Fallback] Preferred model cerebras-gpt-oss is not available. Provider cerebras may not be configured.
[Smart Fallback] Attempting generation with Llama 3.1 8B Instant (llama-3.1-8b-instant)...
[Actions] Response generated with model: llama-3.1-8b-instant, fallback triggered: true
```

## Troubleshooting

### Issue: Model always shows as "Llama 3.1 8B Instant"
**Cause**: The selected model's provider doesn't have a valid API key configured

**Solution**: 
1. Check test-providers.html to see which providers are available
2. Only select models from providers marked as "✓ Available"
3. Configure missing API keys in .env.local

### Issue: Settings reset after page refresh
**Cause**: This should now be fixed with localStorage persistence

**Solution**: 
1. Clear browser cache and localStorage
2. Refresh the page
3. Select a model again
4. Refresh and verify it persists

### Issue: Console shows "available=false" for selected model
**Cause**: The model's provider API key is missing or invalid

**Solution**:
1. Get the API key for that provider
2. Add it to .env.local (without placeholder text)
3. Restart dev server
4. Verify in test-providers.html

## API Key Sources

- **Groq**: https://console.groq.com/keys (Free tier available)
- **Hugging Face**: https://huggingface.co/settings/tokens (Free tier available)
- **Google**: https://makersuite.google.com/app/apikey (Free tier available)
- **Cerebras**: https://cloud.cerebras.ai/ (Free tier available)

## Notes

- Settings are stored per-user in localStorage as `{userId}_settings`
- Guest users use `guest_settings`
- Model selection only works for providers with valid API keys
- The system automatically falls back to Groq if the selected model is unavailable
