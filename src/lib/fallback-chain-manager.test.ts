/**
 * Fallback Chain Manager Tests
 * Unit tests for the FallbackChainManager
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FallbackChainManager, ErrorType } from './fallback-chain-manager';
import type { ExtendedModelConfig } from './model-registry-v3';
import type { GenerateRequest, GenerateResponse } from '@/ai/adapters/types';

describe('FallbackChainManager', () => {
  let manager: FallbackChainManager;

  beforeEach(() => {
    manager = new FallbackChainManager();
  });

  describe('executeWithFallback', () => {
    it('should succeed on first attempt with primary model', async () => {
      const mockModel: ExtendedModelConfig = {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'cerebras',
        modelId: 'test-1',
        category: 'general',
        description: 'Test model',
        capabilities: [{ type: 'TEXT' }],
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      };

      const mockRequest: GenerateRequest = {
        model: {} as any,
        prompt: 'Test prompt'
      };

      const mockExecute = async (): Promise<GenerateResponse> => {
        return {
          text: 'Test response',
          modelUsed: 'test-model-1'
        };
      };

      const response = await manager.executeWithFallback(
        mockRequest,
        [mockModel],
        'SIMPLE',
        mockExecute
      );

      expect(response.text).toBe('Test response');
      expect(response.modelUsed).toBe('test-model-1');

      // Check stats
      const stats = manager.getModelStats('test-model-1');
      expect(stats.attempts).toBe(1);
      expect(stats.successes).toBe(1);
      expect(stats.failures).toBe(0);
      expect(stats.successRate).toBe(1);
    });

    it('should fallback to second model when first fails', async () => {
      const mockModel1: ExtendedModelConfig = {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'cerebras',
        modelId: 'test-1',
        category: 'general',
        description: 'Test model',
        capabilities: [{ type: 'TEXT' }],
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      };

      const mockModel2: ExtendedModelConfig = {
        ...mockModel1,
        id: 'test-model-2',
        name: 'Test Model 2',
        provider: 'google'
      };

      const mockRequest: GenerateRequest = {
        model: {} as any,
        prompt: 'Test prompt'
      };

      let attemptCount = 0;
      const mockExecute = async (model: ExtendedModelConfig): Promise<GenerateResponse> => {
        attemptCount++;
        if (model.id === 'test-model-1') {
          throw new Error('Service unavailable');
        }
        return {
          text: 'Test response from model 2',
          modelUsed: 'test-model-2'
        };
      };

      const response = await manager.executeWithFallback(
        mockRequest,
        [mockModel1, mockModel2],
        'MEDIUM',
        mockExecute
      );

      expect(response.text).toBe('Test response from model 2');
      expect(response.modelUsed).toBe('test-model-2');
      expect(attemptCount).toBe(2);

      // Check stats
      const stats1 = manager.getModelStats('test-model-1');
      expect(stats1.attempts).toBe(1);
      expect(stats1.failures).toBe(1);

      const stats2 = manager.getModelStats('test-model-2');
      expect(stats2.attempts).toBe(1);
      expect(stats2.successes).toBe(1);
    });

    it('should throw error when all models fail', async () => {
      const mockModel: ExtendedModelConfig = {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'cerebras',
        modelId: 'test-1',
        category: 'general',
        description: 'Test model',
        capabilities: [{ type: 'TEXT' }],
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      };

      const mockRequest: GenerateRequest = {
        model: {} as any,
        prompt: 'Test prompt'
      };

      const mockExecute = async (): Promise<GenerateResponse> => {
        throw new Error('All models failed');
      };

      await expect(
        manager.executeWithFallback(mockRequest, [mockModel], 'SIMPLE', mockExecute)
      ).rejects.toThrow('All models in fallback chain failed');
    });

    it('should mark provider unavailable on auth error', async () => {
      const mockModel: ExtendedModelConfig = {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'cerebras',
        modelId: 'test-1',
        category: 'general',
        description: 'Test model',
        capabilities: [{ type: 'TEXT' }],
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      };

      const mockRequest: GenerateRequest = {
        model: {} as any,
        prompt: 'Test prompt'
      };

      const mockExecute = async (): Promise<GenerateResponse> => {
        const error: any = new Error('Unauthorized');
        error.status = 401;
        throw error;
      };

      await expect(
        manager.executeWithFallback(mockRequest, [mockModel], 'SIMPLE', mockExecute)
      ).rejects.toThrow();

      expect(manager.isProviderUnavailable('cerebras')).toBe(true);
    });
  });

  describe('getChainPerformance', () => {
    it('should calculate performance metrics correctly', async () => {
      const mockModel: ExtendedModelConfig = {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'cerebras',
        modelId: 'test-1',
        category: 'general',
        description: 'Test model',
        capabilities: [{ type: 'TEXT' }],
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      };

      const mockRequest: GenerateRequest = {
        model: {} as any,
        prompt: 'Test prompt'
      };

      const mockExecute = async (): Promise<GenerateResponse> => {
        return {
          text: 'Test response',
          modelUsed: 'test-model-1'
        };
      };

      // Execute a few successful requests
      await manager.executeWithFallback(mockRequest, [mockModel], 'SIMPLE', mockExecute);
      await manager.executeWithFallback(mockRequest, [mockModel], 'SIMPLE', mockExecute);

      const metrics = manager.getChainPerformance('SIMPLE');
      expect(metrics.category).toBe('SIMPLE');
      expect(metrics.totalExecutions).toBe(2);
      expect(metrics.primarySuccessRate).toBe(1); // All succeeded on first try
      expect(metrics.averageFallbackDepth).toBe(1);
    });
  });

  describe('provider availability', () => {
    it('should track unavailable providers', () => {
      expect(manager.isProviderUnavailable('cerebras')).toBe(false);
      
      manager['unavailableProviders'].add('cerebras');
      expect(manager.isProviderUnavailable('cerebras')).toBe(true);
      
      manager.markProviderAvailable('cerebras');
      expect(manager.isProviderUnavailable('cerebras')).toBe(false);
    });

    it('should return list of unavailable providers', () => {
      manager['unavailableProviders'].add('cerebras');
      manager['unavailableProviders'].add('google');
      
      const unavailable = manager.getUnavailableProviders();
      expect(unavailable).toContain('cerebras');
      expect(unavailable).toContain('google');
      expect(unavailable.length).toBe(2);
    });
  });

  describe('resetStatistics', () => {
    it('should clear all statistics', async () => {
      const mockModel: ExtendedModelConfig = {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'cerebras',
        modelId: 'test-1',
        category: 'general',
        description: 'Test model',
        capabilities: [{ type: 'TEXT' }],
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      };

      const mockRequest: GenerateRequest = {
        model: {} as any,
        prompt: 'Test prompt'
      };

      const mockExecute = async (): Promise<GenerateResponse> => {
        return {
          text: 'Test response',
          modelUsed: 'test-model-1'
        };
      };

      await manager.executeWithFallback(mockRequest, [mockModel], 'SIMPLE', mockExecute);
      
      let stats = manager.getModelStats('test-model-1');
      expect(stats.attempts).toBe(1);

      manager.resetStatistics();
      
      stats = manager.getModelStats('test-model-1');
      expect(stats.attempts).toBe(0);
    });
  });
});
