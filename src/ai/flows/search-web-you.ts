/**
 * You.com Web Search Flow
 * Integrates with You.com for web search with citations
 */

import { getYouSearchService } from '@/lib/you-search-service';

export interface SearchWebInput {
  query: string;
  numResults?: number;
}

export interface SearchWebOutput {
  answer: string;
  citations: string[];
  results: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

/**
 * Search the web using You.com
 */
export async function searchWebYou(
  input: SearchWebInput
): Promise<SearchWebOutput> {
  const { query, numResults = 10 } = input;

  try {
    console.log('[You.com Flow] Searching:', query);

    const searchService = getYouSearchService();
    const result = await searchService.search(query, {
      numResults,
      safeSearch: true,
    });

    // Format answer with citations
    let formattedAnswer = `🔍 **Web Search Results for:** "${query}"\n\n`;
    
    if (result.results.length === 0) {
      formattedAnswer += 'No results found. Please try a different search query.';
    } else {
      // Add summary
      formattedAnswer += `**Summary:**\n${result.answer}\n\n`;
      
      // Add top results
      formattedAnswer += `**Top Results:**\n\n`;
      result.results.slice(0, 5).forEach((r, i) => {
        formattedAnswer += `${i + 1}. **[${r.title}](${r.url})**\n`;
        formattedAnswer += `   ${r.snippet}\n\n`;
      });

      // Add citations
      if (result.citations.length > 0) {
        formattedAnswer += `\n**Sources:**\n`;
        result.citations.slice(0, 5).forEach((citation, i) => {
          formattedAnswer += `[${i + 1}] ${citation}\n`;
        });
      }
    }

    return {
      answer: formattedAnswer,
      citations: result.citations,
      results: result.results,
    };
  } catch (error) {
    console.error('[You.com Flow] Search failed:', error);
    
    return {
      answer: `❌ **Web Search Failed**

I encountered an error while searching: ${error instanceof Error ? error.message : 'Unknown error'}

Please try again or check if the You.com API key is configured correctly.`,
      citations: [],
      results: [],
    };
  }
}
