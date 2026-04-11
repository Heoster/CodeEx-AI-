/**
 * SOHAM Image Generation Flow
 * Integrates with the SOHAM pipeline for AI image generation
 */

import { getSOHAMPipeline } from '@/lib/soham-image-pipeline';

export interface GenerateImageInput {
  prompt: string;
  userId: string;
  style?: 'realistic' | 'artistic' | 'anime' | 'sketch';
}

export interface GenerateImageOutput {
  imageUrl: string;
  enhancedPrompt: string;
  provider: string;
  model: string;
  answer: string;
}

export async function generateImageSOHAM(input: GenerateImageInput): Promise<GenerateImageOutput> {
  const { prompt, userId, style } = input;

  try {
    console.log('[SOHAM Flow] Generating image:', prompt);

    const pipeline = getSOHAMPipeline();
    const result = await pipeline.generate({ userPrompt: prompt, userId, style });

    const answer = `🎨 **Image Generated**

![Generated Image](${result.url})

**Prompt:** ${prompt}  
**Enhanced:** ${result.enhancedPrompt}  
**Model:** ${result.provider}/${result.model} · ${(result.generationTime / 1000).toFixed(1)}s

[📥 Download](${result.url})`;

    return {
      imageUrl: result.url,
      enhancedPrompt: result.enhancedPrompt,
      provider: result.provider,
      model: result.model,
      answer,
    };
  } catch (error) {
    console.error('[SOHAM Flow] Image generation failed:', error);

    return {
      imageUrl: '',
      enhancedPrompt: prompt,
      provider: 'error',
      model: 'error',
      answer: `❌ **Image Generation Failed**

${error instanceof Error ? error.message : 'Unknown error'}

Please try again or rephrase your prompt.`,
    };
  }
}
