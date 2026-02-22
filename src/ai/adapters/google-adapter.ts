/**
 * Google Gemini Provider Adapter
 * Implements API calls to Google's Gemini API
 * Free tier: 15 requests/minute, 1500 requests/day
 */

import { BaseProviderAdapter, type GenerateRequest, type GenerateResponse, type MessageData } from './types';
import { createUserFriendlyError } from '@/lib/model-config';

const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GoogleContent {
  parts: Array<{ text: string }>;
  role?: 'user' | 'model';
}

interface GoogleRequest {
  contents: GoogleContent[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GoogleResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
    finishReason: string;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  error?: {
    message: string;
    code: number;
  };
}

export class GoogleAdapter extends BaseProviderAdapter {
  readonly provider = 'google' as const;
  
  isAvailable(): boolean {
    return !!process.env.GOOGLE_API_KEY;
  }
  
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { model, prompt, systemPrompt, history, params } = request;
    const mergedParams = this.mergeParams(model, params);
    
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw createUserFriendlyError(
        new Error('GOOGLE_API_KEY not configured'),
        'google',
        model.id
      );
    }
    
    // Build contents array for Gemini format
    const contents = this.buildContents(prompt, systemPrompt, history);
    
    try {
      const apiUrl = `${GOOGLE_API_URL}/${model.modelId}:generateContent?key=${apiKey}`;
      
      const requestBody: GoogleRequest = {
        contents,
        generationConfig: {
          temperature: mergedParams.temperature,
          topP: mergedParams.topP,
          topK: mergedParams.topK,
          maxOutputTokens: mergedParams.maxOutputTokens,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      };
      
      console.log(`Calling Google Gemini API: ${apiUrl}`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for Netlify
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google API Error for ${model.id}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        
        if (response.status === 401 || response.status === 403) {
          throw createUserFriendlyError(
            new Error(`Authentication failed: ${errorText}`),
            'google',
            model.id
          );
        }
        
        if (response.status === 429) {
          throw createUserFriendlyError(
            new Error(`Rate limit exceeded: ${errorText}`),
            'google',
            model.id
          );
        }
        
        // Critical failures that should trigger immediate fallback
        if (response.status === 503 || response.status === 502 || response.status === 504) {
          throw createUserFriendlyError(
            new Error(`Service Unavailable (${response.status}): ${errorText}`),
            'google',
            model.id
          );
        }
        
        throw createUserFriendlyError(
          new Error(`API error: ${response.status} - ${errorText}`),
          'google',
          model.id
        );
      }
      
      const data = await response.json() as GoogleResponse;
      
      if (data.error) {
        console.error(`Google Model Error for ${model.id}:`, data.error.message);
        throw createUserFriendlyError(
          new Error(data.error.message),
          'google',
          model.id
        );
      }
      
      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw createUserFriendlyError(
          new Error('No response generated'),
          'google',
          model.id
        );
      }
      
      const generatedText = candidate.content.parts[0].text;
      
      // Convert Google usage format to our standard format
      const usage = data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount,
      } : undefined;
      
      return this.createResponse(generatedText, model.id, usage);
    } catch (error) {
      if (error instanceof Error && error.name === 'AIServiceError') {
        throw error;
      }
      
      // Handle AbortController timeout
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Google request timeout for ${model.id}`);
        throw createUserFriendlyError(
          new Error('Request timeout - the AI service took too long to respond'),
          'google',
          model.id
        );
      }
      
      // Handle fetch failed errors (network issues, missing API key in production, etc.)
      if (error instanceof Error && error.message.includes('fetch failed')) {
        console.error(`Google fetch failed for ${model.id}:`, error.message);
        throw createUserFriendlyError(
          new Error('Network error - unable to connect to AI service. Please check your API key configuration.'),
          'google',
          model.id
        );
      }
      
      // Log the actual error for debugging
      console.error(`Google Adapter Error for ${model.id}:`, error);
      
      // Check if this is a critical failure that should trigger smart fallback
      if (this.isCriticalFailure(error)) {
        console.warn(`Critical Google failure for ${model.id}, will trigger smart fallback`);
      }
      
      throw createUserFriendlyError(error, 'google', model.id);
    }
  }
  
  /**
   * Build contents array for Gemini format
   */
  private buildContents(prompt: string, systemPrompt?: string, history?: MessageData[]): GoogleContent[] {
    const contents: GoogleContent[] = [];
    
    // Add system prompt as first user message if provided
    if (systemPrompt) {
      contents.push({
        parts: [{ text: `System instructions: ${systemPrompt}` }],
        role: 'user',
      });
      contents.push({
        parts: [{ text: 'I understand the system instructions.' }],
        role: 'model',
      });
    }
    
    // Add conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        const text = typeof msg.content === 'string' 
          ? msg.content 
          : msg.content.map(c => c.text).join('');
        
        contents.push({
          parts: [{ text }],
          role: msg.role === 'user' ? 'user' : 'model',
        });
      }
    }
    
    // Add current user message
    contents.push({
      parts: [{ text: prompt }],
      role: 'user',
    });
    
    return contents;
  }
  
  /**
   * Check if error indicates critical Google failure
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
      errorMessage.includes('504')
    );
  }
}

// Singleton instance
let instance: GoogleAdapter | null = null;

export function getGoogleAdapter(): GoogleAdapter {
  if (!instance) {
    instance = new GoogleAdapter();
  }
  return instance;
}