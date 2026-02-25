/**
 * Edge TTS Integration
 * Uses Microsoft Edge's Text-to-Speech API for high-quality voice synthesis
 * Free, no API key required, and works in the browser
 */

export interface EdgeTTSOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Available Edge TTS voices with better organization
export const EDGE_VOICES = {
  // US English
  'en-US-AriaNeural': 'Aria (Female, US)',
  'en-US-GuyNeural': 'Guy (Male, US)',
  'en-US-JennyNeural': 'Jenny (Female, US)',
  'en-US-RyanNeural': 'Ryan (Male, US)',
  // UK English
  'en-GB-SoniaNeural': 'Sonia (Female, UK)',
  'en-GB-RyanNeural': 'Ryan (Male, UK)',
  // Indian English
  'en-IN-NeerjaNeural': 'Neerja (Female, India)',
  'en-IN-PrabhatNeural': 'Prabhat (Male, India)',
} as const;

export type EdgeVoiceId = keyof typeof EDGE_VOICES;

export class EdgeTTS {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentGainNode: GainNode | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = !!(window.AudioContext || (window as any).webkitAudioContext);
      if (this.isSupported) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
          console.error('Failed to create AudioContext:', error);
          this.isSupported = false;
        }
      }
    }
  }

  /**
   * Check if Edge TTS is supported in the browser
   */
  isAvailable(): boolean {
    return this.isSupported && this.audioContext !== null;
  }

  /**
   * Get available voices
   */
  getVoices(): Array<{id: string; name: string}> {
    return Object.entries(EDGE_VOICES).map(([id, name]) => ({id, name}));
  }

  /**
   * Speak text using Edge TTS
   */
  async speak(options: EdgeTTSOptions): Promise<void> {
    if (!this.audioContext) {
      const error = 'Audio context not available. Browser may not support Web Audio API.';
      console.error(error);
      options.onError?.(error);
      return;
    }

    try {
      // Stop any ongoing speech
      this.cancel();

      // Validate text
      if (!options.text || options.text.trim().length === 0) {
        throw new Error('Text is required for speech synthesis');
      }

      // Prepare voice parameters
      const voice = options.voice || 'en-US-AriaNeural';
      const rate = options.rate ? `${options.rate > 1 ? '+' : ''}${((options.rate - 1) * 100).toFixed(0)}%` : '+0%';
      const pitch = options.pitch ? `${options.pitch > 1 ? '+' : ''}${((options.pitch - 1) * 50).toFixed(0)}Hz` : '+0Hz';

      options.onStart?.();

      // Edge TTS is now handled by Python server or browser fallback
      // This is a legacy path - should use hybrid-tts.ts instead
      throw new Error('Edge TTS API endpoint removed - use hybrid-tts.ts');
    } catch (error) {
      // Silently fail - TTS is optional, don't spam console
      options.onError?.('TTS temporarily unavailable');
      this.cleanup();
    }
  }

  /**
   * Cancel ongoing speech
   */
  cancel(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Ignore errors when stopping (may already be stopped)
      }
    }
    this.cleanup();
  }

  /**
   * Clean up audio resources
   */
  private cleanup(): void {
    if (this.currentSource) {
      try {
        this.currentSource.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      this.currentSource = null;
    }
    if (this.currentGainNode) {
      try {
        this.currentGainNode.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      this.currentGainNode = null;
    }
  }

  /**
   * Check if speech is currently playing
   */
  isSpeaking(): boolean {
    return this.currentSource !== null;
  }

  /**
   * Resume audio context if suspended (required by some browsers)
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume audio context:', error);
      }
    }
  }
}

// Export singleton instance
export const edgeTTS = new EdgeTTS();
