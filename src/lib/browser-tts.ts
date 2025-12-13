
export interface TTSOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export class BrowserTTS {
  private synthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.isSupported = !!this.synthesis && !!window.SpeechSynthesisUtterance;
    }
  }

  /**
   * Check if Web Speech API is supported in the browser
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Get available voices in the browser
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Speak text using Web Speech API
   */
  speak(options: TTSOptions): void {
    if (!this.synthesis || !window.SpeechSynthesisUtterance) {
      const error =
        'Speech synthesis not supported. Please use Chrome, Firefox, Safari, or Edge.';
      options.onError?.(error);
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Create utterance
    this.utterance = new window.SpeechSynthesisUtterance(options.text);

    // Set voice
    if (options.voice) {
      const voices = this.getVoices();
      const selectedVoice = voices.find(v =>
        v.name.toLowerCase().includes(options.voice!.toLowerCase())
      );
      if (selectedVoice) {
        this.utterance.voice = selectedVoice;
      }
    }

    // Set voice properties
    this.utterance.rate = options.rate ?? 1.0;
    this.utterance.pitch = options.pitch ?? 1.0;
    this.utterance.volume = options.volume ?? 1.0;

    // Set callbacks
    this.utterance.onstart = () => {
      options.onStart?.();
    };

    this.utterance.onend = () => {
      options.onEnd?.();
    };

    this.utterance.onerror = event => {
      options.onError?.(`Speech error: ${event.error}`);
    };

    // Speak
    this.synthesis.speak(this.utterance);
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  /**
   * Cancel ongoing speech
   */
  cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Check if speech is currently playing
   */
  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false;
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.synthesis?.paused ?? false;
  }
}

// Export singleton instance
export const browserTTS = new BrowserTTS();
