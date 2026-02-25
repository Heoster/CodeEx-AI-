/**
 * Video Generation API
 * Endpoint for Google Veo 3.1 video generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStorageService } from '@/lib/local-storage-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, userId, duration } = body;

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

    // Try Veo 3.1 Fast first, then regular
    let videoBlob: Blob;
    let model: string;

    try {
      console.log('[Video] Trying Veo 3.1 Fast...');
      videoBlob = await generateWithVeo(prompt, 'veo-3.1-fast-generate-preview', duration);
      model = 'veo-3.1-fast-generate-preview';
    } catch (error) {
      console.warn('[Video] Veo Fast failed, trying regular...');
      videoBlob = await generateWithVeo(prompt, 'veo-3.1-generate-preview', duration);
      model = 'veo-3.1-generate-preview';
    }

    // Save to Local Storage
    const buffer = Buffer.from(await videoBlob.arrayBuffer());
    const storageService = getStorageService();
    
    const result = await storageService.uploadFile(buffer, {
      userId,
      type: 'generated-video',
      autoDelete: false,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
      model,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed',
      },
      { status: 500 }
    );
  }
}

async function generateWithVeo(prompt: string, model: string, duration?: number): Promise<Blob> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Generate a video: ${prompt}` }]
        }],
        generationConfig: {
          responseModalities: ['VIDEO'],
          ...(duration && { videoDuration: duration }),
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Veo API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  const videoPart = data.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData && p.inlineData.mimeType.startsWith('video/')
  );

  if (!videoPart) {
    throw new Error('No video generated');
  }

  const bytes = Uint8Array.from(
    atob(videoPart.inlineData.data),
    c => c.charCodeAt(0)
  );
  
  return new Blob([bytes], { type: videoPart.inlineData.mimeType });
}
