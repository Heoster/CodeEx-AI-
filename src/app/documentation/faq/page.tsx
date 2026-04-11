'use client';

import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {HelpCircle, Cpu, MessageSquare, Settings, Shield, Smartphone, Zap, ArrowRight} from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="font-medium">FAQ & Troubleshooting</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Answers to the most common questions about SOHAM features, setup, and troubleshooting.
        </p>
      </div>

      {/* Quick nav */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Jump to a Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              {title: 'Getting Started', href: '#getting-started', icon: Zap},
              {title: 'AI Models', href: '#ai-models', icon: Cpu},
              {title: 'Features', href: '#features', icon: MessageSquare},
              {title: 'Technical Issues', href: '#technical', icon: Settings},
            ].map((s) => (
              <a key={s.href} href={s.href} className="block">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{s.title}</span>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <FAQSection
        id="getting-started"
        title="Getting Started"
        icon={Zap}
        questions={[
          {
            q: 'What is SOHAM?',
            a: 'SOHAM (Self Organising Hyper Adaptive Machine) is a free, multi-model AI assistant built by Heoster (CODEEX-AI). It gives you access to 13+ AI models from Groq, Google, HuggingFace, and OpenRouter through a single interface — with smart auto-routing, voice features, PDF analysis, image generation, and real-time web search.',
          },
          {
            q: 'Is SOHAM free?',
            a: 'Yes, completely free. All core features — chat, 13+ models, image generation, web search, voice, PDF analysis — are free forever. No hidden fees, no subscriptions. Heoster\'s mission is to democratize AI access.',
          },
          {
            q: 'Do I need to create an account?',
            a: 'No account is required for basic usage. Creating an account lets you save conversation history, sync settings, and access personalized features. Sign up is optional and free.',
          },
          {
            q: 'What can I ask SOHAM?',
            a: 'Anything: coding help, math problems, general knowledge, homework, document analysis, image generation, web searches, creative writing, debugging, architecture advice, and more. The AI adapts to your query automatically.',
          },
          {
            q: 'What does "SOHAM" mean?',
            a: 'SOHAM has two meanings. In the product, it stands for "Self Organising Hyper Adaptive Machine." The name is also inspired by the Sanskrit mantra Soham (So Hum), meaning "I am That" — representing unity of individual self with universal consciousness. Heoster chose this name to give the product both technical identity and human depth.',
          },
        ]}
      />

      <FAQSection
        id="ai-models"
        title="AI Models & Selection"
        icon={Cpu}
        questions={[
          {
            q: 'How many AI models are available?',
            a: 'SOHAM provides access to 13+ AI models from Groq (Llama 3.1 8B Instant), HuggingFace (Llama 3.1 70B, Llama 3.2 1B, Qwen 2.5 7B, DeepSeek V3.2, RNJ-1), Google (Gemini 2.5 Flash, Gemini Flash Latest, Gemini 2.5 Flash Lite), and OpenRouter (Auto free tier).',
          },
          {
            q: 'What is Auto mode?',
            a: 'Auto mode is SOHAM\'s smart routing system. It analyzes your query and automatically selects the best model — math questions go to math-capable models, coding questions to DeepSeek or Llama 3.3, image tasks to Gemini, and so on. It\'s recommended for most users.',
          },
          {
            q: 'Which models are completely free with no limits?',
            a: 'HuggingFace models (Llama 3.2 1B, Llama 3.1 70B, Qwen 2.5 7B, DeepSeek V3.2, RNJ-1) and OpenRouter Auto free tier have no usage limits. These are marked "Free" in the model selector.',
          },
          {
            q: 'Which model is fastest?',
            a: 'Groq\'s Llama 3.1 8B Instant is the fastest — Groq\'s hardware is purpose-built for ultra-low latency inference. Use it when you need quick answers and speed matters more than depth.',
          },
          {
            q: 'Which model is best for coding?',
            a: 'DeepSeek V3.2 (HuggingFace) is the best coding model available in SOHAM. For general programming questions, Llama 3.1 70B also performs very well. Auto mode will route coding questions to these models automatically.',
          },
        ]}
      />

      <FAQSection
        id="features"
        title="Features & Commands"
        icon={MessageSquare}
        questions={[
          {
            q: 'What are slash commands?',
            a: 'Slash commands are shortcuts that route your query to a specialized pipeline. /solve routes to math/coding models with step-by-step output. /search triggers DuckDuckGo web search. /summarize condenses long text into key points. You can also just ask naturally — SOHAM understands intent.',
          },
          {
            q: 'Does web search trigger automatically?',
            a: 'Yes. SOHAM\'s intent detector scans every message for signals that need real-time data — keywords like "today", "latest", "current", "news", "price", "who is the current...", etc. When detected, it automatically fetches DuckDuckGo results and synthesizes them with source links.',
          },
          {
            q: 'How does voice input work?',
            a: 'Click the microphone icon next to the message input. Allow microphone access when prompted. Speak clearly — Groq Whisper V3 Turbo transcribes your speech in real time. The transcription appears in the input field for you to review before sending.',
          },
          {
            q: 'How does text-to-speech work?',
            a: 'Enable speech output in settings and choose a voice (troy, diana, hannah, autumn, austin, or daniel). You can also click the speaker icon on any assistant message to hear it read aloud. SOHAM uses Groq\'s Orpheus TTS with a fallback chain to Edge TTS and browser TTS.',
          },
          {
            q: 'How does image generation work?',
            a: 'Type "generate an image of..." or "create a picture of..." in chat. SOHAM routes this to the image generation pipeline using HuggingFace FLUX.1-schnell. The generated image appears inline in the chat with download and preview options.',
          },
          {
            q: 'How does PDF analysis work?',
            a: 'Go to /ai-services or /pdf-analyzer. Upload a PDF (up to 5 MB). Ask questions about the document — SOHAM extracts text, analyzes content, and answers your questions. Great for research papers, contracts, reports, and documentation.',
          },
          {
            q: 'Does SOHAM remember our conversation?',
            a: 'Yes, within a session. The AI maintains full context across all messages in a conversation. You can reference earlier messages naturally: "explain that differently" or "give me another example of what you showed earlier."',
          },
        ]}
      />

      <FAQSection
        id="technical"
        title="Technical Issues & Troubleshooting"
        icon={Settings}
        questions={[
          {
            q: 'The AI isn\'t responding or is very slow',
            a: 'Try: (1) Refresh the page. (2) Check your internet connection. (3) Switch to a different model in settings — free HuggingFace models may be slower during peak times. (4) Try a Groq model for fastest response. (5) Clear browser cache if the issue persists.',
          },
          {
            q: 'Voice input isn\'t working',
            a: 'Check that your browser has microphone permissions (click the lock icon in the address bar). Make sure your microphone works in other apps. Voice input requires HTTPS. Try Chrome or Edge for best compatibility. Disable browser extensions that might block microphone access.',
          },
          {
            q: 'I can\'t install the mobile app',
            a: 'Android: Use Chrome, visit the site, tap the menu (⋮), and select "Add to Home screen." iOS: Use Safari only (not Chrome), tap the share button (□↑), then "Add to Home Screen." Make sure you\'re on the latest browser version.',
          },
          {
            q: 'My settings aren\'t saving',
            a: 'Settings are stored in browser local storage. Make sure cookies and local storage are enabled. Settings won\'t persist in private/incognito mode. Try clearing browser cache and reconfiguring. If using multiple devices, settings don\'t sync automatically.',
          },
          {
            q: 'The AI gave an incorrect answer',
            a: 'Try: (1) Rephrase with more specific details. (2) Use /solve for math/coding, /search for current info. (3) Switch to a different model manually. (4) For current events, make sure web search triggered (you\'ll see source links in the response). (5) Ask the AI to "try again" or "reconsider."',
          },
          {
            q: 'Image generation failed',
            a: 'HuggingFace free tier has rate limits. Wait a few minutes and try again. Make sure your prompt is clear and descriptive. Avoid prompts that might violate content policies. Try simplifying the prompt if it\'s very complex.',
          },
        ]}
      />

      <FAQSection
        id="mobile"
        title="Mobile & PWA"
        icon={Smartphone}
        questions={[
          {
            q: 'How do I install SOHAM on my phone?',
            a: 'SOHAM is a Progressive Web App (PWA). Android: Open in Chrome → menu (⋮) → "Add to Home screen." iOS: Open in Safari → share button (□↑) → "Add to Home Screen." The app will work like a native app with its own icon.',
          },
          {
            q: 'Does the installed app work offline?',
            a: 'The app shell loads offline (you can open it without internet). However, generating new AI responses requires an internet connection. Previously loaded conversations are accessible offline.',
          },
          {
            q: 'Why install instead of using the browser?',
            a: 'The installed PWA gives you: full-screen experience without browser UI, faster loading with cached resources, home screen icon for quick access, and better integration with your device\'s app switcher.',
          },
        ]}
      />

      <FAQSection
        id="privacy"
        title="Privacy & Security"
        icon={Shield}
        questions={[
          {
            q: 'Is my data safe?',
            a: 'Yes. Conversations are stored locally in your browser\'s local storage — not on SOHAM servers. We use HTTPS for all connections. We don\'t log or monitor your conversations. Your privacy is a core design principle.',
          },
          {
            q: 'Do you use my conversations to train AI models?',
            a: 'No. Your conversations are not used to train AI models and are not shared with model providers for training purposes.',
          },
          {
            q: 'Can I delete my conversation history?',
            a: 'Yes. Clear conversation history anytime through the settings panel or by clearing your browser\'s local storage for soham-ai.vercel.app.',
          },
        ]}
      />

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>Can't find the answer? Get in touch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">📧 Email Support</h4>
              <p className="text-sm text-muted-foreground">
                Send a detailed message about your issue.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">📚 More Docs</h4>
              <p className="text-sm text-muted-foreground">
                Browse all guides and tutorials.
              </p>
              <Link href="/documentation">
                <Button variant="outline" size="sm">
                  Browse Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FAQSection({
  id,
  title,
  icon: Icon,
  questions,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: Array<{q: string; a: string}>;
}) {
  return (
    <div id={id} className="space-y-4 scroll-mt-20">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </h2>
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((faq, i) => (
              <AccordionItem key={i} value={`${id}-${i}`} className="px-6">
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
