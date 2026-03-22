import { randomUUID } from 'crypto';

export interface CrossDeviceMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface VectorMatch {
  id: string;
  score?: number;
  metadata?: Record<string, unknown>;
  data?: string;
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  };
}

function getUpstashConfig() {
  return {
    url: process.env.UPSTASH_VECTOR_REST_URL || '',
    token: process.env.UPSTASH_VECTOR_REST_TOKEN || '',
  };
}

function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.key);
}

function isUpstashConfigured(): boolean {
  const cfg = getUpstashConfig();
  return Boolean(cfg.url && cfg.token);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function loadCrossDeviceHistory(userId?: string, limit = 8): Promise<CrossDeviceMessage[]> {
  if (!userId || !isSupabaseConfigured()) return [];
  const { url, key } = getSupabaseConfig();
  const endpoint =
    `${url}/rest/v1/chat_history?user_id=eq.${encodeURIComponent(userId)}` +
    `&select=role,content,created_at&order=created_at.desc&limit=${Math.max(1, Math.min(limit, 20))}`;

  try {
    const response = await fetchWithTimeout(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    if (!response.ok) return [];
    const rows = (await response.json()) as CrossDeviceMessage[];
    return rows.reverse();
  } catch {
    return [];
  }
}

export async function persistCrossDeviceHistory(
  userId: string | undefined,
  userMessage: string,
  assistantMessage: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  if (!userId || !isSupabaseConfigured()) return;
  const { url, key } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/chat_history`;

  const records = [
    { user_id: userId, role: 'user', content: userMessage, metadata: metadata || {} },
    { user_id: userId, role: 'assistant', content: assistantMessage, metadata: metadata || {} },
  ];

  try {
    await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(records),
    });
  } catch {
    // Fail open
  }
}

export function hashEmbedding(text: string, dimensions = 256): number[] {
  const vec = new Array<number>(dimensions).fill(0);
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    const idx = Math.abs(h) % dimensions;
    vec[idx] += 1;
  }
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => v / norm);
}

export async function queryRagContext(userId: string | undefined, text: string, topK = 4): Promise<string[]> {
  if (!userId || !isUpstashConfigured()) return [];
  const { url, token } = getUpstashConfig();
  const endpoint = `${url.replace(/\/$/, '')}/query`;
  const vector = hashEmbedding(text);

  try {
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vector,
        topK,
        includeMetadata: true,
        includeData: true,
      }),
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { result?: VectorMatch[]; matches?: VectorMatch[] };
    const matches = payload.result || payload.matches || [];
    return matches
      .filter(m => (m.metadata?.user_id as string | undefined) === userId || String(m.id).startsWith(`${userId}:`))
      .slice(0, topK)
      .map(m => (typeof m.data === 'string' ? m.data : (m.metadata?.text as string | undefined) || ''))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function upsertRagMemory(
  userId: string | undefined,
  role: 'user' | 'assistant',
  text: string
): Promise<void> {
  if (!userId || !isUpstashConfigured()) return;
  const { url, token } = getUpstashConfig();
  const endpoint = `${url.replace(/\/$/, '')}/upsert`;
  const id = `${userId}:${role}:${Date.now()}:${randomUUID().slice(0, 8)}`;
  const vector = hashEmbedding(text);

  const payload = {
    vectors: [
      {
        id,
        vector,
        metadata: {
          user_id: userId,
          role,
          text: text.slice(0, 1000),
          created_at: new Date().toISOString(),
        },
        data: text.slice(0, 1200),
      },
    ],
  };

  try {
    await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Fail open
  }
}
