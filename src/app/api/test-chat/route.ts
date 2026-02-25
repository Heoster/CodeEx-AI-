
import { NextRequest, NextResponse } from 'next/server';
import { processUserMessage } from '@/ai/flows/process-user-message';
import { getSafetyGuardService } from '@/lib/safety-guard-service';
import { getTaskClassifierService } from '@/lib/task-classifier-service';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { message, history = [], settings = {} } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          error: 'MISSING_MESSAGE',
          message: 'Message field is required and must be a string',
        },
        { status: 400 }
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
            },
            { status: 400 }
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

    // Process the message
    const result = await processUserMessage({
      message,
      history,
      settings
    });

    // ============================================================================
    // SAFETY CHECK - Output Validation (Requirement 2.5, 2.6)
    // ============================================================================
    if (safetyGuard.isEnabled()) {
      try {
        const outputSafetyCheck = await safetyGuard.checkOutput({
          content: result.answer,
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
            },
            { status: 400 }
          );
        }
      } catch (safetyError) {
        console.error('[Safety Check] Output validation error:', safetyError);
        // Continue on safety check failure (fail open)
      }
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      content: result.answer,
      modelUsed: result.modelUsed,
      autoRouted: result.autoRouted,
      routingReasoning: result.routingReasoning,
      classification: {
        category: classification.category,
        confidence: classification.confidence,
        complexity: classification.estimatedComplexity,
        reasoning: classification.reasoning,
      },
      safetyChecked: safetyGuard.isEnabled(),
      responseTime: `${responseTime}ms`,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('Test chat API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${responseTime}ms`,
      },
      { status: 500 }
    );
  }
}
