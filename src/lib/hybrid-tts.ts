/**
 * Hybrid TTS System
 * Fallback chain: Groq Orpheus → Edge TTS → Browser TTS
 */

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
  preferEdgeTTS?: boolean; // Deprecated, now uses Groq Orpheus first
}

class HybridTTS {
  private audioElement: HTMLAudioElement | null = null;

  /**
   * Check if any TTS is available
   */
  isAvailable(): boolean {
    return true; // Always available with fallback chain
  }

  /**
   * Speak text using the best available TTS
   * Chain: Groq Orpheus → Edge TTS → Browser TTS
   */
  async speak(options: HybridTTSOptions): Promise<void> {
    options.onStart?.();

    try {
      // Try Groq Orpheus via API route (server-side)
      console.log('[Hybrid TTS] Calling /api/tts with voice:', options.voice);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: options.text,
          voice: options.voice || 'troy',
          speed: options.rate || 1.0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audio) {
          console.log('[Hybrid TTS] Groq TTS successful, provider:', data.provider);
          // Convert base64 to ArrayBuffer
          const binaryString = atob(data.audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await this.playAudio(bytes.buffer, options, data.contentType || 'audio/wav');
          return;
        }
      }
      
      console.warn('[Hybrid TTS] API TTS failed, trying Edge TTS');
    } catch (error) {
      console.warn('[Hybrid TTS] API TTS error, trying Edge TTS:', error);
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
  private async playAudio(audioData: ArrayBuffer, options: HybridTTSOptions, contentType: string = 'audio/wav'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Clean up previous audio element if exists
        if (this.audioElement) {
          this.audioElement.pause();
          this.audioElement.src = '';
          this.audioElement = null;
        }

        const blob = new Blob([audioData], { type: contentType });
        const url = URL.createObjectURL(blob);

        this.audioElement = new Audio();
        this.audioElement.preload = 'auto';
        this.audioElement.volume = options.volume || 1.0;

        // Set up event listeners before setting src
        this.audioElement.onended = () => {
          URL.revokeObjectURL(url);
          if (this.audioElement) {
            this.audioElement.src = '';
          }
          options.onEnd?.();
          resolve();
        };

        this.audioElement.onerror = (event) => {
          console.error('[Hybrid TTS] Audio playback error:', event);
          URL.revokeObjectURL(url);
          if (this.audioElement) {
            this.audioElement.src = '';
          }
          // Don't reject, fall back to browser TTS
          this.useBrowserTTS(options).then(resolve).catch(reject);
        };

        this.audioElement.oncanplaythrough = () => {
          console.log('[Hybrid TTS] Audio ready to play');
        };

        // Set src and load
        this.audioElement.src = url;
        this.audioElement.load();

        // Play with error handling
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('[Hybrid TTS] Play error:', error);
            URL.revokeObjectURL(url);
            if (this.audioElement) {
              this.audioElement.src = '';
            }
            // Fall back to browser TTS
            this.useBrowserTTS(options).then(resolve).catch(reject);
          });
        }
      } catch (error) {
        console.error('[Hybrid TTS] Setup error:', error);
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
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement = null;
      } catch (error) {
        console.error('[Hybrid TTS] Cancel error:', error);
      }
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

    // Add Groq Orpheus voices
    voices.push(
      { id: 'troy', name: 'Troy (Groq Orpheus)', source: 'groq' },
      { id: 'diana', name: 'Diana (Groq Orpheus)', source: 'groq' },
      { id: 'hannah', name: 'Hannah (Groq Orpheus)', source: 'groq' },
      { id: 'autumn', name: 'Autumn (Groq Orpheus)', source: 'groq' },
      { id: 'austin', name: 'Austin (Groq Orpheus)', source: 'groq' },
      { id: 'daniel', name: 'Daniel (Groq Orpheus)', source: 'groq' }
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
