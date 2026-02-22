'use server';
/**
 * @fileOverview Enhanced visual math solver with improved OCR and step-by-step solutions.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const SolveImageEquationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a handwritten math equation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SolveImageEquationInput = z.infer<typeof SolveImageEquationInputSchema>;

const SolveImageEquationOutputSchema = z.object({
  recognizedEquation: z
    .string()
    .describe(
      'The equation recognized from the image, formatted as a LaTeX string.'
    ),
  solutionSteps: z
    .string()
    .describe(
      'The step-by-step solution to the equation, formatted as a LaTeX string. Use double backslashes (\\\\) for new lines between steps.'
    ),
  isSolvable: z.boolean().describe('Whether the recognized equation is solvable or not.'),
});
export type SolveImageEquationOutput = z.infer<typeof SolveImageEquationOutputSchema>;

export async function solveImageEquation(
  input: SolveImageEquationInput
): Promise<SolveImageEquationOutput> {
  return solveImageEquationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveImageEquationPrompt',
  input: {schema: SolveImageEquationInputSchema},
  output: {schema: SolveImageEquationOutputSchema},
  // model removed to allow registry/Genkit to pick an available default
  prompt: `You are a world-class mathematics expert with advanced optical character recognition (OCR) capabilities. Your task is to analyze the provided image, identify any mathematical content, and provide a detailed, step-by-step solution.

## Image to Analyze
{{media url=photoDataUri}}

## Instructions

### Step 1: Image Analysis
Carefully examine the image for:
- Handwritten or printed mathematical equations
- Mathematical expressions, formulas, or problems
- Graphs, diagrams, or geometric figures with mathematical content
- Word problems involving mathematics

### Step 2: Recognition & Interpretation
- Identify ALL mathematical content in the image
- If handwriting is unclear, make reasonable interpretations based on context
- Consider common mathematical notations and symbols
- If multiple equations exist, focus on the main one or solve them in order

### Step 3: Format the Equation
Present the recognized equation in clean LaTeX format:
- Use proper LaTeX syntax (e.g., \\frac{}{}, \\sqrt{}, ^{}, _{})
- Examples: 'x^2 + 5x - 4 = 0', '\\frac{dy}{dx} = 2x', '\\int_0^1 x^2 dx'

### Step 4: Solve Step-by-Step
If solvable, provide a clear solution:
- Number each step clearly
- Show all work - don't skip steps
- Explain the mathematical operation at each step
- Use '\\\\' for line breaks between steps
- Box or highlight the final answer

Example format:
'\\text{Step 1: Identify the equation type} \\\\ x^2 + 5x - 4 = 0 \\text{ (quadratic equation)} \\\\ \\text{Step 2: Apply quadratic formula} \\\\ x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} \\\\ ...'

### Step 5: Handle Edge Cases
If the equation is NOT solvable, set isSolvable to false and explain why:
- Image is unclear or unreadable
- No mathematical content found
- Equation is incomplete or malformed
- Problem requires additional information

## Output Requirements
- recognizedEquation: The equation in LaTeX format
- solutionSteps: Complete step-by-step solution in LaTeX (or explanation if unsolvable)
- isSolvable: true if solved successfully, false otherwise`,
});

const solveImageEquationFlow = ai.defineFlow(
  {
    name: 'solveImageEquationFlow',
    inputSchema: SolveImageEquationInputSchema,
    outputSchema: SolveImageEquationOutputSchema,
  },
  async (input: z.infer<typeof SolveImageEquationInputSchema>) => {
    try {
      const {output} = await prompt(input, {
        config: {
          temperature: 0.2, // Low temperature for accurate math
          topP: 0.85,
          maxOutputTokens: 4096,
        },
      });
      return output!;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Return a structured error response
      return {
        recognizedEquation: 'Unable to process image',
        solutionSteps: `Error: ${errorMessage}. Please ensure the image is clear and contains a visible mathematical equation.`,
        isSolvable: false,
      };
    }
  }
);
