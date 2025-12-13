// Thin shim to provide the `ai` and `z` exports expected by the app.
// The real `genkit` package is used at runtime; here we re-export with a
// permissive `any` typing to satisfy TypeScript and restore the previous
// local wrapper behavior when that file is missing.
import * as GK from 'genkit';

// Validate API keys on startup (server-side only)
if (typeof window === 'undefined') {
  if (!process.env.GROQ_API_KEY) {
    console.error('⚠️ CRITICAL: GROQ_API_KEY is not configured!');
    console.error('   Get a free key at: https://console.groq.com/keys');
    console.error('   Add it to your .env.local file as: GROQ_API_KEY=your_key_here');
  }
  
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.warn('⚠️ OPTIONAL: HUGGINGFACE_API_KEY is not configured!');
    console.warn('   Get a free key at: https://huggingface.co/settings/tokens');
    console.warn('   Add it to your .env.local file as: HUGGINGFACE_API_KEY=your_key_here');
  }
  
  if (!process.env.GOOGLE_API_KEY) {
    console.warn('⚠️ OPTIONAL: GOOGLE_API_KEY is not configured!');
    console.warn('   Get a free key at: https://aistudio.google.com/app/apikey');
    console.warn('   Add it to your .env.local file as: GOOGLE_API_KEY=your_key_here');
  }
}

// Create a permissive shim that exposes `ai` and `z` to the rest of the
// application. This avoids tight coupling to a specific genkit shape and
// keeps TypeScript happy during builds.
let _ai: any;
try {
  const factory = (GK as any).genkit || (GK as any).default || (GK as any);
  if (typeof factory === 'function') {
    _ai = factory({});
  } else {
    _ai = factory;
  }
  
  // Validate initialization
  if (!_ai || typeof _ai.defineFlow !== 'function') {
    console.warn('⚠️ Genkit may not have initialized properly. AI features may not work correctly.');
  }
} catch (e) {
  console.error('⚠️ Genkit initialization error:', e);
  _ai = (GK as any) || {};
}

export const ai: any = _ai;
export const z: any = (GK as any).z || (GK as any).Zod || undefined;

export default ai;
