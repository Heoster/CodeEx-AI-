'use client';

import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Search, Globe, Zap, Clock, Shield, CheckCircle, ArrowRight, Link as LinkIcon} from 'lucide-react';

export default function WebSearchDocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Search className="h-4 w-4 text-primary" />
          <span className="font-medium">Web Search</span>
          <Badge variant="secondary" className="text-xs">Auto</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Real-Time Web Search</h1>
        <p className="text-xl text-muted-foreground">
          SOHAM automatically searches the web when your question needs current information — no command
          required. Powered by DuckDuckGo with AI synthesis and source links.
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/chat">
          <Button size="lg" className="gap-2">
            <Search className="h-5 w-5" />
            Try Web Search
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* How it works */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            How Auto-Search Works
          </CardTitle>
          <CardDescription>
            SOHAM detects when your query needs live data and triggers search automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The intent detector scans every message for signals that require real-time data:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                {
                  label: 'Time-sensitive keywords',
                  examples: '"today", "latest", "current", "breaking", "this week"',
                },
                {
                  label: 'News & events',
                  examples: '"news", "headlines", "score", "weather", "forecast"',
                },
                {
                  label: 'Factual lookups',
                  examples: '"who is the CEO of...", "population of...", "capital of..."',
                },
                {
                  label: 'Price & market data',
                  examples: '"stock price", "how much does X cost", "exchange rate"',
                },
              ].map((s) => (
                <div key={s.label} className="bg-background/50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm">{s.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{s.examples}</p>
                </div>
              ))}
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ When search triggers, SOHAM fetches DuckDuckGo results, synthesizes them with AI, and
                appends numbered source links at the bottom of the response.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual command */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Manual Search Command</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <code className="bg-muted p-2 rounded font-mono text-sm font-bold shrink-0">/search</code>
              <div>
                <p className="font-medium">Force a web search for any query</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use this when you explicitly want web results, even for queries that wouldn't
                  auto-trigger search.
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    '/search latest developments in artificial intelligence 2026',
                    '/search how to deploy Next.js to Vercel step by step',
                    '/search Apple AAPL stock price today',
                    '/search best JavaScript frameworks comparison 2026',
                  ].map((ex) => (
                    <code key={ex} className="block bg-muted px-3 py-1.5 rounded text-xs">
                      {ex}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Search Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Clock,
              title: 'Real-Time Results',
              desc: 'DuckDuckGo provides fresh results — no stale cached data',
            },
            {
              icon: LinkIcon,
              title: 'Source Citations',
              desc: 'Every answer includes numbered links to original sources',
            },
            {
              icon: Shield,
              title: 'Privacy-Respecting',
              desc: 'DuckDuckGo doesn\'t track users — your searches stay private',
            },
            {
              icon: Globe,
              title: 'AI Synthesis',
              desc: 'Results from multiple sources are synthesized into a coherent answer',
            },
            {
              icon: Zap,
              title: 'Fallback Chain',
              desc: 'If DuckDuckGo fails, falls back to AI knowledge with a note',
            },
            {
              icon: Search,
              title: 'Auto-Detection',
              desc: 'No command needed — SOHAM detects when search is required',
            },
          ].map((f) => (
            <Card key={f.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <f.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example Queries That Trigger Search</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Current Events',
              query: 'What are the latest developments in space exploration?',
              note: 'Triggers on "latest" — fetches recent news from NASA, SpaceX, etc.',
            },
            {
              title: 'Factual Lookup',
              query: 'Who is the current CEO of OpenAI?',
              note: 'Triggers on "current" + "who is" — looks up live data',
            },
            {
              title: 'Market Data',
              query: 'What is the price of Bitcoin today?',
              note: 'Triggers on "price" + "today" — fetches current market data',
            },
            {
              title: 'Technical Tutorials',
              query: 'How do I deploy a Next.js app to Vercel in 2026?',
              note: 'Year reference triggers search for up-to-date guides',
            },
          ].map((ex) => (
            <Card key={ex.title}>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold">{ex.title}</h4>
                <div className="bg-muted p-3 rounded text-sm">"{ex.query}"</div>
                <p className="text-xs text-muted-foreground">💡 {ex.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">✅ For better results</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific: "latest React 19 features" vs "React features"</li>
                <li>• Include year for technical queries: "Next.js deployment 2026"</li>
                <li>• Ask follow-up questions to go deeper into results</li>
                <li>• Use /search explicitly when you always want web results</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">⚠️ Limitations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• DuckDuckGo may not index very niche or paywalled content</li>
                <li>• Real-time prices may have slight delays</li>
                <li>• If search fails, AI falls back to its training knowledge</li>
                <li>• Very recent events (last few hours) may not appear</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
