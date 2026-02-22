/**
 * Provider Adapters Index
 * Includes working providers (Groq, Hugging Face, Google, Cerebras)
 */

export * from './types';
export { GroqAdapter, getGroqAdapter } from './groq-adapter';
export { HuggingFaceAdapter, getHuggingFaceAdapter } from './huggingface-adapter';
export { GoogleAdapter, getGoogleAdapter } from './google-adapter';
export { CerebrasAdapter, getCerebrasAdapter } from './cerebras-adapter';

import type { ProviderAdapter } from './types';
import type { ProviderType } from '@/lib/model-config';
import { getGroqAdapter } from './groq-adapter';
import { getHuggingFaceAdapter } from './huggingface-adapter';
import { getGoogleAdapter } from './google-adapter';
import { getCerebrasAdapter } from './cerebras-adapter';

/**
 * Get the appropriate adapter for a provider type
 */
export function getAdapter(providerType: ProviderType): ProviderAdapter {
  switch (providerType) {
    case 'groq':
      return getGroqAdapter();
    case 'huggingface':
      return getHuggingFaceAdapter();
    case 'google':
      return getGoogleAdapter();
    case 'cerebras':
      return getCerebrasAdapter();
    default:
      throw new Error(`Unknown provider type: ${providerType}`);
  }
}

/**
 * Check if any provider is available
 */
export function hasAnyProviderAvailable(): boolean {
  return getGroqAdapter().isAvailable() || 
         getHuggingFaceAdapter().isAvailable() || 
         getGoogleAdapter().isAvailable() ||
         getCerebrasAdapter().isAvailable();
}
