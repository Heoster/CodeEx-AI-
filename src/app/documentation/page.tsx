'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Smartphone
} from 'lucide-react';

export default function DocsHomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">Complete Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to CodeEx AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your intelligent multi-model assistant for coding, learning, math, and creative tasks. 
          Get started with our comprehensive guides and tutorials.
        </p>
        
        {/* App URLs Section */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
          <h3 className="text-sm font-semibold mb-2">🔗 Quick Access URLs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="text-left">
              <span className="font-medium">Main App:</span>
              <code className="ml-2 px-2 py-1 bg-background rounded text-xs">
                https://codeex-ai.vercel.app
              </code>
            </div>
            <div className="text-left">
              <span className="font-medium">Chat Interface:</span>
              <code className="ml-2 px-2 py-1 bg-background rounded text-xs">
                https://codeex-ai.vercel.app/chat
              </code>
            </div>
            <div className="text-left">
              <span className="font-medium">Smart Notes Pro:</span>
              <code className="ml-2 px-2 py-1 bg-background rounded text-xs">
                https://codeex-ai.vercel.app/smart-notes
              </code>
            </div>
            <div className="text-left">
              <span className="font-medium">Math Solver:</span>
              <code className="ml-2 px-2 py-1 bg-background rounded text-xs">
                https://codeex-ai.vercel.app/visual-math
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickStartCard
          title="Quick Start"
          description="Get up and running in minutes"
          icon={Zap}
          href="/docs/quick-start"
          badge="Start Here"
        />
        <QuickStartCard
          title="AI Models"
          description="13+ models for different tasks"
          icon={Cpu}
          href="/docs/ai-models"
        />
        <QuickStartCard
          title="Chat Interface"
          description="Conversational AI features"
          icon={MessageSquare}
          href="/docs/chat"
        />
      </div>

      {/* Feature Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Smart Notes Pro"
            description="AI-powered research notes with 18+ sources and image support"
            icon={FileText}
            href="/docs/smart-notes"
            badge="New"
          />
          <FeatureCard
            title="Smart Auto-Routing"
            description="Automatically selects the best AI model for your query"
            icon={Sparkles}
            href="/docs/smart-routing"
          />
          <FeatureCard
            title="Image Generation"
            description="Create AI art with 5 free generations daily"
            icon={Image}
            href="/docs/image-generation"
          />
          <FeatureCard
            title="PDF Analysis"
            description="Analyze and extract insights from documents"
            icon={FileText}
            href="/docs/pdf-analysis"
          />
          <FeatureCard
            title="Math Solver"
            description="Solve equations with step-by-step explanations"
            icon={Calculator}
            href="/docs/math-solver"
          />
          <FeatureCard
            title="Web Search"
            description="Get real-time information with citations"
            icon={Search}
            href="/docs/web-search"
          />
        </div>
      </div>

      {/* Popular Guides */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Guides</h2>
        <div className="grid gap-4">
          <GuideCard
            title="Smart Notes Pro Guide"
            description="Generate comprehensive research notes with AI agents and 18+ sources"
            href="/docs/smart-notes"
            icon={FileText}
          />
          <GuideCard
            title="Installing as Mobile App"
            description="Learn how to install CodeEx AI as a PWA on your Android device"
            href="/docs/installation"
            icon={Smartphone}
          />
          <GuideCard
            title="Using Slash Commands"
            description="Master /solve, /search, and /summarize commands for better productivity"
            href="/docs/commands"
            icon={Code}
          />
          <GuideCard
            title="Model Selection Guide"
            description="Choose the right AI model for your specific tasks and needs"
            href="/docs/ai-models"
            icon={Cpu}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Start?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Jump into the chat interface and start experiencing the power of multi-model AI assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg">
              Start Chatting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs/quick-start">
            <Button size="lg" variant="outline">
              Read Quick Start
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickStartCard({
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
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
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
            <Icon className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

function GuideCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}