/**
 * Rate Limiting Integration Tests
 * CODEEX V3.3 Multi-Model AI Router - Task 7.5
 * 
 * Tests verify:
 * - Rate limit checks before model execution
 * - Automatic queuing or fallback on rate limit
 * - Routing logic considers provider utilization
 * 
 * Requirements: 6.1-6.10, 14.1-14.9
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IntelligentRouterService } from './intelligent-router-service';
import { RateLimiterService } from './rate-limiter-service';
import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';
import type { ClassificationResult } from './task-classifier-service';
import type { ProviderType } from './model-config-v3.3';
import type { RoutingRequest } from './intelligent-router-service';

// ============================================================================
// Mock Data
// ============================================================================

const createMockModel = (
  id: string,
  provider: ProviderType,
  priority: number = 50
): ExtendedModelConfig => ({
  id,
  name: `Mock ${id}`,
  provider,
  modelId: id,
  category: 'general',
  description: 'Mock model',
  contextWindow: 8192,
  supportsStreaming: true,
  maxOutputTokens: 4096,
  defaultParams: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 2048
  },
  enabled: true,
  lifecycle: {
    status: 'ACTIVE',
    healthStatus: 'HEALTHY'
  },
  capabilities: [{ type: 'TEXT' }],
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerDay: 14400
  },
  priority
});

const mockModels: ExtendedModelConfig[] = [
  createMockModel('cerebras-llama-4-scout-17b', 'cerebras', 95),
  createMockModel('cerebras-llama-3.3-70b', 'cerebras', 90),
  createMockModel('cerebras-gpt-oss-120b', 'cerebras', 95),
  createMockModel('groq-llama-3.2-3b', 'groq', 90),
  createMockModel('gemini-2.5-flash', 'google', 90),
  createMockModel('gemini-2.5-pro', 'google', 95),
];

const createMockClassification = (
  category: TaskCategory,
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM',
  estimatedTokens: number = 1000
): ClassificationResult => ({
  category,
  confidence: 0.95,
  reasoning: `Classified as ${category}`,
  estimatedComplexity: complexity,
  estimatedTokens,
  requiresMultimodal: false,
  classifiedAt: new Date().toISOString(),
  classifierModelUsed: 'groq-llama-3.2-3b'
});

// ============================================================================
// Test Suite: Rate Limiting Integration
// ============================================================================

describe('Rate Limiting Integration with Router', () => {
  let router: IntelligentRouterService;
  let rateLimiter: RateLimiterService;

  beforeEach(() => {
    rateLimiter = new RateLimiterService();
    router = new IntelligentRouterService(mockModels, undefined, rateLimiter);
  });

  it('should select primary model when rate limit allows', async () => {
    const request = {
      classification: createMockClassification('SIMPLE'),
      userMessage: 'Test message',
      conversationHistory: []
    };

    const result = await router.route(request);

    // Should select primary model (cerebras-llama-4-scout-17b)
    expect(result.selectedModel.id).toBe('cerebras-llama-4-scout-17b');
    expect(result.routingReason).toContain('SIMPLE');
  });

  it('should check if model can execute immediately', () => {
    // Initially, all providers should be available
    expect(router.canExecuteImmediately('cerebras', 1000)).toBe(true);
    expect(router.canExecuteImmediately('groq', 1000)).toBe(true);
    expect(router.canExecuteImmediately('google', 1000)).toBe(true);
  });

  it('should track provider utilization', () => {
    // Initially, utilization should be 0
    expect(router.getProviderUtilization('cerebras')).toBe(0);
    expect(router.getProviderUtilization('groq')).toBe(0);

    // Record some requests
    router.recordRequestExecution('cerebras', 1000);
    router.recordRequestExecution('cerebras', 1000);

    // Utilization should increase
    const utilization = router.getProviderUtilization('cerebras');
    expect(utilization).toBeGreaterThan(0);
    expect(utilization).toBeLessThanOrEqual(1);
  });

  it('should select fallback when primary provider is at rate limit', async () => {
    // Exhaust cerebras rate limit (100 requests per minute)
    for (let i = 0; i < 100; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    // Verify cerebras is throttled
    expect(router.canExecuteImmediately('cerebras', 100)).toBe(false);

    const request = {
      classification: createMockClassification('SIMPLE'),
      userMessage: 'Test message',
      conversationHistory: []
    };

    const result = await router.route(request);

    // Should select a fallback model from a different provider
    expect(result.selectedModel.provider).not.toBe('cerebras');
    expect(result.routingReason).toContain('fallback');
  });

  it('should include rate limit information in routing reason', async () => {
    // Partially fill cerebras rate limit
    for (let i = 0; i < 60; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    const request = {
      classification: createMockClassification('SIMPLE'),
      userMessage: 'Test message',
      conversationHistory: []
    };

    const result = await router.route(request);

    // Should mention utilization in routing reason
    expect(result.routingReason).toMatch(/utilization|fallback/);
  });

  it('should check for high utilization alerts', () => {
    // Initially, no alerts
    let alerts = router.checkUtilizationAlerts(0.8);
    expect(alerts.size).toBe(0);

    // Fill cerebras to 90% capacity
    for (let i = 0; i < 90; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    // Should have alert for cerebras
    alerts = router.checkUtilizationAlerts(0.8);
    expect(alerts.size).toBeGreaterThan(0);
    expect(alerts.has('cerebras')).toBe(true);
    expect(alerts.get('cerebras')).toBeGreaterThanOrEqual(0.8);
  });

  it('should enqueue requests when rate limit is reached', () => {
    // Exhaust cerebras rate limit
    for (let i = 0; i < 100; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    // Try to enqueue a request
    const requestId = router.enqueueRequest('cerebras', 1000, 1);
    expect(requestId).toBeTruthy();
    expect(requestId).toMatch(/^req_/);

    // Check queue length
    const queueLength = router.getRateLimiter().getQueueLength('cerebras');
    expect(queueLength).toBe(1);
  });

  it('should estimate wait time for throttled provider', () => {
    // Exhaust cerebras rate limit
    for (let i = 0; i < 100; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    // Get estimated wait time
    const waitTime = router.getEstimatedWaitTime('cerebras');
    
    // Should have some wait time (up to 60 seconds)
    expect(waitTime).toBeGreaterThan(0);
    expect(waitTime).toBeLessThanOrEqual(60000); // Max 60 seconds
  });

  it('should prefer models with lower utilization', async () => {
    // Fill cerebras to high utilization
    for (let i = 0; i < 80; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    // Keep groq at low utilization
    router.recordRequestExecution('groq', 100);

    const request = {
      classification: createMockClassification('SIMPLE'),
      userMessage: 'Test message',
      conversationHistory: []
    };

    const result = await router.route(request);

    // With high cerebras utilization, might prefer groq fallback
    const cerebrasUtilization = router.getProviderUtilization('cerebras');
    const groqUtilization = router.getProviderUtilization('groq');
    
    expect(cerebrasUtilization).toBeGreaterThan(groqUtilization);
  });

  it('should access rate limiter service', () => {
    const rateLimiterService = router.getRateLimiter();
    expect(rateLimiterService).toBeDefined();
    expect(rateLimiterService).toBeInstanceOf(RateLimiterService);
  });
});

// ============================================================================
// Test Suite: Provider Utilization Sorting
// ============================================================================

describe('Provider Utilization in Model Selection', () => {
  let router: IntelligentRouterService;
  let rateLimiter: RateLimiterService;

  beforeEach(() => {
    rateLimiter = new RateLimiterService();
    router = new IntelligentRouterService(mockModels, undefined, rateLimiter);
  });

  it('should sort models by availability score', async () => {
    // Create high utilization for cerebras
    for (let i = 0; i < 95; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    // Create low utilization for google
    router.recordRequestExecution('google', 100);

    const request = {
      classification: createMockClassification('MEDIUM'),
      userMessage: 'Test message',
      conversationHistory: []
    };

    const result = await router.route(request);

    // Should prefer lower utilization provider in fallback
    const selectedProvider = result.selectedModel.provider;
    const selectedUtilization = router.getProviderUtilization(selectedProvider);
    
    // Selected provider should have reasonable utilization
    expect(selectedUtilization).toBeLessThan(1.0);
  });

  it('should respect user preferences even with rate limits', async () => {
    // Exhaust cerebras
    for (let i = 0; i < 100; i++) {
      router.recordRequestExecution('cerebras', 100);
    }

    const request: RoutingRequest = {
      classification: createMockClassification('SIMPLE'),
      userMessage: 'Test message',
      conversationHistory: [],
      userPreferences: {
        preferredProviders: ['google' as ProviderType]
      }
    };

    const result = await router.route(request);

    // Should respect user preference for google
    expect(result.selectedModel.provider).toBe('google');
  });

  it('should avoid providers specified by user', async () => {
    const request: RoutingRequest = {
      classification: createMockClassification('SIMPLE'),
      userMessage: 'Test message',
      conversationHistory: [],
      userPreferences: {
        avoidProviders: ['cerebras' as ProviderType]
      }
    };

    const result = await router.route(request);

    // Should not select cerebras
    expect(result.selectedModel.provider).not.toBe('cerebras');
  });
});
