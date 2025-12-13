'use server';

/**
 * Enhanced Summarization with Multi-Provider Support
 */

import { z } from 'genkit';
import { generateWithFallback } from '../multi-provider-router';

const EnhancedSummarizeInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
  style: z.enum(['brief', 'detailed', 'bullets', 'eli5']).optional(),
  preferredModel: z.string().optional(),
});

const EnhancedSummarizeOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the input text.'),
  modelUsed: z.string().optional(),
});

export type EnhancedSummarizeInput = z.infer<typeof EnhancedSummarizeInputSchema>;
export type EnhancedSummarizeOutput = z.infer<typeof EnhancedSummarizeOutputSchema>;

const getStyleInstructions = (style?: string) => {
  switch (style) {
    case 'brief':
      return 'Create a very brief summary in 1-2 sentences capturing only the most essential point.';
    case 'detailed':
      return 'Create a comprehensive summary that covers all major points, organized into clear paragraphs.';
    case 'bullets':
      return 'Create a bullet-point summary with the key takeaways, using clear and concise points.';
    case 'eli5':
      return 'Explain this like I\'m 5 years old - use simple words, analogies, and make it fun and easy to understand.';
    default:
      return 'Create a balanced summary that captures the main ideas in a clear, readable format.';
  }
};

export async function enhancedSummarize(input: EnhancedSummarizeInput): Promise<EnhancedSummarizeOutput> {
  const systemPrompt = `You are an expert at distilling complex information into clear, accurate summaries.

## Instructions
1. **Identify Key Points**: Extract the most important information, main arguments, and conclusions
2. **Preserve Accuracy**: Don't add information that isn't in the original text
3. **Maintain Context**: Keep enough context so the summary makes sense on its own
4. **Be Clear**: Use simple, direct language

## Style
${getStyleInstructions(input.style)}

## Output Format
- Use markdown formatting when helpful (bold for emphasis, lists for multiple points)
- Keep the summary focused and free of unnecessary filler words
- If the text contains technical terms, briefly explain them if needed`;

  const prompt = `Summarize the following text:\n\n${input.text}`;

  try {
    const response = await generateWithFallback({
      prompt,
      systemPrompt,
      preferredModelId: input.preferredModel,
      category: 'general',
      params: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: input.text.length > 5000 ? 2048 : 1024,
      },
    });

    return {
      summary: response.text,
      modelUsed: response.modelUsed,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to summarize text: ${errorMessage}`);
  }
}
