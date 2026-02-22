import { NextRequest, NextResponse } from 'next/server';
import { enhancedPdfAnalyzer } from '@/ai/flows/enhanced-pdf-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pdfDataUri, question, preferredModel } = body;

    if (!pdfDataUri || typeof pdfDataUri !== 'string') {
      return NextResponse.json(
        { error: 'PDF data URI is required and must be a string' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await enhancedPdfAnalyzer({
      pdfDataUri,
      question,
      preferredModel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('PDF analyzer API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
