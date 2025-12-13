'use client';

import {
  MessageSquare,
  Calculator,
  FileText,
  Search,
  Image as ImageIcon,
  FileCheck,
  Mic,
  Sparkles,
  Cpu,
  Zap,
  Code,
  Smartphone,
  Settings,
  Download,
  Globe,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PageHeader 
        backLink="/" 
        backText="Back to Home"
        title="Documentation"
      />

      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12 lg:py-16 md:px-6">
        <div className="space-y-12 md:space-y-16">
          {/* Hero Section */}
          <div className="space-y-4 md:space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 md:px-4 py-1.5 text-xs md:text-sm">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="font-medium">Complete User Guide</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              CODEEX AI Documentation
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
              Your complete guide to using CODEEX AI - the intelligent multi-model assistant for coding, learning, math, and more.
            </p>
          </div>

          {/* Quick Navigation Tabs */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="features" className="py-2">Features</TabsTrigger>
              <TabsTrigger value="models" className="py-2">AI Models</TabsTrigger>
              <TabsTrigger value="commands" className="py-2">Commands</TabsTrigger>
              <TabsTrigger value="mobile" className="py-2">Mobile/Android</TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features" className="mt-6 space-y-6">
              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {/* Conversational AI */}
                <FeatureCard
                  icon={MessageSquare}
                  title="Conversational AI"
                  description="Engage in natural, context-aware conversations. The AI remembers your conversation history and adapts its tone and technical level based on your preferences."
                >
                  <ExampleBox
                    label="Example"
                    content="What are the main benefits of using TypeScript over JavaScript?"
                  />
                </FeatureCard>

                {/* Multi-Model Support */}
                <FeatureCard
                  icon={Cpu}
                  title="Multi-Model AI Support"
                  description="Choose from 14+ AI models optimized for different tasks. Select the best model for coding, math, conversation, or let Auto mode choose for you."
                >
                    <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                    <p className="font-medium text-foreground">Available Categories:</p>
                    <ul className="mt-1 text-muted-foreground space-y-1">
                      <li>• <strong>General:</strong> Free Hugging Face models (FLAN-T5, BLOOM, DistilBERT)</li>
                      <li>• <strong>Coding:</strong> DeepSeek, WizardCoder</li>
                      <li>• <strong>Math:</strong> WizardMath</li>
                      <li>• <strong>Multimodal:</strong> BLIP-2 (and more coming soon)</li>
                    </ul>
                  </div>
                </FeatureCard>

                {/* Smart Auto-Routing */}
                <FeatureCard
                  icon={Zap}
                  title="Smart Auto-Routing"
                  description="When set to 'Auto' mode, CODEEX AI automatically analyzes your query and routes it to the most appropriate model for best results."
                >
                  <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                    <p className="font-medium text-foreground">How it works:</p>
                    <ul className="mt-1 text-muted-foreground space-y-1">
                      <li>• Coding questions → Coding models</li>
                      <li>• Math problems → Math models</li>
                      <li>• Image requests → Multimodal models</li>
                      <li>• General queries → General models</li>
                    </ul>
                  </div>
                </FeatureCard>

                {/* Quiz & Calculation Solver */}
                <FeatureCard
                  icon={Calculator}
                  title="Quiz & Calculation Solver"
                  description="Solve complex calculations, math problems, or quiz questions with step-by-step explanations using the /solve command."
                >
                  <CommandBox
                    command="/solve [your question]"
                    examples={[
                      '/solve x² + 5x + 6 = 0',
                      '/solve What is the derivative of sin(x)?',
                      '/solve 25 * (10 + 5) / 5',
                    ]}
                  />
                </FeatureCard>

                {/* Web Search */}
                <FeatureCard
                  icon={Search}
                  title="Web Search with Citations"
                  description="Get real-time information from the web using DuckDuckGo search with Google fallback. Results include source citations."
                >
                  <CommandBox
                    command="/search [your question]"
                    examples={[
                      '/search latest news on AI',
                      '/search weather in New York',
                      '/search Who won the last World Cup?',
                    ]}
                  />
                </FeatureCard>

                {/* Information Summarizer */}
                <FeatureCard
                  icon={FileText}
                  title="Information Summarizer"
                  description="Condense long texts, articles, or documents into concise summaries with key points highlighted."
                >
                  <CommandBox
                    command="/summarize [text]"
                    examples={['/summarize [paste your long text here]']}
                  />
                </FeatureCard>

                {/* Visual Math Solver */}
                <FeatureCard
                  icon={ImageIcon}
                  title="Visual Math Solver"
                  description="Upload images of handwritten or printed math equations. Get step-by-step solutions with LaTeX formatting."
                >
                  <div className="rounded-lg bg-muted/50 p-4 text-sm">
                    <p className="font-medium text-foreground">How to use:</p>
                    <p className="mt-2 text-muted-foreground">
                      Navigate to the{' '}
                      <Link href="/visual-math" className="font-medium text-primary hover:underline">
                        Visual Math Solver
                      </Link>{' '}
                      page, upload your image or take a photo, and click &apos;Solve with AI&apos;.
                    </p>
                  </div>
                </FeatureCard>

                {/* PDF Analyzer */}
                <FeatureCard
                  icon={FileCheck}
                  title="PDF Document Analyzer"
                  description="Upload PDF documents and ask questions about their content. Extract insights, summaries, and specific information."
                >
                  <div className="rounded-lg bg-muted/50 p-4 text-sm">
                    <p className="font-medium text-foreground">How to use:</p>
                    <p className="mt-2 text-muted-foreground">
                      Go to the{' '}
                      <Link href="/pdf-analyzer" className="font-medium text-primary hover:underline">
                        PDF Analyzer
                      </Link>{' '}
                      page, upload your document, type your question, and click &apos;Analyze with AI&apos;.
                    </p>
                  </div>
                </FeatureCard>

                {/* Voice Features */}
                <FeatureCard
                  icon={Mic}
                  title="Voice Input & Speech Output"
                  description="Interact hands-free with voice commands. Enable speech output to hear AI responses read aloud in your preferred voice."
                >
                  <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground">Voice Input:</p>
                      <p className="mt-1 text-muted-foreground">
                        Click the microphone icon in the chat input bar.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Speech Output:</p>
                      <p className="mt-1 text-muted-foreground">
                        Go to Settings → Enable Speech Output → Choose voice.
                      </p>
                    </div>
                  </div>
                </FeatureCard>

                {/* Code Assistance */}
                <FeatureCard
                  icon={Code}
                  title="Code Assistance"
                  description="Get help with coding in any language. Debug errors, generate code, explain concepts, and learn best practices."
                >
                  <ExampleBox
                    label="Examples"
                    content={`"Write a Python function to sort a list"
"Debug this JavaScript code: [paste code]"
"Explain how async/await works in TypeScript"`}
                  />
                </FeatureCard>
              </div>
            </TabsContent>

            {/* Models Tab */}
            <TabsContent value="models" className="mt-6 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-2xl font-bold mb-4">Available AI Models</h2>
                <p className="text-muted-foreground mb-6">
                  CODEEX AI supports multiple AI models from different providers. Each model is optimized for specific tasks.
                </p>

                {/* Model Categories */}
                <div className="space-y-6">
                  <ModelCategory
                    title="General Purpose"
                    icon={Sparkles}
                    color="text-blue-500"
                    models={[
                      { name: 'FLAN-T5 Base', provider: 'Hugging Face', desc: 'Instruction-tuned model for general tasks' },
                      { name: 'BLOOM 560M', provider: 'Hugging Face', desc: 'Multilingual model for diverse tasks' },
                      { name: 'Qwen 2.5 72B', provider: 'Hugging Face', desc: 'Excellent for code, math, multilingual' },
                      { name: 'Llama 2 70B', provider: 'Hugging Face', desc: 'Strong analytical capabilities' },
                    ]}
                  />

                  <ModelCategory
                    title="Coding"
                    icon={Code}
                    color="text-green-500"
                    models={[
                      { name: 'DeepSeek Coder 33B', provider: 'Hugging Face', desc: 'Superior code generation' },
                      { name: 'WizardCoder Python 34B', provider: 'Hugging Face', desc: 'Python-focused development' },
                    ]}
                  />

                  <ModelCategory
                    title="Mathematics"
                    icon={Calculator}
                    color="text-purple-500"
                    models={[
                      { name: 'WizardMath 70B', provider: 'Hugging Face', desc: 'Mathematical reasoning and problem solving' },
                    ]}
                  />

                  <ModelCategory
                    title="Conversation"
                    icon={MessageSquare}
                    color="text-orange-500"
                    models={[
                      { name: 'DialoGPT Large', provider: 'Hugging Face', desc: 'Optimized for natural dialogue' },
                      { name: 'BlenderBot 400M', provider: 'Hugging Face', desc: 'Lightweight conversational AI' },
                    ]}
                  />

                  <ModelCategory
                    title="Multimodal (Vision)"
                    icon={ImageIcon}
                    color="text-pink-500"
                    models={[
                      { name: 'BLIP-2', provider: 'Hugging Face', desc: 'Multimodal image understanding and captioning' },
                    ]}
                  />
                </div>

                {/* How to Select */}
                <div className="mt-8 rounded-lg bg-muted/50 p-6">
                  <h3 className="text-lg font-semibold mb-3">How to Select a Model</h3>
                  <ol className="space-y-2 text-muted-foreground">
                    <li>1. Click the <strong>Settings</strong> icon (gear) in the header</li>
                    <li>2. Find the <strong>AI Model</strong> dropdown</li>
                    <li>3. Select <strong>Auto</strong> for smart routing, or choose a specific model</li>
                    <li>4. On mobile, tap the model button to open the bottom sheet selector</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* Commands Tab */}
            <TabsContent value="commands" className="mt-6 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-2xl font-bold mb-4">Slash Commands</h2>
                <p className="text-muted-foreground mb-6">
                  Use these special commands to access specific features quickly.
                </p>

                <div className="space-y-6">
                  <CommandSection
                    command="/solve"
                    description="Solve math problems, equations, coding challenges, or quiz questions with step-by-step explanations."
                    examples={[
                      '/solve x² + 5x + 6 = 0',
                      '/solve What is the integral of x²?',
                      '/solve Write a binary search algorithm in Python',
                      '/solve What is the capital of Australia?',
                    ]}
                    tips={[
                      'Math problems are routed to math-optimized models',
                      'Code in your query routes to coding models',
                      'Solutions include step-by-step explanations',
                    ]}
                  />

                  <CommandSection
                    command="/search"
                    description="Search the web for current information. Uses DuckDuckGo for privacy-focused search with Google fallback."
                    examples={[
                      '/search latest news on artificial intelligence',
                      '/search weather in Tokyo today',
                      '/search how to deploy Next.js to Netlify',
                      '/search current stock price of Apple',
                    ]}
                    tips={[
                      'Results include source citations',
                      'Great for current events and real-time data',
                      'AI summarizes and synthesizes results',
                    ]}
                  />

                  <CommandSection
                    command="/summarize"
                    description="Condense long texts into concise summaries with key points."
                    examples={['/summarize [paste your long article or text here]']}
                    tips={[
                      'Works with articles, documents, and long texts',
                      'Extracts key points and main ideas',
                      'Maintains important details',
                    ]}
                  />
                </div>

                {/* Tips */}
                <div className="mt-8 rounded-lg bg-primary/10 p-6">
                  <h3 className="text-lg font-semibold mb-3">💡 Pro Tips</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Commands are case-insensitive: /SOLVE works the same as /solve</li>
                    <li>• You can also just ask naturally - the AI understands context</li>
                    <li>• Combine commands with specific model selection for best results</li>
                    <li>• Use code blocks (```) when sharing code for better formatting</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Mobile Tab */}
            <TabsContent value="mobile" className="mt-6 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-2xl font-bold mb-4">📱 Mobile & Android Guide</h2>
                <p className="text-muted-foreground mb-6">
                  CODEEX AI is a Progressive Web App (PWA) optimized for mobile devices, especially Android.
                </p>

                {/* Installation */}
                <div className="space-y-6">
                  <div className="rounded-lg border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Download className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">Install on Android</h3>
                    </div>
                    <ol className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                        <span>Open CODEEX AI in <strong>Chrome</strong> browser</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
                        <span>Tap the <strong>menu icon</strong> (⋮) in the top right</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                        <span>Select <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">4</span>
                        <span>Tap <strong>&quot;Install&quot;</strong> to confirm</span>
                      </li>
                    </ol>
                  </div>

                  {/* Mobile Features */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <MobileFeature
                      icon={Smartphone}
                      title="Native App Experience"
                      description="Full-screen mode without browser UI, just like a native app"
                    />
                    <MobileFeature
                      icon={Globe}
                      title="Offline Support"
                      description="View previous conversations and access the app without internet"
                    />
                    <MobileFeature
                      icon={ImageIcon}
                      title="Camera Integration"
                      description="Take photos directly for Visual Math Solver"
                    />
                    <MobileFeature
                      icon={Mic}
                      title="Voice Input"
                      description="Use your device microphone for hands-free input"
                    />
                    <MobileFeature
                      icon={Shield}
                      title="Secure & Private"
                      description="Your data stays on your device with secure authentication"
                    />
                    <MobileFeature
                      icon={Zap}
                      title="Fast & Responsive"
                      description="Optimized touch targets and smooth animations"
                    />
                  </div>

                  {/* Mobile Tips */}
                  <div className="rounded-lg bg-muted/50 p-6">
                    <h3 className="text-lg font-semibold mb-3">📱 Mobile Tips</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• <strong>Model Selector:</strong> Tap the model button to open a bottom sheet with all models</li>
                      <li>• <strong>Swipe to Dismiss:</strong> Swipe down on dialogs to close them</li>
                      <li>• <strong>Voice Input:</strong> Tap the microphone icon for hands-free typing</li>
                      <li>• <strong>Camera:</strong> Use your camera directly in Visual Math Solver</li>
                      <li>• <strong>Offline:</strong> The app works offline - messages sync when you&apos;re back online</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Settings Section */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Settings & Customization</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <SettingItem
                title="AI Model"
                description="Choose Auto for smart routing or select a specific model"
              />
              <SettingItem
                title="Tone"
                description="Helpful, Formal, or Casual response style"
              />
              <SettingItem
                title="Technical Level"
                description="Beginner, Intermediate, or Expert explanations"
              />
              <SettingItem
                title="Theme"
                description="Light, Dark, or System preference"
              />
              <SettingItem
                title="Speech Output"
                description="Enable text-to-speech for AI responses"
              />
              <SettingItem
                title="Voice"
                description="Choose from 4 different voice options"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 md:p-8 text-center shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold">Ready to Get Started?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Experience the full power of CODEEX AI with multi-model support, smart routing, and all these amazing features.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg">Start Chatting Now</Button>
              </Link>
              <Link href="/visual-math">
                <Button size="lg" variant="outline">Try Visual Math</Button>
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="rounded-xl border bg-card p-5 md:p-6 text-center">
            <h3 className="text-lg md:text-xl font-semibold">Need Help?</h3>
            <p className="mt-2 text-muted-foreground">
              Have questions or feedback? Contact us at{' '}
              <a href="mailto:codeex@email.com" className="font-medium text-primary hover:underline">
                codeex@email.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Component: Feature Card
function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-3 top-3 md:right-4 md:top-4 rounded-lg bg-primary/10 p-2 md:p-3">
        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
      </div>
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-xl md:text-2xl font-semibold pr-12">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
}

// Component: Example Box
function ExampleBox({ label, content }: { label: string; content: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 text-sm">
      <p className="font-medium text-foreground">{label}:</p>
      <p className="mt-1 text-muted-foreground whitespace-pre-line">{content}</p>
    </div>
  );
}

// Component: Command Box
function CommandBox({ command, examples }: { command: string; examples: string[] }) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm">
      <div>
        <p className="font-medium text-foreground">Command:</p>
        <code className="mt-1 block rounded bg-background px-3 py-2 font-mono">{command}</code>
      </div>
      <div>
        <p className="font-medium text-foreground">Examples:</p>
        {examples.map((example, i) => (
          <code key={i} className="mt-1 block rounded bg-background px-3 py-2 font-mono text-xs">
            {example}
          </code>
        ))}
      </div>
    </div>
  );
}

// Component: Model Category
function ModelCategory({
  title,
  icon: Icon,
  color,
  models,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  models: { name: string; provider: string; desc: string }[];
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {models.map((model, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="font-medium">{model.name}</span>
            <span className="text-muted-foreground text-xs">
              {model.provider} • {model.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component: Command Section
function CommandSection({
  command,
  description,
  examples,
  tips,
}: {
  command: string;
  description: string;
  examples: string[];
  tips: string[];
}) {
  return (
    <div className="rounded-lg border p-6">
      <code className="text-xl font-bold text-primary">{command}</code>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="font-medium mb-2">Examples:</p>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <code key={i} className="block rounded bg-muted px-3 py-2 text-xs font-mono">
                {ex}
              </code>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium mb-2">Tips:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Component: Mobile Feature
function MobileFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Component: Setting Item
function SettingItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
