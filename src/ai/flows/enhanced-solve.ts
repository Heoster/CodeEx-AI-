'use server';

/**
 * Enhanced Problem Solver with Multi-Provider Support
 */

import { z } from 'genkit';
import { generateWithFallback } from '../multi-provider-router';

const EnhancedSolveInputSchema = z.object({
  problem: z.string().describe('The problem or quiz to solve.'),
  tone: z.enum(['helpful', 'formal', 'casual']).optional(),
  technicalLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  preferredModel: z.string().optional(),
});

const EnhancedSolveOutputSchema = z.object({
  solution: z.string().describe('The solution to the problem.'),
  modelUsed: z.string().optional(),
});

export type EnhancedSolveInput = z.infer<typeof EnhancedSolveInputSchema>;
export type EnhancedSolveOutput = z.infer<typeof EnhancedSolveOutputSchema>;

export async function enhancedSolve(input: EnhancedSolveInput): Promise<EnhancedSolveOutput> {
  const systemPrompt = `You are a world-class problem solver and educator, expert in mathematics, science, logic, programming, and general knowledge.

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
- Tone: ${input.tone || 'helpful and encouraging'}
- Technical Level: ${input.technicalLevel || 'intermediate'}`;

  const prompt = `Solve the following problem:\n\n${input.problem}`;

  try {
    const response = await generateWithFallback({
      prompt,
      systemPrompt,
      preferredModelId: input.preferredModel,
      category: 'math',
      params: {
        temperature: 0.3,
        topP: 0.85,
        maxOutputTokens: 4096,
      },
    });

    return {
      solution: response.text,
      modelUsed: response.modelUsed,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to solve problem: ${errorMessage}`);
  }
}
