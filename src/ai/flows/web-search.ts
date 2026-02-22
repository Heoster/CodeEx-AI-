'use server';

/**
 * @fileOverview Enhanced web search with Google Search grounding for real-time information.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';
import {searchDuckDuckGo} from '@/lib/duckduckgo';

const WebSearchInputSchema = z.object({
  query: z.string().describe('The user question to search the web for.'),
});
export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;

// Define a schema that captures the structure of groundingMetadata
const GroundingMetadataSchema = z.object({
  webSearchQueries: z.array(z.string()).optional(),
  groundingChunks: z
    .array(
      z.object({
        web: z.object({
          uri: z.string().optional(),
          title: z.string().optional(),
        }),
      })
    )
    .optional(),
  groundingSupports: z
    .array(
      z.object({
        segment: z.object({
          startIndex: z.number().optional(),
          endIndex: z.number().optional(),
        }),
        groundingChunkIndices: z.array(z.number()).optional(),
      })
    )
    .optional(),
});

const WebSearchOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question, based on web search results.'),
  metadata: GroundingMetadataSchema.optional().describe('Citation and search query metadata.'),
});
export type WebSearchOutput = z.infer<typeof WebSearchOutputSchema>;

export async function searchTheWeb(input: WebSearchInput): Promise<WebSearchOutput> {
  return webSearchFlow(input);
}

const webSearchFlow = ai.defineFlow(
  {
    name: 'webSearchFlow',
    inputSchema: WebSearchInputSchema,
    outputSchema: WebSearchOutputSchema,
  },
  async ({query}: z.infer<typeof WebSearchInputSchema>) => {
    // Enhanced prompt for better search results
    const enhancedPrompt = `You are a research assistant with access to real-time web search. Answer the following question using current information from the web.

## Question
${query}

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
- Keep the response informative but concise`;

    try {
      // Try DuckDuckGo first, fallback to Google Search grounding
      let searchContext = '';
      try {
        const duckResults = await searchDuckDuckGo(query);
        if (duckResults.results.length > 0) {
          searchContext = '\n\n## Search Results from DuckDuckGo:\n' + 
            duckResults.results.map(r => `**${r.title}**\n${r.snippet}\nSource: ${r.url}`).join('\n\n');
        }
      } catch (duckError) {
        console.warn('DuckDuckGo search failed, using Google grounding:', duckError);
      }

      // Use our smart fallback system with Hugging Face models
      const { generateWithSmartFallback } = await import('../smart-fallback');
      
      const result = await generateWithSmartFallback({
        prompt: enhancedPrompt + searchContext,
        category: 'general',
        params: {
          temperature: 0.5,
          topP: 0.9,
          maxOutputTokens: 2048,
        },
      });

      // Format the response with source attribution
      let answer = result.response.text;
      const metadata = null; // No grounding metadata with Hugging Face
      
      // No grounding chunks available with Hugging Face models
      // Sources are already included in the search context from DuckDuckGo

      return WebSearchOutputSchema.parse({
        answer,
        metadata,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide helpful fallback
      if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
        return {
          answer: 'Web search is temporarily unavailable due to high demand. Please try again in a moment.',
          metadata: undefined,
        };
      }
      
      return {
        answer: `I couldn't complete the web search: ${errorMessage}. Try rephrasing your question or asking something else.`,
        metadata: undefined,
      };
    }
  }
);
