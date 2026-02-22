import { NextRequest, NextResponse } from 'next/server';
import { enhancedImageSolver } from '@/ai/flows/enhanced-image-solver';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageDataUri, problemType, preferredModel } = body;

    if (!imageDataUri || typeof imageDataUri !== 'string') {
      return NextResponse.json(
        { error: 'Image data URI is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await enhancedImageSolver({
      imageDataUri,
      problemType,
      preferredModel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Image solver API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
