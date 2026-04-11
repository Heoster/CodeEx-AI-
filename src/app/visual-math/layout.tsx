import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Image Math Solver | SOHAM - Solve Equations from Images',
  description:
    'Upload handwritten or printed equations and let SOHAM solve math from images with step-by-step explanations.',
  alternates: {
    canonical: 'https://soham-ai.vercel.app/visual-math',
  },
  openGraph: {
    title: 'Image Math Solver | SOHAM - Solve Equations from Images',
    description:
      'Upload handwritten or printed equations and let SOHAM solve math from images with step-by-step explanations.',
    url: 'https://soham-ai.vercel.app/visual-math',
    images: [
      {
        url: 'https://soham-ai.vercel.app/an.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM image math solver',
      },
    ],
  },
};

export default function VisualMathLayout({children}: {children: React.ReactNode}) {
  return children;
}
