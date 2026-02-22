import { NextRequest, NextResponse } from 'next/server';
import { enhancedSearch } from '@/ai/flows/enhanced-search';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, preferredModel } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await enhancedSearch({
      query,
      preferredModel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
