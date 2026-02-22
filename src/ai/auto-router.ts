/**
 * Auto Router
 * Automatically selects the best model based on query analysis
 */

import type { ModelConfig, ModelCategory } from '@/lib/model-config';
import { getModelRegistry } from '@/lib/model-registry';
import { classifyQuery, type QueryClassification } from './query-classifier';

/**
 * Result of auto-routing including the selected model and reasoning
 */
export interface AutoRouteResult {
  model: ModelConfig;
  classification: QueryClassification;
  autoRouted: boolean;
  fallbackUsed: boolean;
}

/**
 * Auto Router class for intelligent model selection
 */
export class AutoRouter {
  private registry = getModelRegistry();
  
  /**
   * Select the best model for a given query
   */
  selectModel(query: string, preferredCategory?: ModelCategory): AutoRouteResult {
    // Classify the query
    const classification = classifyQuery(query);
    
    // Use preferred category if provided, otherwise use classification
    const targetCategory = preferredCategory || classification.category;
    
    // Try to get a model from the target category
    const categoryModels = this.registry.getModelsByCategory(targetCategory);
    
    if (categoryModels.length > 0) {
      return {
        model: categoryModels[0],
        classification: {
          ...classification,
          category: targetCategory,
          reasoning: preferredCategory 
            ? `Using preferred category: ${preferredCategory}`
            : classification.reasoning,
        },
        autoRouted: true,
        fallbackUsed: false,
      };
    }
    
    // Fallback to default model if no models in target category
    const fallbackModel = this.registry.getDefaultModel();
    
    return {
      model: fallbackModel,
      classification: {
        ...classification,
        reasoning: `No ${targetCategory} models available. ${classification.reasoning} Falling back to ${fallbackModel.name}.`,
      },
      autoRouted: true,
      fallbackUsed: true,
    };
  }
  
  /**
   * Get a specific model by ID, with fallback if unavailable
   */
  getModelWithFallback(modelId: string): AutoRouteResult {
    const model = this.registry.getModel(modelId);
    
    if (model && this.registry.isModelAvailable(modelId)) {
      return {
        model,
        classification: {
          category: model.category,
          confidence: 1.0,
          reasoning: `Using explicitly selected model: ${model.name}`,
        },
        autoRouted: false,
        fallbackUsed: false,
      };
    }
    
    // Model not available, get fallback
    const fallbackModel = model 
      ? this.registry.getFallbackModel(modelId)
      : this.registry.getDefaultModel();
    
    return {
      model: fallbackModel,
      classification: {
        category: fallbackModel.category,
        confidence: 0.8,
        reasoning: model 
          ? `Selected model "${model.name}" is unavailable. Using ${fallbackModel.name} as fallback.`
          : `Model "${modelId}" not found. Using ${fallbackModel.name} as default.`,
      },
      autoRouted: false,
      fallbackUsed: true,
    };
  }
  
  /**
   * Route a request based on settings
   */
  route(query: string, modelSetting: string, preferredCategory?: ModelCategory): AutoRouteResult {
    if (modelSetting === 'auto') {
      return this.selectModel(query, preferredCategory);
    }
    
    return this.getModelWithFallback(modelSetting);
  }
}

// Singleton instance
let routerInstance: AutoRouter | null = null;

export function getAutoRouter(): AutoRouter {
  if (!routerInstance) {
    routerInstance = new AutoRouter();
  }
  return routerInstance;
}

/**
 * Reset the router (useful for testing)
 */
export function resetAutoRouter(): void {
  routerInstance = null;
}
