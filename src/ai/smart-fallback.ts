/**
 * Smart Fallback Engine
 * Automatically falls back between Groq models when one fails
 * Only includes tested and working models
 */

import { getModelRegistry } from '@/lib/model-registry';
import type { ModelConfig, ModelCategory } from '@/lib/model-config';
import { getAdapter } from '@/ai/adapters';
import type { GenerateRequest, GenerateResponse } from '@/ai/adapters/types';

interface FallbackAttempt {
  modelId: string;
  error: string;
  timestamp: number;
}

interface FallbackResult {
  response: GenerateResponse;
  modelUsed: string;
  attempts: FallbackAttempt[];
  fallbackTriggered: boolean;
}

/**
 * Exponential backoff delay calculator
 */
function getBackoffDelay(attemptNumber: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds
  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber), maxDelay);
  return delay;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is a critical failure that should trigger immediate fallback
 */
function isCriticalFailure(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Critical failures that should trigger immediate fallback
  const criticalPatterns = [
    'Model is currently loading',
    'Service Unavailable',
    '503',
    '502',
    '504',
    'timeout',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'Model.*is currently loading',
    'estimated_time',
  ];
  
  return criticalPatterns.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Get fallback models for a given category
 * Returns models in order of preference (most capable first)
 */
function getFallbackModels(category: ModelCategory): ModelConfig[] {
  const registry = getModelRegistry();
  const categoryModels = registry.getModelsByCategory(category);
  
  if (categoryModels.length > 0) {
    return categoryModels;
  }
  
  // If no models in category, return all available models
  return registry.getAvailableModels();
}

/**
 * Validate context window size
 * Returns true if the content fits within the model's context window
 */
function validateContextWindow(
  prompt: string,
  history: any[],
  model: ModelConfig
): boolean {
  // Rough token estimation (4 chars ≈ 1 token)
  const promptTokens = Math.ceil(prompt.length / 4);
  
  const historyTokens = history.reduce((sum, msg) => {
    let content = '';
    if (typeof msg.content === 'string') {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content.map((c: any) => c.text || '').join('');
    }
    return sum + Math.ceil(content.length / 4);
  }, 0);
  
  const totalTokens = promptTokens + historyTokens;
  const maxTokens = model.contextWindow * 0.8; // Use 80% of limit for safety
  
  if (totalTokens > maxTokens) {
    console.warn(
      `Context too large (${totalTokens} tokens) for ${model.name} (${model.contextWindow} limit, using ${maxTokens} max)`
    );
    return false;
  }
  
  return true;
}

/**
 * Try to generate with a specific model with retry logic
 */
async function tryGenerateWithModel(
  model: ModelConfig,
  request: Omit<GenerateRequest, 'model'>,
  maxRetries: number = 2
): Promise<GenerateResponse> {
  const adapter = getAdapter(model.provider);
  
  // Validate context window before attempting
  if (!validateContextWindow(request.prompt, request.history || [], model)) {
    throw new Error(
      `Context exceeds model's capacity. Please start a new conversation or reduce message history.`
    );
  }
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await adapter.generate({
        ...request,
        model,
      });
      return response;
    } catch (error) {
      const isCritical = isCriticalFailure(error);
      const isLastAttempt = attempt === maxRetries;
      
      // If critical failure or last attempt, throw immediately
      if (isCritical || isLastAttempt) {
        throw error;
      }
      
      // Otherwise, wait with exponential backoff and retry
      const delay = getBackoffDelay(attempt);
      console.warn(`Attempt ${attempt + 1} failed for ${model.id}, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * Smart fallback generation with automatic model switching
 */
export async function generateWithSmartFallback(
  request: Omit<GenerateRequest, 'model'> & { 
    preferredModelId?: string;
    category?: ModelCategory;
  }
): Promise<FallbackResult> {
  const registry = getModelRegistry();
  const attempts: FallbackAttempt[] = [];
  let fallbackTriggered = false;
  
  // Determine which models to try
  let modelsToTry: ModelConfig[] = [];
  
  if (request.preferredModelId) {
    const preferredModel = registry.getModel(request.preferredModelId);
    if (preferredModel && registry.isModelAvailable(request.preferredModelId)) {
      modelsToTry.push(preferredModel);
    }
  }
  
  // Add fallback models from the same category
  if (request.category) {
    const categoryModels = getFallbackModels(request.category);
    modelsToTry.push(...categoryModels.filter(m => 
      !modelsToTry.some(existing => existing.id === m.id)
    ));
  }
  
  // If still no models in preferred category, try all available models as ultimate fallback
  if (modelsToTry.length === 0) {
    console.warn('No models in preferred category, trying all available models as fallback');
    modelsToTry = registry.getAvailableModels();
  }
  
  if (modelsToTry.length === 0) {
    throw new Error('No models available. Please check your GROQ_API_KEY configuration at https://console.groq.com/keys');
  }
  
  // Try each model in sequence
  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    
    try {
      console.log(`Attempting generation with ${model.name} (${model.id})...`);
      
      const response = await tryGenerateWithModel(model, request);
      
      // Success!
      return {
        response,
        modelUsed: model.id,
        attempts,
        fallbackTriggered: i > 0, // Fallback was triggered if we're not on the first model
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      attempts.push({
        modelId: model.id,
        error: errorMessage,
        timestamp: Date.now(),
      });
      
      console.error(`Failed to generate with ${model.name}:`, errorMessage);
      
      // If this was a critical failure and we have more models, trigger fallback
      if (isCriticalFailure(error) && i < modelsToTry.length - 1) {
        fallbackTriggered = true;
        console.log(`Critical failure detected, falling back to next model...`);
        continue;
      }
      
      // If this is the last model, throw the error
      if (i === modelsToTry.length - 1) {
        throw new Error(
          `All models failed. Last error: ${errorMessage}. ` +
          `Attempted models: ${attempts.map(a => a.modelId).join(', ')}`
        );
      }
      
      // Otherwise, try the next model
      fallbackTriggered = true;
    }
  }
  
  throw new Error('Failed to generate response with any available model');
}

/**
 * Get a user-friendly error message
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('API key') || errorMessage.includes('GROQ_API_KEY')) {
    return 'Please configure your Groq API key. Get a free key at https://console.groq.com/keys';
  }
  
  if (errorMessage.includes('Model is currently loading')) {
    return 'The AI model is loading. This usually takes 20-30 seconds. Please try again in a moment.';
  }
  
  if (errorMessage.includes('rate') || errorMessage.includes('quota')) {
    return 'The service is temporarily busy. Please try again in a moment.';
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (errorMessage.includes('All models failed')) {
    return 'AI service is currently unavailable. Please check your Groq API key and try again in a few minutes.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}
