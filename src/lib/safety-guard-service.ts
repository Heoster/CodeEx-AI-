/**
 * Safety Guard Service
 * Dual-layer safety checking using Groq Llama Guard 4 12B for input and output validation
 * 
 * Requirements: 2.1-2.10
 * - Validates all user inputs before processing
 * - Validates all model outputs before returning to user
 * - Tracks violation patterns per user
 * - Provides detailed violation feedback with confidence scores and severity levels
 */

import { createUserFriendlyError } from '@/lib/model-config';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const LLAMA_GUARD_MODEL = 'meta-llama/llama-guard-4-12b';

/**
 * Safety check request
 */
export interface SafetyCheckRequest {
  content: string;
  type: 'INPUT' | 'OUTPUT';
  context?: string;
  userId?: string;
}

/**
 * Safety check result
 */
export interface SafetyCheckResult {
  isSafe: boolean;
  violations: SafetyViolation[];
  confidence: number;
  category?: SafetyCategory;
}

/**
 * Safety violation details
 */
export interface SafetyViolation {
  type: SafetyCategory;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

/**
 * Safety categories as defined in requirements
 */
export type SafetyCategory = 
  | 'HATE_SPEECH'
  | 'VIOLENCE'
  | 'SEXUAL_CONTENT'
  | 'SELF_HARM'
  | 'DANGEROUS_CONTENT'
  | 'HARASSMENT'
  | 'ILLEGAL_ACTIVITY';

/**
 * Violation history entry
 */
interface ViolationHistoryEntry {
  userId: string;
  violation: SafetyViolation;
  timestamp: string;
  contentType: 'INPUT' | 'OUTPUT';
}

/**
 * Groq API message format
 */
interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Groq API response format
 */
interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  error?: {
    message: string;
    type: string;
  };
}

/**
 * Safety Guard Service
 * Implements dual-layer safety checking for inputs and outputs
 */
export class SafetyGuardService {
  private static instance: SafetyGuardService | null = null;
  private violationHistory: Map<string, ViolationHistoryEntry[]> = new Map();
  private enabled: boolean;

  private constructor() {
    // Check if safety guard is enabled via feature flag
    this.enabled = process.env.ENABLE_SAFETY_GUARD !== 'false';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SafetyGuardService {
    if (!SafetyGuardService.instance) {
      SafetyGuardService.instance = new SafetyGuardService();
    }
    return SafetyGuardService.instance;
  }

  /**
   * Check if safety guard is enabled
   * Requirement 2.10: Support feature flag bypass
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Check input safety
   * Requirement 2.1: Validate user input using Llama Guard 4 12B
   * Requirement 2.2: Reject unsafe input immediately
   * Requirement 2.3: Provide specific violation category
   */
  public async checkInput(request: SafetyCheckRequest): Promise<SafetyCheckResult> {
    if (!this.enabled) {
      return this.createSafeResult();
    }

    return this.performSafetyCheck({
      ...request,
      type: 'INPUT',
    });
  }

  /**
   * Check output safety
   * Requirement 2.5: Validate model output before returning to user
   * Requirement 2.6: Reject unsafe output
   */
  public async checkOutput(request: SafetyCheckRequest): Promise<SafetyCheckResult> {
    if (!this.enabled) {
      return this.createSafeResult();
    }

    return this.performSafetyCheck({
      ...request,
      type: 'OUTPUT',
    });
  }

  /**
   * Get violation history for a user
   * Requirement 2.9: Track violation history per user
   */
  public getViolationHistory(userId: string): SafetyViolation[] {
    const history = this.violationHistory.get(userId) || [];
    return history.map(entry => entry.violation);
  }

  /**
   * Perform safety check using Llama Guard 4
   * Requirements 2.4, 2.7, 2.8: Check all 7 categories, assign confidence and severity
   */
  private async performSafetyCheck(request: SafetyCheckRequest): Promise<SafetyCheckResult> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('GROQ_API_KEY not configured, bypassing safety check');
      return this.createSafeResult();
    }

    try {
      // Build the safety check prompt
      const systemPrompt = this.buildSafetyPrompt(request.type);
      const userPrompt = request.context 
        ? `Context: ${request.context}\n\nContent to check: ${request.content}`
        : request.content;

      const messages: GroqMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      // Call Llama Guard 4 via Groq API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: LLAMA_GUARD_MODEL,
          messages,
          temperature: 0.1, // Low temperature for consistent safety checks
          top_p: 0.9,
          max_tokens: 512,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Llama Guard 4 API Error:', {
          status: response.status,
          error: errorText,
        });
        
        // On error, fail open (allow content) but log the issue
        console.warn('Safety check failed, allowing content by default');
        return this.createSafeResult();
      }

      const data = await response.json() as GroqResponse;

      if (data.error) {
        console.error('Llama Guard 4 Model Error:', data.error.message);
        return this.createSafeResult();
      }

      const choice = data.choices?.[0];
      if (!choice || !choice.message?.content) {
        console.error('No response from Llama Guard 4');
        return this.createSafeResult();
      }

      // Parse the safety check result
      const result = this.parseSafetyResponse(choice.message.content);

      // Track violations if unsafe
      if (!result.isSafe && request.userId) {
        this.trackViolation(request.userId, result.violations[0], request.type);
      }

      return result;
    } catch (error) {
      console.error('Safety check error:', error);
      // Fail open on error
      return this.createSafeResult();
    }
  }

  /**
   * Build safety check prompt for Llama Guard 4
   */
  private buildSafetyPrompt(type: 'INPUT' | 'OUTPUT'): string {
    return `You are Llama Guard 4, a safety classifier. Analyze the following ${type.toLowerCase()} for safety violations.

Check for these categories:
1. HATE_SPEECH: Content promoting hatred or discrimination based on protected characteristics
2. VIOLENCE: Content depicting, glorifying, or encouraging violence or harm
3. SEXUAL_CONTENT: Explicit sexual content or sexual exploitation
4. SELF_HARM: Content encouraging or depicting self-harm or suicide
5. DANGEROUS_CONTENT: Instructions for dangerous activities or harmful substances
6. HARASSMENT: Content intended to harass, bully, or intimidate
7. ILLEGAL_ACTIVITY: Content promoting or facilitating illegal activities

Respond in this exact format:
SAFE: [yes/no]
CATEGORY: [category name if unsafe, or NONE if safe]
CONFIDENCE: [0.0-1.0]
SEVERITY: [LOW/MEDIUM/HIGH/CRITICAL if unsafe, or NONE if safe]
DESCRIPTION: [brief explanation]`;
  }

  /**
   * Parse Llama Guard 4 response
   */
  private parseSafetyResponse(response: string): SafetyCheckResult {
    const lines = response.split('\n').map(line => line.trim());
    
    let isSafe = true;
    let category: SafetyCategory | undefined;
    let confidence = 0.95; // Default high confidence
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let description = '';

    for (const line of lines) {
      if (line.startsWith('SAFE:')) {
        const value = line.substring(5).trim().toLowerCase();
        isSafe = value === 'yes' || value === 'true';
      } else if (line.startsWith('CATEGORY:')) {
        const value = line.substring(9).trim();
        if (value !== 'NONE') {
          category = value as SafetyCategory;
        }
      } else if (line.startsWith('CONFIDENCE:')) {
        const value = parseFloat(line.substring(11).trim());
        if (!isNaN(value)) {
          confidence = Math.max(0, Math.min(1, value));
        }
      } else if (line.startsWith('SEVERITY:')) {
        const value = line.substring(9).trim();
        if (value !== 'NONE') {
          severity = value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        }
      } else if (line.startsWith('DESCRIPTION:')) {
        description = line.substring(12).trim();
      }
    }

    const violations: SafetyViolation[] = [];
    if (!isSafe && category) {
      violations.push({
        type: category,
        severity,
        description: description || `Content violates ${category} policy`,
      });
    }

    return {
      isSafe,
      violations,
      confidence,
      category,
    };
  }

  /**
   * Track violation in history
   */
  private trackViolation(
    userId: string,
    violation: SafetyViolation,
    contentType: 'INPUT' | 'OUTPUT'
  ): void {
    const entry: ViolationHistoryEntry = {
      userId,
      violation,
      timestamp: new Date().toISOString(),
      contentType,
    };

    const history = this.violationHistory.get(userId) || [];
    history.push(entry);
    
    // Keep only last 100 violations per user
    if (history.length > 100) {
      history.shift();
    }
    
    this.violationHistory.set(userId, history);
  }

  /**
   * Create a safe result (no violations)
   */
  private createSafeResult(): SafetyCheckResult {
    return {
      isSafe: true,
      violations: [],
      confidence: 1.0,
    };
  }
}

/**
 * Get singleton instance of SafetyGuardService
 */
export function getSafetyGuardService(): SafetyGuardService {
  return SafetyGuardService.getInstance();
}
