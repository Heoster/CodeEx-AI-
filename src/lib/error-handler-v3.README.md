# Error Handler V3 - CODEEX V3.3 Multi-Model AI Router

## Overview

The Error Handler V3 provides comprehensive error handling and recovery for the CODEEX V3.3 Multi-Model AI Router. It classifies errors, determines recovery strategies, provides graceful user messages, and tracks error statistics for monitoring and alerting.

## Features

- **Error Classification**: Automatically classifies errors into 10 categories
- **Recovery Strategies**: Determines appropriate recovery actions (RETRY, FALLBACK, QUEUE, REJECT, DEGRADE)
- **Graceful Messages**: Provides user-friendly error messages with actionable suggestions
- **Comprehensive Logging**: Logs errors with full context and severity levels
- **Error Statistics**: Tracks error rates per model, provider, and category
- **Alerting**: Monitors error rates and alerts when thresholds are exceeded

## Error Categories

### 1. MODEL_UNAVAILABLE (503, 502, 504)
**Severity**: MEDIUM  
**Recovery**: FALLBACK  
**User Message**: "The AI model is temporarily unavailable. Trying an alternative model..."

Triggered by:
- HTTP status codes: 503, 502, 504
- Messages containing: "service unavailable", "bad gateway"

### 2. RATE_LIMIT (429)
**Severity**: MEDIUM  
**Recovery**: FALLBACK  
**User Message**: "Request rate limit reached. Switching to an alternative provider..."

Triggered by:
- HTTP status code: 429
- Messages containing: "rate limit", "too many requests"

### 3. AUTH_ERROR (401, 403)
**Severity**: HIGH  
**Recovery**: FALLBACK  
**User Message**: "Authentication issue with the AI provider. Trying an alternative..."

Triggered by:
- HTTP status codes: 401, 403
- Messages containing: "unauthorized", "forbidden", "authentication", "api key"

### 4. TIMEOUT
**Severity**: MEDIUM  
**Recovery**: RETRY (with increased timeout)  
**User Message**: "Request took too long. Retrying with extended timeout..."

Triggered by:
- Messages containing: "timeout", "timed out", "deadline", "aborted"

### 5. SAFETY_VIOLATION
**Severity**: HIGH  
**Recovery**: REJECT (no retry)  
**User Message**: "Your request was blocked by our safety filters. Please rephrase and try again."

Triggered by:
- Messages containing: "safety", "violation", "inappropriate", "blocked"

### 6. MEMORY_SYSTEM
**Severity**: LOW  
**Recovery**: DEGRADE (continue without memory)  
**User Message**: "Continuing without personalized context..."

Triggered by:
- Messages containing: "memory", "firestore", "embedding", "vector"

### 7. INVALID_CONFIG
**Severity**: MEDIUM  
**Recovery**: FALLBACK (to default model)  
**User Message**: "Model configuration issue. Using default model..."

Triggered by:
- Messages containing: "configuration", "not found", "invalid model", "misconfigured"

### 8. ALL_MODELS_FAILED
**Severity**: CRITICAL  
**Recovery**: REJECT  
**User Message**: "All AI models are currently unavailable. Please try again in a few moments."

Triggered by:
- Messages containing: "all models", "fallback chain", "exhausted"

### 9. CONTEXT_TOO_LONG
**Severity**: MEDIUM  
**Recovery**: DEGRADE (chunk processing)  
**User Message**: "Your request is too long. Attempting to process in chunks..."

Triggered by:
- Messages containing: "context", "token limit", "too long", "exceeds"

### 10. UNKNOWN
**Severity**: MEDIUM  
**Recovery**: FALLBACK  
**User Message**: "An unexpected error occurred. Trying an alternative approach..."

Triggered by:
- Any error that doesn't match other categories

## Usage

### Basic Error Handling

```typescript
import { handleError } from './error-handler-v3';

try {
  // Attempt operation
  const response = await model.generate(request);
} catch (error) {
  const { classified, recovery, userMessage } = handleError(error, {
    requestId: 'req_123',
    userId: 'user_456',
    modelId: 'gemini-2.5-pro',
    provider: 'google',
    attemptNumber: 1
  });

  console.log('Error category:', classified.category);
  console.log('Recovery action:', recovery.action);
  console.log('User message:', userMessage);

  // Take appropriate action based on recovery strategy
  if (recovery.action === 'FALLBACK') {
    // Try next model in chain
  } else if (recovery.action === 'RETRY') {
    // Retry with delay
    await sleep(recovery.delayMs);
  }
}
```

### Error Classification Only

```typescript
import { classifyError } from './error-handler-v3';

const error = { status: 503, message: 'Service unavailable' };
const classified = classifyError(error, {
  modelId: 'gemini-2.5-pro',
  provider: 'google'
});

console.log('Category:', classified.category);
console.log('Severity:', classified.severity);
console.log('Should retry:', classified.shouldRetry);
console.log('Should fallback:', classified.shouldFallback);
```

### Quick Checks

```typescript
import { isRetryableError, shouldFallback } from './error-handler-v3';

if (isRetryableError(error)) {
  // Retry the operation
}

if (shouldFallback(error)) {
  // Try next model in fallback chain
}
```

### Error Statistics

```typescript
import { getErrorStatistics } from './error-handler-v3';

const stats = getErrorStatistics();

// Get summary
const summary = stats.getSummary();
console.log('Total errors:', summary.totalErrors);
console.log('By category:', summary.byCategory);
console.log('By model:', summary.byModel);
console.log('By provider:', summary.byProvider);

// Check error rate for a model
const errorRate = stats.getModelErrorRate('gemini-2.5-pro', 100);
console.log('Error rate:', errorRate); // 0.05 = 5%

// Check if alerting is needed
if (stats.shouldAlert('gemini-2.5-pro', 100, 0.05)) {
  console.log('Alert: Error rate exceeds 5% threshold');
}

// Get recent errors
const recentErrors = stats.getRecentErrors(10);
console.log('Recent errors:', recentErrors);
```

## Recovery Strategies

### RETRY
Retry the operation after a delay, optionally with modified parameters (e.g., increased timeout).

```typescript
if (recovery.action === 'RETRY') {
  await sleep(recovery.delayMs || 1000);
  // Retry with increased timeout
  const response = await model.generate(request, { timeout: currentTimeout * 1.5 });
}
```

### FALLBACK
Switch to the next model in the fallback chain.

```typescript
if (recovery.action === 'FALLBACK') {
  const nextModel = fallbackChain[currentIndex + 1];
  const response = await nextModel.generate(request);
}
```

### QUEUE
Queue the request for later processing when rate limits reset.

```typescript
if (recovery.action === 'QUEUE') {
  await rateLimiter.enqueueRequest(request);
}
```

### REJECT
Reject the request immediately without retry (e.g., safety violations).

```typescript
if (recovery.action === 'REJECT') {
  throw new Error(userMessage);
}
```

### DEGRADE
Continue with degraded functionality (e.g., without memory injection).

```typescript
if (recovery.action === 'DEGRADE') {
  // Continue without optional features
  const response = await model.generate(request, { skipMemory: true });
}
```

## Error Context

Provide rich context for better error tracking and debugging:

```typescript
const errorContext = {
  requestId: 'req_123',           // Unique request identifier
  userId: 'user_456',             // User identifier
  modelId: 'gemini-2.5-pro',      // Model being used
  provider: 'google',             // Provider name
  category: 'COMPLEX',            // Task category
  attemptNumber: 2,               // Retry attempt number
  additionalInfo: {               // Custom fields
    region: 'us-east-1',
    retryCount: 3,
    customField: 'value'
  }
};

const { classified } = handleError(error, errorContext);
```

## Logging

Errors are logged with severity-based console output:

- **CRITICAL**: `console.error` with `[CRITICAL ERROR]` prefix
- **HIGH**: `console.error` with `[HIGH ERROR]` prefix
- **MEDIUM**: `console.warn` with `[MEDIUM ERROR]` prefix
- **LOW**: `console.log` with `[LOW ERROR]` prefix

Log entries include:
- Timestamp
- Error category and severity
- Full error context
- Recovery strategy
- Stack trace (when available)

## Monitoring and Alerting

### Error Rate Monitoring

```typescript
const stats = getErrorStatistics();

// Check if model error rate exceeds 5%
if (stats.shouldAlert('gemini-2.5-pro', totalRequests, 0.05)) {
  // Send alert to monitoring system
  alerting.send({
    severity: 'HIGH',
    message: 'Model error rate exceeds 5%',
    model: 'gemini-2.5-pro',
    errorRate: stats.getModelErrorRate('gemini-2.5-pro', totalRequests)
  });
}
```

### Recent Error Analysis

```typescript
const recentErrors = stats.getRecentErrors(20);

// Analyze patterns
const errorsByCategory = recentErrors.reduce((acc, err) => {
  acc[err.category] = (acc[err.category] || 0) + 1;
  return acc;
}, {});

console.log('Recent error patterns:', errorsByCategory);
```

## Integration with FallbackChainManager

The error handler is integrated into the FallbackChainManager for automatic error handling:

```typescript
// In FallbackChainManager.executeWithFallback
try {
  const response = await executeModel(model, request, currentTimeout);
  return response;
} catch (error) {
  const errorContext = {
    requestId,
    modelId: model.id,
    provider: model.provider,
    category,
    attemptNumber
  };
  
  const { classified, recovery } = handleError(error, errorContext);
  
  // Automatic recovery based on strategy
  if (recovery.action === 'FALLBACK') {
    // Continue to next model in chain
    continue;
  } else if (recovery.action === 'RETRY') {
    // Increase timeout and retry
    currentTimeout *= 1.5;
  }
}
```

## Requirements Coverage

This implementation satisfies the following requirements:

- **12.1**: Handle model unavailable errors (503, 502, 504) with automatic fallback
- **12.2**: Handle rate limit errors (429) with provider switching
- **12.3**: Handle authentication errors (401, 403) with provider marking
- **12.4**: Handle timeout errors with retry and increased timeout
- **12.5**: Provide graceful error messages with retry suggestions
- **12.6**: Reject safety violations immediately without retry
- **12.7**: Continue without memory injection on memory system failures
- **12.8**: Fallback to default model on invalid configuration
- **12.9**: Log all errors with severity level and context
- **12.10**: Track error rates per model and alert when exceeding 5%

## Testing

Comprehensive test suite with 47 tests covering:

- Error classification for all categories
- Recovery strategy determination
- Graceful error message generation
- Error statistics tracking
- Edge cases and error handling

Run tests:
```bash
npm test src/lib/error-handler-v3.test.ts
```

## Best Practices

1. **Always provide context**: Include requestId, userId, modelId, and provider for better tracking
2. **Use handleError for complete handling**: It classifies, logs, records stats, and provides recovery
3. **Monitor error rates**: Regularly check error statistics and set up alerting
4. **Provide user-friendly messages**: Use the generated userMessage for client responses
5. **Follow recovery strategies**: Implement the suggested recovery action
6. **Log appropriately**: Errors are automatically logged, avoid duplicate logging
7. **Reset statistics in tests**: Use `resetErrorStatistics()` in test setup

## Future Enhancements

- Integration with external monitoring services (Datadog, Sentry)
- Automatic error rate alerting via email/Slack
- Error pattern detection and anomaly detection
- Historical error trend analysis
- Per-user error rate limiting
- Automatic model health scoring based on error rates
