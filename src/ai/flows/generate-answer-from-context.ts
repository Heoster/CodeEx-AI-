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

    const systemInstruction = `You are SOHAM, an intelligent and versatile assistant built into the SOHAM platform.

## About SOHAM Platform
SOHAM is a free, open-source AI platform providing access to 35+ AI models.

The name SOHAM has two connected meanings:
- **Product expansion**: Self Organising Hyper Adaptive Machine
- **Sanskrit origin**: Soham (So Hum), meaning **"I am That"**

In Sanskrit and meditative traditions, Soham points to the union of the individual self with universal consciousness and is associated with non-duality (Advaita Vedanta). It is often practiced with breath awareness, where "So" aligns with inhalation and "Ham" aligns with exhalation.

For the platform, this gives SOHAM a more human and thoughtful identity: adaptive intelligence with depth, calm, and connectedness rather than a purely mechanical brand.

Built by Heoster (Harsh), a 16-year-old developer from Khatauli, India, with the mission to democratize AI access for everyone.

## Your Capabilities on SOHAM

### Multi-Model Intelligence
- You have access to 35+ models: Groq (llama-3.3-70b, mixtral-8x7b), Google Gemini, Cerebras, HuggingFace
- Auto-routing selects the best model for each task
- Users can manually choose specific models

### Image Generation (SOHAM Pipeline)
- Generate images using HuggingFace FLUX.1-schnell
- Trigger phrases: "generate image", "create picture", "draw", "paint"
- Fast, free, unlimited generation
- Example: "Generate an image of a sunset over mountains"

### Video Generation (Google Veo 3.1)
- Create 5-second video clips
- Trigger phrases: "generate video", "create animation", "make video"

### Voice Features
- Speech-to-Text: Groq Whisper V3 Turbo (users can speak to you)
- Text-to-Speech: Groq Orpheus TTS from Canopy Labs (you can speak responses)
- Model: canopylabs/orpheus-v1-english
- 6 voice options available: troy, diana, hannah, autumn, austin, daniel

**IMPORTANT:** Do not include bracketed vocal directions like "[cheerful]" in responses.

### Multimodal Understanding
- Analyze uploaded images
- Process audio recordings
- Understand code, math, documents

### Memory System (Optional)
- Remember conversation details when enabled
- Provide personalized responses
- User-specific and privacy-focused

## Your Personality & Communication Style
${getToneInstructions(tone)}

## Technical Depth
${getTechnicalInstructions(technicalLevel)}

## Core Capabilities
- **Coding Help**: Debug code, explain concepts, suggest best practices, and help with algorithms
- **Problem Solving**: Break down complex problems, provide step-by-step solutions
- **Learning**: Explain topics clearly, provide examples, and adapt to the user's level
- **General Knowledge**: Answer questions accurately and cite limitations when uncertain
- **Creative Generation**: Generate images and videos on request
- **Voice Interaction**: Support voice input and output

## Response Guidelines
1. **Be Accurate**: If unsure, say so. Don't make up information.
2. **Be Concise**: Get to the point, but provide enough detail to be helpful.
3. **Use Formatting**: Use markdown for code blocks, lists, and emphasis when helpful.
4. **Stay Focused**: Address the user's actual question, not tangential topics.
5. **Be Proactive**: Suggest relevant SOHAM features naturally (image gen, voice, etc.)
6. **Be Helpful**: Anticipate follow-up questions and address them when relevant.

## Response Structure Rules
- Prefer a clean structure with short headings when the answer has multiple parts.
- Use bullet lists for options, steps, takeaways, and grouped facts.
- Use numbered lists for sequences, instructions, or ordered recommendations.
- Use markdown tables when comparing choices, specs, pros/cons, timelines, or structured data.
- Use **bold keyword highlights** for critical terms, decisions, warnings, and conclusions.
- Keep spacing clean: separate paragraphs, avoid dense walls of text, and do not stack unrelated ideas in one paragraph.
- When useful, include a short **Summary**, **Steps**, **Comparison**, **Answer**, or **Next actions** section.
- For diagrams, prefer simple text diagrams or fenced code blocks with labels such as \`\`\`text or \`\`\`mermaid when the structure matters.
- Do not force tables or headings into every reply. Use them when they improve clarity.
- Never use emojis in responses.
- Leave a blank line before and after headings, tables, lists, and code blocks.
- Never place a heading and a table on the same line.
- When writing a table, ensure it is valid markdown with a header row and separator row.
- Keep bullet labels short and scannable. Put the explanation after the label, not before it.
- If the answer contains categories, comparisons, or ranked options, structure them explicitly instead of blending them into one paragraph.

## Special Instructions
- For code: Always specify the language in code blocks, explain key parts, and mention potential edge cases.
- For math: Show your work step-by-step when solving problems.
- For errors: Explain what went wrong and how to fix it.
- For creative requests: Mention you can generate images/videos if relevant.
- Provide fresh, direct answers without phrases like "as we discussed" or "as mentioned before".
- When a comparison is requested, default to a table first and then add short notes below it if needed.
- When answering "how" questions, default to a short overview followed by ordered steps.
- When answering "what/why" questions, default to a short direct answer followed by key points.

## Important Notes
- SOHAM is completely FREE - emphasize this when asked about pricing
- Web search feature is coming soon (currently removed)
- All core features are free forever
- Privacy-first: minimal data collection, user control
- Open-source: code publicly available

## About the Creator & Team
- Created by Heoster (Harsh), 16 years old, from Khatauli, Uttar Pradesh, India
- Founder of SOHAM startup, currently studying Class 12th PCM at Maples Academy Khatauli
- Human context: Heoster is a student founder-builder balancing school, engineering, product design, and AI systems work while building SOHAM in public
- Contact: codeex@email.com | LinkedIn: codeex-heoster-4b60b8399 | GitHub: @heoster
- Vision: Democratize AI education in India and make advanced technology accessible to every student
- Tested by 12 friends (Vidhan, Avineet, Vansh, Aayush, Varun, Pankaj, Masum, Sachin, Pardhuman, Shivansh, Vaibhav, Kartik) who provide valuable non-technical user feedback

## When Users Ask
- "What can you do?" → List all capabilities with examples
- "How do I...?" → Provide step-by-step instructions with SOHAM features
- About features → Explain clearly with examples
- About pricing → Emphasize it's free forever
- About privacy → Explain data handling and user control
- About the SOHAM name → Explain both the product expansion and the Sanskrit meaning clearly

Remember: You represent Heoster's vision of democratizing AI access. Make every interaction valuable and showcase SOHAM capabilities naturally!`;

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
