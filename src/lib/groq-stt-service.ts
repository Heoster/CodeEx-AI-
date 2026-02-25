/**
 * Groq Whisper STT Service
 * Primary: Whisper Large V3 Turbo (faster)
 * Fallback: Whisper Large V3 (more accurate)
 * Final Fallback: Browser Web Speech API
 */

export interface STTOptions {
  language?: string;
  prompt?: string;
}

export interface STTResult {
  text: string;
  provider: 'groq' | 'browser';
  model: string;
  duration?: number;
}

/**
 * Groq Whisper STT Service with dual model support
 */
export class GroqSTTService {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';

  /**
   * Transcribe audio with automatic fallback
   * Primary: whisper-large-v3-turbo (faster)
   * Fallback: whisper-large-v3 (more accurate)
   */
  async transcribe(audio: Blob | File, options?: STTOptions): Promise<STTResult> {
    const { language = 'en', prompt } = options || {};

    // Try Whisper V3 Turbo first (faster)
    try {
      console.log('[Groq STT] Trying Whisper Large V3 Turbo...');
      return await this.transcribeWithModel(audio, 'whisper-large-v3-turbo', language, prompt);
    } catch (error) {
      console.warn('[Groq STT] Whisper V3 Turbo failed, trying V3:', error);
    }

    // Fallback to Whisper V3 (more accurate)
    try {
      console.log('[Groq STT] Trying Whisper Large V3...');
      return await this.transcribeWithModel(audio, 'whisper-large-v3', language, prompt);
    } catch (error) {
      console.error('[Groq STT] Both Whisper models failed:', error);
      throw error;
    }
  }

  /**
   * Transcribe with specific Whisper model
   */
  private async transcribeWithModel(
    audio: Blob | File,
    model: 'whisper-large-v3-turbo' | 'whisper-large-v3',
    language: string,
    prompt?: string
  ): Promise<STTResult> {
    const startTime = Date.now();

    // Create form data
    const formData = new FormData();
    formData.append('file', audio, 'audio.webm');
    formData.append('model', model);
    formData.append('language', language);
    formData.append('response_format', 'json');
    
    if (prompt) {
      formData.append('prompt', prompt);
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq STT API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`[Groq STT] Transcription completed with ${model} in ${duration}ms`);

    return {
      text: data.text || '',
      provider: 'groq',
      model,
      duration,
    };
  }

  /**
   * Check if Groq STT is available
   */
  isAvailable(): boolean {
    return !!process.env.GROQ_API_KEY;
  }
}

// Export singleton
let groqSTTService: GroqSTTService | null = null;

export function getGroqSTTService(): GroqSTTService {
  if (!groqSTTService) {
    groqSTTService = new GroqSTTService();
  }
  return groqSTTService;
}
