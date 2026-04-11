import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AI Features | SOHAM - 35+ Models, Voice, PDF Analysis',
  description:
    'Explore SOHAM features including AI chat, PDF analysis, image math solving, voice interaction, multi-model routing, and smart search.',
  alternates: {
    canonical: 'https://soham-ai.vercel.app/features',
  },
  openGraph: {
    title: 'AI Features | SOHAM - 35+ Models, Voice, PDF Analysis',
    description:
      'Explore SOHAM features including AI chat, PDF analysis, image math solving, voice interaction, multi-model routing, and smart search.',
    url: 'https://soham-ai.vercel.app/features',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM AI features overview',
      },
    ],
  },
};

export default function FeaturesLayout({children}: {children: React.ReactNode}) {
  return children;
}
