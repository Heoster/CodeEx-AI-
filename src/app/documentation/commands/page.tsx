'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Terminal,
  Search,
  Calculator,
  FileText,
  ArrowRight,
  Lightbulb,
  Zap,
  CheckCircle,
  Code2,
  Globe,
} from 'lucide-react';

const commands = [
  {
    cmd: '/solve',
    icon: Calculator,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    badge: 'Math & Logic',
    badgeVariant: 'secondary' as const,
    description: 'Solve math problems, coding challenges, and logical puzzles step-by-step.',
    syntax: '/solve <problem>',
    examples: [
      { input: '/solve integrate x^2 * sin(x) dx', output: 'Step-by-step integration by parts with LaTeX rendering' },
      { input: '/solve find the time complexity of bubble sort', output: 'O(n²) worst/average, O(n) best — with explanation' },
      { input: '/solve two trains 300km apart approach at 60 and 90 km/h, when do they meet?', output: 'Full working: t = 300 / (60+90) = 2 hours' },
      { input: '/solve debug this Python: for i in range(10) print(i)', output: 'Missing colon after range(10) — corrected code provided' },
    ],
    tips: [
      'Include units for physics problems (e.g., "60 km/h")',
      'Paste code snippets directly after /solve for debugging',
      'Works with LaTeX notation: /solve \\int_0^1 x^2 dx',
      'Ask for a specific method: /solve using dynamic programming...',
    ],
    whenToUse: 'Use /solve when you need structured, step-by-step working — not just an answer. It forces SOHAM into problem-solving mode.',
  },
  {
    cmd: '/search',
    icon: Search,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    badge: 'Web Search',
    badgeVariant: 'secondary' as const,
    description: 'Trigger a live DuckDuckGo web search and get summarised, up-to-date results.',
    syntax: '/search <query>',
    examples: [
      { input: '/search latest Next.js 15 features', output: 'Live results: React 19, Turbopack stable, improved caching...' },
      { input: '/search best free vector databases 2025', output: 'Ranked list: Qdrant, Weaviate, Chroma — with pros/cons' },
      { input: '/search India vs Australia cricket score today', output: 'Real-time score from live web results' },
      { input: '/search how to fix CORS error in Express.js', output: 'Top solutions with code snippets from current docs' },
    ],
    tips: [
      'SOHAM also auto-triggers search for time-sensitive questions — /search forces it',
      'Combine with follow-ups: "/search X" then "now summarize the third result"',
      'Use for current events, prices, scores, or anything that changes frequently',
      'Quotes work: /search "exact phrase" site:github.com',
    ],
    whenToUse: 'Use /search when you need real-time or recent information that the AI model may not have in its training data.',
  },
  {
    cmd: '/summarize',
    icon: FileText,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    badge: 'Text Condensation',
    badgeVariant: 'secondary' as const,
    description: 'Condense long text, articles, or pasted content into clear, structured summaries.',
    syntax: '/summarize <text or URL>',
    examples: [
      { input: '/summarize [paste 2000-word article]', output: '5-bullet executive summary with key takeaways' },
      { input: '/summarize in 3 sentences: [research abstract]', output: 'Concise 3-sentence distillation' },
      { input: '/summarize as bullet points: [meeting transcript]', output: 'Action items and decisions in bullet format' },
      { input: '/summarize for a 10-year-old: [technical doc]', output: 'Plain-language explanation with analogies' },
    ],
    tips: [
      'Specify format: "as bullet points", "in 3 sentences", "as a table"',
      'Specify audience: "for a beginner", "for a CEO", "for a developer"',
      'Works great after /search — summarize the results you just got',
      'Paste PDF text here if you want a quick summary without uploading',
    ],
    whenToUse: 'Use /summarize when you have a wall of text and need the key points fast. Especially useful for research papers, articles, and meeting notes.',
  },
];

const scenarios = [
  {
    title: 'Research → Understand → Apply',
    steps: [
      { cmd: '/search', text: 'transformer architecture 2024 improvements' },
      { cmd: '/summarize', text: 'the search results above as bullet points' },
      { cmd: '/solve', text: 'implement a simple self-attention mechanism in Python' },
    ],
  },
  {
    title: 'Debug a Production Issue',
    steps: [
      { cmd: '/search', text: 'Next.js 15 hydration error boundary fix' },
      { cmd: '/solve', text: 'my component throws: "Text content does not match server-rendered HTML"' },
      { cmd: '/summarize', text: 'the fix in one paragraph for my team' },
    ],
  },
  {
    title: 'Exam Prep',
    steps: [
      { cmd: '/solve', text: 'explain the difference between BFS and DFS with examples' },
      { cmd: '/solve', text: 'give me 3 practice problems on graph traversal' },
      { cmd: '/summarize', text: 'everything we covered into a cheat sheet' },
    ],
  },
];

export default function CommandsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-medium">Slash Commands</span>
          <Badge variant="secondary" className="text-xs">3 commands</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Slash Commands Reference</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Prefix your message with a slash command to activate a specific SOHAM capability.
          Commands give you precise control over how the AI responds.
        </p>
      </div>

      {/* Quick reference */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-primary" />
            Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {commands.map(({ cmd, icon: Icon, color, description }) => (
              <div key={cmd} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                <div>
                  <code className="text-sm font-bold">{cmd}</code>
                  <p className="text-xs text-muted-foreground mt-0.5">{description.split('.')[0]}.</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual command sections */}
      {commands.map(({ cmd, icon: Icon, color, bg, badge, description, syntax, examples, tips, whenToUse }) => (
        <div key={cmd} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{cmd}</h2>
                <Badge variant="secondary">{badge}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Syntax</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block rounded-lg bg-muted px-4 py-3 text-sm font-mono">{syntax}</code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {examples.map((ex, i) => (
                <div key={i} className="rounded-lg border overflow-hidden">
                  <div className="bg-muted/60 px-4 py-2 flex items-center gap-2">
                    <Code2 className="h-3 w-3 text-muted-foreground" />
                    <code className="text-xs font-mono text-foreground">{ex.input}</code>
                  </div>
                  <div className="px-4 py-2 flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{ex.output}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">When to use {cmd} vs natural language</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{whenToUse}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}

      {/* Real-world scenarios */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Real-World Scenarios</h2>
        <p className="text-muted-foreground text-sm">
          Combine commands in sequence to tackle complex, multi-step tasks.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {scenarios.map((scenario) => (
            <Card key={scenario.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scenario.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                    <p className="text-xs text-muted-foreground">
                      <code className="font-semibold text-foreground">{step.cmd}</code> {step.text}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Natural language note */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-primary" />
            Commands vs Natural Language
          </CardTitle>
          <CardDescription>You don&apos;t always need a slash command</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            SOHAM&apos;s smart routing automatically detects intent from plain messages. Asking
            &quot;what&apos;s the weather in Delhi?&quot; will trigger a web search without needing{' '}
            <code>/search</code>. Commands are most useful when you want to be explicit or when
            auto-routing picks the wrong mode.
          </p>
          <p>
            Think of slash commands as <strong className="text-foreground">overrides</strong> — they
            guarantee a specific behaviour regardless of how the message reads.
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Try a command now</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Head to the chat and type <code className="bg-muted px-1.5 py-0.5 rounded">/solve</code>,{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded">/search</code>, or{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded">/summarize</code> followed by your query.
        </p>
        <Button asChild size="lg">
          <Link href="/chat">
            Open Chat <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
