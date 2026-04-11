'use server';

/**
 * @fileOverview Enhanced Genkit flow for intelligent conversation with context awareness.
 */

import { ai } from '@/ai/genkit';
import { getModelRegistry } from '@/lib/model-registry';
import { trimHistoryToFit } from '@/lib/context-validator';
import {z} from 'genkit';

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
  userId: z.string().optional().describe('User ID for memory retrieval'),
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
      return 'Be friendly and conversational. Use simple language and contractions where natural, but do not use emojis.';
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

type ResponseTemplateType = 'comparison' | 'how_to' | 'definition' | 'recommendation' | 'general';

const detectResponseTemplateType = (prompt: string): ResponseTemplateType => {
  const normalized = prompt.toLowerCase().trim();

  if (
    /\b(vs\.?|versus|compare|comparison|difference between|better than)\b/.test(normalized) ||
    /^.+\s+vs\.?\s+.+$/.test(normalized)
  ) {
    return 'comparison';
  }

  if (
    normalized.startsWith('how ') ||
    normalized.includes('how do i') ||
    normalized.includes('how to') ||
    normalized.includes('steps to') ||
    normalized.includes('guide to')
  ) {
    return 'how_to';
  }

  if (
    normalized.startsWith('what is') ||
    normalized.startsWith('who is') ||
    normalized.startsWith('define ') ||
    normalized.includes('meaning of') ||
    normalized.includes('explain ')
  ) {
    return 'definition';
  }

  if (
    normalized.includes('recommend') ||
    normalized.includes('which should i choose') ||
    normalized.includes('best option') ||
    normalized.includes('what should i use') ||
    normalized.includes('suggest ')
  ) {
    return 'recommendation';
  }

  return 'general';
};

const extractComparisonSubjects = (prompt: string): [string, string] | null => {
  const cleaned = prompt.replace(/\?+$/, '').trim();
  const vsMatch = cleaned.match(/(.+?)\s+vs\.?\s+(.+)/i);
  if (vsMatch) {
    return [vsMatch[1].trim(), vsMatch[2].trim()];
  }

  const betweenMatch = cleaned.match(/difference between\s+(.+?)\s+and\s+(.+)/i);
  if (betweenMatch) {
    return [betweenMatch[1].trim(), betweenMatch[2].trim()];
  }

  const compareMatch = cleaned.match(/compare\s+(.+?)\s+and\s+(.+)/i);
  if (compareMatch) {
    return [compareMatch[1].trim(), compareMatch[2].trim()];
  }

  return null;
};

const getResponseTemplateInstruction = (prompt: string): string => {
  const templateType = detectResponseTemplateType(prompt);

  switch (templateType) {
    case 'comparison': {
      const subjects = extractComparisonSubjects(prompt);
      const subjectLine = subjects
        ? `The two items being compared are **${subjects[0]}** and **${subjects[1]}**.`
        : 'Identify the items being compared clearly before discussing them.';

      return `\n## Response Template For This Query
Use a **comparison-first** structure.
${subjectLine}
- Start with a short **Direct answer** section.
- Then provide a valid markdown **comparison table** with concise rows such as purpose, strengths, weaknesses, speed, cost, security, ease of use, and best use case when relevant.
- After the table, add a **Key differences** bullet list.
- End with a short **Which to choose** recommendation if the user seems decision-oriented.
- If facts are uncertain, say so clearly inside the table or notes.`;
    }
    case 'how_to':
      return `\n## Response Template For This Query
Use a **how-to** structure.
- Start with a 1-2 sentence **Overview**.
- Then provide a numbered **Steps** section.
- Add a **Tips** or **Common mistakes** section if useful.
- End with a short **Result** or **Next actions** section.`;
    case 'definition':
      return `\n## Response Template For This Query
Use a **definition/explanation** structure.
- Start with a short **Direct answer**.
- Then add **Key points** as bullets.
- If useful, include a small **table** for examples, properties, or terminology.
- Keep the explanation compact and clear before expanding into detail.`;
    case 'recommendation':
      return `\n## Response Template For This Query
Use a **recommendation** structure.
- Start with the **Top recommendation** first.
- Then provide a markdown **table** comparing the main options.
- Add a short **Why this choice** section.
- End with **When to choose another option** if applicable.`;
    default:
      return `\n## Response Template For This Query
Use a clear structure with a short direct answer first, then grouped bullets or sections as needed.`;
  }
};

const generateAnswerFromContextFlow = ai.defineFlow(
  {
    name: 'generateAnswerFromContextFlow',
    inputSchema: GenerateAnswerFromContextInputSchema,
    outputSchema: GenerateAnswerFromContextOutputSchema,
  },
  async (input: z.infer<typeof GenerateAnswerFromContextInputSchema>) => {
    const {messages, tone = 'helpful', technicalLevel = 'intermediate', model, userId} = input;

    const systemInstruction = `You are SOHAM, an intelligent assistant built by Heoster (CODEEX-AI).

ABOUT SOHAM & HEOSTER (answer these questions confidently — this is factual information you know):
- SOHAM stands for Self Organising Hyper Adaptive Machine, also inspired by the Sanskrit mantra "I am That"
- Created by **Heoster** (real name: **Harsh**), 16 years old
- Location: Khatauli, Uttar Pradesh, India
- School: **Maples Academy Khatauli**, Class 12th PCM
- Company: **CODEEX-AI**, founded by Heoster
- Contact: codeex@email.com | GitHub: @heoster | LinkedIn: codeex-heoster-4b60b8399
- Vision: Democratize AI education in India
- When asked about Heoster's school, age, location, or background — answer directly and confidently. Do NOT say "I don't have that information."

CAPABILITIES:
- 35+ AI models: Groq, Google Gemini, Cerebras, HuggingFace
- Image generation via Pollinations.ai (FLUX) — trigger: "generate image of..."
- Voice: Groq Whisper STT + Orpheus TTS (voices: troy, diana, hannah, autumn, austin, daniel)
- PDF analysis, visual math solver, web search (auto-triggered for real-time queries)
- Memory system (optional, user-specific)
- 100% free, open-source, privacy-first

TONE & STYLE:
${getToneInstructions(tone)}

TECHNICAL DEPTH:
${getTechnicalInstructions(technicalLevel)}

RESPONSE RULES:
- Be accurate. Say so if unsure. Never fabricate.
- NEVER use # or ## or ### markdown headers. Use **bold**, bullets, and code blocks only.
- Use markdown: code blocks with language, tables for comparisons, numbered lists for steps.
- Bold key terms and decisions. Keep spacing clean — no walls of text.
- For code: specify language, explain key parts, note edge cases.
- For math: show step-by-step working.
- For comparisons: lead with a markdown table, then add notes.
- For "how" questions: short overview then numbered steps.
- For "what/why" questions: direct answer then key points.`;

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

      // ============================================================================
      // Memory System Integration (Requirements 7.7, 7.12, 12.7)
      // ============================================================================
      let enhancedPrompt = `${promptText}\n\n${getResponseTemplateInstruction(promptText)}`;
      
      // Check if memory system is enabled and userId is provided
      const { env } = await import('@/lib/env-config');
      
      if (env.features.enableMemorySystem && userId) {
        try {
          // Import memory system service
          const { getMemorySystemService } = await import('@/lib/memory-system-service');
          const memoryService = getMemorySystemService();
          
          // Search for relevant memories
          const memoryResults = await memoryService.searchMemories({
            userId,
            queryText: promptText,
            topK: 5, // Retrieve top 5 most relevant memories
            minSimilarity: 0.7, // Only include memories with >70% similarity
          });
          
          // Inject memories into prompt if any were found
          if (memoryResults.length > 0) {
            enhancedPrompt = memoryService.injectMemoriesIntoPrompt(promptText, memoryResults);
            console.log(`[Memory System] Injected ${memoryResults.length} relevant memories for user ${userId}`);
          } else {
            console.log(`[Memory System] No relevant memories found for user ${userId}`);
          }
        } catch (memoryError) {
          // Requirement 7.12: Handle memory system failures gracefully
          // Requirement 12.7: Continue without memory injection on failure
          console.warn('[Memory System] Failed to retrieve memories, continuing without memory context:', memoryError);
          // Continue with original prompt - don't fail the entire request
        }
      }

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
        prompt: enhancedPrompt, // Use enhanced prompt with memory context
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

      const stripVocalDirections = (text: string) => {
        return text
          .replace(/\[(cheerful|serious|whisper|menacing whisper|dark chuckle|excited|sad)\]/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      };

      const normalizeMarkdownStructure = (text: string) => {
        return text
          .replace(/\r\n/g, '\n')
          .replace(/(#{1,6}\s[^\n]+)\n(?=\|)/g, '$1\n\n')
          .replace(/([^\n])\n(\|[^\n]+\|)/g, '$1\n\n$2')
          .replace(/(\|[^\n]+\|)\n(?!\||\n)/g, '$1\n\n')
          .replace(/([^\n])\n([-*]\s)/g, '$1\n\n$2')
          .replace(/([^\n])\n(\d+\.\s)/g, '$1\n\n$2')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      };

      return {answer: normalizeMarkdownStructure(stripVocalDirections(result.response.text))};
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
