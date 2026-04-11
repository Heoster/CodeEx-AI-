import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | SOHAM - 100% Free AI Platform Forever',
  description: 'SOHAM is completely free forever. Access 35+ AI models, PDF analysis, image math solver, voice features, and web search at zero cost. No credit card required.',
  keywords: ['free ai', 'free chatgpt alternative', 'free ai platform', 'SOHAM pricing', 'free ai no signup', 'free llm'],
  alternates: { canonical: 'https://soham-ai.vercel.app/pricing' },
  openGraph: {
    title: 'Pricing | SOHAM - 100% Free AI Platform Forever',
    description: 'SOHAM is completely free forever. 35+ AI models at zero cost.',
    url: 'https://soham-ai.vercel.app/pricing',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM Free Pricing' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | SOHAM - 100% Free AI Platform Forever',
    description: 'SOHAM is completely free forever. 35+ AI models at zero cost.',
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
