/**
 * Web Search API
 * Endpoint for You.com web search
 */

import { NextRequest, NextResponse } from 'next/server';
import { getYouSearchService } from '@/lib/you-search-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, numResults, safeSearch } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const searchService = getYouSearchService();
    const result = await searchService.search(query, {
      numResults: numResults || 10,
      safeSearch: safeSearch !== false,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const searchService = getYouSearchService();
    const result = await searchService.search(query);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    );
  }
}
