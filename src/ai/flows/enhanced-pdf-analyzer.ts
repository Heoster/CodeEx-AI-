'use server';

/**
 * Enhanced PDF Analyzer with Multi-Provider Support
 * Supports up to 5MB PDFs
 */

import { z } from 'genkit';
import { generateWithFallback } from '../multi-provider-router';

const EnhancedPdfAnalyzerInputSchema = z.object({
  pdfDataUri: z.string().describe('PDF data URI (up to 5MB).'),
  question: z.string().describe('Question about the PDF.'),
  preferredModel: z.string().optional(),
});

const EnhancedPdfAnalyzerOutputSchema = z.object({
  answer: z.string().describe('Answer to the question.'),
  modelUsed: z.string().optional(),
});

export type EnhancedPdfAnalyzerInput = z.infer<typeof EnhancedPdfAnalyzerInputSchema>;
export type EnhancedPdfAnalyzerOutput = z.infer<typeof EnhancedPdfAnalyzerOutputSchema>;

/**
 * Validate PDF size (max 5MB)
 */
function validatePdfSize(dataUri: string): void {
  const base64Match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error('Invalid PDF data URI format');
  }

  const base64Data = base64Match[2];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  if (sizeInMB > 5) {
    throw new Error(`PDF size (${sizeInMB.toFixed(2)}MB) exceeds 5MB limit`);
  }
}

export async function enhancedPdfAnalyzer(input: EnhancedPdfAnalyzerInput): Promise<EnhancedPdfAnalyzerOutput> {
  // Validate PDF size
  try {
    validatePdfSize(input.pdfDataUri);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      answer: `Unable to process PDF: ${errorMessage}`,
    };
  }

  const systemPrompt = `You are an expert document analyst with exceptional reading comprehension and analytical skills. Analyze PDF documents and answer questions with precision and clarity.

## Analysis Instructions

1. **Document Understanding**:
   - Read and comprehend the entire document thoroughly
   - Identify document type (report, article, contract, manual, etc.)
   - Note structure, sections, and key components
   - Pay attention to tables, figures, charts, and captions

2. **Question Analysis**:
   - **Factual**: Extract specific information directly from the document
   - **Analytical**: Synthesize information from multiple parts
   - **Summary**: Provide overview of content or sections
   - **Comparative**: Compare different elements within the document
   - **Interpretive**: Explain meaning or implications of content

3. **Answer Formulation**:
   - Base answer ONLY on information in the document
   - Quote relevant passages when appropriate (use quotation marks)
   - Reference specific sections, pages, or paragraphs when helpful
   - If document doesn't contain the answer, clearly state this
   - If question is ambiguous, address the most likely interpretation

4. **Response Format**:
   - Start with a direct answer to the question
   - Provide supporting evidence from the document
   - Use bullet points or numbered lists for multiple items
   - Include relevant quotes or data points
   - Keep response focused and well-organized

5. **Limitations**:
   - Do NOT make up information not present in the document
   - Do NOT use external knowledge to supplement the document
   - If tables or figures are referenced, describe their relevant content
   - Maintain objectivity - present information as stated in the document`;

  const prompt = `Analyze this PDF document and answer the following question:\n\nQuestion: ${input.question}\n\nPDF: ${input.pdfDataUri}`;

  try {
    const response = await generateWithFallback({
      prompt,
      systemPrompt,
      preferredModelId: input.preferredModel,
      category: 'multimodal',
      params: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    return {
      answer: response.text,
      modelUsed: response.modelUsed,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
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
