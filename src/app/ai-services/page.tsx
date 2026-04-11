'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calculator, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/hooks/use-auth';

const services = [
  {
    title: 'PDF Analyzer',
    description:
      'Upload a PDF, ask questions, extract summaries, and analyze long documents with SOHAM.',
    href: '/pdf-analyzer',
    icon: FileText,
    cta: 'Open PDF Analyzer',
  },
  {
    title: 'Image Math Solver',
    description:
      'Upload handwritten or printed equations and get recognition plus step-by-step solutions.',
    href: '/visual-math',
    icon: Calculator,
    cta: 'Open Math Solver',
  },
  {
    title: 'AI Chat',
    description:
      'Use the main chat workspace for reasoning, coding, web-assisted answers, and general workflows.',
    href: '/chat',
    icon: MessageSquare,
    cta: 'Open Chat',
  },
];

export default function AiServicesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader backLink="/chat" backText="Back to Chat" title="AI Services" />

        <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_30%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                SOHAM by CODEEX-AI
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">AI Services Dashboard</h1>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                  Access SOHAM&apos;s focused tools from one place. Open the PDF analyzer for documents,
                  the image math solver for equations, or jump back into AI chat for broader tasks.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/pdf-analyzer">Analyze a PDF</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/visual-math">Solve From Image</Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-3xl border bg-background/80 p-6 shadow-sm md:h-44 md:w-44">
              <Image
                src="/FINALSOHAM.png"
                alt="SOHAM logo"
                width={160}
                height={160}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>
        </section>

          <section className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card key={service.href} className="rounded-3xl border-border/70">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full justify-between">
                    <Link href={service.href}>
                      {service.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
