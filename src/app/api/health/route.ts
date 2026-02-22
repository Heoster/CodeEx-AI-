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
      },
      
      // Firebase
      firebase: {
        configured: !!(
          env.firebase.apiKey &&
          env.firebase.authDomain &&
          env.firebase.projectId
        ),
      },
      
      // Optional services
      optional: {
        emailjs: !!env.email.emailjs.serviceId,
        resend: !!env.email.resend.apiKey,
        elevenlabs: !!env.optional.elevenlabs,
      },
      
      // Warnings
      warnings: [] as string[],
    };
    
    // Add warnings for missing critical configuration
    if (availableProviders.length === 0) {
      status.warnings.push('No AI providers configured. Add at least one: GROQ_API_KEY, GOOGLE_API_KEY, CEREBRAS_API_KEY, or HUGGINGFACE_API_KEY');
    }
    
    if (!status.firebase.configured) {
      status.warnings.push('Firebase not fully configured. Authentication may not work.');
    }
    
    // Return appropriate status code
    const httpStatus = status.warnings.length > 0 ? 503 : 200;
    
    return NextResponse.json(status, { status: httpStatus });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
