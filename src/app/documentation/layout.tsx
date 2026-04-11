import type {Metadata} from 'next';
import DocLayout from '@/components/documentation/doc-layout';

export const metadata: Metadata = {
  title: 'AI Documentation | SOHAM - Chat, PDF Analysis, Math Solver',
  description:
    'Read SOHAM documentation for AI chat, model selection, PDF analysis, image math solving, commands, and product setup.',
  alternates: {
    canonical: 'https://soham-ai.vercel.app/documentation',
  },
  openGraph: {
    title: 'AI Documentation | SOHAM - Chat, PDF Analysis, Math Solver',
    description:
      'Read SOHAM documentation for AI chat, model selection, PDF analysis, image math solving, commands, and product setup.',
    url: 'https://soham-ai.vercel.app/documentation',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM documentation and AI product guides',
      },
    ],
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout>{children}</DocLayout>;
}
