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

      // Call our API endpoint to generate speech
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          text: options.text,
          voice,
          rate,
          pitch,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `TTS API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('audio')) {
        throw new Error('Invalid response from TTS API - expected audio data');
      }

      const audioData = await response.arrayBuffer();
      
      if (audioData.byteLength === 0) {
        throw new Error('Empty audio data received from TTS API');
      }

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);

      // Create and configure audio source
      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      
      // Apply volume with gain node
      this.currentGainNode = this.audioContext.createGain();
      this.currentGainNode.gain.value = Math.max(0, Math.min(1, options.volume ?? 1.0));
      
      this.currentSource.connect(this.currentGainNode);
      this.currentGainNode.connect(this.audioContext.destination);

      // Set up event handlers
      this.currentSource.onended = () => {
        options.onEnd?.();
        this.cleanup();
      };

      // Start playback
      this.currentSource.start(0);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Edge TTS error:', errorMessage);
      options.onError?.(errorMessage);
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
