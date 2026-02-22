import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check for common configuration issues
 * Only available in development mode for security
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Debug endpoints are disabled in production' },
      { status: 403 }
    );
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    
    // Check AI providers
    aiProviders: {
      groq: {
        configured: !!process.env.GROQ_API_KEY,
        keyPrefix: process.env.GROQ_API_KEY?.substring(0, 4) || 'none',
      },
      google: {
        configured: !!process.env.GOOGLE_API_KEY,
        keyPrefix: process.env.GOOGLE_API_KEY?.substring(0, 4) || 'none',
      },
      cerebras: {
        configured: !!process.env.CEREBRAS_API_KEY,
        keyPrefix: process.env.CEREBRAS_API_KEY?.substring(0, 4) || 'none',
      },
      huggingface: {
        configured: !!process.env.HUGGINGFACE_API_KEY,
        keyPrefix: process.env.HUGGINGFACE_API_KEY?.substring(0, 3) || 'none',
      },
    },
    
    // Check Firebase
    firebase: {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    
    // Check TTS
    tts: {
      pythonServerEnabled: process.env.USE_PYTHON_TTS === 'true',
      pythonServerUrl: process.env.PYTHON_TTS_SERVER_URL || 'not set',
    },
    
    // Common issues
    issues: [] as string[],
  };

  // Check for common issues
  if (!diagnostics.aiProviders.groq.configured && 
      !diagnostics.aiProviders.google.configured && 
      !diagnostics.aiProviders.cerebras.configured) {
    diagnostics.issues.push('No AI providers configured - chat will not work');
  }

  if (!diagnostics.firebase.apiKey || !diagnostics.firebase.authDomain || !diagnostics.firebase.projectId) {
    diagnostics.issues.push('Firebase not fully configured - authentication may not work');
  }

  if (diagnostics.aiProviders.groq.configured && !diagnostics.aiProviders.groq.keyPrefix.startsWith('gsk_')) {
    diagnostics.issues.push('GROQ_API_KEY may be invalid (should start with gsk_)');
  }

  if (diagnostics.aiProviders.google.configured && !diagnostics.aiProviders.google.keyPrefix.startsWith('AIza')) {
    diagnostics.issues.push('GOOGLE_API_KEY may be invalid (should start with AIza)');
  }

  return NextResponse.json(diagnostics);
}
