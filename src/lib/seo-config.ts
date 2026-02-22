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
    default: 'CODEEX AI - Free AI Platform with 35+ Models | Built by 16-Year-Old Heoster from India',
    template: '%s | CODEEX AI by Heoster'
  },
  description: `CODEEX AI: Revolutionary free AI platform with 35+ models (Groq, Gemini, Cerebras, Hugging Face). Built by ${DEVELOPER_INFO.name}, a ${DEVELOPER_INFO.age}-year-old visionary developer from ${DEVELOPER_INFO.location.city}, India. Chat, code, solve math, analyze PDFs, web search with voice synthesis. 100% free forever! Democratizing AI education for students worldwide.`,
  keywords: [
    // Core Brand & Developer
    'CODEEX AI',
    'CodeEx AI',
    'Heoster',
    'CODEEX Heoster',
    'Harsh developer',
    'Harsh Khatauli',
    'free AI platform',
    'free AI chatbot',
    '16 year old developer India',
    'youngest AI founder India',
    'teen developer AI platform',
    'student built AI',
    
    // Developer Story & Recognition
    'Heoster CODEEX AI founder',
    'Harsh 16 year old AI developer',
    'Indian teen developer',
    'Khatauli developer',
    'Uttar Pradesh AI startup',
    'Maples Academy student developer',
    'Class 11 PCM developer',
    'young entrepreneur India',
    'teenage AI innovator',
    'student AI entrepreneur',
    'democratizing AI education',
    'AI accessibility India',
    
    // AI Models & Providers (35+ models)
    'Groq AI',
    'Google Gemini 2.5',
    'Cerebras AI',
    'Hugging Face models',
    'Llama 3.1 8B',
    'Llama 3.3 70B',
    'Qwen 3 235B Instruct',
    'Qwen 3 32B',
    'DeepSeek R1',
    'GPT-OSS',
    'GLM 4.7',
    'Mixtral 8x7B',
    'Gemma 2 9B',
    'multi-model AI',
    '35+ AI models',
    'multi-provider AI platform',
    
    // Core Features
    'AI chatbot',
    'coding assistant',
    'math solver with steps',
    'PDF analyzer 5MB',
    'web search AI',
    'AI voice synthesis',
    'Edge TTS',
    'text to speech',
    'image equation solver',
    'smart notes AI',
    'AI research assistant',
    'real-time streaming AI',
    'smart auto-routing',
    'offline AI PWA',
    
    // Use Cases & Target Audience
    'AI for students',
    'AI for developers',
    'AI for coding',
    'AI for learning',
    'AI homework help',
    'programming assistant',
    'code debugging AI',
    'math problem solver',
    'research assistant AI',
    'study helper AI',
    'free coding help',
    'developer tools free',
    
    // Technology Stack
    'Next.js AI platform',
    'TypeScript AI app',
    'React AI chatbot',
    'Firebase AI integration',
    'artificial intelligence',
    'machine learning',
    'natural language processing',
    'NLP',
    'conversational AI',
    'AI API integration',
    'PWA progressive web app',
    'mobile-first AI',
    'responsive AI platform',
    
    // Education & India Focus
    'AI education India',
    'Indian AI platform',
    'AI startup India',
    'Khatauli Uttar Pradesh',
    'UP tech startup',
    'Indian developer success story',
    'Made in India AI',
    'Atmanirbhar AI',
    'Indian innovation',
    'Bharat AI platform',
    
    // Comparisons & Alternatives
    'ChatGPT alternative free',
    'free ChatGPT India',
    'Claude alternative',
    'Perplexity alternative',
    'Gemini alternative',
    'free AI no signup',
    'AI without login',
    'no registration AI',
    'instant AI access',
    
    // Long-tail Keywords
    'best free AI chatbot 2026',
    'free AI for students India',
    'multi-model AI platform free',
    'AI with 35+ models',
    'fastest AI chatbot India',
    'AI coding help free no signup',
    'free math solver with steps',
    'PDF analysis AI free 5MB',
    'voice synthesis AI free',
    'Edge TTS integration',
    'AI built by teenager',
    'youngest AI platform founder',
    '16 year old builds AI platform',
    'student developer success story',
    'how to use multiple AI models',
    'compare AI models free',
    'Groq vs Gemini vs Cerebras',
    'best AI for coding 2026',
    'best AI for students 2026',
    'AI platform with voice',
    'AI with web search',
    'comprehensive AI platform',
    
    // Developer Skills & Achievements
    'React developer 16 years old',
    'Next.js expert teen',
    'TypeScript AI developer',
    '50000+ lines of code',
    '200+ components AI platform',
    '99.9% uptime AI',
    'Lighthouse 95+ score',
    'performance optimized AI',
    'accessible AI platform',
    
    // Social Proof & Community
    '1000+ daily users',
    '100+ countries reached',
    'global AI platform',
    'community-driven AI',
    'open source AI',
    'transparent AI development',
    'privacy-first AI',
    'secure AI platform',
    
    // Vision & Mission Keywords
    'democratize AI',
    'AI for everyone',
    'accessible technology',
    'free education tools',
    'empowering students',
    'next generation innovators',
    'AI accessibility',
    'inclusive AI platform',
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
    title: `CODEEX AI - Free AI Platform with 35+ Models | Built by ${DEVELOPER_INFO.age}-Year-Old Heoster`,
    description: `Revolutionary AI platform with 35+ models (Groq Llama 3.3, Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek). Built by ${DEVELOPER_INFO.name}, ${DEVELOPER_INFO.age}-year-old visionary from ${DEVELOPER_INFO.location.city}, India. Chat, code, solve math, analyze PDFs, web search - all free forever! Democratizing AI education.`,
    keywords: ['AI platform', 'free AI', 'multi-model AI', 'Heoster', 'CODEEX AI', 'Groq', 'Gemini', 'Cerebras', '35+ models', '16 year old developer', 'Indian AI startup', 'Khatauli'],
  },
  chat: {
    title: 'AI Chat - 35+ Models | Groq Llama 3.3, Gemini 2.5, Cerebras Qwen 3 235B',
    description: `Chat with 35+ AI models: Groq Llama 3.1/3.3 70B, Google Gemini 2.5, Cerebras Qwen 3 235B Instruct, DeepSeek R1, GPT-OSS, GLM 4.7. Instant answers, code help, problem-solving. Built by ${DEVELOPER_INFO.age}-year-old Heoster. 100% free, no signup.`,
    keywords: ['AI chat', 'chatbot', 'Groq', 'Gemini', 'Cerebras', 'Llama 3.3 70B', 'Qwen 3 235B', 'DeepSeek', 'free chatbot', 'multi-model chat', 'Heoster AI'],
  },
  features: {
    title: 'Features - 35+ AI Models, Voice, PDF Analysis & More | CODEEX AI',
    description: `CODEEX AI features: 35+ models (Groq, Gemini, Cerebras), code assistance, math solving with steps, PDF analysis (5MB), web search with citations, Edge TTS voice synthesis, image equation solver, smart notes. All free. Built by ${DEVELOPER_INFO.age}-year-old developer from India.`,
    keywords: ['AI features', 'AI capabilities', 'coding help', 'math solver', 'PDF analyzer', 'voice synthesis', 'Edge TTS', 'web search AI', 'Heoster features'],
  },
  documentation: {
    title: 'Documentation - Complete Guide to 35+ AI Models | CODEEX AI',
    description: `Complete guide to CODEEX AI platform. Learn about 35+ models (Groq Llama, Gemini, Cerebras Qwen, DeepSeek), API integration, model selection, features, and advanced capabilities. Created by ${DEVELOPER_INFO.name} to democratize AI education.`,
    keywords: ['AI documentation', 'API docs', 'user guide', 'tutorial', 'how to use', 'model guide', 'Cerebras guide', 'Groq guide', 'Gemini guide', 'Heoster docs'],
  },
  about: {
    title: `About - Meet Heoster, ${DEVELOPER_INFO.age}-Year-Old Founder of CODEEX AI`,
    description: `Meet ${DEVELOPER_INFO.name} (${DEVELOPER_INFO.realName}), ${DEVELOPER_INFO.age}-year-old founder of CODEEX AI from ${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}, India. ${DEVELOPER_INFO.education.class} student at ${DEVELOPER_INFO.education.school}. Built 35+ model AI platform with 50,000+ lines of code. Vision: ${DEVELOPER_INFO.vision}`,
    keywords: ['Heoster', 'CODEEX Heoster', 'Harsh developer', '16 year old developer', 'youngest AI founder', 'Indian teen developer', 'Khatauli developer', 'student entrepreneur', 'AI startup founder'],
  },
  contact: {
    title: `Contact - Get in Touch with ${DEVELOPER_INFO.name} & CODEEX AI Team`,
    description: `Contact ${DEVELOPER_INFO.name} and CODEEX AI team. Email: ${DEVELOPER_INFO.contact.email} | LinkedIn: ${DEVELOPER_INFO.social.linkedin} | GitHub: @${DEVELOPER_INFO.social.github} | Twitter: @${DEVELOPER_INFO.social.Twitter}. Based in ${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}, India.`,
    keywords: ['contact', 'support', 'Heoster email', 'get in touch', 'feedback', 'collaboration', 'the.heoster@mail.com', 'Heoster LinkedIn', 'Heoster GitHub'],
  },
  privacy: {
    title: 'Privacy Policy - Your Data is Safe with CODEEX AI',
    description: `CODEEX AI privacy policy by ${DEVELOPER_INFO.name}. Learn how we protect your data, respect privacy, and ensure security. GDPR, CCPA compliant. No data selling. Privacy-first AI platform built with transparency and user trust.`,
    keywords: ['privacy policy', 'data protection', 'security', 'GDPR', 'CCPA', 'data safety', 'privacy-first AI', 'secure AI'],
  },
  terms: {
    title: 'Terms of Service - CODEEX AI Usage Guidelines',
    description: `CODEEX AI Terms of Service. Understand usage guidelines, acceptable use policy, user rights, and platform rules. Built by ${DEVELOPER_INFO.name} with transparency and fairness. Free forever commitment.`,
    keywords: ['terms of service', 'usage guidelines', 'acceptable use', 'user agreement', 'platform rules', 'TOS'],
  },
  models: {
    title: '35+ AI Models - Groq, Gemini, Cerebras, Hugging Face | CODEEX AI',
    description: `Explore 35+ AI models: Groq (Llama 3.1 8B, Llama 3.3 70B, Mixtral 8x7B), Google Gemini 2.5, Cerebras (Qwen 3 235B, Qwen 3 32B, GLM 4.7), Hugging Face (DeepSeek R1, GPT-OSS). Compare performance, features, and use cases. All free.`,
    keywords: ['AI models', 'Groq models', 'Gemini models', 'Cerebras models', 'Llama 3.3', 'Qwen 3 235B', 'DeepSeek', 'model comparison', 'AI model list'],
  },
};

// Structured data for rich snippets
export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEVELOPER_INFO.company.name,
    url: 'https://codeex-ai.netlify.app',
    logo: 'https://codeex-ai.netlify.app/favicon.ico',
    description: `Free AI platform with 35+ models for coding, learning, and problem-solving. Founded by ${DEVELOPER_INFO.name}, ${DEVELOPER_INFO.age}-year-old developer from India.`,
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
    url: 'https://codeex-ai.netlify.app',
    image: 'https://codeex-ai.netlify.app/favicon.ico',
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
    name: DEVELOPER_INFO.company.name,
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
    description: `Free AI platform with 35+ models including Groq, Google Gemini, Cerebras, Hugging Face. Chat, code, solve math, analyze PDFs, search web. Created by ${DEVELOPER_INFO.name}, ${DEVELOPER_INFO.age}-year-old developer from ${DEVELOPER_INFO.location.city}, India.`,
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
    screenshot: 'https://codeex-ai.netlify.app/Multi-Chat.png',
    softwareVersion: DEVELOPER_INFO.projectStats.modelsIntegrated.toString(),
    releaseNotes: `Latest update includes ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ AI models with enhanced performance and new features.`,
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEVELOPER_INFO.company.name,
    alternateName: 'CodeEx AI',
    url: 'https://codeex-ai.netlify.app',
    description: `Free AI platform with 35+ models built by ${DEVELOPER_INFO.name}`,
    inLanguage: ['en', 'hi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://codeex-ai.netlify.app/chat?q={search_term_string}',
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
        item: 'https://codeex-ai.netlify.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chat',
        item: 'https://codeex-ai.netlify.app/chat',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Features',
        item: 'https://codeex-ai.netlify.app/features',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Documentation',
        item: 'https://codeex-ai.netlify.app/documentation',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'About',
        item: 'https://codeex-ai.netlify.app/about',
      },
    ],
  },
};

// Analytics tracking helper
export function trackPageView(pathname: string, title?: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-XXXXXXXXXX', {
      page_path: pathname,
      page_title: title,
    });
  }
}
