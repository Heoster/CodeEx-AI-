/**
 * Model Registry
 * Manages available AI models and provides methods to query and select models
 */

import type { ModelConfig, ModelCategory, ProviderConfig, ProviderType } from './model-config';

interface ModelsConfigStore {
  providers: Record<string, ProviderConfig>;
  models: ModelConfig[];
}
import modelsConfigData from './models-config.json';

// Type assertion for the imported JSON
const modelsConfig = modelsConfigData as ModelsConfigStore;

// Provider availability cache
const providerAvailability: Map<ProviderType, boolean> = new Map();

/**
 * Check if a provider's API key is available
 */
function checkProviderApiKey(provider: ProviderConfig): boolean {
  if (!provider.enabled) return false;
  
  // In browser environment, we can't check env vars directly
  // This will be checked server-side
  if (typeof window !== 'undefined') {
    return provider.enabled;
  }
  
  const apiKey = process.env[provider.apiKeyEnvVar];
  
  // Check if API key exists, has length, and is not a placeholder
  const isValid = !!apiKey && 
                  apiKey.length > 0 && 
                  !apiKey.includes('your_') && 
                  !apiKey.includes('_here');
  
  return isValid;
}

/**
 * Initialize provider availability based on API keys
 */
function initializeProviderAvailability(): void {
  for (const [key, provider] of Object.entries(modelsConfig.providers)) {
    const isAvailable = checkProviderApiKey(provider);
    providerAvailability.set(provider.type, isAvailable);
    
    if (!isAvailable && typeof window === 'undefined') {
      console.warn(
        `⚠️ ${provider.apiKeyEnvVar} is not set. Models from ${key} provider will be unavailable.`
      );
    }
  }
}

// Initialize on module load
initializeProviderAvailability();

/**
 * Model Registry class for managing AI models
 */
export class ModelRegistry {
  private models: ModelConfig[];
  private providers: Record<string, ProviderConfig>;

  constructor() {
    this.models = modelsConfig.models;
    this.providers = modelsConfig.providers;
  }

  /**
   * Get a model by its ID
   */
  getModel(id: string): ModelConfig | undefined {
    return this.models.find(model => model.id === id);
  }

  /**
   * Get all models in a specific category
   */
  getModelsByCategory(category: ModelCategory): ModelConfig[] {
    return this.models.filter(
      model => model.category === category && this.isModelAvailable(model.id)
    );
  }

  /**
   * Get all available models (enabled and provider available)
   */
  getAvailableModels(): ModelConfig[] {
    return this.models.filter(model => this.isModelAvailable(model.id));
  }

  /**
   * Get all models grouped by category
   */
  getModelsGroupedByCategory(): Record<ModelCategory, ModelConfig[]> {
    const grouped: Record<ModelCategory, ModelConfig[]> = {
      general: [],
      coding: [],
      math: [],
      conversation: [],
      multimodal: [],
    };

    for (const model of this.getAvailableModels()) {
      grouped[model.category].push(model);
    }

    return grouped;
  }

  /**
   * Get the default model for a category (or overall default)
   */
  getDefaultModel(category?: ModelCategory): ModelConfig {
    let candidates: ModelConfig[];

    if (category) {
      candidates = this.getModelsByCategory(category);
    } else {
      candidates = this.getAvailableModels();
    }

    // Return first available model
    if (candidates.length > 0) return candidates[0];

    // If no candidates are available, throw so callers can handle the missing-model case
    throw new Error('No models available in registry');
  }

  /**
   * Check if a specific model is available
   */
  isModelAvailable(id: string): boolean {
    const model = this.models.find(m => m.id === id);
    if (!model) return false;
    if (!model.enabled) return false;

    return this.isProviderAvailable(model.provider);
  }

  /**
   * Check if a provider is available
   */
  isProviderAvailable(providerType: ProviderType): boolean {
    return providerAvailability.get(providerType) ?? false;
  }

  /**
   * Mark a provider as unavailable (e.g., after auth error)
   */
  markProviderUnavailable(providerType: ProviderType): void {
    providerAvailability.set(providerType, false);
  }

  /**
   * Get provider configuration
   */
  getProvider(providerType: ProviderType): ProviderConfig | undefined {
    return Object.values(this.providers).find(p => p.type === providerType);
  }

  /**
   * Get a fallback model when the requested model is unavailable
   */
  getFallbackModel(requestedId: string): ModelConfig {
    const requested = this.getModel(requestedId);
    
    if (requested) {
      // Try to find another model in the same category
      const sameCategoryModels = this.getModelsByCategory(requested.category);
      const fallback = sameCategoryModels.find(m => m.id !== requestedId);
      if (fallback) return fallback;
    }

    // Fall back to default model
    return this.getDefaultModel();
  }

  /**
   * Get display information for a model
   */
  getModelDisplayInfo(id: string): { name: string; provider: string; description: string } | undefined {
    const model = this.getModel(id);
    if (!model) return undefined;

    return {
      name: model.name,
      provider: this.getProviderDisplayName(model.provider),
      description: model.description,
    };
  }

  /**
   * Get human-readable provider name
   */
  private getProviderDisplayName(providerType: ProviderType): string {
    switch (providerType) {
      case 'groq':
        return 'Groq';
      case 'huggingface':
        return 'Hugging Face';
      case 'google':
        return 'Google';
      case 'cerebras':
        return 'Cerebras';
      default:
        return providerType;
    }
  }

  /**
   * Refresh provider availability (useful after config changes)
   */
  refreshProviderAvailability(): void {
    providerAvailability.clear();
    initializeProviderAvailability();
  }
}

// Auto-refresh provider availability every 5 minutes (server-side only)
if (typeof window === 'undefined') {
  setInterval(() => {
    const registry = getModelRegistry();
    registry.refreshProviderAvailability();
  }, 5 * 60 * 1000);
}

// Singleton instance
let registryInstance: ModelRegistry | null = null;

/**
 * Get the singleton ModelRegistry instance
 */
export function getModelRegistry(): ModelRegistry {
  if (!registryInstance) {
    registryInstance = new ModelRegistry();
  }
  return registryInstance;
}

/**
 * Reset the registry (useful for testing)
 */
export function resetModelRegistry(): void {
  registryInstance = null;
  initializeProviderAvailability();
}

// Export singleton instance for backward compatibility
export const modelRegistry = getModelRegistry();
