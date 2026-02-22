'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Cpu, 
  MessageSquare, 
  Settings, 
  Shield,
  Smartphone,
  Zap,
  Search,
  Calculator,
  Image,
  Volume2,
  Mic,
  ArrowRight
} from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="font-medium">Frequently Asked Questions</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          FAQ & Troubleshooting
        </h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about CodeEx AI features, setup, and usage.
        </p>
      </div>

      {/* Quick Help */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Need Quick Help?
          </CardTitle>
          <CardDescription>
            Jump to specific sections or contact support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <QuickHelpCard
              title="Getting Started"
              description="Setup and first steps"
              href="#getting-started"
              icon={Zap}
            />
            <QuickHelpCard
              title="AI Models"
              description="Model selection and usage"
              href="#ai-models"
              icon={Cpu}
            />
            <QuickHelpCard
              title="Features"
              description="Commands and capabilities"
              href="#features"
              icon={MessageSquare}
            />
            <QuickHelpCard
              title="Technical Issues"
              description="Troubleshooting problems"
              href="#technical"
              icon={Settings}
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {/* Getting Started */}
        <FAQSection
          id="getting-started"
          title="Getting Started"
          icon={Zap}
          questions={[
            {
              question: "What is CodeEx AI?",
              answer: "CodeEx AI is an intelligent multi-model assistant that helps with coding, math, learning, and creative tasks. It automatically selects the best AI model for each query from 13+ available options, providing optimal results without manual configuration."
            },
            {
              question: "How do I start using CodeEx AI?",
              answer: "Simply visit the chat interface and start typing your questions. The AI will automatically understand your query and provide helpful responses. No setup or configuration is required to get started."
            },
            {
              question: "Is CodeEx AI free to use?",
              answer: "Yes! CodeEx AI offers free access to multiple AI models including HuggingFace models, OpenRouter free tier, and 5 daily image generations. Some premium models may have usage limits, but core functionality is completely free."
            },
            {
              question: "Do I need to create an account?",
              answer: "No account is required for basic usage. However, creating an account allows you to save your conversation history, customize settings, and access additional features like personalized responses."
            },
            {
              question: "What types of questions can I ask?",
              answer: "You can ask about programming, mathematics, general knowledge, get help with homework, solve equations, generate images, search the web, analyze documents, and much more. The AI adapts to your needs automatically."
            }
          ]}
        />

        {/* AI Models */}
        <FAQSection
          id="ai-models"
          title="AI Models & Selection"
          icon={Cpu}
          questions={[
            {
              question: "How many AI models are available?",
              answer: "CodeEx AI provides access to 13+ AI models from multiple providers including Groq, HuggingFace, Google, and OpenRouter. Models are specialized for different tasks like coding, math, conversation, and image generation."
            },
            {
              question: "What is Auto mode and should I use it?",
              answer: "Auto mode is our smart routing system that automatically selects the best model for each query. It's recommended for most users as it provides optimal results without manual selection. Math questions go to math models, coding questions to programming models, etc."
            },
            {
              question: "Can I choose a specific model?",
              answer: "Yes! You can manually select any available model through the settings panel. This is useful for advanced users who want consistent behavior from a specific model or are testing model capabilities."
            },
            {
              question: "Which models are completely free?",
              answer: "Several models are completely free including HuggingFace models (Llama 3.2, Qwen 2.5, etc.) and OpenRouter's free tier. These have no usage limits and provide excellent performance for most tasks."
            },
            {
              question: "How do I know which model is being used?",
              answer: "In Auto mode, the system transparently selects models based on your query type. You can see the current model selection in the settings panel, and responses will indicate if a specific specialized model was used."
            }
          ]}
        />

        {/* Features */}
        <FAQSection
          id="features"
          title="Features & Commands"
          icon={MessageSquare}
          questions={[
            {
              question: "What are slash commands?",
              answer: "Slash commands are special shortcuts that trigger specific features. Use /solve for math and coding problems, /search for web searches, and /summarize for text condensation. Commands help the AI understand exactly what you want to do."
            },
            {
              question: "How does voice input work?",
              answer: "Click the microphone icon next to the message input to start voice recording. Speak your question clearly, and the AI will convert your speech to text automatically. This feature works on both desktop and mobile devices."
            },
            {
              question: "Can the AI speak responses aloud?",
              answer: "Yes! Enable speech output in settings to hear AI responses read aloud. Choose from 4 different voices and adjust speech rate and pitch to your preference. Great for accessibility and multitasking."
            },
            {
              question: "How does image generation work?",
              answer: "CodeEx AI provides 5 free image generations per day using multiple HuggingFace models. Visit the AI Services dashboard, describe your desired image, choose a style, and generate high-quality AI art in seconds."
            },
            {
              question: "Can I analyze PDF documents?",
              answer: "Yes! Use the PDF analyzer in the AI Services dashboard to upload documents and ask questions about their content. The AI can extract information, provide summaries, and answer specific questions about your PDFs."
            },
            {
              question: "Does it remember our conversation?",
              answer: "Yes, the AI maintains context throughout your conversation session. It remembers previous questions and answers, allowing for natural follow-up questions and building on earlier discussions."
            }
          ]}
        />

        {/* Technical Issues */}
        <FAQSection
          id="technical"
          title="Technical Issues & Troubleshooting"
          icon={Settings}
          questions={[
            {
              question: "The AI isn't responding or seems slow",
              answer: "This could be due to high server load or network issues. Try refreshing the page, checking your internet connection, or switching to a different model in settings. Free models may have higher latency during peak times."
            },
            {
              question: "Voice input isn't working",
              answer: "Ensure your browser has microphone permissions enabled. Check that your microphone is working in other applications. Try using an incognito/private window to rule out extension conflicts. Voice input requires HTTPS connection."
            },
            {
              question: "I can't install the mobile app",
              answer: "For Android, use Chrome browser and look for the 'Add to Home screen' option. For iOS, use Safari and tap the share button, then 'Add to Home Screen'. Make sure you're on the latest browser version and have sufficient storage space."
            },
            {
              question: "My settings aren't saving",
              answer: "Settings are stored in your browser's local storage. Ensure cookies and local storage are enabled. If using private/incognito mode, settings won't persist. Try clearing browser cache and reconfiguring settings."
            },
            {
              question: "Image generation says I've reached my limit",
              answer: "Free users get 5 image generations per day, which reset at midnight UTC. The limit is per browser session for anonymous users, or per account for registered users. Wait for the daily reset or create an account for individual limits."
            },
            {
              question: "The AI gave an incorrect or unhelpful answer",
              answer: "Try rephrasing your question with more specific details. Use slash commands for specialized tasks (/solve for math, /search for current info). Consider switching to a different model manually if Auto mode isn't working well for your use case."
            }
          ]}
        />

        {/* Mobile & Installation */}
        <FAQSection
          id="mobile"
          title="Mobile & Installation"
          icon={Smartphone}
          questions={[
            {
              question: "How do I install CodeEx AI on my phone?",
              answer: "CodeEx AI is a Progressive Web App (PWA). On Android, use Chrome and tap 'Add to Home screen'. On iOS, use Safari, tap the share button, then 'Add to Home Screen'. The app will work like a native mobile app."
            },
            {
              question: "Does the mobile app work offline?",
              answer: "The app can be opened offline and you can view previous conversations, but generating new responses requires an internet connection. The app caches resources for faster loading when you're back online."
            },
            {
              question: "Can I use voice features on mobile?",
              answer: "Yes! Voice input and speech output work great on mobile devices. The mobile interface is optimized for touch with large buttons and easy access to voice features. Perfect for hands-free usage."
            },
            {
              question: "Why should I install it instead of using the browser?",
              answer: "The installed app provides a full-screen experience without browser UI, faster loading with cached resources, offline access to previous chats, and better integration with your device's home screen and app switcher."
            }
          ]}
        />

        {/* Privacy & Security */}
        <FAQSection
          id="privacy"
          title="Privacy & Security"
          icon={Shield}
          questions={[
            {
              question: "Is my data safe and private?",
              answer: "Yes! Your conversations are stored locally in your browser and are not logged or monitored. We use secure HTTPS connections and don't store personal information. Your privacy is our priority."
            },
            {
              question: "Are my conversations saved permanently?",
              answer: "Conversations are stored in your browser's local storage by default. You can configure this in settings to clear conversations after each session, after 7 days, or keep them until manually cleared."
            },
            {
              question: "Do you use my data to train AI models?",
              answer: "No, we do not use your conversations or data to train AI models. Your interactions remain private and are not shared with model providers or third parties for training purposes."
            },
            {
              question: "Can I delete my conversation history?",
              answer: "Yes, you can clear your conversation history at any time through the settings panel. You can also configure automatic deletion after specific time periods for enhanced privacy."
            }
          ]}
        />
      </div>

      {/* Still Need Help */}
      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>
            Can't find the answer you're looking for? Get in touch with our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">📧 Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  Send us a detailed message about your issue or question.
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">
                    Contact Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">📚 Documentation</h4>
                <p className="text-sm text-muted-foreground">
                  Explore our comprehensive guides and tutorials.
                </p>
                <Link href="/docs">
                  <Button variant="outline" size="sm">
                    Browse Docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 When Contacting Support</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Describe the specific issue you're experiencing</li>
                <li>• Include your browser type and version</li>
                <li>• Mention if you're using mobile or desktop</li>
                <li>• Share any error messages you see</li>
                <li>• Let us know what you were trying to do when the issue occurred</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickHelpCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <a href={href} className="block">
      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
        <Icon className="h-4 w-4 text-primary" />
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </a>
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
  questions: Array<{
    question: string;
    answer: string;
  }>;
}) {
  return (
    <div id={id} className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </h2>
      
      <Card>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((faq, index) => (
              <AccordionItem key={index} value={`${id}-${index}`} className="px-6">
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}