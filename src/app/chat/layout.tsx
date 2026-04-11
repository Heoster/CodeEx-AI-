import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AI Chat App | SOHAM - Free Chat, Coding Help, Smart Search',
  description:
    'Use SOHAM AI chat for coding help, smart search, reasoning, and multi-model responses with 35+ models and no signup required.',
  alternates: {
    canonical: 'https://soham-ai.vercel.app/chat',
  },
  openGraph: {
    title: 'AI Chat App | SOHAM - Free Chat, Coding Help, Smart Search',
    description:
      'Use SOHAM AI chat for coding help, smart search, reasoning, and multi-model responses with 35+ models and no signup required.',
    url: 'https://soham-ai.vercel.app/chat',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM AI chat interface',
      },
    ],
  },
};

export default function ChatLayout({children}: {children: React.ReactNode}) {
  return children;
}
