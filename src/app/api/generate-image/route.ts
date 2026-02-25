/**
 * SOHAM Image Generation API
 * Endpoint for generating images using the SOHAM pipeline
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSOHAMPipeline } from '@/lib/soham-image-pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, userId, style } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate style
    const validStyles = ['realistic', 'artistic', 'anime', 'sketch'];
    if (style && !validStyles.includes(style)) {
      return NextResponse.json(
        { success: false, error: `Invalid style. Must be one of: ${validStyles.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate image using SOHAM pipeline
    const pipeline = getSOHAMPipeline();
    const result = await pipeline.generate({
      userPrompt: prompt,
      userId,
      style,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('SOHAM image generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Image generation failed',
      },
      { status: 500 }
    );
  }
}
