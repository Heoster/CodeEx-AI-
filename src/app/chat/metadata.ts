import type { Metadata } from 'next';
import { pageSEO } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: pageSEO.chat.title,
  description: pageSEO.chat.description,
  keywords: pageSEO.chat.keywords,
  alternates: {
    canonical: 'https://soham-ai.vercel.app/chat',
  },
  openGraph: {
    title: pageSEO.chat.title,
    description: pageSEO.chat.description,
    url: 'https://soham-ai.vercel.app/chat',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM AI Chat' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.chat.title,
    description: pageSEO.chat.description,
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};
