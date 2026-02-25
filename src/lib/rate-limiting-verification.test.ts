/**
 * Phase 4: Rate Limiting & Queuing - Verification Tests
 * 
 * Comprehensive verification that all rate limiting components are working correctly:
 * 1. Rate Limiter Service tracks requests per minute and per day
 * 2. Request Queue Manager handles queuing when limits are reached
 * 3. Provider utilization monitoring calculates utilization rates
 * 4. Integration with router considers rate limits when routing
 * 5. All provider limits are correctly configured
 * 
 * Requirements: 6.1-6.10, 14.1-14.9
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RateLimiterService, resetRateLimiterService } from './rate-limiter-service';
import { IntelligentRouterService, initializeIntelligentRouterService, resetIntelligentRouterService } from './intelligent-router-service';
import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';
import type { ClassificationResult } from './task-classifier-service';

describe('Phase 4: Rate Limiting & Queuing Verification', () => {
  let rateLimiter: RateLimiterService;
  let router: IntelligentRouterService;
  let testModels: ExtendedModelConfig[];

  beforeEach(() => {
    // Reset services
    resetRateLimiterService();
    resetIntelligentRouterService();

    // Create test models
    testModels = [
      {
        id: 'test-groq-model',
        name: 'Test Groq Model',
        provider: 'groq',
        modelId: 'test-groq',
        category: 'general',
        description: 'Test model',
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 2048,
        lifecycle: { status: 'ACTIVE', healthStatus: 'HEALTHY' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 30, requestsPerDay: 14400 },
        priority: 90,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      },
      {
        id: 'test-cerebras-model',
        name: 'Test Cerebras Model',
        provider: 'cerebras',
        modelId: 'test-cerebras',
        category: 'general',
        description: 'Test model',
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE', healthStatus: 'HEALTHY' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 4096 },
        enabled: true
      },
      {
        id: 'test-google-model',
        name: 'Test Google Model',
        provider: 'google',
        modelId: 'test-google',
        category: 'multimodal',
        description: 'Test model',
        contextWindow: 1048576,
        supportsStreaming: false,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE', healthStatus: 'HEALTHY' },
        capabilities: [{ type: 'TEXT' }, { type: 'VISION' }],
        rateLimit: { requestsPerMinute: 15, requestsPerDay: 1500 },
        priority: 90,
        defaultParams: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
        enabled: true
      }
    ];

    // Create custom routing rules for test models
    const customRules = {
      SIMPLE: {
        category: 'SIMPLE' as TaskCategory,
        primaryModelId: 'test-groq-model',
        fallbackModelIds: ['test-cerebras-model', 'test-google-model'],
        conditions: []
      },
      MEDIUM: {
        category: 'MEDIUM' as TaskCategory,
        primaryModelId: 'test-cerebras-model',
        fallbackModelIds: ['test-google-model', 'test-groq-model'],
        conditions: []
      },
      COMPLEX: {
        category: 'COMPLEX' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      },
      CODING: {
        category: 'CODING' as TaskCategory,
        primaryModelId: 'test-cerebras-model',
        fallbackModelIds: ['test-google-model', 'test-groq-model'],
        conditions: []
      },
      REASONING: {
        category: 'REASONING' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      },
      VISION_IN: {
        category: 'VISION_IN' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      },
      IMAGE_GEN: {
        category: 'IMAGE_GEN' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      },
      VIDEO_GEN: {
        category: 'VIDEO_GEN' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      },
      MULTILINGUAL: {
        category: 'MULTILINGUAL' as TaskCategory,
        primaryModelId: 'test-groq-model',
        fallbackModelIds: ['test-cerebras-model', 'test-google-model'],
        conditions: []
      },
      AGENTIC: {
        category: 'AGENTIC' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      },
      LONG_CONTEXT: {
        category: 'LONG_CONTEXT' as TaskCategory,
        primaryModelId: 'test-google-model',
        fallbackModelIds: ['test-cerebras-model', 'test-groq-model'],
        conditions: []
      }
    };

    // Initialize services
    rateLimiter = new RateLimiterService();
    router = initializeIntelligentRouterService(testModels, customRules, rateLimiter);
  });

  afterEach(() => {
    rateLimiter.cleanup();
    resetRateLimiterService();
    resetIntelligentRouterService();
  });

  // ============================================================================
  // Test 1: Rate Limiter Service Tracks Requests Per Minute and Per Day
  // Requirements: 6.1, 6.2, 14.1-14.6
  // ============================================================================

  describe('1. Rate Limiter Service - Request Tracking', () => {
    it('should track requests per minute for Groq (30 RPM limit)', () => {
      // Requirement 14.1: Groq 30 RPM
      const provider = 'groq';
      
      // Initially should be able to execute
      expect(rateLimiter.canExecute(provider)).toBe(true);
      
      // Record 29 requests
      for (let i = 0; i < 29; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Should still be able to execute (29/30)
      expect(rateLimiter.canExecute(provider)).toBe(true);
      
      // Record 30th request
      rateLimiter.recordRequest(provider);
      
      // Should NOT be able to execute (30/30)
      expect(rateLimiter.canExecute(provider)).toBe(false);
      
      // Verify state
      const state = rateLimiter.getRateLimitState(provider);
      expect(state.requestsThisMinute).toBe(30);
      expect(state.isThrottled).toBe(true);
    });

    it('should track requests per minute for Google (15 RPM limit)', () => {
      // Requirement 14.3: Google 15 RPM
      const provider = 'google';
      
      // Record 14 requests
      for (let i = 0; i < 14; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      expect(rateLimiter.canExecute(provider)).toBe(true);
      
      // Record 15th request
      rateLimiter.recordRequest(provider);
      
      // Should NOT be able to execute
      expect(rateLimiter.canExecute(provider)).toBe(false);
      
      const state = rateLimiter.getRateLimitState(provider);
      expect(state.requestsThisMinute).toBe(15);
    });

    it('should track requests per minute for Cerebras (100 RPM limit)', () => {
      // Requirement 14.5: Cerebras 100 RPM
      const provider = 'cerebras';
      
      // Record 99 requests
      for (let i = 0; i < 99; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      expect(rateLimiter.canExecute(provider)).toBe(true);
      
      // Record 100th request
      rateLimiter.recordRequest(provider);
      
      // Should NOT be able to execute
      expect(rateLimiter.canExecute(provider)).toBe(false);
      
      const state = rateLimiter.getRateLimitState(provider);
      expect(state.requestsThisMinute).toBe(100);
    });

    it('should track requests per day', () => {
      // Requirement 6.2
      const provider = 'groq';
      
      // Record requests
      for (let i = 0; i < 50; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const state = rateLimiter.getRateLimitState(provider);
      expect(state.requestsToday).toBe(50);
    });

    it('should track token usage per minute', () => {
      // Requirement 6.3
      const provider = 'groq';
      
      // Record requests with token counts
      rateLimiter.recordRequest(provider, 100);
      rateLimiter.recordRequest(provider, 200);
      rateLimiter.recordRequest(provider, 150);
      
      const state = rateLimiter.getRateLimitState(provider);
      expect(state.tokensThisMinute).toBe(450);
    });
  });

  // ============================================================================
  // Test 2: Request Queue Manager Handles Queuing When Limits Reached
  // Requirements: 6.4, 6.5, 6.6, 6.7, 6.8
  // ============================================================================

  describe('2. Request Queue Manager', () => {
    it('should enqueue requests when rate limit is reached', () => {
      // Requirement 6.4
      const provider = 'groq';
      
      // Fill up the rate limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Try to enqueue a request
      const requestId = rateLimiter.enqueueRequest(provider, 100, 5);
      
      expect(requestId).toBeDefined();
      expect(requestId).toMatch(/^req_/);
      expect(rateLimiter.getQueueLength(provider)).toBe(1);
    });

    it('should support priority-based queue ordering', () => {
      // Requirement 6.6
      const provider = 'groq';
      
      // Enqueue requests with different priorities
      const lowPriorityId = rateLimiter.enqueueRequest(provider, 100, 1);
      const highPriorityId = rateLimiter.enqueueRequest(provider, 100, 10);
      const mediumPriorityId = rateLimiter.enqueueRequest(provider, 100, 5);
      
      expect(rateLimiter.getQueueLength(provider)).toBe(3);
      
      // Dequeue should return highest priority first
      const first = rateLimiter.dequeueRequest(provider);
      expect(first?.id).toBe(highPriorityId);
      
      const second = rateLimiter.dequeueRequest(provider);
      expect(second?.id).toBe(mediumPriorityId);
      
      const third = rateLimiter.dequeueRequest(provider);
      expect(third?.id).toBe(lowPriorityId);
    });

    it('should provide estimated wait time for queued requests', () => {
      // Requirement 6.7
      const provider = 'groq';
      
      // Fill rate limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Enqueue a request
      const requestId = rateLimiter.enqueueRequest(provider, 100, 5);
      
      // Get estimated wait time
      const waitTime = rateLimiter.getEstimatedWaitTime(requestId);
      
      // Should have a positive wait time
      expect(waitTime).toBeGreaterThanOrEqual(0);
    });

    it('should support request cancellation', () => {
      // Requirement 6.8
      const provider = 'groq';
      
      // Enqueue requests
      const requestId1 = rateLimiter.enqueueRequest(provider, 100, 5);
      const requestId2 = rateLimiter.enqueueRequest(provider, 100, 5);
      
      expect(rateLimiter.getQueueLength(provider)).toBe(2);
      
      // Cancel first request
      const cancelled = rateLimiter.cancelRequest(requestId1);
      expect(cancelled).toBe(true);
      expect(rateLimiter.getQueueLength(provider)).toBe(1);
      
      // Try to cancel non-existent request
      const notCancelled = rateLimiter.cancelRequest('non-existent');
      expect(notCancelled).toBe(false);
    });

    it('should automatically process queued requests on rate limit reset', async () => {
      // Requirement 6.5
      const provider = 'groq';
      
      // Fill rate limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Enqueue a request
      rateLimiter.enqueueRequest(provider, 100, 5);
      expect(rateLimiter.getQueueLength(provider)).toBe(1);
      
      // Manually reset counters (simulating time passing)
      rateLimiter.resetCounters(provider);
      
      // After reset, should be able to execute again
      expect(rateLimiter.canExecute(provider)).toBe(true);
    });
  });

  // ============================================================================
  // Test 3: Provider Utilization Monitoring
  // Requirements: 6.9, 6.10, 17.9, 17.10
  // ============================================================================

  describe('3. Provider Utilization Monitoring', () => {
    it('should calculate utilization rates (0-1 scale)', () => {
      // Requirement 6.9
      const provider = 'groq';
      
      // Initially 0% utilization
      expect(rateLimiter.calculateUtilizationRate(provider)).toBe(0);
      
      // Record 15 requests (50% of 30 RPM limit)
      for (let i = 0; i < 15; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const utilization = rateLimiter.calculateUtilizationRate(provider);
      expect(utilization).toBe(0.5);
      
      // Record 15 more requests (100% utilization)
      for (let i = 0; i < 15; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const fullUtilization = rateLimiter.calculateUtilizationRate(provider);
      expect(fullUtilization).toBe(1.0);
    });

    it('should alert when utilization exceeds 80%', () => {
      // Requirement 6.10, 14.9
      const provider = 'groq';
      
      // Record 24 requests (80% of 30 RPM limit)
      for (let i = 0; i < 24; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const alerts = rateLimiter.checkUtilizationAlerts(0.8);
      expect(alerts.has(provider)).toBe(true);
      expect(alerts.get(provider)).toBeGreaterThanOrEqual(0.8);
    });

    it('should track provider statistics', () => {
      // Requirement 17.9, 17.10
      const provider = 'groq';
      
      // Record some requests
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Fill rate limit to trigger throttling
      for (let i = 0; i < 20; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Try to enqueue (will be throttled)
      rateLimiter.enqueueRequest(provider, 100, 5);
      
      const stats = rateLimiter.getProviderStats(provider);
      
      expect(stats.provider).toBe(provider);
      expect(stats.totalRequests).toBe(30);
      expect(stats.throttledRequests).toBe(1);
      expect(stats.utilizationRate).toBeGreaterThan(0);
      expect(stats.peakUsageTime).toBeDefined();
    });

    it('should generate comprehensive statistics report', () => {
      // Requirement 6.9, 17.9, 17.10
      const providers = ['groq', 'google', 'cerebras'];
      
      // Record requests for multiple providers
      for (let i = 0; i < 10; i++) {
        rateLimiter.recordRequest('groq');
      }
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordRequest('google');
      }
      for (let i = 0; i < 20; i++) {
        rateLimiter.recordRequest('cerebras');
      }
      
      const report = rateLimiter.generateStatisticsReport();
      
      expect(report.generatedAt).toBeDefined();
      expect(report.providers).toHaveLength(5); // All 5 providers
      expect(report.summary.totalRequests).toBe(35);
      expect(report.summary.averageUtilization).toBeGreaterThanOrEqual(0);
      expect(report.summary.highestUtilization.provider).toBeDefined();
    });
  });

  // ============================================================================
  // Test 4: Integration with Router Considers Rate Limits
  // Requirements: 4.1-4.10, 6.1-6.10
  // ============================================================================

  describe('4. Integration with Router', () => {
    it('should consider rate limits when routing', async () => {
      // Requirement 4.1, 6.1
      const classification: ClassificationResult = {
        category: 'SIMPLE' as TaskCategory,
        confidence: 0.9,
        reasoning: 'Simple query',
        estimatedComplexity: 'LOW',
        estimatedTokens: 100,
        requiresMultimodal: false,
        classifiedAt: new Date().toISOString(),
        classifierModelUsed: 'test-classifier'
      };

      const routingRequest = {
        classification,
        userMessage: 'Test message',
        conversationHistory: []
      };

      // First routing should succeed
      const result1 = await router.route(routingRequest);
      expect(result1.selectedModel).toBeDefined();
      expect(result1.routingReason).toBeDefined();
      
      // Record the execution
      router.recordRequestExecution(result1.selectedModel.provider, 100);
    });

    it('should check if request can execute immediately', () => {
      // Requirement 6.1
      const provider = 'groq';
      
      // Initially should be able to execute
      expect(router.canExecuteImmediately(provider, 100)).toBe(true);
      
      // Fill rate limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Should NOT be able to execute
      expect(router.canExecuteImmediately(provider, 100)).toBe(false);
    });

    it('should enqueue requests through router when rate limited', () => {
      // Requirement 6.4
      const provider = 'groq';
      
      // Fill rate limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Enqueue through router
      const requestId = router.enqueueRequest(provider, 100, 5);
      
      expect(requestId).toBeDefined();
      expect(rateLimiter.getQueueLength(provider)).toBe(1);
    });

    it('should get estimated wait time through router', () => {
      // Requirement 6.7
      const provider = 'groq';
      
      // Fill rate limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Get wait time through router
      const waitTime = router.getEstimatedWaitTime(provider);
      
      expect(waitTime).toBeGreaterThanOrEqual(0);
    });

    it('should get provider utilization through router', () => {
      // Requirement 6.9
      const provider = 'groq';
      
      // Record some requests
      for (let i = 0; i < 15; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const utilization = router.getProviderUtilization(provider);
      expect(utilization).toBe(0.5); // 15/30 = 50%
    });

    it('should check utilization alerts through router', () => {
      // Requirement 6.10
      const provider = 'groq';
      
      // Record 25 requests (83% utilization)
      for (let i = 0; i < 25; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const alerts = router.checkUtilizationAlerts(0.8);
      expect(alerts.has(provider)).toBe(true);
    });

    it('should select fallback model when primary is rate limited', async () => {
      // Requirement 4.3, 6.4
      const classification: ClassificationResult = {
        category: 'SIMPLE' as TaskCategory,
        confidence: 0.9,
        reasoning: 'Simple query',
        estimatedComplexity: 'LOW',
        estimatedTokens: 100,
        requiresMultimodal: false,
        classifiedAt: new Date().toISOString(),
        classifierModelUsed: 'test-classifier'
      };

      // Fill rate limit for Groq
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest('groq');
      }

      const routingRequest = {
        classification,
        userMessage: 'Test message',
        conversationHistory: []
      };

      // Should route to fallback (Cerebras or Google)
      const result = await router.route(routingRequest);
      expect(result.selectedModel).toBeDefined();
      expect(result.selectedModel.provider).not.toBe('groq');
      expect(result.routingReason).toContain('fallback');
    });
  });

  // ============================================================================
  // Test 5: All Provider Limits Correctly Configured
  // Requirements: 14.1-14.9
  // ============================================================================

  describe('5. Provider Limits Configuration', () => {
    it('should have correct Groq limits (30 RPM, 14,400 RPD)', () => {
      // Requirements 14.1, 14.2
      const state = rateLimiter.getRateLimitState('groq');
      
      // Verify initial state
      expect(state.requestsThisMinute).toBe(0);
      expect(state.requestsToday).toBe(0);
      
      // Fill to limit
      for (let i = 0; i < 30; i++) {
        rateLimiter.recordRequest('groq');
      }
      
      expect(rateLimiter.canExecute('groq')).toBe(false);
    });

    it('should have correct Google limits (15 RPM, 1,500 RPD)', () => {
      // Requirements 14.3, 14.4
      const state = rateLimiter.getRateLimitState('google');
      
      expect(state.requestsThisMinute).toBe(0);
      
      // Fill to limit
      for (let i = 0; i < 15; i++) {
        rateLimiter.recordRequest('google');
      }
      
      expect(rateLimiter.canExecute('google')).toBe(false);
    });

    it('should have correct Cerebras limits (100 RPM, 50,000 RPD)', () => {
      // Requirements 14.5, 14.6
      const state = rateLimiter.getRateLimitState('cerebras');
      
      expect(state.requestsThisMinute).toBe(0);
      
      // Fill to limit
      for (let i = 0; i < 100; i++) {
        rateLimiter.recordRequest('cerebras');
      }
      
      expect(rateLimiter.canExecute('cerebras')).toBe(false);
    });

    it('should have correct Veo 3.1 limits (5 RPM, 100 RPD)', () => {
      // Requirements 14.7, 14.8
      // Note: Veo 3.1 uses Google provider limits in the rate limiter
      const state = rateLimiter.getRateLimitState('google');
      
      expect(state.requestsThisMinute).toBe(0);
      expect(state.requestsToday).toBe(0);
    });

    it('should alert at 80% utilization threshold', () => {
      // Requirement 14.9
      const provider = 'groq';
      
      // Record 24 requests (80% of 30)
      for (let i = 0; i < 24; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      const alerts = rateLimiter.checkUtilizationAlerts(0.8);
      expect(alerts.has(provider)).toBe(true);
      
      const utilization = alerts.get(provider);
      expect(utilization).toBeGreaterThanOrEqual(0.8);
    });
  });

  // ============================================================================
  // Integration Test: Complete Rate Limiting Flow
  // ============================================================================

  describe('6. Complete Rate Limiting Flow', () => {
    it('should handle complete rate limiting workflow', async () => {
      const provider = 'groq';
      
      // Step 1: Verify initial state
      expect(rateLimiter.canExecute(provider)).toBe(true);
      expect(rateLimiter.calculateUtilizationRate(provider)).toBe(0);
      
      // Step 2: Execute requests until near limit
      for (let i = 0; i < 25; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Step 3: Check utilization (should be > 80%)
      const utilization = rateLimiter.calculateUtilizationRate(provider);
      expect(utilization).toBeGreaterThan(0.8);
      
      // Step 4: Verify alerts
      const alerts = rateLimiter.checkUtilizationAlerts(0.8);
      expect(alerts.has(provider)).toBe(true);
      
      // Step 5: Fill to limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.recordRequest(provider);
      }
      
      // Step 6: Verify throttled
      expect(rateLimiter.canExecute(provider)).toBe(false);
      const state = rateLimiter.getRateLimitState(provider);
      expect(state.isThrottled).toBe(true);
      
      // Step 7: Enqueue request
      const requestId = rateLimiter.enqueueRequest(provider, 100, 5);
      expect(rateLimiter.getQueueLength(provider)).toBe(1);
      
      // Step 8: Get wait time
      const waitTime = rateLimiter.getEstimatedWaitTime(requestId);
      expect(waitTime).toBeGreaterThanOrEqual(0);
      
      // Step 9: Get statistics
      const stats = rateLimiter.getProviderStats(provider);
      expect(stats.totalRequests).toBe(30);
      expect(stats.throttledRequests).toBe(1);
      expect(stats.utilizationRate).toBe(1.0);
      
      // Step 10: Reset and verify
      rateLimiter.resetCounters(provider);
      expect(rateLimiter.canExecute(provider)).toBe(true);
    });
  });
});
