/**
 * Error Handler V3
 * CODEEX V3.3 Multi-Model AI Router
 * 
 * Enhanced error handling and recovery for the multi-model router system.
 * Handles model unavailable errors, rate limits, authentication failures, timeouts,
 * and provides graceful error messages with comprehensive logging.
 * 
 * Requirements: 12.1-12.10
 */

import type { ProviderType } from './model-config-v3.3';
import type { TaskCategory } from './model-registry-v3';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',      // 503, 502, 504
  RATE_LIMIT = 'RATE_LIMIT',                    // 429
  AUTH_ERROR = 'AUTH_ERROR',                    // 401, 403
  TIMEOUT = 'TIMEOUT',                          // Timeout errors
  SAFETY_VIOLATION = 'SAFETY_VIOLATION',        // Safety check failures
  MEMORY_SYSTEM = 'MEMORY_SYSTEM',              // Memory system failures
  INVALID_CONFIG = 'INVALID_CONFIG',            // Configuration errors
  ALL_MODELS_FAILED = 'ALL_MODELS_FAILED',      // Complete fallback chain failure
  CONTEXT_TOO_LONG = 'CONTEXT_TOO_LONG',        // Context window exceeded
  UNKNOWN = 'UNKNOWN'                           // Unclassified errors
}

/**
 * Error context for logging and debugging
 */
export interface ErrorContext {
  requestId?: string;
  userId?: string;
  modelId?: string;
  provider?: ProviderType;
  category?: TaskCategory;
  attemptNumber?: number;
  timestamp: string;
  additionalInfo?: Record<string, any>;
}

/**
 * Classified error with metadata
 */
export interface ClassifiedError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  shouldRetry: boolean;
  shouldFallback: boolean;
  context: ErrorContext;
  originalError?: Error;
}

/**
 * Error recovery strategy
 */
export interface RecoveryStrategy {
  action: 'RETRY' | 'FALLBACK' | 'QUEUE' | 'REJECT' | 'DEGRADE';
  delayMs?: number;
  maxRetries?: number;
  fallbackProvider?: ProviderType;
  message?: string;
}

// ============================================================================
// Error Classification
// ============================================================================

/**
 * Classify error and determine appropriate handling
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */
export function classifyError(error: any, context: Partial<ErrorContext> = {}): ClassifiedError {
  const timestamp = new Date().toISOString();
  const fullContext: ErrorContext = {
    ...context,
    timestamp
  };

  const message = error?.message?.toLowerCase() || '';
  const status = error?.status || error?.statusCode || 0;

  // Model unavailable errors (503, 502, 504) - Requirement 12.1
  if (status === 503 || status === 502 || status === 504 || 
      message.includes('service unavailable') || message.includes('bad gateway')) {
    return {
      category: ErrorCategory.MODEL_UNAVAILABLE,
      severity: ErrorSeverity.MEDIUM,
      message: `Model unavailable (${status}): ${error?.message || 'Service temporarily unavailable'}`,
      userMessage: 'The AI model is temporarily unavailable. Trying an alternative model...',
      shouldRetry: false,
      shouldFallback: true,
      context: fullContext,
      originalError: error
    };
  }

  // Rate limit errors (429) - Requirement 12.2
  if (status === 429 || message.includes('rate limit') || message.includes('too many requests')) {
    return {
      category: ErrorCategory.RATE_LIMIT,
      severity: ErrorSeverity.MEDIUM,
      message: `Rate limit exceeded: ${error?.message || 'Too many requests'}`,
      userMessage: 'Request rate limit reached. Switching to an alternative provider...',
      shouldRetry: false,
      shouldFallback: true,
      context: fullContext,
      originalError: error
    };
  }

  // Authentication errors (401, 403) - Requirement 12.3
  if (status === 401 || status === 403 || 
      message.includes('unauthorized') || message.includes('forbidden') || 
      message.includes('authentication') || message.includes('api key')) {
    return {
      category: ErrorCategory.AUTH_ERROR,
      severity: ErrorSeverity.HIGH,
      message: `Authentication failed (${status}): ${error?.message || 'Invalid credentials'}`,
      userMessage: 'Authentication issue with the AI provider. Trying an alternative...',
      shouldRetry: false,
      shouldFallback: true,
      context: fullContext,
      originalError: error
    };
  }

  // Timeout errors - Requirement 12.4
  if (message.includes('timeout') || message.includes('timed out') || 
      message.includes('deadline') || message.includes('aborted')) {
    return {
      category: ErrorCategory.TIMEOUT,
      severity: ErrorSeverity.MEDIUM,
      message: `Request timeout: ${error?.message || 'Operation timed out'}`,
      userMessage: 'Request took too long. Retrying with extended timeout...',
      shouldRetry: true,
      shouldFallback: true,
      context: fullContext,
      originalError: error
    };
  }

  // Safety violation errors - Requirement 12.6
  if (message.includes('safety') || message.includes('violation') || 
      message.includes('inappropriate') || message.includes('blocked')) {
    return {
      category: ErrorCategory.SAFETY_VIOLATION,
      severity: ErrorSeverity.HIGH,
      message: `Safety violation: ${error?.message || 'Content blocked by safety filters'}`,
      userMessage: 'Your request was blocked by our safety filters. Please rephrase and try again.',
      shouldRetry: false,
      shouldFallback: false,
      context: fullContext,
      originalError: error
    };
  }

  // Memory system errors - Requirement 12.7
  if (message.includes('memory') || message.includes('firestore') || 
      message.includes('embedding') || message.includes('vector')) {
    return {
      category: ErrorCategory.MEMORY_SYSTEM,
      severity: ErrorSeverity.LOW,
      message: `Memory system error: ${error?.message || 'Memory service unavailable'}`,
      userMessage: 'Continuing without personalized context...',
      shouldRetry: false,
      shouldFallback: false,
      context: fullContext,
      originalError: error
    };
  }

  // Invalid configuration errors - Requirement 12.8
  if (message.includes('configuration') || message.includes('not found') || 
      message.includes('invalid model') || message.includes('misconfigured')) {
    return {
      category: ErrorCategory.INVALID_CONFIG,
      severity: ErrorSeverity.MEDIUM,
      message: `Configuration error: ${error?.message || 'Invalid model configuration'}`,
      userMessage: 'Model configuration issue. Using default model...',
      shouldRetry: false,
      shouldFallback: true,
      context: fullContext,
      originalError: error
    };
  }

  // All models failed - Requirement 12.5
  if (message.includes('all models') || message.includes('fallback chain') || 
      message.includes('exhausted')) {
    return {
      category: ErrorCategory.ALL_MODELS_FAILED,
      severity: ErrorSeverity.CRITICAL,
      message: `All models failed: ${error?.message || 'Complete fallback chain exhausted'}`,
      userMessage: 'All AI models are currently unavailable. Please try again in a few moments.',
      shouldRetry: false,
      shouldFallback: false,
      context: fullContext,
      originalError: error
    };
  }

  // Context too long
  if (message.includes('context') || message.includes('token limit') || 
      message.includes('too long') || message.includes('exceeds')) {
    return {
      category: ErrorCategory.CONTEXT_TOO_LONG,
      severity: ErrorSeverity.MEDIUM,
      message: `Context too long: ${error?.message || 'Request exceeds context window'}`,
      userMessage: 'Your request is too long. Attempting to process in chunks...',
      shouldRetry: false,
      shouldFallback: false,
      context: fullContext,
      originalError: error
    };
  }

  // Unknown errors
  return {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: `Unknown error: ${error?.message || 'An unexpected error occurred'}`,
    userMessage: 'An unexpected error occurred. Trying an alternative approach...',
    shouldRetry: true,
    shouldFallback: true,
    context: fullContext,
    originalError: error
  };
}

// ============================================================================
// Recovery Strategies
// ============================================================================

/**
 * Determine recovery strategy based on error classification
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8
 */
export function getRecoveryStrategy(classifiedError: ClassifiedError): RecoveryStrategy {
  switch (classifiedError.category) {
    case ErrorCategory.MODEL_UNAVAILABLE:
      // Requirement 12.1: Automatic fallback without user notification
      return {
        action: 'FALLBACK',
        message: 'Automatically switching to backup model'
      };

    case ErrorCategory.RATE_LIMIT:
      // Requirement 12.2: Queue or fallback to different provider
      return {
        action: 'FALLBACK',
        message: 'Switching to alternative provider due to rate limit'
      };

    case ErrorCategory.AUTH_ERROR:
      // Requirement 12.3: Mark provider unavailable and fallback
      return {
        action: 'FALLBACK',
        message: 'Provider authentication failed, using alternative'
      };

    case ErrorCategory.TIMEOUT:
      // Requirement 12.4: Retry with increased timeout or fallback
      return {
        action: 'RETRY',
        delayMs: 1000,
        maxRetries: 1,
        message: 'Retrying with extended timeout'
      };

    case ErrorCategory.SAFETY_VIOLATION:
      // Requirement 12.6: Reject immediately without retry
      return {
        action: 'REJECT',
        message: 'Request rejected due to safety violation'
      };

    case ErrorCategory.MEMORY_SYSTEM:
      // Requirement 12.7: Continue without memory injection
      return {
        action: 'DEGRADE',
        message: 'Continuing without personalized memory'
      };

    case ErrorCategory.INVALID_CONFIG:
      // Requirement 12.8: Fallback to category default
      return {
        action: 'FALLBACK',
        message: 'Using default model for category'
      };

    case ErrorCategory.ALL_MODELS_FAILED:
      // Requirement 12.5: Graceful error with retry suggestion
      return {
        action: 'REJECT',
        message: 'All models unavailable, please retry later'
      };

    case ErrorCategory.CONTEXT_TOO_LONG:
      return {
        action: 'DEGRADE',
        message: 'Processing request in chunks'
      };

    default:
      return {
        action: 'FALLBACK',
        delayMs: 500,
        message: 'Attempting alternative approach'
      };
  }
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Log error with comprehensive context
 * Requirements: 12.9
 */
export function logError(classifiedError: ClassifiedError): void {
  const logEntry = {
    timestamp: classifiedError.context.timestamp,
    category: classifiedError.category,
    severity: classifiedError.severity,
    message: classifiedError.message,
    context: {
      requestId: classifiedError.context.requestId,
      userId: classifiedError.context.userId,
      modelId: classifiedError.context.modelId,
      provider: classifiedError.context.provider,
      taskCategory: classifiedError.context.category,
      attemptNumber: classifiedError.context.attemptNumber,
      ...classifiedError.context.additionalInfo
    },
    shouldRetry: classifiedError.shouldRetry,
    shouldFallback: classifiedError.shouldFallback,
    stack: classifiedError.originalError?.stack
  };

  // Log based on severity
  switch (classifiedError.severity) {
    case ErrorSeverity.CRITICAL:
      console.error('[CRITICAL ERROR]', logEntry);
      // TODO: Send to monitoring/alerting system
      break;
    case ErrorSeverity.HIGH:
      console.error('[HIGH ERROR]', logEntry);
      break;
    case ErrorSeverity.MEDIUM:
      console.warn('[MEDIUM ERROR]', logEntry);
      break;
    case ErrorSeverity.LOW:
      console.log('[LOW ERROR]', logEntry);
      break;
  }

  // Log to structured logging system in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to external logging service (e.g., Datadog, Sentry)
  }
}

// ============================================================================
// Graceful Error Messages
// ============================================================================

/**
 * Generate user-friendly error message with retry suggestions
 * Requirements: 12.5
 */
export function getGracefulErrorMessage(classifiedError: ClassifiedError): string {
  const baseMessage = classifiedError.userMessage;

  // Add retry suggestion for appropriate errors
  if (classifiedError.category === ErrorCategory.ALL_MODELS_FAILED) {
    return `${baseMessage}\n\nSuggestions:\n• Wait a few moments and try again\n• Simplify your request\n• Check your internet connection`;
  }

  if (classifiedError.category === ErrorCategory.RATE_LIMIT) {
    return `${baseMessage}\n\nThis is temporary and will resolve automatically.`;
  }

  if (classifiedError.category === ErrorCategory.SAFETY_VIOLATION) {
    return `${baseMessage}\n\nPlease ensure your request:\n• Does not contain harmful content\n• Follows our usage guidelines\n• Is appropriate for all audiences`;
  }

  if (classifiedError.category === ErrorCategory.TIMEOUT) {
    return `${baseMessage}\n\nFor large requests, consider:\n• Breaking into smaller parts\n• Simplifying the query\n• Trying again in a moment`;
  }

  return baseMessage;
}

// ============================================================================
// Error Statistics
// ============================================================================

/**
 * Error statistics tracker
 */
class ErrorStatistics {
  private errorCounts: Map<ErrorCategory, number> = new Map();
  private errorsByModel: Map<string, number> = new Map();
  private errorsByProvider: Map<ProviderType, number> = new Map();
  private recentErrors: ClassifiedError[] = [];
  private maxRecentErrors = 100;

  /**
   * Record an error occurrence
   */
  recordError(classifiedError: ClassifiedError): void {
    // Update category counts
    const categoryCount = this.errorCounts.get(classifiedError.category) || 0;
    this.errorCounts.set(classifiedError.category, categoryCount + 1);

    // Update model counts
    if (classifiedError.context.modelId) {
      const modelCount = this.errorsByModel.get(classifiedError.context.modelId) || 0;
      this.errorsByModel.set(classifiedError.context.modelId, modelCount + 1);
    }

    // Update provider counts
    if (classifiedError.context.provider) {
      const providerCount = this.errorsByProvider.get(classifiedError.context.provider) || 0;
      this.errorsByProvider.set(classifiedError.context.provider, providerCount + 1);
    }

    // Add to recent errors
    this.recentErrors.push(classifiedError);
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors.shift();
    }
  }

  /**
   * Get error rate for a specific model
   * Requirements: 12.10
   */
  getModelErrorRate(modelId: string, totalRequests: number): number {
    const errors = this.errorsByModel.get(modelId) || 0;
    return totalRequests > 0 ? errors / totalRequests : 0;
  }

  /**
   * Check if error rate exceeds threshold
   * Requirements: 12.10
   */
  shouldAlert(modelId: string, totalRequests: number, threshold: number = 0.05): boolean {
    const errorRate = this.getModelErrorRate(modelId, totalRequests);
    return errorRate > threshold;
  }

  /**
   * Get error statistics summary
   */
  getSummary(): {
    totalErrors: number;
    byCategory: Record<string, number>;
    byModel: Record<string, number>;
    byProvider: Record<string, number>;
    recentErrorCount: number;
  } {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);

    return {
      totalErrors,
      byCategory: Object.fromEntries(this.errorCounts),
      byModel: Object.fromEntries(this.errorsByModel),
      byProvider: Object.fromEntries(this.errorsByProvider),
      recentErrorCount: this.recentErrors.length
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): ClassifiedError[] {
    return this.recentErrors.slice(-limit);
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.errorCounts.clear();
    this.errorsByModel.clear();
    this.errorsByProvider.clear();
    this.recentErrors = [];
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let errorStatisticsInstance: ErrorStatistics | null = null;

/**
 * Get singleton instance of ErrorStatistics
 */
export function getErrorStatistics(): ErrorStatistics {
  if (!errorStatisticsInstance) {
    errorStatisticsInstance = new ErrorStatistics();
  }
  return errorStatisticsInstance;
}

/**
 * Reset error statistics (for testing)
 */
export function resetErrorStatistics(): void {
  errorStatisticsInstance = null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Handle error with full classification, logging, and recovery
 */
export function handleError(
  error: any,
  context: Partial<ErrorContext> = {}
): {
  classified: ClassifiedError;
  recovery: RecoveryStrategy;
  userMessage: string;
} {
  // Classify the error
  const classified = classifyError(error, context);

  // Log the error
  logError(classified);

  // Record statistics
  getErrorStatistics().recordError(classified);

  // Get recovery strategy
  const recovery = getRecoveryStrategy(classified);

  // Get user-friendly message
  const userMessage = getGracefulErrorMessage(classified);

  return {
    classified,
    recovery,
    userMessage
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const classified = classifyError(error);
  return classified.shouldRetry;
}

/**
 * Check if error should trigger fallback
 */
export function shouldFallback(error: any): boolean {
  const classified = classifyError(error);
  return classified.shouldFallback;
}
