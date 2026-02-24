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
    // Import smart fallback directly for server-side use
    const { generateWithSmartFallback } = await import('@/ai/smart-fallback');
    
    // Build system prompt based on settings
    const getToneInstructions = (tone: string) => {
      switch (tone) {
        case 'formal':
          return 'Use professional language, proper grammar, and a respectful tone. Avoid contractions and casual expressions.';
        case 'casual':
          return 'Be friendly and conversational. Use simple language, contractions are fine, and feel free to use appropriate emojis occasionally.';
        default:
          return 'Be warm, approachable, and supportive. Balance professionalism with friendliness.';
      }
    };

    const getTechnicalInstructions = (level: string) => {
      switch (level) {
        case 'beginner':
          return 'Explain concepts in simple terms. Avoid jargon, use analogies, and break down complex ideas into easy steps. Assume no prior knowledge.';
        case 'expert':
          return 'Use technical terminology freely. Provide in-depth explanations, include advanced concepts, and assume strong foundational knowledge.';
        default:
          return 'Balance technical accuracy with accessibility. Define specialized terms when first used and provide moderate detail.';
      }
    };

    const systemPrompt = `You are CODEEX AI, an intelligent and versatile assistant created by Heoster. You excel at helping users with coding, problem-solving, learning, and general questions.

## Your Personality & Communication Style
${getToneInstructions(input.settings.tone)}

## Technical Depth
${getTechnicalInstructions(input.settings.technicalLevel)}

## Core Capabilities
- **Coding Help**: Debug code, explain concepts, suggest best practices, and help with algorithms
- **Problem Solving**: Break down complex problems, provide step-by-step solutions
- **Learning**: Explain topics clearly, provide examples, and adapt to the user's level
- **General Knowledge**: Answer questions accurately and cite limitations when uncertain

## Response Guidelines
1. **Be Accurate**: If unsure, say so. Don't make up information.
2. **Be Concise**: Get to the point, but provide enough detail to be helpful. Avoid phrases like "as we discussed", "as mentioned before", or "previously said".
3. **Use Formatting**: Use markdown for code blocks, lists, and emphasis when helpful.
4. **Stay Focused**: Address the user's actual question directly without referencing past exchanges.
5. **Be Proactive**: Anticipate follow-up questions and address them when relevant.

## Special Instructions
- For code: Always specify the language in code blocks, explain key parts, and mention potential edge cases.
- For math: Show your work step-by-step when solving problems.
- For errors: Explain what went wrong and how to fix it.
- Provide fresh, direct answers without referencing previous messages unless absolutely necessary for context.

## About CODEEX AI
- Created by Heoster (Harsh), a 16-year-old developer from Khatauli, Uttar Pradesh, India
- Founder of CODEEX AI startup, currently studying Class 11th PCM at Maples Academy
- Contact: the.heoster@mail.com | LinkedIn: codeex-heoster-4b60b8399 | GitHub: @heoster
- Vision: Democratize AI education in India and make advanced technology accessible to every student
- Built with 26+ AI models, serving 100+ countries with 99.9% uptime
- Friends & Testers: A group of friends who help test and provide feedback: VIDHAn, AVINEEt, vansh, AAYUSH, VARUN, pankaj, MASUM, SACHINpardhuman, shivansh, Vaibhav, Kartik, Harsh`;

    // Convert history to the format expected by smart fallback
    const convertedHistory = input.history.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
      content: msg.content
    }));

    // Determine preferred model
    let preferredModelId: string | undefined;
    if (input.settings.model && input.settings.model !== 'auto') {
      preferredModelId = input.settings.model;
      console.log(`[Actions] User selected model: ${preferredModelId}`);
    } else {
      console.log('[Actions] Using auto model selection');
    }

    // Use smart fallback system directly (server-side)
    const result = await generateWithSmartFallback({
      prompt: input.message,
      systemPrompt,
      history: convertedHistory,
      preferredModelId,
      category: 'general',
      params: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });
    
    console.log(`[Actions] Response generated with model: ${result.modelUsed}, fallback triggered: ${result.fallbackTriggered}`);
    
    return {
      content: result.response.text,
      modelUsed: result.modelUsed,
      autoRouted: result.fallbackTriggered,
      routingReasoning: result.fallbackTriggered ? 'Fallback triggered' : 'Direct model usage',
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
