import type { Metadata } from 'next';
import { pageSEO } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: pageSEO.features.title,
  description: pageSEO.features.description,
  keywords: pageSEO.features.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/features' },
  openGraph: {
    title: pageSEO.features.title,
    description: pageSEO.features.description,
    url: 'https://soham-ai.vercel.app/features',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM AI Features' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.features.title,
    description: pageSEO.features.description,
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
