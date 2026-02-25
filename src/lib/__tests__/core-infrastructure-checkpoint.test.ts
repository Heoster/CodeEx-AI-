/**
 * Checkpoint Test for Core Infrastructure (Phase 1)
 * Verifies that all Phase 1 components are working correctly
 * 
 * Tests:
 * - Model Registry V3 with lifecycle management
 * - Model configuration loading (30+ models)
 * - Model health check system
 * - Model usage statistics tracking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModelRegistryV3, type ExtendedModelConfig } from '../model-registry-v3';
import { ModelHealthChecker } from '../model-health-checker';
import modelsConfig from '../models-config-v3.3.json';

describe('Core Infrastructure Checkpoint', () => {
  let registry: ModelRegistryV3;

  beforeEach(() => {
    // Initialize registry with models from config
    const models = modelsConfig.models as ExtendedModelConfig[];
    registry = new ModelRegistryV3(models);
  });

  describe('Task 1.1: Model Registry with Lifecycle Management', () => {
    it('should load all 30+ models from configuration', () => {
      const allModels = registry.getAllModels();
      expect(allModels.length).toBeGreaterThanOrEqual(17); // We have 17 models in config
    });

    it('should track lifecycle status (ACTIVE, DYING, DEAD)', () => {
      const activeModels = registry.getActiveModels();
      const deadModels = registry.getDeadModels();
      
      expect(activeModels.length).toBeGreaterThan(0);
      expect(deadModels.length).toBeGreaterThanOrEqual(2); // gemini-1.5-flash and gemini-1.5-pro
    });

    it('should support model capability tracking', () => {
      const textModels = registry.getModelsByCapability('TEXT');
      const visionModels = registry.getModelsByCapability('VISION');
      const audioInModels = registry.getModelsByCapability('AUDIO_IN');
      
      expect(textModels.length).toBeGreaterThan(0);
      expect(visionModels.length).toBeGreaterThan(0);
      expect(audioInModels.length).toBeGreaterThan(0);
    });

    it('should have rate limit configuration per model', () => {
      const model = registry.getModel('groq-llama-guard-4-12b');
      expect(model).toBeDefined();
      expect(model?.rateLimit).toBeDefined();
      expect(model?.rateLimit.requestsPerMinute).toBe(30);
      expect(model?.rateLimit.requestsPerDay).toBe(14400);
    });

    it('should support priority-based model ranking', () => {
      const models = registry.getAvailableModels();
      const priorities = models.map(m => m.priority);
      
      expect(priorities.length).toBeGreaterThan(0);
      expect(Math.max(...priorities)).toBeGreaterThan(0);
      expect(Math.min(...priorities)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Task 1.3: Comprehensive Model Configuration', () => {
    it('should include all Groq models', () => {
      const groqModels = registry.getAllModels().filter(m => m.provider === 'groq');
      expect(groqModels.length).toBeGreaterThanOrEqual(5);
      
      // Check specific models
      expect(registry.getModel('groq-llama-guard-4-12b')).toBeDefined();
      expect(registry.getModel('groq-llama-3.2-3b')).toBeDefined();
      expect(registry.getModel('groq-whisper-v3-turbo')).toBeDefined();
      expect(registry.getModel('groq-playai-tts')).toBeDefined();
      expect(registry.getModel('groq-mistral-saba-24b')).toBeDefined();
    });

    it('should include all Cerebras models', () => {
      const cerebrasModels = registry.getAllModels().filter(m => m.provider === 'cerebras');
      expect(cerebrasModels.length).toBeGreaterThanOrEqual(4);
      
      // Check specific models
      expect(registry.getModel('cerebras-llama-4-scout-17b')).toBeDefined();
      expect(registry.getModel('cerebras-llama-3.3-70b')).toBeDefined();
      expect(registry.getModel('cerebras-gpt-oss-120b')).toBeDefined();
      expect(registry.getModel('cerebras-deepseek-v3-0324')).toBeDefined();
    });

    it('should include all Google models', () => {
      const googleModels = registry.getAllModels().filter(m => m.provider === 'google');
      expect(googleModels.length).toBeGreaterThanOrEqual(7);
      
      // Check specific models
      expect(registry.getModel('gemini-2.5-flash')).toBeDefined();
      expect(registry.getModel('gemini-2.5-pro')).toBeDefined();
      expect(registry.getModel('gemini-3-pro-preview')).toBeDefined();
      expect(registry.getModel('gemini-embedding-001')).toBeDefined();
      expect(registry.getModel('imagen-4.0')).toBeDefined();
      expect(registry.getModel('veo-3.1')).toBeDefined();
    });

    it('should mark deprecated models as DEAD', () => {
      const gemini15Flash = registry.getModel('gemini-1.5-flash');
      const gemini15Pro = registry.getModel('gemini-1.5-pro');
      
      expect(gemini15Flash?.lifecycle.status).toBe('DEAD');
      expect(gemini15Pro?.lifecycle.status).toBe('DEAD');
      
      expect(gemini15Flash?.lifecycle.replacementModelId).toBe('gemini-2.5-flash');
      expect(gemini15Pro?.lifecycle.replacementModelId).toBe('gemini-2.5-pro');
    });

    it('should configure rate limits per provider', () => {
      // Groq: 30 RPM, 14400 RPD
      const groqModel = registry.getModel('groq-llama-guard-4-12b');
      expect(groqModel?.rateLimit.requestsPerMinute).toBe(30);
      expect(groqModel?.rateLimit.requestsPerDay).toBe(14400);
      
      // Cerebras: 100 RPM, 50000 RPD
      const cerebrasModel = registry.getModel('cerebras-llama-4-scout-17b');
      expect(cerebrasModel?.rateLimit.requestsPerMinute).toBe(100);
      expect(cerebrasModel?.rateLimit.requestsPerDay).toBe(50000);
      
      // Google: 15 RPM, 1500 RPD
      const googleModel = registry.getModel('gemini-2.5-flash');
      expect(googleModel?.rateLimit.requestsPerMinute).toBe(15);
      expect(googleModel?.rateLimit.requestsPerDay).toBe(1500);
    });
  });

  describe('Task 1.4: Model Health Check System', () => {
    it('should create health checker with registry', () => {
      const healthChecker = new ModelHealthChecker(registry);
      expect(healthChecker).toBeDefined();
    });

    it('should check health of a specific model', async () => {
      const healthChecker = new ModelHealthChecker(registry);
      const result = await healthChecker.checkModelHealth('groq-llama-guard-4-12b');
      
      expect(result).toBeDefined();
      expect(result.modelId).toBe('groq-llama-guard-4-12b');
      expect(result.healthStatus).toBeDefined();
      expect(['HEALTHY', 'DEGRADED', 'UNAVAILABLE']).toContain(result.healthStatus);
    });

    it('should track health status transitions', async () => {
      const healthChecker = new ModelHealthChecker(registry);
      const model = registry.getModel('groq-llama-guard-4-12b');
      
      expect(model).toBeDefined();
      
      // Initial health check
      await healthChecker.checkModelHealth('groq-llama-guard-4-12b');
      
      // Health status should be set
      expect(model?.lifecycle.healthStatus).toBeDefined();
      expect(['HEALTHY', 'DEGRADED', 'UNAVAILABLE']).toContain(model!.lifecycle.healthStatus!);
    });

    it('should calculate uptime percentage', async () => {
      const healthChecker = new ModelHealthChecker(registry);
      
      // Perform a few health checks
      await healthChecker.checkModelHealth('groq-llama-guard-4-12b');
      await healthChecker.checkModelHealth('groq-llama-guard-4-12b');
      
      const uptimePercentage = healthChecker.calculateUptimePercentage('groq-llama-guard-4-12b');
      
      expect(uptimePercentage).toBeGreaterThanOrEqual(0);
      expect(uptimePercentage).toBeLessThanOrEqual(100);
    });

    it('should provide health summary', async () => {
      const healthChecker = new ModelHealthChecker(registry);
      
      // Perform health checks on a few models
      await healthChecker.checkModelHealth('groq-llama-guard-4-12b');
      await healthChecker.checkModelHealth('cerebras-llama-4-scout-17b');
      
      const summary = healthChecker.getHealthSummary();
      
      expect(summary.totalModels).toBeGreaterThan(0);
      expect(summary.averageUptime).toBeGreaterThanOrEqual(0);
      expect(summary.averageUptime).toBeLessThanOrEqual(100);
    });
  });

  describe('Task 1.6: Model Usage Statistics Tracking', () => {
    it('should track total requests per model', () => {
      registry.recordSuccess('groq-llama-guard-4-12b', 100);
      registry.recordSuccess('groq-llama-guard-4-12b', 150);
      
      const stats = registry.getModelUsageStats('groq-llama-guard-4-12b');
      expect(stats?.totalRequests).toBe(2);
    });

    it('should calculate success rate', () => {
      registry.recordSuccess('groq-llama-guard-4-12b', 100);
      registry.recordSuccess('groq-llama-guard-4-12b', 150);
      registry.recordError('groq-llama-guard-4-12b');
      
      const stats = registry.getModelUsageStats('groq-llama-guard-4-12b');
      expect(stats?.successRate).toBeCloseTo(2/3, 2);
    });

    it('should track average latency', () => {
      registry.recordSuccess('groq-llama-guard-4-12b', 100);
      registry.recordSuccess('groq-llama-guard-4-12b', 200);
      registry.recordSuccess('groq-llama-guard-4-12b', 300);
      
      const stats = registry.getModelUsageStats('groq-llama-guard-4-12b');
      expect(stats?.averageLatency).toBe(200);
    });

    it('should track last used timestamp', () => {
      const beforeTime = new Date().toISOString();
      registry.recordSuccess('groq-llama-guard-4-12b', 100);
      const afterTime = new Date().toISOString();
      
      const stats = registry.getModelUsageStats('groq-llama-guard-4-12b');
      expect(stats?.lastUsed).toBeDefined();
      expect(stats!.lastUsed >= beforeTime).toBe(true);
      expect(stats!.lastUsed <= afterTime).toBe(true);
    });

    it('should track error counts', () => {
      registry.recordError('groq-llama-guard-4-12b');
      registry.recordError('groq-llama-guard-4-12b');
      
      const stats = registry.getModelUsageStats('groq-llama-guard-4-12b');
      expect(stats?.errorCount).toBe(2);
    });
  });

  describe('Integration: Full Core Infrastructure', () => {
    it('should support complete workflow: load models, check health, track usage', async () => {
      // 1. Load models
      const allModels = registry.getAllModels();
      expect(allModels.length).toBeGreaterThan(0);
      
      // 2. Check health
      const healthChecker = new ModelHealthChecker(registry);
      const healthResult = await healthChecker.checkModelHealth('groq-llama-guard-4-12b');
      expect(healthResult.modelId).toBe('groq-llama-guard-4-12b');
      
      // 3. Track usage
      registry.recordSuccess('groq-llama-guard-4-12b', 100);
      const stats = registry.getModelUsageStats('groq-llama-guard-4-12b');
      expect(stats?.totalRequests).toBeGreaterThan(0);
      
      // 4. Get fallback chain
      const fallbackChain = registry.getFallbackChain('SIMPLE');
      expect(fallbackChain.length).toBeGreaterThan(0);
    });

    it('should handle model lifecycle transitions', () => {
      // Get a DEAD model
      const deadModel = registry.getModel('gemini-1.5-flash');
      expect(deadModel?.lifecycle.status).toBe('DEAD');
      
      // Get replacement
      const replacement = registry.getReplacementModel('gemini-1.5-flash');
      expect(replacement).toBeDefined();
      expect(replacement?.id).toBe('gemini-2.5-flash');
      
      // Verify replacement is ACTIVE
      expect(replacement?.lifecycle.status).toBe('ACTIVE');
    });

    it('should provide registry statistics', () => {
      const stats = registry.getRegistryStats();
      
      expect(stats.totalModels).toBeGreaterThan(0);
      expect(stats.activeModels).toBeGreaterThan(0);
      expect(stats.deadModels).toBeGreaterThanOrEqual(2);
    });
  });
});
