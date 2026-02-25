/**
 * Integration tests for Routing Rules with IntelligentRouterService
 * 
 * Verifies that the routing rules configuration integrates correctly
 * with the IntelligentRouterService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IntelligentRouterService } from './intelligent-router-service';
import { ROUTING_RULES_CONFIG } from './routing-rules-config';
import type { ExtendedModelConfig, TaskCategory } from './model-registry-v3';

describe('Routing Rules Integration', () => {
  let routerService: IntelligentRouterService;
  let mockModels: ExtendedModelConfig[];
  
  beforeEach(() => {
    // Create mock models for all model IDs used in routing rules
    mockModels = [
      {
        id: 'cerebras-llama-4-scout-17b',
        name: 'Cerebras Llama 4 Scout 17B',
        provider: 'cerebras',
        modelId: 'llama-4-scout-17b',
        category: 'general',
        description: 'Fast model for simple tasks',
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 4096,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
        enabled: true
      },
      {
        id: 'cerebras-llama-3.3-70b',
        name: 'Cerebras Llama 3.3 70B',
        provider: 'cerebras',
        modelId: 'llama3.3-70b',
        category: 'general',
        description: 'Powerful model for medium tasks',
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 90,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 4096 },
        enabled: true
      },
      {
        id: 'cerebras-gpt-oss-120b',
        name: 'Cerebras GPT-OSS 120B',
        provider: 'cerebras',
        modelId: 'gpt-oss-120b',
        category: 'coding',
        description: 'Large model for complex tasks',
        contextWindow: 16384,
        supportsStreaming: true,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 95,
        defaultParams: { temperature: 0.5, topP: 0.9, maxOutputTokens: 4096 },
        enabled: true
      },
      {
        id: 'cerebras-deepseek-v3-0324',
        name: 'Cerebras DeepSeek V3 0324',
        provider: 'cerebras',
        modelId: 'deepseek-v3-0324',
        category: 'coding',
        description: 'Specialized coding model',
        contextWindow: 32768,
        supportsStreaming: true,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
        priority: 100,
        defaultParams: { temperature: 0.3, topP: 0.9, maxOutputTokens: 4096 },
        enabled: true
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        modelId: 'gemini-2.5-flash',
        category: 'multimodal',
        description: 'Fast multimodal model',
        contextWindow: 1048576,
        supportsStreaming: false,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }, { type: 'VISION' }],
        rateLimit: { requestsPerMinute: 15, requestsPerDay: 1500 },
        priority: 90,
        defaultParams: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
        enabled: true
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        modelId: 'gemini-2.5-pro',
        category: 'multimodal',
        description: 'Advanced multimodal model',
        contextWindow: 1048576,
        supportsStreaming: false,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }, { type: 'VISION' }],
        rateLimit: { requestsPerMinute: 15, requestsPerDay: 1500 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
        enabled: true
      },
      {
        id: 'gemini-3-pro-preview',
        name: 'Gemini 3 Pro Preview',
        provider: 'google',
        modelId: 'gemini-3-pro-preview',
        category: 'multimodal',
        description: 'Next-gen model with computer use',
        contextWindow: 2097152,
        supportsStreaming: false,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }, { type: 'VISION' }, { type: 'COMPUTER_USE' }],
        rateLimit: { requestsPerMinute: 15, requestsPerDay: 1500 },
        priority: 100,
        defaultParams: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
        enabled: true
      },
      {
        id: 'groq-llama-3.2-3b',
        name: 'Llama 3.2 3B',
        provider: 'groq',
        modelId: 'llama-3.2-3b-preview',
        category: 'general',
        description: 'Task classification model',
        contextWindow: 8192,
        supportsStreaming: true,
        maxOutputTokens: 2048,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 30, requestsPerDay: 14400 },
        priority: 90,
        defaultParams: { temperature: 0.5, topP: 0.9, maxOutputTokens: 1024 },
        enabled: true
      },
      {
        id: 'groq-mistral-saba-24b',
        name: 'Mistral Saba 24B',
        provider: 'groq',
        modelId: 'mistral-saba-24b',
        category: 'general',
        description: 'Multilingual model',
        contextWindow: 32768,
        supportsStreaming: true,
        maxOutputTokens: 8192,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'TEXT' }],
        rateLimit: { requestsPerMinute: 30, requestsPerDay: 14400 },
        priority: 80,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 4096 },
        enabled: true
      },
      {
        id: 'imagen-4.0',
        name: 'Imagen 4.0',
        provider: 'google',
        modelId: 'imagen-4.0',
        category: 'multimodal',
        description: 'Image generation model',
        contextWindow: 2048,
        supportsStreaming: false,
        maxOutputTokens: 0,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'IMAGE_GEN' }],
        rateLimit: { requestsPerMinute: 15, requestsPerDay: 1500 },
        priority: 95,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 0 },
        enabled: true
      },
      {
        id: 'veo-3.1',
        name: 'Veo 3.1',
        provider: 'google',
        modelId: 'veo-3.1',
        category: 'multimodal',
        description: 'Video generation model',
        contextWindow: 2048,
        supportsStreaming: false,
        maxOutputTokens: 0,
        lifecycle: { status: 'ACTIVE' },
        capabilities: [{ type: 'VIDEO_GEN' }],
        rateLimit: { requestsPerMinute: 5, requestsPerDay: 100 },
        priority: 100,
        defaultParams: { temperature: 0.7, topP: 0.9, maxOutputTokens: 0 },
        enabled: true
      }
    ];
    
    routerService = new IntelligentRouterService(mockModels);
  });
  
  describe('Routing Rules Configuration Integration', () => {
    it('should use routing rules from ROUTING_RULES_CONFIG', () => {
      const allRules = routerService.getAllRoutingRules();
      expect(allRules).toHaveLength(11);
      
      // Verify a few key rules match the configuration
      const simpleRule = routerService.getRoutingRule('SIMPLE');
      expect(simpleRule?.primaryModelId).toBe(ROUTING_RULES_CONFIG.SIMPLE.primaryModelId);
      
      const codingRule = routerService.getRoutingRule('CODING');
      expect(codingRule?.primaryModelId).toBe(ROUTING_RULES_CONFIG.CODING.primaryModelId);
    });
    
    it('should route SIMPLE tasks to correct primary model', async () => {
      const result = await routerService.route({
        classification: {
          category: 'SIMPLE',
          confidence: 0.95,
          reasoning: 'Simple greeting',
          estimatedComplexity: 'LOW',
          estimatedTokens: 100,
          requiresMultimodal: false,
          classifiedAt: new Date().toISOString(),
          classifierModelUsed: 'groq-llama-3.2-3b'
        },
        userMessage: 'Hello!'
      });
      
      expect(result.selectedModel.id).toBe('cerebras-llama-4-scout-17b');
    });
    
    it('should route CODING tasks to correct primary model', async () => {
      const result = await routerService.route({
        classification: {
          category: 'CODING',
          confidence: 0.95,
          reasoning: 'Code generation request',
          estimatedComplexity: 'MEDIUM',
          estimatedTokens: 500,
          requiresMultimodal: false,
          classifiedAt: new Date().toISOString(),
          classifierModelUsed: 'groq-llama-3.2-3b'
        },
        userMessage: 'Write a function to sort an array'
      });
      
      expect(result.selectedModel.id).toBe('cerebras-deepseek-v3-0324');
    });
    
    it('should build correct fallback chain for SIMPLE tasks', async () => {
      const result = await routerService.route({
        classification: {
          category: 'SIMPLE',
          confidence: 0.95,
          reasoning: 'Simple query',
          estimatedComplexity: 'LOW',
          estimatedTokens: 100,
          requiresMultimodal: false,
          classifiedAt: new Date().toISOString(),
          classifierModelUsed: 'groq-llama-3.2-3b'
        },
        userMessage: 'What is 2+2?'
      });
      
      const fallbackIds = result.fallbackChain.map(m => m.id);
      expect(fallbackIds).toContain('cerebras-llama-3.3-70b');
      expect(fallbackIds).toContain('groq-llama-3.2-3b');
      expect(fallbackIds).toContain('gemini-2.5-flash');
    });
    
    it('should build correct fallback chain for CODING tasks', async () => {
      const result = await routerService.route({
        classification: {
          category: 'CODING',
          confidence: 0.95,
          reasoning: 'Code generation',
          estimatedComplexity: 'MEDIUM',
          estimatedTokens: 500,
          requiresMultimodal: false,
          classifiedAt: new Date().toISOString(),
          classifierModelUsed: 'groq-llama-3.2-3b'
        },
        userMessage: 'Write a sorting algorithm'
      });
      
      const fallbackIds = result.fallbackChain.map(m => m.id);
      expect(fallbackIds[0]).toBe('cerebras-gpt-oss-120b');
      expect(fallbackIds[1]).toBe('gemini-2.5-pro');
      expect(fallbackIds[2]).toBe('cerebras-llama-3.3-70b');
    });
    
    it('should handle LONG_CONTEXT with conditions', async () => {
      const result = await routerService.route({
        classification: {
          category: 'LONG_CONTEXT',
          confidence: 0.95,
          reasoning: 'Very long document',
          estimatedComplexity: 'HIGH',
          estimatedTokens: 150000,
          requiresMultimodal: false,
          classifiedAt: new Date().toISOString(),
          classifierModelUsed: 'groq-llama-3.2-3b'
        },
        userMessage: 'Analyze this long document'
      });
      
      expect(result.selectedModel.id).toBe('gemini-2.5-flash');
      expect(result.fallbackChain.map(m => m.id)).toContain('gemini-2.5-pro');
    });
  });
});
