/**
 * Model Configuration Types and Schema
 * Defines the structure for AI model configurations across multiple providers
 */

import { z } from 'zod';

// Model category types
export type ModelCategory = 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';

// Provider types - Only working providers
export type ProviderType = 'groq' | 'huggingface' | 'google' | 'cerebras';

// Model parameters interface
export interface ModelParams {
  temperature: number;
  topP: number;
  topK?: number;
  maxOutputTokens: number;
}

// Model configuration interface
export interface ModelConfig {
  id: string;
  name: string;
  provider: ProviderType;
  modelId: string;
  category: ModelCategory;
  description: string;
  contextWindow: number;
  supportsStreaming: boolean;
  defaultParams: ModelParams;
  enabled: boolean;
}

// Provider configuration interface
export interface ProviderConfig {
  type: ProviderType;
  apiKeyEnvVar: string;
  baseUrl?: string;
  enabled: boolean;
}

// Full configuration store interface
export interface ModelsConfigStore {
  providers: Record<string, ProviderConfig>;
  models: ModelConfig[];
}

// Zod schemas for validation
export const ModelCategorySchema = z.enum(['general', 'coding', 'math', 'conversation', 'multimodal']);

export const ProviderTypeSchema = z.enum(['groq', 'huggingface', 'google', 'cerebras']);

export const ModelParamsSchema = z.object({
  temperature: z.number().min(0).max(2),
  topP: z.number().min(0).max(1),
  topK: z.number().int().positive().optional(),
  maxOutputTokens: z.number().int().positive(),
});

export const ModelConfigSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1),
  provider: ProviderTypeSchema,
  modelId: z.string().min(1),
  category: ModelCategorySchema,
  description: z.string(),
  contextWindow: z.number().int().positive(),
  supportsStreaming: z.boolean(),
  defaultParams: ModelParamsSchema,
  enabled: z.boolean(),
});

export const ProviderConfigSchema = z.object({
  type: ProviderTypeSchema,
  apiKeyEnvVar: z.string().min(1),
  baseUrl: z.string().url().optional(),
  enabled: z.boolean(),
});

export const ModelsConfigStoreSchema = z.object({
  providers: z.record(z.string(), ProviderConfigSchema),
  models: z.array(ModelConfigSchema),
});

// Validation functions
export function validateModelConfig(config: unknown): ModelConfig {
  return ModelConfigSchema.parse(config);
}

export function validateProviderConfig(config: unknown): ProviderConfig {
  return ProviderConfigSchema.parse(config);
}

export function validateModelsConfigStore(config: unknown): ModelsConfigStore {
  return ModelsConfigStoreSchema.parse(config);
}

// Serialization functions
export function serializeModelConfig(config: ModelConfig): string {
  return JSON.stringify(config);
}

export function parseModelConfig(json: string): ModelConfig {
  const parsed = JSON.parse(json);
  return validateModelConfig(parsed);
}

export function serializeModelsConfigStore(store: ModelsConfigStore): string {
  return JSON.stringify(store, null, 2);
}

export function parseModelsConfigStore(json: string): ModelsConfigStore {
  const parsed = JSON.parse(json);
  return validateModelsConfigStore(parsed);
}

// AI Error types for standardized error handling
export type AIErrorCode = 
  | 'AUTH_ERROR' 
  | 'RATE_LIMIT' 
  | 'NETWORK_ERROR' 
  | 'INVALID_RESPONSE' 
  | 'MODEL_UNAVAILABLE';

export interface AIError {
  code: AIErrorCode;
  message: string;
  provider?: ProviderType;
  modelId?: string;
  retryable: boolean;
}

export class AIServiceError extends Error {
  public readonly code: AIErrorCode;
  public readonly provider?: ProviderType;
  public readonly modelId?: string;
  public readonly retryable: boolean;

  constructor(error: AIError) {
    super(error.message);
    this.name = 'AIServiceError';
    this.code = error.code;
    this.provider = error.provider;
    this.modelId = error.modelId;
    this.retryable = error.retryable;
  }

  toJSON(): AIError {
    return {
      code: this.code,
      message: this.message,
      provider: this.provider,
      modelId: this.modelId,
      retryable: this.retryable,
    };
  }
}

// Helper to create user-friendly error messages
export function createUserFriendlyError(error: unknown, provider?: ProviderType, modelId?: string): AIServiceError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('API key') || errorMessage.includes('authentication') || errorMessage.includes('401')) {
    return new AIServiceError({
      code: 'AUTH_ERROR',
      message: 'Authentication failed. Please check your API key configuration.',
      provider,
      modelId,
      retryable: false,
    });
  }
  
  if (errorMessage.includes('rate') || errorMessage.includes('quota') || errorMessage.includes('429')) {
    return new AIServiceError({
      code: 'RATE_LIMIT',
      message: 'Service is temporarily busy. Please try again in a moment.',
      provider,
      modelId,
      retryable: true,
    });
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('timeout')) {
    return new AIServiceError({
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection and try again.',
      provider,
      modelId,
      retryable: true,
    });
  }
  
  if (errorMessage.includes('model') && (errorMessage.includes('not found') || errorMessage.includes('unavailable'))) {
    return new AIServiceError({
      code: 'MODEL_UNAVAILABLE',
      message: 'The selected model is currently unavailable. Trying an alternative model.',
      provider,
      modelId,
      retryable: true,
    });
  }
  
  return new AIServiceError({
    code: 'INVALID_RESPONSE',
    message: 'An unexpected error occurred. Please try again.',
    provider,
    modelId,
    retryable: true,
  });
}
