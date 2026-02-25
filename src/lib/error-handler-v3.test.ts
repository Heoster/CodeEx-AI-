/**
 * Error Handler V3 Tests
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Tests for error classification, recovery strategies, logging, and graceful messages.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  classifyError,
  getRecoveryStrategy,
  getGracefulErrorMessage,
  handleError,
  isRetryableError,
  shouldFallback,
  getErrorStatistics,
  resetErrorStatistics,
  ErrorCategory,
  ErrorSeverity,
  type ErrorContext
} from './error-handler-v3';

describe('Error Handler V3', () => {
  beforeEach(() => {
    resetErrorStatistics();
  });

  describe('classifyError', () => {
    it('should classify 503 as MODEL_UNAVAILABLE', () => {
      const error = { status: 503, message: 'Service unavailable' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.MODEL_UNAVAILABLE);
      expect(classified.severity).toBe(ErrorSeverity.MEDIUM);
      expect(classified.shouldFallback).toBe(true);
      expect(classified.shouldRetry).toBe(false);
    });

    it('should classify 502 as MODEL_UNAVAILABLE', () => {
      const error = { status: 502, message: 'Bad gateway' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.MODEL_UNAVAILABLE);
      expect(classified.shouldFallback).toBe(true);
    });

    it('should classify 504 as MODEL_UNAVAILABLE', () => {
      const error = { status: 504, message: 'Gateway timeout' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.MODEL_UNAVAILABLE);
      expect(classified.shouldFallback).toBe(true);
    });

    it('should classify 429 as RATE_LIMIT', () => {
      const error = { status: 429, message: 'Too many requests' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.RATE_LIMIT);
      expect(classified.severity).toBe(ErrorSeverity.MEDIUM);
      expect(classified.shouldFallback).toBe(true);
      expect(classified.shouldRetry).toBe(false);
    });

    it('should classify rate limit message as RATE_LIMIT', () => {
      const error = { message: 'Rate limit exceeded' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.RATE_LIMIT);
      expect(classified.shouldFallback).toBe(true);
    });

    it('should classify 401 as AUTH_ERROR', () => {
      const error = { status: 401, message: 'Unauthorized' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.AUTH_ERROR);
      expect(classified.severity).toBe(ErrorSeverity.HIGH);
      expect(classified.shouldFallback).toBe(true);
      expect(classified.shouldRetry).toBe(false);
    });

    it('should classify 403 as AUTH_ERROR', () => {
      const error = { status: 403, message: 'Forbidden' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.AUTH_ERROR);
      expect(classified.shouldFallback).toBe(true);
    });

    it('should classify timeout errors as TIMEOUT', () => {
      const error = { message: 'Request timed out' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.TIMEOUT);
      expect(classified.severity).toBe(ErrorSeverity.MEDIUM);
      expect(classified.shouldRetry).toBe(true);
      expect(classified.shouldFallback).toBe(true);
    });

    it('should classify safety violations as SAFETY_VIOLATION', () => {
      const error = { message: 'Safety violation detected' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.SAFETY_VIOLATION);
      expect(classified.severity).toBe(ErrorSeverity.HIGH);
      expect(classified.shouldRetry).toBe(false);
      expect(classified.shouldFallback).toBe(false);
    });

    it('should classify memory errors as MEMORY_SYSTEM', () => {
      const error = { message: 'Firestore connection failed' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.MEMORY_SYSTEM);
      expect(classified.severity).toBe(ErrorSeverity.LOW);
      expect(classified.shouldRetry).toBe(false);
      expect(classified.shouldFallback).toBe(false);
    });

    it('should classify config errors as INVALID_CONFIG', () => {
      const error = { message: 'Model not found in configuration' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.INVALID_CONFIG);
      expect(classified.severity).toBe(ErrorSeverity.MEDIUM);
      expect(classified.shouldFallback).toBe(true);
    });

    it('should classify all models failed as ALL_MODELS_FAILED', () => {
      const error = { message: 'All models in fallback chain failed' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.ALL_MODELS_FAILED);
      expect(classified.severity).toBe(ErrorSeverity.CRITICAL);
      expect(classified.shouldRetry).toBe(false);
      expect(classified.shouldFallback).toBe(false);
    });

    it('should include error context', () => {
      const error = { status: 503, message: 'Service unavailable' };
      const context: Partial<ErrorContext> = {
        requestId: 'req_123',
        userId: 'user_456',
        modelId: 'gemini-2.5-pro',
        provider: 'google',
        attemptNumber: 2
      };

      const classified = classifyError(error, context);

      expect(classified.context.requestId).toBe('req_123');
      expect(classified.context.userId).toBe('user_456');
      expect(classified.context.modelId).toBe('gemini-2.5-pro');
      expect(classified.context.provider).toBe('google');
      expect(classified.context.attemptNumber).toBe(2);
      expect(classified.context.timestamp).toBeDefined();
    });

    it('should provide user-friendly messages', () => {
      const error = { status: 503, message: 'Service unavailable' };
      const classified = classifyError(error);

      expect(classified.userMessage).toContain('temporarily unavailable');
      expect(classified.userMessage).toContain('alternative');
    });
  });

  describe('getRecoveryStrategy', () => {
    it('should return FALLBACK for MODEL_UNAVAILABLE', () => {
      const classified = classifyError({ status: 503, message: 'Service unavailable' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('FALLBACK');
      expect(strategy.message).toContain('backup model');
    });

    it('should return FALLBACK for RATE_LIMIT', () => {
      const classified = classifyError({ status: 429, message: 'Rate limit' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('FALLBACK');
      expect(strategy.message).toContain('alternative provider');
    });

    it('should return FALLBACK for AUTH_ERROR', () => {
      const classified = classifyError({ status: 401, message: 'Unauthorized' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('FALLBACK');
      expect(strategy.message).toContain('alternative');
    });

    it('should return RETRY for TIMEOUT', () => {
      const classified = classifyError({ message: 'Request timed out' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('RETRY');
      expect(strategy.delayMs).toBeDefined();
      expect(strategy.maxRetries).toBeDefined();
    });

    it('should return REJECT for SAFETY_VIOLATION', () => {
      const classified = classifyError({ message: 'Safety violation' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('REJECT');
      expect(strategy.message).toContain('safety violation');
    });

    it('should return DEGRADE for MEMORY_SYSTEM', () => {
      const classified = classifyError({ message: 'Memory system error' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('DEGRADE');
      expect(strategy.message).toContain('memory');
    });

    it('should return FALLBACK for INVALID_CONFIG', () => {
      const classified = classifyError({ message: 'Invalid configuration' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('FALLBACK');
      expect(strategy.message).toContain('default model');
    });

    it('should return REJECT for ALL_MODELS_FAILED', () => {
      const classified = classifyError({ message: 'All models failed' });
      const strategy = getRecoveryStrategy(classified);

      expect(strategy.action).toBe('REJECT');
      expect(strategy.message).toContain('unavailable');
    });
  });

  describe('getGracefulErrorMessage', () => {
    it('should provide retry suggestions for ALL_MODELS_FAILED', () => {
      const classified = classifyError({ message: 'All models failed' });
      const message = getGracefulErrorMessage(classified);

      expect(message).toContain('Suggestions');
      expect(message).toContain('try again');
      expect(message).toContain('Simplify');
    });

    it('should explain rate limits are temporary', () => {
      const classified = classifyError({ status: 429, message: 'Rate limit' });
      const message = getGracefulErrorMessage(classified);

      expect(message).toContain('temporary');
      expect(message).toContain('automatically');
    });

    it('should provide safety guidelines for violations', () => {
      const classified = classifyError({ message: 'Safety violation' });
      const message = getGracefulErrorMessage(classified);

      expect(message).toContain('ensure');
      expect(message).toContain('harmful content');
      expect(message).toContain('guidelines');
    });

    it('should suggest chunking for timeouts', () => {
      const classified = classifyError({ message: 'Request timed out' });
      const message = getGracefulErrorMessage(classified);

      expect(message).toContain('Breaking into smaller parts');
      expect(message).toContain('Simplifying');
    });
  });

  describe('handleError', () => {
    it('should classify, log, and provide recovery strategy', () => {
      const error = { status: 503, message: 'Service unavailable' };
      const context: Partial<ErrorContext> = {
        requestId: 'req_123',
        modelId: 'gemini-2.5-pro'
      };

      const result = handleError(error, context);

      expect(result.classified).toBeDefined();
      expect(result.classified.category).toBe(ErrorCategory.MODEL_UNAVAILABLE);
      expect(result.recovery).toBeDefined();
      expect(result.recovery.action).toBe('FALLBACK');
      expect(result.userMessage).toBeDefined();
      expect(result.userMessage).toContain('unavailable');
    });

    it('should record error in statistics', () => {
      const error = { status: 503, message: 'Service unavailable' };
      handleError(error, { modelId: 'test-model' });

      const stats = getErrorStatistics();
      const summary = stats.getSummary();

      expect(summary.totalErrors).toBe(1);
      expect(summary.byCategory[ErrorCategory.MODEL_UNAVAILABLE]).toBe(1);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for timeout errors', () => {
      const error = { message: 'Request timed out' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for rate limit errors', () => {
      const error = { status: 429, message: 'Rate limit' };
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return false for safety violations', () => {
      const error = { message: 'Safety violation' };
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('shouldFallback', () => {
    it('should return true for model unavailable errors', () => {
      const error = { status: 503, message: 'Service unavailable' };
      expect(shouldFallback(error)).toBe(true);
    });

    it('should return true for rate limit errors', () => {
      const error = { status: 429, message: 'Rate limit' };
      expect(shouldFallback(error)).toBe(true);
    });

    it('should return true for auth errors', () => {
      const error = { status: 401, message: 'Unauthorized' };
      expect(shouldFallback(error)).toBe(true);
    });

    it('should return false for safety violations', () => {
      const error = { message: 'Safety violation' };
      expect(shouldFallback(error)).toBe(false);
    });
  });

  describe('ErrorStatistics', () => {
    it('should track error counts by category', () => {
      handleError({ status: 503, message: 'Service unavailable' });
      handleError({ status: 429, message: 'Rate limit' });
      handleError({ status: 503, message: 'Service unavailable' });

      const stats = getErrorStatistics();
      const summary = stats.getSummary();

      expect(summary.totalErrors).toBe(3);
      expect(summary.byCategory[ErrorCategory.MODEL_UNAVAILABLE]).toBe(2);
      expect(summary.byCategory[ErrorCategory.RATE_LIMIT]).toBe(1);
    });

    it('should track errors by model', () => {
      handleError(
        { status: 503, message: 'Service unavailable' },
        { modelId: 'model-a' }
      );
      handleError(
        { status: 503, message: 'Service unavailable' },
        { modelId: 'model-a' }
      );
      handleError(
        { status: 503, message: 'Service unavailable' },
        { modelId: 'model-b' }
      );

      const stats = getErrorStatistics();
      const summary = stats.getSummary();

      expect(summary.byModel['model-a']).toBe(2);
      expect(summary.byModel['model-b']).toBe(1);
    });

    it('should track errors by provider', () => {
      handleError(
        { status: 503, message: 'Service unavailable' },
        { provider: 'google' }
      );
      handleError(
        { status: 503, message: 'Service unavailable' },
        { provider: 'google' }
      );
      handleError(
        { status: 503, message: 'Service unavailable' },
        { provider: 'groq' }
      );

      const stats = getErrorStatistics();
      const summary = stats.getSummary();

      expect(summary.byProvider['google']).toBe(2);
      expect(summary.byProvider['groq']).toBe(1);
    });

    it('should calculate error rate for models', () => {
      const stats = getErrorStatistics();
      
      handleError({ status: 503, message: 'Error' }, { modelId: 'test-model' });
      handleError({ status: 503, message: 'Error' }, { modelId: 'test-model' });

      const errorRate = stats.getModelErrorRate('test-model', 10);
      expect(errorRate).toBe(0.2); // 2 errors out of 10 requests
    });

    it('should alert when error rate exceeds threshold', () => {
      const stats = getErrorStatistics();
      
      // 6 errors out of 10 requests = 60% error rate
      for (let i = 0; i < 6; i++) {
        handleError({ status: 503, message: 'Error' }, { modelId: 'test-model' });
      }

      expect(stats.shouldAlert('test-model', 10, 0.05)).toBe(true); // Above 5% threshold
    });

    it('should not alert when error rate is below threshold', () => {
      const stats = getErrorStatistics();
      
      // 1 error out of 100 requests = 1% error rate
      handleError({ status: 503, message: 'Error' }, { modelId: 'test-model' });

      expect(stats.shouldAlert('test-model', 100, 0.05)).toBe(false); // Below 5% threshold
    });

    it('should track recent errors', () => {
      for (let i = 0; i < 5; i++) {
        handleError({ status: 503, message: `Error ${i}` });
      }

      const stats = getErrorStatistics();
      const recent = stats.getRecentErrors(3);

      expect(recent.length).toBe(3);
      expect(recent[2].originalError?.message).toContain('Error 4');
    });

    it('should reset statistics', () => {
      handleError({ status: 503, message: 'Error' });
      
      const stats = getErrorStatistics();
      stats.reset();
      
      const summary = stats.getSummary();
      expect(summary.totalErrors).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors without status codes', () => {
      const error = { message: 'Something went wrong' };
      const classified = classifyError(error);

      expect(classified.category).toBe(ErrorCategory.UNKNOWN);
      expect(classified.userMessage).toBeDefined();
    });

    it('should handle errors without messages', () => {
      const error = { status: 500 };
      const classified = classifyError(error);

      expect(classified.message).toBeDefined();
      expect(classified.userMessage).toBeDefined();
    });

    it('should handle null/undefined errors', () => {
      const classified = classifyError(null);

      expect(classified.category).toBe(ErrorCategory.UNKNOWN);
      expect(classified.userMessage).toBeDefined();
    });

    it('should handle errors with additional context', () => {
      const error = { status: 503, message: 'Service unavailable' };
      const context: Partial<ErrorContext> = {
        additionalInfo: {
          region: 'us-east-1',
          retryCount: 3,
          customField: 'test'
        }
      };

      const classified = classifyError(error, context);

      expect(classified.context.additionalInfo).toBeDefined();
      expect(classified.context.additionalInfo?.region).toBe('us-east-1');
      expect(classified.context.additionalInfo?.retryCount).toBe(3);
    });
  });
});
