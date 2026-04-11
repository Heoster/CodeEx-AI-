import type { Metadata } from 'next';
import { pageSEO } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: pageSEO.contact.title,
  description: pageSEO.contact.description,
  keywords: pageSEO.contact.keywords,
  alternates: { canonical: 'https://soham-ai.vercel.app/contact' },
  openGraph: {
    title: pageSEO.contact.title,
    description: pageSEO.contact.description,
    url: 'https://soham-ai.vercel.app/contact',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'Contact SOHAM' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSEO.contact.title,
    description: pageSEO.contact.description,
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
