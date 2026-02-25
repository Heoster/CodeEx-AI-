/**
 * Model Health Checker Service
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Implements periodic health checks for all active models:
 * - Checks every 5 minutes by default
 * - Tracks health status (HEALTHY, DEGRADED, UNAVAILABLE)
 * - Updates model availability based on health checks
 * - Calculates uptime percentage per model
 * - Provides health monitoring and alerting
 * 
 * Requirements: 1.7, 1.8, 20.1-20.10
 */

import { ModelRegistryV3, type ExtendedModelConfig, type HealthStatus } from './model-registry-v3';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Health check result for a single model
 */
export interface HealthCheckResult {
  modelId: string;
  isHealthy: boolean;
  healthStatus: HealthStatus;
  timestamp: string;
  responseTime?: number;
  error?: string;
}

/**
 * Uptime statistics for a model
 */
export interface UptimeStats {
  modelId: string;
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  uptimePercentage: number;
  lastHealthyAt?: string;
  lastUnhealthyAt?: string;
  consecutiveFailures: number;
}

/**
 * Health check configuration
 */
export interface HealthCheckConfig {
  intervalMs: number;              // How often to check (default: 5 minutes)
  timeoutMs: number;               // Timeout for each check (default: 10 seconds)
  degradedThreshold: number;       // Failures before marking DEGRADED (default: 1)
  unavailableThreshold: number;    // Consecutive failures before UNAVAILABLE (default: 3)
  uptimeAlertThreshold: number;    // Alert if uptime falls below this (default: 0.95)
}

/**
 * Health check event for monitoring
 */
export interface HealthCheckEvent {
  type: 'CHECK_STARTED' | 'CHECK_COMPLETED' | 'STATUS_CHANGED' | 'UPTIME_ALERT';
  modelId: string;
  timestamp: string;
  data?: any;
}

// ============================================================================
// Model Health Checker Service
// ============================================================================

/**
 * Service for monitoring model health and availability
 */
export class ModelHealthChecker {
  private registry: ModelRegistryV3;
  private config: HealthCheckConfig;
  private checkInterval?: NodeJS.Timeout;
  private uptimeStats: Map<string, UptimeStats>;
  private consecutiveFailures: Map<string, number>;
  private eventListeners: Array<(event: HealthCheckEvent) => void>;
  private isRunning: boolean;

  constructor(
    registry: ModelRegistryV3,
    config: Partial<HealthCheckConfig> = {}
  ) {
    this.registry = registry;
    this.config = {
      intervalMs: config.intervalMs ?? 5 * 60 * 1000,        // 5 minutes
      timeoutMs: config.timeoutMs ?? 10 * 1000,              // 10 seconds
      degradedThreshold: config.degradedThreshold ?? 1,
      unavailableThreshold: config.unavailableThreshold ?? 3,
      uptimeAlertThreshold: config.uptimeAlertThreshold ?? 0.95,
    };
    this.uptimeStats = new Map();
    this.consecutiveFailures = new Map();
    this.eventListeners = [];
    this.isRunning = false;

    // Initialize uptime stats for all active models
    this.initializeUptimeStats();
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  /**
   * Initialize uptime statistics for all active models
   */
  private initializeUptimeStats(): void {
    const activeModels = this.registry.getActiveModels();
    
    for (const model of activeModels) {
      if (!this.uptimeStats.has(model.id)) {
        this.uptimeStats.set(model.id, {
          modelId: model.id,
          totalChecks: 0,
          successfulChecks: 0,
          failedChecks: 0,
          uptimePercentage: 100,
          consecutiveFailures: 0,
        });
        this.consecutiveFailures.set(model.id, 0);
      }
    }
  }

  // ============================================================================
  // Health Check Execution
  // ============================================================================

  /**
   * Perform a health check on a specific model
   */
  async checkModelHealth(modelId: string): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    this.emitEvent({
      type: 'CHECK_STARTED',
      modelId,
      timestamp,
    });

    try {
      const model = this.registry.getModel(modelId);
      if (!model) {
        return {
          modelId,
          isHealthy: false,
          healthStatus: 'UNAVAILABLE',
          timestamp,
          error: 'Model not found',
        };
      }

      // Perform the actual health check with timeout
      const isHealthy = await Promise.race([
        this.performHealthCheck(model),
        this.timeoutPromise(this.config.timeoutMs),
      ]);

      const responseTime = Date.now() - startTime;
      const previousStatus = model.lifecycle.healthStatus;

      // Update health status based on check result
      const newStatus = this.updateHealthStatus(modelId, isHealthy);

      // Update uptime statistics
      this.updateUptimeStats(modelId, isHealthy);

      const result: HealthCheckResult = {
        modelId,
        isHealthy,
        healthStatus: newStatus,
        timestamp,
        responseTime,
      };

      // Emit status change event if status changed
      if (previousStatus !== newStatus) {
        this.emitEvent({
          type: 'STATUS_CHANGED',
          modelId,
          timestamp,
          data: {
            previousStatus,
            newStatus,
            consecutiveFailures: this.consecutiveFailures.get(modelId) ?? 0,
          },
        });
      }

      // Check for uptime alerts
      this.checkUptimeAlert(modelId);

      this.emitEvent({
        type: 'CHECK_COMPLETED',
        modelId,
        timestamp,
        data: result,
      });

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Mark as unhealthy on error
      const newStatus = this.updateHealthStatus(modelId, false);
      this.updateUptimeStats(modelId, false);

      return {
        modelId,
        isHealthy: false,
        healthStatus: newStatus,
        timestamp,
        responseTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Perform the actual health check for a model
   * This is a placeholder - in production, this would make actual API calls
   */
  private async performHealthCheck(model: ExtendedModelConfig): Promise<boolean> {
    // In a real implementation, this would:
    // 1. Make a lightweight API call to the provider
    // 2. Check if the model responds correctly
    // 3. Verify authentication is working
    // 4. Check rate limit status
    
    // For now, we'll use the registry's health check method
    return await this.registry.checkModelHealth(model.id);
  }

  /**
   * Create a timeout promise that rejects after specified milliseconds
   */
  private timeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), ms);
    });
  }

  /**
   * Update the health status of a model based on check result
   */
  private updateHealthStatus(modelId: string, isHealthy: boolean): HealthStatus {
    const model = this.registry.getModel(modelId);
    if (!model) return 'UNAVAILABLE';

    const currentFailures = this.consecutiveFailures.get(modelId) ?? 0;

    if (isHealthy) {
      // Reset consecutive failures on success
      this.consecutiveFailures.set(modelId, 0);
      model.lifecycle.healthStatus = 'HEALTHY';
      model.lifecycle.lastHealthCheck = new Date().toISOString();
      return 'HEALTHY';
    } else {
      // Increment consecutive failures
      const newFailures = currentFailures + 1;
      this.consecutiveFailures.set(modelId, newFailures);
      model.lifecycle.lastHealthCheck = new Date().toISOString();

      // Determine new status based on failure count
      if (newFailures >= this.config.unavailableThreshold) {
        model.lifecycle.healthStatus = 'UNAVAILABLE';
        return 'UNAVAILABLE';
      } else if (newFailures >= this.config.degradedThreshold) {
        model.lifecycle.healthStatus = 'DEGRADED';
        return 'DEGRADED';
      } else {
        // First failure, keep as HEALTHY but track it
        return model.lifecycle.healthStatus ?? 'HEALTHY';
      }
    }
  }

  /**
   * Check health of all active models
   */
  async checkAllModelsHealth(): Promise<Map<string, HealthCheckResult>> {
    const results = new Map<string, HealthCheckResult>();
    const activeModels = this.registry.getActiveModels();

    // Check all models in parallel
    const checks = activeModels.map(model => this.checkModelHealth(model.id));
    const checkResults = await Promise.all(checks);

    for (const result of checkResults) {
      results.set(result.modelId, result);
    }

    return results;
  }

  // ============================================================================
  // Uptime Statistics
  // ============================================================================

  /**
   * Update uptime statistics for a model
   */
  private updateUptimeStats(modelId: string, isHealthy: boolean): void {
    let stats = this.uptimeStats.get(modelId);
    
    if (!stats) {
      stats = {
        modelId,
        totalChecks: 0,
        successfulChecks: 0,
        failedChecks: 0,
        uptimePercentage: 100,
        consecutiveFailures: 0,
      };
      this.uptimeStats.set(modelId, stats);
    }

    stats.totalChecks++;
    
    if (isHealthy) {
      stats.successfulChecks++;
      stats.lastHealthyAt = new Date().toISOString();
      stats.consecutiveFailures = 0;
    } else {
      stats.failedChecks++;
      stats.lastUnhealthyAt = new Date().toISOString();
      stats.consecutiveFailures++;
    }

    // Calculate uptime percentage
    stats.uptimePercentage = stats.totalChecks > 0
      ? (stats.successfulChecks / stats.totalChecks) * 100
      : 100;
  }

  /**
   * Get uptime statistics for a specific model
   */
  getUptimeStats(modelId: string): UptimeStats | undefined {
    return this.uptimeStats.get(modelId);
  }

  /**
   * Get uptime statistics for all models
   */
  getAllUptimeStats(): Map<string, UptimeStats> {
    return new Map(this.uptimeStats);
  }

  /**
   * Calculate uptime percentage for a model
   */
  calculateUptimePercentage(modelId: string): number {
    const stats = this.uptimeStats.get(modelId);
    if (!stats || stats.totalChecks === 0) return 100;
    
    return (stats.successfulChecks / stats.totalChecks) * 100;
  }

  /**
   * Check if uptime is below threshold and emit alert
   */
  private checkUptimeAlert(modelId: string): void {
    const stats = this.uptimeStats.get(modelId);
    if (!stats || stats.totalChecks < 10) return; // Need at least 10 checks

    const uptimePercentage = stats.uptimePercentage / 100;
    
    if (uptimePercentage < this.config.uptimeAlertThreshold) {
      this.emitEvent({
        type: 'UPTIME_ALERT',
        modelId,
        timestamp: new Date().toISOString(),
        data: {
          uptimePercentage: stats.uptimePercentage,
          threshold: this.config.uptimeAlertThreshold * 100,
          totalChecks: stats.totalChecks,
          failedChecks: stats.failedChecks,
        },
      });
    }
  }

  // ============================================================================
  // Periodic Health Checks
  // ============================================================================

  /**
   * Start periodic health checks
   */
  start(): void {
    if (this.isRunning) {
      console.warn('Health checker is already running');
      return;
    }

    console.log(`Starting health checks (interval: ${this.config.intervalMs}ms)`);
    
    // Perform initial check immediately
    this.checkAllModelsHealth().catch(error => {
      console.error('Initial health check failed:', error);
    });

    // Schedule periodic checks
    this.checkInterval = setInterval(() => {
      this.checkAllModelsHealth().catch(error => {
        console.error('Periodic health check failed:', error);
      });
    }, this.config.intervalMs);

    this.isRunning = true;
  }

  /**
   * Stop periodic health checks
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn('Health checker is not running');
      return;
    }

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }

    this.isRunning = false;
    console.log('Health checks stopped');
  }

  /**
   * Check if health checker is running
   */
  isHealthCheckRunning(): boolean {
    return this.isRunning;
  }

  // ============================================================================
  // Event System
  // ============================================================================

  /**
   * Add an event listener for health check events
   */
  addEventListener(listener: (event: HealthCheckEvent) => void): void {
    this.eventListeners.push(listener);
  }

  /**
   * Remove an event listener
   */
  removeEventListener(listener: (event: HealthCheckEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Emit a health check event to all listeners
   */
  private emitEvent(event: HealthCheckEvent): void {
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in health check event listener:', error);
      }
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Get models with low uptime (below threshold)
   */
  getModelsWithLowUptime(): Array<{ modelId: string; uptimePercentage: number }> {
    const lowUptimeModels: Array<{ modelId: string; uptimePercentage: number }> = [];
    
    for (const [modelId, stats] of this.uptimeStats) {
      if (stats.totalChecks >= 10 && stats.uptimePercentage < this.config.uptimeAlertThreshold * 100) {
        lowUptimeModels.push({
          modelId,
          uptimePercentage: stats.uptimePercentage,
        });
      }
    }

    return lowUptimeModels.sort((a, b) => a.uptimePercentage - b.uptimePercentage);
  }

  /**
   * Get models that are currently unavailable
   */
  getUnavailableModels(): ExtendedModelConfig[] {
    return this.registry.getActiveModels().filter(
      model => model.lifecycle.healthStatus === 'UNAVAILABLE'
    );
  }

  /**
   * Get models that are currently degraded
   */
  getDegradedModels(): ExtendedModelConfig[] {
    return this.registry.getActiveModels().filter(
      model => model.lifecycle.healthStatus === 'DEGRADED'
    );
  }

  /**
   * Get health summary for all models
   */
  getHealthSummary(): {
    totalModels: number;
    healthyModels: number;
    degradedModels: number;
    unavailableModels: number;
    averageUptime: number;
  } {
    const activeModels = this.registry.getActiveModels();
    const healthyCount = activeModels.filter(m => m.lifecycle.healthStatus === 'HEALTHY').length;
    const degradedCount = activeModels.filter(m => m.lifecycle.healthStatus === 'DEGRADED').length;
    const unavailableCount = activeModels.filter(m => m.lifecycle.healthStatus === 'UNAVAILABLE').length;

    // Calculate average uptime
    let totalUptime = 0;
    let modelsWithStats = 0;
    
    for (const stats of this.uptimeStats.values()) {
      if (stats.totalChecks > 0) {
        totalUptime += stats.uptimePercentage;
        modelsWithStats++;
      }
    }

    const averageUptime = modelsWithStats > 0 ? totalUptime / modelsWithStats : 100;

    return {
      totalModels: activeModels.length,
      healthyModels: healthyCount,
      degradedModels: degradedCount,
      unavailableModels: unavailableCount,
      averageUptime,
    };
  }

  /**
   * Reset uptime statistics for a model
   */
  resetUptimeStats(modelId: string): void {
    this.uptimeStats.set(modelId, {
      modelId,
      totalChecks: 0,
      successfulChecks: 0,
      failedChecks: 0,
      uptimePercentage: 100,
      consecutiveFailures: 0,
    });
    this.consecutiveFailures.set(modelId, 0);
  }

  /**
   * Reset all uptime statistics
   */
  resetAllUptimeStats(): void {
    this.uptimeStats.clear();
    this.consecutiveFailures.clear();
    this.initializeUptimeStats();
  }

  /**
   * Get configuration
   */
  getConfig(): HealthCheckConfig {
    return { ...this.config };
  }

  /**
   * Update configuration (requires restart if running)
   */
  updateConfig(config: Partial<HealthCheckConfig>): void {
    const wasRunning = this.isRunning;
    
    if (wasRunning) {
      this.stop();
    }

    this.config = {
      ...this.config,
      ...config,
    };

    if (wasRunning) {
      this.start();
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let healthCheckerInstance: ModelHealthChecker | null = null;

/**
 * Get the singleton ModelHealthChecker instance
 */
export function getModelHealthChecker(registry?: ModelRegistryV3): ModelHealthChecker {
  if (!healthCheckerInstance && registry) {
    healthCheckerInstance = new ModelHealthChecker(registry);
  }
  
  if (!healthCheckerInstance) {
    throw new Error('ModelHealthChecker not initialized. Provide a registry instance.');
  }
  
  return healthCheckerInstance;
}

/**
 * Initialize the health checker with a registry
 */
export function initializeModelHealthChecker(
  registry: ModelRegistryV3,
  config?: Partial<HealthCheckConfig>
): ModelHealthChecker {
  healthCheckerInstance = new ModelHealthChecker(registry, config);
  return healthCheckerInstance;
}

/**
 * Reset the health checker (useful for testing)
 */
export function resetModelHealthChecker(): void {
  if (healthCheckerInstance) {
    healthCheckerInstance.stop();
  }
  healthCheckerInstance = null;
}
