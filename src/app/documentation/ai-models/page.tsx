'use client';

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Cpu, Code, MessageSquare, Image, Zap, Settings, CheckCircle, Sparkles} from 'lucide-react';

export default function AIModelsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Models Guide</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">AI Models & Selection</h1>
        <p className="text-xl text-muted-foreground">
          SOHAM routes your queries across 13+ specialized models from Groq, Google, HuggingFace, and
          OpenRouter. Here's what's available and when to use each.
        </p>
      </div>

      {/* Auto mode */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Auto Mode — Recommended for Most Users
          </CardTitle>
          <CardDescription>
            SOHAM analyzes your query and routes it to the most capable model automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {emoji: '🧮', label: 'Math problems', desc: 'Routed to math-capable models (Qwen, Llama)'},
              {emoji: '💻', label: 'Code questions', desc: 'Routed to DeepSeek V3.2 or Llama 3.3 70B'},
              {emoji: '🖼️', label: 'Image tasks', desc: 'Routed to Gemini multimodal models'},
              {emoji: '🔍', label: 'Web queries', desc: 'Auto-triggers DuckDuckGo search + AI synthesis'},
              {emoji: '💬', label: 'General chat', desc: 'Routed to fast conversational models'},
              {emoji: '📄', label: 'Document tasks', desc: 'Routed to large-context models'},
            ].map((r) => (
              <div key={r.label} className="flex items-start gap-3 bg-background/50 p-3 rounded-lg">
                <span className="text-xl">{r.emoji}</span>
                <div>
                  <h4 className="font-medium text-sm">{r.label}</h4>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Models</h2>

        <ModelCategory
          title="General Purpose"
          icon={Sparkles}
          color="text-blue-500"
          description="Fast, versatile models for everyday tasks"
          models={[
            {
              name: 'Llama 3.1 8B Instant',
              provider: 'Groq',
              desc: 'Ultra-fast inference, great for quick answers and general chat',
              features: ['Fastest response', 'Streaming', 'Low latency'],
            },
            {
              name: 'Llama 3.2 1B Instruct',
              provider: 'HuggingFace',
              desc: 'Compact free model, good for lightweight tasks',
              features: ['Free', 'Lightweight', 'No limits'],
              free: true,
            },
            {
              name: 'Llama 3.1 70B Instruct',
              provider: 'HuggingFace',
              desc: 'Large free model with strong reasoning',
              features: ['Free', 'High quality', 'Complex reasoning'],
              free: true,
            },
            {
              name: 'Qwen 2.5 7B Instruct',
              provider: 'HuggingFace',
              desc: 'Strong multilingual model, excellent at math and code',
              features: ['Free', 'Multilingual', 'Math & code'],
              free: true,
            },
          ]}
        />

        <ModelCategory
          title="Coding Specialists"
          icon={Code}
          color="text-green-500"
          description="Models fine-tuned for programming, debugging, and architecture"
          models={[
            {
              name: 'DeepSeek V3.2',
              provider: 'HuggingFace',
              desc: 'State-of-the-art coding model — best for complex programming tasks',
              features: ['Code generation', 'Debugging', 'Architecture advice'],
            },
          ]}
        />

        <ModelCategory
          title="Conversational"
          icon={MessageSquare}
          color="text-orange-500"
          description="Models optimized for natural dialogue"
          models={[
            {
              name: 'RNJ-1 Instruct',
              provider: 'HuggingFace',
              desc: 'Efficient conversational model with good personality',
              features: ['Natural dialogue', 'Context awareness', 'Friendly tone'],
            },
            {
              name: 'Gemini 2.5 Flash Lite',
              provider: 'Google',
              desc: 'Lightweight Google model, fast and helpful',
              features: ['Fast responses', 'Casual chat', 'Helpful tone'],
            },
          ]}
        />

        <ModelCategory
          title="Multimodal (Vision)"
          icon={Image}
          color="text-pink-500"
          description="Models that understand and analyze images"
          models={[
            {
              name: 'Gemini 2.5 Flash',
              provider: 'Google',
              desc: 'Google\'s latest multimodal model — best for image analysis',
              features: ['Image analysis', 'Visual Q&A', 'Large context'],
            },
            {
              name: 'Gemini Flash Latest',
              provider: 'Google',
              desc: 'Latest Gemini Flash with improved vision capabilities',
              features: ['Image understanding', 'Text + vision', 'Fast processing'],
            },
          ]}
        />

        <ModelCategory
          title="Free / OpenRouter"
          icon={Zap}
          color="text-purple-500"
          description="Completely free models with no usage limits"
          models={[
            {
              name: 'OpenRouter Auto (Free)',
              provider: 'OpenRouter',
              desc: 'Automatically selects the best available free model from OpenRouter',
              features: ['Auto selection', 'No limits', 'Multiple providers'],
              free: true,
            },
          ]}
        />
      </div>

      {/* How to select */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            How to Select a Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Desktop</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Click the Settings icon (⚙️) in the header</li>
                <li>2. Find the "AI Model" dropdown</li>
                <li>3. Select "Auto" or a specific model</li>
                <li>4. Settings save automatically</li>
              </ol>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Mobile</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Tap the model button in the chat header</li>
                <li>2. A bottom sheet opens with all models</li>
                <li>3. Tap to select your preferred model</li>
                <li>4. Sheet closes and model is applied</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Model Selection Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'For coding tasks',
                desc: 'Use DeepSeek V3.2 for complex programming, debugging, and architecture questions.',
              },
              {
                title: 'For math problems',
                desc: 'Auto mode routes to Qwen 2.5 or Llama models which handle math well.',
              },
              {
                title: 'For image analysis',
                desc: 'Use Gemini 2.5 Flash for image understanding and visual Q&A.',
              },
              {
                title: 'For speed',
                desc: 'Groq\'s Llama 3.1 8B Instant is the fastest model available.',
              },
              {
                title: 'For free unlimited use',
                desc: 'HuggingFace models (Llama, Qwen) and OpenRouter Auto have no usage limits.',
              },
              {
                title: 'For general chat',
                desc: 'Auto mode or RNJ-1 Instruct work best for everyday conversations.',
              },
            ].map((tip) => (
              <div key={tip.title} className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                <p className="text-xs text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Providers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Model Providers</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: 'Groq',
              desc: 'Ultra-fast inference with streaming',
              models: 2,
              features: ['Fastest responses', 'Streaming', 'Low latency'],
            },
            {
              name: 'HuggingFace',
              desc: 'Open-source models, many free',
              models: 6,
              features: ['Free models', 'Open source', 'Diverse selection'],
            },
            {
              name: 'Google',
              desc: 'Advanced multimodal capabilities',
              models: 3,
              features: ['Vision support', 'Large context', 'Multimodal'],
            },
            {
              name: 'OpenRouter',
              desc: 'Aggregated access to many models',
              models: 1,
              features: ['Auto selection', 'Free tier', 'Multiple providers'],
            },
          ].map((p) => (
            <Card key={p.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{p.models} model{p.models > 1 ? 's' : ''} available</span>
                  </div>
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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
  models: Array<{name: string; provider: string; desc: string; features: string[]; free?: boolean}>;
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
          {models.map((model) => (
            <div key={model.name} className="border rounded-lg p-4">
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
                    {model.provider} — {model.desc}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {model.features.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">
                    {f}
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
