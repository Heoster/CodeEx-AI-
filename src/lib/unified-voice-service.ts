/**
 * Unified Voice Service
 * Handles both STT and TTS with intelligent fallback chains
 * 
 * STT Chain: Groq Whisper → Browser Web Speech API
 * TTS Chain: Groq PlayAI → ElevenLabs → Browser TTS
 */

import { getGroqSTTService, type STTResult, type STTOptions } from './groq-stt-service';
import { getGroqTTSService, type TTSResult, type TTSOptions } from './groq-tts-service';

/**
 * Unified Voice Service
 */
export class UnifiedVoiceService {
  private groqSTT = getGroqSTTService();
  private groqTTS = getGroqTTSService();

  /**
   * Speech-to-Text with fallback chain
   * Primary: Groq Whisper V3 Turbo
   * Fallback: Browser Web Speech API
   */
  async speechToText(audio: Blob | File, options?: STTOptions): Promise<STTResult> {
    // Try Groq Whisper first
    if (this.groqSTT.isAvailable()) {
      try {
        return await this.groqSTT.transcribe(audio, options);
      } catch (error) {
        console.warn('[Unified Voice] Groq STT failed, falling back to browser:', error);
      }
    }

    // Fallback to browser Web Speech API
    console.log('[Unified Voice] Using browser Web Speech API');
    return {
      text: '', // Browser API is handled client-side
      provider: 'browser',
      model: 'web-speech-api',
    };
  }

  /**
   * Text-to-Speech with fallback chain
   * Primary: Groq PlayAI TTS
   * Fallback 1: ElevenLabs
   * Fallback 2: Browser TTS
   */
  async textToSpeech(text: string, options?: TTSOptions): Promise<TTSResult> {
    // Try Groq PlayAI first
    if (this.groqTTS.isAvailable()) {
      try {
        return await this.groqTTS.generateSpeech(text, options);
      } catch (error) {
        console.warn('[Unified Voice] Groq TTS failed, trying ElevenLabs:', error);
      }
    }

    // Try ElevenLabs
    if (process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
      try {
        return await this.elevenLabsTTS(text, options);
      } catch (error) {
        console.warn('[Unified Voice] ElevenLabs failed, falling back to browser:', error);
      }
    }

    // Fallback to browser TTS
    console.log('[Unified Voice] Using browser TTS');
    return {
      audio: new ArrayBuffer(0), // Browser TTS is handled client-side
      provider: 'browser',
      model: 'browser-speech-synthesis',
    };
  }

  /**
   * ElevenLabs TTS (fallback)
   */
  private async elevenLabsTTS(text: string, options?: TTSOptions): Promise<TTSResult> {
    // Map Edge TTS voice names to ElevenLabs voice IDs
    const voiceMap: Record<string, string> = {
      'en-US-AriaNeural': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'en-US-GuyNeural': '21m00Tcm4TlvDq8ikWAM', // Rachel
      'en-US-JennyNeural': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'en-IN-NeerjaNeural': 'EXAVITQu4vr4xnSDxMaL', // Bella
    };

    // Get ElevenLabs voice ID (default to Bella if not mapped)
    const voiceId = options?.voice && voiceMap[options.voice] 
      ? voiceMap[options.voice] 
      : 'EXAVITQu4vr4xnSDxMaL';

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audio = await response.arrayBuffer();

    return {
      audio,
      provider: 'elevenlabs',
      model: 'eleven_monolingual_v1',
    };
  }

  /**
   * Get STT provider status
   */
  getSTTStatus(): {
    groq: boolean;
    browser: boolean;
  } {
    return {
      groq: this.groqSTT.isAvailable(),
      browser: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window,
    };
  }

  /**
   * Get TTS provider status
   */
  getTTSStatus(): {
    groq: boolean;
    elevenlabs: boolean;
    browser: boolean;
  } {
    return {
      groq: this.groqTTS.isAvailable(),
      elevenlabs: !!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      browser: typeof window !== 'undefined' && 'speechSynthesis' in window,
    };
  }
}

// Export singleton
let unifiedVoiceService: UnifiedVoiceService | null = null;

export function getUnifiedVoiceService(): UnifiedVoiceService {
  if (!unifiedVoiceService) {
    unifiedVoiceService = new UnifiedVoiceService();
  }
  return unifiedVoiceService;
}
