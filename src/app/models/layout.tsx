import type { Metadata } from 'next';
import { pageSEO } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: pageSEO.models.title,
  description: pageSEO.models.description,
  keywords: pageSEO.models.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/models' },
  openGraph: {
    title: pageSEO.models.title,
    description: pageSEO.models.description,
    url: 'https://soham-ai.vercel.app/models',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM AI Models' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.models.title,
    description: pageSEO.models.description,
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
