/**
 * Application Configuration
 * Central configuration for URLs, features, and app settings
 */

export const APP_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app',
  API_BASE_URL: process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api`
    : 'https://codeex-ai.netlify.app/api',

  // Feature Routes
  FEATURES: {
    chat: '/chat',
    smartNotes: '/smart-notes',
    mathSolver: '/math-solver',
    pdfAnalyzer: '/pdf-analyzer',
    imageGenerator: '/image-generator',
    jarvisMode: '/jarvis',
    memoryDashboard: '/memory',
  },

  // Documentation Routes
  DOCS: {
    base: '/docs',
    quickStart: '/docs/quick-start',
    aiModels: '/docs/ai-models',
    commands: '/docs/commands',
    chat: '/docs/chat',
    smartNotes: '/docs/smart-notes',
    mathSolver: '/docs/math-solver',
    pdfAnalysis: '/docs/pdf-analysis',
    webSearch: '/docs/web-search',
    settings: '/docs/settings',
    faq: '/docs/faq',
  },

  // Share URLs (for embedding)
  SHARE_URLS: {
    chat: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app'}/chat`,
    smartNotes: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app'}/smart-notes`,
    mathSolver: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app'}/math-solver`,
  },

  // App Metadata
  APP_NAME: 'CODEEX AI',
  APP_DESCRIPTION: 'Free AI platform with 35+ models for coding, math, research & more',
  APP_VERSION: '2.0.0',
  
  // Developer Info
  DEVELOPER: {
    name: 'Heoster (Harsh)',
    age: 16,
    location: 'Khatauli, Uttar Pradesh, India',
    email: 'the.heoster@mail.com',
    github: 'https://github.com/heoster',
    linkedin: 'https://in.linkedin.com/in/codeex-heoster-4b60b8399',
    twitter: 'https://twitter.com/The_Heoster_',
  },

  // Social Links
  SOCIAL: {
    github: 'https://github.com/heoster',
    linkedin: 'https://in.linkedin.com/in/codeex-heoster-4b60b8399',
    twitter: 'https://twitter.com/The_Heoster_',
  },
};
