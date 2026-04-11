/**
 * SOHAM Image Generation Pipeline
 * 3-Step Process: Poet (Cerebras→Groq) → Painter (Pollinations→HuggingFace) → Temple (Local Storage)
 *
 * Fallback Strategy:
 * - Prompt Enhancement: Cerebras llama3.1-8b → Groq llama-3.3-70b-versatile → raw prompt
 * - Image Generation:
 *     1. Pollinations.ai  — completely free, no API key required
 *     2. HuggingFace FLUX.1-schnell via Together AI router (free tier)
 *     3. HuggingFace Wavespeed turbo-lora (requires credits)
 */

import { getStorageService } from './local-storage-service';

export interface SOHAMImageRequest {
  userPrompt: string;
  userId: string;
  style?: 'realistic' | 'artistic' | 'anime' | 'sketch';
}

export interface SOHAMImageResult {
  url: string;
  path: string;
  enhancedPrompt: string;
  provider: 'pollinations' | 'huggingface';
  model: string;
  generationTime: number;
}

export class SOHAMImagePipeline {
  // ─── STEP 1: THE POET ────────────────────────────────────────────────────────

  private async enhancePrompt(raw: string, style?: string): Promise<string> {
    const styleGuide = style ? this.getStyleGuide(style) : '';

    try {
      return await this.enhanceWithCerebras(raw, styleGuide);
    } catch {
      console.warn('[SOHAM] Cerebras failed, trying Groq...');
    }

    try {
      return await this.enhanceWithGroq(raw, styleGuide);
    } catch {
      console.warn('[SOHAM] Groq failed, using raw prompt.');
    }

    return styleGuide ? `${raw}. ${styleGuide}` : raw;
  }

  private async enhanceWithCerebras(raw: string, styleGuide: string): Promise<string> {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'system',
            content: `You are an expert image prompt engineer. Rewrite the user's request into a single, detailed, vivid image generation prompt. ${styleGuide}
Rules: no intro/outro text, just the prompt. Be specific about lighting, composition, colors, mood. Keep it under 200 words.`,
          },
          { role: 'user', content: raw },
        ],
        temperature: 0.8,
        max_tokens: 256,
      }),
    });

    if (!response.ok) throw new Error(`Cerebras ${response.status}`);
    const data = await response.json();
    const msg = data.choices[0].message;
    return (msg.content || msg.reasoning || '').trim();
  }

  private async enhanceWithGroq(raw: string, styleGuide: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert image prompt engineer. Rewrite the user's request into a single, detailed, vivid image generation prompt. ${styleGuide}
Rules: no intro/outro text, just the prompt. Be specific about lighting, composition, colors, mood. Keep it under 200 words.`,
          },
          { role: 'user', content: raw },
        ],
        temperature: 0.8,
        max_tokens: 256,
      }),
    });

    if (!response.ok) throw new Error(`Groq ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  // ─── STEP 2: THE PAINTER ─────────────────────────────────────────────────────

  private async paintImage(prompt: string): Promise<{
    blob: Blob;
    provider: 'pollinations' | 'huggingface';
    model: string;
  }> {
    const errors: string[] = [];

    // 1. Pollinations.ai — free, no key needed
    try {
      console.log('[SOHAM] Trying Pollinations.ai (flux)...');
      const blob = await this.paintWithPollinations(prompt, 'flux');
      return { blob, provider: 'pollinations', model: 'flux' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[SOHAM] Pollinations flux failed:', msg);
      errors.push(`Pollinations/flux: ${msg}`);
    }

    // 2. HuggingFace FLUX.1-schnell via Together AI (free tier)
    try {
      console.log('[SOHAM] Trying HuggingFace FLUX.1-schnell...');
      const blob = await this.paintWithHuggingFaceTogether(prompt, 'black-forest-labs/FLUX.1-schnell');
      return { blob, provider: 'huggingface', model: 'FLUX.1-schnell' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[SOHAM] FLUX.1-schnell failed:', msg);
      errors.push(`HuggingFace/FLUX.1-schnell: ${msg}`);
    }

    // 3. HuggingFace Wavespeed turbo-lora
    try {
      console.log('[SOHAM] Trying HuggingFace Wavespeed turbo-lora...');
      const blob = await this.paintWithHuggingFaceWavespeed(prompt);
      return { blob, provider: 'huggingface', model: 'wavespeed-turbo-lora' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[SOHAM] Wavespeed failed:', msg);
      errors.push(`HuggingFace/Wavespeed: ${msg}`);
    }

    throw new Error(`All image providers failed:\n${errors.join('\n')}`);
  }

  /**
   * Pollinations.ai — completely free, no API key required.
   * Supported models: flux, flux-realism, flux-anime, flux-3d, turbo
   */
  private async paintWithPollinations(prompt: string, model: string = 'flux'): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const width = 1024;
      const height = 1024;
      const seed = Math.floor(Math.random() * 1_000_000);

      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${model}&width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error(`Unexpected content type: ${blob.type}`);
      }
      return blob;
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Pollinations request timed out after 90s');
      }
      throw error;
    }
  }

  private async paintWithHuggingFaceTogether(prompt: string, model: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch('https://router.huggingface.co/together/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model, response_format: 'base64' }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace Together API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.data?.[0]?.b64_json) {
        const bytes = Uint8Array.from(atob(data.data[0].b64_json), c => c.charCodeAt(0));
        return new Blob([bytes], { type: 'image/jpeg' });
      }
      throw new Error('No image data in response');
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') throw new Error('HuggingFace request timed out');
      throw error;
    }
  }

  private async paintWithHuggingFaceWavespeed(prompt: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch(
        'https://router.huggingface.co/wavespeed/api/v3/wavespeed-ai/z-image/turbo-lora',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Wavespeed API error: ${response.status} - ${errorText}`);
      }
      return await response.blob();
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') throw new Error('Wavespeed request timed out');
      throw error;
    }
  }

  // ─── STEP 3: THE TEMPLE ──────────────────────────────────────────────────────

  private async saveImage(blob: Blob, userId: string): Promise<{ url: string; path: string }> {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const storageService = getStorageService();
    const result = await storageService.uploadFile(buffer, {
      userId,
      type: 'generated-image',
      autoDelete: false,
    });
    return { url: result.url, path: result.path };
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  private getStyleGuide(style: string): string {
    switch (style) {
      case 'realistic': return 'Style: Photorealistic, high detail, natural lighting, professional photography.';
      case 'artistic':  return 'Style: Artistic, painterly, expressive brushstrokes, vibrant colors.';
      case 'anime':     return 'Style: Anime art style, clean lines, cel-shaded, vibrant colors, Japanese animation aesthetic.';
      case 'sketch':    return 'Style: Pencil sketch, hand-drawn, artistic linework, monochrome or light shading.';
      default:          return '';
    }
  }

  // ─── MAIN ────────────────────────────────────────────────────────────────────

  async generate(request: SOHAMImageRequest): Promise<SOHAMImageResult> {
    const startTime = Date.now();

    console.log('[SOHAM] Step 1: Enhancing prompt...');
    const enhancedPrompt = await this.enhancePrompt(request.userPrompt, request.style);
    console.log('[SOHAM] Enhanced:', enhancedPrompt);

    console.log('[SOHAM] Step 2: Generating image...');
    const { blob, provider, model } = await this.paintImage(enhancedPrompt);
    console.log(`[SOHAM] Generated with ${provider}/${model}`);

    console.log('[SOHAM] Step 3: Saving to storage...');
    const { url, path } = await this.saveImage(blob, request.userId);
    console.log('[SOHAM] Saved:', url);

    return {
      url,
      path,
      enhancedPrompt,
      provider,
      model,
      generationTime: Date.now() - startTime,
    };
  }
}

let sohamPipeline: SOHAMImagePipeline | null = null;

export function getSOHAMPipeline(): SOHAMImagePipeline {
  if (!sohamPipeline) sohamPipeline = new SOHAMImagePipeline();
  return sohamPipeline;
}
