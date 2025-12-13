import { NextRequest, NextResponse } from 'next/server';
import { enhancedSolve } from '@/ai/flows/enhanced-solve';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problem, tone, technicalLevel, preferredModel } = body;

    if (!problem || typeof problem !== 'string') {
      return NextResponse.json(
        { error: 'Problem is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await enhancedSolve({
      problem,
      tone,
      technicalLevel,
      preferredModel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Solve API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to solve problem' },
      { status: 500 }
    );
  }
}