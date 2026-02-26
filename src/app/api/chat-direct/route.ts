import { NextRequest, NextResponse } from 'next/server';
import { generateWithSmartFallback } from '@/ai/smart-fallback';
import { getSafetyGuardService } from '@/lib/safety-guard-service';
import { getTaskClassifierService } from '@/lib/task-classifier-service';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    { message: 'OK' },
    { 
      status: 200,
      headers: corsHeaders,
    }
  );
}

// Handle GET requests with helpful error
export async function GET() {
  return NextResponse.json(
    {
      error: 'METHOD_NOT_ALLOWED',
      message: 'This endpoint only accepts POST requests',
      usage: {
        method: 'POST',
        endpoint: '/api/chat-direct',
        contentType: 'application/json',
        body: {
          message: 'string (required)',
          history: 'array (optional)',
          settings: 'object (optional)',
        },
      },
      documentation: '/documentation/api-reference',
    },
    { 
      status: 405,
      headers: corsHeaders,
    }
  );
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: 'INVALID_REQUEST',
          message: 'Invalid JSON in request body',
          timestamp: new Date().toISOString(),
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const { message, history = [], settings = {} } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          error: 'MISSING_MESSAGE',
          message: 'Message field is required and must be a string',
          timestamp: new Date().toISOString(),
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'EMPTY_MESSAGE',
          message: 'Message cannot be empty',
          timestamp: new Date().toISOString(),
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { 
          error: 'MESSAGE_TOO_LONG',
          message: 'Message exceeds maximum length of 10,000 characters',
          currentLength: message.length,
          maxLength: 10000,
          timestamp: new Date().toISOString(),
        },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ============================================================================
    // SAFETY CHECK - Input Validation (Requirement 2.1, 2.2, 2.3)
    // ============================================================================
    const safetyGuard = getSafetyGuardService();
    
    if (safetyGuard.isEnabled()) {
      try {
        const safetyCheck = await safetyGuard.checkInput({
          content: message,
          type: 'INPUT',
          context: history.length > 0 ? JSON.stringify(history.slice(-2)) : undefined,
        });

        if (!safetyCheck.isSafe) {
          const violation = safetyCheck.violations[0];
          return NextResponse.json(
            {
              error: 'SAFETY_VIOLATION',
              message: 'Your message contains content that violates our safety policies',
              violation: {
                category: violation.type,
                severity: violation.severity,
                description: violation.description,
              },
              confidence: safetyCheck.confidence,
              timestamp: new Date().toISOString(),
            },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }
      } catch (safetyError) {
        console.error('[Safety Check] Input validation error:', safetyError);
        // Continue on safety check failure (fail open)
      }
    }

    // ============================================================================
    // TASK CLASSIFICATION (Requirement 3.1, 3.2, 3.3)
    // ============================================================================
    const taskClassifier = getTaskClassifierService();
    let classification;
    
    try {
      classification = await taskClassifier.classify({
        userMessage: message,
        conversationHistory: history.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      });

      console.log('[Classification]', {
        category: classification.category,
        confidence: classification.confidence,
        complexity: classification.estimatedComplexity,
        reasoning: classification.reasoning,
      });
    } catch (classificationError) {
      console.error('[Classification] Error:', classificationError);
      // Use default classification on failure
      classification = {
        category: 'MEDIUM' as const,
        confidence: 0.5,
        reasoning: 'Fallback classification due to classifier error',
        estimatedComplexity: 'MEDIUM' as const,
        estimatedTokens: 1000,
        requiresMultimodal: false,
        classifiedAt: new Date().toISOString(),
        classifierModelUsed: 'fallback',
      };
    }

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
${getToneInstructions(settings.tone || 'helpful')}

## Technical Depth
${getTechnicalInstructions(settings.technicalLevel || 'intermediate')}

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
- Contact: codeex@email.com | LinkedIn: codeex-heoster-4b60b8399 | GitHub: @heoster
- Vision: Democratize AI education in India and make advanced technology accessible to every student
- Built with 26+ AI models, serving 100+ countries with 99.9% uptime
- Friends & Testers- A group of friends who help test and provide feedback without tech knowledge are: VIDHAN, AVINEET, vansh
AAYUSH, VARUN, pankaj, MASUM, SACHIN, pardhuman, shivansh, Vaibhav, Kartik, Harsh`;

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

    // ============================================================================
    // SAFETY CHECK - Output Validation (Requirement 2.5, 2.6)
    // ============================================================================
    if (safetyGuard.isEnabled()) {
      try {
        const outputSafetyCheck = await safetyGuard.checkOutput({
          content: result.response.text,
          type: 'OUTPUT',
          context: message,
        });

        if (!outputSafetyCheck.isSafe) {
          const violation = outputSafetyCheck.violations[0];
          console.error('[Safety Check] Output violation detected:', violation);
          
          return NextResponse.json(
            {
              error: 'UNSAFE_OUTPUT',
              message: 'The AI generated content that violates our safety policies. Please try rephrasing your request.',
              violation: {
                category: violation.type,
                severity: violation.severity,
                description: violation.description,
              },
              confidence: outputSafetyCheck.confidence,
              timestamp: new Date().toISOString(),
            },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }
      } catch (safetyError) {
        console.error('[Safety Check] Output validation error:', safetyError);
        // Continue on safety check failure (fail open)
      }
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      content: result.response.text,
      modelUsed: result.modelUsed,
      autoRouted: result.fallbackTriggered,
      routingReasoning: result.fallbackTriggered ? 'Fallback triggered' : 'Direct model usage',
      classification: {
        category: classification.category,
        confidence: classification.confidence,
        complexity: classification.estimatedComplexity,
        reasoning: classification.reasoning,
      },
      safetyChecked: safetyGuard.isEnabled(),
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    }, {
      headers: corsHeaders,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Chat API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Categorize errors for better debugging
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;
    let userMessage = errorMessage;
    let debugInfo: any = {
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };

    // Network/Timeout errors
    if (errorMessage.includes('fetch failed') || errorMessage.includes('Network error')) {
      errorCode = 'NETWORK_ERROR';
      statusCode = 503;
      userMessage = 'Unable to connect to AI service. Please check your internet connection and try again.';
      debugInfo.suggestion = 'Check if API keys are configured in production environment';
      debugInfo.helpUrl = '/api/health';
    }
    // Timeout errors
    else if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
      errorCode = 'TIMEOUT_ERROR';
      statusCode = 504;
      userMessage = 'Request timed out. The AI service took too long to respond. Please try again.';
      debugInfo.suggestion = 'Try with a shorter message or simpler query';
    }
    // API Key errors
    else if (errorMessage.includes('API key') || errorMessage.includes('Authentication failed')) {
      errorCode = 'AUTH_ERROR';
      statusCode = 401;
      userMessage = 'Authentication failed. API key is missing or invalid.';
      debugInfo.suggestion = 'Check environment variables in deployment settings';
      debugInfo.requiredKeys = ['GROQ_API_KEY', 'GOOGLE_API_KEY', 'CEREBRAS_API_KEY', 'HUGGINGFACE_API_KEY'];
    }
    // Rate limit errors
    else if (errorMessage.includes('rate') || errorMessage.includes('quota')) {
      errorCode = 'RATE_LIMIT_ERROR';
      statusCode = 429;
      userMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      debugInfo.suggestion = 'Wait 60 seconds before retrying';
    }
    // All models failed
    else if (errorMessage.includes('All models failed')) {
      errorCode = 'ALL_MODELS_FAILED';
      statusCode = 503;
      userMessage = 'All AI models are currently unavailable. Please try again in a few minutes.';
      debugInfo.suggestion = 'Check /api/health to verify which providers are configured';
      debugInfo.helpUrl = '/api/health';
    }
    // Model loading errors
    else if (errorMessage.includes('Model is currently loading')) {
      errorCode = 'MODEL_LOADING';
      statusCode = 503;
      userMessage = 'AI model is loading. This usually takes 20-30 seconds. Please try again in a moment.';
      debugInfo.suggestion = 'Wait 30 seconds and retry';
    }
    // Context window errors
    else if (errorMessage.includes('Context exceeds') || errorMessage.includes('too large')) {
      errorCode = 'CONTEXT_TOO_LARGE';
      statusCode = 413;
      userMessage = 'Your conversation is too long. Please start a new conversation.';
      debugInfo.suggestion = 'Clear chat history or start a new conversation';
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorCode,
        message: userMessage,
        debug: debugInfo,
      },
      { 
        status: statusCode,
        headers: corsHeaders,
      }
    );
  }
}
