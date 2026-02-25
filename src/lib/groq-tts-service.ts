/**
 * Groq PlayAI TTS Service
 * Primary TTS using Groq's PlayAI TTS model
 * Fallback chain: Groq PlayAI → ElevenLabs → Browser TTS
 */

export interface TTSOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSResult {
  audio: ArrayBuffer;
  provider: 'groq' | 'elevenlabs' | 'browser';
  model: string;
}

/**
 * Groq PlayAI TTS Service
 */
export class GroqTTSService {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/audio/speech';
  
  /**
   * Generate speech using Groq PlayAI TTS
   */
  async generateSpeech(text: string, options?: TTSOptions): Promise<TTSResult> {
    const { voice = 'alloy', speed = 1.0 } = options || {};

    try {
      console.log('[Groq TTS] Generating speech with PlayAI...');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'playai-tts-1.0',
          input: text,
          voice: voice,
          speed: speed,
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq TTS API error: ${response.status} ${response.statusText}`);
      }

      const audio = await response.arrayBuffer();
      
      console.log('[Groq TTS] Speech generated successfully');

      return {
        audio,
        provider: 'groq',
        model: 'playai-tts-1.0',
      };
    } catch (error) {
      console.error('[Groq TTS] Failed:', error);
      throw error;
    }
  }

  /**
   * Check if Groq TTS is available
   */
  isAvailable(): boolean {
    return !!process.env.GROQ_API_KEY;
  }
}

// Export singleton
let groqTTSService: GroqTTSService | null = null;

export function getGroqTTSService(): GroqTTSService {
  if (!groqTTSService) {
    groqTTSService = new GroqTTSService();
  }
  return groqTTSService;
}
