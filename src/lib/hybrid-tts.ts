/**
 * Hybrid TTS System
 * Fallback chain: Groq PlayAI → ElevenLabs → Edge TTS → Browser TTS
 */

import { getUnifiedVoiceService } from './unified-voice-service';
import { edgeTTS } from './edge-tts';
import { browserTTS } from './browser-tts';

export interface HybridTTSOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  preferEdgeTTS?: boolean; // Deprecated, now uses Groq PlayAI first
}

class HybridTTS {
  private audioElement: HTMLAudioElement | null = null;
  private voiceService = getUnifiedVoiceService();

  /**
   * Check if any TTS is available
   */
  isAvailable(): boolean {
    return true; // Always available with fallback chain
  }

  /**
   * Speak text using the best available TTS
   * Chain: Groq PlayAI → ElevenLabs → Edge TTS → Browser TTS
   */
  async speak(options: HybridTTSOptions): Promise<void> {
    options.onStart?.();

    try {
      // Try Groq PlayAI or ElevenLabs (handled by unified service)
      const result = await this.voiceService.textToSpeech(options.text, {
        voice: options.voice,
        speed: options.rate,
        pitch: options.pitch,
      });

      if (result.provider !== 'browser' && result.audio.byteLength > 0) {
        // Play audio from Groq or ElevenLabs
        await this.playAudio(result.audio, options);
        return;
      }
    } catch (error) {
      console.warn('[Hybrid TTS] API TTS failed, trying Edge TTS:', error);
    }

    // Try Edge TTS
    if (edgeTTS.isAvailable()) {
      try {
        await edgeTTS.speak({
          text: options.text,
          voice: options.voice,
          rate: options.rate,
          pitch: options.pitch,
          volume: options.volume,
          onStart: () => {}, // Already called
          onEnd: options.onEnd,
          onError: async (error) => {
            // Fallback to browser TTS
            await this.useBrowserTTS(options);
          },
        });
        return;
      } catch (error) {
        console.warn('[Hybrid TTS] Edge TTS failed, using browser TTS:', error);
      }
    }

    // Final fallback: Browser TTS
    await this.useBrowserTTS(options);
  }

  /**
   * Play audio from ArrayBuffer
   */
  private async playAudio(audioData: ArrayBuffer, options: HybridTTSOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        this.audioElement = new Audio(url);
        this.audioElement.volume = options.volume || 1.0;

        this.audioElement.onended = () => {
          URL.revokeObjectURL(url);
          options.onEnd?.();
          resolve();
        };

        this.audioElement.onerror = (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        };

        this.audioElement.play();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Use browser's Web Speech API
   */
  private async useBrowserTTS(options: HybridTTSOptions): Promise<void> {
    if (!browserTTS.isAvailable()) {
      const error = 'TTS not available';
      options.onError?.(error);
      return;
    }

    browserTTS.speak({
      text: options.text,
      voice: options.voice,
      rate: options.rate,
      pitch: options.pitch,
      volume: options.volume,
      onStart: () => {}, // Already called
      onEnd: options.onEnd,
      onError: options.onError,
    });
  }

  /**
   * Cancel ongoing speech
   */
  cancel(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    edgeTTS.cancel();
    browserTTS.cancel();
  }

  /**
   * Check if speech is currently playing
   */
  isSpeaking(): boolean {
    return !!this.audioElement || edgeTTS.isSpeaking() || browserTTS.isSpeaking();
  }

  /**
   * Get available voices from all systems
   */
  getVoices(): Array<{id: string; name: string; source: 'groq' | 'elevenlabs' | 'edge' | 'browser'}> {
    const voices: Array<{id: string; name: string; source: 'groq' | 'elevenlabs' | 'edge' | 'browser'}> = [];

    // Add Groq PlayAI voices
    voices.push(
      { id: 'alloy', name: 'Alloy (Groq PlayAI)', source: 'groq' },
      { id: 'echo', name: 'Echo (Groq PlayAI)', source: 'groq' },
      { id: 'fable', name: 'Fable (Groq PlayAI)', source: 'groq' },
      { id: 'onyx', name: 'Onyx (Groq PlayAI)', source: 'groq' },
      { id: 'nova', name: 'Nova (Groq PlayAI)', source: 'groq' },
      { id: 'shimmer', name: 'Shimmer (Groq PlayAI)', source: 'groq' }
    );

    // Add Edge TTS voices
    if (edgeTTS.isAvailable()) {
      const edgeVoices = edgeTTS.getVoices();
      voices.push(...edgeVoices.map(v => ({ ...v, source: 'edge' as const })));
    }

    // Add Browser voices
    if (browserTTS.isAvailable()) {
      const browserVoices = browserTTS.getVoices();
      voices.push(...browserVoices.map((v: SpeechSynthesisVoice) => ({ 
        id: v.name, 
        name: `${v.name} (Browser)`, 
        source: 'browser' as const 
      })));
    }

    return voices;
  }
}

// Export singleton instance
export const hybridTTS = new HybridTTS();
