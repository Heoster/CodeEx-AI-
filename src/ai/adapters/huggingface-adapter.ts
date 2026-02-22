/**
 * Hugging Face Router Provider Adapter
 * Implements API calls to Hugging Face's new Router API
 * Uses the new router.huggingface.co endpoint (OpenAI-compatible)
 */

import { BaseProviderAdapter, type GenerateRequest, type GenerateResponse, type MessageData } from './types';
import { createUserFriendlyError } from '@/lib/model-config';

const HUGGINGFACE_ROUTER_URL = 'https://router.huggingface.co/v1';

interface HuggingFaceMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface HuggingFaceRequest {
  model: string;
  messages: HuggingFaceMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

interface HuggingFaceResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

export class HuggingFaceAdapter extends BaseProviderAdapter {
  readonly provider = 'huggingface' as const;
  
  isAvailable(): boolean {
    return !!process.env.HUGGINGFACE_API_KEY;
  }
  
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { model, prompt, systemPrompt, history, params } = request;
    const mergedParams = this.mergeParams(model, params);
    
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw createUserFriendlyError(
        new Error('HUGGINGFACE_API_KEY not configured'),
        'huggingface',
        model.id
      );
    }
    
    // Build messages array for OpenAI-compatible format
    const messages = this.buildMessages(prompt, systemPrompt, history);
    
    try {
      const apiUrl = `${HUGGINGFACE_ROUTER_URL}/chat/completions`;
      
      const requestBody: HuggingFaceRequest = {
        model: model.modelId,
        messages,
        max_tokens: mergedParams.maxOutputTokens,
        temperature: mergedParams.temperature,
        top_p: mergedParams.topP,
        stream: false,
      };
      
      console.log(`Calling Hugging Face Router API: ${apiUrl}`);
      console.log(`Model: ${model.modelId}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for Netlify
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Hugging Face API Error for ${model.id}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        
        if (response.status === 401 || response.status === 403) {
          throw createUserFriendlyError(
            new Error(`Authentication failed: ${errorText}`),
            'huggingface',
            model.id
          );
        }
        
        if (response.status === 429) {
          throw createUserFriendlyError(
            new Error(`Rate limit exceeded: ${errorText}`),
            'huggingface',
            model.id
          );
        }
        
        // Model not found or not available
        if (response.status === 404) {
          throw createUserFriendlyError(
            new Error(`Model ${model.modelId} not found or not available`),
            'huggingface',
            model.id
          );
        }
        
        // Critical failures that should trigger immediate fallback
        if (response.status === 503 || response.status === 502 || response.status === 504) {
          throw createUserFriendlyError(
            new Error(`Service Unavailable (${response.status}): ${errorText}`),
            'huggingface',
            model.id
          );
        }
        
        throw createUserFriendlyError(
          new Error(`API error: ${response.status} - ${errorText}`),
          'huggingface',
          model.id
        );
      }
      
      const data = await response.json() as HuggingFaceResponse;
      
      if (data.error) {
        console.error(`Hugging Face Model Error for ${model.id}:`, data.error.message);
        throw createUserFriendlyError(
          new Error(data.error.message),
          'huggingface',
          model.id
        );
      }
      
      const choice = data.choices?.[0];
      if (!choice || !choice.message?.content) {
        throw createUserFriendlyError(
          new Error('No response generated'),
          'huggingface',
          model.id
        );
      }
      
      const generatedText = choice.message.content;
      
      // Convert Hugging Face usage format to our standard format
      const usage = data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
      } : undefined;
      
      return this.createResponse(generatedText, model.id, usage);
    } catch (error) {
      if (error instanceof Error && error.name === 'AIServiceError') {
        throw error;
      }
      
      // Handle AbortController timeout
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Hugging Face request timeout for ${model.id}`);
        throw createUserFriendlyError(
          new Error('Request timeout - the AI service took too long to respond'),
          'huggingface',
          model.id
        );
      }
      
      // Handle fetch failed errors
      if (error instanceof Error && error.message.includes('fetch failed')) {
        console.error(`Hugging Face fetch failed for ${model.id}:`, error.message);
        throw createUserFriendlyError(
          new Error('Network error - unable to connect to AI service. Please check your API key configuration.'),
          'huggingface',
          model.id
        );
      }
      
      // Log the actual error for debugging
      console.error(`Hugging Face Adapter Error for ${model.id}:`, error);
      
      // Check if this is a critical failure that should trigger smart fallback
      if (this.isCriticalFailure(error)) {
        console.warn(`Critical Hugging Face failure for ${model.id}, will trigger smart fallback`);
      }
      
      throw createUserFriendlyError(error, 'huggingface', model.id);
    }
  }
  
  /**
   * Build messages array for OpenAI-compatible format
   */
  private buildMessages(prompt: string, systemPrompt?: string, history?: MessageData[]): HuggingFaceMessage[] {
    const messages: HuggingFaceMessage[] = [];
    
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
        const text = typeof msg.content === 'string' 
          ? msg.content 
          : msg.content.map(c => c.text).join('');
        
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: text,
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
   * Check if error indicates critical Hugging Face failure
   */
  private isCriticalFailure(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return (
      errorMessage.includes('service unavailable') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('quota exceeded') ||
      errorMessage.includes('overloaded') ||
      errorMessage.includes('503') ||
      errorMessage.includes('502') ||
      errorMessage.includes('504') ||
      errorMessage.includes('Model is currently loading')
    );
  }
}

// Singleton instance
let instance: HuggingFaceAdapter | null = null;

export function getHuggingFaceAdapter(): HuggingFaceAdapter {
  if (!instance) {
    instance = new HuggingFaceAdapter();
  }
  return instance;
}