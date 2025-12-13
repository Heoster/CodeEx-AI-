'use server';

/**
 * @fileOverview Enhanced text summarization with multiple output formats.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInformationInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
  model: z.string().optional(),
  style: z.enum(['brief', 'detailed', 'bullets', 'eli5']).optional(),
});
export type SummarizeInformationInput = z.infer<
  typeof SummarizeInformationInputSchema
>;

const SummarizeInformationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the input text.'),
});
export type SummarizeInformationOutput = z.infer<
  typeof SummarizeInformationOutputSchema
>;

export async function summarizeInformation(
  input: SummarizeInformationInput
): Promise<SummarizeInformationOutput> {
  return summarizeInformationFlow(input);
}

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

const summarizeInformationPrompt = ai.definePrompt({
  name: 'summarizeInformationPrompt',
  input: {schema: SummarizeInformationInputSchema},
  output: {schema: SummarizeInformationOutputSchema},
  prompt: `You are an expert at distilling complex information into clear, accurate summaries.

## Your Task
Summarize the following text while preserving the key information and meaning.

## Text to Summarize
{{{text}}}

## Instructions
1. **Identify Key Points**: Extract the most important information, main arguments, and conclusions
2. **Preserve Accuracy**: Don't add information that isn't in the original text
3. **Maintain Context**: Keep enough context so the summary makes sense on its own
4. **Be Clear**: Use simple, direct language

## Style
{{#if style}}
${getStyleInstructions('{{style}}')}
{{else}}
Create a balanced summary that captures the main ideas in a clear, readable format.
{{/if}}

## Output Format
- Use markdown formatting when helpful (bold for emphasis, lists for multiple points)
- Keep the summary focused and free of unnecessary filler words
- If the text contains technical terms, briefly explain them if needed`,
});

const summarizeInformationFlow = ai.defineFlow(
  {
    name: 'summarizeInformationFlow',
    inputSchema: SummarizeInformationInputSchema,
    outputSchema: SummarizeInformationOutputSchema,
  },
  async (input: z.infer<typeof SummarizeInformationInputSchema>) => {
    try {
      // Estimate if text is very long and adjust accordingly
      const isLongText = input.text.length > 5000;
      
      const {output} = await summarizeInformationPrompt(input, {
        model: input.model,
        config: {
          temperature: 0.4, // Lower temperature for more faithful summaries
          topP: 0.9,
          maxOutputTokens: isLongText ? 2048 : 1024,
        },
      });
      return output!;
    } catch (error: unknown) {
      // Log error for debugging
      console.error('Summarization error:', error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Provide specific error messages based on error type
      if (errorMessage.includes('API key')) {
        throw new Error('AI service unavailable. Please check your Google AI API key configuration.');
      }
      if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
        throw new Error('AI service is temporarily busy. Please try again in a moment.');
      }
      if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
        throw new Error('Unable to summarize this content due to safety restrictions.');
      }
      if (input.text.length > 50000) {
        throw new Error('Text is too long to summarize. Please provide a shorter text (max 50,000 characters).');
      }
      
      // Re-throw with context
      throw new Error(`Failed to summarize text: ${errorMessage}`);
    }
  }
);
