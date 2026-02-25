/**
 * Unit tests for Routing Rules Configuration
 * 
 * Tests the routing rules configuration for all 11 task categories
 * Requirements: 15.1-15.12, 16.1-16.10
 */

import { describe, it, expect } from 'vitest';
import {
  ROUTING_RULES_CONFIG,
  getRoutingRule,
  getAllRoutingRules,
  getPrimaryModelId,
  getFallbackChain,
  hasFallbackModels,
  getAllTaskCategories,
  validateRoutingRules
} from './routing-rules-config';
import type { TaskCategory } from './model-registry-v3';

describe('Routing Rules Configuration', () => {
  describe('ROUTING_RULES_CONFIG', () => {
    it('should have routing rules for all 11 task categories', () => {
      const expectedCategories: TaskCategory[] = [
        'SIMPLE', 'MEDIUM', 'COMPLEX', 'CODING', 'REASONING',
        'VISION_IN', 'IMAGE_GEN', 'VIDEO_GEN', 'MULTILINGUAL',
        'AGENTIC', 'LONG_CONTEXT'
      ];
      
      const actualCategories = Object.keys(ROUTING_RULES_CONFIG);
      expect(actualCategories).toHaveLength(11);
      
      for (const category of expectedCategories) {
        expect(ROUTING_RULES_CONFIG).toHaveProperty(category);
      }
    });
    
    it('should map SIMPLE tasks to Cerebras Llama 4 Scout 17B (Requirement 15.1)', () => {
      expect(ROUTING_RULES_CONFIG.SIMPLE.primaryModelId).toBe('cerebras-llama-4-scout-17b');
    });
    
    it('should map MEDIUM tasks to Cerebras Llama 3.3 70B (Requirement 15.2)', () => {
      expect(ROUTING_RULES_CONFIG.MEDIUM.primaryModelId).toBe('cerebras-llama-3.3-70b');
    });
    
    it('should map COMPLEX tasks to Cerebras GPT-OSS 120B (Requirement 15.3)', () => {
      expect(ROUTING_RULES_CONFIG.COMPLEX.primaryModelId).toBe('cerebras-gpt-oss-120b');
    });
    
    it('should map CODING tasks to Cerebras DeepSeek V3 0324 (Requirement 15.4)', () => {
      expect(ROUTING_RULES_CONFIG.CODING.primaryModelId).toBe('cerebras-deepseek-v3-0324');
    });
    
    it('should map REASONING tasks to Cerebras GPT-OSS 120B (Requirement 15.5)', () => {
      expect(ROUTING_RULES_CONFIG.REASONING.primaryModelId).toBe('cerebras-gpt-oss-120b');
    });
    
    it('should map VISION_IN tasks to Gemini 3 Pro Preview (Requirement 15.6)', () => {
      expect(ROUTING_RULES_CONFIG.VISION_IN.primaryModelId).toBe('gemini-3-pro-preview');
    });
    
    it('should map IMAGE_GEN tasks to Imagen 4.0 (Requirement 15.7)', () => {
      expect(ROUTING_RULES_CONFIG.IMAGE_GEN.primaryModelId).toBe('imagen-4.0');
    });
    
    it('should map VIDEO_GEN tasks to Veo 3.1 (Requirement 15.8)', () => {
      expect(ROUTING_RULES_CONFIG.VIDEO_GEN.primaryModelId).toBe('veo-3.1');
    });
    
    it('should map MULTILINGUAL tasks to Groq Mistral Saba 24B (Requirement 15.9)', () => {
      expect(ROUTING_RULES_CONFIG.MULTILINGUAL.primaryModelId).toBe('groq-mistral-saba-24b');
    });
    
    it('should map AGENTIC tasks to Gemini 3 Pro Preview (Requirement 15.10)', () => {
      expect(ROUTING_RULES_CONFIG.AGENTIC.primaryModelId).toBe('gemini-3-pro-preview');
    });
    
    it('should map LONG_CONTEXT tasks to Gemini 2.5 Flash (Requirement 15.11)', () => {
      expect(ROUTING_RULES_CONFIG.LONG_CONTEXT.primaryModelId).toBe('gemini-2.5-flash');
    });
  });
  
  describe('Fallback Chains', () => {
    it('should have fallback chain for SIMPLE tasks (Requirement 16.1)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.SIMPLE.fallbackModelIds;
      expect(fallbacks).toContain('cerebras-llama-3.3-70b');
      expect(fallbacks[0]).toBe('cerebras-llama-3.3-70b');
    });
    
    it('should have fallback chain for MEDIUM tasks (Requirement 16.2)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.MEDIUM.fallbackModelIds;
      expect(fallbacks).toContain('cerebras-gpt-oss-120b');
      expect(fallbacks[0]).toBe('cerebras-gpt-oss-120b');
    });
    
    it('should have fallback chain for COMPLEX tasks (Requirement 16.3)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.COMPLEX.fallbackModelIds;
      expect(fallbacks).toContain('gemini-2.5-pro');
      expect(fallbacks[0]).toBe('gemini-2.5-pro');
    });
    
    it('should have fallback chain for CODING tasks (Requirement 16.4)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.CODING.fallbackModelIds;
      expect(fallbacks).toContain('cerebras-gpt-oss-120b');
      expect(fallbacks[0]).toBe('cerebras-gpt-oss-120b');
    });
    
    it('should have fallback chain for REASONING tasks (Requirement 16.5)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.REASONING.fallbackModelIds;
      expect(fallbacks).toContain('gemini-2.5-pro');
      expect(fallbacks[0]).toBe('gemini-2.5-pro');
    });
    
    it('should have fallback chain for VISION_IN tasks (Requirement 16.6)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.VISION_IN.fallbackModelIds;
      expect(fallbacks).toContain('gemini-2.5-pro');
      expect(fallbacks[0]).toBe('gemini-2.5-pro');
    });
    
    it('should have fallback chain for IMAGE_GEN tasks (Requirement 16.7)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.IMAGE_GEN.fallbackModelIds;
      expect(fallbacks).toContain('gemini-3-pro-preview');
    });
    
    it('should have fallback chain for MULTILINGUAL tasks (Requirement 16.8)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.MULTILINGUAL.fallbackModelIds;
      expect(fallbacks).toContain('gemini-2.5-pro');
      expect(fallbacks[0]).toBe('gemini-2.5-pro');
    });
    
    it('should have fallback chain for AGENTIC tasks (Requirement 16.9)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.AGENTIC.fallbackModelIds;
      expect(fallbacks).toContain('gemini-2.5-pro');
      expect(fallbacks[0]).toBe('gemini-2.5-pro');
    });
    
    it('should have fallback chain for LONG_CONTEXT tasks (Requirement 16.10)', () => {
      const fallbacks = ROUTING_RULES_CONFIG.LONG_CONTEXT.fallbackModelIds;
      expect(fallbacks).toContain('gemini-2.5-pro');
      expect(fallbacks[0]).toBe('gemini-2.5-pro');
    });
    
    it('should have empty fallback chain for VIDEO_GEN tasks', () => {
      const fallbacks = ROUTING_RULES_CONFIG.VIDEO_GEN.fallbackModelIds;
      expect(fallbacks).toHaveLength(0);
    });
  });
  
  describe('Helper Functions', () => {
    describe('getRoutingRule', () => {
      it('should return routing rule for valid category', () => {
        const rule = getRoutingRule('SIMPLE');
        expect(rule).toBeDefined();
        expect(rule?.category).toBe('SIMPLE');
        expect(rule?.primaryModelId).toBe('cerebras-llama-4-scout-17b');
      });
      
      it('should return undefined for invalid category', () => {
        const rule = getRoutingRule('INVALID' as TaskCategory);
        expect(rule).toBeUndefined();
      });
    });
    
    describe('getAllRoutingRules', () => {
      it('should return all 11 routing rules', () => {
        const rules = getAllRoutingRules();
        expect(rules).toHaveLength(11);
      });
    });
    
    describe('getPrimaryModelId', () => {
      it('should return primary model ID for category', () => {
        expect(getPrimaryModelId('CODING')).toBe('cerebras-deepseek-v3-0324');
        expect(getPrimaryModelId('VISION_IN')).toBe('gemini-3-pro-preview');
      });
    });
    
    describe('getFallbackChain', () => {
      it('should return fallback chain for category', () => {
        const chain = getFallbackChain('COMPLEX');
        expect(chain).toContain('gemini-2.5-pro');
        expect(chain.length).toBeGreaterThan(0);
      });
      
      it('should return empty array for VIDEO_GEN', () => {
        const chain = getFallbackChain('VIDEO_GEN');
        expect(chain).toHaveLength(0);
      });
    });
    
    describe('hasFallbackModels', () => {
      it('should return true for categories with fallbacks', () => {
        expect(hasFallbackModels('SIMPLE')).toBe(true);
        expect(hasFallbackModels('CODING')).toBe(true);
      });
      
      it('should return false for VIDEO_GEN', () => {
        expect(hasFallbackModels('VIDEO_GEN')).toBe(false);
      });
    });
    
    describe('getAllTaskCategories', () => {
      it('should return all 11 task categories', () => {
        const categories = getAllTaskCategories();
        expect(categories).toHaveLength(11);
        expect(categories).toContain('SIMPLE');
        expect(categories).toContain('CODING');
        expect(categories).toContain('VISION_IN');
      });
    });
    
    describe('validateRoutingRules', () => {
      it('should validate all model IDs exist', () => {
        const validModelIds = new Set([
          'cerebras-llama-4-scout-17b',
          'cerebras-llama-3.3-70b',
          'cerebras-gpt-oss-120b',
          'cerebras-deepseek-v3-0324',
          'groq-llama-3.2-3b',
          'groq-mistral-saba-24b',
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-3-pro-preview',
          'imagen-4.0',
          'veo-3.1'
        ]);
        
        const result = validateRoutingRules(validModelIds);
        expect(result.isValid).toBe(true);
        expect(result.invalidModelIds).toHaveLength(0);
        expect(result.missingCategories).toHaveLength(0);
      });
      
      it('should detect invalid model IDs', () => {
        const validModelIds = new Set(['cerebras-llama-4-scout-17b']);
        
        const result = validateRoutingRules(validModelIds);
        expect(result.isValid).toBe(false);
        expect(result.invalidModelIds.length).toBeGreaterThan(0);
      });
    });
  });
  
  describe('Routing Conditions', () => {
    it('should have TOKEN_COUNT condition for LONG_CONTEXT', () => {
      const rule = ROUTING_RULES_CONFIG.LONG_CONTEXT;
      expect(rule.conditions).toBeDefined();
      expect(rule.conditions).toHaveLength(1);
      expect(rule.conditions![0].type).toBe('TOKEN_COUNT');
      expect(rule.conditions![0].operator).toBe('GT');
      expect(rule.conditions![0].value).toBe(100000);
    });
    
    it('should not have conditions for most categories', () => {
      expect(ROUTING_RULES_CONFIG.SIMPLE.conditions).toBeUndefined();
      expect(ROUTING_RULES_CONFIG.CODING.conditions).toBeUndefined();
      expect(ROUTING_RULES_CONFIG.VISION_IN.conditions).toBeUndefined();
    });
  });
});
