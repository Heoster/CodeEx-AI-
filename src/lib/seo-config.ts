/**
 * SEO Configuration for SOHAM
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
    default: 'SOHAM by CODEEX-AI | Human-Centered AI Workspace with 35+ Models',
    template: '%s | SOHAM'
  },
  description:
    'SOHAM by CODEEX-AI is a human-centered AI workspace built by Heoster. Explore 35+ AI models, PDF analysis, image math solving, voice tools, and the deeper Sanskrit meaning of Soham: "I am That."',
  keywords: [
    // Core Brand - PRIMARY KEYWORDS
    'SOHAM',
    'Soham meaning',
    'Soham Sanskrit meaning',
    'So Hum mantra',
    'I am That mantra',
    'Soham Advaita',
    'Soham meditation meaning',
    'SOHAM chat',
    'SOHAM free ai',
    'SOHAM by CODEEX-AI',
    'CODEEX-AI',
    'CodeEx AI',
    'Codeex AI',
    'code ex ai',
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
    'Heoster founder of CODEEX-AI',
    'Heoster developer of SOHAM',
    'CODEEX Heoster',
    'Harsh developer',
    'Harsh founder CODEEX-AI',
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
  ogImage: 'https://soham-ai.vercel.app/Multi-Chat.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  author: `${DEVELOPER_INFO.name} (${DEVELOPER_INFO.realName})`,
  locale: 'en_US',
  alternateLocales: [],
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'SOHAM by CODEEX-AI | Human-Centered AI Workspace with 35+ Models',
    description:
      'Meet SOHAM, the flagship AI product by CODEEX-AI and Heoster. Use 35+ models for chat, PDFs, image math, and voice workflows, while learning the deeper meaning behind the name Soham.',
    keywords: ['SOHAM', 'Soham meaning', 'CODEEX-AI', 'Heoster', 'SOHAM by CODEEX-AI', 'human-centered ai workspace', 'free ai chat', 'ai chat no signup'],
  },
  chat: {
    title: 'AI Chat App | SOHAM - Free Chat, Coding Help, Smart Search',
    description: 'Use SOHAM AI chat for coding help, smart search, reasoning, and multi-model responses with 35+ models and no signup required.',
    keywords: ['ai chat', 'SOHAM chat', 'CODEEX-AI chat', 'free chatbot', 'groq', 'gemini', 'cerebras', 'llama 3.3', 'qwen 3 235b', 'deepseek'],
  },
  features: {
    title: 'AI Features | SOHAM - 35+ Models, Voice, PDF Analysis',
    description: 'Explore SOHAM features including AI chat, PDF analysis, image math solving, voice interaction, multi-model routing, and smart search.',
    keywords: ['ai features', 'SOHAM features', 'CODEEX-AI product', 'coding help', 'math solver', 'pdf analyzer', 'voice ai', 'web search ai'],
  },
  documentation: {
    title: 'AI Documentation | SOHAM - Chat, PDF Analysis, Math Solver',
    description: 'Read SOHAM documentation for AI chat, model selection, PDF analysis, image math solving, commands, and product setup.',
    keywords: ['ai documentation', 'api docs', 'user guide', 'tutorial', 'model guide', 'SOHAM docs'],
  },
  about: {
    title: `About - Meet ${DEVELOPER_INFO.name}, ${DEVELOPER_INFO.age}-Year-Old Founder | SOHAM`,
    description: `Meet ${DEVELOPER_INFO.name} (${DEVELOPER_INFO.realName}), ${DEVELOPER_INFO.age}-year-old founder of CODEEX-AI and creator of SOHAM from ${DEVELOPER_INFO.location.city}, India. Learn the human story behind SOHAM, a 35+ model AI platform inspired by the Sanskrit idea of Soham: "I am That."`,
    keywords: ['Heoster', 'founder of CODEEX-AI', 'creator of SOHAM', 'Soham meaning', '16 year old developer', 'indian developer', 'ai startup founder'],
  },
  contact: {
    title: `Contact - Get in Touch with SOHAM Team`,
    description: `Contact SOHAM team. Email: ${DEVELOPER_INFO.contact.email} | Connect on LinkedIn, GitHub, Twitter. Based in ${DEVELOPER_INFO.location.city}, India.`,
    keywords: ['contact', 'support', 'feedback', 'SOHAM contact'],
  },
  privacy: {
    title: 'Privacy Policy - Your Data is Safe | SOHAM',
    description: `SOHAM privacy policy. Learn how we protect your data, respect privacy, and ensure security. GDPR, CCPA compliant. No data selling. Privacy-first AI platform.`,
    keywords: ['privacy policy', 'data protection', 'security', 'GDPR', 'CCPA', 'SOHAM privacy'],
  },
  terms: {
    title: 'Terms of Service - Usage Guidelines | SOHAM',
    description: `SOHAM Terms of Service. Understand usage guidelines, acceptable use policy, user rights, and platform rules. Free forever commitment.`,
    keywords: ['terms of service', 'usage guidelines', 'user agreement', 'SOHAM terms'],
  },
  models: {
    title: '35+ AI Models - Groq, Gemini, Cerebras | SOHAM',
    description: `Explore 35+ AI models on SOHAM: Groq (Llama 3.3 70B, Mixtral 8x7B), Google Gemini 2.5, Cerebras (Qwen 3 235B, GLM 4.7), DeepSeek R1. Compare performance. All free.`,
    keywords: ['ai models', 'groq models', 'gemini', 'cerebras', 'llama 3.3', 'qwen 3 235b', 'deepseek', 'SOHAM models'],
  },
};

// Structured data for rich snippets
export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://soham-ai.vercel.app/#organization',
    name: 'CODEEX-AI',
    alternateName: ['SOHAM', 'CodeEx-AI', 'Codeex AI'],
    url: 'https://soham-ai.vercel.app',
    logo: 'https://soham-ai.vercel.app/FINALSOHAM.png',
    description: `CODEEX-AI is the company behind SOHAM, a human-centered AI platform with 35+ models for coding, math solving, PDF analysis, voice workflows, and adaptive task support.`,
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
    '@id': 'https://soham-ai.vercel.app/#person',
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
    url: 'https://soham-ai.vercel.app',
    image: 'https://soham-ai.vercel.app/FINALSOHAM.png',
    description: `${DEVELOPER_INFO.name} is a ${DEVELOPER_INFO.age}-year-old founder-builder and the developer behind SOHAM. Currently studying ${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} at ${DEVELOPER_INFO.education.school}, he is building a human-centered AI platform inspired by the Sanskrit meaning of Soham: "I am That."`,
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
    name: 'SOHAM',
    alternateName: ['SOHAM by CODEEX-AI', 'CODEEX-AI SOHAM'],
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
    description: `SOHAM is the flagship AI product from CODEEX-AI. It offers a human-centered AI workspace with 35+ models for chat, coding, PDF analysis, image solving, and voice interaction. The name is inspired by the Sanskrit mantra Soham, meaning "I am That."`,
    keywords: 'SOHAM, Soham meaning, So Hum mantra, CODEEX-AI, Heoster, AI chat, PDF analysis, math solver, image solver, coding assistant, Groq, Gemini, Cerebras, DeepSeek',
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
      'Human-centered product identity inspired by Sanskrit philosophy',
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
    publisher: {
      '@type': 'Organization',
      name: 'CODEEX-AI',
      url: 'https://soham-ai.vercel.app',
    },
    brand: {
      '@type': 'Brand',
      name: 'SOHAM',
      slogan: 'Self Organising Hyper Adaptive Machine',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: ['en', 'hi'],
    screenshot: 'https://soham-ai.vercel.app/Multi-Chat.png',
    softwareVersion: DEVELOPER_INFO.projectStats.modelsIntegrated.toString(),
    releaseNotes: `Latest update includes ${DEVELOPER_INFO.projectStats.modelsIntegrated}+ AI models with enhanced performance and new features.`,
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://soham-ai.vercel.app/#website',
    name: 'SOHAM',
    alternateName: ['SOHAM by CODEEX-AI', 'CODEEX-AI SOHAM'],
    url: 'https://soham-ai.vercel.app',
    description: `SOHAM is the AI product from CODEEX-AI for chat, coding help, PDF analysis, image math solving, and voice workflows. The brand is inspired by the Sanskrit mantra Soham, meaning "I am That."`,
    publisher: {
      '@type': 'Organization',
      name: 'CODEEX-AI',
      url: 'https://soham-ai.vercel.app',
    },
    inLanguage: ['en', 'hi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://soham-ai.vercel.app/chat?q={search_term_string}',
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
        name: 'What does SOHAM mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `SOHAM has two connected meanings. In the product, it stands for "${DEVELOPER_INFO.product.expandedName}". The name is also inspired by the Sanskrit mantra Soham (So Hum), meaning "${DEVELOPER_INFO.product.sanskritMeaning}". In spiritual philosophy, it points to the unity of the individual self with universal consciousness and is often used in meditation with breath awareness.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Who created SOHAM?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `SOHAM was created by ${DEVELOPER_INFO.name} (also known as ${DEVELOPER_INFO.realName}), a ${DEVELOPER_INFO.age}-year-old founder-builder from ${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}, India. He is currently studying ${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} at ${DEVELOPER_INFO.education.school}. He founded ${DEVELOPER_INFO.company.name} in ${DEVELOPER_INFO.company.founded} to build more accessible, human-centered AI tools.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Is SOHAM free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! SOHAM is completely free to use forever. We provide access to 35+ AI models at no cost, making advanced AI technology accessible to everyone. ${DEVELOPER_INFO.name}'s mission is: "${DEVELOPER_INFO.mission}"`,
        },
      },
      {
        '@type': 'Question',
        name: 'What AI models does SOHAM support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SOHAM supports 35+ AI models including Groq (Llama 3.1 8B, Llama 3.3 70B, Mixtral 8x7B, Gemma 2 9B), Google Gemini 2.5, Cerebras (Qwen 3 235B Instruct, Qwen 3 32B, GLM 4.7), Hugging Face (DeepSeek R1, GPT-OSS, RNJ-1), and more. You can switch between models or use smart auto-routing.',
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
        name: 'What makes SOHAM unique?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `SOHAM is unique because it's built by a ${DEVELOPER_INFO.age}-year-old student developer who has integrated 35+ AI models into one platform. It features ${DEVELOPER_INFO.projectStats.linesOfCode} lines of code, ${DEVELOPER_INFO.projectStats.components} components, ${DEVELOPER_INFO.projectStats.uptime} uptime, and reaches ${DEVELOPER_INFO.projectStats.countriesReached} countries with ${DEVELOPER_INFO.projectStats.dailyUsers} daily users. It's completely free, privacy-first, and built with the vision to democratize AI education.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What features does SOHAM offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SOHAM offers: 35+ AI models, real-time chat with streaming, code assistance and debugging, math problem solving with steps, PDF analysis (5MB), web search with citations, voice synthesis (Edge TTS), image equation solver, smart notes, smart auto-routing, mobile PWA, offline support, share & export (TXT, MD, PDF), and more. All features are 100% free.',
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
        item: 'https://soham-ai.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chat',
        item: 'https://soham-ai.vercel.app/chat',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Features',
        item: 'https://soham-ai.vercel.app/features',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Documentation',
        item: 'https://soham-ai.vercel.app/documentation',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'About',
        item: 'https://soham-ai.vercel.app/about',
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
