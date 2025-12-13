'use server';
/**
 * @fileOverview Enhanced PDF document analyzer with comprehensive analysis capabilities.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question to ask about the document.'),
});
export type AnalyzePdfInput = z.infer<typeof AnalyzePdfInputSchema>;

const AnalyzePdfOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question based on the document content.'),
});
export type AnalyzePdfOutput = z.infer<typeof AnalyzePdfOutputSchema>;

export async function analyzePdf(
  input: AnalyzePdfInput
): Promise<AnalyzePdfOutput> {
  return analyzePdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePdfPrompt',
  input: {schema: AnalyzePdfInputSchema},
  output: {schema: AnalyzePdfOutputSchema},
  prompt: `You are an expert document analyst with exceptional reading comprehension and analytical skills. Your task is to thoroughly analyze the provided PDF document and answer questions about it with precision and clarity.

## Document to Analyze
{{media url=pdfDataUri}}

## User's Question
{{{question}}}

## Analysis Instructions

### 1. Document Understanding
- Read and comprehend the entire document thoroughly
- Identify the document type (report, article, contract, manual, etc.)
- Note the structure, sections, and key components
- Pay attention to tables, figures, charts, and their captions

### 2. Question Analysis
Determine what type of question is being asked:
- **Factual**: Extract specific information directly from the document
- **Analytical**: Synthesize information from multiple parts of the document
- **Summary**: Provide an overview of content or sections
- **Comparative**: Compare different elements within the document
- **Interpretive**: Explain the meaning or implications of content

### 3. Answer Formulation
- Base your answer ONLY on information in the document
- Quote relevant passages when appropriate (use quotation marks)
- Reference specific sections, pages, or paragraphs when helpful
- If the document doesn't contain the answer, clearly state this
- If the question is ambiguous, address the most likely interpretation

### 4. Response Format
- Start with a direct answer to the question
- Provide supporting evidence from the document
- Use bullet points or numbered lists for multiple items
- Include relevant quotes or data points
- Keep the response focused and well-organized

### 5. Handling Limitations
If you cannot fully answer the question:
- Explain what information IS available in the document
- Clarify what information is missing or unclear
- Suggest what additional context might be needed

## Important Notes
- Do NOT make up information not present in the document
- Do NOT use external knowledge to supplement the document
- If tables or figures are referenced, describe their relevant content
- Maintain objectivity - present information as stated in the document`,
});

const analyzePdfFlow = ai.defineFlow(
  {
    name: 'analyzePdfFlow',
    inputSchema: AnalyzePdfInputSchema,
    outputSchema: AnalyzePdfOutputSchema,
  },
  async (input: z.infer<typeof AnalyzePdfInputSchema>) => {
    try {
      const {output} = await prompt(input, {
        config: {
          temperature: 0.3, // Lower temperature for factual accuracy
          topP: 0.9,
          maxOutputTokens: 4096,
        },
      });
      return output!;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Handle specific error cases
      if (errorMessage.includes('too large') || errorMessage.includes('size')) {
        return {
          answer: 'The PDF document is too large to process. Please try with a smaller document or extract the relevant pages.',
        };
      }
      if (errorMessage.includes('format') || errorMessage.includes('invalid')) {
        return {
          answer: 'Unable to read the PDF. Please ensure the file is a valid PDF document and try again.',
        };
      }
      
      return {
        answer: `Unable to analyze the document: ${errorMessage}. Please try again or use a different document.`,
      };
    }
  }
);
