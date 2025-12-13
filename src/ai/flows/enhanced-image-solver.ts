'use server';

/**
 * Enhanced Image Problem Solver with Multi-Provider Support
 * Supports up to 5MB images
 */

import { z } from 'genkit';
import { generateWithFallback } from '../multi-provider-router';

const EnhancedImageSolverInputSchema = z.object({
  imageDataUri: z.string().describe('Image data URI (up to 5MB).'),
  problemType: z.enum(['math', 'quiz', 'general']).optional(),
  preferredModel: z.string().optional(),
});

const EnhancedImageSolverOutputSchema = z.object({
  recognizedContent: z.string().describe('The content recognized from the image.'),
  solution: z.string().describe('The solution or answer.'),
  isSolvable: z.boolean().describe('Whether the problem is solvable.'),
  modelUsed: z.string().optional(),
});

export type EnhancedImageSolverInput = z.infer<typeof EnhancedImageSolverInputSchema>;
export type EnhancedImageSolverOutput = z.infer<typeof EnhancedImageSolverOutputSchema>;

/**
 * Validate and check image size (max 5MB)
 */
function validateImageSize(dataUri: string): void {
  // Extract base64 data
  const base64Match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error('Invalid image data URI format');
  }

  const base64Data = base64Match[2];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  if (sizeInMB > 5) {
    throw new Error(`Image size (${sizeInMB.toFixed(2)}MB) exceeds 5MB limit`);
  }
}

export async function enhancedImageSolver(input: EnhancedImageSolverInput): Promise<EnhancedImageSolverOutput> {
  // Validate image size
  try {
    validateImageSize(input.imageDataUri);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      recognizedContent: 'Unable to process image',
      solution: errorMessage,
      isSolvable: false,
    };
  }

  const systemPrompt = `You are a world-class expert with advanced optical character recognition (OCR) capabilities. Analyze images containing problems, equations, or questions and provide detailed solutions.

## Image Analysis Instructions
1. **Identify Content**: Carefully examine the image for:
   - Mathematical equations or expressions
   - Quiz questions or problems
   - Text content requiring analysis
   - Diagrams, graphs, or visual elements

2. **Recognition**: 
   - Accurately transcribe all visible content
   - Handle handwritten or printed text
   - Interpret mathematical notation correctly
   - Consider context and common patterns

3. **Solution**:
   - For math: Provide step-by-step solutions with explanations
   - For quizzes: Answer questions with reasoning
   - For general content: Provide relevant analysis or explanation
   - Use LaTeX for mathematical expressions
   - Number steps clearly

4. **Format**:
   - Use markdown for clarity
   - Use code blocks for code
   - Use LaTeX ($ or $$) for math
   - Explain your reasoning

5. **Edge Cases**:
   - If unclear, make reasonable interpretations
   - If unsolvable, explain why
   - If incomplete, note what's missing`;

  const prompt = `Analyze this image and solve any problems or answer any questions it contains. Problem type: ${input.problemType || 'general'}`;

  try {
    // For image analysis, prefer multimodal models
    const response = await generateWithFallback({
      prompt: `${prompt}\n\nImage: ${input.imageDataUri}`,
      systemPrompt,
      preferredModelId: input.preferredModel,
      category: 'multimodal',
      params: {
        temperature: 0.2,
        topP: 0.85,
        maxOutputTokens: 4096,
      },
    });

    // Parse response to extract recognized content and solution
    const text = response.text;
    const lines = text.split('\n');
    
    let recognizedContent = '';
    let solution = text;
    let isSolvable = true;

    // Try to extract recognized equation/content
    const recognizedMatch = text.match(/(?:recognized|equation|problem|question):\s*(.+?)(?:\n|$)/i);
    if (recognizedMatch) {
      recognizedContent = recognizedMatch[1].trim();
    }

    // Check if marked as unsolvable
    if (text.toLowerCase().includes('unsolvable') || text.toLowerCase().includes('cannot solve')) {
      isSolvable = false;
    }

    return {
      recognizedContent: recognizedContent || 'Content recognized from image',
      solution,
      isSolvable,
      modelUsed: response.modelUsed,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      recognizedContent: 'Unable to process image',
      solution: `Error: ${errorMessage}. Please ensure the image is clear and contains visible content.`,
      isSolvable: false,
    };
  }
}
