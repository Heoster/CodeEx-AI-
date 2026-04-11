/**
 * Application Configuration
 * Central configuration for URLs, features, and app settings
 */

export const APP_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app',
  API_BASE_URL: process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api`
    : 'https://soham-ai.vercel.app/api',

  // Feature Routes
  FEATURES: {
    chat: '/chat',
    smartNotes: '/ai-services',
    mathSolver: '/visual-math',
    pdfAnalyzer: '/pdf-analyzer',
    imageGenerator: '/ai-services',
    jarvisMode: '/chat',
    memoryDashboard: '/account',
    aiServices: '/ai-services',
  },

  // Documentation Routes
  DOCS: {
    base: '/documentation',
    quickStart: '/documentation/quick-start',
    aiModels: '/documentation/ai-models',
    commands: '/documentation/commands',
    chat: '/documentation/chat',
    smartNotes: '/documentation/smart-notes',
    mathSolver: '/documentation/math-solver',
    pdfAnalysis: '/documentation/pdf-analysis',
    webSearch: '/documentation/web-search',
    settings: '/documentation/settings',
    faq: '/documentation/faq',
  },

  // Share URLs (for embedding)
  SHARE_URLS: {
    chat: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app'}/chat`,
    smartNotes: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app'}/ai-services`,
    mathSolver: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app'}/visual-math`,
  },

  // App Metadata
  APP_NAME: 'SOHAM',
  APP_DESCRIPTION: 'SOHAM (Self Organising Hyper Adaptive Machine) by CODEEX-AI',
  APP_VERSION: '2.0.0',
  
  // Developer Info
  DEVELOPER: {
    name: 'Heoster (Harsh)',
    age: 16,
    location: 'Khatauli, Uttar Pradesh, India',
    email: 'codeex@email.com',
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
