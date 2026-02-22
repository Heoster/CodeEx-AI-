import { NextRequest, NextResponse } from 'next/server';
import { generateWithSmartFallback } from '@/ai/smart-fallback';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, settings } = body;

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
${getToneInstructions(settings.tone)}

## Technical Depth
${getTechnicalInstructions(settings.technicalLevel)}

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
- Built with 26+ AI models, serving 100+ countries with 99.9% uptime`;

    // Convert history to the format expected by smart fallback
    const convertedHistory = history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: msg.content
    }));

    // Determine preferred model
    let preferredModelId: string | undefined;
    if (settings.model && settings.model !== 'auto') {
      preferredModelId = settings.model;
    }

    // Use smart fallback system directly
    const result = await generateWithSmartFallback({
      prompt: message,
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

    return NextResponse.json({
      content: result.response.text,
      modelUsed: result.modelUsed,
      autoRouted: result.fallbackTriggered,
      routingReasoning: result.fallbackTriggered ? 'Fallback triggered' : 'Direct model usage'
    });

  } catch (error) {
    console.error('Direct chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages
    if (errorMessage.includes('API key') || errorMessage.includes('GROQ_API_KEY')) {
      return NextResponse.json(
        { error: 'Groq API key is missing or invalid. Get a free key at https://console.groq.com/keys and add it to your .env.local file as GROQ_API_KEY' },
        { status: 500 }
      );
    }
    if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
      return NextResponse.json(
        { error: 'AI service is temporarily busy. Please try again in a moment.' },
        { status: 500 }
      );
    }
    if (errorMessage.includes('All models failed')) {
      return NextResponse.json(
        { error: 'All AI models are currently unavailable. This may be due to high demand. Please try again in a few minutes.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}