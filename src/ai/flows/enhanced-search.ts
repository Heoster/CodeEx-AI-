'use server';

/**
 * Enhanced Web Search with DuckDuckGo and Multi-Provider Support
 */

import { z } from 'genkit';
import { searchDuckDuckGo, formatResultsForAI } from '@/lib/duckduckgo';
import { generateWithFallback } from '../multi-provider-router';

const EnhancedSearchInputSchema = z.object({
  query: z.string().describe('The search query.'),
  preferredModel: z.string().optional(),
});

const EnhancedSearchOutputSchema = z.object({
  answer: z.string().describe('The answer based on search results.'),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    snippet: z.string(),
  })).optional(),
  modelUsed: z.string().optional(),
});

export type EnhancedSearchInput = z.infer<typeof EnhancedSearchInputSchema>;
export type EnhancedSearchOutput = z.infer<typeof EnhancedSearchOutputSchema>;

export async function enhancedSearch(input: EnhancedSearchInput): Promise<EnhancedSearchOutput> {
  let searchResults = '';
  let sources: Array<{ title: string; url: string; snippet: string }> = [];

  // Try DuckDuckGo search first
  try {
    const duckResults = await searchDuckDuckGo(input.query);
    if (duckResults.results.length > 0) {
      searchResults = formatResultsForAI(duckResults);
      sources = duckResults.results.slice(0, 5);
    }
  } catch (error) {
    console.warn('DuckDuckGo search failed:', error);
  }

  const systemPrompt = `You are a research assistant with access to real-time web search results. Answer questions using current information from the web.

## Instructions
1. Search for the most relevant and recent information
2. Synthesize information from multiple sources when available
3. Present the answer in a clear, organized format
4. Include specific facts, numbers, and dates when relevant
5. If the information might be time-sensitive, mention when it was last updated
6. If you find conflicting information, acknowledge it and present the most reliable source

## Response Format
- Start with a direct answer to the question
- Provide supporting details and context
- Use bullet points or numbered lists for multiple items
- Keep the response informative but concise
- Cite sources when making specific claims`;

  const prompt = searchResults 
    ? `Answer this question using the search results provided:\n\nQuestion: ${input.query}\n\n${searchResults}`
    : `Answer this question: ${input.query}`;

  try {
    const response = await generateWithFallback({
      prompt,
      systemPrompt,
      preferredModelId: input.preferredModel,
      category: 'general',
      params: {
        temperature: 0.5,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    });

    return {
      answer: response.text,
      sources: sources.length > 0 ? sources : undefined,
      modelUsed: response.modelUsed,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to perform web search: ${errorMessage}`);
  }
}
