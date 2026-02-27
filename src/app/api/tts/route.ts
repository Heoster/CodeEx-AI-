/**
 * Text-to-Speech API
 * Uses Groq Orpheus TTS with fallback chain
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedVoiceService } from '@/lib/unified-voice-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice, speed } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Validate text length
    if (text.length > 4096) {
      return NextResponse.json(
        { success: false, error: 'Text too long. Maximum 4096 characters.' },
        { status: 400 }
      );
    }

    // Use unified voice service with fallback chain
    const voiceService = getUnifiedVoiceService();
    const result = await voiceService.textToSpeech(text, {
      voice: voice || 'troy', // Default to troy for Orpheus
      speed: speed || 1.0,
    });

    // Convert ArrayBuffer to base64
    const base64Audio = Buffer.from(result.audio).toString('base64');

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      provider: result.provider,
      model: result.model,
      contentType: 'audio/wav', // Orpheus uses WAV format
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'TTS generation failed',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');
  const voice = searchParams.get('voice');

  if (!text) {
    return NextResponse.json(
      { success: false, error: 'Text parameter is required' },
      { status: 400 }
    );
  }

  try {
    const voiceService = getUnifiedVoiceService();
    const result = await voiceService.textToSpeech(text, {
      voice: voice || 'troy',
      speed: 1.0,
    });

    // Return audio directly
    return new NextResponse(result.audio, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'inline; filename="speech.wav"',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'TTS generation failed',
      },
      { status: 500 }
    );
  }
}
