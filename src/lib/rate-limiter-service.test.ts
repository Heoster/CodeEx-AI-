/**
 * Tests for Rate Limiter Service - Provider Utilization Monitoring
 * 
 * Tests the new monitoring features added in task 7.4:
 * - Historical peak usage tracking
 * - Comprehensive statistics report generation
 * - Alerting at 80% utilization threshold
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getRateLimiterService, resetRateLimiterService } from './rate-limiter-service';
import type { ProviderType } from './model-config-v3.3';

describe('Rate Limiter Service - Provider Utilization Monitoring', () => {
  beforeEach(() => {
    resetRateLimiterService();
  });

  afterEach(() => {
    resetRateLimiterService();
  });

  describe('Peak Usage Time Tracking', () => {
    it('should track historical peak usage times', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'groq';

      // Simulate high utilization by recording many requests
      // Groq limit is 30 RPM, so 25+ requests = >80% utilization
      for (let i = 0; i < 25; i++) {
        service.recordRequest(provider);
      }

      const stats = service.getProviderStats(provider);
      
      // Should have recorded peak usage times
      expect(stats.peakUsageTimes).toBeDefined();
      expect(stats.peakUsageTimes.length).toBeGreaterThan(0);
      expect(stats.utilizationRate).toBeGreaterThanOrEqual(0.8);
    });

    it('should limit historical peak times to 100 entries', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'cerebras';

      // Simulate 150 high utilization events
      // Cerebras limit is 100 RPM, so 81+ requests = >80% utilization
      for (let i = 0; i < 150; i++) {
        service.recordRequest(provider);
      }

      const stats = service.getProviderStats(provider);
      
      // Should cap at 100 entries
      expect(stats.peakUsageTimes.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Statistics Report Generation', () => {
    it('should generate comprehensive statistics report', () => {
      const service = getRateLimiterService();

      // Record some requests across providers
      service.recordRequest('groq');
      service.recordRequest('google');
      service.recordRequest('cerebras');

      const report = service.generateStatisticsReport();

      // Verify report structure
      expect(report.generatedAt).toBeDefined();
      expect(report.providers).toHaveLength(5); // All 5 providers
      expect(report.alerts).toBeDefined();
      expect(report.summary).toBeDefined();

      // Verify summary
      expect(report.summary.totalRequests).toBe(3);
      expect(report.summary.totalThrottled).toBe(0);
      expect(report.summary.averageUtilization).toBeGreaterThanOrEqual(0);
      expect(report.summary.highestUtilization).toBeDefined();
      expect(report.summary.highestUtilization.provider).toBeDefined();
      expect(report.summary.highestUtilization.rate).toBeGreaterThanOrEqual(0);
    });

    it('should include alerts for high utilization providers', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'groq';

      // Push Groq to >80% utilization (30 RPM limit)
      for (let i = 0; i < 25; i++) {
        service.recordRequest(provider);
      }

      const report = service.generateStatisticsReport();

      // Should have at least one alert
      expect(report.alerts.length).toBeGreaterThan(0);
      
      // Find the Groq alert
      const groqAlert = report.alerts.find(a => a.provider === 'groq');
      expect(groqAlert).toBeDefined();
      expect(groqAlert?.utilizationRate).toBeGreaterThanOrEqual(0.8);
      expect(groqAlert?.message).toContain('80%');
    });

    it('should track highest utilization provider', () => {
      const service = getRateLimiterService();

      // Make Google the highest utilization (15 RPM limit)
      for (let i = 0; i < 13; i++) {
        service.recordRequest('google');
      }

      // Add some requests to other providers
      service.recordRequest('groq');
      service.recordRequest('cerebras');

      const report = service.generateStatisticsReport();

      // Google should have highest utilization
      expect(report.summary.highestUtilization.provider).toBe('google');
      expect(report.summary.highestUtilization.rate).toBeGreaterThan(0.8);
    });
  });

  describe('Utilization Rate Calculation', () => {
    it('should calculate utilization rate correctly', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'groq';

      // Groq has 30 RPM limit
      // 15 requests = 50% utilization
      for (let i = 0; i < 15; i++) {
        service.recordRequest(provider);
      }

      const utilization = service.calculateUtilizationRate(provider);
      expect(utilization).toBeCloseTo(0.5, 1);
    });

    it('should return 0-1 range for utilization rate', () => {
      const service = getRateLimiterService();
      const providers: ProviderType[] = ['groq', 'google', 'cerebras', 'huggingface', 'elevenlabs'];

      for (const provider of providers) {
        const utilization = service.calculateUtilizationRate(provider);
        expect(utilization).toBeGreaterThanOrEqual(0);
        expect(utilization).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Utilization Alerts', () => {
    it('should alert when provider exceeds 80% threshold', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'groq';

      // Push to 90% utilization (27 out of 30 RPM)
      for (let i = 0; i < 27; i++) {
        service.recordRequest(provider);
      }

      const alerts = service.checkUtilizationAlerts(0.8);
      
      expect(alerts.has('groq')).toBe(true);
      expect(alerts.get('groq')).toBeGreaterThanOrEqual(0.8);
    });

    it('should not alert when below threshold', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'groq';

      // Only 50% utilization (15 out of 30 RPM)
      for (let i = 0; i < 15; i++) {
        service.recordRequest(provider);
      }

      const alerts = service.checkUtilizationAlerts(0.8);
      
      expect(alerts.has('groq')).toBe(false);
    });

    it('should support custom threshold', () => {
      const service = getRateLimiterService();
      const provider: ProviderType = 'groq';

      // 60% utilization (18 out of 30 RPM)
      for (let i = 0; i < 18; i++) {
        service.recordRequest(provider);
      }

      // Should not alert at 80% threshold
      const alerts80 = service.checkUtilizationAlerts(0.8);
      expect(alerts80.has('groq')).toBe(false);

      // Should alert at 50% threshold
      const alerts50 = service.checkUtilizationAlerts(0.5);
      expect(alerts50.has('groq')).toBe(true);
    });
  });
});
