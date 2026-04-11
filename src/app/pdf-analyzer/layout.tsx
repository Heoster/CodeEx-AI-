import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'PDF Analyzer | SOHAM - Ask Questions About Documents',
  description:
    'Analyze PDF documents with AI, summarize files, extract insights, and ask natural-language questions about document content.',
  alternates: {
    canonical: 'https://soham-ai.vercel.app/pdf-analyzer',
  },
  openGraph: {
    title: 'PDF Analyzer | SOHAM - Ask Questions About Documents',
    description:
      'Analyze PDF documents with AI, summarize files, extract insights, and ask natural-language questions about document content.',
    url: 'https://soham-ai.vercel.app/pdf-analyzer',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM PDF analyzer',
      },
    ],
  },
};

export default function PdfAnalyzerLayout({children}: {children: React.ReactNode}) {
  return children;
}
