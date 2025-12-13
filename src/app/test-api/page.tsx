'use client';

import { ApiExamples } from '@/components/api-examples';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TestApiPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/chat" className="flex items-center gap-2 text-lg font-semibold hover:underline">
            <ArrowLeft className="h-5 w-5" />
            Back to Chat
          </Link>
          <h1 className="text-xl font-bold">API Testing</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Test CODEEX AI API Endpoints</h2>
            <p className="text-muted-foreground">
              Test all API endpoints with multi-provider fallback support
            </p>
          </div>
          <ApiExamples />
        </div>
      </main>
    </div>
  );
}
