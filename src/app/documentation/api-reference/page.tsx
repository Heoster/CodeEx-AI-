'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/app-config';
import {
  Link2,
  Copy,
  CheckCircle,
  Code2,
  Globe,
  ArrowRight,
  ExternalLink,
  FileText,
  MessageSquare,
  ImageIcon,
  Search,
} from 'lucide-react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {copied ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

const appUrls = [
  { label: 'Chat',          path: APP_CONFIG.FEATURES.chat,         desc: 'Main AI chat interface' },
  { label: 'AI Services',   path: APP_CONFIG.FEATURES.aiServices,   desc: 'Image generation & AI tools' },
  { label: 'Visual Math',   path: APP_CONFIG.FEATURES.mathSolver,   desc: 'Math problem solver with visual output' },
  { label: 'PDF Analyzer',  path: APP_CONFIG.FEATURES.pdfAnalyzer,  desc: 'Upload and query PDF documents' },
  { label: 'Account',       path: APP_CONFIG.FEATURES.memoryDashboard, desc: 'Memory dashboard & user settings' },
];

const docUrls = [
  { label: 'Documentation Home', path: APP_CONFIG.DOCS.base },
  { label: 'Quick Start',        path: APP_CONFIG.DOCS.quickStart },
  { label: 'AI Models',          path: APP_CONFIG.DOCS.aiModels },
  { label: 'Commands',           path: APP_CONFIG.DOCS.commands },
  { label: 'Chat Guide',         path: APP_CONFIG.DOCS.chat },
  { label: 'Settings',           path: APP_CONFIG.DOCS.settings },
  { label: 'FAQ',                path: APP_CONFIG.DOCS.faq },
];

const apiEndpoints = [
  {
    method: 'POST',
    path: '/api/chat-direct',
    icon: MessageSquare,
    desc: 'Send a message and receive an AI response. Supports model selection, tone, and conversation history.',
    body: `{
  "message": "Explain recursion",
  "history": [],
  "settings": {
    "model": "auto",
    "tone": "helpful",
    "technicalLevel": "intermediate"
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/ai/pdf-analyzer',
    icon: FileText,
    desc: 'Analyze a PDF file with a natural language query. Send as multipart/form-data.',
    body: `FormData:
  file: <PDF file, max 5MB>
  query: "Summarize the key findings"`,
  },
  {
    method: 'POST',
    path: '/api/ai/image-solver',
    icon: ImageIcon,
    desc: 'Analyze an image and answer questions about it.',
    body: `{
  "imageBase64": "<base64 encoded image>",
  "query": "What is shown in this image?"
}`,
  },
  {
    method: 'POST',
    path: '/api/ai/search',
    icon: Search,
    desc: 'Perform a web search via DuckDuckGo and return summarised results.',
    body: `{
  "query": "latest AI news 2025"
}`,
  },
];

export default function ApiReferencePage() {
  const base = APP_CONFIG.BASE_URL;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Link2 className="h-4 w-4 text-primary" />
          <span className="font-medium">App URLs & API Reference</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          All public URLs, feature routes, documentation links, and API endpoints for SOHAM.
          Base URL: <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{base}</code>
        </p>
      </div>

      {/* App URLs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">App Feature URLs</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="divide-y">
              {appUrls.map(({ label, path, desc }) => {
                const full = `${base}${path}`;
                return (
                  <div key={path} className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{label}</p>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{path}</code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <CopyButton text={full} />
                      <Button asChild size="sm" variant="ghost" className="h-7 px-2">
                        <Link href={path} target="_blank">
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation URLs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Documentation URLs</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-2 sm:grid-cols-2">
              {docUrls.map(({ label, path }) => {
                const full = `${base}${path}`;
                return (
                  <div key={path} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <code className="text-xs truncate">{path}</code>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <CopyButton text={full} />
                      <Button asChild size="sm" variant="ghost" className="h-6 px-1.5">
                        <Link href={path}>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">API Endpoints</h2>
        <p className="text-sm text-muted-foreground">
          These are the internal API routes used by the SOHAM frontend. They can also be called
          directly for integration purposes.
        </p>
        <div className="space-y-4">
          {apiEndpoints.map(({ method, path, icon: Icon, desc, body }) => {
            const full = `${base}${path}`;
            return (
              <Card key={path}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-mono">{method}</Badge>
                          <code className="text-sm font-semibold">{path}</code>
                        </div>
                        <CardDescription className="mt-0.5">{desc}</CardDescription>
                      </div>
                    </div>
                    <CopyButton text={full} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Request Body</p>
                  <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{body}</pre>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Integration examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Integration Examples</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="h-4 w-4 text-primary" />
                Link to Chat
              </CardTitle>
              <CardDescription>Direct link to open SOHAM chat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono overflow-x-auto">{`<a href="${base}/chat">
  Open SOHAM
</a>`}</pre>
              <CopyButton text={`<a href="${base}/chat">Open SOHAM</a>`} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Code2 className="h-4 w-4 text-primary" />
                Iframe Embed
              </CardTitle>
              <CardDescription>Embed SOHAM chat in your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`<iframe
  src="${base}/chat"
  width="400"
  height="600"
  frameborder="0"
/>`}</pre>
              <CopyButton text={`<iframe src="${base}/chat" width="400" height="600" frameborder="0" />`} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Note */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> There is no public API key system
            currently. Direct API integration is via the web app endpoints above. SOHAM is
            open-source — see the{' '}
            <a
              href={APP_CONFIG.DEVELOPER.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              GitHub repository
            </a>{' '}
            for self-hosting instructions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
