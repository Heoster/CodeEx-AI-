import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
  Zap,
  MessageSquare,
  Settings,
  Mic,
  Calculator,
  Search,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Image,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quick Start | SOHAM Documentation',
  description:
    'Get started with SOHAM in 3 minutes. Learn how to chat, configure settings, use slash commands, and explore AI features.',
};

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-medium">Quick Start Guide</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Get Started in 3 Minutes</h1>
        <p className="text-xl text-muted-foreground">
          SOHAM requires no signup. Open chat, type your question, and the AI picks the best model
          automatically. Here's everything you need to know to get the most out of it.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Step-by-Step Setup</h2>

        <StepCard step={1} title="Open the Chat Interface" icon={MessageSquare}>
          <p className="text-sm text-muted-foreground mb-3">
            Navigate to{' '}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">
              https://soham-ai.vercel.app/chat
            </code>{' '}
            or click the Chat button from the homepage. No account needed.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-3">
            <p className="text-sm font-medium mb-2">Try these first prompts:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• "Explain how React hooks work with an example"</li>
              <li>• "Write a Python function to reverse a linked list"</li>
              <li>• "What's the latest news in AI today?" (triggers web search)</li>
              <li>• "Solve x² + 5x + 6 = 0 step by step"</li>
            </ul>
          </div>
          <Link href="/chat">
            <Button size="sm">
              Open Chat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </StepCard>

        <StepCard step={2} title="Configure Your Preferences" icon={Settings}>
          <p className="text-sm text-muted-foreground mb-3">
            Click the settings icon (⚙️) in the header to customize your experience:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                title: 'AI Model',
                desc: 'Leave on "Auto" — SOHAM picks the best model per query. Or choose manually from 13+ options.',
              },
              {
                title: 'Response Tone',
                desc: 'Helpful (default), Formal, or Casual. Affects how the AI phrases answers.',
              },
              {
                title: 'Technical Level',
                desc: 'Beginner, Intermediate, or Expert. Controls explanation depth and jargon.',
              },
              {
                title: 'Voice (TTS)',
                desc: 'Enable speech output and pick a voice: troy, diana, hannah, autumn, austin, or daniel.',
              },
            ].map((s) => (
              <div key={s.title} className="bg-muted/50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">{s.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </StepCard>

        <StepCard step={3} title="Try Slash Commands" icon={Sparkles}>
          <p className="text-sm text-muted-foreground mb-3">
            Slash commands route your query to a specialized pipeline for better results:
          </p>
          <div className="space-y-3">
            {[
              {
                cmd: '/solve',
                desc: 'Math, coding, logic problems',
                ex: '/solve ∫(2x³ - 5x + 1)dx',
              },
              {
                cmd: '/search',
                desc: 'Real-time web search with source links',
                ex: '/search latest Next.js 15 features',
              },
              {
                cmd: '/summarize',
                desc: 'Condense long text into key points',
                ex: '/summarize [paste article here]',
              },
            ].map((c) => (
              <div key={c.cmd} className="border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-1">
                  <code className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-sm">
                    {c.cmd}
                  </code>
                  <span className="text-sm text-muted-foreground">{c.desc}</span>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded block">{c.ex}</code>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 You don't always need slash commands. Asking "what's the weather in Tokyo?" or
              "who is the CEO of OpenAI?" automatically triggers web search.
            </p>
          </div>
        </StepCard>

        <StepCard step={4} title="Explore AI Services" icon={Image}>
          <p className="text-sm text-muted-foreground mb-3">
            Beyond chat, SOHAM has dedicated tools at{' '}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">/ai-services</code>:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {icon: FileText, title: 'PDF Analyzer', desc: 'Upload PDFs up to 5 MB and ask questions'},
              {icon: Calculator, title: 'Visual Math', desc: 'Upload equation photos for step-by-step solutions'},
              {icon: Image, title: 'Image Generation', desc: 'Generate images with HuggingFace FLUX.1'},
              {icon: Search, title: 'Web Search', desc: 'Dedicated search with DuckDuckGo + AI synthesis'},
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <f.icon className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">{f.title}</h4>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/ai-services">
              <Button size="sm" variant="outline">
                Open AI Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </StepCard>
      </div>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Quick Start Checklist
          </CardTitle>
          <CardDescription>Complete these to get the full SOHAM experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'Sent your first message in the chat interface',
              'Configured AI model, tone, and technical level in settings',
              'Tried a slash command (/solve, /search, or /summarize)',
              'Explored the AI Services dashboard (/ai-services)',
              'Installed SOHAM as a PWA on your phone or desktop',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border-2 border-muted-foreground shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What's Next?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'AI Models Guide',
              desc: 'Learn about all 13+ models and when to use each',
              href: '/documentation/ai-models',
              icon: Sparkles,
            },
            {
              title: 'Commands Reference',
              desc: 'Master every slash command with real examples',
              href: '/documentation/commands',
              icon: Calculator,
            },
            {
              title: 'Install as Mobile App',
              desc: 'Add SOHAM to your home screen (Android & iOS)',
              href: '/documentation/installation',
              icon: Settings,
            },
            {
              title: 'Voice Features',
              desc: 'Set up Groq Whisper STT and Orpheus TTS',
              href: '/documentation/chat',
              icon: Mic,
            },
          ].map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <card.icon className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
            {step}
          </div>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
