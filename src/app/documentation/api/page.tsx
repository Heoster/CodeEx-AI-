'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/app-config';
import {
  Code2,
  Copy,
  CheckCircle,
  MessageSquare,
  FileText,
  Search,
  ArrowRight,
  Github,
  AlertCircle,
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

const chatDirectExample = {
  request: `POST /api/chat-direct
Content-Type: application/json

{
  "message": "Explain how async/await works in JavaScript",
  "history": [
    {
      "role": "user",
      "content": "What are Promises?"
    },
    {
      "role": "assistant",
      "content": "Promises represent the eventual result of an async operation..."
    }
  ],
  "settings": {
    "model": "auto",
    "tone": "helpful",
    "technicalLevel": "intermediate"
  }
}`,
  response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "response": "async/await is syntactic sugar built on top of Promises...",
  "model": "llama-3.1-8b-instant",
  "provider": "groq"
}`,
};

const pdfAnalyzerExample = {
  request: `POST /api/ai/pdf-analyzer
Content-Type: multipart/form-data

file: <PDF binary, max 5MB>
query: "What are the main conclusions of this paper?"`,
  response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "answer": "The paper concludes that...",
  "pages": 12,
  "model": "gemini-2.5-flash"
}`,
};

const searchExample = {
  request: `POST /api/ai/search
Content-Type: application/json

{
  "query": "Next.js 15 new features"
}`,
  response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "results": [
    {
      "title": "Next.js 15 Release Notes",
      "url": "https://nextjs.org/blog/next-15",
      "snippet": "Next.js 15 introduces React 19 support, Turbopack..."
    }
  ],
  "summary": "Next.js 15 brings React 19 support, stable Turbopack..."
}`,
};

const endpoints = [
  {
    method: 'POST',
    path: '/api/chat-direct',
    icon: MessageSquare,
    title: 'Chat Direct',
    desc: 'Send a message to the AI and receive a response. Supports conversation history and per-request settings.',
    example: chatDirectExample,
    params: [
      { name: 'message',                  type: 'string',   required: true,  desc: 'The user\'s message' },
      { name: 'history',                  type: 'array',    required: false, desc: 'Previous messages [{role, content}]' },
      { name: 'settings.model',           type: 'string',   required: false, desc: '"auto" or a specific model ID' },
      { name: 'settings.tone',            type: 'string',   required: false, desc: '"helpful" | "formal" | "casual"' },
      { name: 'settings.technicalLevel',  type: 'string',   required: false, desc: '"beginner" | "intermediate" | "expert"' },
    ],
  },
  {
    method: 'POST',
    path: '/api/ai/pdf-analyzer',
    icon: FileText,
    title: 'PDF Analyzer',
    desc: 'Upload a PDF (up to 5MB) and ask a question about its contents. Send as multipart/form-data.',
    example: pdfAnalyzerExample,
    params: [
      { name: 'file',  type: 'File',   required: true,  desc: 'PDF file, max 5MB' },
      { name: 'query', type: 'string', required: true,  desc: 'Question to ask about the PDF' },
    ],
  },
  {
    method: 'POST',
    path: '/api/ai/search',
    icon: Search,
    title: 'Web Search',
    desc: 'Perform a DuckDuckGo web search and receive summarised results.',
    example: searchExample,
    params: [
      { name: 'query', type: 'string', required: true, desc: 'Search query string' },
    ],
  },
];

export default function ApiPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-medium">Internal API</span>
          <Badge variant="secondary" className="text-xs">Developer Docs</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Internal API reference for developers integrating with SOHAM or self-hosting the platform.
          Base URL: <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{APP_CONFIG.BASE_URL}</code>
        </p>
      </div>

      {/* No API key note */}
      <Card className="border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/10">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">No Public API Key System</p>
            <p className="text-sm text-muted-foreground">
              SOHAM does not currently offer a public API key system. These endpoints are used
              internally by the web app. For direct integration, use the web app at{' '}
              <a href={APP_CONFIG.BASE_URL} className="text-primary underline underline-offset-4">
                {APP_CONFIG.BASE_URL}
              </a>
              . For self-hosting, see the GitHub repository.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      {endpoints.map(({ method, path, icon: Icon, title, desc, example, params }) => (
        <div key={path} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Badge variant="secondary" className="font-mono">{method}</Badge>
                <code className="text-sm bg-muted px-2 py-0.5 rounded">{path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>

          {/* Parameters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="pb-2 text-left font-semibold text-xs text-muted-foreground">Name</th>
                      <th className="pb-2 text-left font-semibold text-xs text-muted-foreground">Type</th>
                      <th className="pb-2 text-left font-semibold text-xs text-muted-foreground">Required</th>
                      <th className="pb-2 text-left font-semibold text-xs text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {params.map((p) => (
                      <tr key={p.name}>
                        <td className="py-2 pr-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.name}</code></td>
                        <td className="py-2 pr-4 text-xs text-muted-foreground font-mono">{p.type}</td>
                        <td className="py-2 pr-4">
                          {p.required
                            ? <Badge variant="destructive" className="text-xs">required</Badge>
                            : <Badge variant="outline" className="text-xs">optional</Badge>}
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Request / Response */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Request</CardTitle>
                  <CopyButton text={example.request} />
                </div>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{example.request}</pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Response</CardTitle>
                  <CopyButton text={example.response} />
                </div>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-muted px-4 py-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{example.response}</pre>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}

      {/* Self-hosting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Github className="h-4 w-4" />
            Self-Hosting
          </CardTitle>
          <CardDescription>SOHAM is open-source and self-hostable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clone the repository, add your own API keys for Groq, HuggingFace, and Google AI in{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded">.env.local</code>, and deploy to
            Vercel, Netlify, or any Node.js host.
          </p>
          <div className="rounded-lg bg-muted px-4 py-3 font-mono text-sm space-y-1">
            <p>git clone https://github.com/heoster/soham-ai</p>
            <p>cd soham-ai</p>
            <p>cp .env.local.example .env.local</p>
            <p>npm install && npm run dev</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm">
              <a href={APP_CONFIG.DEVELOPER.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> View on GitHub
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href="/documentation/quick-start">
                Quick Start <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
