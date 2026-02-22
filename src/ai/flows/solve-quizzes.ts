'use server';

/**
 * @fileOverview Enhanced AI agent for solving quizzes, math problems, and calculations.
 * Supports math-optimized model routing and code detection.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';
import {getModelRegistry} from '@/lib/model-registry';
import {containsCode} from '@/ai/query-classifier';

const SolveQuizInputSchema = z.object({
  quiz: z.string().describe('The quiz question or calculation to solve.'),
  model: z.string().optional(),
  tone: z.enum(['helpful', 'formal', 'casual']).optional(),
  technicalLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
});
export type SolveQuizInput = z.infer<typeof SolveQuizInputSchema>;

const SolveQuizOutputSchema = z.object({
  solution: z
    .string()
    .describe('The solution to the quiz question or calculation.'),
});
export type SolveQuizOutput = z.infer<typeof SolveQuizOutputSchema>;

export async function solveQuiz(
  input: SolveQuizInput
): Promise<SolveQuizOutput> {
  return solveQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveQuizPrompt',
  input: {schema: SolveQuizInputSchema},
  output: {schema: SolveQuizOutputSchema},
  prompt: `You are a world-class problem solver and educator, expert in mathematics, science, logic, programming, and general knowledge.

## Your Task
Solve the following problem thoroughly and accurately.

## Problem
{{{quiz}}}

## Instructions
1. **Understand the Problem**: First, identify what type of problem this is (math, logic, coding, trivia, etc.)

2. **Show Your Work**: 
   - For math: Show step-by-step calculations with clear explanations
   - For coding: Provide working code with comments explaining the logic
   - For logic puzzles: Explain your reasoning process
   - For trivia/knowledge: Provide the answer with relevant context

3. **Format Your Response**:
   - Use markdown formatting for clarity
   - Use code blocks with language specification for any code
   - Use LaTeX notation (wrapped in $ or $$) for mathematical expressions when helpful
   - Number your steps for multi-step solutions

4. **Verify Your Answer**: Double-check calculations and logic before presenting

5. **Explain the Concept**: Briefly explain the underlying concept or method used

## Response Style
- Tone: {{#if tone}}{{tone}}{{else}}helpful and encouraging{{/if}}
- Technical Level: {{#if technicalLevel}}{{technicalLevel}}{{else}}intermediate{{/if}}

Provide a complete, accurate solution that helps the user understand both the answer and the method.`,
});

/**
 * Select the best model for solving the quiz
 */
function selectSolveModel(quiz: string, providedModel?: string): string | undefined {
  // If a model is explicitly provided, use it
  if (providedModel) {
    return providedModel;
  }
  
  const registry = getModelRegistry();
  
  // Try to get the best available model
  try {
    const defaultModel = registry.getDefaultModel();
    return defaultModel.id;
  } catch {
    // If registry has no available models, return undefined
    return undefined;
  }
}

const solveQuizFlow = ai.defineFlow(
  {
    name: 'solveQuizFlow',
    inputSchema: SolveQuizInputSchema,
    outputSchema: SolveQuizOutputSchema,
  },
  async (input: z.infer<typeof SolveQuizInputSchema>) => {
    try {
      // Select the best model for this quiz (may be undefined)
      const selectedModel = selectSolveModel(input.quiz, input.model);

      const promptOptions: any = {
        config: {
          temperature: 0.3, // Lower temperature for more accurate calculations
          topP: 0.85,
          maxOutputTokens: 4096,
        },
      };

      if (selectedModel) {
        promptOptions.model = selectedModel;
      }

      const {output} = await prompt(input, promptOptions);
      return output!;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        solution: `I encountered an issue solving this problem: ${errorMessage}. Please try rephrasing your question or breaking it into smaller parts.`,
      };
    }
  }
);
