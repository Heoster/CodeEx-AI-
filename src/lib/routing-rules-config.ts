/**
 * Routing Rules Configuration for CODEEX V3.3 Multi-Model AI Router
 * 
 * This file defines the routing rules for all 11 task categories, mapping each
 * category to its primary model and comprehensive fallback chains.
 * 
 * Requirements: 15.1-15.12, 16.1-16.10
 */

import type { TaskCategory } from './model-registry-v3';
import type { RoutingRule } from './intelligent-router-service';

/**
 * Routing rules configuration for all 11 task categories
 * 
 * Each category is mapped to:
 * - Primary model: The first choice for handling requests of this category
 * - Fallback chain: Ordered list of backup models to try if primary fails
 * - Conditions: Optional routing conditions (e.g., token count thresholds)
 * 
 * Model IDs match those defined in models-config-v3.3.json
 */
export const ROUTING_RULES_CONFIG: Record<TaskCategory, RoutingRule> = {
  /**
   * SIMPLE Tasks
   * Primary: Cerebras Llama 4 Scout 17B (Requirement 15.1)
   * Fallback: Cerebras Llama 3.3 70B → Groq Llama 3.2 3B → Gemini 2.5 Flash (Requirement 16.1)
   * 
   * Use cases: Basic queries, greetings, simple facts
   */
  SIMPLE: {
    category: 'SIMPLE',
    primaryModelId: 'cerebras-llama-4-scout-17b',
    fallbackModelIds: [
      'cerebras-llama-3.3-70b',
      'groq-llama-3.2-3b',
      'gemini-2.5-flash'
    ]
  },
  
  /**
   * MEDIUM Tasks
   * Primary: Cerebras Llama 3.3 70B (Requirement 15.2)
   * Fallback: Cerebras GPT-OSS 120B → Gemini 2.5 Flash → Groq Mistral Saba 24B (Requirement 16.2)
   * 
   * Use cases: General knowledge, explanations, moderate complexity
   */
  MEDIUM: {
    category: 'MEDIUM',
    primaryModelId: 'cerebras-llama-3.3-70b',
    fallbackModelIds: [
      'cerebras-gpt-oss-120b',
      'gemini-2.5-flash',
      'groq-mistral-saba-24b'
    ]
  },
  
  /**
   * COMPLEX Tasks
   * Primary: Cerebras GPT-OSS 120B (Requirement 15.3)
   * Fallback: Gemini 2.5 Pro → Cerebras Llama 3.3 70B → Gemini 3 Pro Preview (Requirement 16.3)
   * 
   * Use cases: Multi-step reasoning, complex analysis, advanced problem-solving
   */
  COMPLEX: {
    category: 'COMPLEX',
    primaryModelId: 'cerebras-gpt-oss-120b',
    fallbackModelIds: [
      'gemini-2.5-pro',
      'cerebras-llama-3.3-70b',
      'gemini-3-pro-preview'
    ]
  },
  
  /**
   * CODING Tasks
   * Primary: Cerebras DeepSeek V3 0324 (Requirement 15.4)
   * Fallback: Cerebras GPT-OSS 120B → Gemini 2.5 Pro → Cerebras Llama 3.3 70B (Requirement 16.4)
   * 
   * Use cases: Code generation, debugging, code review, refactoring
   */
  CODING: {
    category: 'CODING',
    primaryModelId: 'cerebras-deepseek-v3-0324',
    fallbackModelIds: [
      'cerebras-gpt-oss-120b',
      'gemini-2.5-pro',
      'cerebras-llama-3.3-70b'
    ]
  },
  
  /**
   * REASONING Tasks
   * Primary: Cerebras GPT-OSS 120B (Requirement 15.5)
   * Fallback: Gemini 2.5 Pro → Gemini 3 Pro Preview → Cerebras Llama 3.3 70B (Requirement 16.5)
   * 
   * Use cases: Logic puzzles, mathematical reasoning, strategic thinking
   */
  REASONING: {
    category: 'REASONING',
    primaryModelId: 'cerebras-gpt-oss-120b',
    fallbackModelIds: [
      'gemini-2.5-pro',
      'gemini-3-pro-preview',
      'cerebras-llama-3.3-70b'
    ]
  },
  
  /**
   * VISION_IN Tasks
   * Primary: Gemini 3 Pro Preview (Requirement 15.6)
   * Fallback: Gemini 2.5 Pro → Gemini 2.5 Flash (Requirement 16.6)
   * 
   * Use cases: Image understanding, OCR, visual Q&A, image analysis
   */
  VISION_IN: {
    category: 'VISION_IN',
    primaryModelId: 'gemini-3-pro-preview',
    fallbackModelIds: [
      'gemini-2.5-pro',
      'gemini-2.5-flash'
    ]
  },
  
  /**
   * IMAGE_GEN Tasks
   * Primary: Imagen 4.0 (Requirement 15.7)
   * Fallback: Gemini 3 Pro Preview (Requirement 16.7)
   * 
   * Use cases: Image generation from text prompts
   */
  IMAGE_GEN: {
    category: 'IMAGE_GEN',
    primaryModelId: 'imagen-4.0',
    fallbackModelIds: [
      'gemini-3-pro-preview'
    ]
  },
  
  /**
   * VIDEO_GEN Tasks
   * Primary: Veo 3.1 (Requirement 15.8)
   * Fallback: None (video generation is specialized)
   * 
   * Use cases: Video generation from text prompts
   * Note: Limited rate limits (5 RPM, 100 RPD)
   */
  VIDEO_GEN: {
    category: 'VIDEO_GEN',
    primaryModelId: 'veo-3.1',
    fallbackModelIds: []
  },
  
  /**
   * MULTILINGUAL Tasks
   * Primary: Groq Mistral Saba 24B (Requirement 15.9)
   * Fallback: Gemini 2.5 Pro → Cerebras Llama 3.3 70B → Gemini 3 Pro Preview (Requirement 16.8)
   * 
   * Use cases: Non-English conversations, translation, multilingual content
   */
  MULTILINGUAL: {
    category: 'MULTILINGUAL',
    primaryModelId: 'groq-mistral-saba-24b',
    fallbackModelIds: [
      'gemini-2.5-pro',
      'cerebras-llama-3.3-70b',
      'gemini-3-pro-preview'
    ]
  },
  
  /**
   * AGENTIC Tasks
   * Primary: Gemini 3 Pro Preview (Requirement 15.10)
   * Fallback: Gemini 2.5 Pro → Cerebras GPT-OSS 120B (Requirement 16.9)
   * 
   * Use cases: Computer use, tool calling, automation, agentic workflows
   */
  AGENTIC: {
    category: 'AGENTIC',
    primaryModelId: 'gemini-3-pro-preview',
    fallbackModelIds: [
      'gemini-2.5-pro',
      'cerebras-gpt-oss-120b'
    ]
  },
  
  /**
   * LONG_CONTEXT Tasks
   * Primary: Gemini 2.5 Flash (Requirement 15.11)
   * Fallback: Gemini 2.5 Pro → Gemini 3 Pro Preview (Requirement 16.10)
   * 
   * Use cases: Processing very long documents, large context windows (>100K tokens)
   * Condition: Triggered when token count exceeds 100,000
   */
  LONG_CONTEXT: {
    category: 'LONG_CONTEXT',
    primaryModelId: 'gemini-2.5-flash',
    fallbackModelIds: [
      'gemini-2.5-pro',
      'gemini-3-pro-preview'
    ],
    conditions: [
      {
        type: 'TOKEN_COUNT',
        operator: 'GT',
        value: 100000
      }
    ]
  }
};

/**
 * Get routing rule for a specific task category
 * 
 * @param category - The task category to get routing rule for
 * @returns The routing rule for the category, or undefined if not found
 */
export function getRoutingRule(category: TaskCategory): RoutingRule | undefined {
  return ROUTING_RULES_CONFIG[category];
}

/**
 * Get all routing rules
 * 
 * @returns Array of all routing rules
 */
export function getAllRoutingRules(): RoutingRule[] {
  return Object.values(ROUTING_RULES_CONFIG);
}

/**
 * Get primary model ID for a task category
 * 
 * @param category - The task category
 * @returns The primary model ID for the category
 */
export function getPrimaryModelId(category: TaskCategory): string {
  return ROUTING_RULES_CONFIG[category].primaryModelId;
}

/**
 * Get fallback chain for a task category
 * 
 * @param category - The task category
 * @returns Array of fallback model IDs
 */
export function getFallbackChain(category: TaskCategory): string[] {
  return ROUTING_RULES_CONFIG[category].fallbackModelIds;
}

/**
 * Check if a category has fallback models
 * 
 * @param category - The task category
 * @returns True if the category has fallback models
 */
export function hasFallbackModels(category: TaskCategory): boolean {
  return ROUTING_RULES_CONFIG[category].fallbackModelIds.length > 0;
}

/**
 * Get all task categories
 * 
 * @returns Array of all task categories
 */
export function getAllTaskCategories(): TaskCategory[] {
  return Object.keys(ROUTING_RULES_CONFIG) as TaskCategory[];
}

/**
 * Validate that all model IDs in routing rules exist in the model registry
 * 
 * @param validModelIds - Set of valid model IDs from the model registry
 * @returns Object with validation results
 */
export function validateRoutingRules(validModelIds: Set<string>): {
  isValid: boolean;
  invalidModelIds: string[];
  missingCategories: TaskCategory[];
} {
  const invalidModelIds: string[] = [];
  const missingCategories: TaskCategory[] = [];
  
  // Check all categories
  const allCategories: TaskCategory[] = [
    'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
    'VISION_IN', 'IMAGE_GEN', 'VIDEO_GEN', 'MULTILINGUAL',
    'AGENTIC', 'LONG_CONTEXT'
  ];
  
  for (const category of allCategories) {
    const rule = ROUTING_RULES_CONFIG[category];
    
    if (!rule) {
      missingCategories.push(category);
      continue;
    }
    
    // Check primary model
    if (!validModelIds.has(rule.primaryModelId)) {
      invalidModelIds.push(rule.primaryModelId);
    }
    
    // Check fallback models
    for (const fallbackId of rule.fallbackModelIds) {
      if (!validModelIds.has(fallbackId)) {
        invalidModelIds.push(fallbackId);
      }
    }
  }
  
  return {
    isValid: invalidModelIds.length === 0 && missingCategories.length === 0,
    invalidModelIds: [...new Set(invalidModelIds)], // Remove duplicates
    missingCategories
  };
}

/**
 * Export default routing rules configuration
 */
export default ROUTING_RULES_CONFIG;
