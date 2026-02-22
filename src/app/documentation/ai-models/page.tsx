'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Code, 
  Calculator, 
  MessageSquare, 
  Image, 
  Sparkles,
  Zap,
  Globe,
  Settings,
  CheckCircle
} from 'lucide-react';

export default function AIModelsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Models Guide</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI Models & Selection
        </h1>
        <p className="text-xl text-muted-foreground">
          CodeEx AI supports 13+ specialized models from multiple providers. Learn how to choose the right model for your tasks.
        </p>
      </div>

      {/* Auto Mode */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Auto Mode (Recommended)
          </CardTitle>
          <CardDescription>
            Let CodeEx AI automatically select the best model for each query
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              When set to "Auto", CodeEx AI analyzes your query and routes it to the most appropriate model:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="bg-background/50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">🧮 Math Problems</h4>
                <p className="text-xs text-muted-foreground">Routes to math-specialized models</p>
              </div>
              <div className="bg-background/50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">💻 Code Questions</h4>
                <p className="text-xs text-muted-foreground">Uses coding-optimized models</p>
              </div>
              <div className="bg-background/50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">🖼️ Image Tasks</h4>
                <p className="text-xs text-muted-foreground">Selects multimodal models</p>
              </div>
              <div className="bg-background/50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">💬 General Chat</h4>
                <p className="text-xs text-muted-foreground">Picks conversational models</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Model Categories</h2>
        
        <div className="space-y-6">
          <ModelCategory
            title="General Purpose"
            icon={Sparkles}
            color="text-blue-500"
            description="Versatile models for everyday tasks and conversations"
            models={[
              { 
                name: 'Llama 3.1 8B Instant', 
                provider: 'Groq', 
                desc: 'Fast and efficient for general tasks',
                features: ['Fast response', 'Large context', 'Streaming support']
              },
              { 
                name: 'Llama 3.2 1B Instruct (Free)', 
                provider: 'HuggingFace', 
                desc: 'Compact and efficient - completely free',
                features: ['Free', 'Lightweight', 'Good performance'],
                free: true
              },
              { 
                name: 'Llama 3.1 70B Instruct (Free)', 
                provider: 'HuggingFace', 
                desc: 'Large and powerful - completely free',
                features: ['Free', 'High quality', 'Complex reasoning'],
                free: true
              },
              { 
                name: 'Qwen 2.5 7B Instruct (Free)', 
                provider: 'HuggingFace', 
                desc: 'Strong multilingual capabilities - completely free',
                features: ['Free', 'Multilingual', 'Code & math'],
                free: true
              },
            ]}
          />

          <ModelCategory
            title="Coding Specialists"
            icon={Code}
            color="text-green-500"
            description="Models optimized for programming and software development"
            models={[
              { 
                name: 'DeepSeek V3.2', 
                provider: 'HuggingFace', 
                desc: 'Advanced coding and reasoning model',
                features: ['Code generation', 'Debugging', 'Architecture advice']
              },
            ]}
          />

          <ModelCategory
            title="Conversational"
            icon={MessageSquare}
            color="text-orange-500"
            description="Models fine-tuned for natural dialogue and chat"
            models={[
              { 
                name: 'RNJ-1 Instruct', 
                provider: 'HuggingFace', 
                desc: 'Efficient conversational AI model',
                features: ['Natural dialogue', 'Context awareness', 'Personality']
              },
              { 
                name: 'Gemini 2.5 Flash Lite', 
                provider: 'Google', 
                desc: 'Lightweight conversational model',
                features: ['Fast responses', 'Casual chat', 'Helpful tone']
              },
            ]}
          />

          <ModelCategory
            title="Multimodal (Vision)"
            icon={Image}
            color="text-pink-500"
            description="Models that can understand and process images"
            models={[
              { 
                name: 'Gemini 2.5 Flash', 
                provider: 'Google', 
                desc: 'Latest multimodal model with vision capabilities',
                features: ['Image analysis', 'Visual Q&A', 'Large context']
              },
              { 
                name: 'Gemini Flash Latest', 
                provider: 'Google', 
                desc: 'Latest version with improved capabilities',
                features: ['Image understanding', 'Text + vision', 'Fast processing']
              },
            ]}
          />

          <ModelCategory
            title="Free Models"
            icon={Zap}
            color="text-purple-500"
            description="Completely free models with no usage limits"
            models={[
              { 
                name: 'OpenRouter Auto (Free)', 
                provider: 'OpenRouter', 
                desc: 'Automatically selects best free model',
                features: ['Auto selection', 'No limits', 'Multiple providers'],
                free: true
              },
            ]}
          />
        </div>
      </div>

      {/* How to Select */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            How to Select a Model
          </CardTitle>
          <CardDescription>
            Step-by-step guide to choosing and switching models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">Desktop</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    <span>Click the Settings icon (⚙️) in the header</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    <span>Find the "AI Model" dropdown</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    <span>Select "Auto" or choose a specific model</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">4.</span>
                    <span>Settings are saved automatically</span>
                  </li>
                </ol>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Mobile</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    <span>Tap the model button in the chat interface</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    <span>A bottom sheet opens with all models</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    <span>Tap to select your preferred model</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">4.</span>
                    <span>The sheet closes and model is applied</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Selection Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Model Selection Tips</CardTitle>
          <CardDescription>
            Choose the right model for better results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <TipCard
              title="For Coding Tasks"
              description="Use DeepSeek V3.2 for complex programming questions, debugging, and architecture advice."
            />
            <TipCard
              title="For Math Problems"
              description="Auto mode automatically routes to math-capable models like Qwen 2.5 or Llama models."
            />
            <TipCard
              title="For Image Analysis"
              description="Use Gemini models for image understanding, visual Q&A, and multimodal tasks."
            />
            <TipCard
              title="For General Chat"
              description="Auto mode or conversational models like RNJ-1 work best for everyday conversations."
            />
            <TipCard
              title="For Free Usage"
              description="Use HuggingFace free models or OpenRouter Auto for unlimited usage without costs."
            />
            <TipCard
              title="For Speed"
              description="Groq models (Llama 3.1 8B Instant) provide the fastest response times."
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Model Providers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ProviderCard
            name="Groq"
            description="Ultra-fast inference with streaming support"
            models={2}
            features={['Fastest responses', 'Streaming', 'Low latency']}
          />
          <ProviderCard
            name="HuggingFace"
            description="Open-source models with free options"
            models={6}
            features={['Free models', 'Open source', 'Diverse selection']}
          />
          <ProviderCard
            name="Google"
            description="Advanced multimodal capabilities"
            models={3}
            features={['Vision support', 'Large context', 'Multimodal']}
          />
          <ProviderCard
            name="OpenRouter"
            description="Aggregated access to multiple models"
            models={1}
            features={['Auto selection', 'Free tier', 'Multiple providers']}
          />
        </div>
      </div>
    </div>
  );
}

function ModelCategory({
  title,
  icon: Icon,
  color,
  description,
  models,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  models: Array<{
    name: string;
    provider: string;
    desc: string;
    features: string[];
    free?: boolean;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {model.name}
                    {model.free && (
                      <Badge variant="secondary" className="text-xs">
                        Free
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {model.provider} • {model.desc}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {model.features.map((feature, j) => (
                  <Badge key={j} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TipCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function ProviderCard({
  name,
  description,
  models,
  features,
}: {
  name: string;
  description: string;
  models: number;
  features: string[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{models} model{models > 1 ? 's' : ''} available</span>
          </div>
          <div className="space-y-1">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}