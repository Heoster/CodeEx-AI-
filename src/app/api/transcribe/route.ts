/**
 * Audio Transcription API
 * Uses Groq Whisper V3 Turbo with fallback to browser
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedVoiceService } from '@/lib/unified-voice-service';

export async function POST(request: NextRequest) {
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid audio format. Supported: webm, mp3, wav, m4a' },
        { status: 400 }
      );
    }

    // Use unified voice service with fallback chain
    const voiceService = getUnifiedVoiceService();
    const result = await voiceService.speechToText(file, {
      language: language || 'en',
    });

    return NextResponse.json({
      success: true,
      text: result.text,
      language: language || 'auto',
      provider: result.provider,
      model: result.model,
      duration: result.duration,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed',
      },
      { status: 500 }
    );
  }
}
