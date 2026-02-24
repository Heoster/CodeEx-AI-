# Model Selection Debug Guide

## Issue
Model selection in settings is not working - always uses Llama 3.1 8B Instant even when other models are selected.

## Root Cause
The model registry checks if a provider's API key is configured before allowing models from that provider. If you select a model from a provider that doesn't have an API key configured, the smart fallback system will skip it and use the first available model (Groq's Llama 3.1 8B).

## Available Models by Provider

### Groq (GROQ_API_KEY)
- `llama-3.1-8b-instant` - Llama 3.1 8B Instant (general)

### Hugging Face (HUGGINGFACE_API_KEY)
- `llama-3.1-8b-instruct-hf` - Llama 3.1 8B Instruct (general)
- `deepseek-v3.2` - DeepSeek V3.2 (coding)
- `rnj-1-instruct` - RNJ-1 Instruct (conversation)
- `gpt-oss-20b` - GPT-OSS 20B (general)

### Google (GOOGLE_API_KEY)
- `gemini-2.5-flash` - Gemini 2.5 Flash (multimodal)
- `gemini-flash-latest` - Gemini Flash Latest (general)
- `gemini-2.5-flash-lite` - Gemini 2.5 Flash Lite (conversation)

### Cerebras (CEREBRAS_API_KEY)
- `cerebras-llama-3.1-8b` - Cerebras Llama 3.1 8B (general)
- `cerebras-llama-3.3-70b` - Cerebras Llama 3.3 70B (general)
- `cerebras-gpt-oss` - Cerebras GPT-OSS (coding) ⚠️ This is the Cerebras version
- `cerebras-qwen-3-235b` - Cerebras Qwen 3 235B Instruct (general)
- `cerebras-qwen-3-32b` - Cerebras Qwen 3 32B (conversation)
- `cerebras-glm-4.7` - Cerebras Z.ai GLM 4.7 (multimodal)

## How to Fix

### Option 1: Configure Cerebras API Key
1. Get a Cerebras API key from https://cloud.cerebras.ai/
2. Add it to your `.env.local` file:
   ```
   CEREBRAS_API_KEY=your_actual_cerebras_api_key_here
   ```
3. Restart your development server
4. The Cerebras models will now be available

### Option 2: Use Available Models
If you only have a Groq API key configured, you can only use:
- `llama-3.1-8b-instant` (Groq)

To use other models, you need to configure their respective API keys.

## Debugging Steps

1. Check your `.env.local` file to see which API keys are configured
2. Look at the browser console when sending a message - you'll see logs like:
   ```
   [Actions] User selected model: cerebras-gpt-oss
   [Smart Fallback] Preferred model cerebras-gpt-oss: found=true, available=false
   [Smart Fallback] Preferred model cerebras-gpt-oss is not available. Provider cerebras may not be configured.
   ```
3. Check the server console (terminal where you ran `npm run dev`) for provider availability warnings

## Model ID Confusion

Note: There are TWO different "GPT-OSS" models:
- `gpt-oss-20b` - Hugging Face version (requires HUGGINGFACE_API_KEY)
- `cerebras-gpt-oss` - Cerebras version (requires CEREBRAS_API_KEY)

Make sure you're selecting the correct one based on which API key you have configured.

## Testing

After configuring API keys, you can test by:
1. Opening Settings → AI Model
2. Selecting a model from the configured provider
3. Sending a test message
4. Checking that the model badge shows the correct model name below the response
