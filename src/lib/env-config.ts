/**
 * Environment Configuration
 * Centralized environment variable management with validation
 */

// Validate required environment variables
function validateEnv() {
  const required = {
    // Firebase (required for auth)
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    
    // At least one AI provider (required)
    hasAIProvider: !!(
      process.env.GOOGLE_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.HUGGINGFACE_API_KEY ||
      process.env.CEREBRAS_API_KEY
    ),
  };

  const missing: string[] = [];

  Object.entries(required).forEach(([key, value]) => {
    if (key === 'hasAIProvider') {
      if (!value) {
        missing.push('At least one AI API key (Google, Groq, Hugging Face, or Cerebras)');
      }
    } else if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn('⚠️  Missing required environment variables:', missing);
    console.warn('⚠️  Please check your .env.local file');
  }

  return missing.length === 0;
}

// Run validation
if (typeof window === 'undefined') {
  validateEnv();
}

// Environment configuration
export const env = {
  // App configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },

  // AI API Keys (server-side only)
  ai: {
    google: process.env.GOOGLE_API_KEY || '',
    googleGenAI: process.env.GOOGLE_GENAI_API_KEY || '',
    groq: process.env.GROQ_API_KEY || '',
    huggingface: process.env.HUGGINGFACE_API_KEY || '',
    openrouter: process.env.OPENROUTER_API_KEY || '',
    cerebras: process.env.CEREBRAS_API_KEY || '',
  },

  // Firebase configuration (client-side safe)
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  },

  // Email services
  email: {
    // EmailJS (client-side)
    emailjs: {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      welcomeTemplateId: process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID || '',
      userId: process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '',
    },
    // Resend (server-side)
    resend: {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@codeex-ai.com',
    },
  },

  // Optional services
  optional: {
    elevenlabs: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
    recaptcha: process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY || '',
  },

  // Feature flags (Requirements 19.1, 19.2, 19.3, 19.4)
  features: {
    enableSafetyGuard: process.env.ENABLE_SAFETY_GUARD !== 'false', // Default: true
    enableMemorySystem: process.env.ENABLE_MEMORY_SYSTEM === 'true', // Default: false
    enableVideoGeneration: process.env.ENABLE_VIDEO_GENERATION === 'true', // Default: false
    enableComputerUse: process.env.ENABLE_COMPUTER_USE === 'true', // Default: false
  },
} as const;

// Helper functions
export function getApiUrl(path: string): string {
  const baseUrl = env.app.url;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function hasAIProvider(): boolean {
  return !!(
    env.ai.google ||
    env.ai.groq ||
    env.ai.huggingface ||
    env.ai.cerebras
  );
}

export function getAvailableAIProviders(): string[] {
  const providers: string[] = [];
  if (env.ai.google) providers.push('Google');
  if (env.ai.groq) providers.push('Groq');
  if (env.ai.huggingface) providers.push('Hugging Face');
  if (env.ai.cerebras) providers.push('Cerebras');
  return providers;
}

// Type-safe environment variable access
export type EnvConfig = typeof env;
