import { formatResultsForAI, searchDuckDuckGo } from '@/lib/duckduckgo';

export type SohamToolName =
  | 'news_search'
  | 'weather_search'
  | 'sports_search'
  | 'finance_search'
  | 'web_search';

export interface SohamToolResult {
  tool: SohamToolName;
  query: string;
  ok: boolean;
  output: string;
  sources?: Array<{ title: string; url: string }>;
}

interface ToolIntent {
  tool: SohamToolName;
  query: string;
}

function sanitizeQuery(query: string): string {
  return query
    .replace(/[^\w\s\-.,/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

function extractCommandQuery(message: string): { command?: string; query?: string } {
  const match = message.trim().match(/^\/([a-z_]+)\s+(.+)$/i);
  if (!match) return {};
  return { command: match[1].toLowerCase(), query: sanitizeQuery(match[2]) };
}

export function detectToolIntent(message: string): ToolIntent | null {
  const normalized = message.trim();
  const lower = normalized.toLowerCase();
  const { command, query } = extractCommandQuery(normalized);

  if (command && query) {
    if (['news', 'news_search', 'ews_search'].includes(command)) {
      return { tool: 'news_search', query };
    }
    if (['weather', 'weather_search'].includes(command)) {
      return { tool: 'weather_search', query };
    }
    if (['sports', 'sports_search'].includes(command)) {
      return { tool: 'sports_search', query };
    }
    if (['finance', 'finance_search'].includes(command)) {
      return { tool: 'finance_search', query };
    }
    if (['search', 'web_search', 'research'].includes(command)) {
      return { tool: 'web_search', query };
    }
  }

  if (/\b(weather|temperature|forecast|rain|humidity)\b/i.test(lower)) {
    return { tool: 'weather_search', query: sanitizeQuery(normalized) };
  }
  if (/\b(cricket|match|matches|score|live score|ipl|sports)\b/i.test(lower)) {
    return { tool: 'sports_search', query: sanitizeQuery(normalized) };
  }
  if (/\b(stock|stocks|crypto|bitcoin|btc|ethereum|eth|price of|market cap|nifty|sensex)\b/i.test(lower)) {
    return { tool: 'finance_search', query: sanitizeQuery(normalized) };
  }
  if (/\b(news|headlines|latest updates|breaking)\b/i.test(lower)) {
    return { tool: 'news_search', query: sanitizeQuery(normalized) };
  }
  if (/\b(search|look up|find on web|web search|research)\b/i.test(lower)) {
    return { tool: 'web_search', query: sanitizeQuery(normalized) };
  }

  return null;
}

async function fetchJson<T>(url: string, timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 240)}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseLocation(query: string): string {
  const inMatch = query.match(/\bin\s+([a-zA-Z\s,.-]+)$/i);
  return sanitizeQuery(inMatch?.[1] || query) || 'New York';
}

async function weatherSearch(query: string): Promise<SohamToolResult> {
  const location = parseLocation(query);
  try {
    const geo = await fetchJson<{ results?: Array<{ latitude: number; longitude: number; name: string; country?: string }> }>(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );
    const place = geo.results?.[0];
    if (!place) {
      return { tool: 'weather_search', query, ok: false, output: `No weather location found for "${location}".` };
    }

    const weather = await fetchJson<{
      current?: { temperature_2m?: number; wind_speed_10m?: number; weather_code?: number; time?: string };
    }>(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`
    );

    const current = weather.current;
    if (!current) {
      return { tool: 'weather_search', query, ok: false, output: `Weather data is unavailable for ${place.name}.` };
    }

    return {
      tool: 'weather_search',
      query,
      ok: true,
      output:
        `Current weather for ${place.name}${place.country ? `, ${place.country}` : ''}: ` +
        `${current.temperature_2m ?? 'N/A'}°C, wind ${current.wind_speed_10m ?? 'N/A'} km/h, ` +
        `code ${current.weather_code ?? 'N/A'} (time: ${current.time ?? 'N/A'}).`,
    };
  } catch (error) {
    return { tool: 'weather_search', query, ok: false, output: `Weather lookup failed: ${String(error)}` };
  }
}

async function newsSearch(query: string): Promise<SohamToolResult> {
  const safeQuery = sanitizeQuery(query) || 'latest technology news';
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return {
      tool: 'news_search',
      query: safeQuery,
      ok: false,
      output: 'GNews API key is not configured (GNEWS_API_KEY).',
    };
  }

  try {
    const data = await fetchJson<{
      articles?: Array<{ title: string; url: string; description?: string; publishedAt?: string; source?: { name?: string } }>;
    }>(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(safeQuery)}&lang=en&max=5&apikey=${encodeURIComponent(apiKey)}`
    );

    const articles = data.articles || [];
    if (articles.length === 0) {
      return { tool: 'news_search', query: safeQuery, ok: true, output: 'No recent news articles found.' };
    }

    const output = articles
      .map((a, i) => `${i + 1}. ${a.title} (${a.source?.name || 'Unknown source'}, ${a.publishedAt || 'N/A'})`)
      .join('\n');

    return {
      tool: 'news_search',
      query: safeQuery,
      ok: true,
      output,
      sources: articles.map(a => ({ title: a.title, url: a.url })),
    };
  } catch (error) {
    return { tool: 'news_search', query: safeQuery, ok: false, output: `News lookup failed: ${String(error)}` };
  }
}

async function sportsSearch(query: string): Promise<SohamToolResult> {
  const safeQuery = sanitizeQuery(query) || 'live cricket matches';
  const cricApiKey = process.env.CRICAPI_KEY;

  try {
    if (cricApiKey) {
      const data = await fetchJson<{ data?: Array<{ name?: string; status?: string; venue?: string; dateTimeGMT?: string }> }>(
        `https://api.cricapi.com/v1/currentMatches?apikey=${encodeURIComponent(cricApiKey)}&offset=0`
      );
      const matches = (data.data || []).slice(0, 8);
      if (matches.length === 0) {
        return { tool: 'sports_search', query: safeQuery, ok: true, output: 'No live cricket matches returned by CricAPI.' };
      }
      const lines = matches.map((m, i) => `${i + 1}. ${m.name || 'Match'} - ${m.status || 'Status unavailable'} (${m.venue || 'Unknown venue'})`);
      return { tool: 'sports_search', query: safeQuery, ok: true, output: lines.join('\n') };
    }

    // Free fallback: web search for live cricket updates
    const duck = await searchDuckDuckGo(`live cricket matches ${safeQuery}`);
    const top = duck.results.slice(0, 5);
    if (top.length === 0) {
      return { tool: 'sports_search', query: safeQuery, ok: false, output: 'No sports results found. Configure CRICAPI_KEY for direct live match feeds.' };
    }
    return {
      tool: 'sports_search',
      query: safeQuery,
      ok: true,
      output: top.map((r, i) => `${i + 1}. ${r.title} - ${r.snippet}`).join('\n'),
      sources: top.map(r => ({ title: r.title, url: r.url })),
    };
  } catch (error) {
    return { tool: 'sports_search', query: safeQuery, ok: false, output: `Sports lookup failed: ${String(error)}` };
  }
}

async function financeSearch(query: string): Promise<SohamToolResult> {
  const safeQuery = sanitizeQuery(query);
  const lower = safeQuery.toLowerCase();
  const alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;

  // Crypto path (free via CoinGecko)
  const cryptoMap: Record<string, string> = {
    bitcoin: 'bitcoin',
    btc: 'bitcoin',
    ethereum: 'ethereum',
    eth: 'ethereum',
    solana: 'solana',
    sol: 'solana',
    dogecoin: 'dogecoin',
    doge: 'dogecoin',
  };

  const cryptoId = Object.entries(cryptoMap).find(([k]) => lower.includes(k))?.[1];
  if (cryptoId) {
    try {
      const data = await fetchJson<Record<string, { usd?: number; usd_24h_change?: number }>>(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(cryptoId)}&vs_currencies=usd&include_24hr_change=true`
      );
      const quote = data[cryptoId];
      if (!quote) {
        return { tool: 'finance_search', query: safeQuery, ok: false, output: `No crypto quote found for ${cryptoId}.` };
      }
      return {
        tool: 'finance_search',
        query: safeQuery,
        ok: true,
        output: `${cryptoId.toUpperCase()} price: $${quote.usd ?? 'N/A'} (24h change: ${quote.usd_24h_change?.toFixed(2) ?? 'N/A'}%)`,
      };
    } catch (error) {
      return { tool: 'finance_search', query: safeQuery, ok: false, output: `Crypto lookup failed: ${String(error)}` };
    }
  }

  // Stock path (Alpha Vantage free tier)
  const symbolMatch = safeQuery.toUpperCase().match(/\b[A-Z]{1,5}\b/);
  if (symbolMatch && alphaVantageKey) {
    const symbol = symbolMatch[0];
    try {
      const data = await fetchJson<Record<string, Record<string, string>>>(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(alphaVantageKey)}`
      );
      const quote = data['Global Quote'] || {};
      const price = quote['05. price'];
      const change = quote['10. change percent'];
      if (!price) {
        return { tool: 'finance_search', query: safeQuery, ok: false, output: `No stock quote found for ${symbol}.` };
      }
      return {
        tool: 'finance_search',
        query: safeQuery,
        ok: true,
        output: `${symbol} price: $${price} (change: ${change || 'N/A'})`,
      };
    } catch (error) {
      return { tool: 'finance_search', query: safeQuery, ok: false, output: `Stock lookup failed: ${String(error)}` };
    }
  }

  // Fallback to web search
  try {
    const duck = await searchDuckDuckGo(`finance market ${safeQuery}`);
    const top = duck.results.slice(0, 4);
    return {
      tool: 'finance_search',
      query: safeQuery,
      ok: top.length > 0,
      output: top.length ? top.map((r, i) => `${i + 1}. ${r.title} - ${r.snippet}`).join('\n') : 'No finance results found.',
      sources: top.map(r => ({ title: r.title, url: r.url })),
    };
  } catch (error) {
    return { tool: 'finance_search', query: safeQuery, ok: false, output: `Finance lookup failed: ${String(error)}` };
  }
}

async function webSearch(query: string): Promise<SohamToolResult> {
  const safeQuery = sanitizeQuery(query);
  try {
    const duck = await searchDuckDuckGo(safeQuery);
    const top = duck.results.slice(0, 5);
    return {
      tool: 'web_search',
      query: safeQuery,
      ok: top.length > 0,
      output: top.length > 0 ? formatResultsForAI({ query: safeQuery, results: top }) : 'No web search results found.',
      sources: top.map(r => ({ title: r.title, url: r.url })),
    };
  } catch (error) {
    return { tool: 'web_search', query: safeQuery, ok: false, output: `Web search failed: ${String(error)}` };
  }
}

export async function executeSohamTool(message: string): Promise<SohamToolResult | null> {
  const intent = detectToolIntent(message);
  if (!intent) return null;

  switch (intent.tool) {
    case 'news_search':
      return newsSearch(intent.query);
    case 'weather_search':
      return weatherSearch(intent.query);
    case 'sports_search':
      return sportsSearch(intent.query);
    case 'finance_search':
      return financeSearch(intent.query);
    case 'web_search':
      return webSearch(intent.query);
    default:
      return null;
  }
}
