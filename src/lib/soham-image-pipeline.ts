/**
 * SOHAM Image Generation Pipeline
 * 3-Step Process: Poet (Cerebras→Groq) → Painter (Google→HuggingFace) → Temple (Local Storage)
 * 
 * Fallback Strategy:
 * - Prompt Enhancement: Cerebras llama3.1-8b → Groq llama-3.3-70b-versatile
 * - Image Generation: Google Gemini → HuggingFace FLUX.1-schnell (FREE via Together AI)
 * 
 * Available Models:
 * - Cerebras llama3.1-8b (8B params, ~2200 tokens/s) ✅ WORKING
 * - Groq llama-3.3-70b-versatile ✅ WORKING
 * - Google Gemini (requires billing) ⚠️
 * - HuggingFace FLUX.1-schnell (via Together AI) ✅ FREE & WORKING
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
  provider: 'google' | 'huggingface';
  model: string;
  generationTime: number;
}

/**
 * SOHAM Image Generation Service
 */
export class SOHAMImagePipeline {
  /**
   * STEP 1: THE POET — Enhance prompt with fallback
   * Primary: Cerebras llama3.1-8b
   * Backup: Groq llama-3.3-70b-versatile
   */
  private async enhancePrompt(raw: string, style?: string): Promise<string> {
    const styleGuide = style ? this.getStyleGuide(style) : '';
    
    // Try Cerebras first
    try {
      console.log('[SOHAM] Trying Cerebras llama3.1-8b for prompt enhancement...');
      return await this.enhanceWithCerebras(raw, styleGuide);
    } catch (error) {
      console.warn('[SOHAM] Cerebras failed, trying Groq:', error);
    }

    // Fallback to Groq
    try {
      console.log('[SOHAM] Trying Groq llama-3.3-70b-versatile for prompt enhancement...');
      return await this.enhanceWithGroq(raw, styleGuide);
    } catch (error) {
      console.warn('[SOHAM] Groq failed, using original prompt:', error);
    }

    // Final fallback: Use original prompt with style guide
    return styleGuide ? `${raw}. ${styleGuide}` : raw;
  }

  /**
   * Enhance prompt with Cerebras
   */
  private async enhanceWithCerebras(raw: string, styleGuide: string): Promise<string> {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'system',
            content: `You are an expert image prompt engineer. Rewrite the user's request into a single, detailed, vivid image generation prompt. ${styleGuide}

Rules:
- No intro/outro text, just the prompt
- Be specific about lighting, composition, colors, mood
- Include artistic style if relevant
- Keep it under 200 words
- Make it visually rich and detailed`
          },
          { role: 'user', content: raw }
        ],
        temperature: 0.8,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cerebras API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const message = data.choices[0].message;
    
    // Handle both content and reasoning fields (different models return different formats)
    const enhanced = message.content || message.reasoning || '';
    return enhanced.trim();
  }

  /**
   * Enhance prompt with Groq (fallback)
   */
  private async enhanceWithGroq(raw: string, styleGuide: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert image prompt engineer. Rewrite the user's request into a single, detailed, vivid image generation prompt. ${styleGuide}

Rules:
- No intro/outro text, just the prompt
- Be specific about lighting, composition, colors, mood
- Include artistic style if relevant
- Keep it under 200 words
- Make it visually rich and detailed`
          },
          { role: 'user', content: raw }
        ],
        temperature: 0.8,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * STEP 2: THE PAINTER — Generate image with fallback
   * Primary: Google Gemini (requires billing)
   * Backup 1: HuggingFace FLUX.1-schnell (FREE via Together AI)
   * Backup 2: HuggingFace Wavespeed (requires credits)
   */
  private async paintImage(prompt: string): Promise<{
    blob: Blob;
    provider: 'google' | 'huggingface';
    model: string;
  }> {
    const errors: string[] = [];

    

    // Try HuggingFace FLUX.1-schnell (FREE via Together AI)
    try {
      console.log('[SOHAM] Trying HuggingFace FLUX.1-schnell (FREE)...');
      const blob = await this.paintWithHuggingFaceTogether(prompt, 'black-forest-labs/FLUX.1-schnell');
      return { blob, provider: 'huggingface', model: 'FLUX.1-schnell' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[SOHAM] FLUX.1-schnell failed:', msg);
      errors.push(`FLUX.1-schnell: ${msg}`);
    }

    // Try HuggingFace Wavespeed (requires credits, but faster if available)
    try {
      console.log('[SOHAM] Trying HuggingFace Wavespeed turbo-lora...');
      const blob = await this.paintWithHuggingFaceWavespeed(prompt);
      return { blob, provider: 'huggingface', model: 'wavespeed-turbo-lora' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[SOHAM] Wavespeed failed:', msg);
      errors.push(`Wavespeed: ${msg}`);
    }

    // All providers failed
    throw new Error(`Image generation failed. All providers unavailable:\n${errors.join('\n')}`);
  }

  /**
   * Paint with Google Gemini
   */
  private async paintWithGemini(prompt: string, model: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `Generate an image: ${prompt}` }]
            }],
            generationConfig: {
              responseModalities: ['IMAGE'],
            }
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Find image part
      const imagePart = data.candidates?.[0]?.content?.parts?.find(
        (p: any) => p.inlineData
      );

      if (!imagePart) {
        throw new Error('No image generated - model may not support image generation');
      }

      // Convert base64 to blob
      const bytes = Uint8Array.from(
        atob(imagePart.inlineData.data),
        c => c.charCodeAt(0)
      );
      
      return new Blob([bytes], { type: imagePart.inlineData.mimeType || 'image/png' });
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout after 60 seconds');
      }
      throw error;
    }
  }

  /**
   * Paint with HuggingFace (Together AI Integration)
   */
  private async paintWithHuggingFace(prompt: string, model: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(
        'https://router.huggingface.co/together/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            model: model,
            response_format: 'base64',
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // Extract base64 image from response
      if (data.data && data.data[0] && data.data[0].b64_json) {
        const base64Data = data.data[0].b64_json;
        
        // Convert base64 to blob
        const bytes = Uint8Array.from(
          atob(base64Data),
          c => c.charCodeAt(0)
        );
        
        return new Blob([bytes], { type: 'image/jpeg' });
      }
      
      throw new Error('No image data in response');
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout after 60 seconds');
      }
      throw error;
    }
  }
  /**
   * Paint with HuggingFace FLUX.1-schnell via Together AI (FREE)
   */
  private async paintWithHuggingFaceTogether(prompt: string, model: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(
        'https://router.huggingface.co/together/v1/images/generations',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            model: model,
            response_format: 'base64',
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace Together API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      // Extract base64 image from response
      if (data.data && data.data[0] && data.data[0].b64_json) {
        const base64Data = data.data[0].b64_json;

        // Convert base64 to blob
        const bytes = Uint8Array.from(
          atob(base64Data),
          c => c.charCodeAt(0)
        );

        return new Blob([bytes], { type: 'image/jpeg' });
      }

      throw new Error('No image data in response');
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout after 60 seconds');
      }
      throw error;
    }
  }

  /**
   * Paint with HuggingFace Wavespeed turbo-lora (requires pre-paid credits)
   */
  private async paintWithHuggingFaceWavespeed(prompt: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(
        'https://router.huggingface.co/wavespeed/api/v3/wavespeed-ai/z-image/turbo-lora',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HuggingFace Wavespeed API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Response is a blob directly
      return await response.blob();
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout after 60 seconds');
      }
      throw error;
    }
  }

  /**
   * STEP 3: THE TEMPLE — Save to Local Storage
   */
  private async saveImage(blob: Blob, userId: string): Promise<{ url: string; path: string }> {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const storageService = getStorageService();
    
    const result = await storageService.uploadFile(buffer, {
      userId,
      type: 'generated-image',
      autoDelete: false, // Keep generated images
    });

    return {
      url: result.url,
      path: result.path,
    };
  }

  /**
   * Get style guide for prompt enhancement
   */
  private getStyleGuide(style: string): string {
    switch (style) {
      case 'realistic':
        return 'Style: Photorealistic, high detail, natural lighting, professional photography.';
      case 'artistic':
        return 'Style: Artistic, painterly, expressive brushstrokes, vibrant colors.';
      case 'anime':
        return 'Style: Anime art style, clean lines, cel-shaded, vibrant colors, Japanese animation aesthetic.';
      case 'sketch':
        return 'Style: Pencil sketch, hand-drawn, artistic linework, monochrome or light shading.';
      default:
        return '';
    }
  }

  /**
   * MAIN: Full SOHAM Pipeline
   */
  async generate(request: SOHAMImageRequest): Promise<SOHAMImageResult> {
    const startTime = Date.now();

    // Step 1: Enhance prompt with Cerebras → Groq fallback
    console.log('[SOHAM] Step 1: Enhancing prompt...');
    const enhancedPrompt = await this.enhancePrompt(request.userPrompt, request.style);
    console.log('[SOHAM] Enhanced:', enhancedPrompt);

    // Step 2: Generate image with Google Gemini
    console.log('[SOHAM] Step 2: Generating image...');
    const { blob, provider, model } = await this.paintImage(enhancedPrompt);
    console.log(`[SOHAM] Generated with ${provider}/${model}`);

    // Step 3: Save to local storage
    console.log('[SOHAM] Step 3: Saving to local storage...');
    const { url, path } = await this.saveImage(blob, request.userId);
    console.log('[SOHAM] Saved:', url);

    const generationTime = Date.now() - startTime;

    return {
      url,
      path,
      enhancedPrompt,
      provider,
      model,
      generationTime,
    };
  }
}

// Export singleton
let sohamPipeline: SOHAMImagePipeline | null = null;

export function getSOHAMPipeline(): SOHAMImagePipeline {
  if (!sohamPipeline) {
    sohamPipeline = new SOHAMImagePipeline();
  }
  return sohamPipeline;
}
