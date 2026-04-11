'use server';

import {analyzePdf} from '@/ai/flows/analyze-pdf';
import {sendWelcomeEmail} from '@/ai/flows/send-welcome-email';
import {solveImageEquation} from '@/ai/flows/solve-image-equation';
import {enhancedImageSolver} from '@/ai/flows/enhanced-image-solver';
import {enhancedPdfAnalyzer} from '@/ai/flows/enhanced-pdf-analyzer';
import {generateWithSmartFallback} from '@/ai/smart-fallback';
import {buildSohamPromptContext, persistSohamMemory} from '@/lib/soham-agent-orchestrator';
import type {
  AnalyzePdfInput,
  AnalyzePdfOutput,
  ProcessUserMessageInput,
  SolveImageEquationInput,
  SolveImageEquationOutput,
} from '@/lib/types';

function handleError(error: unknown): {error: string} {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('API key') || message.includes('API_KEY') || message.includes('Authentication')) {
    return {
      error: `AI processing failed. Please check your API key configuration.`,
    };
  }
  return {error: `AI processing failed: ${message}`};
}

const getToneInstructions = (tone: string) => {
  switch (tone) {
    case 'formal': return 'Use professional language, proper grammar, and a respectful tone.';
    case 'casual': return 'Be friendly and conversational. Use simple language and contractions.';
    default: return 'Be warm, approachable, and supportive. Balance professionalism with friendliness.';
  }
};

const getTechnicalInstructions = (level: string) => {
  switch (level) {
    case 'beginner': return 'Explain concepts in simple terms. Avoid jargon and use analogies.';
    case 'expert': return 'Use technical terminology freely. Provide in-depth explanations.';
    default: return 'Balance technical accuracy with accessibility. Define specialized terms when first used.';
  }
};

export async function generateResponse(
  input: ProcessUserMessageInput
): Promise<{content: string; modelUsed?: string; autoRouted?: boolean; routingReasoning?: string} | {error: string}> {
  try {
    const { message, history = [], settings = {} as any, userId } = input;

    const systemPrompt = `You are SOHAM, an intelligent and versatile assistant created by Heoster. SOHAM stands for Self Organising Hyper Adaptive Machine, inspired by a Sanskrit word.

PERSONALITY & COMMUNICATION STYLE:
${getToneInstructions(settings.tone || 'helpful')}

TECHNICAL DEPTH:
${getTechnicalInstructions(settings.technicalLevel || 'intermediate')}

RESPONSE FORMATTING RULES (IMPORTANT):
- NEVER use # or ## or ### markdown headers in your responses. They look bad in chat.
- Use **bold** for emphasis, bullet points for lists, and code blocks for code.
- Keep responses conversational using paragraphs and bullets only — no headings.

RESPONSE GUIDELINES:
1. Be Accurate: If unsure, say so. Don't make up information.
2. Be Concise: Get to the point without unnecessary filler.
3. Stay Focused: Address the user's actual question directly.
4. For code: Always specify the language in code blocks.
5. For math: Show step-by-step working.

ABOUT SOHAM:
- Created by Heoster (Harsh), a 16-year-old developer from Khatauli, Uttar Pradesh, India
- Built and operated by CODEEX-AI
- Vision: Democratize AI education in India`;

    const convertedHistory = history.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      content: msg.content,
    }));

    const agentContext = await buildSohamPromptContext({
      message,
      history: convertedHistory,
      userId,
    });

    const preferredModelId = settings.model && settings.model !== 'auto' ? settings.model : undefined;

    const result = await generateWithSmartFallback({
      prompt: agentContext.prompt,
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

    // Persist memory non-blocking
    persistSohamMemory({
      userId,
      userMessage: message,
      assistantMessage: result.response.text,
      metadata: {
        toolsUsed: agentContext.toolsUsed.map((t: any) => t.tool),
        modelUsed: result.modelUsed,
        classification: 'MEDIUM',
      },
    }).catch(() => {});

    return {
      content: result.response.text,
      modelUsed: result.modelUsed,
      autoRouted: result.fallbackTriggered,
      routingReasoning: result.fallbackTriggered ? 'Fallback triggered' : 'Direct model usage',
    };
  } catch (error) {
    console.error('generateResponse error:', error);
    return handleError(error);
  }
}

export async function solveEquationFromImage(
  input: SolveImageEquationInput
): Promise<SolveImageEquationOutput | {error: string}> {
  try {
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
    try {
      return await solveImageEquation(input);
    } catch (fallbackError) {
      return handleError(fallbackError);
    }
  }
}

export async function analyzeDocumentFromPdf(
  input: AnalyzePdfInput
): Promise<AnalyzePdfOutput | {error: string}> {
  try {
    return await enhancedPdfAnalyzer({
      pdfDataUri: input.pdfDataUri,
      question: input.question,
    });
  } catch (error) {
    try {
      return await analyzePdf(input);
    } catch (fallbackError) {
      return handleError(fallbackError);
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
    return handleError(error);
  }
}
