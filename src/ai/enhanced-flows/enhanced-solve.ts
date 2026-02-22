'use server';

/**
 * Enhanced Problem Solver with Smart Fallback
 */

import { generateWithFallback } from '../multi-provider-router';
import { z } from 'genkit';

const EnhancedSolveInputSchema = z.object({
  problem: z.string().describe('The problem to solve'),
  tone: z.enum(['helpful', 'formal', 'casual']).optional(),
  technicalLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  preferredModel: z.string().optional(),
});

const EnhancedSolveOutputSchema = z.object({
  solution: z.string().describe('The solution to the problem'),
  modelUsed: z.string().describe('The model that generated the solution'),
});

export type EnhancedSolveInput = z.infer<typeof EnhancedSolveInputSchema>;
export type EnhancedSolveOutput = z.infer<typeof EnhancedSolveOutputSchema>;

export async function enhancedSolve(input: EnhancedSolveInput): Promise<EnhancedSolveOutput> {
  const { problem, tone = 'helpful', technicalLevel = 'intermediate', preferredModel } = input;

  const systemPrompt = `You are an expert problem solver. Solve problems step-by-step with clear explanations.

Tone: ${tone}
Technical Level: ${technicalLevel}

Guidelines:
- Show your work step by step
- Explain your reasoning
- Provide accurate solutions
- Use appropriate technical depth for ${technicalLevel} level`;

  try {
    const response = await generateWithFallback({
      prompt: problem,
      systemPrompt,
      preferredModelId: preferredModel,
      category: 'math',
      params: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    return {
      solution: response.text,
      modelUsed: response.modelUsed || 'unknown',
    };
  } catch (error) {
    throw new Error(`Failed to solve problem: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}