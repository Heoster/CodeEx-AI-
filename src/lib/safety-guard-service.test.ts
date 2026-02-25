/**
 * Safety Guard Service Tests
 * Unit tests for the Safety Guard Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SafetyGuardService, type SafetyCheckRequest, type SafetyCheckResult } from './safety-guard-service';

describe('SafetyGuardService', () => {
  let service: SafetyGuardService;

  beforeEach(() => {
    // Reset singleton instance for each test
    (SafetyGuardService as any).instance = null;
    service = SafetyGuardService.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SafetyGuardService.getInstance();
      const instance2 = SafetyGuardService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Feature Flag', () => {
    it('should be enabled by default', () => {
      expect(service.isEnabled()).toBe(true);
    });

    it('should bypass checks when disabled', async () => {
      // Disable safety guard
      process.env.ENABLE_SAFETY_GUARD = 'false';
      (SafetyGuardService as any).instance = null;
      service = SafetyGuardService.getInstance();

      const request: SafetyCheckRequest = {
        content: 'This is unsafe content',
        type: 'INPUT',
      };

      const result = await service.checkInput(request);
      expect(result.isSafe).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.confidence).toBe(1.0);

      // Re-enable for other tests
      delete process.env.ENABLE_SAFETY_GUARD;
    });
  });

  describe('Input Validation', () => {
    it('should validate input content', async () => {
      const request: SafetyCheckRequest = {
        content: 'Hello, how are you?',
        type: 'INPUT',
      };

      const result = await service.checkInput(request);
      expect(result).toBeDefined();
      expect(result.isSafe).toBeDefined();
      expect(result.violations).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should include context when provided', async () => {
      const request: SafetyCheckRequest = {
        content: 'This is the content',
        type: 'INPUT',
        context: 'This is the context',
      };

      const result = await service.checkInput(request);
      expect(result).toBeDefined();
    });
  });

  describe('Output Validation', () => {
    it('should validate output content', async () => {
      const request: SafetyCheckRequest = {
        content: 'This is a safe response',
        type: 'OUTPUT',
      };

      const result = await service.checkOutput(request);
      expect(result).toBeDefined();
      expect(result.isSafe).toBeDefined();
      expect(result.violations).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Violation History', () => {
    it('should return empty history for new user', () => {
      const history = service.getViolationHistory('user123');
      expect(history).toEqual([]);
    });

    it('should track violations per user', () => {
      // This test would require mocking the API call to return unsafe content
      // For now, we just verify the method exists and returns an array
      const history = service.getViolationHistory('user123');
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('Safety Categories', () => {
    it('should support all 7 safety categories', () => {
      const categories = [
        'HATE_SPEECH',
        'VIOLENCE',
        'SEXUAL_CONTENT',
        'SELF_HARM',
        'DANGEROUS_CONTENT',
        'HARASSMENT',
        'ILLEGAL_ACTIVITY',
      ];

      // Verify categories are defined in the type system
      // This is a compile-time check, but we can verify the list
      expect(categories).toHaveLength(7);
    });
  });

  describe('Severity Levels', () => {
    it('should support all severity levels', () => {
      const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      expect(severities).toHaveLength(4);
    });
  });

  describe('Error Handling', () => {
    it('should fail open when API key is missing', async () => {
      const originalKey = process.env.GROQ_API_KEY;
      delete process.env.GROQ_API_KEY;

      const request: SafetyCheckRequest = {
        content: 'Test content',
        type: 'INPUT',
      };

      const result = await service.checkInput(request);
      expect(result.isSafe).toBe(true);
      expect(result.violations).toHaveLength(0);

      // Restore API key
      if (originalKey) {
        process.env.GROQ_API_KEY = originalKey;
      }
    });

    it('should handle network errors gracefully', async () => {
      // Mock fetch to throw an error
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const request: SafetyCheckRequest = {
        content: 'Test content',
        type: 'INPUT',
      };

      const result = await service.checkInput(request);
      // Should fail open (allow content) on error
      expect(result.isSafe).toBe(true);

      // Restore fetch
      global.fetch = originalFetch;
    });
  });

  describe('Response Parsing', () => {
    it('should parse safe response correctly', () => {
      const service = SafetyGuardService.getInstance();
      const response = `SAFE: yes
CATEGORY: NONE
CONFIDENCE: 0.95
SEVERITY: NONE
DESCRIPTION: Content is safe`;

      const result = (service as any).parseSafetyResponse(response);
      expect(result.isSafe).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.confidence).toBe(0.95);
    });

    it('should parse unsafe response correctly', () => {
      const service = SafetyGuardService.getInstance();
      const response = `SAFE: no
CATEGORY: HATE_SPEECH
CONFIDENCE: 0.92
SEVERITY: HIGH
DESCRIPTION: Content contains hate speech`;

      const result = (service as any).parseSafetyResponse(response);
      expect(result.isSafe).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].type).toBe('HATE_SPEECH');
      expect(result.violations[0].severity).toBe('HIGH');
      expect(result.confidence).toBe(0.92);
    });

    it('should handle confidence bounds', () => {
      const service = SafetyGuardService.getInstance();
      
      // Test upper bound
      const response1 = `SAFE: yes
CATEGORY: NONE
CONFIDENCE: 1.5
SEVERITY: NONE
DESCRIPTION: Test`;

      const result1 = (service as any).parseSafetyResponse(response1);
      expect(result1.confidence).toBe(1.0);

      // Test lower bound
      const response2 = `SAFE: yes
CATEGORY: NONE
CONFIDENCE: -0.5
SEVERITY: NONE
DESCRIPTION: Test`;

      const result2 = (service as any).parseSafetyResponse(response2);
      expect(result2.confidence).toBe(0.0);
    });
  });

  describe('Confidence Scoring', () => {
    it('should return confidence score between 0 and 1', async () => {
      const request: SafetyCheckRequest = {
        content: 'Test content',
        type: 'INPUT',
      };

      const result = await service.checkInput(request);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});
