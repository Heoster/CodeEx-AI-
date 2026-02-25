# Rate Limiter Service - Request Queue Manager

## Overview

The Rate Limiter Service provides comprehensive rate limit management across all AI providers with intelligent request queuing and automatic processing. This ensures the system stays within free tier limits while maximizing throughput.

## Features

### Core Rate Limiting
- ✅ Track requests per minute per provider
- ✅ Track requests per day per provider  
- ✅ Track tokens per minute for token-based limits
- ✅ Automatic counter reset at appropriate intervals

### Request Queue Manager (Task 7.3)
- ✅ **Request queuing when rate limits are reached** (Requirement 6.4)
- ✅ **Priority-based queue ordering** (Requirement 6.6)
- ✅ **Estimated wait time calculation** (Requirement 6.7)
- ✅ **Automatic queue processing on rate limit reset** (Requirement 6.5)
- ✅ **Request cancellation for queued requests** (Requirement 6.8)

### Monitoring & Alerts
- ✅ Provider utilization monitoring
- ✅ Utilization alerts at 80% threshold
- ✅ Comprehensive statistics tracking

## Provider Rate Limits

| Provider | Requests/Minute | Requests/Day |
|----------|----------------|--------------|
| Groq | 30 | 14,400 |
| Google | 15 | 1,500 |
| Cerebras | 100 | 50,000 |
| Hugging Face | 60 | 10,000 |
| ElevenLabs | 20 | 5,000 |

## Architecture

### Automatic Queue Processing Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Incoming Request                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Can Execute?        │
              │  (Check Rate Limits) │
              └──────────┬───────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
          YES                         NO
           │                           │
           ▼                           ▼
    ┌─────────────┐          ┌──────────────────┐
    │   Execute   │          │  Enqueue Request │
    │ Immediately │          │  (Priority-based)│
    └─────────────┘          └────────┬─────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │  Wait for Rate Limit │
                            │       Reset          │
                            └──────────┬───────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │  Automatic Trigger   │
                            │  (on reset timer)    │
                            └──────────┬───────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │  Process Queue       │
                            │  (Highest Priority   │
                            │   First)             │
                            └──────────────────────┘
```

## Usage

### 1. Basic Setup

```typescript
import { getRateLimiterService } from './rate-limiter-service';

const rateLimiter = getRateLimiterService();
```

### 2. Register Queue Processor (Required for Automatic Processing)

```typescript
import type { QueuedRequest } from './rate-limiter-service';

// Register a callback that will be invoked automatically
rateLimiter.registerQueueProcessor(async (request: QueuedRequest) => {
  console.log(`Processing queued request ${request.id}`);
  
  // Execute your model request here
  const response = await yourModelAPI.execute({
    provider: request.provider,
    tokens: request.estimatedTokens,
  });
  
  return response;
});
```

### 3. Handle Incoming Requests

```typescript
async function handleRequest(provider: ProviderType, tokens: number) {
  if (rateLimiter.canExecute(provider, tokens)) {
    // Execute immediately
    rateLimiter.recordRequest(provider, tokens);
    return await executeRequest(provider, tokens);
  } else {
    // Queue for automatic processing
    const requestId = rateLimiter.enqueueRequest(
      provider,
      tokens,
      5 // priority (higher = processed first)
    );
    
    const waitTime = rateLimiter.getEstimatedWaitTime(requestId);
    return {
      queued: true,
      requestId,
      estimatedWaitTime: waitTime,
    };
  }
}
```

## API Reference

### Core Methods

#### `canExecute(provider: ProviderType, estimatedTokens?: number): boolean`
Check if a request can be executed within rate limits.

#### `recordRequest(provider: ProviderType, tokens?: number): void`
Record a request execution and update counters.

#### `getRateLimitState(provider: ProviderType): RateLimitState`
Get current rate limit state for a provider.

### Queue Management Methods

#### `enqueueRequest(provider: ProviderType, estimatedTokens?: number, priority?: number): string`
Queue a request when rate limits are reached. Returns a unique request ID.

**Parameters:**
- `provider`: The AI provider (groq, google, cerebras, etc.)
- `estimatedTokens`: Estimated token count for the request (default: 0)
- `priority`: Priority level (0-100, higher = processed first, default: 0)

**Returns:** Unique request ID

#### `dequeueRequest(provider: ProviderType): QueuedRequest | null`
Dequeue the next highest priority request for a provider.

#### `cancelRequest(requestId: string): boolean`
Cancel a queued request. Returns true if cancelled, false if not found.

#### `getEstimatedWaitTime(requestId: string): number`
Get estimated wait time in milliseconds for a queued request.

#### `getQueueLength(provider?: ProviderType): number`
Get queue length for a specific provider or all providers.

#### `getQueuedRequests(provider?: ProviderType): QueuedRequest[]`
Get all queued requests for monitoring/debugging.

### Automatic Processing Methods

#### `registerQueueProcessor(callback: QueueProcessorCallback): void`
Register a callback function that will be invoked automatically when rate limits reset and queued requests can be processed.

**Callback Signature:**
```typescript
type QueueProcessorCallback = (request: QueuedRequest) => Promise<void>;
```

#### `unregisterQueueProcessor(): void`
Unregister the queue processor callback.

#### `processQueue(provider?: ProviderType): Promise<void>`
Manually trigger queue processing for a provider (or all providers if not specified).

### Monitoring Methods

#### `getProviderStats(provider: ProviderType): ProviderRateLimitStats`
Get comprehensive statistics for a provider.

#### `calculateUtilizationRate(provider: ProviderType): number`
Calculate current utilization rate (0-1) for a provider.

#### `checkUtilizationAlerts(threshold?: number): Map<ProviderType, number>`
Check if any provider exceeds the utilization threshold (default: 0.8).

#### `getAllProviderStates(): Map<ProviderType, RateLimitState>`
Get rate limit states for all providers.

### Lifecycle Methods

#### `cleanup(): void`
Cleanup timers and resources. Call when shutting down the application.

## Priority System

Requests are processed in priority order (highest first):

- **Priority 10**: Critical/urgent requests
- **Priority 5**: Normal requests (default)
- **Priority 1**: Low priority/background tasks
- **Priority 0**: Lowest priority

Example:
```typescript
// High priority request (processed first)
rateLimiter.enqueueRequest('groq', 100, 10);

// Normal priority
rateLimiter.enqueueRequest('groq', 50, 5);

// Low priority (processed last)
rateLimiter.enqueueRequest('groq', 75, 1);
```

## Automatic Queue Processing

The queue manager automatically processes queued requests when rate limits reset:

1. **Minute Reset**: Every 60 seconds, the per-minute counters reset
2. **Day Reset**: At midnight UTC, the per-day counters reset
3. **Automatic Trigger**: When counters reset, the queue processor is automatically invoked
4. **Capacity-Based**: Processes as many requests as capacity allows
5. **Priority Order**: Highest priority requests are processed first

### How It Works

```typescript
// 1. Register your processor once at startup
rateLimiter.registerQueueProcessor(async (request) => {
  await executeModelRequest(request);
});

// 2. Queue requests when rate limited
if (!rateLimiter.canExecute('groq')) {
  rateLimiter.enqueueRequest('groq', 100, 5);
  // Request is now queued
}

// 3. Automatic processing happens when rate limit resets
// No manual intervention needed!
// The registered callback will be invoked automatically
```

## Monitoring & Alerts

### Check Utilization

```typescript
const stats = rateLimiter.getProviderStats('groq');
console.log(`Utilization: ${(stats.utilizationRate * 100).toFixed(1)}%`);
```

### Alert on High Utilization

```typescript
const alerts = rateLimiter.checkUtilizationAlerts(0.8);
if (alerts.size > 0) {
  for (const [provider, utilization] of alerts) {
    console.warn(`⚠️ ${provider} at ${(utilization * 100).toFixed(1)}% capacity`);
  }
}
```

### Monitor Queue

```typescript
const queueLength = rateLimiter.getQueueLength('google');
const queuedRequests = rateLimiter.getQueuedRequests('google');

console.log(`Queue length: ${queueLength}`);
queuedRequests.forEach(req => {
  const waitTime = rateLimiter.getEstimatedWaitTime(req.id);
  console.log(`Request ${req.id}: ${Math.ceil(waitTime / 1000)}s wait`);
});
```

## Error Handling

The queue processor handles errors gracefully:

```typescript
rateLimiter.registerQueueProcessor(async (request) => {
  try {
    await executeModelRequest(request);
  } catch (error) {
    console.error(`Request ${request.id} failed:`, error);
    // Error is logged, processing continues with next request
    throw error; // Re-throw if you want to track failures
  }
});
```

## Best Practices

1. **Register Processor Early**: Register your queue processor at application startup
2. **Use Priorities**: Assign appropriate priorities to requests based on importance
3. **Monitor Utilization**: Check utilization regularly and alert at 80% threshold
4. **Handle Errors**: Implement proper error handling in your queue processor
5. **Cleanup on Shutdown**: Call `cleanup()` when shutting down to clear timers
6. **Test Queue Processing**: Use `processQueue()` for manual testing

## Integration with Router

The Rate Limiter Service integrates seamlessly with the Intelligent Router:

```typescript
// In your router service
import { getRateLimiterService } from './rate-limiter-service';

const rateLimiter = getRateLimiterService();

// Register processor to execute model requests
rateLimiter.registerQueueProcessor(async (request) => {
  // Execute the model request through your adapter
  const adapter = getAdapterForProvider(request.provider);
  return await adapter.execute(/* ... */);
});

// In your routing logic
async function executeWithRateLimiting(provider, request) {
  if (rateLimiter.canExecute(provider, request.estimatedTokens)) {
    rateLimiter.recordRequest(provider, request.estimatedTokens);
    return await executeImmediately(provider, request);
  } else {
    // Queue for automatic processing
    const requestId = rateLimiter.enqueueRequest(
      provider,
      request.estimatedTokens,
      request.priority || 5
    );
    return { queued: true, requestId };
  }
}
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- ✅ **Requirement 6.4**: Queue requests when rate limits are reached
- ✅ **Requirement 6.5**: Automatically process queued requests on rate limit reset
- ✅ **Requirement 6.6**: Priority-based queue ordering
- ✅ **Requirement 6.7**: Estimated wait time calculation
- ✅ **Requirement 6.8**: Request cancellation support

## Testing

See `rate-limiter-service.example.ts` for comprehensive usage examples.

## Related Files

- `src/lib/rate-limiter-service.ts` - Main implementation
- `src/lib/rate-limiter-service.example.ts` - Usage examples
- `src/lib/intelligent-router-service.ts` - Router integration
- `src/lib/model-config-v3.3.ts` - Provider type definitions
