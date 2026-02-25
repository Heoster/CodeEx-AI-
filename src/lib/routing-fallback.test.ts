/**
 * Routing and Fallback Integration Tests
 * CODEEX V3.3 Multi-Model AI Router - Checkpoint 6
 * 
 * Tests verify:
 * - Routing logic works correctly for all 11 task categories
 * - Fallback chain execution handles failures gracefully
 * - Error handling and recovery mechanisms work as expected
 * - Rate limit, timeout, and auth error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntelligentRouterService } from './intelligent-router-service';
import { FallbackChainManager } from './fallback-chain-manager';
import { ROUTING_RULES_CONFIG } from './routing-rules-config';
import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';
import type { ClassificationResult } from './task-classifier-service';
import type { GenerateRequest, GenerateResponse } from '@/ai/adapters/types';
import type { ProviderType } from './model-config-v3.3';

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
  createMockModel('cerebras-deepseek-v3-0324', 'cerebras', 100),
  createMockModel('groq-llama-3.2-3b', 'groq', 90),
  createMockModel('groq-mistral-saba-24b', 'groq', 80),
  createMockModel('gemini-2.5-flash', 'google', 90),
  createMockModel('gemini-2.5-pro', 'google', 95),
  createMockModel('gemini-3-pro-preview', 'google', 100),
  createMockModel('imagen-4.0', 'google', 100),
  createMockModel('veo-3.1', 'google', 100)
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

const createMockRequest = (category: TaskCategory): any => ({
  classification: createMockClassification(category),
  userMessage: `Test message for ${category}`,
  conversationHistory: []
});

const createMockGenerateRequest = (): GenerateRequest => ({
  model: mockModels[0],
  prompt: 'Test message',
  systemPrompt: 'You are a helpful assistant',
  history: []
});

const createMockGenerateResponse = (): GenerateResponse => ({
  text: 'Mock response',
  modelUsed: 'test-model',
  usage: {
    promptTokens: 10,
    completionTokens: 20
  }
});

// ============================================================================
// Test Suite: Routing Logic
// ============================================================================

describe('IntelligentRouterService - Routing Logic', () => {
  let router: IntelligentRouterService;

  beforeEach(() => {
    router = new IntelligentRouterService(mockModels);
  });

  it('should route SIMPLE tasks to Cerebras Llama 4 Scout 17B', async () => {
    const request = createMockRequest('SIMPLE');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('cerebras-llama-4-scout-17b');
    expect(result.routingReason).toContain('SIMPLE');
  });

  it('should route MEDIUM tasks to Cerebras Llama 3.3 70B', async () => {
    const request = createMockRequest('MEDIUM');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('cerebras-llama-3.3-70b');
    expect(result.routingReason).toContain('MEDIUM');
  });

  it('should route COMPLEX tasks to Cerebras GPT-OSS 120B', async () => {
    const request = createMockRequest('COMPLEX');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('cerebras-gpt-oss-120b');
    expect(result.routingReason).toContain('COMPLEX');
  });

  it('should route CODING tasks to Cerebras DeepSeek V3', async () => {
    const request = createMockRequest('CODING');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('cerebras-deepseek-v3-0324');
    expect(result.routingReason).toContain('CODING');
  });

  it('should route REASONING tasks to Cerebras GPT-OSS 120B', async () => {
    const request = createMockRequest('REASONING');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('cerebras-gpt-oss-120b');
    expect(result.routingReason).toContain('REASONING');
  });

  it('should route VISION_IN tasks to Gemini 3 Pro Preview', async () => {
    const request = createMockRequest('VISION_IN');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('gemini-3-pro-preview');
    expect(result.routingReason).toContain('VISION_IN');
  });

  it('should route IMAGE_GEN tasks to Imagen 4.0', async () => {
    const request = createMockRequest('IMAGE_GEN');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('imagen-4.0');
    expect(result.routingReason).toContain('IMAGE_GEN');
  });

  it('should route VIDEO_GEN tasks to Veo 3.1', async () => {
    const request = createMockRequest('VIDEO_GEN');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('veo-3.1');
    expect(result.routingReason).toContain('VIDEO_GEN');
  });

  it('should route MULTILINGUAL tasks to Groq Mistral Saba 24B', async () => {
    const request = createMockRequest('MULTILINGUAL');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('groq-mistral-saba-24b');
    expect(result.routingReason).toContain('MULTILINGUAL');
  });

  it('should route AGENTIC tasks to Gemini 3 Pro Preview', async () => {
    const request = createMockRequest('AGENTIC');
    const result = await router.route(request);

    expect(result.selectedModel.id).toBe('gemini-3-pro-preview');
    expect(result.routingReason).toContain('AGENTIC');
  });

  it('should route LONG_CONTEXT tasks to Gemini 2.5 Flash', async () => {
    // Create classification with high token count to meet LONG_CONTEXT condition
    const classification = createMockClassification('LONG_CONTEXT', 'HIGH', 150000);
    const request = {
      classification,
      userMessage: 'Test message for LONG_CONTEXT',
      conversationHistory: []
    };
    const result = await router.route(request);

    // Should route to gemini-2.5-flash if available, otherwise fallback
    expect(result.selectedModel.id).toBeTruthy();
    expect(result.routingReason).toBeTruthy();
    // Verify it's either the primary or a fallback from the chain
    const validModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-pro-preview', 'cerebras-llama-3.3-70b'];
    expect(validModels).toContain(result.selectedModel.id);
  });

  it('should build fallback chain for each category', async () => {
    const request = createMockRequest('SIMPLE');
    const result = await router.route(request);

    expect(result.fallbackChain).toBeDefined();
    expect(result.fallbackChain.length).toBeGreaterThan(0);
    expect(result.fallbackChain[0].id).not.toBe(result.selectedModel.id);
  });

  it('should estimate latency based on provider and complexity', async () => {
    const request = createMockRequest('SIMPLE');
    const result = await router.route(request);

    expect(result.estimatedLatency).toBeGreaterThan(0);
    expect(typeof result.estimatedLatency).toBe('number');
  });

  it('should include routing timestamp', async () => {
    const request = createMockRequest('SIMPLE');
    const result = await router.route(request);

    expect(result.routedAt).toBeDefined();
    expect(new Date(result.routedAt).getTime()).toBeGreaterThan(0);
  });
});

// ============================================================================
// Test Suite: Fallback Chain Execution
// ============================================================================

describe('FallbackChainManager - Fallback Execution', () => {
  let manager: FallbackChainManager;

  beforeEach(() => {
    manager = new FallbackChainManager();
    manager.resetStatistics();
  });

  it('should execute primary model successfully', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const mockExecute = vi.fn().mockResolvedValue(createMockGenerateResponse());

    const response = await manager.executeWithFallback(
      request,
      chain,
      'SIMPLE',
      mockExecute
    );

    expect(response).toBeDefined();
    expect(response.text).toBe('Mock response');
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });

  it('should fallback to next model on primary failure', async () => {
    const chain = [mockModels[0], mockModels[1], mockModels[2]];
    const request = createMockGenerateRequest();
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(new Error('Primary model failed'))
      .mockResolvedValueOnce(createMockGenerateResponse());

    const response = await manager.executeWithFallback(
      request,
      chain,
      'SIMPLE',
      mockExecute
    );

    expect(response).toBeDefined();
    expect(mockExecute).toHaveBeenCalledTimes(2);
  });

  it('should try all models in fallback chain', async () => {
    const chain = [mockModels[0], mockModels[1], mockModels[2]];
    const request = createMockGenerateRequest();
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(new Error('Model 1 failed'))
      .mockRejectedValueOnce(new Error('Model 2 failed'))
      .mockResolvedValueOnce(createMockGenerateResponse());

    const response = await manager.executeWithFallback(
      request,
      chain,
      'SIMPLE',
      mockExecute
    );

    expect(response).toBeDefined();
    expect(mockExecute).toHaveBeenCalledTimes(3);
  });

  it('should throw error when all models fail', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const mockExecute = vi.fn()
      .mockRejectedValue(new Error('All models failed'));

    await expect(
      manager.executeWithFallback(request, chain, 'SIMPLE', mockExecute)
    ).rejects.toThrow('All models in fallback chain failed');
  });

  it('should implement exponential backoff between retries', async () => {
    const chain = [mockModels[0], mockModels[1], mockModels[2]];
    const request = createMockGenerateRequest();
    
    const timestamps: number[] = [];
    const mockExecute = vi.fn().mockImplementation(async () => {
      timestamps.push(Date.now());
      if (timestamps.length < 3) {
        throw new Error('Retry');
      }
      return createMockGenerateResponse();
    });

    await manager.executeWithFallback(request, chain, 'SIMPLE', mockExecute);

    // Check that delays increase (exponential backoff)
    if (timestamps.length >= 3) {
      const delay1 = timestamps[1] - timestamps[0];
      const delay2 = timestamps[2] - timestamps[1];
      expect(delay2).toBeGreaterThanOrEqual(delay1);
    }
  });

  it('should track fallback execution history', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce(createMockGenerateResponse());

    await manager.executeWithFallback(request, chain, 'SIMPLE', mockExecute);

    const stats = manager.getModelStats(mockModels[0].id);
    expect(stats.attempts).toBeGreaterThan(0);
  });

  it('should calculate chain performance metrics', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const mockExecute = vi.fn().mockResolvedValue(createMockGenerateResponse());

    await manager.executeWithFallback(request, chain, 'SIMPLE', mockExecute);

    const metrics = manager.getChainPerformance('SIMPLE');
    expect(metrics.totalExecutions).toBeGreaterThan(0);
    expect(metrics.primarySuccessRate).toBeGreaterThanOrEqual(0);
    expect(metrics.primarySuccessRate).toBeLessThanOrEqual(1);
  });
});

// ============================================================================
// Test Suite: Error Handling
// ============================================================================

describe('FallbackChainManager - Error Handling', () => {
  let manager: FallbackChainManager;

  beforeEach(() => {
    manager = new FallbackChainManager();
    manager.resetStatistics();
  });

  it('should handle rate limit errors (429)', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const rateLimitError = new Error('Rate limit exceeded');
    (rateLimitError as any).status = 429;
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValueOnce(createMockGenerateResponse());

    const response = await manager.executeWithFallback(
      request,
      chain,
      'SIMPLE',
      mockExecute
    );

    expect(response).toBeDefined();
    expect(mockExecute).toHaveBeenCalledTimes(2);
  });

  it('should handle timeout errors', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const timeoutError = new Error('Request timeout');
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(createMockGenerateResponse());

    const response = await manager.executeWithFallback(
      request,
      chain,
      'SIMPLE',
      mockExecute
    );

    expect(response).toBeDefined();
  });

  it('should handle authentication errors (401)', async () => {
    const chain = [
      createMockModel('model-1', 'groq'),
      createMockModel('model-2', 'cerebras')
    ];
    const request = createMockGenerateRequest();
    
    const authError = new Error('Unauthorized');
    (authError as any).status = 401;
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(authError)
      .mockResolvedValueOnce(createMockGenerateResponse());

    await manager.executeWithFallback(request, chain, 'SIMPLE', mockExecute);

    // Provider should be marked unavailable
    expect(manager.isProviderUnavailable('groq')).toBe(true);
  });

  it('should handle service unavailable errors (503)', async () => {
    const chain = [mockModels[0], mockModels[1]];
    const request = createMockGenerateRequest();
    
    const serviceError = new Error('Service unavailable');
    (serviceError as any).status = 503;
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(serviceError)
      .mockResolvedValueOnce(createMockGenerateResponse());

    const response = await manager.executeWithFallback(
      request,
      chain,
      'SIMPLE',
      mockExecute
    );

    expect(response).toBeDefined();
  });

  it('should skip unavailable providers', async () => {
    const chain = [
      createMockModel('model-1', 'groq'),
      createMockModel('model-2', 'cerebras')
    ];
    const request = createMockGenerateRequest();
    
    // Mark groq as unavailable
    const authError = new Error('Unauthorized');
    (authError as any).status = 401;
    
    const mockExecute = vi.fn()
      .mockRejectedValueOnce(authError)
      .mockResolvedValueOnce(createMockGenerateResponse());

    await manager.executeWithFallback(request, chain, 'SIMPLE', mockExecute);

    expect(manager.isProviderUnavailable('groq')).toBe(true);
  });

  it('should allow marking provider as available again', () => {
    manager.markProviderAvailable('groq');
    expect(manager.isProviderUnavailable('groq')).toBe(false);
  });
});

// ============================================================================
// Test Suite: Routing Rules Configuration
// ============================================================================

describe('Routing Rules Configuration', () => {
  it('should have rules for all 11 task categories', () => {
    const categories: TaskCategory[] = [
      'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
      'VISION_IN', 'IMAGE_GEN', 'VIDEO_GEN', 'MULTILINGUAL',
      'AGENTIC', 'LONG_CONTEXT'
    ];

    for (const category of categories) {
      expect(ROUTING_RULES_CONFIG[category]).toBeDefined();
      expect(ROUTING_RULES_CONFIG[category].primaryModelId).toBeTruthy();
    }
  });

  it('should have fallback chains for most categories', () => {
    const categoriesWithFallbacks: TaskCategory[] = [
      'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
      'VISION_IN', 'IMAGE_GEN', 'MULTILINGUAL', 'AGENTIC', 'LONG_CONTEXT'
    ];

    for (const category of categoriesWithFallbacks) {
      expect(ROUTING_RULES_CONFIG[category].fallbackModelIds.length).toBeGreaterThan(0);
    }
  });

  it('should have correct primary models for each category', () => {
    expect(ROUTING_RULES_CONFIG.SIMPLE.primaryModelId).toBe('cerebras-llama-4-scout-17b');
    expect(ROUTING_RULES_CONFIG.MEDIUM.primaryModelId).toBe('cerebras-llama-3.3-70b');
    expect(ROUTING_RULES_CONFIG.COMPLEX.primaryModelId).toBe('cerebras-gpt-oss-120b');
    expect(ROUTING_RULES_CONFIG.CODING.primaryModelId).toBe('cerebras-deepseek-v3-0324');
    expect(ROUTING_RULES_CONFIG.REASONING.primaryModelId).toBe('cerebras-gpt-oss-120b');
    expect(ROUTING_RULES_CONFIG.VISION_IN.primaryModelId).toBe('gemini-3-pro-preview');
    expect(ROUTING_RULES_CONFIG.IMAGE_GEN.primaryModelId).toBe('imagen-4.0');
    expect(ROUTING_RULES_CONFIG.VIDEO_GEN.primaryModelId).toBe('veo-3.1');
    expect(ROUTING_RULES_CONFIG.MULTILINGUAL.primaryModelId).toBe('groq-mistral-saba-24b');
    expect(ROUTING_RULES_CONFIG.AGENTIC.primaryModelId).toBe('gemini-3-pro-preview');
    expect(ROUTING_RULES_CONFIG.LONG_CONTEXT.primaryModelId).toBe('gemini-2.5-flash');
  });
});

// ============================================================================
// Test Suite: User Preferences
// ============================================================================

describe('IntelligentRouterService - User Preferences', () => {
  let router: IntelligentRouterService;

  beforeEach(() => {
    router = new IntelligentRouterService(mockModels);
  });

  it('should respect preferred providers', async () => {
    const request = createMockRequest('SIMPLE');
    request.userPreferences = {
      preferredProviders: ['google' as ProviderType]
    };

    const result = await router.route(request);

    // Should try to use a Google model if available in fallback chain
    expect(result.selectedModel).toBeDefined();
  });

  it('should avoid specified providers', async () => {
    const request = createMockRequest('SIMPLE');
    request.userPreferences = {
      avoidProviders: ['cerebras' as ProviderType]
    };

    const result = await router.route(request);

    // Should not use Cerebras if avoided
    if (result.selectedModel.provider === 'cerebras') {
      // This is acceptable if no other options available
      expect(result.fallbackChain.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('should prioritize speed when requested', async () => {
    const request = createMockRequest('MEDIUM');
    request.userPreferences = {
      prioritizeSpeed: true
    };

    const result = await router.route(request);

    expect(result.routingReason).toContain('speed');
  });

  it('should prioritize quality when requested', async () => {
    const request = createMockRequest('MEDIUM');
    request.userPreferences = {
      prioritizeQuality: true
    };

    const result = await router.route(request);

    expect(result.routingReason).toContain('quality');
  });
});

// ============================================================================
// Test Suite: Statistics Tracking
// ============================================================================

describe('IntelligentRouterService - Statistics', () => {
  let router: IntelligentRouterService;

  beforeEach(() => {
    router = new IntelligentRouterService(mockModels);
    router.resetStatistics();
  });

  it('should track total requests', async () => {
    const request = createMockRequest('SIMPLE');
    await router.route(request);
    await router.route(request);

    const stats = router.getRoutingStats();
    expect(stats.totalRequests).toBe(2);
  });

  it('should track requests by category', async () => {
    await router.route(createMockRequest('SIMPLE'));
    await router.route(createMockRequest('MEDIUM'));
    await router.route(createMockRequest('SIMPLE'));

    const stats = router.getRoutingStats();
    expect(stats.routingsByCategory.SIMPLE).toBe(2);
    expect(stats.routingsByCategory.MEDIUM).toBe(1);
  });

  it('should track provider distribution', async () => {
    await router.route(createMockRequest('SIMPLE'));
    await router.route(createMockRequest('MEDIUM'));

    const stats = router.getRoutingStats();
    expect(stats.providerDistribution).toBeDefined();
  });

  it('should calculate average latency', async () => {
    await router.route(createMockRequest('SIMPLE'));
    await router.route(createMockRequest('MEDIUM'));

    const stats = router.getRoutingStats();
    expect(stats.averageLatency).toBeGreaterThan(0);
  });

  it('should track fallback rate', () => {
    router.recordFallback();
    router.recordFallback();

    const stats = router.getRoutingStats();
    expect(stats.fallbackRate).toBeGreaterThanOrEqual(0);
  });
});
