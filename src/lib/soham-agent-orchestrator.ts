import type { MessageData } from '@/ai/adapters';
import {
  executeSohamTool,
  type SohamToolResult,
} from '@/lib/agent-tools';
import {
  loadCrossDeviceHistory,
  persistCrossDeviceHistory,
  queryRagContext,
  upsertRagMemory,
} from '@/lib/agent-memory';

export interface SohamContextResult {
  prompt: string;
  toolsUsed: SohamToolResult[];
  ragContextCount: number;
  crossDeviceHistoryCount: number;
}

export async function buildSohamPromptContext(input: {
  message: string;
  history?: MessageData[];
  userId?: string;
}): Promise<SohamContextResult> {
  const { message, userId } = input;

  const [toolResult, ragSnippets, crossDeviceHistory] = await Promise.all([
    executeSohamTool(message),
    queryRagContext(userId, message, 4),
    loadCrossDeviceHistory(userId, 6),
  ]);

  const toolsUsed = toolResult ? [toolResult] : [];
  const contextBlocks: string[] = [];

  if (toolResult) {
    contextBlocks.push(
      `TOOL_RESULT (${toolResult.tool})\n` +
      `Query: ${toolResult.query}\n` +
      `Status: ${toolResult.ok ? 'ok' : 'error'}\n` +
      `${toolResult.output}`
    );
  }

  if (crossDeviceHistory.length > 0) {
    const historyText = crossDeviceHistory
      .slice(-4)
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');
    contextBlocks.push(`CROSS_DEVICE_CHAT_HISTORY\n${historyText}`);
  }

  if (ragSnippets.length > 0) {
    contextBlocks.push(`RAG_CONTEXT\n${ragSnippets.map((x, i) => `${i + 1}. ${x}`).join('\n')}`);
  }

  const prompt =
    contextBlocks.length === 0
      ? message
      : `${message}\n\nUse the following context when relevant:\n\n${contextBlocks.join('\n\n')}`;

  return {
    prompt,
    toolsUsed,
    ragContextCount: ragSnippets.length,
    crossDeviceHistoryCount: crossDeviceHistory.length,
  };
}

export async function persistSohamMemory(input: {
  userId?: string;
  userMessage: string;
  assistantMessage: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const { userId, userMessage, assistantMessage, metadata } = input;
  if (!userId) return;

  await Promise.all([
    persistCrossDeviceHistory(userId, userMessage, assistantMessage, metadata),
    upsertRagMemory(userId, 'user', userMessage),
    upsertRagMemory(userId, 'assistant', assistantMessage),
  ]);
}
