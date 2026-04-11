'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Brain,
  MessageSquare,
  GraduationCap,
  Volume2,
  Palette,
  Shield,
  ArrowRight,
  CheckCircle,
  Monitor,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Settings className="h-4 w-4 text-primary" />
          <span className="font-medium">Settings & Customization</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Settings Guide</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Tailor SOHAM to your workflow — choose your AI model, response style, voice, and more.
          All settings are saved locally in your browser.
        </p>
      </div>

      {/* How to open */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-primary" />
            How to Open Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-background p-4 space-y-2">
            <p className="font-semibold text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" /> Desktop
            </p>
            <p className="text-sm text-muted-foreground">
              Click the <strong className="text-foreground">⚙️ gear icon</strong> in the top-right
              header. The settings panel slides in from the right.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4 space-y-2">
            <p className="font-semibold text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" /> Mobile
            </p>
            <p className="text-sm text-muted-foreground">
              Tap the <strong className="text-foreground">⚙️ gear icon</strong> in the header — same
              location. The panel opens as a bottom sheet on small screens.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Model Selection</h2>
            <p className="text-sm text-muted-foreground">Choose which model powers your conversations</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">Auto (Recommended)</p>
                <Badge>Default</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                SOHAM picks the best model for each message automatically — fast models for simple
                questions, powerful models for complex reasoning.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { provider: 'Groq', models: ['Llama 3.1 8B Instant'], note: 'Fastest responses, great for quick Q&A' },
                { provider: 'HuggingFace', models: ['Llama 3.1 70B', 'Llama 3.2 1B', 'Qwen 2.5 7B', 'DeepSeek V3.2', 'RNJ-1'], note: 'Wide variety, strong reasoning' },
                { provider: 'Google', models: ['Gemini 2.5 Flash', 'Gemini Flash Latest', 'Gemini 2.5 Flash Lite'], note: 'Excellent for multimodal and long context' },
                { provider: 'OpenRouter', models: ['Auto'], note: 'Routes to the best available model' },
              ].map(({ provider, models, note }) => (
                <div key={provider} className="rounded-lg border p-4">
                  <p className="font-semibold text-sm mb-1">{provider}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {models.map(m => (
                      <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              All 13+ models are free — no API key or account required.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Tone */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
            <MessageSquare className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Response Tone</h2>
            <p className="text-sm text-muted-foreground">Controls how SOHAM phrases its answers</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              tone: 'Helpful',
              badge: 'Default',
              desc: 'Balanced, friendly, and practical. Good for most use cases.',
              example: '"Sure! Here\'s how you can fix that — the issue is in line 12 where..."',
            },
            {
              tone: 'Formal',
              badge: null,
              desc: 'Professional and structured. Ideal for reports, emails, and business writing.',
              example: '"The error originates from an incorrect type assertion on line 12. The recommended resolution is..."',
            },
            {
              tone: 'Casual',
              badge: null,
              desc: 'Relaxed and conversational. Great for brainstorming and quick chats.',
              example: '"Oh yeah, that\'s a classic one! Line 12 is the culprit — just change the type and you\'re good."',
            },
          ].map(({ tone, badge, desc, example }) => (
            <Card key={tone}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  {tone}
                  {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground italic">{example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Level */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <GraduationCap className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Technical Level</h2>
            <p className="text-sm text-muted-foreground">Adjusts the depth and vocabulary of explanations</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              level: 'Beginner',
              desc: 'Plain language, analogies, no assumed knowledge.',
              example: 'Explains recursion as "a function that calls itself, like Russian nesting dolls."',
            },
            {
              level: 'Intermediate',
              badge: 'Default',
              desc: 'Assumes basic familiarity. Uses standard terminology with brief explanations.',
              example: 'Explains recursion with a factorial example and mentions the call stack.',
            },
            {
              level: 'Expert',
              desc: 'Dense, precise, no hand-holding. Assumes deep domain knowledge.',
              example: 'Discusses tail-call optimisation, memoisation, and stack frame overhead directly.',
            },
          ].map(({ level, badge, desc, example }) => (
            <Card key={level}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  {level}
                  {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic">{example}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Volume2 className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Voice Settings</h2>
            <p className="text-sm text-muted-foreground">Text-to-speech powered by Groq Orpheus TTS</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Volume2 className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Enable Text-to-Speech</p>
                <p className="text-sm text-muted-foreground">
                  Toggle TTS on to have SOHAM read responses aloud using Groq Orpheus. Works in all
                  modern browsers. Microphone permission is not required for TTS.
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Choose a Voice</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: 'troy',   desc: 'Deep, authoritative male voice' },
                  { name: 'diana',  desc: 'Clear, professional female voice' },
                  { name: 'hannah', desc: 'Warm, friendly female voice' },
                  { name: 'autumn', desc: 'Soft, calm female voice' },
                  { name: 'austin', desc: 'Energetic, upbeat male voice' },
                  { name: 'daniel', desc: 'Neutral, natural male voice' },
                ].map(({ name, desc }) => (
                  <div key={name} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                      <Volume2 className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm capitalize">{name}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Voice input (speech-to-text) uses Groq Whisper V3 Turbo and is configured separately
              via the microphone button in the chat interface.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Theme */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
            <Palette className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Theme</h2>
            <p className="text-sm text-muted-foreground">Controls the visual appearance of the app</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { theme: 'Light', icon: Sun,     desc: 'White background, dark text. Best in bright environments.' },
            { theme: 'Dark',  icon: Moon,    desc: 'Dark background, light text. Easier on the eyes at night.' },
            { theme: 'System',icon: Laptop,  desc: 'Follows your OS preference automatically. Recommended.', badge: 'Default' },
          ].map(({ theme, icon: Icon, desc, badge }) => (
            <Card key={theme}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {theme}
                  </span>
                  {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Shield className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Privacy Settings</h2>
            <p className="text-sm text-muted-foreground">Your data stays on your device</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            {[
              {
                title: 'Local Storage Only',
                desc: 'All settings and conversation history are stored in your browser\'s localStorage. Nothing is sent to SOHAM servers.',
              },
              {
                title: 'Clear Session',
                desc: 'Use the "Clear conversation" button in the chat header to wipe the current session from memory. This is immediate and irreversible.',
              },
              {
                title: 'No Account Required',
                desc: 'SOHAM is 100% free with no sign-up. Without an account, no data is tied to an identity. Creating an account (optional) enables cross-device memory sync.',
              },
              {
                title: 'API Calls',
                desc: 'Messages are sent to third-party AI providers (Groq, HuggingFace, Google, OpenRouter) to generate responses. Review their respective privacy policies for data handling.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 rounded-lg border p-4">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Configure SOHAM your way</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Open the chat and click the ⚙️ icon to start customising.
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
