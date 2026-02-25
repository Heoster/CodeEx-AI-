/**
 * Intelligent Router Service
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Core routing engine that maps classified tasks to optimal models with automatic fallback handling.
 * Implements routing logic based on task category, builds fallback chains, tracks statistics,
 * and supports user routing preferences.
 * 
 * Requirements: 4.1-4.10, 15.1-15.12, 16.1-16.10
 */

import type { 
  ExtendedModelConfig, 
  TaskCategory
} from './model-registry-v3';
import type { ClassificationResult } from './task-classifier-service';
import type { ProviderType } from './model-config-v3.3';
import { ROUTING_RULES_CONFIG } from './routing-rules-config';
import { getRateLimiterService, type RateLimiterService } from './rate-limiter-service';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * User routing preferences
 */
export interface UserRoutingPreferences {
  preferredProviders?: ProviderType[];
  avoidProviders?: ProviderType[];
  prioritizeSpeed?: boolean;
  prioritizeQuality?: boolean;
}

/**
 * Routing request input
 */
export interface RoutingRequest {
  classification: ClassificationResult;
  userMessage: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userPreferences?: UserRoutingPreferences;
  attachments?: Array<{ type: string; mimeType?: string }>;
}

/**
 * Routing result output
 */
export interface RoutingResult {
  selectedModel: ExtendedModelConfig;
  fallbackChain: ExtendedModelConfig[];
  routingReason: string;
  estimatedLatency: number;  // In milliseconds
  routedAt: string;          // ISO 8601 timestamp
}

/**
 * Routing rule definition
 */
export interface RoutingRule {
  category: TaskCategory;
  primaryModelId: string;
  fallbackModelIds: string[];
  conditions?: RoutingCondition[];
}

/**
 * Routing condition for conditional routing
 */
export interface RoutingCondition {
  type: 'TOKEN_COUNT' | 'PROVIDER_AVAILABLE' | 'TIME_OF_DAY' | 'USER_TIER';
  operator: 'GT' | 'LT' | 'EQ' | 'IN';
  value: any;
}

/**
 * Routing statistics
 */
export interface RoutingStatistics {
  totalRequests: number;
  routingsByCategory: Record<TaskCategory, number>;
  fallbackRate: number;
  averageLatency: number;
  providerDistribution: Record<ProviderType, number>;
}

// ============================================================================
// Default Routing Rules Configuration
// ============================================================================

/**
 * Default routing rules for all 11 task categories
 * Imported from routing-rules-config.ts
 * Requirements: 15.1-15.12, 16.1-16.10
 */
export const DEFAULT_ROUTING_RULES: Record<TaskCategory, RoutingRule> = ROUTING_RULES_CONFIG;

// ============================================================================
// Latency Estimation Constants
// ============================================================================

/**
 * Base latency estimates per provider (in milliseconds)
 */
const PROVIDER_BASE_LATENCY: Record<ProviderType, number> = {
  groq: 500,        // Very fast
  cerebras: 600,    // Very fast
  google: 1200,     // Moderate
  huggingface: 2000, // Slower
  elevenlabs: 1500  // Moderate
};

/**
 * Complexity multipliers for latency estimation
 */
const COMPLEXITY_MULTIPLIERS = {
  LOW: 1.0,
  MEDIUM: 1.5,
  HIGH: 2.5
};

// ============================================================================
// Intelligent Router Service
// ============================================================================

export class IntelligentRouterService {
  private routingRules: Map<TaskCategory, RoutingRule>;
  private statistics: RoutingStatistics;
  private modelRegistry: Map<string, ExtendedModelConfig>;
  private rateLimiter: RateLimiterService;

  constructor(
    models: ExtendedModelConfig[] = [],
    customRules?: Record<TaskCategory, RoutingRule>,
    rateLimiter?: RateLimiterService
  ) {
    // Initialize routing rules
    this.routingRules = new Map(
      Object.entries(customRules || DEFAULT_ROUTING_RULES).map(
        ([category, rule]) => [category as TaskCategory, rule]
      )
    );

    // Initialize model registry
    this.modelRegistry = new Map(models.map(m => [m.id, m]));

    // Initialize rate limiter
    this.rateLimiter = rateLimiter || getRateLimiterService();

    // Initialize statistics
    this.statistics = {
      totalRequests: 0,
      routingsByCategory: {} as Record<TaskCategory, number>,
      fallbackRate: 0,
      averageLatency: 0,
      providerDistribution: {} as Record<ProviderType, number>
    };

    // Initialize category counters
    const categories: TaskCategory[] = [
      'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
      'VISION_IN', 'IMAGE_GEN', 'VIDEO_GEN', 'MULTILINGUAL',
      'AGENTIC', 'LONG_CONTEXT'
    ];
    for (const category of categories) {
      this.statistics.routingsByCategory[category] = 0;
    }

    // Initialize provider counters
    const providers: ProviderType[] = ['groq', 'cerebras', 'google', 'huggingface', 'elevenlabs'];
    for (const provider of providers) {
      this.statistics.providerDistribution[provider] = 0;
    }
  }

  // ============================================================================
  // Core Routing Methods
  // ============================================================================

  /**
   * Route a request to the optimal model
   * Requirements: 4.1, 4.2, 4.4, 4.5, 4.6, 4.8
   */
  async route(request: RoutingRequest): Promise<RoutingResult> {
    const { classification, userPreferences } = request;
    const category = classification.category;

    // Get routing rule for category
    const rule = this.routingRules.get(category);
    if (!rule) {
      throw new Error(`No routing rule found for category: ${category}`);
    }

    // Check routing conditions
    if (rule.conditions && !this.checkConditions(rule.conditions, request)) {
      // Conditions not met, use fallback category
      // For now, default to MEDIUM
      const fallbackRule = this.routingRules.get('MEDIUM');
      if (!fallbackRule) {
        throw new Error('Fallback routing rule not found');
      }
      return this.buildRoutingResult(fallbackRule, request, 'Conditions not met, using fallback category');
    }

    // Build routing result with rate limit consideration
    const result = this.buildRoutingResultWithRateLimits(rule, request);

    // Update statistics
    this.updateStatistics(category, result.selectedModel.provider, result.estimatedLatency);

    return result;
  }

  /**
   * Build routing result considering rate limits and provider utilization
   * Requirements: 6.1-6.10, 14.1-14.9
   */
  private buildRoutingResultWithRateLimits(
    rule: RoutingRule,
    request: RoutingRequest,
    customReason?: string
  ): RoutingResult {
    const { classification, userPreferences } = request;
    const estimatedTokens = classification.estimatedTokens;

    // Get primary model
    let primaryModel = this.modelRegistry.get(rule.primaryModelId);
    
    // Check if primary model is available and can execute
    let selectedModel: ExtendedModelConfig | undefined;
    let usedFallback = false;

    if (primaryModel && this.isModelAvailable(primaryModel)) {
      // Check rate limits for primary model
      const canExecute = this.rateLimiter.canExecute(primaryModel.provider, estimatedTokens);
      
      // Check user preferences
      const avoidsProvider = userPreferences?.avoidProviders?.includes(primaryModel.provider);
      
      if (canExecute && !avoidsProvider) {
        // Primary model is available and can execute
        selectedModel = primaryModel;
      }
    }

    // If primary model can't be used, try fallbacks
    if (!selectedModel) {
      usedFallback = true;
      
      // Get all fallback models
      const fallbackModels: ExtendedModelConfig[] = [];
      for (const fallbackId of rule.fallbackModelIds) {
        const model = this.modelRegistry.get(fallbackId);
        if (model && this.isModelAvailable(model)) {
          fallbackModels.push(model);
        }
      }

      if (fallbackModels.length === 0) {
        throw new Error(`No available models found for category: ${rule.category}`);
      }

      // Sort fallbacks by availability (rate limits, utilization, priority)
      const sortedFallbacks = this.sortModelsByAvailability(
        fallbackModels,
        estimatedTokens,
        userPreferences
      );

      selectedModel = sortedFallbacks[0];
    }

    if (!selectedModel) {
      throw new Error(`No available model found for category: ${rule.category}`);
    }

    // Build fallback chain (excluding selected model)
    const fallbackChain = this.buildFallbackChain(
      rule.fallbackModelIds,
      selectedModel.id,
      userPreferences
    );

    // Generate routing reason
    let routingReason = customReason || this.generateRoutingReason(
      selectedModel,
      classification,
      userPreferences
    );

    // Add rate limit information to routing reason
    const canExecute = this.rateLimiter.canExecute(selectedModel.provider, estimatedTokens);
    if (!canExecute) {
      const utilizationRate = this.rateLimiter.calculateUtilizationRate(selectedModel.provider);
      routingReason += `; rate limit reached (${(utilizationRate * 100).toFixed(0)}% utilization), request will be queued`;
    } else if (usedFallback) {
      routingReason += `; primary model unavailable, using fallback`;
    } else {
      const utilizationRate = this.rateLimiter.calculateUtilizationRate(selectedModel.provider);
      if (utilizationRate > 0.5) {
        routingReason += `; provider at ${(utilizationRate * 100).toFixed(0)}% utilization`;
      }
    }

    // Estimate latency
    const estimatedLatency = this.estimateLatency(
      selectedModel,
      classification
    );

    return {
      selectedModel,
      fallbackChain,
      routingReason,
      estimatedLatency,
      routedAt: new Date().toISOString()
    };
  }

  /**
   * Sort models by availability considering rate limits and utilization
   * Requirements: 6.9, 14.1-14.9
   */
  private sortModelsByAvailability(
    models: ExtendedModelConfig[],
    estimatedTokens: number,
    userPreferences?: UserRoutingPreferences
  ): ExtendedModelConfig[] {
    // Calculate score for each model with original index for stable sorting
    const modelScores = models.map((model, index) => {
      let score = 0;

      // Factor 1: Can execute immediately (highest priority)
      const canExecute = this.rateLimiter.canExecute(model.provider, estimatedTokens);
      if (canExecute) {
        score += 1000;
      }

      // Factor 2: Provider utilization (lower is better)
      const utilization = this.rateLimiter.calculateUtilizationRate(model.provider);
      score += (1 - utilization) * 100; // 0-100 points

      // Factor 3: Model priority
      score += model.priority; // 1-100 points

      // Factor 4: User preferences
      if (userPreferences?.preferredProviders?.includes(model.provider)) {
        score += 50;
      }
      if (userPreferences?.avoidProviders?.includes(model.provider)) {
        score -= 100;
      }
      if (userPreferences?.prioritizeSpeed) {
        const fastProviders: ProviderType[] = ['groq', 'cerebras'];
        if (fastProviders.includes(model.provider)) {
          score += 30;
        }
      }

      return { model, score, originalIndex: index };
    });

    // Sort by score (highest first), then by original index for stable sorting
    modelScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, maintain original order
      return a.originalIndex - b.originalIndex;
    });

    return modelScores.map(ms => ms.model);
  }

  /**
   * Check if a request can be executed immediately or needs queuing
   * Requirements: 6.1, 6.4
   */
  canExecuteImmediately(provider: ProviderType, estimatedTokens: number = 0): boolean {
    return this.rateLimiter.canExecute(provider, estimatedTokens);
  }

  /**
   * Enqueue a request when rate limit is reached
   * Requirements: 6.4, 6.6
   */
  enqueueRequest(
    provider: ProviderType,
    estimatedTokens: number = 0,
    priority: number = 0
  ): string {
    return this.rateLimiter.enqueueRequest(provider, estimatedTokens, priority);
  }

  /**
   * Get estimated wait time for a provider
   * Requirements: 6.7
   */
  getEstimatedWaitTime(provider: ProviderType): number {
    const state = this.rateLimiter.getRateLimitState(provider);
    if (!state.isThrottled) {
      return 0;
    }

    const now = Date.now();
    const resetAt = new Date(state.resetAt).getTime();
    return Math.max(0, resetAt - now);
  }

  /**
   * Get provider utilization rate
   * Requirements: 6.9
   */
  getProviderUtilization(provider: ProviderType): number {
    return this.rateLimiter.calculateUtilizationRate(provider);
  }

  /**
   * Check for high utilization alerts
   * Requirements: 6.10, 14.9
   */
  checkUtilizationAlerts(threshold: number = 0.8): Map<ProviderType, number> {
    return this.rateLimiter.checkUtilizationAlerts(threshold);
  }

  /**
   * Record a request execution (for rate limiting)
   * Requirements: 6.1, 6.2, 6.3
   */
  recordRequestExecution(provider: ProviderType, tokens: number = 0): void {
    this.rateLimiter.recordRequest(provider, tokens);
  }

  /**
   * Get rate limiter service instance
   */
  getRateLimiter(): RateLimiterService {
    return this.rateLimiter;
  }

  /**
   * Build routing result from rule
   * Requirements: 4.1, 4.2, 4.4, 4.5
   */
  private buildRoutingResult(
    rule: RoutingRule,
    request: RoutingRequest,
    customReason?: string
  ): RoutingResult {
    const { classification, userPreferences } = request;

    // Get primary model
    let primaryModel = this.modelRegistry.get(rule.primaryModelId);
    
    // Check if primary model is available
    if (!primaryModel || !this.isModelAvailable(primaryModel)) {
      // Try first fallback
      for (const fallbackId of rule.fallbackModelIds) {
        const fallbackModel = this.modelRegistry.get(fallbackId);
        if (fallbackModel && this.isModelAvailable(fallbackModel)) {
          primaryModel = fallbackModel;
          break;
        }
      }
    }

    if (!primaryModel) {
      throw new Error(`No available model found for category: ${rule.category}`);
    }

    // Apply user preferences
    const selectedModel = this.applyUserPreferences(
      primaryModel,
      rule.fallbackModelIds,
      userPreferences
    );

    // Build fallback chain
    const fallbackChain = this.buildFallbackChain(
      rule.fallbackModelIds,
      selectedModel.id,
      userPreferences
    );

    // Generate routing reason
    const routingReason = customReason || this.generateRoutingReason(
      selectedModel,
      classification,
      userPreferences
    );

    // Estimate latency
    const estimatedLatency = this.estimateLatency(
      selectedModel,
      classification
    );

    return {
      selectedModel,
      fallbackChain,
      routingReason,
      estimatedLatency,
      routedAt: new Date().toISOString()
    };
  }

  /**
   * Build fallback chain from model IDs
   * Requirements: 4.2
   */
  private buildFallbackChain(
    fallbackIds: string[],
    excludeId: string,
    userPreferences?: UserRoutingPreferences
  ): ExtendedModelConfig[] {
    const chain: ExtendedModelConfig[] = [];

    for (const modelId of fallbackIds) {
      // Skip the selected model
      if (modelId === excludeId) continue;

      const model = this.modelRegistry.get(modelId);
      if (!model) continue;

      // Check if model is available
      if (!this.isModelAvailable(model)) continue;

      // Check user preferences
      if (userPreferences?.avoidProviders?.includes(model.provider)) {
        continue;
      }

      chain.push(model);
    }

    // Sort by priority (highest first)
    chain.sort((a, b) => b.priority - a.priority);

    return chain;
  }

  /**
   * Apply user routing preferences
   * Requirements: 4.6
   */
  private applyUserPreferences(
    primaryModel: ExtendedModelConfig,
    fallbackIds: string[],
    userPreferences?: UserRoutingPreferences
  ): ExtendedModelConfig {
    if (!userPreferences) {
      return primaryModel;
    }

    // Check if primary model provider is avoided
    if (userPreferences.avoidProviders?.includes(primaryModel.provider)) {
      // Try to find alternative from fallbacks
      for (const fallbackId of fallbackIds) {
        const fallbackModel = this.modelRegistry.get(fallbackId);
        if (!fallbackModel) continue;
        
        if (!userPreferences.avoidProviders.includes(fallbackModel.provider) &&
            this.isModelAvailable(fallbackModel)) {
          return fallbackModel;
        }
      }
    }

    // Check if preferred providers specified
    if (userPreferences.preferredProviders && userPreferences.preferredProviders.length > 0) {
      // If primary model is from preferred provider, use it
      if (userPreferences.preferredProviders.includes(primaryModel.provider)) {
        return primaryModel;
      }

      // Try to find model from preferred provider
      for (const fallbackId of fallbackIds) {
        const fallbackModel = this.modelRegistry.get(fallbackId);
        if (!fallbackModel) continue;
        
        if (userPreferences.preferredProviders.includes(fallbackModel.provider) &&
            this.isModelAvailable(fallbackModel)) {
          return fallbackModel;
        }
      }
    }

    // If prioritize speed, prefer faster providers
    if (userPreferences.prioritizeSpeed) {
      const fastProviders: ProviderType[] = ['groq', 'cerebras'];
      if (fastProviders.includes(primaryModel.provider)) {
        return primaryModel;
      }

      // Try to find fast provider model
      for (const fallbackId of fallbackIds) {
        const fallbackModel = this.modelRegistry.get(fallbackId);
        if (!fallbackModel) continue;
        
        if (fastProviders.includes(fallbackModel.provider) &&
            this.isModelAvailable(fallbackModel)) {
          return fallbackModel;
        }
      }
    }

    // If prioritize quality, prefer higher priority models
    if (userPreferences.prioritizeQuality) {
      const allModels = [primaryModel, ...fallbackIds.map(id => this.modelRegistry.get(id)).filter(Boolean) as ExtendedModelConfig[]];
      const availableModels = allModels.filter(m => this.isModelAvailable(m));
      
      if (availableModels.length > 0) {
        // Sort by priority and return highest
        availableModels.sort((a, b) => b.priority - a.priority);
        return availableModels[0];
      }
    }

    return primaryModel;
  }

  /**
   * Generate routing reason explanation
   * Requirements: 4.4
   */
  private generateRoutingReason(
    selectedModel: ExtendedModelConfig,
    classification: ClassificationResult,
    userPreferences?: UserRoutingPreferences
  ): string {
    const reasons: string[] = [];

    // Category-based reason
    reasons.push(`Selected ${selectedModel.name} for ${classification.category} task`);

    // Complexity consideration
    if (classification.estimatedComplexity === 'HIGH') {
      reasons.push('high complexity requires powerful model');
    } else if (classification.estimatedComplexity === 'LOW') {
      reasons.push('low complexity allows fast model');
    }

    // User preference reasons
    if (userPreferences?.preferredProviders?.includes(selectedModel.provider)) {
      reasons.push(`matches preferred provider (${selectedModel.provider})`);
    }

    if (userPreferences?.prioritizeSpeed) {
      reasons.push('optimized for speed');
    }

    if (userPreferences?.prioritizeQuality) {
      reasons.push('optimized for quality');
    }

    // Multimodal requirement
    if (classification.requiresMultimodal) {
      reasons.push('supports multimodal capabilities');
    }

    return reasons.join('; ');
  }

  /**
   * Estimate response latency
   * Requirements: 4.5
   */
  private estimateLatency(
    model: ExtendedModelConfig,
    classification: ClassificationResult
  ): number {
    // Get base latency for provider
    const baseLatency = PROVIDER_BASE_LATENCY[model.provider] || 1000;

    // Apply complexity multiplier
    const complexityMultiplier = COMPLEXITY_MULTIPLIERS[classification.estimatedComplexity] || 1.5;

    // Apply token count factor (more tokens = more latency)
    const tokenFactor = Math.min(classification.estimatedTokens / 1000, 3); // Cap at 3x

    // Calculate estimated latency
    const estimatedLatency = baseLatency * complexityMultiplier * (1 + tokenFactor * 0.2);

    return Math.round(estimatedLatency);
  }

  /**
   * Check if routing conditions are met
   */
  private checkConditions(
    conditions: RoutingCondition[],
    request: RoutingRequest
  ): boolean {
    for (const condition of conditions) {
      if (!this.checkCondition(condition, request)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check a single routing condition
   */
  private checkCondition(
    condition: RoutingCondition,
    request: RoutingRequest
  ): boolean {
    switch (condition.type) {
      case 'TOKEN_COUNT':
        const tokenCount = request.classification.estimatedTokens;
        return this.compareValues(tokenCount, condition.operator, condition.value);
      
      case 'PROVIDER_AVAILABLE':
        // Check if specific provider is available
        const provider = condition.value as ProviderType;
        return this.isProviderAvailable(provider);
      
      case 'TIME_OF_DAY':
        // Check time of day (for future use)
        const hour = new Date().getHours();
        return this.compareValues(hour, condition.operator, condition.value);
      
      case 'USER_TIER':
        // Check user tier (for future paid tier)
        return true; // Default to true for free tier
      
      default:
        return true;
    }
  }

  /**
   * Compare values based on operator
   */
  private compareValues(actual: number, operator: string, expected: number): boolean {
    switch (operator) {
      case 'GT': return actual > expected;
      case 'LT': return actual < expected;
      case 'EQ': return actual === expected;
      default: return true;
    }
  }

  /**
   * Check if a model is available
   */
  private isModelAvailable(model: ExtendedModelConfig): boolean {
    return (
      model.enabled &&
      model.lifecycle.status !== 'DEAD' &&
      model.lifecycle.healthStatus !== 'UNAVAILABLE'
    );
  }

  /**
   * Check if a provider is available
   */
  private isProviderAvailable(provider: ProviderType): boolean {
    const models = Array.from(this.modelRegistry.values());
    return models.some(m => m.provider === provider && this.isModelAvailable(m));
  }

  // ============================================================================
  // Statistics Methods
  // ============================================================================

  /**
   * Update routing statistics
   * Requirements: 4.8
   */
  private updateStatistics(
    category: TaskCategory,
    provider: ProviderType,
    latency: number
  ): void {
    this.statistics.totalRequests++;
    this.statistics.routingsByCategory[category]++;
    this.statistics.providerDistribution[provider]++;

    // Update average latency (running average)
    const prevTotal = (this.statistics.totalRequests - 1) * this.statistics.averageLatency;
    this.statistics.averageLatency = (prevTotal + latency) / this.statistics.totalRequests;
  }

  /**
   * Get routing statistics
   * Requirements: 4.8
   */
  getRoutingStats(): RoutingStatistics {
    return { ...this.statistics };
  }

  /**
   * Record a fallback event
   */
  recordFallback(): void {
    // Calculate fallback rate
    const fallbackCount = this.statistics.totalRequests * this.statistics.fallbackRate + 1;
    this.statistics.fallbackRate = fallbackCount / (this.statistics.totalRequests + 1);
  }

  /**
   * Get provider distribution percentages
   */
  getProviderDistribution(): Record<ProviderType, number> {
    const total = this.statistics.totalRequests;
    if (total === 0) return this.statistics.providerDistribution;

    const distribution: Record<ProviderType, number> = {} as Record<ProviderType, number>;
    for (const [provider, count] of Object.entries(this.statistics.providerDistribution)) {
      distribution[provider as ProviderType] = (count / total) * 100;
    }

    return distribution;
  }

  /**
   * Get most used category
   */
  getMostUsedCategory(): TaskCategory | null {
    let maxCount = 0;
    let maxCategory: TaskCategory | null = null;

    for (const [category, count] of Object.entries(this.statistics.routingsByCategory)) {
      if (count > maxCount) {
        maxCount = count;
        maxCategory = category as TaskCategory;
      }
    }

    return maxCategory;
  }

  // ============================================================================
  // Configuration Methods
  // ============================================================================

  /**
   * Update routing rules dynamically
   * Requirements: 4.7
   */
  updateRoutingRules(rules: RoutingRule[]): void {
    for (const rule of rules) {
      this.routingRules.set(rule.category, rule);
    }
  }

  /**
   * Get routing rule for a category
   */
  getRoutingRule(category: TaskCategory): RoutingRule | undefined {
    return this.routingRules.get(category);
  }

  /**
   * Get all routing rules
   */
  getAllRoutingRules(): RoutingRule[] {
    return Array.from(this.routingRules.values());
  }

  /**
   * Add or update a model in the registry
   */
  addModel(model: ExtendedModelConfig): void {
    this.modelRegistry.set(model.id, model);
  }

  /**
   * Remove a model from the registry
   */
  removeModel(modelId: string): boolean {
    return this.modelRegistry.delete(modelId);
  }

  /**
   * Get a model by ID
   */
  getModel(modelId: string): ExtendedModelConfig | undefined {
    return this.modelRegistry.get(modelId);
  }

  /**
   * Get all models
   */
  getAllModels(): ExtendedModelConfig[] {
    return Array.from(this.modelRegistry.values());
  }

  /**
   * Reset statistics
   */
  resetStatistics(): void {
    this.statistics = {
      totalRequests: 0,
      routingsByCategory: {} as Record<TaskCategory, number>,
      fallbackRate: 0,
      averageLatency: 0,
      providerDistribution: {} as Record<ProviderType, number>
    };

    // Re-initialize counters
    const categories: TaskCategory[] = [
      'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
      'VISION_IN', 'IMAGE_GEN', 'VIDEO_GEN', 'MULTILINGUAL',
      'AGENTIC', 'LONG_CONTEXT'
    ];
    for (const category of categories) {
      this.statistics.routingsByCategory[category] = 0;
    }

    const providers: ProviderType[] = ['groq', 'cerebras', 'google', 'huggingface', 'elevenlabs'];
    for (const provider of providers) {
      this.statistics.providerDistribution[provider] = 0;
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let routerInstance: IntelligentRouterService | null = null;

/**
 * Get the singleton IntelligentRouterService instance
 */
export function getIntelligentRouterService(): IntelligentRouterService {
  if (!routerInstance) {
    routerInstance = new IntelligentRouterService();
  }
  return routerInstance;
}

/**
 * Initialize the router with models and custom rules
 */
export function initializeIntelligentRouterService(
  models: ExtendedModelConfig[],
  customRules?: Record<TaskCategory, RoutingRule>,
  rateLimiter?: RateLimiterService
): IntelligentRouterService {
  routerInstance = new IntelligentRouterService(models, customRules, rateLimiter);
  return routerInstance;
}

/**
 * Reset the router (useful for testing)
 */
export function resetIntelligentRouterService(): void {
  routerInstance = null;
}
