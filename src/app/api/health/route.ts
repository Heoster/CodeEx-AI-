import { NextResponse } from 'next/server';
import { env, getAvailableAIProviders } from '@/lib/env-config';

/**
 * Health Check Endpoint
 * Provides diagnostic information about the deployment
 * Useful for debugging production issues
 */
export async function GET() {
  try {
    const availableProviders = getAvailableAIProviders();
    
    // Test each provider's availability
    const providerTests = {
      groq: {
        configured: !!env.ai.groq,
        keyValid: env.ai.groq ? env.ai.groq.startsWith('gsk_') : false,
      },
      google: {
        configured: !!env.ai.google,
        keyValid: env.ai.google ? env.ai.google.startsWith('AIza') : false,
      },
      cerebras: {
        configured: !!env.ai.cerebras,
        keyValid: env.ai.cerebras ? env.ai.cerebras.startsWith('csk_') : false,
      },
      huggingface: {
        configured: !!env.ai.huggingface,
        keyValid: env.ai.huggingface ? env.ai.huggingface.startsWith('hf_') : false,
      },
    };
    
    // Check which services are configured
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.app.isProduction ? 'production' : 'development',
      
      // AI Providers (don't expose actual keys, just whether they're configured)
      ai: {
        configured: availableProviders.length > 0,
        providers: availableProviders,
        count: availableProviders.length,
        details: providerTests,
      },
      
      // Firebase
      firebase: {
        configured: !!(
          env.firebase.apiKey &&
          env.firebase.authDomain &&
          env.firebase.projectId
        ),
        details: {
          apiKey: !!env.firebase.apiKey,
          authDomain: !!env.firebase.authDomain,
          projectId: !!env.firebase.projectId,
          storageBucket: !!env.firebase.storageBucket,
        },
      },
      
      // Optional services
      optional: {
        emailjs: !!env.email.emailjs.serviceId,
        resend: !!env.email.resend.apiKey,
        elevenlabs: !!env.optional.elevenlabs,
      },
      
      // System info
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: `${Math.floor(process.uptime())}s`,
      },
      
      // Warnings and errors
      warnings: [] as string[],
      errors: [] as string[],
    };
    
    // Add warnings for missing critical configuration
    if (availableProviders.length === 0) {
      status.errors.push('CRITICAL: No AI providers configured. Add at least one: GROQ_API_KEY, GOOGLE_API_KEY, CEREBRAS_API_KEY, or HUGGINGFACE_API_KEY');
    }
    
    if (!status.firebase.configured) {
      status.errors.push('CRITICAL: Firebase not fully configured. Authentication will not work.');
    }
    
    // Check for invalid API keys
    if (providerTests.groq.configured && !providerTests.groq.keyValid) {
      status.warnings.push('GROQ_API_KEY may be invalid (should start with gsk_)');
    }
    if (providerTests.google.configured && !providerTests.google.keyValid) {
      status.warnings.push('GOOGLE_API_KEY may be invalid (should start with AIza)');
    }
    if (providerTests.cerebras.configured && !providerTests.cerebras.keyValid) {
      status.warnings.push('CEREBRAS_API_KEY may be invalid (should start with csk_)');
    }
    if (providerTests.huggingface.configured && !providerTests.huggingface.keyValid) {
      status.warnings.push('HUGGINGFACE_API_KEY may be invalid (should start with hf_)');
    }
    
    // Return appropriate status code
    const httpStatus = status.errors.length > 0 ? 503 : (status.warnings.length > 0 ? 200 : 200);
    
    return NextResponse.json(status, { status: httpStatus });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
