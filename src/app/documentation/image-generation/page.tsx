'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ImageIcon,
  Sparkles,
  Download,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Zap,
  Palette,
  Camera,
  Brush,
} from 'lucide-react';

const examplePrompts = [
  {
    prompt: 'A futuristic city at night with neon lights reflecting on wet streets, cyberpunk style, highly detailed',
    style: 'Artistic',
    icon: Sparkles,
  },
  {
    prompt: 'Portrait of a young woman with flowing red hair in a sunlit forest, photorealistic, 4K',
    style: 'Realistic',
    icon: Camera,
  },
  {
    prompt: 'Anime-style warrior girl with silver armor standing on a mountain peak, dramatic lighting, Studio Ghibli inspired',
    style: 'Anime',
    icon: Brush,
  },
  {
    prompt: 'Pencil sketch of an old lighthouse on a rocky cliff, detailed crosshatching, black and white',
    style: 'Sketch',
    icon: Palette,
  },
];

const promptTips = [
  {
    tip: 'Be specific about the subject',
    bad: 'a dog',
    good: 'a golden retriever puppy sitting in autumn leaves, looking at the camera',
  },
  {
    tip: 'Mention the art style',
    bad: 'a castle',
    good: 'a medieval castle at sunset, oil painting style, impressionist brushwork',
  },
  {
    tip: 'Add quality keywords',
    bad: 'a mountain landscape',
    good: 'a mountain landscape at golden hour, highly detailed, 4K, cinematic lighting',
  },
  {
    tip: 'Describe lighting and mood',
    bad: 'a coffee shop interior',
    good: 'a cozy coffee shop interior, warm ambient lighting, bokeh background, moody atmosphere',
  },
];

export default function ImageGenerationPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span className="font-medium">Image Generation</span>
          <Badge variant="secondary" className="text-xs">FLUX.1-schnell</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Image Generation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Generate images directly in the chat using HuggingFace FLUX.1-schnell — one of the
          fastest open-source image generation models available.
        </p>
      </div>

      {/* How to trigger */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-primary" />
            How to Generate an Image
          </CardTitle>
          <CardDescription>No special commands needed — just describe what you want</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            SOHAM automatically detects image generation intent. Just type naturally in the chat:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Generate an image of a sunset over the ocean',
              'Create a picture of a robot reading a book',
              'Draw a fantasy map with mountains and rivers',
              'Make an image of a futuristic spaceship',
            ].map((phrase) => (
              <div key={phrase} className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <code className="text-sm">&quot;{phrase}&quot;</code>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Trigger phrases include: <em>generate an image of</em>, <em>create a picture of</em>,{' '}
            <em>draw</em>, <em>make an image of</em>, <em>show me a picture of</em>.
          </p>
        </CardContent>
      </Card>

      {/* Pipeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'You describe the image',
              desc: 'Type your prompt in the chat. SOHAM detects the image generation intent automatically.',
            },
            {
              step: '2',
              title: 'FLUX.1-schnell generates it',
              desc: 'Your prompt is sent to HuggingFace\'s FLUX.1-schnell model — a state-of-the-art text-to-image model optimised for speed.',
            },
            {
              step: '3',
              title: 'Image appears inline',
              desc: 'The generated image is displayed directly in the chat. Tap the download button to save it to your device.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 rounded-xl border bg-background p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {step}
              </span>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported styles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Supported Styles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { style: 'Realistic', icon: Camera,   desc: 'Photorealistic images, portraits, landscapes. Use keywords like "photorealistic", "4K", "DSLR".' },
            { style: 'Anime',     icon: Sparkles,  desc: 'Japanese animation style. Reference studios like "Studio Ghibli" or "Makoto Shinkai style".' },
            { style: 'Sketch',    icon: Brush,     desc: 'Pencil drawings, line art, crosshatching. Specify "pencil sketch", "ink drawing", "charcoal".' },
            { style: 'Artistic',  icon: Palette,   desc: 'Oil paintings, watercolours, digital art. Mention the medium and art movement.' },
          ].map(({ style, icon: Icon, desc }) => (
            <Card key={style}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-primary" /> {style}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Example prompts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example Prompts</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {examplePrompts.map(({ prompt, style, icon: Icon }) => (
            <Card key={prompt} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    {style} Style
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{style}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/60 px-4 py-3">
                  <p className="text-sm italic text-muted-foreground">&quot;{prompt}&quot;</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prompt tips */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tips for Better Prompts</h2>
        <div className="space-y-3">
          {promptTips.map(({ tip, bad, good }) => (
            <Card key={tip}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  {tip}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10 p-3">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">❌ Vague</p>
                  <p className="text-sm text-muted-foreground italic">&quot;{bad}&quot;</p>
                </div>
                <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-950/10 p-3">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">✅ Specific</p>
                  <p className="text-sm text-muted-foreground italic">&quot;{good}&quot;</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Downloading */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4 text-primary" />
            Downloading Generated Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Every generated image has a <strong className="text-foreground">download button</strong>{' '}
            that appears when you hover over it (or tap on mobile). Click it to save the image to
            your device in full resolution.
          </p>
          <p>
            On mobile, you can also long-press the image and select &quot;Save image&quot; from your
            browser&apos;s context menu.
          </p>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-base">Notes & Limitations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            'Powered by HuggingFace FLUX.1-schnell via the free inference API.',
            'Generation typically takes 5–15 seconds depending on server load.',
            'Image quality and resolution depend on the HuggingFace free tier.',
            'SOHAM does not store generated images — download them if you want to keep them.',
            'Avoid prompts that violate HuggingFace\'s content policy (violence, explicit content).',
          ].map((note) => (
            <div key={note} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              {note}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Try image generation now</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Open the chat and type &quot;generate an image of...&quot; followed by your description.
        </p>
        <Button asChild size="lg">
          <Link href="/chat">
            Open Chat <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
