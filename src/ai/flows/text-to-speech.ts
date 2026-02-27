/**
 * @fileOverview A flow for converting text to speech using Groq Orpheus TTS.
 * This provides high-quality, natural-sounding voices via Groq's TTS API.
 * 
 * Fallback chain: Groq Orpheus → ElevenLabs → Browser TTS
 *
 * - textToSpeech - Returns a success marker (real synthesis happens via API)
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {z} from 'genkit';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.string().describe('The voice to use for the speech (alloy, echo, fable, onyx, nova, shimmer).'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('Marker indicating TTS is ready. Actual synthesis happens via /api/tts endpoint.'),
  supported: z.boolean().optional().describe('Whether Groq TTS API is available.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

/**
 * Server-side marker function. The actual text-to-speech happens via
 * the /api/tts endpoint using Groq Orpheus TTS with fallback chain.
 */
export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  // Just return a success marker
  // The actual speech synthesis happens via the /api/tts endpoint
  return {
    audio: 'groq-tts-ready',
    supported: true,
  };
}
