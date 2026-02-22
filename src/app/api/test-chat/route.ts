
import { NextRequest, NextResponse } from 'next/server';
import { processUserMessage } from '@/ai/flows/process-user-message';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, settings } = body;

    const result = await processUserMessage({
      message,
      history,
      settings
    });

    return NextResponse.json({
      content: result.answer,
      modelUsed: result.modelUsed,
      autoRouted: result.autoRouted,
      routingReasoning: result.routingReasoning
    });
  } catch (error) {
    console.error('Test chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
