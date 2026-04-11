import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Services | SOHAM - PDF Analyzer, Image Math Solver, AI Chat',
  description:
    'Open SOHAM AI services including PDF analyzer, image math solver, and AI chat from one dashboard.',
  alternates: {
    canonical: 'https://soham-ai.vercel.app/ai-services',
  },
  openGraph: {
    title: 'AI Services | SOHAM - PDF Analyzer, Image Math Solver, AI Chat',
    description:
      'Open SOHAM AI services including PDF analyzer, image math solver, and AI chat from one dashboard.',
    url: 'https://soham-ai.vercel.app/ai-services',
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
};

export default function AiServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
