/**
 * Context Window Validator
 * Validates that prompts and history fit within model context windows
 */

import type { ModelConfig } from './model-config';
import type { MessageData } from '@/ai/adapters/types';

/**
 * Simple token estimation (rough approximation)
 * More accurate would use a proper tokenizer, but this is good enough
 * for preventing obvious overflows
 */
function estimateTokenCount(text: string): number {
  // Rough estimate: ~4 characters per token on average
  // This is conservative to avoid underestimating
  return Math.ceil(text.length / 3.5);
}

/**
 * Calculate total token count for a conversation
 */
export function calculateConversationTokens(
  prompt: string,
  systemPrompt?: string,
  history?: MessageData[]
): number {
  let totalTokens = estimateTokenCount(prompt);
  
  if (systemPrompt) {
    totalTokens += estimateTokenCount(systemPrompt);
  }
  
  if (history && history.length > 0) {
    for (const msg of history) {
      const content = typeof msg.content === 'string' 
        ? msg.content 
        : Array.isArray(msg.content)
        ? msg.content.map(c => c.text || '').join('')
        : '';
      totalTokens += estimateTokenCount(content);
    }
  }
  
  return totalTokens;
}

/**
 * Validate that a conversation fits within a model's context window
 * Throws an error if it exceeds the limit
 */
export function validateContextWindow(
  prompt: string,
  model: ModelConfig,
  systemPrompt?: string,
  history?: MessageData[]
): void {
  const totalTokens = calculateConversationTokens(prompt, systemPrompt, history);
  
  // Reserve some tokens for the response (typically 20-30% of context window)
  const reservedTokens = Math.floor(model.contextWindow * 0.25);
  const availableTokens = model.contextWindow - reservedTokens;
  
  if (totalTokens > availableTokens) {
    throw new Error(
      `Context too long: Your conversation uses approximately ${totalTokens} tokens, ` +
      `but ${model.name} only supports ${model.contextWindow} tokens ` +
      `(${availableTokens} available after reserving space for response). ` +
      `Please shorten your message or start a new chat.`
    );
  }
}

/**
 * Trim history to fit within context window
 * Returns a trimmed history that fits, keeping the most recent messages
 */
export function trimHistoryToFit(
  prompt: string,
  model: ModelConfig,
  systemPrompt: string | undefined,
  history: MessageData[]
): MessageData[] {
  const reservedTokens = Math.floor(model.contextWindow * 0.25);
  const availableTokens = model.contextWindow - reservedTokens;
  
  let promptTokens = estimateTokenCount(prompt);
  if (systemPrompt) {
    promptTokens += estimateTokenCount(systemPrompt);
  }
  
  // If just the prompt is too long, we can't help
  if (promptTokens > availableTokens) {
    return [];
  }
  
  // Work backwards through history, keeping messages that fit
  const trimmedHistory: MessageData[] = [];
  let currentTokens = promptTokens;
  
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const content = typeof msg.content === 'string' 
      ? msg.content 
      : Array.isArray(msg.content)
      ? msg.content.map(c => c.text || '').join('')
      : '';
    const msgTokens = estimateTokenCount(content);
    
    if (currentTokens + msgTokens <= availableTokens) {
      trimmedHistory.unshift(msg);
      currentTokens += msgTokens;
    } else {
      // Can't fit any more messages
      break;
    }
  }
  
  return trimmedHistory;
}

/**
 * Get a user-friendly message about context limits
 */
export function getContextLimitMessage(model: ModelConfig): string {
  return `${model.name} has a context limit of ${model.contextWindow} tokens ` +
    `(approximately ${Math.floor(model.contextWindow * 3.5)} characters). ` +
    `Long conversations may need to be split into multiple chats.`;
}
