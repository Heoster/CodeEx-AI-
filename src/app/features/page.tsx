'use client';

import { Metadata } from 'next';
import { 
  MessageSquare, 
  ScanLine, 
  Terminal, 
  Mic, 
  Library, 
  History, 
  Shield, 
  Search,
  Sparkles,
  Code,
  Calculator,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';

const coreFeatures = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Multi-Model AI Support',
    description: 'Choose from multiple AI models optimized for different tasks - coding, math, conversation, and more.',
    badge: 'New',
    color: 'text-blue-500',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Smart Auto-Routing',
    description: 'AI automatically selects the best model for your query, ensuring optimal responses every time.',
    badge: 'Smart',
    color: 'text-yellow-500',
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Coding Assistant',
    description: 'Get help with code generation, debugging, and explanations across multiple programming languages.',
    color: 'text-green-500',
  },
  {
    icon: <Calculator className="h-6 w-6" />,
    title: 'Math Solver',
    description: 'Solve complex mathematical problems with step-by-step solutions and LaTeX formatting.',
    color: 'text-purple-500',
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Web Search Integration',
    description: 'Get real-time information from the web with privacy-focused DuckDuckGo search.',
    badge: 'Privacy',
    color: 'text-orange-500',
  },
  {
    icon: <ScanLine className="h-6 w-6" />,
    title: 'Visual Problem Solver',
    description: 'Upload images of handwritten equations and get instant recognition and solutions.',
    color: 'text-pink-500',
  },
  {
    icon: <Mic className="h-6 w-6" />,
    title: 'Voice Interaction',
    description: 'Talk to the AI using voice commands and hear responses with text-to-speech.',
    color: 'text-indigo-500',
  },
  {
    icon: <Library className="h-6 w-6" />,
    title: 'Multi-Chat Management',
    description: 'Organize conversations into separate chats for different projects and topics.',
    color: 'text-cyan-500',
  },
  {
    icon: <History className="h-6 w-6" />,
    title: 'Persistent History',
    description: 'Your conversations are automatically saved locally, never lose your work.',
    color: 'text-teal-500',
  },
  {
    icon: <Terminal className="h-6 w-6" />,
    title: 'Slash Commands',
    description: 'Use powerful commands like /solve, /search, and /summarize for instant actions.',
    color: 'text-red-500',
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Mobile Optimized',
    description: 'Responsive design with touch-friendly controls and PWA support for offline use.',
    color: 'text-violet-500',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure Authentication',
    description: 'Firebase-powered authentication with email/password and Google sign-in.',
    color: 'text-emerald-500',
  },
];

const modelCategories = [
  {
    name: 'General Purpose',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Versatile models for everyday conversations and general queries',
    models: ['FLAN-T5 Base', 'BLOOM 560M', 'Qwen 2.5 72B', 'Llama 2 70B'],
  },
  {
    name: 'Coding',
    icon: <Code className="h-5 w-5" />,
    description: 'Specialized models for code generation and debugging',
    models: ['DeepSeek Coder 33B', 'WizardCoder Python 34B'],
  },
  {
    name: 'Mathematics',
    icon: <Calculator className="h-5 w-5" />,
    description: 'Models optimized for mathematical reasoning and problem solving',
    models: ['WizardMath 70B'],
  },
  {
    name: 'Conversation',
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Models fine-tuned for natural dialogue and chat',
    models: ['DialoGPT Large', 'BlenderBot 400M'],
  },
  {
    name: 'Multimodal',
    icon: <Globe className="h-5 w-5" />,
    description: 'Models that understand both text and images',
    models: ['BLIP-2', 'Kosmos-2'],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="Features"
      />
      
      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Powerful Features for
            <span className="block gradient-text">Modern AI Interaction</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            CODEEX AI combines cutting-edge AI models with an intuitive interface,
            giving you the tools you need to learn, create, and solve problems.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Model Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">AI Model Categories</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access multiple specialized AI models, each optimized for specific tasks.
            Our smart routing automatically selects the best model for your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.models.map((model, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Command System */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Powerful Slash Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  /solve
                </CardTitle>
                <CardDescription>
                  Solve mathematical problems and equations with step-by-step explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-sm bg-muted p-2 rounded block">
                  /solve x^2 + 5x - 6 = 0
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  /search
                </CardTitle>
                <CardDescription>
                  Search the web for real-time information with cited sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-sm bg-muted p-2 rounded block">
                  /search latest AI news
                </code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  /summarize
                </CardTitle>
                <CardDescription>
                  Get concise summaries of long texts and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-sm bg-muted p-2 rounded block">
                  /summarize [long text]
                </code>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12 border-t">
          <h2 className="text-3xl font-bold">Ready to Experience the Future?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start using CODEEX AI today and discover how intelligent AI assistance
            can transform your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-gradient">
                Get Started Free
              </Button>
            </Link>
            <Link href="/documentation">
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
