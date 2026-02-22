'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  Volume2, 
  Zap, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowRight,
  Settings,
  Play,
  Brain,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function JarvisModeDocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Mic className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="font-medium">Jarvis Voice Assistant</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Jarvis Voice Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience hands-free AI interaction with advanced voice recognition and natural speech synthesis. 
          Your personal AI assistant that listens, understands, and responds naturally.
        </p>
      </div>

      {/* Quick Access */}
      <div className="flex justify-center">
        <Link href="/jarvis-mode">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className="h-3 w-3 text-white" />
            </div>
            Launch Jarvis Mode
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Voice Recognition"
          description="Advanced speech-to-text with natural language processing"
          icon={Mic}
          badge="AI Powered"
        />
        <FeatureCard
          title="Natural Speech"
          description="High-quality text-to-speech with multiple voice options"
          icon={Volume2}
        />
        <FeatureCard
          title="Hands-Free Operation"
          description="Complete voice control without touching the screen"
          icon={Target}
        />
        <FeatureCard
          title="Smart Responses"
          description="Context-aware AI responses with personality"
          icon={Brain}
        />
        <FeatureCard
          title="Multi-Language"
          description="Support for multiple languages and accents"
          icon={BookOpen}
        />
        <FeatureCard
          title="Customizable"
          description="Adjust voice settings, speed, and preferences"
          icon={Settings}
        />
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How Jarvis Mode Works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <StepCard
            step="1"
            title="Activate"
            description="Click the microphone or say 'Hey Jarvis' to start"
            icon={Play}
          />
          <StepCard
            step="2"
            title="Speak"
            description="Ask your question or give a command naturally"
            icon={Mic}
          />
          <StepCard
            step="3"
            title="Process"
            description="AI analyzes your speech and generates a response"
            icon={Brain}
          />
          <StepCard
            step="4"
            title="Respond"
            description="Hear the AI response with natural speech synthesis"
            icon={Volume2}
          />
        </div>
      </div>

      {/* Voice Commands */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Voice Commands</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CommandCategoryCard
            title="Activation Commands"
            commands={[
              "Hey Jarvis",
              "Start listening",
              "Voice mode on",
              "Activate assistant"
            ]}
            description="Wake up the voice assistant"
          />
          <CommandCategoryCard
            title="Control Commands"
            commands={[
              "Stop talking",
              "Pause",
              "Repeat that",
              "Speak slower/faster"
            ]}
            description="Control speech playback"
          />
          <CommandCategoryCard
            title="Task Commands"
            commands={[
              "Solve this equation",
              "Search for information",
              "Explain this concept",
              "Generate an image"
            ]}
            description="Request specific AI tasks"
          />
          <CommandCategoryCard
            title="Navigation Commands"
            commands={[
              "Go to settings",
              "Open new chat",
              "Show my profile",
              "Switch to text mode"
            ]}
            description="Navigate the interface"
          />
        </div>
      </div>

      {/* Voice Settings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Voice Settings & Customization</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SettingsCard
            title="Speech Recognition"
            settings={[
              "Language selection (20+ languages)",
              "Accent adaptation",
              "Noise cancellation",
              "Sensitivity adjustment",
              "Continuous listening mode"
            ]}
            icon={Mic}
          />
          <SettingsCard
            title="Speech Synthesis"
            settings={[
              "Voice selection (multiple options)",
              "Speaking speed control",
              "Pitch adjustment",
              "Volume normalization",
              "Pronunciation customization"
            ]}
            icon={Volume2}
          />
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Perfect Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UseCaseCard
            title="Accessibility"
            description="Hands-free operation for users with mobility limitations"
            icon={Target}
            examples={["Voice-only navigation", "Audio feedback", "Screen reader compatibility"]}
          />
          <UseCaseCard
            title="Multitasking"
            description="Get AI help while working on other tasks"
            icon={Zap}
            examples={["Cooking while asking questions", "Driving with voice queries", "Exercise with audio responses"]}
          />
          <UseCaseCard
            title="Learning"
            description="Interactive learning with audio explanations"
            icon={BookOpen}
            examples={["Language practice", "Concept explanations", "Study assistance"]}
          />
        </div>
      </div>

      {/* Technical Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Technical Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TechFeatureCard
            title="Advanced NLP"
            description="Natural language processing for context understanding"
            icon={Brain}
          />
          <TechFeatureCard
            title="Real-Time Processing"
            description="Low-latency speech recognition and synthesis"
            icon={Zap}
          />
          <TechFeatureCard
            title="Noise Filtering"
            description="Background noise reduction for clear recognition"
            icon={Headphones}
          />
          <TechFeatureCard
            title="Context Awareness"
            description="Maintains conversation context across interactions"
            icon={Target}
          />
          <TechFeatureCard
            title="Offline Capability"
            description="Basic voice features work without internet"
            icon={Settings}
          />
          <TechFeatureCard
            title="Privacy Protection"
            description="Voice data processed securely with encryption"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Tips for Best Experience */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tips for Best Experience</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TipCard
            title="Optimal Setup"
            tips={[
              "Use a good quality microphone or headset",
              "Minimize background noise",
              "Speak clearly and at normal pace",
              "Position microphone 6-12 inches from mouth",
              "Test audio levels before extended use"
            ]}
          />
          <TipCard
            title="Effective Communication"
            tips={[
              "Use natural, conversational language",
              "Be specific about what you need",
              "Wait for the response before speaking again",
              "Use pause commands if needed",
              "Provide context for complex questions"
            ]}
          />
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Troubleshooting</h2>
        <div className="space-y-4">
          <TroubleshootCard
            problem="Voice not recognized"
            solutions={[
              "Check microphone permissions in browser",
              "Ensure microphone is not muted",
              "Try speaking more clearly or slowly",
              "Reduce background noise",
              "Refresh the page and try again"
            ]}
          />
          <TroubleshootCard
            problem="No audio response"
            solutions={[
              "Check speaker/headphone volume",
              "Verify audio output device",
              "Enable audio in browser settings",
              "Try different voice in settings",
              "Check if audio is muted in browser tab"
            ]}
          />
          <TroubleshootCard
            problem="Delayed responses"
            solutions={[
              "Check internet connection speed",
              "Close other browser tabs",
              "Clear browser cache",
              "Try using a wired internet connection",
              "Restart the browser"
            ]}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 via-purple-50 to-background p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
          <Mic className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Ready to Try Jarvis Mode?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Experience the future of AI interaction with natural voice commands and responses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/jarvis-mode">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Mic className="h-4 w-4" />
              Launch Jarvis Mode
            </Button>
          </Link>
          <Link href="/docs/settings">
            <Button size="lg" variant="outline">
              Voice Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
            <Icon className="h-6 w-6 text-blue-600" />
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
  );
}

function StepCard({
  step,
  title,
  description,
  icon: Icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-lg font-bold text-white">{step}</span>
        </div>
        <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function CommandCategoryCard({
  title,
  commands,
  description,
}: {
  title: string;
  commands: string[];
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {commands.map((command, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Mic className="h-4 w-4 text-blue-600" />
              <code className="bg-muted px-2 py-1 rounded text-xs">"{command}"</code>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SettingsCard({
  title,
  settings,
  icon: Icon,
}: {
  title: string;
  settings: string[];
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {settings.map((setting, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {setting}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function UseCaseCard({
  title,
  description,
  icon: Icon,
  examples,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  examples: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              • {example}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TechFeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TipCard({
  title,
  tips,
}: {
  title: string;
  tips: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Zap className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TroubleshootCard({
  problem,
  solutions,
}: {
  problem: string;
  solutions: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-red-700">{problem}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {solutions.map((solution, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              {solution}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}