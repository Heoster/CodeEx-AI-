'use server';

import {analyzePdf} from '@/ai/flows/analyze-pdf';
import {processUserMessage} from '@/ai/flows/process-user-message';
import {sendWelcomeEmail} from '@/ai/flows/send-welcome-email';
import {solveImageEquation} from '@/ai/flows/solve-image-equation';
import {enhancedImageSolver} from '@/ai/flows/enhanced-image-solver';
import {enhancedPdfAnalyzer} from '@/ai/flows/enhanced-pdf-analyzer';
import {env, getApiUrl} from '@/lib/env-config';
import type {
  AnalyzePdfInput,
  AnalyzePdfOutput,
  ProcessUserMessageInput,
  SolveImageEquationInput,
  SolveImageEquationOutput,
} from '@/lib/types';

function handleGenkitError(error: unknown): {error: string} {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Genkit flow failed:', error);

  // Check for the specific API key error and provide a helpful message.
  if (message.includes('API key') || message.includes('API_KEY')) {
    return {
      error: `AI processing failed. Your Groq API key is missing. Please create a free key at https://console.groq.com/keys and add it to the GROQ_API_KEY variable in your .env file.`,
    };
  }

  return {error: `AI processing failed: ${message}`};
}

// Type guard to check if response has error property
function isErrorResponse(response: any): response is {error: string} {
  return response && typeof response === 'object' && 'error' in response && typeof response.error === 'string';
}

// Type guard to ensure response is valid
function isValidResponse(response: any): boolean {
  return response && typeof response === 'object' && response !== null;
}

export async function generateResponse(
  input: ProcessUserMessageInput
): Promise<{content: string; modelUsed?: string; autoRouted?: boolean; routingReasoning?: string} | {error: string}> {
  try {
    // Use our working direct chat API instead of the problematic Genkit flow
    const response = await fetch(getApiUrl('/api/chat-direct'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input.message,
        history: input.history,
        settings: input.settings
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }
    
    return {
      content: data.content || 'No response generated',
      modelUsed: data.modelUsed,
      autoRouted: data.autoRouted,
      routingReasoning: data.routingReasoning,
    };
  } catch (error) {
    console.error('generateResponse error:', error);
    return handleGenkitError(error);
  }
}

export async function solveEquationFromImage(
  input: SolveImageEquationInput
): Promise<SolveImageEquationOutput | {error: string}> {
  try {
    // Try enhanced solver first (with multi-provider fallback)
    const response = await enhancedImageSolver({
      imageDataUri: input.photoDataUri,
      problemType: 'math',
    });
    return {
      recognizedEquation: response.recognizedContent,
      solutionSteps: response.solution,
      isSolvable: response.isSolvable,
    };
  } catch (error) {
    console.error('Enhanced image solver failed, using fallback:', error);
    try {
      // Fallback to original solver
      const response = await solveImageEquation(input);
      return response;
    } catch (fallbackError) {
      return handleGenkitError(fallbackError);
    }
  }
}

export async function analyzeDocumentFromPdf(
  input: AnalyzePdfInput
): Promise<AnalyzePdfOutput | {error: string}> {
  try {
    // Try enhanced analyzer first (with multi-provider fallback)
    const response = await enhancedPdfAnalyzer({
      pdfDataUri: input.pdfDataUri,
      question: input.question,
    });
    return response;
  } catch (error) {
    console.error('Enhanced PDF analyzer failed, using fallback:', error);
    try {
      // Fallback to original analyzer
      const response = await analyzePdf(input);
      return response;
    } catch (fallbackError) {
      return handleGenkitError(fallbackError);
    }
  }
}

export async function triggerWelcomeEmail(input: {
  email: string;
  displayName: string;
}): Promise<void | {error: string}> {
  try {
    await sendWelcomeEmail(input);
  } catch (error) {
    return handleGenkitError(error);
  }
}
