import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & Voice Commands | SOHAM',
  description: 'Get support for SOHAM AI platform. Test voice commands, find help resources, and contact the team. Free AI assistant support.',
  keywords: ['SOHAM support', 'voice commands', 'AI help', 'SOHAM help', 'CODEEX-AI support'],
  alternates: { canonical: 'https://soham-ai.vercel.app/support' },
  openGraph: {
    title: 'Support & Voice Commands | SOHAM',
    description: 'Get support for SOHAM AI platform. Test voice commands and find help resources.',
    url: 'https://soham-ai.vercel.app/support',
    siteName: 'SOHAM',
    images: [{ url: 'https://soham-ai.vercel.app/Multi-Chat.png', width: 1200, height: 630, alt: 'SOHAM Support' }],
    type: 'website',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
