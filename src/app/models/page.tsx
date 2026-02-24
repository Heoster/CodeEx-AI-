'use client';

import { Metadata } from 'next';
import { 
  Sparkles, 
  Code, 
  Calculator, 
  MessageCircle, 
  Image as ImageIcon,
  Zap,
  CheckCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const modelCategories = [
  {
    name: 'General Purpose',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Versatile models for everyday conversations, general queries, and broad knowledge tasks',
    models: [
      {
        name: 'DialoGPT Medium',
        provider: 'Hugging Face',
        description: 'Free conversational model for natural dialogue',
        contextWindow: '1K tokens',
        features: ['Natural dialogue', 'Fast inference'],
        recommended: true,
      },
      {
        name: 'FLAN-T5 Base',
        provider: 'Hugging Face',
        description: 'Instruction-tuned model for general tasks',
        contextWindow: '512 tokens',
        features: ['Instruction following', 'Flexible'],
      },
      {
        name: 'Qwen 2.5 72B Instruct',
        provider: 'Hugging Face',
        description: 'Excellent at code generation, math, and multilingual support',
        contextWindow: '32K tokens',
        features: ['Multilingual', 'Code generation', 'Math reasoning'],
      },
      {
        name: 'Llama 2 70B',
        provider: 'Hugging Face',
        description: 'Strong general-purpose model with good analytical capabilities',
        contextWindow: '4K tokens',
        features: ['Open source', 'Strong analytics', 'Reliable'],
      },
    ],
  },
  {
    name: 'Coding',
    icon: <Code className="h-6 w-6" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Specialized models optimized for code generation, debugging, and technical explanations',
    models: [
      {
        name: 'DeepSeek Coder 33B',
        provider: 'Hugging Face',
        description: 'Superior code generation across multiple programming languages',
        contextWindow: '16K tokens',
        features: ['Multi-language', 'Code completion', 'Bug detection'],
        recommended: true,
      },
      {
        name: 'WizardCoder Python 34B',
        provider: 'Hugging Face',
        description: 'Python-focused coding assistant with excellent performance',
        contextWindow: '8K tokens',
        features: ['Python expert', 'Code optimization', 'Best practices'],
      },
    ],
  },
  {
    name: 'Mathematics',
    icon: <Calculator className="h-6 w-6" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Models fine-tuned for mathematical reasoning, problem solving, and step-by-step solutions',
    models: [
      {
        name: 'WizardMath 70B',
        provider: 'Hugging Face',
        description: 'Specialized in mathematical reasoning with step-by-step solutions',
        contextWindow: '8K tokens',
        features: ['Step-by-step', 'LaTeX formatting', 'Complex equations'],
        recommended: true,
      },
    ],
  },
  {
    name: 'Conversation',
    icon: <MessageCircle className="h-6 w-6" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Models optimized for natural dialogue, chat interactions, and conversational AI',
    models: [
      {
        name: 'DialoGPT Large',
        provider: 'Hugging Face',
        description: 'Optimized for engaging, natural conversations',
        contextWindow: '1K tokens',
        features: ['Natural dialogue', 'Context aware', 'Engaging responses'],
      },
      {
        name: 'BlenderBot 400M',
        provider: 'Hugging Face',
        description: 'Lightweight conversational model for chat applications',
        contextWindow: '512 tokens',
        features: ['Lightweight', 'Fast', 'Conversational'],
      },
    ],
  },
  {
    name: 'Multimodal',
    icon: <ImageIcon className="h-6 w-6" />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    description: 'Models that understand both text and images for visual problem solving',
    models: [
      {
        name: 'BLIP-2',
        provider: 'Hugging Face',
        description: 'Multimodal image understanding and captioning',
        contextWindow: '2K tokens',
        features: ['Image understanding', 'Captioning'],
        recommended: true,
      },
      {
        name: 'Kosmos-2',
        provider: 'Hugging Face',
        description: 'Vision and language model for multimodal tasks',
        contextWindow: '2K tokens',
        features: ['Vision + text', 'Object detection', 'Image captioning'],
      },
      {
        name: 'BLIP-2',
        provider: 'Hugging Face',
        description: 'Specialized in image understanding and description',
        contextWindow: '2K tokens',
        features: ['Image understanding', 'Visual QA', 'Captioning'],
      },
    ],
  },
];

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="AI Models"
      />
      
      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose the Right Model
            <span className="block gradient-text">for Every Task</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            CODEEX AI provides access to multiple specialized AI models from leading providers.
            Our smart auto-routing system automatically selects the best model for your query.
          </p>
        </div>

        {/* Auto-Routing Feature */}
        <Card className="mb-12 border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Smart Auto-Routing</CardTitle>
                <CardDescription>
                  Let AI choose the best model automatically
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Enable auto-routing in settings and our AI will analyze your query to select
              the most appropriate model. Coding questions go to coding models, math problems
              to math models, and so on.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Automatic Selection</p>
                  <p className="text-sm text-muted-foreground">No manual model switching needed</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Optimal Performance</p>
                  <p className="text-sm text-muted-foreground">Best model for each task</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Transparent</p>
                  <p className="text-sm text-muted-foreground">See which model was used</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Categories */}
        <div className="space-y-8">
          {modelCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${category.bgColor} ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.models.map((model, modelIndex) => (
                  <Card key={modelIndex} className={model.recommended ? 'border-primary/50' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {model.name}
                            {model.recommended && (
                              <Badge variant="default" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {model.provider}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {model.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Context: {model.contextWindow}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does auto-routing work?</AccordionTrigger>
              <AccordionContent>
                Our query classifier analyzes your message using pattern matching and keyword detection
                to determine the category (coding, math, conversation, etc.). It then selects the most
                appropriate model from that category. You&apos;ll see which model was used in the response.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I manually select a model?</AccordionTrigger>
              <AccordionContent>
                Yes! You can disable auto-routing in settings and manually select any available model.
                This is useful when you want to use a specific model for all your queries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Which models require API keys?</AccordionTrigger>
              <AccordionContent>
                Google AI models require a GOOGLE_GENAI_API_KEY. Hugging Face models require a
                HUGGINGFACE_API_KEY. OpenRouter models require an OPENROUTER_API_KEY. You can
                configure these in your environment variables.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What happens if a model is unavailable?</AccordionTrigger>
              <AccordionContent>
                If your selected model is unavailable, the system automatically falls back to an
                available model in the same category. If no models in that category are available,
                it falls back to the default general-purpose model.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6 py-12 border-t">
          <h2 className="text-3xl font-bold">Ready to Try Different Models?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sign in to access all available models and experience the power of
            specialized AI for every task.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-gradient">
                Get Started
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
