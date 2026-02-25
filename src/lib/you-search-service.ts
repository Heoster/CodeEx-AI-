/**
 * You.com Web Search Service
 * Provides unlimited free web search with citations
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface SearchResponse {
  answer: string;
  results: SearchResult[];
  citations: string[];
  searchTime: number;
}

/**
 * You.com Search Service
 */
export class YouSearchService {
  private readonly baseUrl = 'https://api.ydc-index.io';

  /**
   * Perform web search with You.com
   */
  async search(query: string, options?: {
    numResults?: number;
    safeSearch?: boolean;
  }): Promise<SearchResponse> {
    const startTime = Date.now();
    const { numResults = 10, safeSearch = true } = options || {};

    try {
      // You.com RAG API (web search with AI)
      const url = new URL(`${this.baseUrl}/rag`);
      url.searchParams.append('query', query);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-API-Key': process.env.YOU_API_KEY || '',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[You.com] API error:', response.status, errorText);
        throw new Error(`You.com API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract results from You.com RAG response
      const results: SearchResult[] = [];
      
      // You.com RAG returns hits array
      if (data.hits && Array.isArray(data.hits)) {
        data.hits.slice(0, numResults).forEach((hit: any) => {
          results.push({
            title: hit.title || '',
            url: hit.url || '',
            snippet: hit.snippets?.[0] || hit.description || '',
            publishedDate: hit.published_date,
          });
        });
      }

      // Extract citations
      const citations = results.map(r => r.url).filter(Boolean);

      // Use You.com's answer if available, otherwise generate
      const answer = data.answer || this.generateAnswer(query, results);

      const searchTime = Date.now() - startTime;

      console.log(`[You.com] Search completed in ${searchTime}ms, found ${results.length} results`);

      return {
        answer,
        results,
        citations,
        searchTime,
      };
    } catch (error) {
      console.error('[You.com] Search error:', error);
      
      // Return error message instead of empty fallback
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'You.com search failed. Please check API key configuration.'
      );
    }
  }

  /**
   * Generate answer from search results
   */
  private generateAnswer(query: string, results: SearchResult[]): string {
    if (results.length === 0) {
      return `No results found for "${query}".`;
    }

    // Combine top 3 snippets
    const topSnippets = results
      .slice(0, 3)
      .map(r => r.snippet)
      .filter(Boolean)
      .join(' ');

    return topSnippets || `Found ${results.length} results for "${query}".`;
  }

  /**
   * Fallback search (returns empty results)
   */
  private fallbackSearch(query: string): SearchResponse {
    return {
      answer: `Search temporarily unavailable. Please try again.`,
      results: [],
      citations: [],
      searchTime: 0,
    };
  }

  /**
   * Search and format for AI consumption
   */
  async searchForAI(query: string): Promise<string> {
    const response = await this.search(query, { numResults: 5 });

    if (response.results.length === 0) {
      return 'No search results found.';
    }

    // Format results for AI
    let formatted = `Search results for "${query}":\n\n`;
    
    response.results.forEach((result, index) => {
      formatted += `${index + 1}. ${result.title}\n`;
      formatted += `   ${result.snippet}\n`;
      formatted += `   Source: ${result.url}\n\n`;
    });

    formatted += `\nCitations:\n${response.citations.map((c, i) => `[${i + 1}] ${c}`).join('\n')}`;

    return formatted;
  }
}

// Export singleton
let youSearchService: YouSearchService | null = null;

export function getYouSearchService(): YouSearchService {
  if (!youSearchService) {
    youSearchService = new YouSearchService();
  }
  return youSearchService;
}
