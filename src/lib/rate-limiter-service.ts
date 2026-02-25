/**
 * Rate Limiter Service for CODEEX V3.3
 * 
 * Manages rate limits across all providers with intelligent queuing and request tracking.
 * Ensures the system stays within free tier limits while maximizing throughput.
 * 
 * Features:
 * - Track requests per minute per provider
 * - Track requests per day per provider
 * - Track tokens per minute for token-based limits
 * - Automatic counter reset at appropriate intervals
 * - Request queuing when rate limits are reached
 * - Priority-based request scheduling
 * - Automatic queue processing on rate limit reset
 * - Wait time estimation
 * - Request cancellation support
 * - Provider utilization monitoring
 * 
 * Provider Limits:
 * - Groq: 30 requests per minute, 14,400 requests per day
 * - Google: 15 requests per minute, 1,500 requests per day
 * - Cerebras: 100 requests per minute, 50,000 requests per day
 * - Veo 3.1: 5 requests per minute, 100 requests per day
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 14.1-14.9
 */

import type { ProviderType } from './model-config-v3.3';

/**
 * Rate limit state for a provider
 */
export interface RateLimitState {
  provider: ProviderType;
  requestsThisMinute: number;
  requestsToday: number;
  tokensThisMinute: number;
  resetAt: string;
  isThrottled: boolean;
}

/**
 * Queued request with priority
 */
export interface QueuedRequest {
  id: string;
  priority: number;
  provider: ProviderType;
  estimatedTokens: number;
  enqueuedAt: string;
  estimatedExecutionTime?: string;
}

/**
 * Provider rate limit statistics
 */
export interface ProviderRateLimitStats {
  provider: ProviderType;
  totalRequests: number;
  throttledRequests: number;
  averageWaitTime: number;
  peakUsageTime: string;
  utilizationRate: number; // 0-1
  peakUsageTimes: string[]; // Historical peak usage times
}

/**
 * Comprehensive statistics report for all providers
 */
export interface ProviderStatisticsReport {
  generatedAt: string;
  providers: ProviderRateLimitStats[];
  alerts: Array<{
    provider: ProviderType;
    utilizationRate: number;
    message: string;
  }>;
  summary: {
    totalRequests: number;
    totalThrottled: number;
    averageUtilization: number;
    highestUtilization: {
      provider: ProviderType;
      rate: number;
    };
  };
}

/**
 * Rate limit configuration per provider
 */
interface ProviderRateLimits {
  requestsPerMinute: number;
  requestsPerDay?: number;
  tokensPerMinute?: number;
}

/**
 * Internal tracking state for a provider
 */
interface ProviderState {
  requestsThisMinute: number;
  requestsToday: number;
  tokensThisMinute: number;
  minuteResetAt: Date;
  dayResetAt: Date;
  totalRequests: number;
  throttledRequests: number;
  totalWaitTime: number;
  peakUsageTime: string;
  peakUsageTimes: string[]; // Historical peak usage times
}

/**
 * Callback function for processing queued requests
 */
export type QueueProcessorCallback = (request: QueuedRequest) => Promise<void>;

/**
 * Rate Limiter Service
 * 
 * Manages rate limits across all providers with intelligent queuing.
 */
export class RateLimiterService {
  private providerLimits: Map<ProviderType, ProviderRateLimits>;
  private providerStates: Map<ProviderType, ProviderState>;
  private requestQueue: QueuedRequest[];
  private resetIntervals: Map<ProviderType, NodeJS.Timeout>;
  private queueProcessorCallback: QueueProcessorCallback | null;
  private processingQueue: boolean;

  constructor() {
    this.providerLimits = new Map();
    this.providerStates = new Map();
    this.requestQueue = [];
    this.resetIntervals = new Map();
    this.queueProcessorCallback = null;
    this.processingQueue = false;

    // Initialize provider limits based on free tier constraints
    this.initializeProviderLimits();
    this.initializeProviderStates();
    this.startResetTimers();
  }

  /**
   * Initialize rate limits for all providers
   */
  private initializeProviderLimits(): void {
    // Groq: 30 RPM, 14,400 RPD (Requirements 14.1, 14.2)
    this.providerLimits.set('groq', {
      requestsPerMinute: 30,
      requestsPerDay: 14400,
    });

    // Google: 15 RPM, 1,500 RPD (Requirements 14.3, 14.4)
    this.providerLimits.set('google', {
      requestsPerMinute: 15,
      requestsPerDay: 1500,
    });

    // Cerebras: 100 RPM, 50,000 RPD (Requirements 14.5, 14.6)
    this.providerLimits.set('cerebras', {
      requestsPerMinute: 100,
      requestsPerDay: 50000,
    });

    // Hugging Face: Conservative limits (not specified in requirements)
    this.providerLimits.set('huggingface', {
      requestsPerMinute: 60,
      requestsPerDay: 10000,
    });

    // ElevenLabs: Conservative limits (not specified in requirements)
    this.providerLimits.set('elevenlabs', {
      requestsPerMinute: 20,
      requestsPerDay: 5000,
    });
  }

  /**
   * Initialize tracking state for all providers
   */
  private initializeProviderStates(): void {
    const now = new Date();
    const providers: ProviderType[] = ['groq', 'google', 'cerebras', 'huggingface', 'elevenlabs'];

    for (const provider of providers) {
      this.providerStates.set(provider, {
        requestsThisMinute: 0,
        requestsToday: 0,
        tokensThisMinute: 0,
        minuteResetAt: new Date(now.getTime() + 60000), // 1 minute from now
        dayResetAt: this.getNextDayReset(now),
        totalRequests: 0,
        throttledRequests: 0,
        totalWaitTime: 0,
        peakUsageTime: now.toISOString(),
        peakUsageTimes: [], // Initialize empty array for historical tracking
      });
    }
  }

  /**
   * Get the next day reset time (midnight UTC)
   */
  private getNextDayReset(from: Date): Date {
    const next = new Date(from);
    next.setUTCHours(24, 0, 0, 0);
    return next;
  }

  /**
   * Start automatic reset timers for all providers
   */
  private startResetTimers(): void {
    const providers: ProviderType[] = ['groq', 'google', 'cerebras', 'huggingface', 'elevenlabs'];

    for (const provider of providers) {
      // Reset minute counters every minute
      const interval = setInterval(() => {
        this.resetMinuteCounters(provider);
      }, 60000); // 60 seconds

      this.resetIntervals.set(provider, interval);
    }

    // Check for day resets every hour
    setInterval(() => {
      this.checkDayResets();
    }, 3600000); // 1 hour
  }

  /**
   * Reset minute counters for a provider
   * Requirement 6.5 - Automatically process queued requests on rate limit reset
   */
  private resetMinuteCounters(provider: ProviderType): void {
    const state = this.providerStates.get(provider);
    if (!state) return;

    state.requestsThisMinute = 0;
    state.tokensThisMinute = 0;
    state.minuteResetAt = new Date(Date.now() + 60000);

    // Automatically process queued requests for this provider
    this.processQueueForProvider(provider).catch(error => {
      console.error(`Error processing queue for ${provider}:`, error);
    });
  }

  /**
   * Check and reset day counters if needed
   * Requirement 6.5 - Automatically process queued requests on rate limit reset
   */
  private checkDayResets(): void {
    const now = new Date();

    for (const [provider, state] of this.providerStates.entries()) {
      if (now >= state.dayResetAt) {
        state.requestsToday = 0;
        state.dayResetAt = this.getNextDayReset(now);

        // Automatically process queued requests for this provider
        this.processQueueForProvider(provider).catch(error => {
          console.error(`Error processing queue for ${provider}:`, error);
        });
      }
    }
  }

  /**
   * Check if a request can be executed within rate limits
   * Requirement 6.1, 6.2, 6.3
   */
  canExecute(provider: ProviderType, estimatedTokens: number = 0): boolean {
    const limits = this.providerLimits.get(provider);
    const state = this.providerStates.get(provider);

    if (!limits || !state) {
      return false;
    }

    // Check minute limit
    if (state.requestsThisMinute >= limits.requestsPerMinute) {
      return false;
    }

    // Check day limit if configured
    if (limits.requestsPerDay && state.requestsToday >= limits.requestsPerDay) {
      return false;
    }

    // Check token limit if configured
    if (limits.tokensPerMinute && estimatedTokens > 0) {
      if (state.tokensThisMinute + estimatedTokens > limits.tokensPerMinute) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get current rate limit state for a provider
   */
  getRateLimitState(provider: ProviderType): RateLimitState {
    const state = this.providerStates.get(provider);
    const limits = this.providerLimits.get(provider);

    if (!state || !limits) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return {
      provider,
      requestsThisMinute: state.requestsThisMinute,
      requestsToday: state.requestsToday,
      tokensThisMinute: state.tokensThisMinute,
      resetAt: state.minuteResetAt.toISOString(),
      isThrottled: !this.canExecute(provider),
    };
  }

  /**
   * Wait for availability of a provider
   * Returns a promise that resolves when the provider is available
   */
  async waitForAvailability(provider: ProviderType): Promise<void> {
    const state = this.providerStates.get(provider);
    if (!state) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    // If already available, return immediately
    if (this.canExecute(provider)) {
      return;
    }

    // Calculate wait time until next minute reset
    const now = Date.now();
    const waitTime = state.minuteResetAt.getTime() - now;

    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Record a request execution
   * Requirement 6.1, 6.2, 6.3
   */
  recordRequest(provider: ProviderType, tokens: number = 0): void {
    const state = this.providerStates.get(provider);
    if (!state) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    // Increment counters
    state.requestsThisMinute++;
    state.requestsToday++;
    state.totalRequests++;

    if (tokens > 0) {
      state.tokensThisMinute += tokens;
    }

    // Update peak usage time if at high utilization
    const utilizationRate = this.calculateUtilizationRate(provider);
    if (utilizationRate > 0.8) {
      const now = new Date().toISOString();
      state.peakUsageTime = now;
      
      // Add to historical peak times (keep last 100 entries)
      state.peakUsageTimes.push(now);
      if (state.peakUsageTimes.length > 100) {
        state.peakUsageTimes.shift(); // Remove oldest entry
      }
    }
  }

  /**
   * Reset counters for a provider (manual reset)
   */
  resetCounters(provider: ProviderType): void {
    const state = this.providerStates.get(provider);
    if (!state) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    state.requestsThisMinute = 0;
    state.requestsToday = 0;
    state.tokensThisMinute = 0;
    state.minuteResetAt = new Date(Date.now() + 60000);
  }

  /**
   * Enqueue a request when rate limit is reached
   * Requirement 6.4, 6.6
   */
  enqueueRequest(
    provider: ProviderType,
    estimatedTokens: number = 0,
    priority: number = 0
  ): string {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const queuedRequest: QueuedRequest = {
      id: requestId,
      priority,
      provider,
      estimatedTokens,
      enqueuedAt: now.toISOString(),
    };

    // Calculate estimated execution time
    const state = this.providerStates.get(provider);
    if (state) {
      const waitTime = state.minuteResetAt.getTime() - now.getTime();
      queuedRequest.estimatedExecutionTime = new Date(now.getTime() + waitTime).toISOString();
    }

    // Insert into queue based on priority (higher priority first)
    const insertIndex = this.requestQueue.findIndex(req => req.priority < priority);
    if (insertIndex === -1) {
      this.requestQueue.push(queuedRequest);
    } else {
      this.requestQueue.splice(insertIndex, 0, queuedRequest);
    }

    // Track throttled request
    if (state) {
      state.throttledRequests++;
    }

    return requestId;
  }

  /**
   * Dequeue the next request for a provider
   * Requirement 6.5
   */
  dequeueRequest(provider: ProviderType): QueuedRequest | null {
    const index = this.requestQueue.findIndex(req => req.provider === provider);
    if (index === -1) {
      return null;
    }

    const request = this.requestQueue[index];
    this.requestQueue.splice(index, 1);
    return request;
  }

  /**
   * Get queue length for a provider (or all providers)
   */
  getQueueLength(provider?: ProviderType): number {
    if (provider) {
      return this.requestQueue.filter(req => req.provider === provider).length;
    }
    return this.requestQueue.length;
  }

  /**
   * Cancel a queued request
   * Requirement 6.8
   */
  cancelRequest(requestId: string): boolean {
    const index = this.requestQueue.findIndex(req => req.id === requestId);
    if (index === -1) {
      return false;
    }

    this.requestQueue.splice(index, 1);
    return true;
  }

  /**
   * Get estimated wait time for a queued request
   * Requirement 6.7
   */
  getEstimatedWaitTime(requestId: string): number {
    const request = this.requestQueue.find(req => req.id === requestId);
    if (!request || !request.estimatedExecutionTime) {
      return 0;
    }

    const now = Date.now();
    const executionTime = new Date(request.estimatedExecutionTime).getTime();
    return Math.max(0, executionTime - now);
  }

  /**
   * Register a callback to process queued requests
   * This callback will be invoked automatically when rate limits reset
   * Requirement 6.5
   */
  registerQueueProcessor(callback: QueueProcessorCallback): void {
    this.queueProcessorCallback = callback;
  }

  /**
   * Unregister the queue processor callback
   */
  unregisterQueueProcessor(): void {
    this.queueProcessorCallback = null;
  }

  /**
   * Process queued requests for a specific provider
   * Called automatically when rate limits reset
   * Requirement 6.5
   */
  private async processQueueForProvider(provider: ProviderType): Promise<void> {
    // Prevent concurrent processing
    if (this.processingQueue) {
      return;
    }

    // No callback registered, skip processing
    if (!this.queueProcessorCallback) {
      return;
    }

    this.processingQueue = true;

    try {
      // Process requests while capacity is available
      while (this.canExecute(provider)) {
        const request = this.dequeueRequest(provider);
        if (!request) {
          break; // No more requests for this provider
        }

        try {
          // Invoke the callback to process the request
          await this.queueProcessorCallback(request);
          
          // Record the request execution
          this.recordRequest(provider, request.estimatedTokens);
        } catch (error) {
          console.error(`Error processing queued request ${request.id}:`, error);
          // Continue processing other requests even if one fails
        }
      }
    } finally {
      this.processingQueue = false;
    }
  }

  /**
   * Manually trigger queue processing for a provider
   * Useful for testing or manual intervention
   * Requirement 6.5
   */
  async processQueue(provider?: ProviderType): Promise<void> {
    if (provider) {
      await this.processQueueForProvider(provider);
    } else {
      // Process all providers
      const providers: ProviderType[] = ['groq', 'google', 'cerebras', 'huggingface', 'elevenlabs'];
      for (const p of providers) {
        await this.processQueueForProvider(p);
      }
    }
  }

  /**
   * Get all queued requests (for monitoring/debugging)
   */
  getQueuedRequests(provider?: ProviderType): QueuedRequest[] {
    if (provider) {
      return this.requestQueue.filter(req => req.provider === provider);
    }
    return [...this.requestQueue];
  }

  /**
   * Calculate provider utilization rate (0-1)
   * Requirement 6.9
   */
  calculateUtilizationRate(provider: ProviderType): number {
    const limits = this.providerLimits.get(provider);
    const state = this.providerStates.get(provider);

    if (!limits || !state) {
      return 0;
    }

    // Calculate based on minute limit (most restrictive)
    const minuteUtilization = state.requestsThisMinute / limits.requestsPerMinute;

    // Calculate based on day limit if available
    let dayUtilization = 0;
    if (limits.requestsPerDay) {
      dayUtilization = state.requestsToday / limits.requestsPerDay;
    }

    // Return the higher utilization rate
    return Math.max(minuteUtilization, dayUtilization);
  }

  /**
   * Get provider statistics
   * Requirement 6.9, 6.10, 17.9, 17.10
   */
  getProviderStats(provider: ProviderType): ProviderRateLimitStats {
    const state = this.providerStates.get(provider);
    if (!state) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const averageWaitTime = state.throttledRequests > 0
      ? state.totalWaitTime / state.throttledRequests
      : 0;

    return {
      provider,
      totalRequests: state.totalRequests,
      throttledRequests: state.throttledRequests,
      averageWaitTime,
      peakUsageTime: state.peakUsageTime,
      utilizationRate: this.calculateUtilizationRate(provider),
      peakUsageTimes: [...state.peakUsageTimes], // Return copy of historical peak times
    };
  }

  /**
   * Check if any provider is above utilization threshold
   * Requirement 6.10, 14.9
   */
  checkUtilizationAlerts(threshold: number = 0.8): Map<ProviderType, number> {
    const alerts = new Map<ProviderType, number>();

    for (const provider of this.providerStates.keys()) {
      const utilization = this.calculateUtilizationRate(provider);
      if (utilization >= threshold) {
        alerts.set(provider, utilization);
      }
    }

    return alerts;
  }

  /**
   * Generate comprehensive provider statistics report
   * Requirement 6.9, 6.10, 17.9, 17.10
   */
  generateStatisticsReport(): ProviderStatisticsReport {
    const providers: ProviderType[] = ['groq', 'google', 'cerebras', 'huggingface', 'elevenlabs'];
    const providerStats: ProviderRateLimitStats[] = [];
    const alerts: Array<{ provider: ProviderType; utilizationRate: number; message: string }> = [];
    
    let totalRequests = 0;
    let totalThrottled = 0;
    let totalUtilization = 0;
    let highestUtilization = { provider: 'groq' as ProviderType, rate: 0 };

    // Collect stats for each provider
    for (const provider of providers) {
      const stats = this.getProviderStats(provider);
      providerStats.push(stats);

      totalRequests += stats.totalRequests;
      totalThrottled += stats.throttledRequests;
      totalUtilization += stats.utilizationRate;

      // Track highest utilization
      if (stats.utilizationRate > highestUtilization.rate) {
        highestUtilization = { provider, rate: stats.utilizationRate };
      }

      // Generate alerts for high utilization (>= 80%)
      if (stats.utilizationRate >= 0.8) {
        alerts.push({
          provider,
          utilizationRate: stats.utilizationRate,
          message: `Provider ${provider} is at ${(stats.utilizationRate * 100).toFixed(1)}% utilization (threshold: 80%)`,
        });
      }
    }

    const averageUtilization = providers.length > 0 ? totalUtilization / providers.length : 0;

    return {
      generatedAt: new Date().toISOString(),
      providers: providerStats,
      alerts,
      summary: {
        totalRequests,
        totalThrottled,
        averageUtilization,
        highestUtilization,
      },
    };
  }

  /**
   * Get all provider states for monitoring
   */
  getAllProviderStates(): Map<ProviderType, RateLimitState> {
    const states = new Map<ProviderType, RateLimitState>();

    for (const provider of this.providerStates.keys()) {
      states.set(provider, this.getRateLimitState(provider));
    }

    return states;
  }

  /**
   * Cleanup timers (call when shutting down)
   */
  cleanup(): void {
    for (const interval of this.resetIntervals.values()) {
      clearInterval(interval);
    }
    this.resetIntervals.clear();
  }
}

// Singleton instance
let rateLimiterInstance: RateLimiterService | null = null;

/**
 * Get the singleton Rate Limiter Service instance
 */
export function getRateLimiterService(): RateLimiterService {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiterService();
  }
  return rateLimiterInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetRateLimiterService(): void {
  if (rateLimiterInstance) {
    rateLimiterInstance.cleanup();
    rateLimiterInstance = null;
  }
}
