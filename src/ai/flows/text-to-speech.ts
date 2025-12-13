/**
 * @fileOverview A flow for converting text to speech using browser Web Speech API.
 * This is a free, client-side implementation that works in all modern browsers.
 * 
 * NOTE: This flow is a marker/placeholder. The actual speech synthesis happens
 * in the browser using the browserTTS utility in lib/browser-tts.ts
 *
 * - textToSpeech - Returns a success marker (real synthesis happens client-side)
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {z} from 'genkit';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.string().describe('The voice to use for the speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('Marker indicating TTS is ready. Actual synthesis happens in browser.'),
  supported: z.boolean().optional().describe('Whether Web Speech API is supported.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

/**
 * Server-side marker function. The actual text-to-speech happens client-side
 * using the Web Speech API (browserTTS utility).
 */
export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  // Just return a success marker
  // The actual speech synthesis happens in the browser component
  return {
    audio: 'client-tts-ready',
    supported: true,
  };
}
