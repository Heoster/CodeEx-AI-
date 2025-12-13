'use server';
/**
 * @fileOverview A primary Genkit flow that routes user messages to the appropriate tool or generates a conversational response.
 * Now with multi-model support, auto-routing, and command routing.
 *
 * - processUserMessage - The main function that handles user input.
 * - ProcessUserMessageInput - The input type for the processUserMessage function.
 * - ProcessUserMessageOutput - The return type for the processUserMessage function.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';
import {generateAnswerFromContext} from './generate-answer-from-context';
import type {ProcessUserMessageInput} from '@/lib/types';
import {solveQuiz} from './solve-quizzes';
import {summarizeInformation} from './summarize-information';
import {searchTheWeb} from './web-search';
import {enhancedSolve} from './enhanced-solve';
import {enhancedSummarize} from './enhanced-summarize';
import {enhancedSearch} from './enhanced-search';
import {getAutoRouter} from '@/ai/auto-router';
import {getCommandRouter} from '@/ai/command-router';

// Extended schema to support all model IDs
const ProcessUserMessageInputSchema = z.object({
  message: z.string().describe('The latest message from the user.'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  settings: z.object({
    model: z.string().describe('Model ID or "auto" for automatic selection'),
    preferredCategory: z.enum(['general', 'coding', 'math', 'conversation', 'multimodal']).optional(),
    tone: z.enum(['helpful', 'formal', 'casual']),
    technicalLevel: z.enum(['beginner', 'intermediate', 'expert']),
    enableSpeech: z.boolean(),
    voice: z.enum(['Algenib', 'Enceladus', 'Achernar', 'Heka']),
  }),
});

const ProcessUserMessageOutputSchema = z.object({
  answer: z.string().describe('The generated response to the user message.'),
  modelUsed: z.string().optional().describe('The model that generated this response.'),
  autoRouted: z.boolean().optional().describe('Whether auto-routing was used.'),
  routingReasoning: z.string().optional().describe('Explanation of why this model was selected.'),
});

export type ProcessUserMessageOutput = z.infer<
  typeof ProcessUserMessageOutputSchema
>;

export async function processUserMessage(
  input: ProcessUserMessageInput
): Promise<ProcessUserMessageOutput> {
  try {
    return await processUserMessageFlow(input);
  } catch (err) {
    console.error('processUserMessageFlow failed:', err);
    // Return a helpful fallback so callers don't crash.
    return {
      answer:
        'AI service is temporarily unavailable. Please try again in a moment or check the server logs for details.',
    } as ProcessUserMessageOutput;
  }
}

const processUserMessageFlow = ai.defineFlow(
  {
    name: 'processUserMessageFlow',
    inputSchema: ProcessUserMessageInputSchema,
    outputSchema: ProcessUserMessageOutputSchema,
  },
  async (args: z.infer<typeof ProcessUserMessageInputSchema>) => {
    const {message, history, settings} = args;
    const isAutoMode = settings.model === 'auto';
    const autoRouter = getAutoRouter();
    const commandRouter = getCommandRouter();
    
    // Check for special commands first
    const commandResult = commandRouter.routeCommand(message, settings.model, isAutoMode);
    
    if (commandResult) {
      const { command, content, model, reasoning } = commandResult;
      
      // Resolve a genkit-compatible model string (prefer provider-prefixed modelId)
      const resolveGenkitModel = (m: any): string | undefined => {
        if (!m) return undefined;
        if (m.provider && m.modelId) return `${m.provider}/${m.modelId}`;
        if (m.id) return m.id;
        if ((m as any).modelId) return (m as any).modelId;
        return undefined;
      };

      const genkitModel = resolveGenkitModel(model);
      
      if (command === 'solve') {
        try {
          const {solution, modelUsed} = await enhancedSolve({
            problem: content,
            tone: settings.tone,
            technicalLevel: settings.technicalLevel,
            preferredModel: model.id,
          });
          return {
            answer: solution,
            modelUsed: modelUsed || model.id,
            autoRouted: isAutoMode,
            routingReasoning: reasoning,
          };
        } catch (error) {
          console.error('Enhanced solve failed, using fallback:', error);
          const {solution} = await solveQuiz({
            quiz: content, 
            model: genkitModel,
            tone: settings.tone,
            technicalLevel: settings.technicalLevel,
          });
          return {
            answer: solution,
            modelUsed: model.id,
            autoRouted: isAutoMode,
            routingReasoning: reasoning,
          };
        }
      }
      
      if (command === 'summarize') {
        try {
          const {summary, modelUsed} = await enhancedSummarize({
            text: content,
            preferredModel: model.id,
          });
          return {
            answer: summary,
            modelUsed: modelUsed || model.id,
            autoRouted: isAutoMode,
            routingReasoning: reasoning,
          };
        } catch (error) {
          console.error('Enhanced summarize failed, using fallback:', error);
          const {summary} = await summarizeInformation({text: content, model: genkitModel});
          return {
            answer: summary,
            modelUsed: model.id,
            autoRouted: isAutoMode,
            routingReasoning: reasoning,
          };
        }
      }
      
      if (command === 'search') {
        try {
          const {answer, modelUsed} = await enhancedSearch({query: content, preferredModel: model.id});
          return {
            answer,
            modelUsed: modelUsed || model.id,
            autoRouted: isAutoMode,
            routingReasoning: reasoning,
          };
        } catch (error) {
          console.error('Enhanced search failed, using fallback:', error);
          const {answer} = await searchTheWeb({query: content});
          return {
            answer,
            modelUsed: model.id,
            autoRouted: isAutoMode,
            routingReasoning: reasoning,
          };
        }
      }
    }
    
    // Default conversational response with auto-routing
    const routeResult = autoRouter.route(
      message, 
      settings.model, 
      settings.preferredCategory
    );
    
    // Pass the model ID directly - generate-answer-from-context will handle it
    const modelId = routeResult.model.id;
    
    const {answer} = await generateAnswerFromContext({
      messages: history,
      tone: settings.tone,
      technicalLevel: settings.technicalLevel,
      model: modelId,
    });

    return {
      answer,
      modelUsed: routeResult.model.id,
      autoRouted: routeResult.autoRouted,
      routingReasoning: routeResult.classification.reasoning,
    };
  }
);
