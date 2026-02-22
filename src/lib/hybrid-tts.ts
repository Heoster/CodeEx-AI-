/**
 * Hybrid TTS System
 * Tries Edge TTS first, falls back to Browser TTS if it fails
 */

import { edgeTTS, EdgeTTSOptions } from './edge-tts';
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
  preferEdgeTTS?: boolean; // Default true
}

class HybridTTS {
  private usingEdgeTTS: boolean = false;

  /**
   * Check if any TTS is available
   */
  isAvailable(): boolean {
    return edgeTTS.isAvailable() || browserTTS.isAvailable();
  }

  /**
   * Speak text using the best available TTS
   */
  async speak(options: HybridTTSOptions): Promise<void> {
    const preferEdge = options.preferEdgeTTS !== false;

    // Try Edge TTS first if preferred and available
    if (preferEdge && edgeTTS.isAvailable()) {
      try {
        this.usingEdgeTTS = true;
        
        await edgeTTS.speak({
          text: options.text,
          voice: options.voice,
          rate: options.rate,
          pitch: options.pitch,
          volume: options.volume,
          onStart: options.onStart,
          onEnd: options.onEnd,
          onError: async (error) => {
            // Silently fallback to browser TTS
            await this.useBrowserTTS(options);
          },
        });
        return;
      } catch (error) {
        // Silently continue to fallback
      }
    }

    // Use Browser TTS as fallback or primary
    await this.useBrowserTTS(options);
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

    this.usingEdgeTTS = false;

    browserTTS.speak({
      text: options.text,
      voice: options.voice,
      rate: options.rate,
      pitch: options.pitch,
      volume: options.volume,
      onStart: options.onStart,
      onEnd: options.onEnd,
      onError: options.onError,
    });
  }

  /**
   * Cancel ongoing speech
   */
  cancel(): void {
    if (this.usingEdgeTTS) {
      edgeTTS.cancel();
    } else {
      browserTTS.cancel();
    }
  }

  /**
   * Check if speech is currently playing
   */
  isSpeaking(): boolean {
    return edgeTTS.isSpeaking() || browserTTS.isSpeaking();
  }

  /**
   * Get available voices from both systems
   */
  getVoices(): Array<{id: string; name: string; source: 'edge' | 'browser'}> {
    const voices: Array<{id: string; name: string; source: 'edge' | 'browser'}> = [];

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
