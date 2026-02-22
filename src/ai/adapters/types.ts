/**
 * Provider Adapter Types
 * Defines the common interface for all AI provider adapters
 */

import type { ModelConfig, ModelParams, ProviderType } from '@/lib/model-config';

/**
 * Message data structure for conversation history
 */
export interface MessageData {
  role: 'user' | 'model' | 'assistant';
  content: string | Array<{ text: string }>;
}

/**
 * Request structure for generating AI responses
 */
export interface GenerateRequest {
  model: ModelConfig;
  prompt: string;
  systemPrompt?: string;
  history?: MessageData[];
  params?: Partial<ModelParams>;
}

/**
 * Response structure from AI generation
 */
export interface GenerateResponse {
  text: string;
  modelUsed: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

/**
 * Provider adapter interface
 * All provider adapters must implement this interface
 */
export interface ProviderAdapter {
  readonly provider: ProviderType;
  
  /**
   * Check if the provider is available (API key set, etc.)
   */
  isAvailable(): boolean;
  
  /**
   * Generate a response from the AI model
   */
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  
  /**
   * Generate a streaming response (optional)
   */
  generateStream?(request: GenerateRequest): AsyncIterable<string>;
}

/**
 * Base adapter class with common functionality
 */
export abstract class BaseProviderAdapter implements ProviderAdapter {
  abstract readonly provider: ProviderType;
  
  abstract isAvailable(): boolean;
  abstract generate(request: GenerateRequest): Promise<GenerateResponse>;
  
  /**
   * Normalize message history to the format expected by the provider
   */
  protected normalizeHistory(history?: MessageData[]): MessageData[] {
    if (!history) return [];
    
    return history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      content: typeof msg.content === 'string' 
        ? msg.content 
        : msg.content.map(c => c.text).join(''),
    }));
  }
  
  /**
   * Apply default parameters with overrides
   */
  protected mergeParams(model: ModelConfig, overrides?: Partial<ModelParams>): ModelParams {
    return {
      ...model.defaultParams,
      ...overrides,
    };
  }
  
  /**
   * Create a standardized response
   */
  protected createResponse(
    text: string, 
    modelId: string, 
    usage?: { promptTokens: number; completionTokens: number }
  ): GenerateResponse {
    return {
      text,
      modelUsed: modelId,
      usage,
    };
  }
}
