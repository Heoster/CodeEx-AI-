/**
 * Multi-Provider Router with Automatic Fallback
 * Handles provider failures and automatically tries alternative Groq models
 * Only includes tested and working models
 */

import { getAdapter, hasAnyProviderAvailable, type GenerateRequest, type GenerateResponse } from './adapters';
import { getModelRegistry } from '@/lib/model-registry';
import { AIServiceError, type ModelConfig, type ProviderType } from '@/lib/model-config';
import { generateWithSmartFallback, getFriendlyErrorMessage } from './smart-fallback';

interface RouterRequest extends Omit<GenerateRequest, 'model'> {
  preferredModelId?: string;
  category?: 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';
}

interface RouterResponse extends GenerateResponse {
  attemptedProviders: ProviderType[];
  fallbackUsed: boolean;
}

/**
 * Generate with automatic fallback across providers
 */
export async function generateWithFallback(request: RouterRequest): Promise<RouterResponse> {
  const registry = getModelRegistry();
  const attemptedProviders: ProviderType[] = [];
  const errors: Error[] = [];

  // Determine model selection strategy
  let modelsToTry: ModelConfig[] = [];
  
  if (request.preferredModelId) {
    const preferredModel = registry.getModel(request.preferredModelId);
    if (preferredModel && registry.isModelAvailable(preferredModel.id)) {
      modelsToTry.push(preferredModel);
    }
    // Add fallback from same category
    const fallback = registry.getFallbackModel(request.preferredModelId);
    if (fallback && !modelsToTry.find(m => m.id === fallback.id)) {
      modelsToTry.push(fallback);
    }
  } else if (request.category) {
    modelsToTry = registry.getModelsByCategory(request.category);
  } else {
    modelsToTry = registry.getAvailableModels();
  }

  // Ensure we have at least the default model
  if (modelsToTry.length === 0) {
    modelsToTry.push(registry.getDefaultModel());
  }

  // Try each model in sequence
  for (const model of modelsToTry) {
    if (attemptedProviders.includes(model.provider)) {
      continue; // Skip if we already tried this provider
    }

    try {
      const adapter = getAdapter(model.provider);
      
      if (!adapter.isAvailable()) {
        console.warn(`Provider ${model.provider} is not available, skipping...`);
        continue;
      }

      attemptedProviders.push(model.provider);

      const response = await adapter.generate({
        ...request,
        model,
      });

      return {
        ...response,
        attemptedProviders,
        fallbackUsed: attemptedProviders.length > 1,
      };
    } catch (error) {
      console.error(`Error with provider ${model.provider}:`, error);
      errors.push(error instanceof Error ? error : new Error(String(error)));

      // If it's a non-retryable error, mark provider as unavailable
      if (error instanceof AIServiceError && !error.retryable) {
        registry.markProviderUnavailable(model.provider);
      }

      // Continue to next provider
      continue;
    }
  }

  // All initial attempts failed - use smart fallback with all available free models
  console.warn('Initial model attempts failed, using smart fallback across all free Hugging Face models...');
  
  try {
    const fallbackResult = await generateWithSmartFallback({
      prompt: request.prompt,
      systemPrompt: request.systemPrompt,
      history: request.history,
      params: request.params,
      preferredModelId: request.preferredModelId,
      category: request.category,
    });
    
    return {
      text: fallbackResult.response.text,
      modelUsed: fallbackResult.modelUsed,
      usage: fallbackResult.response.usage,
      attemptedProviders,
      fallbackUsed: fallbackResult.fallbackTriggered,
    };
  } catch (fallbackError) {
    const errorMessages = errors.map(e => e.message).join('; ');
    const friendlyMessage = getFriendlyErrorMessage(fallbackError);
    
    throw new Error(
      `${friendlyMessage} Technical details: ${errorMessages}`
    );
  }
}

/**
 * Check if any provider is available
 */
export function isAnyProviderAvailable(): boolean {
  return hasAnyProviderAvailable();
}
