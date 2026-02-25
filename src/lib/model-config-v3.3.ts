/**
 * Model Configuration Types for V3.3
 * Extended configuration with lifecycle management, capabilities, and rate limits
 */

import { z } from 'zod';
import type { ModelParams } from './model-config';

// Extended provider types for V3.3 (includes elevenlabs)
export type ProviderType = 'groq' | 'cerebras' | 'google' | 'huggingface' | 'elevenlabs';

// Model category types (same as base but redefined for V3.3)
export type ModelCategory = 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';

// Lifecycle status types
export type LifecycleStatus = 'ACTIVE' | 'DYING' | 'DEAD';

// Model capability types
export type CapabilityType = 
  | 'TEXT' 
  | 'VISION' 
  | 'AUDIO_IN' 
  | 'AUDIO_OUT' 
  | 'IMAGE_GEN' 
  | 'VIDEO_GEN' 
  | 'COMPUTER_USE';

// Model lifecycle interface
export interface ModelLifecycleStatus {
  status: LifecycleStatus;
  deprecationDate?: string;
  replacementModelId?: string;
  lastHealthCheck?: string;
  healthStatus?: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
}

// Model capability interface
export interface ModelCapability {
  type: CapabilityType;
  maxInputSize?: number;
  supportedFormats?: string[];
}

// Rate limit configuration
export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay?: number;
  tokensPerMinute?: number;
}

// Extended model configuration for V3.3
export interface ExtendedModelConfig {
  // Core identification
  id: string;
  name: string;
  provider: ProviderType;
  modelId: string;
  
  // Categorization
  category: ModelCategory;
  description: string;
  capabilities: ModelCapability[];
  
  // Technical specs
  contextWindow: number;
  supportsStreaming: boolean;
  maxOutputTokens: number;
  
  // Lifecycle management
  lifecycle: ModelLifecycleStatus;
  
  // Rate limiting
  rateLimit: RateLimitConfig;
  
  // Routing priority (1-100, higher = preferred)
  priority: number;
  
  // Parameters
  defaultParams: ModelParams;
  
  // Status
  enabled: boolean;
  
  // Cost (for future paid tier)
  costPerToken?: number;
}

// Extended provider configuration
export interface ExtendedProviderConfig {
  type: ProviderType;
  apiKeyEnvVar: string;
  baseUrl?: string;
  enabled: boolean;
  rateLimit: RateLimitConfig;
}

// Full configuration store for V3.3
export interface ExtendedModelsConfigStore {
  providers: Record<string, ExtendedProviderConfig>;
  models: ExtendedModelConfig[];
}

// Model usage statistics
export interface ModelUsageStats {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  lastUsed: string;
  errorCount: number;
}

// Zod schemas for validation
export const LifecycleStatusSchema = z.enum(['ACTIVE', 'DYING', 'DEAD']);

export const ProviderTypeSchema = z.enum(['groq', 'cerebras', 'google', 'huggingface', 'elevenlabs']);

export const ModelCategorySchema = z.enum(['general', 'coding', 'math', 'conversation', 'multimodal']);

export const CapabilityTypeSchema = z.enum([
  'TEXT',
  'VISION',
  'AUDIO_IN',
  'AUDIO_OUT',
  'IMAGE_GEN',
  'VIDEO_GEN',
  'COMPUTER_USE'
]);

export const ModelLifecycleStatusSchema = z.object({
  status: LifecycleStatusSchema,
  deprecationDate: z.string().optional(),
  replacementModelId: z.string().optional(),
  lastHealthCheck: z.string().optional(),
  healthStatus: z.enum(['HEALTHY', 'DEGRADED', 'UNAVAILABLE']).optional(),
});

export const ModelCapabilitySchema = z.object({
  type: CapabilityTypeSchema,
  maxInputSize: z.number().int().positive().optional(),
  supportedFormats: z.array(z.string()).optional(),
});

export const RateLimitConfigSchema = z.object({
  requestsPerMinute: z.number().int().positive(),
  requestsPerDay: z.number().int().positive().optional(),
  tokensPerMinute: z.number().int().positive().optional(),
});

export const ExtendedModelConfigSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9.-]+$/, 'ID must be lowercase alphanumeric with hyphens and dots'),
  name: z.string().min(1),
  provider: ProviderTypeSchema,
  modelId: z.string().min(1),
  category: ModelCategorySchema,
  description: z.string(),
  capabilities: z.array(ModelCapabilitySchema),
  contextWindow: z.number().int().nonnegative(),
  supportsStreaming: z.boolean(),
  maxOutputTokens: z.number().int().nonnegative(),
  lifecycle: ModelLifecycleStatusSchema,
  rateLimit: RateLimitConfigSchema,
  priority: z.number().int().min(0).max(100),
  defaultParams: z.object({
    temperature: z.number().min(0).max(2),
    topP: z.number().min(0).max(1),
    topK: z.number().int().positive().optional(),
    maxOutputTokens: z.number().int().nonnegative(),
  }),
  enabled: z.boolean(),
  costPerToken: z.number().positive().optional(),
});

export const ExtendedProviderConfigSchema = z.object({
  type: ProviderTypeSchema,
  apiKeyEnvVar: z.string().min(1),
  baseUrl: z.string().url().optional(),
  enabled: z.boolean(),
  rateLimit: RateLimitConfigSchema,
});

export const ExtendedModelsConfigStoreSchema = z.object({
  providers: z.record(z.string(), ExtendedProviderConfigSchema),
  models: z.array(ExtendedModelConfigSchema),
});

// Validation functions
export function validateExtendedModelConfig(config: unknown): ExtendedModelConfig {
  return ExtendedModelConfigSchema.parse(config);
}

export function validateExtendedProviderConfig(config: unknown): ExtendedProviderConfig {
  return ExtendedProviderConfigSchema.parse(config);
}

export function validateExtendedModelsConfigStore(config: unknown): ExtendedModelsConfigStore {
  return ExtendedModelsConfigStoreSchema.parse(config);
}

// Serialization functions
export function serializeExtendedModelConfig(config: ExtendedModelConfig): string {
  return JSON.stringify(config);
}

export function parseExtendedModelConfig(json: string): ExtendedModelConfig {
  const parsed = JSON.parse(json);
  return validateExtendedModelConfig(parsed);
}

export function serializeExtendedModelsConfigStore(store: ExtendedModelsConfigStore): string {
  return JSON.stringify(store, null, 2);
}

export function parseExtendedModelsConfigStore(json: string): ExtendedModelsConfigStore {
  const parsed = JSON.parse(json);
  return validateExtendedModelsConfigStore(parsed);
}

// Task category types for routing
export type TaskCategory = 
  | 'SIMPLE'           // Basic queries, greetings, simple facts
  | 'MEDIUM'           // General knowledge, explanations
  | 'COMPLEX'          // Multi-step reasoning, analysis
  | 'CODING'           // Code generation, debugging, review
  | 'REASONING'        // Logic puzzles, math, strategic thinking
  | 'VISION_IN'        // Image understanding, OCR, visual Q&A
  | 'IMAGE_GEN'        // Image generation requests
  | 'VIDEO_GEN'        // Video generation requests
  | 'MULTILINGUAL'     // Non-English or translation tasks
  | 'AGENTIC'          // Computer use, tool calling, automation
  | 'LONG_CONTEXT';    // Requests requiring >100K tokens context

export const TaskCategorySchema = z.enum([
  'SIMPLE',
  'MEDIUM',
  'COMPLEX',
  'CODING',
  'REASONING',
  'VISION_IN',
  'IMAGE_GEN',
  'VIDEO_GEN',
  'MULTILINGUAL',
  'AGENTIC',
  'LONG_CONTEXT'
]);

// Helper functions
export function isModelActive(model: ExtendedModelConfig): boolean {
  return model.lifecycle.status === 'ACTIVE' && model.enabled;
}

export function isModelDead(model: ExtendedModelConfig): boolean {
  return model.lifecycle.status === 'DEAD';
}

export function isModelDying(model: ExtendedModelConfig): boolean {
  return model.lifecycle.status === 'DYING';
}

export function getReplacementModel(model: ExtendedModelConfig): string | undefined {
  return model.lifecycle.replacementModelId;
}

export function hasCapability(model: ExtendedModelConfig, capability: CapabilityType): boolean {
  return model.capabilities.some(cap => cap.type === capability);
}

export function getModelsByCapability(
  models: ExtendedModelConfig[],
  capability: CapabilityType
): ExtendedModelConfig[] {
  return models.filter(model => hasCapability(model, capability) && isModelActive(model));
}

export function getActiveModels(models: ExtendedModelConfig[]): ExtendedModelConfig[] {
  return models.filter(isModelActive);
}

export function getModelsByProvider(
  models: ExtendedModelConfig[],
  provider: ProviderType
): ExtendedModelConfig[] {
  return models.filter(model => model.provider === provider && isModelActive(model));
}

export function sortModelsByPriority(models: ExtendedModelConfig[]): ExtendedModelConfig[] {
  return [...models].sort((a, b) => b.priority - a.priority);
}
