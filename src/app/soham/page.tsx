import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Boxes, BrainCircuit, Calculator, FileText, Globe, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DEVELOPER_INFO } from '@/lib/developer-info';

export const metadata: Metadata = {
  title: 'About SOHAM | Self Organising Hyper Adaptive Machine by CODEEX-AI',
  description:
    'Learn what SOHAM is, what the name means, how it works, and why CODEEX-AI built it as a multi-model AI product for chat, PDFs, and image math solving.',
  keywords: [
    'SOHAM',
    'soham',
    'Self Organising Hyper Adaptive Machine',
    'SOHAM by CODEEX-AI',
    'what is SOHAM',
    'about SOHAM',
    'AI product by CODEEX-AI',
  ],
  alternates: {
    canonical: 'https://soham-ai.vercel.app/soham',
  },
  openGraph: {
    title: 'About SOHAM | Self Organising Hyper Adaptive Machine by CODEEX-AI',
    description:
      'Learn what SOHAM is, what the name means, how it works, and why CODEEX-AI built it.',
    url: 'https://soham-ai.vercel.app/soham',
    images: [
      {
        url: 'https://soham-ai.vercel.app/FINALSOHAM.png',
        width: 1024,
        height: 1024,
        alt: 'SOHAM logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SOHAM | Self Organising Hyper Adaptive Machine by CODEEX-AI',
    description:
      'Learn what SOHAM is, what the name means, how it works, and why CODEEX-AI built it.',
    images: ['https://soham-ai.vercel.app/FINALSOHAM.png'],
  },
};

const capabilities = [
  {
    icon: MessageSquare,
    title: 'AI chat',
    description: 'Multi-model chat for coding, reasoning, learning, and general tasks.',
  },
  {
    icon: FileText,
    title: 'PDF analyzer',
    description: 'Upload a document, ask questions, extract insights, and summarize content.',
  },
  {
    icon: Calculator,
    title: 'Image math solver',
    description: 'Recognize printed or handwritten equations and solve them step by step.',
  },
  {
    icon: Globe,
    title: 'Web-assisted answers',
    description: 'Search-backed responses for current topics, citations, and real-world tasks.',
  },
];

export default function SohamPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader backLink="/" backText="Back to Home" title="About SOHAM" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SOHAM',
            alternateName: 'Self Organising Hyper Adaptive Machine',
            applicationCategory: 'Artificial Intelligence Platform',
            creator: {
              '@type': 'Organization',
              name: DEVELOPER_INFO.company.name,
            },
            brand: {
              '@type': 'Brand',
              name: 'SOHAM',
            },
            url: 'https://soham-ai.vercel.app/soham',
            image: 'https://soham-ai.vercel.app/FINALSOHAM.png',
            description:
              'SOHAM is the flagship multi-model AI product from CODEEX-AI for chat, PDF analysis, image math solving, and smart search.',
            featureList: ['AI chat', 'PDF analyzer', 'Image math solver', 'Multi-model routing', 'Voice support'],
          }),
        }}
      />

      <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-sm md:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,115,22,0.10),transparent_30%,rgba(132,204,22,0.12),transparent_68%,rgba(56,189,248,0.12))]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Boxes className="h-3.5 w-3.5 text-primary" />
                Product overview
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">SOHAM</h1>
                <p className="text-lg font-medium text-primary">Self Organising Hyper Adaptive Machine</p>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  SOHAM is the flagship AI product from <strong className="text-foreground">CODEEX-AI</strong>.
                  The name is inspired by a Sanskrit word, and the product is built to adapt across tasks instead of forcing
                  users into a single-model workflow.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/chat">
                    Launch SOHAM
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/ai-services">Open AI Services</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-[2rem] border bg-background/85 p-8 shadow-sm backdrop-blur">
                <Image
                  src="/FINALSOHAM.png"
                  alt="SOHAM logo"
                  width={260}
                  height={260}
                  className="h-auto w-[180px] md:w-[240px]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border bg-card p-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Why it exists
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              SOHAM was built to give users one practical interface for multiple AI jobs: conversation, coding, research,
              document analysis, equation solving, and tool-backed answers. It is a product problem first, not just a model demo.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The company behind it is <Link href="/about" className="font-medium text-foreground hover:underline">CODEEX-AI</Link>,
              founded by {DEVELOPER_INFO.name}. That separation matters: CODEEX-AI is the organization, and SOHAM is the platform users interact with.
            </p>
          </div>

          <div className="rounded-[2rem] border bg-card p-6">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Product positioning
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Company</p>
                <p className="mt-2 font-semibold">CODEEX-AI</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Product</p>
                <p className="mt-2 font-semibold">SOHAM</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Name meaning</p>
                <p className="mt-2 font-semibold">Self Organising Hyper Adaptive Machine</p>
              </div>
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Purpose</p>
                <p className="mt-2 font-semibold">Adaptive AI workspace for real tasks</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Core capabilities</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              SOHAM is structured around focused workflows instead of a single conversation box. That makes it easier to route tasks
              correctly and to expose dedicated tools where users need them.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.5rem] border bg-card p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border bg-card p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Use SOHAM</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Start with <Link href="/chat" className="font-medium text-foreground hover:underline">AI chat</Link>, use{' '}
            <Link href="/pdf-analyzer" className="font-medium text-foreground hover:underline">PDF Analyzer</Link> for documents,
            and open <Link href="/visual-math" className="font-medium text-foreground hover:underline">Image Math Solver</Link> for equation recognition.
            If you want the founder and company story, go to <Link href="/about" className="font-medium text-foreground hover:underline">About Heoster and CODEEX-AI</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
