'use server';

/**
 * @fileOverview Enhanced Genkit flow for intelligent conversation with context awareness.
 */

import { ai } from '@/ai/genkit';
import { getModelRegistry } from '@/lib/model-registry';
import { trimHistoryToFit } from '@/lib/context-validator';
import {z} from 'genkit';
import type {MessageData} from 'genkit';

const GenerateAnswerFromContextInputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  model: z.string().optional(),
  tone: z.enum(['helpful', 'formal', 'casual']).optional(),
  technicalLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
});
export type GenerateAnswerFromContextInput = z.infer<
  typeof GenerateAnswerFromContextInputSchema
>;

const GenerateAnswerFromContextOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type GenerateAnswerFromContextOutput = z.infer<
  typeof GenerateAnswerFromContextOutputSchema
>;

export async function generateAnswerFromContext(
  input: GenerateAnswerFromContextInput
): Promise<GenerateAnswerFromContextOutput> {
  return generateAnswerFromContextFlow(input);
}

// Enhanced system prompts based on tone and technical level
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

const generateAnswerFromContextFlow = ai.defineFlow(
  {
    name: 'generateAnswerFromContextFlow',
    inputSchema: GenerateAnswerFromContextInputSchema,
    outputSchema: GenerateAnswerFromContextOutputSchema,
  },
  async (input: z.infer<typeof GenerateAnswerFromContextInputSchema>) => {
    const {messages, tone = 'helpful', technicalLevel = 'intermediate', model} = input;

    const systemInstruction = `You are CODEEX AI, an intelligent and versatile assistant created by Heoster. You excel at helping users with coding, problem-solving, learning, and general questions.

## Your Personality & Communication Style
${getToneInstructions(tone)}

## Technical Depth
${getTechnicalInstructions(technicalLevel)}

## Core Capabilities
- **Coding Help**: Debug code, explain concepts, suggest best practices, and help with algorithms
- **Problem Solving**: Break down complex problems, provide step-by-step solutions
- **Learning**: Explain topics clearly, provide examples, and adapt to the user's level
- **General Knowledge**: Answer questions accurately and cite limitations when uncertain

## Response Guidelines
1. **Be Accurate**: If unsure, say so. Don't make up information.
2. **Be Concise**: Get to the point, but provide enough detail to be helpful.
3. **Use Formatting**: Use markdown for code blocks, lists, and emphasis when helpful.
4. **Stay Focused**: Address the user's actual question, not tangential topics.
5. **Be Proactive**: Anticipate follow-up questions and address them when relevant.

## Special Instructions
- For code: Always specify the language in code blocks, explain key parts, and mention potential edge cases.
- For math: Show your work step-by-step when solving problems.
- For errors: Explain what went wrong and how to fix it.
- Remember context from the conversation to provide coherent, continuous assistance.`;

    // Map roles: 'assistant' -> 'model' for our adapter
    // Convert to our adapter's MessageData format
    let history: Array<{role: 'user' | 'model' | 'assistant'; content: string}> = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: msg.content,
    }));

    // The Google Generative API expects the first message in the conversation
    // to be from the user. If the client-supplied history starts with assistant
    // messages (mapped to 'model'), trim those leading model entries so the
    // first entry we send is a user message.
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const lastMessage = history.pop();
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('The last message must be from the user.');
    }
    
    // Keep minimum context to preserve conversation coherence
    // Maintain at least the last 2 exchanges (4 messages: 2 user + 2 assistant)
    const MIN_HISTORY = 4;
    
    // Trim from the beginning if history is too long, but keep minimum
    while (history.length > MIN_HISTORY && history[0].role !== 'user') {
      history.shift();
    }
    
    // Get the model config for context window validation
    const registry = getModelRegistry();
    const modelConfig = model ? registry.getModel(model) : registry.getDefaultModel();
    
    if (modelConfig) {
      // Trim history to fit within context window
      history = trimHistoryToFit(
        lastMessage.content,
        modelConfig,
        systemInstruction,
        history
      ) as Array<{role: 'user' | 'model' | 'assistant'; content: string}>;
    }

    try {
      // Extract the text from the last message content
      const promptText = lastMessage.content;

      // Use our smart fallback system with Groq models
      const { generateWithSmartFallback } = await import('../smart-fallback');
      
      // Extract model ID if provided
      let preferredModelId: string | undefined;
      if (typeof model === 'string' && model) {
        // Handle various formats: 'model-id', 'provider/model-id'
        if (model.includes('/')) {
          const parts = model.split('/');
          // If it's like 'provider/model-id', take the last part
          preferredModelId = parts[parts.length - 1];
        } else {
          preferredModelId = model;
        }
        
        console.log(`Requested model: ${model}, extracted ID: ${preferredModelId}`);
      }

      const result = await generateWithSmartFallback({
        prompt: promptText,
        systemPrompt: systemInstruction,
        history,
        preferredModelId,
        category: 'general',
        params: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 4096,
        },
      });

      return {answer: result.response.text};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide helpful error messages
      if (errorMessage.includes('API key') || errorMessage.includes('GROQ_API_KEY')) {
        throw new Error('Groq API key is missing or invalid. Get a free key at https://console.groq.com/keys and add it to your .env.local file as GROQ_API_KEY');
      }
      if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
        throw new Error('AI service is temporarily busy. Please try again in a moment.');
      }
      if (errorMessage.includes('safety')) {
        throw new Error('I cannot respond to that request. Please try rephrasing your question.');
      }
      if (errorMessage.includes('All models failed')) {
        throw new Error('All AI models are currently unavailable. This may be due to high demand. Please try again in a few minutes.');
      }
      
      throw error;
    }
  }
);
