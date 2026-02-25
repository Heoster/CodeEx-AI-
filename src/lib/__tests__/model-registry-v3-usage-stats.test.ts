/**
 * Unit tests for Model Registry V3 Usage Statistics
 * Tests for task 1.6: Implement model usage statistics tracking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModelRegistryV3, ExtendedModelConfig, ModelUsageStats } from '../model-registry-v3';

describe('ModelRegistryV3 - Usage Statistics', () => {
  let registry: ModelRegistryV3;
  let testModel: ExtendedModelConfig;

  beforeEach(() => {
    // Create a test model
    testModel = {
      id: 'test-model-1',
      name: 'Test Model 1',
      provider: 'groq',
      modelId: 'test-model',
      category: 'general',
      description: 'Test model for usage statistics',
      contextWindow: 8192,
      supportsStreaming: true,
      defaultParams: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
      enabled: true,
      lifecycle: {
        status: 'ACTIVE',
        healthStatus: 'HEALTHY',
      },
      capabilities: [{ type: 'TEXT' }],
      rateLimit: {
        requestsPerMinute: 30,
        requestsPerDay: 14400,
      },
      priority: 90,
    };

    registry = new ModelRegistryV3([testModel]);
  });

  describe('getModelUsageStats', () => {
    it('should return initial usage stats for a model', () => {
      const stats = registry.getModelUsageStats('test-model-1');
      
      expect(stats).toBeDefined();
      expect(stats?.totalRequests).toBe(0);
      expect(stats?.successRate).toBe(1.0);
      expect(stats?.averageLatency).toBe(0);
      expect(stats?.errorCount).toBe(0);
      expect(stats?.lastUsed).toBeDefined();
    });

    it('should return undefined for non-existent model', () => {
      const stats = registry.getModelUsageStats('non-existent-model');
      expect(stats).toBeUndefined();
    });
  });

  describe('recordSuccess', () => {
    it('should increment total requests on success', () => {
      registry.recordSuccess('test-model-1', 100);
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.totalRequests).toBe(1);
    });

    it('should update average latency correctly', () => {
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-1', 200);
      registry.recordSuccess('test-model-1', 300);
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.averageLatency).toBe(200); // (100 + 200 + 300) / 3
    });

    it('should maintain 100% success rate with only successes', () => {
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-1', 150);
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.successRate).toBe(1.0);
    });

    it('should update lastUsed timestamp', () => {
      const beforeTime = new Date().toISOString();
      registry.recordSuccess('test-model-1', 100);
      const afterTime = new Date().toISOString();
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.lastUsed).toBeDefined();
      expect(stats!.lastUsed >= beforeTime).toBe(true);
      expect(stats!.lastUsed <= afterTime).toBe(true);
    });

    it('should not throw error for non-existent model', () => {
      expect(() => {
        registry.recordSuccess('non-existent-model', 100);
      }).not.toThrow();
    });
  });

  describe('recordError', () => {
    it('should increment total requests on error', () => {
      registry.recordError('test-model-1');
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.totalRequests).toBe(1);
    });

    it('should increment error count', () => {
      registry.recordError('test-model-1');
      registry.recordError('test-model-1');
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.errorCount).toBe(2);
    });

    it('should update success rate correctly', () => {
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-1', 150);
      registry.recordError('test-model-1');
      registry.recordError('test-model-1');
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.totalRequests).toBe(4);
      expect(stats?.errorCount).toBe(2);
      expect(stats?.successRate).toBe(0.5); // 2 successes out of 4 total
    });

    it('should update lastUsed timestamp', () => {
      const beforeTime = new Date().toISOString();
      registry.recordError('test-model-1');
      const afterTime = new Date().toISOString();
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.lastUsed).toBeDefined();
      expect(stats!.lastUsed >= beforeTime).toBe(true);
      expect(stats!.lastUsed <= afterTime).toBe(true);
    });

    it('should not throw error for non-existent model', () => {
      expect(() => {
        registry.recordError('non-existent-model');
      }).not.toThrow();
    });
  });

  describe('getAllUsageStats', () => {
    it('should return all usage statistics', () => {
      const model2: ExtendedModelConfig = {
        ...testModel,
        id: 'test-model-2',
        name: 'Test Model 2',
      };
      
      registry.addModel(model2);
      
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-2', 200);
      
      const allStats = registry.getAllUsageStats();
      
      expect(allStats.size).toBe(2);
      expect(allStats.get('test-model-1')).toBeDefined();
      expect(allStats.get('test-model-2')).toBeDefined();
    });
  });

  describe('Complex scenarios', () => {
    it('should handle mixed success and error records', () => {
      // Record 7 successes and 3 errors
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-1', 150);
      registry.recordSuccess('test-model-1', 200);
      registry.recordError('test-model-1');
      registry.recordSuccess('test-model-1', 250);
      registry.recordError('test-model-1');
      registry.recordSuccess('test-model-1', 300);
      registry.recordSuccess('test-model-1', 350);
      registry.recordError('test-model-1');
      registry.recordSuccess('test-model-1', 400);
      
      const stats = registry.getModelUsageStats('test-model-1');
      
      expect(stats?.totalRequests).toBe(10);
      expect(stats?.errorCount).toBe(3);
      expect(stats?.successRate).toBe(0.7); // 7 successes out of 10 total
      
      // Average latency is calculated only from successful requests
      // (100 + 150 + 200 + 250 + 300 + 350 + 400) / 7 = 250
      expect(stats?.averageLatency).toBe(250);
    });

    it('should maintain accurate statistics across multiple models', () => {
      const model2: ExtendedModelConfig = {
        ...testModel,
        id: 'test-model-2',
        name: 'Test Model 2',
      };
      
      registry.addModel(model2);
      
      // Model 1: 3 successes, 1 error
      registry.recordSuccess('test-model-1', 100);  // avg = 100
      registry.recordSuccess('test-model-1', 200);  // avg = (100*1 + 200)/2 = 150
      registry.recordError('test-model-1');         // avg stays 150 (errors don't affect latency)
      registry.recordSuccess('test-model-1', 300);  // avg = (150*2 + 300)/3 = 200
      
      // Model 2: 2 successes, 2 errors
      registry.recordSuccess('test-model-2', 150);  // avg = 150
      registry.recordError('test-model-2');         // avg stays 150
      registry.recordError('test-model-2');         // avg stays 150
      registry.recordSuccess('test-model-2', 250);  // avg = (150*1 + 250)/2 = 200
      
      const stats1 = registry.getModelUsageStats('test-model-1');
      const stats2 = registry.getModelUsageStats('test-model-2');
      
      expect(stats1?.totalRequests).toBe(4);
      expect(stats1?.errorCount).toBe(1);
      expect(stats1?.successRate).toBe(0.75);
      // Average latency of successful requests: (100 + 200 + 300) / 3 = 200
      expect(stats1?.averageLatency).toBe(200);
      
      expect(stats2?.totalRequests).toBe(4);
      expect(stats2?.errorCount).toBe(2);
      expect(stats2?.successRate).toBe(0.5);
      // Average latency of successful requests: (150 + 250) / 2 = 200
      expect(stats2?.averageLatency).toBe(200);
    });
  });

  describe('Requirements validation', () => {
    it('should track total requests (Requirement 17.1)', () => {
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-1', 150);
      registry.recordError('test-model-1');
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.totalRequests).toBe(3);
    });

    it('should calculate success rate (Requirement 17.2)', () => {
      registry.recordSuccess('test-model-1', 100);
      registry.recordError('test-model-1');
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.successRate).toBe(0.5);
    });

    it('should track average latency (Requirement 17.3)', () => {
      registry.recordSuccess('test-model-1', 100);
      registry.recordSuccess('test-model-1', 200);
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.averageLatency).toBe(150);
    });

    it('should record last used timestamp (Requirement 17.4)', () => {
      registry.recordSuccess('test-model-1', 100);
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.lastUsed).toBeDefined();
      expect(new Date(stats!.lastUsed).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should count errors (Requirement 17.5)', () => {
      registry.recordError('test-model-1');
      registry.recordError('test-model-1');
      registry.recordError('test-model-1');
      
      const stats = registry.getModelUsageStats('test-model-1');
      expect(stats?.errorCount).toBe(3);
    });
  });
});
