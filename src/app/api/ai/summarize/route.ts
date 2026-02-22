import { NextRequest, NextResponse } from 'next/server';
import { enhancedSummarize } from '@/ai/flows/enhanced-summarize';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, style, preferredModel } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await enhancedSummarize({
      text,
      style,
      preferredModel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Summarize API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
