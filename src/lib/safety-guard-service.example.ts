/**
 * Safety Guard Service Usage Examples
 * Demonstrates how to use the Safety Guard Service in your application
 */

import { getSafetyGuardService, type SafetyCheckRequest } from './safety-guard-service';

/**
 * Example 1: Check user input before processing
 */
export async function checkUserInput(userMessage: string, userId?: string) {
  const safetyGuard = getSafetyGuardService();
  
  // Skip if safety guard is disabled
  if (!safetyGuard.isEnabled()) {
    console.log('Safety guard is disabled, skipping check');
    return { allowed: true };
  }

  const request: SafetyCheckRequest = {
    content: userMessage,
    type: 'INPUT',
    userId,
  };

  const result = await safetyGuard.checkInput(request);

  if (!result.isSafe) {
    console.warn('Unsafe input detected:', {
      violations: result.violations,
      confidence: result.confidence,
    });
    
    return {
      allowed: false,
      reason: result.violations[0]?.description || 'Content violates safety policies',
      category: result.violations[0]?.type,
      severity: result.violations[0]?.severity,
    };
  }

  return { allowed: true };
}

/**
 * Example 2: Check AI model output before returning to user
 */
export async function checkModelOutput(modelResponse: string, userId?: string) {
  const safetyGuard = getSafetyGuardService();
  
  if (!safetyGuard.isEnabled()) {
    return { allowed: true, response: modelResponse };
  }

  const request: SafetyCheckRequest = {
    content: modelResponse,
    type: 'OUTPUT',
    userId,
  };

  const result = await safetyGuard.checkOutput(request);

  if (!result.isSafe) {
    console.warn('Unsafe output detected:', {
      violations: result.violations,
      confidence: result.confidence,
    });
    
    return {
      allowed: false,
      response: 'I apologize, but I cannot provide that response as it may contain inappropriate content.',
      reason: result.violations[0]?.description,
    };
  }

  return { allowed: true, response: modelResponse };
}

/**
 * Example 3: Check with context for better accuracy
 */
export async function checkWithContext(
  content: string,
  conversationHistory: string,
  userId?: string
) {
  const safetyGuard = getSafetyGuardService();
  
  if (!safetyGuard.isEnabled()) {
    return { allowed: true };
  }

  const request: SafetyCheckRequest = {
    content,
    type: 'INPUT',
    context: conversationHistory,
    userId,
  };

  const result = await safetyGuard.checkInput(request);

  return {
    allowed: result.isSafe,
    violations: result.violations,
    confidence: result.confidence,
  };
}

/**
 * Example 4: Get user's violation history
 */
export function getUserViolationHistory(userId: string) {
  const safetyGuard = getSafetyGuardService();
  const history = safetyGuard.getViolationHistory(userId);
  
  return {
    totalViolations: history.length,
    violations: history,
    categories: [...new Set(history.map(v => v.type))],
    highSeverityCount: history.filter(v => v.severity === 'HIGH' || v.severity === 'CRITICAL').length,
  };
}

/**
 * Example 5: Complete request flow with safety checks
 */
export async function processUserRequest(
  userMessage: string,
  userId: string,
  generateResponse: (message: string) => Promise<string>
) {
  // Step 1: Check input safety
  const inputCheck = await checkUserInput(userMessage, userId);
  
  if (!inputCheck.allowed) {
    return {
      success: false,
      error: inputCheck.reason,
      category: inputCheck.category,
      severity: inputCheck.severity,
    };
  }

  // Step 2: Generate AI response
  const aiResponse = await generateResponse(userMessage);

  // Step 3: Check output safety
  const outputCheck = await checkModelOutput(aiResponse, userId);

  if (!outputCheck.allowed) {
    return {
      success: false,
      error: 'Generated response failed safety check',
      fallbackResponse: outputCheck.response,
    };
  }

  // Step 4: Return safe response
  return {
    success: true,
    response: outputCheck.response,
  };
}
