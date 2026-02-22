/**
 * DuckDuckGo Search Integration
 * Provides privacy-focused web search functionality
 */

const DUCKDUCKGO_API_URL = 'https://api.duckduckgo.com/';

/**
 * Individual search result
 */
export interface DuckDuckGoResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Search response structure
 */
export interface DuckDuckGoSearchResponse {
  results: DuckDuckGoResult[];
  query: string;
  abstract?: string;
  abstractSource?: string;
  abstractUrl?: string;
  relatedTopics?: string[];
}

/**
 * Raw API response from DuckDuckGo
 */
interface DuckDuckGoApiResponse {
  Abstract?: string;
  AbstractSource?: string;
  AbstractURL?: string;
  RelatedTopics?: Array<{
    Text?: string;
    FirstURL?: string;
    Result?: string;
  }>;
  Results?: Array<{
    Text?: string;
    FirstURL?: string;
    Result?: string;
  }>;
  Heading?: string;
  Answer?: string;
  AnswerType?: string;
}

/**
 * Encode a search query for URL
 */
export function encodeSearchQuery(query: string): string {
  return encodeURIComponent(query.trim());
}

/**
 * Parse HTML to extract text content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract URL from DuckDuckGo result HTML
 */
function extractUrl(result: string): string | null {
  const match = result.match(/href="([^"]+)"/);
  return match ? match[1] : null;
}

/**
 * Search DuckDuckGo for a query
 */
export async function searchDuckDuckGo(query: string): Promise<DuckDuckGoSearchResponse> {
  const encodedQuery = encodeSearchQuery(query);
  
  const url = `${DUCKDUCKGO_API_URL}?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`DuckDuckGo API error: ${response.status}`);
    }
    
    const data = await response.json() as DuckDuckGoApiResponse;
    
    return parseApiResponse(data, query);
  } catch (error) {
    // Re-throw with more context
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`DuckDuckGo search failed: ${message}`);
  }
}

/**
 * Parse the DuckDuckGo API response into our format
 */
function parseApiResponse(data: DuckDuckGoApiResponse, query: string): DuckDuckGoSearchResponse {
  const results: DuckDuckGoResult[] = [];
  
  // Parse direct results
  if (data.Results && data.Results.length > 0) {
    for (const result of data.Results) {
      if (result.FirstURL && result.Text) {
        results.push({
          title: stripHtml(result.Text).split(' - ')[0] || result.Text,
          url: result.FirstURL,
          snippet: stripHtml(result.Text),
        });
      }
    }
  }
  
  // Parse related topics as additional results
  if (data.RelatedTopics && data.RelatedTopics.length > 0) {
    for (const topic of data.RelatedTopics) {
      if (topic.FirstURL && topic.Text) {
        results.push({
          title: stripHtml(topic.Text).split(' - ')[0] || topic.Text,
          url: topic.FirstURL,
          snippet: stripHtml(topic.Text),
        });
      }
    }
  }
  
  // Extract related topic strings
  const relatedTopics = data.RelatedTopics
    ?.filter(t => t.Text)
    .map(t => stripHtml(t.Text || ''))
    .slice(0, 5);
  
  return {
    results: results.slice(0, 10), // Limit to 10 results
    query,
    abstract: data.Abstract || undefined,
    abstractSource: data.AbstractSource || undefined,
    abstractUrl: data.AbstractURL || undefined,
    relatedTopics,
  };
}

/**
 * Check if DuckDuckGo API is available
 */
export async function isDuckDuckGoAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${DUCKDUCKGO_API_URL}?q=test&format=json`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Format search results for AI summarization
 */
export function formatResultsForAI(response: DuckDuckGoSearchResponse): string {
  const parts: string[] = [];
  
  parts.push(`Search query: "${response.query}"\n`);
  
  if (response.abstract) {
    parts.push(`Summary: ${response.abstract}`);
    if (response.abstractSource) {
      parts.push(`Source: ${response.abstractSource}`);
    }
    parts.push('');
  }
  
  if (response.results.length > 0) {
    parts.push('Search Results:');
    for (let i = 0; i < response.results.length; i++) {
      const result = response.results[i];
      parts.push(`${i + 1}. ${result.title}`);
      parts.push(`   ${result.snippet}`);
      parts.push(`   URL: ${result.url}`);
      parts.push('');
    }
  }
  
  if (response.relatedTopics && response.relatedTopics.length > 0) {
    parts.push('Related Topics:');
    for (const topic of response.relatedTopics) {
      parts.push(`- ${topic}`);
    }
  }
  
  return parts.join('\n');
}
