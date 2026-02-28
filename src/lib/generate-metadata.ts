import { Metadata } from 'next';
import { pageSEO, defaultSEO } from './seo-config';

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate comprehensive metadata for any page
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '',
    ogImage = defaultSEO.ogImage,
    noIndex = false,
  } = options;

  const fullTitle = title 
    ? `${title} | CODEEX` 
    : typeof defaultSEO.title === 'string' 
      ? defaultSEO.title 
      : defaultSEO.title.default;

  const finalDescription = description || defaultSEO.description;
  const finalKeywords = [...(defaultSEO.keywords || []), ...keywords];
  const canonicalUrl = `https://codeex-ai.vercel.app${path}`;

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: finalKeywords.join(', '),
    authors: [{ name: defaultSEO.author || 'Heoster' }],
    creator: defaultSEO.author,
    publisher: 'CODEEX',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: 'CODEEX',
      images: [
        {
          url: ogImage || '/Multi-Chat.png',
          width: 1200,
          height: 630,
          alt: 'CODEEX - Free AI Chat Platform',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [ogImage || '/Multi-Chat.png'],
      creator: '@codeex_ai',
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    category: 'technology',
  };
}

/**
 * Quick metadata generators for common pages
 */
export const metadataGenerators = {
  home: () => generatePageMetadata({
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    keywords: pageSEO.home.keywords,
    path: '/',
  }),

  chat: () => generatePageMetadata({
    title: pageSEO.chat.title,
    description: pageSEO.chat.description,
    keywords: pageSEO.chat.keywords,
    path: '/chat',
  }),

  features: () => generatePageMetadata({
    title: pageSEO.features.title,
    description: pageSEO.features.description,
    keywords: pageSEO.features.keywords,
    path: '/features',
  }),

  documentation: () => generatePageMetadata({
    title: pageSEO.documentation.title,
    description: pageSEO.documentation.description,
    keywords: pageSEO.documentation.keywords,
    path: '/documentation',
  }),

  about: () => generatePageMetadata({
    title: pageSEO.about.title,
    description: pageSEO.about.description,
    keywords: pageSEO.about.keywords,
    path: '/about',
  }),

  contact: () => generatePageMetadata({
    title: pageSEO.contact.title,
    description: pageSEO.contact.description,
    keywords: pageSEO.contact.keywords,
    path: '/contact',
  }),

  privacy: () => generatePageMetadata({
    title: pageSEO.privacy.title,
    description: pageSEO.privacy.description,
    keywords: pageSEO.privacy.keywords,
    path: '/privacy',
  }),

  terms: () => generatePageMetadata({
    title: pageSEO.terms.title,
    description: pageSEO.terms.description,
    keywords: pageSEO.terms.keywords,
    path: '/terms',
  }),

  models: () => generatePageMetadata({
    title: pageSEO.models.title,
    description: pageSEO.models.description,
    keywords: pageSEO.models.keywords,
    path: '/models',
  }),

  pricing: () => generatePageMetadata({
    title: 'Pricing - 100% Free Forever | CODEEX',
    description: 'CODEEX is 100% free forever. Access 35+ AI models including Groq, Gemini, Cerebras at no cost. No hidden fees, no subscriptions. Free AI for everyone.',
    keywords: ['free ai', 'free pricing', 'no cost ai', 'free chatgpt', 'CODEEX pricing'],
    path: '/pricing',
  }),

  blog: () => generatePageMetadata({
    title: 'Blog - AI News, Tutorials & Updates | CODEEX',
    description: 'CODEEX blog: Latest AI news, tutorials, model comparisons, tips & tricks. Learn about Groq, Gemini, Cerebras, and more. Stay updated with AI technology.',
    keywords: ['ai blog', 'ai news', 'ai tutorials', 'model comparisons', 'CODEEX blog'],
    path: '/blog',
  }),

  careers: () => generatePageMetadata({
    title: 'Careers - Join CODEEX Team | CODEEX',
    description: 'Join CODEEX team. Work on cutting-edge AI technology. Help democratize AI education. Remote-friendly startup founded by 16-year-old developer.',
    keywords: ['ai careers', 'startup jobs', 'remote work', 'ai developer jobs', 'CODEEX careers'],
    path: '/careers',
  }),

  integrations: () => generatePageMetadata({
    title: 'Integrations - API & Third-Party Tools | CODEEX',
    description: 'CODEEX integrations: REST API, webhooks, browser extensions, mobile apps. Integrate 35+ AI models into your applications. Free API access.',
    keywords: ['api integration', 'webhooks', 'browser extension', 'mobile app', 'CODEEX api'],
    path: '/integrations',
  }),

  support: () => generatePageMetadata({
    title: 'Support - Help Center & FAQs | CODEEX',
    description: 'CODEEX support center. Find answers to common questions, troubleshooting guides, tutorials, and contact information. Get help with AI models.',
    keywords: ['support', 'help center', 'faq', 'troubleshooting', 'CODEEX support'],
    path: '/support',
  }),

  visualMath: () => generatePageMetadata({
    title: 'Visual Math Solver - Solve Equations from Images | CODEEX',
    description: 'Upload math equation images and get instant solutions. CODEEX visual math solver uses AI to recognize and solve equations with step-by-step explanations.',
    keywords: ['math solver', 'image equation solver', 'visual math', 'ai math', 'CODEEX math'],
    path: '/visual-math',
  }),

  pdfAnalyzer: () => generatePageMetadata({
    title: 'PDF Analyzer - AI-Powered Document Analysis | CODEEX',
    description: 'Analyze PDF documents with AI. Upload PDFs up to 5MB, ask questions, get summaries. CODEEX PDF analyzer extracts insights from your documents.',
    keywords: ['pdf analyzer', 'document analysis', 'pdf ai', 'document reader', 'CODEEX pdf'],
    path: '/pdf-analyzer',
  }),
};
