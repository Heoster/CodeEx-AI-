'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  MessageSquare, 
  Settings, 
  Mic, 
  Calculator,
  Search,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-medium">Quick Start Guide</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Get Started in 3 Minutes
        </h1>
        <p className="text-xl text-muted-foreground">
          Learn the basics of CodeEx AI and start having productive conversations with our multi-model assistant.
        </p>
      </div>

      {/* Step-by-step Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Step-by-Step Setup</h2>
        
        <div className="space-y-6">
          <StepCard
            step={1}
            title="Start Your First Chat"
            description="Navigate to the chat interface and begin your conversation"
            icon={MessageSquare}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click the chat button or navigate to <code className="bg-muted px-2 py-1 rounded">/chat</code> to open the conversation interface.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Try these example prompts:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• "Explain how React hooks work"</li>
                  <li>• "Write a Python function to sort a list"</li>
                  <li>• "What's the weather like today?" (uses web search)</li>
                </ul>
              </div>
              <Link href="/chat">
                <Button size="sm">
                  Open Chat Interface
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </StepCard>

          <StepCard
            step={2}
            title="Configure Your Preferences"
            description="Set up AI model, tone, and technical level preferences"
            icon={Settings}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click the settings icon (⚙️) to customize your experience:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm">AI Model</h4>
                  <p className="text-xs text-muted-foreground">Choose "Auto" for smart routing or select a specific model</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm">Response Tone</h4>
                  <p className="text-xs text-muted-foreground">Helpful, Formal, or Casual</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm">Technical Level</h4>
                  <p className="text-xs text-muted-foreground">Beginner, Intermediate, or Expert</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm">Theme</h4>
                  <p className="text-xs text-muted-foreground">Light, Dark, or System</p>
                </div>
              </div>
            </div>
          </StepCard>

          <StepCard
            step={3}
            title="Try Advanced Features"
            description="Explore slash commands, voice input, and specialized tools"
            icon={Sparkles}
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureBox
                  title="Slash Commands"
                  description="Use /solve, /search, /summarize for specific tasks"
                  icon={Calculator}
                />
                <FeatureBox
                  title="Voice Input"
                  description="Click the microphone for hands-free interaction"
                  icon={Mic}
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🎯 Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Set your model to "Auto" to let CodeEx AI automatically choose the best model for each query. 
                  Math questions go to math models, coding questions to coding models, and so on.
                </p>
              </div>
            </div>
          </StepCard>
        </div>
      </div>

      {/* Essential Commands */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Essential Commands</h2>
        <div className="grid gap-4">
          <CommandCard
            command="/solve"
            description="Solve math problems, coding challenges, or quiz questions"
            example="/solve x² + 5x + 6 = 0"
          />
          <CommandCard
            command="/search"
            description="Search the web for current information with citations"
            example="/search latest AI news"
          />
          <CommandCard
            command="/summarize"
            description="Condense long texts into key points"
            example="/summarize [paste your article here]"
          />
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">What's Next?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <NextStepCard
            title="Explore AI Models"
            description="Learn about our 13+ specialized models"
            href="/docs/ai-models"
            icon={Sparkles}
          />
          <NextStepCard
            title="Try AI Services"
            description="Use PDF analysis, image generation, and more"
            href="/docs/image-generation"
            icon={MessageSquare}
          />
          <NextStepCard
            title="Install Mobile App"
            description="Add CodeEx AI to your phone as a PWA"
            href="/docs/installation"
            icon={Settings}
          />
          <NextStepCard
            title="Master Commands"
            description="Learn all available slash commands"
            href="/docs/commands"
            icon={Calculator}
          />
        </div>
      </div>

      {/* Success Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Quick Start Checklist
          </CardTitle>
          <CardDescription>
            Complete these steps to get the most out of CodeEx AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ChecklistItem text="Had your first conversation in the chat interface" />
            <ChecklistItem text="Configured your preferred AI model and settings" />
            <ChecklistItem text="Tried a slash command (/solve, /search, or /summarize)" />
            <ChecklistItem text="Explored the AI Services dashboard" />
            <ChecklistItem text="Bookmarked CodeEx AI for easy access" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            {step}
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

function FeatureBox({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function CommandCard({
  command,
  description,
  example,
}: {
  command: string;
  description: string;
  example: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <code className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded">
              {command}
            </code>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="bg-muted p-3 rounded font-mono text-sm">
            {example}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NextStepCard({
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
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
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

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-4 w-4 rounded border-2 border-muted-foreground" />
      <span className="text-sm">{text}</span>
    </div>
  );
}