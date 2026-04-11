'use client';

import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
  Sparkles,
  Zap,
  Cpu,
  MessageSquare,
  Calculator,
  Search,
  FileText,
  Image,
  Code,
  ArrowRight,
  BookOpen,
  Smartphone,
  Mic,
  Volume2,
  Globe,
} from 'lucide-react';

export default function DocsHomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">SOHAM Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to SOHAM Docs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Everything you need to get the most out of SOHAM — the free, multi-model AI assistant built by
          Heoster (CODEEX-AI). Browse guides for chat, voice, image generation, PDF analysis, and more.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/chat">
            <Button size="lg">
              Open Chat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/documentation/quick-start">
            <Button size="lg" variant="outline">
              Quick Start Guide
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick access URLs */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Quick Access URLs
          </CardTitle>
          <CardDescription>Direct links to every major section of SOHAM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono">
            {[
              {label: 'Main App', url: 'https://soham-ai.vercel.app'},
              {label: 'Chat', url: 'https://soham-ai.vercel.app/chat'},
              {label: 'AI Services', url: 'https://soham-ai.vercel.app/ai-services'},
              {label: 'Visual Math', url: 'https://soham-ai.vercel.app/visual-math'},
              {label: 'PDF Analyzer', url: 'https://soham-ai.vercel.app/pdf-analyzer'},
              {label: 'Account', url: 'https://soham-ai.vercel.app/account'},
            ].map(({label, url}) => (
              <div key={url} className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
                <span className="text-muted-foreground shrink-0">{label}:</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start here */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Start Here</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickCard
            title="Quick Start"
            description="Get up and running in 3 minutes"
            icon={Zap}
            href="/documentation/quick-start"
            badge="Start Here"
          />
          <QuickCard
            title="AI Models"
            description="13+ models — Groq, Gemini, HuggingFace, OpenRouter"
            icon={Cpu}
            href="/documentation/ai-models"
          />
          <QuickCard
            title="Slash Commands"
            description="/solve, /search, /summarize — master them all"
            icon={Code}
            href="/documentation/commands"
          />
        </div>
      </div>

      {/* Core features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Chat Interface"
            description="Context-aware conversations, voice input, TTS, message sharing, and smart auto-routing"
            icon={MessageSquare}
            href="/documentation/chat"
          />
          <FeatureCard
            title="Web Search"
            description="Auto-triggered real-time search via DuckDuckGo — no command needed for current events"
            icon={Search}
            href="/documentation/web-search"
            badge="Auto"
          />
          <FeatureCard
            title="Image Generation"
            description="Generate images using HuggingFace FLUX.1-schnell directly from chat"
            icon={Image}
            href="/documentation/image-generation"
          />
          <FeatureCard
            title="PDF Analysis"
            description="Upload PDFs up to 5 MB and ask questions, get summaries, extract key data"
            icon={FileText}
            href="/documentation/pdf-analysis"
          />
          <FeatureCard
            title="Visual Math Solver"
            description="Upload a photo of an equation and get step-by-step solutions"
            icon={Calculator}
            href="/documentation/math-solver"
          />
          <FeatureCard
            title="Voice Features"
            description="Groq Whisper STT + Orpheus TTS with 6 voice options (troy, diana, hannah, autumn, austin, daniel)"
            icon={Mic}
            href="/documentation/chat"
          />
        </div>
      </div>

      {/* Popular guides */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Popular Guides</h2>
        <div className="grid gap-3">
          {[
            {
              title: 'Install SOHAM as a Mobile App (PWA)',
              description: 'Add SOHAM to your home screen on Android or iOS for a native app experience',
              href: '/documentation/installation',
              icon: Smartphone,
            },
            {
              title: 'Settings & Customization',
              description: 'Configure AI model, response tone, technical level, voice, and theme',
              href: '/documentation/settings',
              icon: Sparkles,
            },
            {
              title: 'API Reference & App URLs',
              description: 'All app URLs, REST API endpoints, and integration examples',
              href: '/documentation/api-reference',
              icon: Globe,
            },
            {
              title: 'FAQ & Troubleshooting',
              description: 'Answers to the most common questions about SOHAM features and issues',
              href: '/documentation/faq',
              icon: BookOpen,
            },
          ].map((guide) => (
            <Link key={guide.href} href={guide.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <guide.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          SOHAM is 100% free. No signup required. Just open chat and go.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg">
              Start Chatting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/documentation/quick-start">
            <Button size="lg" variant="outline">
              Read Quick Start
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickCard({
  title,
  description,
  icon: Icon,
  href,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
              </div>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
