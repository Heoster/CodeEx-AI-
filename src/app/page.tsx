import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { LandingPageShell } from '@/components/landing/landing-page-shell';
import { StructuredData } from '@/components/seo/structured-data';
import { pageSEO } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: pageSEO.home.title,
  description: pageSEO.home.description,
  keywords: pageSEO.home.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app' },
  openGraph: {
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    url: 'https://soham-ai.vercel.app',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM - Free AI Chat Platform with 35+ Models' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

function detectMobile(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
}

export default function HomePage() {
  const userAgent = headers().get('user-agent') || '';
  const isMobile = detectMobile(userAgent);

  return (
    <>
      <StructuredData type="faq" />
      <LandingPageShell isMobile={isMobile} />
    </>
  );
}
