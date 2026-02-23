/**
 * Cerebras Provider Adapter
 * Implements API calls to Cerebras Cloud API for ultra-fast inference
 * Supports: Llama 3.1/3.3, Qwen 3, GPT-OSS, GLM 4.7
 */

import { BaseProviderAdapter, type GenerateRequest, type GenerateResponse, type MessageData } from './types';
import { createUserFriendlyError } from '@/lib/model-config';

const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';

interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CerebrasResponse {
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

export class CerebrasAdapter extends BaseProviderAdapter {
  readonly provider = 'cerebras' as const;
  
  isAvailable(): boolean {
    return !!process.env.CEREBRAS_API_KEY;
  }
  
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { model, prompt, systemPrompt, history, params } = request;
    const mergedParams = this.mergeParams(model, params);
    
    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      throw createUserFriendlyError(
        new Error('CEREBRAS_API_KEY not configured'),
        'cerebras',
        model.id
      );
    }
    
    // Build messages array for OpenAI-compatible format
    const messages = this.buildMessages(prompt, systemPrompt, history);
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout for Netlify
      
      const response = await fetch(CEREBRAS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.modelId,
          messages,
          temperature: mergedParams.temperature,
          top_p: mergedParams.topP,
          max_tokens: mergedParams.maxOutputTokens,
          stream: false,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Cerebras API Error for ${model.id}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        
        if (response.status === 401 || response.status === 403) {
          throw createUserFriendlyError(
            new Error(`Authentication failed: ${errorText}`),
            'cerebras',
            model.id
          );
        }
        
        if (response.status === 429) {
          throw createUserFriendlyError(
            new Error(`Rate limit exceeded: ${errorText}`),
            'cerebras',
            model.id
          );
        }
        
        // Critical failures that should trigger immediate fallback
        if (response.status === 503 || response.status === 502 || response.status === 504) {
          throw createUserFriendlyError(
            new Error(`Service Unavailable (${response.status}): ${errorText}`),
            'cerebras',
            model.id
          );
        }
        
        throw createUserFriendlyError(
          new Error(`API error: ${response.status} - ${errorText}`),
          'cerebras',
          model.id
        );
      }
      
      const data = await response.json() as CerebrasResponse;
      
      if (data.error) {
        console.error(`Cerebras Model Error for ${model.id}:`, data.error.message);
        throw createUserFriendlyError(
          new Error(data.error.message),
          'cerebras',
          model.id
        );
      }
      
      const choice = data.choices?.[0];
      if (!choice || !choice.message?.content) {
        throw createUserFriendlyError(
          new Error('No response generated'),
          'cerebras',
          model.id
        );
      }
      
      const generatedText = choice.message.content;
      
      return this.createResponse(generatedText, model.id);
    } catch (error) {
      if (error instanceof Error && error.name === 'AIServiceError') {
        throw error;
      }
      
      // Handle AbortController timeout
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Cerebras request timeout for ${model.id}`);
        throw createUserFriendlyError(
          new Error('Request timeout - the AI service took too long to respond'),
          'cerebras',
          model.id
        );
      }
      
      // Handle fetch failed errors (network issues, missing API key in production, etc.)
      if (error instanceof Error && error.message.includes('fetch failed')) {
        console.error(`Cerebras fetch failed for ${model.id}:`, error.message);
        throw createUserFriendlyError(
          new Error('Network error - unable to connect to AI service. Please check your API key configuration.'),
          'cerebras',
          model.id
        );
      }
      
      // Log the actual error for debugging
      console.error(`Cerebras Adapter Error for ${model.id}:`, error);
      
      // Check if this is a critical failure that should trigger smart fallback
      if (this.isCriticalFailure(error)) {
        console.warn(`Critical Cerebras failure for ${model.id}, will trigger smart fallback`);
      }
      
      throw createUserFriendlyError(error, 'cerebras', model.id);
    }
  }
  
  /**
   * Build messages array for OpenAI-compatible format
   */
  private buildMessages(prompt: string, systemPrompt?: string, history?: MessageData[]): CerebrasMessage[] {
    const messages: CerebrasMessage[] = [];
    
    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }
    
    // Add conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        const content = typeof msg.content === 'string' 
          ? msg.content 
          : msg.content.map(c => c.text).join('');
        
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content,
        });
      }
    }
    
    // Add current user message
    messages.push({
      role: 'user',
      content: prompt,
    });
    
    return messages;
  }
  
  /**
   * Check if error indicates critical Cerebras failure
   */
  private isCriticalFailure(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return (
      errorMessage.includes('service unavailable') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('overloaded') ||
      errorMessage.includes('503') ||
      errorMessage.includes('502') ||
      errorMessage.includes('504')
    );
  }
}

// Singleton instance
let instance: CerebrasAdapter | null = null;

export function getCerebrasAdapter(): CerebrasAdapter {
  if (!instance) {
    instance = new CerebrasAdapter();
  }
  return instance;
}
