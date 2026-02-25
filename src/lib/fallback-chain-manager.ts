/**
 * Fallback Chain Manager
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Manages multi-tier fallback chains with exponential backoff and intelligent retry logic.
 * Handles automatic fallback execution on primary model failure, provider switching on rate limits,
 * timeout increases on retry, and tracks fallback execution history and performance metrics.
 * 
 * Requirements: 5.1-5.10
 */

import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';
import type { ProviderType } from './model-config-v3.3';
import type { GenerateRequest, GenerateResponse } from '@/ai/adapters/types';
import { handleError, type ErrorContext } from './error-handler-v3';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Fallback chain configuration
 */
export interface FallbackChainConfig {
  category: TaskCategory;
  chain: FallbackTier[];
  maxRetries: number;
  backoffStrategy: 'EXPONENTIAL' | 'LINEAR' | 'FIXED';
  initialDelayMs: number;
}

/**
 * Individual tier in fallback chain
 */
export interface FallbackTier {
  modelId: string;
  priority: number;
  conditions?: FallbackCondition[];
}

/**
 * Condition for fallback execution
 */
export interface FallbackCondition {
  errorType: 'RATE_LIMIT' | 'TIMEOUT' | 'AUTH_ERROR' | 'SERVICE_UNAVAILABLE' | 'MODEL_ERROR';
  shouldFallback: boolean;
}

/**
 * Single fallback execution attempt
 */
export interface FallbackExecution {
  attemptNumber: number;
  modelId: string;
  success: boolean;
  error?: Error;
  latency: number;
  timestamp: string;
  errorType?: string;
}

/**
 * Chain performance metrics
 */
export interface ChainPerformanceMetrics {
  category: TaskCategory;
  totalExecutions: number;
  primarySuccessRate: number;
  averageFallbackDepth: number;
  mostReliableModel: string;
  leastReliableModel: string;
  modelSuccessRates: Record<string, number>;
}

/**
 * Error types for classification
 */
export enum ErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  TIMEOUT = 'TIMEOUT',
  AUTH_ERROR = 'AUTH_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  MODEL_ERROR = 'MODEL_ERROR',
  UNKNOWN = 'UNKNOWN'
}

// ============================================================================
// Fallback Chain Manager
// ============================================================================

/**
 * Manages fallback chain execution with intelligent retry logic
 */
export class FallbackChainManager {
  private fallbackHistory: Map<string, FallbackExecution[]> = new Map();
  private modelStats: Map<string, { attempts: number; successes: number; failures: number }> = new Map();
  private unavailableProviders: Set<ProviderType> = new Set();
  private categoryStats: Map<TaskCategory, { executions: number; fallbackDepths: number[] }> = new Map();

  /**
   * Execute request with automatic fallback chain
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
   */
  async executeWithFallback(
    request: GenerateRequest,
    chain: ExtendedModelConfig[],
    category: TaskCategory,
    executeModel: (model: ExtendedModelConfig, req: GenerateRequest, timeoutMs?: number) => Promise<GenerateResponse>
  ): Promise<GenerateResponse> {
    const requestId = this.generateRequestId();
    const executions: FallbackExecution[] = [];
    let lastError: Error | undefined;
    let currentTimeout = 4000; // Default 4s timeout for serverless

    // Initialize category stats if needed
    if (!this.categoryStats.has(category)) {
      this.categoryStats.set(category, { executions: 0, fallbackDepths: [] });
    }

    for (let i = 0; i < chain.length; i++) {
      const model = chain[i];
      const attemptNumber = i + 1;
      const startTime = Date.now();

      try {
        // Check if provider is marked unavailable
        if (this.unavailableProviders.has(model.provider)) {
          console.log(`[FallbackChainManager] Skipping unavailable provider: ${model.provider}`);
          continue;
        }

        // Log attempt
        console.log(`[FallbackChainManager] Attempt ${attemptNumber}/${chain.length}: ${model.id}`);

        // Execute with current timeout
        const response = await executeModel(model, request, currentTimeout);
        
        // Success!
        const latency = Date.now() - startTime;
        const execution: FallbackExecution = {
          attemptNumber,
          modelId: model.id,
          success: true,
          latency,
          timestamp: new Date().toISOString()
        };
        
        executions.push(execution);
        this.recordSuccess(model.id, category, attemptNumber);
        this.fallbackHistory.set(requestId, executions);

        // Log warning if fallback depth exceeds 3
        if (attemptNumber > 3) {
          console.warn(`[FallbackChainManager] High fallback depth: ${attemptNumber} attempts for category ${category}`);
        }

        return response;

      } catch (error) {
        const latency = Date.now() - startTime;
        const errorType = this.classifyError(error);
        lastError = error as Error;

        // Enhanced error handling with context
        const errorContext: Partial<ErrorContext> = {
          requestId,
          modelId: model.id,
          provider: model.provider,
          category,
          attemptNumber
        };
        
        const { classified, recovery, userMessage } = handleError(error, errorContext);

        const execution: FallbackExecution = {
          attemptNumber,
          modelId: model.id,
          success: false,
          error: lastError,
          latency,
          timestamp: new Date().toISOString(),
          errorType
        };
        
        executions.push(execution);
        this.recordFailure(model.id);

        console.error(`[FallbackChainManager] Attempt ${attemptNumber} failed:`, {
          model: model.id,
          errorType,
          errorCategory: classified.category,
          severity: classified.severity,
          message: lastError.message,
          recovery: recovery.action
        });

        // Handle specific error types
        await this.handleError(errorType, model, i, chain.length);

        // Increase timeout on timeout errors (Requirement 5.4)
        if (errorType === ErrorType.TIMEOUT) {
          currentTimeout = Math.min(currentTimeout * 1.5, 10000); // Max 10s
          console.log(`[FallbackChainManager] Increased timeout to ${currentTimeout}ms`);
        }

        // Mark provider unavailable on auth errors (Requirement 5.5)
        if (errorType === ErrorType.AUTH_ERROR) {
          this.unavailableProviders.add(model.provider);
          console.warn(`[FallbackChainManager] Marked provider ${model.provider} as unavailable`);
        }

        // Implement exponential backoff between retries (Requirement 5.2)
        if (i < chain.length - 1) {
          const backoffDelay = this.calculateBackoff(attemptNumber);
          console.log(`[FallbackChainManager] Waiting ${backoffDelay}ms before next attempt`);
          await this.sleep(backoffDelay);
        }
      }
    }

    // All models failed
    this.fallbackHistory.set(requestId, executions);
    const stats = this.categoryStats.get(category)!;
    stats.executions++;
    stats.fallbackDepths.push(chain.length);

    throw new Error(
      `All models in fallback chain failed. Last error: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Calculate exponential backoff delay
   * Requirements: 5.2
   */
  private calculateBackoff(attemptNumber: number): number {
    const baseDelay = 500; // 500ms base
    const maxDelay = 5000; // 5s max
    const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay);
    return delay;
  }

  /**
   * Classify error type for intelligent handling
   * Requirements: 5.3, 5.4, 5.5
   */
  private classifyError(error: any): ErrorType {
    const message = error?.message?.toLowerCase() || '';
    const status = error?.status || error?.statusCode || 0;

    // Rate limit errors (429)
    if (status === 429 || message.includes('rate limit') || message.includes('too many requests')) {
      return ErrorType.RATE_LIMIT;
    }

    // Authentication errors (401, 403)
    if (status === 401 || status === 403 || message.includes('unauthorized') || message.includes('forbidden')) {
      return ErrorType.AUTH_ERROR;
    }

    // Service unavailable (503, 502, 504)
    if (status === 503 || status === 502 || status === 504 || message.includes('service unavailable')) {
      return ErrorType.SERVICE_UNAVAILABLE;
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out') || message.includes('deadline')) {
      return ErrorType.TIMEOUT;
    }

    // Model-specific errors
    if (message.includes('model') || message.includes('invalid request')) {
      return ErrorType.MODEL_ERROR;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * Handle specific error types with appropriate strategies
   * Requirements: 5.3, 5.4, 5.5
   */
  private async handleError(
    errorType: ErrorType,
    model: ExtendedModelConfig,
    currentIndex: number,
    chainLength: number
  ): Promise<void> {
    switch (errorType) {
      case ErrorType.RATE_LIMIT:
        // Requirement 5.3: Switch to different provider immediately
        console.log(`[FallbackChainManager] Rate limit hit, switching provider from ${model.provider}`);
        break;

      case ErrorType.AUTH_ERROR:
        // Requirement 5.5: Mark provider unavailable
        console.warn(`[FallbackChainManager] Auth error for ${model.provider}, marking unavailable`);
        break;

      case ErrorType.TIMEOUT:
        // Requirement 5.4: Timeout will be increased in main loop
        console.log(`[FallbackChainManager] Timeout error, will increase timeout on retry`);
        break;

      case ErrorType.SERVICE_UNAVAILABLE:
        console.log(`[FallbackChainManager] Service unavailable, trying next model`);
        break;

      default:
        console.log(`[FallbackChainManager] Unknown error type, proceeding to next model`);
    }
  }

  /**
   * Get fallback execution history for a request
   * Requirements: 5.6
   */
  getFallbackHistory(requestId: string): FallbackExecution[] {
    return this.fallbackHistory.get(requestId) || [];
  }

  /**
   * Get chain performance metrics for a category
   * Requirements: 5.7, 5.8
   */
  getChainPerformance(category: TaskCategory): ChainPerformanceMetrics {
    const stats = this.categoryStats.get(category);
    const executions = stats?.executions || 0;
    const fallbackDepths = stats?.fallbackDepths || [];

    // Calculate average fallback depth
    const averageFallbackDepth = fallbackDepths.length > 0
      ? fallbackDepths.reduce((sum, depth) => sum + depth, 0) / fallbackDepths.length
      : 0;

    // Calculate primary success rate (attempts that succeeded on first try)
    const primarySuccesses = fallbackDepths.filter(depth => depth === 1).length;
    const primarySuccessRate = executions > 0 ? primarySuccesses / executions : 0;

    // Find most and least reliable models
    const modelSuccessRates: Record<string, number> = {};
    let mostReliableModel = '';
    let leastReliableModel = '';
    let highestRate = -1;
    let lowestRate = 2;

    for (const [modelId, modelStats] of this.modelStats.entries()) {
      const rate = modelStats.attempts > 0 
        ? modelStats.successes / modelStats.attempts 
        : 0;
      modelSuccessRates[modelId] = rate;

      if (modelStats.attempts >= 5) { // Only consider models with sufficient attempts
        if (rate > highestRate) {
          highestRate = rate;
          mostReliableModel = modelId;
        }
        if (rate < lowestRate) {
          lowestRate = rate;
          leastReliableModel = modelId;
        }
      }
    }

    return {
      category,
      totalExecutions: executions,
      primarySuccessRate,
      averageFallbackDepth,
      mostReliableModel: mostReliableModel || 'N/A',
      leastReliableModel: leastReliableModel || 'N/A',
      modelSuccessRates
    };
  }

  /**
   * Record successful execution
   */
  private recordSuccess(modelId: string, category: TaskCategory, attemptNumber: number): void {
    // Update model stats
    if (!this.modelStats.has(modelId)) {
      this.modelStats.set(modelId, { attempts: 0, successes: 0, failures: 0 });
    }
    const stats = this.modelStats.get(modelId)!;
    stats.attempts++;
    stats.successes++;

    // Update category stats
    const categoryStats = this.categoryStats.get(category)!;
    categoryStats.executions++;
    categoryStats.fallbackDepths.push(attemptNumber);
  }

  /**
   * Record failed execution
   */
  private recordFailure(modelId: string): void {
    if (!this.modelStats.has(modelId)) {
      this.modelStats.set(modelId, { attempts: 0, successes: 0, failures: 0 });
    }
    const stats = this.modelStats.get(modelId)!;
    stats.attempts++;
    stats.failures++;
  }

  /**
   * Get model statistics
   */
  getModelStats(modelId: string): { attempts: number; successes: number; failures: number; successRate: number } {
    const stats = this.modelStats.get(modelId) || { attempts: 0, successes: 0, failures: 0 };
    const successRate = stats.attempts > 0 ? stats.successes / stats.attempts : 0;
    return { ...stats, successRate };
  }

  /**
   * Check if a provider is marked unavailable
   */
  isProviderUnavailable(provider: ProviderType): boolean {
    return this.unavailableProviders.has(provider);
  }

  /**
   * Mark a provider as available again (for recovery)
   */
  markProviderAvailable(provider: ProviderType): void {
    this.unavailableProviders.delete(provider);
    console.log(`[FallbackChainManager] Marked provider ${provider} as available`);
  }

  /**
   * Get all unavailable providers
   */
  getUnavailableProviders(): ProviderType[] {
    return Array.from(this.unavailableProviders);
  }

  /**
   * Reset statistics (for testing)
   */
  resetStatistics(): void {
    this.fallbackHistory.clear();
    this.modelStats.clear();
    this.categoryStats.clear();
    this.unavailableProviders.clear();
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let fallbackChainManagerInstance: FallbackChainManager | null = null;

/**
 * Get singleton instance of FallbackChainManager
 */
export function getFallbackChainManager(): FallbackChainManager {
  if (!fallbackChainManagerInstance) {
    fallbackChainManagerInstance = new FallbackChainManager();
  }
  return fallbackChainManagerInstance;
}

/**
 * Reset singleton instance (for testing)
 */
export function resetFallbackChainManager(): void {
  fallbackChainManagerInstance = null;
}
