/**
 * Model Registry V3 - Extended with Lifecycle Management
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Manages 30+ AI models across 5 providers with:
 * - Lifecycle status tracking (ACTIVE, DYING, DEAD)
 * - Model capability tracking (TEXT, VISION, AUDIO_IN, AUDIO_OUT, IMAGE_GEN, VIDEO_GEN, COMPUTER_USE)
 * - Rate limit configuration per model
 * - Priority-based model ranking for fallback chains
 * - Health monitoring and usage statistics
 */

import type { ModelConfig, ModelCategory, ProviderType, ModelParams } from './model-config';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Model lifecycle status
 * - ACTIVE: Model is fully operational and recommended for use
 * - DYING: Model is deprecated but still functional (shows warnings)
 * - DEAD: Model is no longer available (auto-redirects to replacement)
 */
export type LifecycleStatus = 'ACTIVE' | 'DYING' | 'DEAD';

/**
 * Model health status from periodic health checks
 * - HEALTHY: Model is responding normally
 * - DEGRADED: Model is experiencing issues but still functional
 * - UNAVAILABLE: Model is not responding to health checks
 */
export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';

/**
 * Model capability types
 */
export type ModelCapabilityType = 
  | 'TEXT'           // Text generation
  | 'VISION'         // Image understanding
  | 'AUDIO_IN'       // Audio transcription
  | 'AUDIO_OUT'      // Text-to-speech
  | 'IMAGE_GEN'      // Image generation
  | 'VIDEO_GEN'      // Video generation
  | 'COMPUTER_USE';  // Computer use/tool calling

/**
 * Task categories for routing
 */
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

// ============================================================================
// Interface Definitions
// ============================================================================

/**
 * Model lifecycle information
 */
export interface ModelLifecycleStatus {
  status: LifecycleStatus;
  deprecationDate?: string;        // ISO 8601 date when model becomes DEAD
  replacementModelId?: string;     // Model to use when this one is DEAD
  lastHealthCheck?: string;        // ISO 8601 timestamp of last health check
  healthStatus?: HealthStatus;     // Current health status
}

/**
 * Model capability definition
 */
export interface ModelCapability {
  type: ModelCapabilityType;
  maxInputSize?: number;           // Max input size in bytes (for files)
  supportedFormats?: string[];     // Supported file formats (e.g., ['mp3', 'wav'])
}

/**
 * Rate limit configuration per model/provider
 */
export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay?: number;
  tokensPerMinute?: number;
}

/**
 * Extended model configuration with V3.3 features
 */
export interface ExtendedModelConfig extends ModelConfig {
  // New V3.3 fields
  lifecycle: ModelLifecycleStatus;
  capabilities: ModelCapability[];
  rateLimit: RateLimitConfig;
  priority: number;                // 1-100, higher = preferred in fallback chains
  costPerToken?: number;           // For future paid tier
  maxOutputTokens?: number;        // Maximum output tokens
}

/**
 * Model usage statistics
 */
export interface ModelUsageStats {
  totalRequests: number;
  successRate: number;             // 0-1 range
  averageLatency: number;          // In milliseconds
  lastUsed: string;                // ISO 8601 timestamp
  errorCount: number;
}

// ============================================================================
// Model Registry V3 Class
// ============================================================================

/**
 * Extended Model Registry with lifecycle management and advanced features
 */
export class ModelRegistryV3 {
  private models: Map<string, ExtendedModelConfig>;
  private usageStats: Map<string, ModelUsageStats>;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(models: ExtendedModelConfig[] = []) {
    this.models = new Map(models.map(m => [m.id, m]));
    this.usageStats = new Map();
    
    // Initialize usage stats for all models
    for (const model of models) {
      this.usageStats.set(model.id, {
        totalRequests: 0,
        successRate: 1.0,
        averageLatency: 0,
        lastUsed: new Date().toISOString(),
        errorCount: 0,
      });
    }
  }

  // ============================================================================
  // Basic Model Queries
  // ============================================================================

  /**
   * Get a model by its ID
   */
  getModel(id: string): ExtendedModelConfig | undefined {
    return this.models.get(id);
  }

  /**
   * Get all models
   */
  getAllModels(): ExtendedModelConfig[] {
    return Array.from(this.models.values());
  }

  /**
   * Get all available models (enabled and not DEAD)
   */
  getAvailableModels(): ExtendedModelConfig[] {
    return this.getAllModels().filter(
      model => model.enabled && model.lifecycle.status !== 'DEAD'
    );
  }

  /**
   * Check if a model is available for use
   */
  isModelAvailable(id: string): boolean {
    const model = this.getModel(id);
    if (!model) return false;
    if (!model.enabled) return false;
    if (model.lifecycle.status === 'DEAD') return false;
    if (model.lifecycle.healthStatus === 'UNAVAILABLE') return false;
    return true;
  }

  // ============================================================================
  // Lifecycle Management
  // ============================================================================

  /**
   * Get all models with a specific lifecycle status
   */
  getModelsByLifecycle(status: LifecycleStatus): ExtendedModelConfig[] {
    return this.getAllModels().filter(
      model => model.lifecycle.status === status
    );
  }

  /**
   * Get all ACTIVE models
   */
  getActiveModels(): ExtendedModelConfig[] {
    return this.getModelsByLifecycle('ACTIVE');
  }

  /**
   * Get all DYING models (deprecated but still functional)
   */
  getDyingModels(): ExtendedModelConfig[] {
    return this.getModelsByLifecycle('DYING');
  }

  /**
   * Get all DEAD models (no longer available)
   */
  getDeadModels(): ExtendedModelConfig[] {
    return this.getModelsByLifecycle('DEAD');
  }

  /**
   * Mark a model as DEAD and optionally specify a replacement
   */
  markModelDead(id: string, replacementId?: string): void {
    const model = this.getModel(id);
    if (!model) {
      throw new Error(`Model ${id} not found`);
    }

    model.lifecycle.status = 'DEAD';
    model.lifecycle.replacementModelId = replacementId;
    
    console.log(
      `Model ${id} marked as DEAD${replacementId ? ` (replacement: ${replacementId})` : ''}`
    );
  }

  /**
   * Check all models for automatic deprecation based on deprecation date
   * Should be called periodically (e.g., daily)
   */
  checkDeprecations(): void {
    const now = new Date();
    
    for (const model of this.getAllModels()) {
      if (model.lifecycle.deprecationDate) {
        const deprecationDate = new Date(model.lifecycle.deprecationDate);
        
        // If deprecation date has passed, mark as DEAD
        if (now >= deprecationDate && model.lifecycle.status !== 'DEAD') {
          this.markModelDead(model.id, model.lifecycle.replacementModelId);
        }
        // If within 30 days of deprecation, mark as DYING
        else if (model.lifecycle.status === 'ACTIVE') {
          const daysUntilDeprecation = Math.floor(
            (deprecationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysUntilDeprecation <= 30) {
            model.lifecycle.status = 'DYING';
            console.warn(
              `Model ${model.id} is DYING (${daysUntilDeprecation} days until deprecation)`
            );
          }
        }
      }
    }
  }

  /**
   * Get the replacement model for a DEAD model
   */
  getReplacementModel(id: string): ExtendedModelConfig | undefined {
    const model = this.getModel(id);
    if (!model || model.lifecycle.status !== 'DEAD') {
      return undefined;
    }

    if (model.lifecycle.replacementModelId) {
      return this.getModel(model.lifecycle.replacementModelId);
    }

    return undefined;
  }

  // ============================================================================
  // Capability Queries
  // ============================================================================

  /**
   * Get all models that support a specific capability
   */
  getModelsByCapability(capability: ModelCapabilityType): ExtendedModelConfig[] {
    return this.getAvailableModels().filter(model =>
      model.capabilities.some(cap => cap.type === capability)
    );
  }

  /**
   * Check if a model supports a specific capability
   */
  modelHasCapability(id: string, capability: ModelCapabilityType): boolean {
    const model = this.getModel(id);
    if (!model) return false;
    
    return model.capabilities.some(cap => cap.type === capability);
  }

  /**
   * Get models that support multiple capabilities
   */
  getModelsByCapabilities(capabilities: ModelCapabilityType[]): ExtendedModelConfig[] {
    return this.getAvailableModels().filter(model =>
      capabilities.every(capability =>
        model.capabilities.some(cap => cap.type === capability)
      )
    );
  }

  // ============================================================================
  // Fallback Chain Management
  // ============================================================================

  /**
   * Get a fallback chain for a task category
   * Returns models sorted by priority (highest first)
   */
  getFallbackChain(taskCategory: TaskCategory): ExtendedModelConfig[] {
    // Get all available models
    const availableModels = this.getAvailableModels();
    
    // Sort by priority (highest first)
    return availableModels
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5); // Limit to top 5 models for fallback chain
  }

  /**
   * Get the primary model for a task category based on priority
   */
  getPrimaryModel(taskCategory: TaskCategory): ExtendedModelConfig | undefined {
    const chain = this.getFallbackChain(taskCategory);
    return chain[0];
  }

  // ============================================================================
  // Health Monitoring
  // ============================================================================

  /**
   * Check the health of a specific model
   * Returns true if healthy, false otherwise
   */
  async checkModelHealth(id: string): Promise<boolean> {
    const model = this.getModel(id);
    if (!model) return false;

    try {
      // In a real implementation, this would make an actual health check request
      // For now, we'll simulate it
      const isHealthy = Math.random() > 0.1; // 90% success rate simulation
      
      model.lifecycle.lastHealthCheck = new Date().toISOString();
      
      if (isHealthy) {
        model.lifecycle.healthStatus = 'HEALTHY';
        return true;
      } else {
        // If previously healthy, mark as degraded
        if (model.lifecycle.healthStatus === 'HEALTHY') {
          model.lifecycle.healthStatus = 'DEGRADED';
        }
        // If already degraded, mark as unavailable
        else if (model.lifecycle.healthStatus === 'DEGRADED') {
          model.lifecycle.healthStatus = 'UNAVAILABLE';
        }
        return false;
      }
    } catch (error) {
      model.lifecycle.healthStatus = 'UNAVAILABLE';
      return false;
    }
  }

  /**
   * Check health of all ACTIVE models
   */
  async checkAllModelsHealth(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    const activeModels = this.getActiveModels();
    
    for (const model of activeModels) {
      const isHealthy = await this.checkModelHealth(model.id);
      results.set(model.id, isHealthy);
    }
    
    return results;
  }

  /**
   * Start periodic health checks (every 5 minutes)
   */
  startHealthChecks(intervalMs: number = 5 * 60 * 1000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.checkAllModelsHealth().catch(error => {
        console.error('Health check failed:', error);
      });
    }, intervalMs);
  }

  /**
   * Stop periodic health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  // ============================================================================
  // Usage Statistics
  // ============================================================================

  /**
   * Get usage statistics for a model
   */
  getModelUsageStats(id: string): ModelUsageStats | undefined {
    return this.usageStats.get(id);
  }

  /**
   * Record a successful request for a model
   */
  recordSuccess(id: string, latency: number): void {
    const stats = this.usageStats.get(id);
    if (!stats) return;

    const previousSuccessfulRequests = stats.totalRequests - stats.errorCount;
    
    stats.totalRequests++;
    stats.lastUsed = new Date().toISOString();
    
    // Update average latency (running average of successful requests only)
    stats.averageLatency = 
      (stats.averageLatency * previousSuccessfulRequests + latency) / (previousSuccessfulRequests + 1);
    
    // Update success rate
    const successfulRequests = stats.totalRequests - stats.errorCount;
    stats.successRate = successfulRequests / stats.totalRequests;
  }

  /**
   * Record a failed request for a model
   */
  recordError(id: string): void {
    const stats = this.usageStats.get(id);
    if (!stats) return;

    stats.totalRequests++;
    stats.errorCount++;
    stats.lastUsed = new Date().toISOString();
    
    // Update success rate
    const successfulRequests = stats.totalRequests - stats.errorCount;
    stats.successRate = successfulRequests / stats.totalRequests;
    
    // Note: averageLatency is not updated for errors, as they don't have latency
    // This means averageLatency represents the average latency of successful requests only
  }

  /**
   * Get all usage statistics
   */
  getAllUsageStats(): Map<string, ModelUsageStats> {
    return new Map(this.usageStats);
  }

  /**
   * Get models sorted by success rate
   */
  getModelsBySuccessRate(): ExtendedModelConfig[] {
    return this.getAvailableModels().sort((a, b) => {
      const statsA = this.usageStats.get(a.id);
      const statsB = this.usageStats.get(b.id);
      
      if (!statsA || !statsB) return 0;
      return statsB.successRate - statsA.successRate;
    });
  }

  /**
   * Get models sorted by average latency (fastest first)
   */
  getModelsByLatency(): ExtendedModelConfig[] {
    return this.getAvailableModels().sort((a, b) => {
      const statsA = this.usageStats.get(a.id);
      const statsB = this.usageStats.get(b.id);
      
      if (!statsA || !statsB) return 0;
      return statsA.averageLatency - statsB.averageLatency;
    });
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Add a new model to the registry
   */
  addModel(model: ExtendedModelConfig): void {
    this.models.set(model.id, model);
    
    // Initialize usage stats
    this.usageStats.set(model.id, {
      totalRequests: 0,
      successRate: 1.0,
      averageLatency: 0,
      lastUsed: new Date().toISOString(),
      errorCount: 0,
    });
  }

  /**
   * Remove a model from the registry
   */
  removeModel(id: string): boolean {
    this.usageStats.delete(id);
    return this.models.delete(id);
  }

  /**
   * Update a model's configuration
   */
  updateModel(id: string, updates: Partial<ExtendedModelConfig>): void {
    const model = this.getModel(id);
    if (!model) {
      throw new Error(`Model ${id} not found`);
    }

    Object.assign(model, updates);
  }

  /**
   * Get registry statistics
   */
  getRegistryStats(): {
    totalModels: number;
    activeModels: number;
    dyingModels: number;
    deadModels: number;
    healthyModels: number;
    degradedModels: number;
    unavailableModels: number;
  } {
    const all = this.getAllModels();
    
    return {
      totalModels: all.length,
      activeModels: this.getActiveModels().length,
      dyingModels: this.getDyingModels().length,
      deadModels: this.getDeadModels().length,
      healthyModels: all.filter(m => m.lifecycle.healthStatus === 'HEALTHY').length,
      degradedModels: all.filter(m => m.lifecycle.healthStatus === 'DEGRADED').length,
      unavailableModels: all.filter(m => m.lifecycle.healthStatus === 'UNAVAILABLE').length,
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let registryV3Instance: ModelRegistryV3 | null = null;

/**
 * Get the singleton ModelRegistryV3 instance
 */
export function getModelRegistryV3(): ModelRegistryV3 {
  if (!registryV3Instance) {
    registryV3Instance = new ModelRegistryV3();
  }
  return registryV3Instance;
}

/**
 * Initialize the registry with models
 */
export function initializeModelRegistryV3(models: ExtendedModelConfig[]): ModelRegistryV3 {
  registryV3Instance = new ModelRegistryV3(models);
  return registryV3Instance;
}

/**
 * Reset the registry (useful for testing)
 */
export function resetModelRegistryV3(): void {
  if (registryV3Instance) {
    registryV3Instance.stopHealthChecks();
  }
  registryV3Instance = null;
}
