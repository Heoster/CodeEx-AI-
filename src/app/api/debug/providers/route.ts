/**
 * Debug endpoint to check which AI providers are available
 */

import { NextResponse } from 'next/server';
import { getModelRegistry } from '@/lib/model-registry';

export async function GET() {
  try {
    const registry = getModelRegistry();
    
    // Check each provider
    const providers = {
      groq: {
        available: registry.isProviderAvailable('groq'),
        apiKey: process.env.GROQ_API_KEY ? 
          (process.env.GROQ_API_KEY.includes('your_') ? 'PLACEHOLDER' : 'CONFIGURED') : 
          'MISSING',
      },
      huggingface: {
        available: registry.isProviderAvailable('huggingface'),
        apiKey: process.env.HUGGINGFACE_API_KEY ? 
          (process.env.HUGGINGFACE_API_KEY.includes('your_') ? 'PLACEHOLDER' : 'CONFIGURED') : 
          'MISSING',
      },
      google: {
        available: registry.isProviderAvailable('google'),
        apiKey: process.env.GOOGLE_API_KEY ? 
          (process.env.GOOGLE_API_KEY.includes('your_') ? 'PLACEHOLDER' : 'CONFIGURED') : 
          'MISSING',
      },
      cerebras: {
        available: registry.isProviderAvailable('cerebras'),
        apiKey: process.env.CEREBRAS_API_KEY ? 
          (process.env.CEREBRAS_API_KEY.includes('your_') ? 'PLACEHOLDER' : 'CONFIGURED') : 
          'MISSING',
      },
    };
    
    // Get available models
    const availableModels = registry.getAvailableModels().map(m => ({
      id: m.id,
      name: m.name,
      provider: m.provider,
      category: m.category,
    }));
    
    return NextResponse.json({
      providers,
      availableModels,
      totalAvailable: availableModels.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
