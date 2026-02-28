/**
 * SEO Configuration for CODEEX AI
 * Centralized SEO settings and structured data
 * Enhanced with comprehensive developer information and high-level optimization
 */

import { DEVELOPER_INFO } from './developer-info';

export interface SEOConfig {
  title: string | { default: string; template: string };
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
}

export const defaultSEO: SEOConfig = {
  title: {
    default: 'CODEEX - Free AI Chat with 35+ Models | Groq, Gemini, Cerebras, DeepSeek',
    template: '%s | CODEEX'
  },
  description: `CODEEX: Free AI chat platform with 35+ models including Groq Llama 3.3 70B, Google Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek R1. Chat, code, solve math, analyze PDFs, web search. No signup required. Built by ${DEVELOPER_INFO.name}, ${DEVELOPER_INFO.age}-year-old developer from India. 100% free forever.`,
  keywords: [
    // Core Brand - PRIMARY KEYWORDS
    'CODEEX',
    'CodeEx',
    'codeex ai',
    'codeex chat',
    'codeex free ai',
    'code ex',
    'codex ai',
    
    // Free AI Platform
    'free ai chat',
    'free ai chatbot',
    'free ai platform',
    'free chatgpt alternative',
    'free ai no signup',
    'ai chat free',
    'chatbot free',
    
    // AI Models - SPECIFIC
    'groq llama 3.3 70b',
    'google gemini 2.5',
    'cerebras qwen 3 235b',
    'deepseek r1',
    'llama 3.3 70b free',
    'qwen 3 235b free',
    'gemini 2.5 free',
    '35+ ai models',
    'multi model ai',
    
    // Core Features
    'ai coding assistant',
    'math solver ai',
    'pdf analyzer ai',
    'web search ai',
    'voice ai',
    'ai chat with voice',
    
    // Developer & Brand
    'Heoster',
    'CODEEX Heoster',
    'Harsh developer',
    '16 year old developer',
    'indian ai platform',
    
    // Use Cases
    'ai for students',
    'ai for coding',
    'ai homework help',
    'programming assistant',
    'code debugging ai',
    
    // Comparisons
    'chatgpt alternative',
    'claude alternative',
    'perplexity alternative',
    'free chatgpt',
    'chatgpt free no login',
  ],
  ogImage: '/Multi-Chat.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  author: `${DEVELOPER_INFO.name} (${DEVELOPER_INFO.realName})`,
  locale: 'en_US',
  alternateLocales: ['hi_IN', 'en_IN'],
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: `CODEEX - Free AI Chat with 35+ Models | Groq, Gemini, Cerebras`,
    description: `CODEEX: Free AI chat with 35+ models including Groq Llama 3.3 70B, Google Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek R1. Chat, code, solve math, analyze PDFs, web search. No signup. 100% free forever.`,
    keywords: ['CODEEX', 'free ai chat', 'groq llama 3.3', 'gemini 2.5', 'cerebras qwen', 'deepseek', 'free chatgpt alternative', 'ai chat no signup'],
  },
  chat: {
    title: 'AI Chat - 35+ Models Free | CODEEX',
    description: `Chat with 35+ AI models free: Groq Llama 3.3 70B, Google Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek R1, GPT-OSS. Instant answers, code help, problem-solving. No signup required.`,
    keywords: ['ai chat', 'free chatbot', 'groq', 'gemini', 'cerebras', 'llama 3.3', 'qwen 3 235b', 'deepseek', 'CODEEX chat'],
  },
  features: {
    title: 'Features - 35+ AI Models, Voice, PDF Analysis | CODEEX',
    description: `CODEEX features: 35+ AI models (Groq, Gemini, Cerebras), code assistance, math solving, PDF analysis (5MB), web search, voice synthesis, image solver. All free, no signup.`,
    keywords: ['ai features', 'coding help', 'math solver', 'pdf analyzer', 'voice ai', 'web search ai', 'CODEEX features'],
  },
  documentation: {
    title: 'Documentation - Complete Guide to 35+ AI Models | CODEEX',
    description: `Complete guide to CODEEX platform. Learn about 35+ models (Groq Llama, Gemini, Cerebras Qwen, DeepSeek), API integration, model selection, and advanced features.`,
    keywords: ['ai documentation', 'api docs', 'user guide', 'tutorial', 'model guide', 'CODEEX docs'],
  },
  about: {
    title: `About - Meet ${DEVELOPER_INFO.name}, ${DEVELOPER_INFO.age}-Year-Old Founder | CODEEX`,
    description: `Meet ${DEVELOPER_INFO.name} (${DEVELOPER_INFO.realName}), ${DEVELOPER_INFO.age}-year-old founder of CODEEX from ${DEVELOPER_INFO.location.city}, India. Built 35+ model AI platform with 50,000+ lines of code to democratize AI education.`,
    keywords: ['Heoster', 'CODEEX founder', '16 year old developer', 'indian developer', 'ai startup founder'],
  },
  contact: {
    title: `Contact - Get in Touch with CODEEX Team`,
    description: `Contact CODEEX team. Email: ${DEVELOPER_INFO.contact.email} | Connect on LinkedIn, GitHub, Twitter. Based in ${DEVELOPER_INFO.location.city}, India.`,
    keywords: ['contact', 'support', 'feedback', 'CODEEX contact'],
  },
  privacy: {
    title: 'Privacy Policy - Your Data is Safe | CODEEX',
    description: `CODEEX privacy policy. Learn how we protect your data, respect privacy, and ensure security. GDPR, CCPA compliant. No data selling. Privacy-first AI platform.`,
    keywords: ['privacy policy', 'data protection', 'security', 'GDPR', 'CCPA', 'CODEEX privacy'],
  },
  terms: {
    title: 'Terms of Service - Usage Guidelines | CODEEX',
    description: `CODEEX Terms of Service. Understand usage guidelines, acceptable use policy, user rights, and platform rules. Free forever commitment.`,
    keywords: ['terms of service', 'usage guidelines', 'user agreement', 'CODEEX terms'],
  },
  models: {
    title: '35+ AI Models - Groq, Gemini, Cerebras | CODEEX',
    description: `Explore 35+ AI models on CODEEX: Groq (Llama 3.3 70B, Mixtral 8x7B), Google Gemini 2.5, Cerebras (Qwen 3 235B, GLM 4.7), DeepSeek R1. Compare performance. All free.`,
    keywords: ['ai models', 'groq models', 'gemini', 'cerebras', 'llama 3.3', 'qwen 3 235b', 'deepseek', 'CODEEX models'],
  },
};

// Structured data for rich snippets
export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CODEEX',
    alternateName: ['CodeEx', 'CODEEX AI'],
    url: 'https://codeex-ai.vercel.app',
    logo: 'https://codeex-ai.vercel.app/favicon.ico',
    description: `Free AI chat platform with 35+ models including Groq, Gemini, Cerebras. Chat, code, solve math, analyze PDFs. No signup required.`,
    foundingDate: DEVELOPER_INFO.company.founded,
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: DEVELOPER_INFO.location.city,
        addressRegion: DEVELOPER_INFO.location.state,
        addressCountry: DEVELOPER_INFO.location.country,
      },
    },
    founder: {
      '@type': 'Person',
      name: DEVELOPER_INFO.name,
      alternateName: DEVELOPER_INFO.realName,
      age: DEVELOPER_INFO.age,
      jobTitle: DEVELOPER_INFO.company.role,
      description: `${DEVELOPER_INFO.age}-year-old visionary developer and founder of ${DEVELOPER_INFO.company.name}. ${DEVELOPER_INFO.education.class} student at ${DEVELOPER_INFO.education.school}.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: DEVELOPER_INFO.location.city,
        addressRegion: DEVELOPER_INFO.location.state,
        addressCountry: DEVELOPER_INFO.location.country,
      },
      email: DEVELOPER_INFO.contact.email,
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: DEVELOPER_INFO.education.school,
      },
      knowsAbout: DEVELOPER_INFO.skills,
      sameAs: [
        DEVELOPER_INFO.contact.github,
        DEVELOPER_INFO.contact.linkedin,
        DEVELOPER_INFO.contact.twitter,
      ],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: DEVELOPER_INFO.contact.email,
      contactType: 'Customer Support',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      DEVELOPER_INFO.contact.github,
      DEVELOPER_INFO.contact.linkedin,
      DEVELOPER_INFO.contact.twitter,
    ],
    slogan: DEVELOPER_INFO.vision,
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 1,
    },
  },
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: DEVELOPER_INFO.name,
    alternateName: DEVELOPER_INFO.realName,
    givenName: DEVELOPER_INFO.realName,
    additionalName: DEVELOPER_INFO.alias,
    age: DEVELOPER_INFO.age,
    gender: 'Male',
    birthPlace: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: DEVELOPER_INFO.location.city,
        addressRegion: DEVELOPER_INFO.location.state,
        addressCountry: DEVELOPER_INFO.location.country,
      },
    },
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: DEVELOPER_INFO.location.city,
        addressRegion: DEVELOPER_INFO.location.state,
        addressCountry: DEVELOPER_INFO.location.country,
      },
    },
    jobTitle: DEVELOPER_INFO.company.role,
    worksFor: {
      '@type': 'Organization',
      name: DEVELOPER_INFO.company.name,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: DEVELOPER_INFO.education.school,
    },
    email: DEVELOPER_INFO.contact.email,
    url: 'https://codeex-ai.vercel.app',
    image: 'https://codeex-ai.vercel.app/favicon.ico',
    description: `${DEVELOPER_INFO.name} is a ${DEVELOPER_INFO.age}-year-old visionary developer and founder of ${DEVELOPER_INFO.company.name}. Currently studying ${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} at ${DEVELOPER_INFO.education.school}, he has built a revolutionary AI platform with 35+ models, reaching 100+ countries with 1000+ daily users.`,
    knowsAbout: DEVELOPER_INFO.skills.concat(DEVELOPER_INFO.aiTechnologies),
    knowsLanguage: ['English', 'Hindi'],
    hasCredential: DEVELOPER_INFO.achievements.map(achievement => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Achievement',
      description: achievement,
    })),
    sameAs: [
      DEVELOPER_INFO.contact.github,
      DEVELOPER_INFO.contact.linkedin,
      DEVELOPER_INFO.contact.twitter,
      `https://instagram.com/${DEVELOPER_INFO.social.instagram}`,
    ],
  },
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CODEEX',
    alternateName: ['CodeEx', 'CODEEX AI'],
    applicationCategory: 'ProductivityApplication',
    applicationSubCategory: 'Artificial Intelligence Platform',
    operatingSystem: 'Web Browser, iOS, Android, Windows, macOS, Linux',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2099-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: DEVELOPER_INFO.projectStats.dailyUsers.replace('+', ''),
      bestRating: '5',
      worstRating: '1',
      reviewCount: '500',
    },
    description: `Free AI chat platform with 35+ models including Groq Llama 3.3 70B, Google Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek R1. Chat, code, solve math, analyze PDFs, web search. No signup required. 100% free forever.`,
    featureList: [
      '35+ AI models (Groq, Gemini, Cerebras, Hugging Face)',
      'Llama 3.1 8B, Llama 3.3 70B, Qwen 3 235B Instruct, DeepSeek R1, GPT-OSS',
      'Code assistance and debugging',
      'Math problem solving with detailed steps',
      'PDF document analysis (up to 5MB)',
      'Web search integration with citations',
      'Voice synthesis (Edge TTS)',
      'Image equation solver',
      'Real-time streaming responses',
      'Smart auto-routing between models',
      'Mobile-optimized PWA',
      'Offline support',
      'Share & export responses (TXT, MD, PDF)',
      '100% free forever',
      'No signup required',
      'Privacy-first design',
      '99.9% uptime',
      'Lighthouse score 95+',
    ],
    author: {
      '@type': 'Person',
      name: DEVELOPER_INFO.name,
      age: DEVELOPER_INFO.age,
    },
    creator: {
      '@type': 'Person',
      name: DEVELOPER_INFO.name,
      age: DEVELOPER_INFO.age,
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: ['en', 'hi'],
    screenshot: 'https://codeex-ai.vercel.app/Multi-Chat.png',
    softwareVersion: DEVELOPER_INFO.projectStats.modelsIntegrated.toString(),
    releaseNotes: `Latest update includes ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ AI models with enhanced performance and new features.`,
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CODEEX',
    alternateName: ['CodeEx', 'CODEEX AI', 'CodeEx AI'],
    url: 'https://codeex-ai.vercel.app',
    description: `Free AI chat with 35+ models: Groq, Gemini, Cerebras, DeepSeek. No signup required.`,
    inLanguage: ['en', 'hi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://codeex-ai.vercel.app/chat?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    creator: {
      '@type': 'Person',
      name: DEVELOPER_INFO.name,
      age: DEVELOPER_INFO.age,
    },
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who created CODEEX AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `CODEEX AI was created by ${DEVELOPER_INFO.name} (also known as ${DEVELOPER_INFO.realName}), a ${DEVELOPER_INFO.age}-year-old visionary developer from ${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}, India. He is currently studying ${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} at ${DEVELOPER_INFO.education.school}. He founded ${DEVELOPER_INFO.company.name} in ${DEVELOPER_INFO.company.founded} as an AI startup to democratize AI education and make advanced technology accessible to every student.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Is CODEEX AI free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! CODEEX AI is completely free to use forever. We provide access to 35+ AI models at no cost, making advanced AI technology accessible to everyone. ${DEVELOPER_INFO.name}'s mission is: "${DEVELOPER_INFO.mission}"`,
        },
      },
      {
        '@type': 'Question',
        name: 'What AI models does CODEEX AI support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI supports 35+ AI models including Groq (Llama 3.1 8B, Llama 3.3 70B, Mixtral 8x7B, Gemma 2 9B), Google Gemini 2.5, Cerebras (Qwen 3 235B Instruct, Qwen 3 32B, GLM 4.7), Hugging Face (DeepSeek R1, GPT-OSS, RNJ-1), and more. You can switch between models or use smart auto-routing.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I contact the developer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can contact ${DEVELOPER_INFO.name} at ${DEVELOPER_INFO.contact.email}, or connect on LinkedIn (${DEVELOPER_INFO.social.linkedin}), GitHub (@${DEVELOPER_INFO.social.github}), Twitter (@${DEVELOPER_INFO.social.Twitter}), or Instagram (@${DEVELOPER_INFO.social.instagram}).`,
        },
      },
      {
        '@type': 'Question',
        name: 'What makes CODEEX AI unique?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `CODEEX AI is unique because it's built by a ${DEVELOPER_INFO.age}-year-old student developer who has integrated 35+ AI models into one platform. It features ${DEVELOPER_INFO.projectStats.linesOfCode} lines of code, ${DEVELOPER_INFO.projectStats.components} components, ${DEVELOPER_INFO.projectStats.uptime} uptime, and reaches ${DEVELOPER_INFO.projectStats.countriesReached} countries with ${DEVELOPER_INFO.projectStats.dailyUsers} daily users. It's completely free, privacy-first, and built with the vision to democratize AI education.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What features does CODEEX AI offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CODEEX AI offers: 35+ AI models, real-time chat with streaming, code assistance and debugging, math problem solving with steps, PDF analysis (5MB), web search with citations, voice synthesis (Edge TTS), image equation solver, smart notes, smart auto-routing, mobile PWA, offline support, share & export (TXT, MD, PDF), and more. All features are 100% free.',
        },
      },
    ],
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codeex-ai.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chat',
        item: 'https://codeex-ai.vercel.app/chat',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Features',
        item: 'https://codeex-ai.vercel.app/features',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Documentation',
        item: 'https://codeex-ai.vercel.app/documentation',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'About',
        item: 'https://codeex-ai.vercel.app/about',
      },
    ],
  },
};

// Analytics tracking helper
export function trackPageView(pathname: string, title?: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-YH87NZPSKB', {
      page_path: pathname,
      page_title: title,
    });
  }
}

// Track custom events
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}
