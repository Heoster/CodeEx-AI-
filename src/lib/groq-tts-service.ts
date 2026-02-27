/**
 * Groq Orpheus TTS Service
 * Primary TTS using Groq's Orpheus TTS model from Canopy Labs
 * Fallback chain: Groq Orpheus → ElevenLabs → Browser TTS
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
 * Groq Orpheus TTS Service
 */
export class GroqTTSService {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/audio/speech';
  private readonly model = 'canopylabs/orpheus-v1-english';
  
  /**
   * Generate speech using Groq Orpheus TTS
   */
  async generateSpeech(text: string, options?: TTSOptions): Promise<TTSResult> {
    const { voice = 'troy', speed = 1.0 } = options || {};

    try {
      console.log('[Groq TTS] Generating speech with Orpheus...');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
          voice: voice,
          speed: speed,
          response_format: 'wav',
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
        model: this.model,
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
