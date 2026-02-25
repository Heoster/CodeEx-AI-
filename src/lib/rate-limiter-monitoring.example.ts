/**
 * Example: Provider Utilization Monitoring
 * 
 * This example demonstrates how to use the provider utilization monitoring
 * features added in task 7.4 of the CODEEX V3.3 Multi-Model AI Router spec.
 * 
 * Features demonstrated:
 * - Calculate utilization rates (0-1 scale) per provider
 * - Check for alerts at 80% utilization threshold
 * - Track peak usage times per provider
 * - Generate comprehensive provider statistics reports
 * 
 * Requirements: 6.9, 6.10, 17.9, 17.10
 */

import { getRateLimiterService } from './rate-limiter-service';
import type { ProviderType } from './model-config-v3.3';

/**
 * Example 1: Check current utilization for a provider
 */
export function checkProviderUtilization(provider: ProviderType): void {
  const service = getRateLimiterService();
  
  // Get current utilization rate (0-1 scale)
  const utilizationRate = service.calculateUtilizationRate(provider);
  
  console.log(`${provider} utilization: ${(utilizationRate * 100).toFixed(1)}%`);
  
  // Check if provider is throttled
  const state = service.getRateLimitState(provider);
  if (state.isThrottled) {
    console.log(`⚠️ ${provider} is currently throttled`);
    console.log(`Next reset at: ${state.resetAt}`);
  }
}

/**
 * Example 2: Monitor for high utilization alerts
 */
export function monitorUtilizationAlerts(): void {
  const service = getRateLimiterService();
  
  // Check for providers exceeding 80% utilization
  const alerts = service.checkUtilizationAlerts(0.8);
  
  if (alerts.size > 0) {
    console.log('🚨 High Utilization Alerts:');
    for (const [provider, utilization] of alerts.entries()) {
      console.log(`  - ${provider}: ${(utilization * 100).toFixed(1)}%`);
    }
  } else {
    console.log('✅ All providers operating within normal limits');
  }
}

/**
 * Example 3: Get detailed statistics for a provider
 */
export function getProviderStatistics(provider: ProviderType): void {
  const service = getRateLimiterService();
  
  const stats = service.getProviderStats(provider);
  
  console.log(`\n📊 Statistics for ${provider}:`);
  console.log(`  Total Requests: ${stats.totalRequests}`);
  console.log(`  Throttled Requests: ${stats.throttledRequests}`);
  console.log(`  Average Wait Time: ${stats.averageWaitTime.toFixed(2)}ms`);
  console.log(`  Current Utilization: ${(stats.utilizationRate * 100).toFixed(1)}%`);
  console.log(`  Last Peak Usage: ${stats.peakUsageTime}`);
  console.log(`  Historical Peak Times: ${stats.peakUsageTimes.length} recorded`);
}

/**
 * Example 4: Generate comprehensive statistics report
 */
export function generateMonitoringReport(): void {
  const service = getRateLimiterService();
  
  const report = service.generateStatisticsReport();
  
  console.log('\n📈 Provider Statistics Report');
  console.log(`Generated at: ${report.generatedAt}\n`);
  
  // Summary
  console.log('Summary:');
  console.log(`  Total Requests: ${report.summary.totalRequests}`);
  console.log(`  Total Throttled: ${report.summary.totalThrottled}`);
  console.log(`  Average Utilization: ${(report.summary.averageUtilization * 100).toFixed(1)}%`);
  console.log(`  Highest Utilization: ${report.summary.highestUtilization.provider} at ${(report.summary.highestUtilization.rate * 100).toFixed(1)}%\n`);
  
  // Alerts
  if (report.alerts.length > 0) {
    console.log('🚨 Alerts:');
    for (const alert of report.alerts) {
      console.log(`  ${alert.message}`);
    }
    console.log('');
  }
  
  // Per-provider details
  console.log('Provider Details:');
  for (const stats of report.providers) {
    console.log(`\n  ${stats.provider}:`);
    console.log(`    Utilization: ${(stats.utilizationRate * 100).toFixed(1)}%`);
    console.log(`    Requests: ${stats.totalRequests} (${stats.throttledRequests} throttled)`);
    console.log(`    Peak Times Recorded: ${stats.peakUsageTimes.length}`);
  }
}

/**
 * Example 5: Set up periodic monitoring
 */
export function setupPeriodicMonitoring(intervalMinutes: number = 5): NodeJS.Timeout {
  console.log(`🔄 Setting up monitoring every ${intervalMinutes} minutes...`);
  
  return setInterval(() => {
    console.log('\n--- Periodic Monitoring Check ---');
    monitorUtilizationAlerts();
    
    // Generate full report every hour (12 intervals of 5 minutes)
    const now = new Date();
    if (now.getMinutes() % 60 < intervalMinutes) {
      generateMonitoringReport();
    }
  }, intervalMinutes * 60 * 1000);
}

/**
 * Example 6: Track peak usage patterns
 */
export function analyzePeakUsagePatterns(provider: ProviderType): void {
  const service = getRateLimiterService();
  const stats = service.getProviderStats(provider);
  
  if (stats.peakUsageTimes.length === 0) {
    console.log(`No peak usage times recorded for ${provider}`);
    return;
  }
  
  console.log(`\n📅 Peak Usage Analysis for ${provider}:`);
  console.log(`  Total Peak Events: ${stats.peakUsageTimes.length}`);
  
  // Analyze by hour of day
  const hourCounts = new Map<number, number>();
  for (const timestamp of stats.peakUsageTimes) {
    const hour = new Date(timestamp).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  }
  
  // Find peak hour
  let peakHour = 0;
  let maxCount = 0;
  for (const [hour, count] of hourCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  }
  
  console.log(`  Peak Hour: ${peakHour}:00 UTC (${maxCount} events)`);
  console.log(`  Most Recent Peak: ${stats.peakUsageTime}`);
}

/**
 * Example usage in a monitoring dashboard or admin panel
 */
export function runMonitoringDashboard(): void {
  console.log('='.repeat(60));
  console.log('CODEEX V3.3 - Provider Utilization Monitoring Dashboard');
  console.log('='.repeat(60));
  
  // Check all providers
  const providers: ProviderType[] = ['groq', 'google', 'cerebras', 'huggingface', 'elevenlabs'];
  
  console.log('\n📊 Current Utilization:');
  for (const provider of providers) {
    checkProviderUtilization(provider);
  }
  
  // Check for alerts
  console.log('\n');
  monitorUtilizationAlerts();
  
  // Generate full report
  generateMonitoringReport();
  
  // Analyze peak patterns for high-traffic providers
  console.log('\n');
  analyzePeakUsagePatterns('groq');
  analyzePeakUsagePatterns('google');
}

// Example: Run the dashboard
if (require.main === module) {
  runMonitoringDashboard();
}
