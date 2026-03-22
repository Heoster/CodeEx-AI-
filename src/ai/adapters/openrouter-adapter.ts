/**
 * OpenRouter Provider Adapter
 * OpenAI-compatible endpoint with free-tier models support.
 */

import { BaseProviderAdapter, type GenerateRequest, type GenerateResponse, type MessageData } from './types';
import { createUserFriendlyError } from '@/lib/model-config';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

export class OpenRouterAdapter extends BaseProviderAdapter {
  readonly provider = 'openrouter' as const;

  isAvailable(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const { model, prompt, systemPrompt, history, params } = request;
    const mergedParams = this.mergeParams(model, params);
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw createUserFriendlyError(
        new Error('OPENROUTER_API_KEY not configured'),
        'openrouter',
        model.id
      );
    }

    const messages = this.buildMessages(prompt, systemPrompt, history);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'SOHAM',
        },
        body: JSON.stringify({
          model: model.modelId,
          messages,
          temperature: mergedParams.temperature,
          top_p: mergedParams.topP,
          max_tokens: mergedParams.maxOutputTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw createUserFriendlyError(
          new Error(`OpenRouter error ${response.status}: ${errorText}`),
          'openrouter',
          model.id
        );
      }

      const data = (await response.json()) as OpenRouterResponse;
      if (data.error?.message) {
        throw createUserFriendlyError(new Error(data.error.message), 'openrouter', model.id);
      }

      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw createUserFriendlyError(new Error('No response generated'), 'openrouter', model.id);
      }

      return this.createResponse(text, model.id);
    } catch (error) {
      if (error instanceof Error && error.name === 'AIServiceError') {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw createUserFriendlyError(new Error('Request timeout'), 'openrouter', model.id);
      }
      throw createUserFriendlyError(error, 'openrouter', model.id);
    }
  }

  private buildMessages(prompt: string, systemPrompt?: string, history?: MessageData[]): OpenRouterMessage[] {
    const messages: OpenRouterMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    if (history?.length) {
      for (const msg of history) {
        const content = typeof msg.content === 'string' ? msg.content : msg.content.map(c => c.text).join('');
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content,
        });
      }
    }
    messages.push({ role: 'user', content: prompt });
    return messages;
  }
}

let instance: OpenRouterAdapter | null = null;
export function getOpenRouterAdapter(): OpenRouterAdapter {
  if (!instance) {
    instance = new OpenRouterAdapter();
  }
  return instance;
}
