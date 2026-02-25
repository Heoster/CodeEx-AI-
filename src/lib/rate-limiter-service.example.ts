/**
 * Example Usage: Rate Limiter Service with Automatic Queue Processing
 * 
 * This example demonstrates how to use the enhanced Rate Limiter Service
 * with automatic queue processing on rate limit reset.
 */

import { getRateLimiterService, type QueuedRequest } from './rate-limiter-service';
import type { ProviderType } from './model-config-v3.3';

/**
 * Example 1: Basic Rate Limiting
 */
async function basicRateLimiting() {
  const rateLimiter = getRateLimiterService();
  const provider: ProviderType = 'groq';

  // Check if we can execute a request
  if (rateLimiter.canExecute(provider)) {
    console.log('Executing request...');
    // Execute your request here
    rateLimiter.recordRequest(provider, 100); // Record with token count
  } else {
    console.log('Rate limit reached, queuing request...');
    const requestId = rateLimiter.enqueueRequest(provider, 100, 5); // priority 5
    console.log(`Request queued with ID: ${requestId}`);
  }
}

/**
 * Example 2: Automatic Queue Processing
 * 
 * Register a callback that will be automatically invoked when rate limits reset
 * and queued requests can be processed.
 */
async function automaticQueueProcessing() {
  const rateLimiter = getRateLimiterService();

  // Register a callback to process queued requests
  rateLimiter.registerQueueProcessor(async (request: QueuedRequest) => {
    console.log(`Processing queued request ${request.id} for ${request.provider}`);
    
    try {
      // Execute the actual request here
      // For example, call your model API
      const response = await executeModelRequest(request);
      console.log(`Request ${request.id} completed successfully`);
      return response;
    } catch (error) {
      console.error(`Request ${request.id} failed:`, error);
      throw error;
    }
  });

  // Now when rate limits reset, queued requests will be automatically processed
  console.log('Queue processor registered. Requests will be processed automatically.');
}

/**
 * Example 3: Priority-Based Queuing
 */
async function priorityBasedQueuing() {
  const rateLimiter = getRateLimiterService();
  const provider: ProviderType = 'google';

  // Queue requests with different priorities
  // Higher priority requests are processed first
  const lowPriorityId = rateLimiter.enqueueRequest(provider, 50, 1);
  const mediumPriorityId = rateLimiter.enqueueRequest(provider, 100, 5);
  const highPriorityId = rateLimiter.enqueueRequest(provider, 75, 10);

  console.log('Queued requests:');
  console.log(`- Low priority: ${lowPriorityId}`);
  console.log(`- Medium priority: ${mediumPriorityId}`);
  console.log(`- High priority: ${highPriorityId}`);

  // High priority request will be processed first when capacity is available
}

/**
 * Example 4: Estimated Wait Time
 */
async function estimatedWaitTime() {
  const rateLimiter = getRateLimiterService();
  const provider: ProviderType = 'cerebras';

  const requestId = rateLimiter.enqueueRequest(provider, 200, 3);
  const waitTimeMs = rateLimiter.getEstimatedWaitTime(requestId);
  const waitTimeSec = Math.ceil(waitTimeMs / 1000);

  console.log(`Request ${requestId} estimated wait time: ${waitTimeSec} seconds`);
}

/**
 * Example 5: Request Cancellation
 */
async function requestCancellation() {
  const rateLimiter = getRateLimiterService();
  const provider: ProviderType = 'groq';

  // Queue a request
  const requestId = rateLimiter.enqueueRequest(provider, 100, 5);
  console.log(`Request queued: ${requestId}`);

  // Later, cancel the request if needed
  const cancelled = rateLimiter.cancelRequest(requestId);
  if (cancelled) {
    console.log(`Request ${requestId} cancelled successfully`);
  } else {
    console.log(`Request ${requestId} not found or already processed`);
  }
}

/**
 * Example 6: Monitoring Queue and Utilization
 */
async function monitoringExample() {
  const rateLimiter = getRateLimiterService();
  const provider: ProviderType = 'google';

  // Get current rate limit state
  const state = rateLimiter.getRateLimitState(provider);
  console.log('Rate Limit State:', {
    provider: state.provider,
    requestsThisMinute: state.requestsThisMinute,
    requestsToday: state.requestsToday,
    isThrottled: state.isThrottled,
    resetAt: state.resetAt,
  });

  // Get queue length
  const queueLength = rateLimiter.getQueueLength(provider);
  console.log(`Queue length for ${provider}: ${queueLength}`);

  // Get provider statistics
  const stats = rateLimiter.getProviderStats(provider);
  console.log('Provider Statistics:', {
    totalRequests: stats.totalRequests,
    throttledRequests: stats.throttledRequests,
    utilizationRate: `${(stats.utilizationRate * 100).toFixed(1)}%`,
    averageWaitTime: `${stats.averageWaitTime.toFixed(0)}ms`,
  });

  // Check for utilization alerts (>80%)
  const alerts = rateLimiter.checkUtilizationAlerts(0.8);
  if (alerts.size > 0) {
    console.log('⚠️ High utilization alerts:');
    for (const [provider, utilization] of alerts) {
      console.log(`  - ${provider}: ${(utilization * 100).toFixed(1)}%`);
    }
  }
}

/**
 * Example 7: Manual Queue Processing
 */
async function manualQueueProcessing() {
  const rateLimiter = getRateLimiterService();
  const provider: ProviderType = 'cerebras';

  // Register processor first
  rateLimiter.registerQueueProcessor(async (request: QueuedRequest) => {
    console.log(`Processing ${request.id}`);
    await executeModelRequest(request);
  });

  // Manually trigger queue processing (useful for testing)
  await rateLimiter.processQueue(provider);
  console.log('Manual queue processing completed');
}

/**
 * Example 8: Complete Integration Example
 */
async function completeIntegrationExample() {
  const rateLimiter = getRateLimiterService();

  // 1. Register queue processor
  rateLimiter.registerQueueProcessor(async (request: QueuedRequest) => {
    console.log(`Auto-processing queued request ${request.id}`);
    await executeModelRequest(request);
  });

  // 2. Function to handle incoming requests
  async function handleRequest(provider: ProviderType, tokens: number, priority: number = 5) {
    if (rateLimiter.canExecute(provider, tokens)) {
      // Execute immediately
      console.log(`Executing request immediately for ${provider}`);
      rateLimiter.recordRequest(provider, tokens);
      return await executeModelRequest({ provider, estimatedTokens: tokens } as QueuedRequest);
    } else {
      // Queue for later processing
      console.log(`Rate limit reached for ${provider}, queuing request`);
      const requestId = rateLimiter.enqueueRequest(provider, tokens, priority);
      const waitTime = rateLimiter.getEstimatedWaitTime(requestId);
      console.log(`Request queued. Estimated wait: ${Math.ceil(waitTime / 1000)}s`);
      return { queued: true, requestId, estimatedWaitTime: waitTime };
    }
  }

  // 3. Simulate incoming requests
  await handleRequest('groq', 100, 10); // High priority
  await handleRequest('groq', 50, 5);   // Medium priority
  await handleRequest('groq', 75, 1);   // Low priority

  // Requests will be automatically processed when rate limits reset
}

/**
 * Mock function to simulate model request execution
 */
async function executeModelRequest(request: QueuedRequest): Promise<any> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return { success: true, requestId: request.id };
}

/**
 * Example 9: Cleanup on Shutdown
 */
function cleanupExample() {
  const rateLimiter = getRateLimiterService();
  
  // When shutting down your application, cleanup timers
  process.on('SIGTERM', () => {
    console.log('Shutting down, cleaning up rate limiter...');
    rateLimiter.cleanup();
    process.exit(0);
  });
}

// Export examples for documentation
export {
  basicRateLimiting,
  automaticQueueProcessing,
  priorityBasedQueuing,
  estimatedWaitTime,
  requestCancellation,
  monitoringExample,
  manualQueueProcessing,
  completeIntegrationExample,
  cleanupExample,
};
