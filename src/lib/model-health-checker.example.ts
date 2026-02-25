/**
 * Example usage of Model Health Checker
 * This demonstrates how to integrate the health checker with the model registry
 */

import { getModelRegistryV3, initializeModelRegistryV3 } from './model-registry-v3';
import { 
  ModelHealthChecker, 
  initializeModelHealthChecker,
  type HealthCheckEvent 
} from './model-health-checker';

/**
 * Example 1: Basic setup and usage
 */
export function basicHealthCheckExample() {
  // Get or initialize the model registry
  const registry = getModelRegistryV3();
  
  // Initialize the health checker with default config (5 minute intervals)
  const healthChecker = initializeModelHealthChecker(registry);
  
  // Start periodic health checks
  healthChecker.start();
  
  // Later, when shutting down
  // healthChecker.stop();
  
  return healthChecker;
}

/**
 * Example 2: Custom configuration
 */
export function customConfigExample() {
  const registry = getModelRegistryV3();
  
  // Initialize with custom configuration
  const healthChecker = initializeModelHealthChecker(registry, {
    intervalMs: 2 * 60 * 1000,        // Check every 2 minutes
    timeoutMs: 5000,                   // 5 second timeout per check
    degradedThreshold: 2,              // Mark DEGRADED after 2 failures
    unavailableThreshold: 5,           // Mark UNAVAILABLE after 5 failures
    uptimeAlertThreshold: 0.90,        // Alert if uptime < 90%
  });
  
  healthChecker.start();
  
  return healthChecker;
}

/**
 * Example 3: Manual health checks
 */
export async function manualHealthCheckExample() {
  const registry = getModelRegistryV3();
  const healthChecker = new ModelHealthChecker(registry);
  
  // Check a specific model
  const result = await healthChecker.checkModelHealth('gemini-2.5-flash');
  console.log('Health check result:', result);
  
  // Check all models
  const allResults = await healthChecker.checkAllModelsHealth();
  console.log('All health checks:', allResults);
  
  return { result, allResults };
}

/**
 * Example 4: Monitoring uptime statistics
 */
export function uptimeMonitoringExample() {
  const registry = getModelRegistryV3();
  const healthChecker = initializeModelHealthChecker(registry);
  
  healthChecker.start();
  
  // Get uptime for a specific model
  const uptimeStats = healthChecker.getUptimeStats('gemini-2.5-flash');
  console.log('Uptime stats:', uptimeStats);
  
  // Get all uptime statistics
  const allStats = healthChecker.getAllUptimeStats();
  console.log('All uptime stats:', allStats);
  
  // Get models with low uptime
  const lowUptimeModels = healthChecker.getModelsWithLowUptime();
  console.log('Models with low uptime:', lowUptimeModels);
  
  // Get health summary
  const summary = healthChecker.getHealthSummary();
  console.log('Health summary:', summary);
  
  return { uptimeStats, allStats, lowUptimeModels, summary };
}

/**
 * Example 5: Event monitoring
 */
export function eventMonitoringExample() {
  const registry = getModelRegistryV3();
  const healthChecker = initializeModelHealthChecker(registry);
  
  // Add event listener for health check events
  healthChecker.addEventListener((event: HealthCheckEvent) => {
    switch (event.type) {
      case 'CHECK_STARTED':
        console.log(`Health check started for ${event.modelId}`);
        break;
        
      case 'CHECK_COMPLETED':
        console.log(`Health check completed for ${event.modelId}:`, event.data);
        break;
        
      case 'STATUS_CHANGED':
        console.warn(
          `Model ${event.modelId} status changed:`,
          `${event.data.previousStatus} → ${event.data.newStatus}`
        );
        break;
        
      case 'UPTIME_ALERT':
        console.error(
          `⚠️ UPTIME ALERT: Model ${event.modelId} uptime is ${event.data.uptimePercentage}%`,
          `(threshold: ${event.data.threshold}%)`
        );
        // Here you could send alerts to monitoring systems, Slack, etc.
        break;
    }
  });
  
  healthChecker.start();
  
  return healthChecker;
}

/**
 * Example 6: Integration with router
 * This shows how the router can use health status to make routing decisions
 */
export function routerIntegrationExample() {
  const registry = getModelRegistryV3();
  const healthChecker = initializeModelHealthChecker(registry);
  
  healthChecker.start();
  
  // When routing a request, check model availability
  function selectModel(taskCategory: string) {
    const fallbackChain = registry.getFallbackChain(taskCategory as any);
    
    // Filter out unavailable models
    const availableModels = fallbackChain.filter(model => {
      const isAvailable = registry.isModelAvailable(model.id);
      const healthStatus = model.lifecycle.healthStatus;
      
      // Skip UNAVAILABLE models, but allow DEGRADED models as fallback
      return isAvailable && healthStatus !== 'UNAVAILABLE';
    });
    
    if (availableModels.length === 0) {
      throw new Error('No available models for task category');
    }
    
    // Prefer HEALTHY models over DEGRADED ones
    const healthyModels = availableModels.filter(
      m => m.lifecycle.healthStatus === 'HEALTHY'
    );
    
    return healthyModels.length > 0 ? healthyModels[0] : availableModels[0];
  }
  
  return { selectModel };
}

/**
 * Example 7: Graceful shutdown
 */
export function gracefulShutdownExample() {
  const registry = getModelRegistryV3();
  const healthChecker = initializeModelHealthChecker(registry);
  
  healthChecker.start();
  
  // Handle shutdown signals
  process.on('SIGTERM', () => {
    console.log('Shutting down health checker...');
    healthChecker.stop();
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    console.log('Shutting down health checker...');
    healthChecker.stop();
    process.exit(0);
  });
  
  return healthChecker;
}

/**
 * Example 8: Debugging and diagnostics
 */
export async function diagnosticsExample() {
  const registry = getModelRegistryV3();
  const healthChecker = initializeModelHealthChecker(registry);
  
  // Get current configuration
  const config = healthChecker.getConfig();
  console.log('Health checker config:', config);
  
  // Check if running
  const isRunning = healthChecker.isHealthCheckRunning();
  console.log('Is running:', isRunning);
  
  // Get unavailable models
  const unavailableModels = healthChecker.getUnavailableModels();
  console.log('Unavailable models:', unavailableModels.map(m => m.id));
  
  // Get degraded models
  const degradedModels = healthChecker.getDegradedModels();
  console.log('Degraded models:', degradedModels.map(m => m.id));
  
  // Get health summary
  const summary = healthChecker.getHealthSummary();
  console.log('Health summary:', summary);
  
  // Perform manual check on all models
  const results = await healthChecker.checkAllModelsHealth();
  console.log('Manual check results:', results);
  
  return { config, isRunning, unavailableModels, degradedModels, summary, results };
}

/**
 * Example 9: Production setup with monitoring
 */
export function productionSetupExample() {
  const registry = getModelRegistryV3();
  
  // Initialize with production-ready configuration
  const healthChecker = initializeModelHealthChecker(registry, {
    intervalMs: 5 * 60 * 1000,         // 5 minutes (as per requirements)
    timeoutMs: 10 * 1000,              // 10 seconds
    degradedThreshold: 1,              // Mark DEGRADED after 1 failure
    unavailableThreshold: 3,           // Mark UNAVAILABLE after 3 consecutive failures
    uptimeAlertThreshold: 0.95,        // Alert if uptime < 95% (as per requirements)
  });
  
  // Set up comprehensive event monitoring
  healthChecker.addEventListener((event: HealthCheckEvent) => {
    // Log all events
    console.log(`[${event.timestamp}] ${event.type}: ${event.modelId}`, event.data);
    
    // Send critical events to monitoring system
    if (event.type === 'UPTIME_ALERT' || event.type === 'STATUS_CHANGED') {
      // sendToMonitoringSystem(event);
      // sendSlackAlert(event);
      // sendPagerDutyAlert(event);
    }
  });
  
  // Start health checks
  healthChecker.start();
  
  // Set up periodic reporting (every hour)
  setInterval(() => {
    const summary = healthChecker.getHealthSummary();
    console.log('=== Hourly Health Report ===');
    console.log(`Total Models: ${summary.totalModels}`);
    console.log(`Healthy: ${summary.healthyModels}`);
    console.log(`Degraded: ${summary.degradedModels}`);
    console.log(`Unavailable: ${summary.unavailableModels}`);
    console.log(`Average Uptime: ${summary.averageUptime.toFixed(2)}%`);
    console.log('===========================');
  }, 60 * 60 * 1000);
  
  return healthChecker;
}
