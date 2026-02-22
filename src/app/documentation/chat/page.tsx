'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mic, 
  Volume2, 
  Settings, 
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  Clock,
  Users,
  Shield,
  Lightbulb,
  Share2
} from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-medium">Chat Interface</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Conversational AI Features
        </h1>
        <p className="text-xl text-muted-foreground">
          Master the chat interface with context-aware conversations, voice input, speech output, and intelligent memory.
        </p>
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Start Chatting Now
          </CardTitle>
          <CardDescription>
            Jump into a conversation and experience intelligent AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/chat">
              <Button size="lg">
                Open Chat Interface
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs/quick-start">
              <Button size="lg" variant="outline">
                Quick Start Guide
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Core Chat Features</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={Brain}
            title="Context-Aware Conversations"
            description="AI remembers your conversation history and maintains context across messages"
            features={[
              'Remembers previous questions and answers',
              'Maintains conversation flow naturally',
              'References earlier parts of the conversation',
              'Adapts responses based on your preferences'
            ]}
          />
          
          <FeatureCard
            icon={Sparkles}
            title="Smart Auto-Routing"
            description="Automatically selects the best AI model for each type of question"
            features={[
              'Math questions → Math-specialized models',
              'Code questions → Programming models',
              'General chat → Conversational models',
              'Image tasks → Multimodal models'
            ]}
          />

          <FeatureCard
            icon={Mic}
            title="Voice Input"
            description="Speak your questions instead of typing for hands-free interaction"
            features={[
              'Click microphone icon to start recording',
              'Automatic speech-to-text conversion',
              'Works in multiple languages',
              'Perfect for mobile usage'
            ]}
          />

          <FeatureCard
            icon={Volume2}
            title="Speech Output (TTS)"
            description="Hear AI responses read aloud with natural-sounding voices"
            features={[
              '4 different voice options available',
              'Adjustable speech rate and pitch',
              'Works with all AI responses',
              'Great for accessibility and multitasking'
            ]}
          />

          <FeatureCard
            icon={Share2}
            title="Share & Export Responses"
            description="Save and share AI responses in multiple formats"
            features={[
              'Export as Text, Markdown, or HTML',
              'Share via Email, Twitter, LinkedIn, Facebook',
              'Native mobile sharing support',
              'Quick copy formatted text'
            ]}
          />
        </div>
      </div>

      {/* Interface Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Interface Overview</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Chat Interface Components</CardTitle>
            <CardDescription>
              Understanding the main elements of the chat interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <InterfaceComponent
                  name="Message Input"
                  description="Type your questions, commands, or requests"
                  location="Bottom of screen"
                  features={['Supports markdown formatting', 'Auto-resize as you type', 'Command suggestions']}
                />
                <InterfaceComponent
                  name="Voice Button"
                  description="Click to start voice input recording"
                  location="Right side of input field"
                  features={['Visual recording indicator', 'Automatic transcription', 'Cancel option']}
                />
                <InterfaceComponent
                  name="Model Selector"
                  description="Choose AI model or set to Auto mode"
                  location="Top right (desktop) or bottom sheet (mobile)"
                  features={['13+ model options', 'Auto-routing mode', 'Model descriptions']}
                />
                <InterfaceComponent
                  name="Settings Panel"
                  description="Customize your chat experience"
                  location="Settings icon in header"
                  features={['Voice settings', 'Response tone', 'Technical level']}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Voice Features</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Input Setup
              </CardTitle>
              <CardDescription>
                How to use speech-to-text for hands-free input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      title: "Click the Microphone",
                      description: "Find the mic icon next to the message input field"
                    },
                    {
                      step: 2,
                      title: "Grant Permissions",
                      description: "Allow browser access to your microphone when prompted"
                    },
                    {
                      step: 3,
                      title: "Start Speaking",
                      description: "Speak clearly and naturally - the AI will transcribe automatically"
                    },
                    {
                      step: 4,
                      title: "Review & Send",
                      description: "Check the transcription and click send or edit as needed"
                    }
                  ].map((step) => (
                    <VoiceStep
                      key={step.step}
                      step={step.step}
                      title={step.title}
                      description={step.description}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Speech Output Setup
              </CardTitle>
              <CardDescription>
                Configure text-to-speech for AI responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      title: "Open Settings",
                      description: "Click the settings icon (⚙️) in the header"
                    },
                    {
                      step: 2,
                      title: "Enable Speech Output",
                      description: "Toggle on 'Enable Speech Output' option"
                    },
                    {
                      step: 3,
                      title: "Choose Voice",
                      description: "Select from 4 available voice options"
                    },
                    {
                      step: 4,
                      title: "Adjust Settings",
                      description: "Fine-tune speech rate and pitch to your preference"
                    }
                  ].map((step) => (
                    <VoiceStep
                      key={step.step}
                      step={step.step}
                      title={step.title}
                      description={step.description}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conversation Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Conversation Tips
          </CardTitle>
          <CardDescription>
            Get better results with these conversation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">✅ Best Practices</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific in your questions for more accurate answers</li>
                <li>• Use follow-up questions to dive deeper into topics</li>
                <li>• Reference previous messages: "Can you explain that differently?"</li>
                <li>• Use slash commands (/solve, /search) for specialized tasks</li>
                <li>• Set your technical level in settings for appropriate explanations</li>
                <li>• Use code blocks (```) when sharing code for better formatting</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">🎯 Example Conversations</h4>
              <div className="space-y-3">
                <ExampleConversation
                  topic="Learning Programming"
                  messages={[
                    "Explain how React hooks work",
                    "Can you show me an example with useState?",
                    "What are the rules of hooks?"
                  ]}
                />
                <ExampleConversation
                  topic="Math Problem Solving"
                  messages={[
                    "/solve x² + 5x + 6 = 0",
                    "Can you explain the quadratic formula?",
                    "Show me another example"
                  ]}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Advanced Features</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <AdvancedFeature
            icon={Clock}
            title="Conversation Memory"
            description="AI remembers context from your entire conversation session"
            details={[
              'Maintains context across messages',
              'References previous questions',
              'Builds on earlier explanations'
            ]}
          />
          
          <AdvancedFeature
            icon={Users}
            title="Personalized Responses"
            description="Adapts to your preferred communication style and technical level"
            details={[
              'Learns your preferences over time',
              'Adjusts explanation complexity',
              'Remembers your interests'
            ]}
          />
          
          <AdvancedFeature
            icon={Shield}
            title="Privacy & Security"
            description="Your conversations are secure and private"
            details={[
              'End-to-end encryption',
              'No conversation logging',
              'Local storage only'
            ]}
          />
        </div>
      </div>

      {/* Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chat Settings
          </CardTitle>
          <CardDescription>
            Customize your chat experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <SettingCard
              title="AI Model"
              description="Choose specific model or Auto for smart routing"
              options={['Auto (Recommended)', 'Specific models', '13+ options available']}
            />
            <SettingCard
              title="Response Tone"
              description="Set the personality and style of AI responses"
              options={['Helpful (Default)', 'Formal', 'Casual']}
            />
            <SettingCard
              title="Technical Level"
              description="Adjust explanation complexity"
              options={['Beginner', 'Intermediate', 'Expert']}
            />
            <SettingCard
              title="Speech Settings"
              description="Configure voice input and output"
              options={['4 voice options', 'Adjustable speed', 'Pitch control']}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mobile Optimization */}
      <Card>
        <CardHeader>
          <CardTitle>📱 Mobile Chat Experience</CardTitle>
          <CardDescription>
            Optimized features for mobile devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <MobileFeature
              title="Touch-Optimized Interface"
              description="Large touch targets and swipe gestures"
            />
            <MobileFeature
              title="Bottom Sheet Model Selector"
              description="Easy model switching with thumb-friendly design"
            />
            <MobileFeature
              title="Voice Input Priority"
              description="Prominent microphone button for hands-free use"
            />
            <MobileFeature
              title="Responsive Design"
              description="Adapts perfectly to all screen sizes"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function InterfaceComponent({
  name,
  description,
  location,
  features,
}: {
  name: string;
  description: string;
  location: string;
  features: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">📍 {location}</p>
      <ul className="space-y-1">
        {features.map((feature, i) => (
          <li key={i} className="text-xs text-muted-foreground">• {feature}</li>
        ))}
      </ul>
    </div>
  );
}

function VoiceStep({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
        {step}
      </div>
      <div>
        <h5 className="font-medium text-sm">{title}</h5>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ExampleConversation({
  topic,
  messages,
}: {
  topic: string;
  messages: string[];
}) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <h5 className="font-medium text-sm mb-2">{topic}</h5>
      <div className="space-y-1">
        {messages.map((message, i) => (
          <p key={i} className="text-xs text-muted-foreground font-mono">
            {i + 1}. "{message}"
          </p>
        ))}
      </div>
    </div>
  );
}

function AdvancedFeature({
  icon: Icon,
  title,
  description,
  details,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="h-1 w-1 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-muted-foreground">{detail}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SettingCard({
  title,
  description,
  options,
}: {
  title: string;
  description: string;
  options: string[];
}) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <ul className="space-y-1">
        {options.map((option, i) => (
          <li key={i} className="text-xs text-muted-foreground">• {option}</li>
        ))}
      </ul>
    </div>
  );
}

function MobileFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}