
'use client';

import {
  ArrowRight,
  MessageSquare,
  ScanLine,
  Terminal,
  Mic,
  Library,
  History,
  Shield,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const features = [
  {
    icon: <MessageSquare />,
    title: 'Dynamic AI Conversations',
    description:
      'Engage in natural, context-aware dialogues. Our AI remembers your conversation history and adapts its tone and technical level based on your preferences.',
    imageSrc: '/eng.png',
    imageHint: 'chat bubbles interface',
  },
  {
    icon: <Library />,
    title: 'Multi-Chat Management',
    description:
      'Organize your thoughts. Create and manage multiple chat sessions simultaneously, keeping your different projects and topics neatly separated.',
    imageSrc: '/Multi-Chat.png',
    imageHint: 'project management dashboard',
  },
  {
    icon: <History />,
    title: 'Persistent Chat History',
    description:
      'Never lose a thought. Your conversations are automatically saved to your device, allowing you to pick up right where you left off, anytime.',
    imageSrc: '/Hist.png',
    imageHint: 'cloud storage sync',
  },
  {
    icon: <ScanLine />,
    title: 'Visual Problem Solver',
    description:
      'Go beyond text. Upload an image of a handwritten math equation, and our AI will recognize, solve, and provide a step-by-step solution.',
    imageSrc: '/an.png',
    imageHint: 'math equation blackboard',
  },
  {
    icon: <Terminal />,
    title: 'Integrated Command System',
    description:
      'Take control with powerful slash commands. Instantly get answers with `/solve` or get concise summaries of long texts with `/summarize`.',
    imageSrc: '/com.png',
    imageHint: 'code terminal screen',
  },
  {
    icon: <Search />,
    title: 'Real-Time Web Search',
    description:
      'Get up-to-the-minute answers. Use the `/search` command to have the AI browse the web and provide grounded responses with citations.',
    imageSrc: '/search.png',
    imageHint: 'search engine results',
  },
  {
    icon: <Mic />,
    title: 'Voice-Enabled Interaction',
    description:
      'Interact hands-free with full voice support. Use your microphone to talk to the AI and enable speech output to hear its responses aloud.',
    imageSrc: '/web.png',
    imageHint: 'soundwave interface',
  },
  {
    icon: <Shield />,
    title: 'Secure Authentication',
    description:
      'Leverage Firebase for secure and reliable user authentication, supporting both email/password and Google sign-in methods.',
    imageSrc: '/security.png',
    imageHint: 'secure login shield',
  },
];

export default function AiAgentPlatformPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // We can only check localStorage on the client, and we should wait for auth to be ready.
    if (typeof window === 'undefined' || loading) {
      return;
    }

    // Check if app is running as installed PWA (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;

    // If running as PWA, skip landing page and go directly to chat/login
    if (isStandalone) {
      router.push(user ? '/chat' : '/login');
      return;
    }

    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

    if (user && hasVisitedBefore) {
      // If the user is logged in and has visited before, redirect to the chat page.
      router.push('/chat');
    } else if (!hasVisitedBefore) {
      // On the very first visit, set the flag so next time they'll be redirected.
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="CODEEX AI Logo"
              width={28}
              height={28}
            />
            <span className="text-lg md:text-xl font-bold text-foreground">CODEEX AI</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/test-models-ui"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Test Models
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/documentation"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-border py-12 md:py-16 lg:py-28">
            <div className="hero-decor absolute inset-0 -z-10" />
            <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
              <div className="grid items-center gap-6 md:gap-8 md:grid-cols-2">
                <div className="text-center md:text-left">
                  <h1 className="hero-title">
                    CODEEX AI —
                    <span className="block gradient-text">Conversational Intelligence</span>
                  </h1>

                  <p className="mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
                    Intelligent conversations, instant answers, and visual problem solving —
                    an approachable AI assistant built to help you learn, code, and create.
                  </p>

                  <div className="mt-6 md:mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                    <Link href="/login">
                      <Button size="lg" className="btn-gradient">
                        Get Started
                        <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                    <Link href="/documentation">
                      <Button size="lg" variant="ghost" className="border border-border">
                        Explore Docs
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-4 md:mt-6 flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                    <span className="badge text-xs md:text-sm">Chat</span>
                    <span className="badge text-xs md:text-sm">Visual Math</span>
                    <span className="badge text-xs md:text-sm">/search</span>
                    <span className="badge text-xs md:text-sm">Voice</span>
                  </div>
                </div>

                <div className="order-first md:order-last flex items-center justify-center">
                  <div className="hero-card w-full max-w-md rounded-2xl border border-border p-4 md:p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Live demo</h3>
                        <p className="text-sm text-muted-foreground">Try a short conversation and see how the assistant responds.</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MessageSquare />
                      </div>
                    </div>
                    <div className="mt-4 h-40 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4">
                      <div className="text-sm text-muted-foreground">You: How do I center a div?</div>
                      <div className="mt-3 rounded bg-background/60 p-3 text-sm">AI: Use flexbox: <code className="font-mono">display:flex; place-items:center;</code></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Features Section */}
        <section id="features" className="bg-background py-12 md:py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 md:mb-12 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                A Hands-On AI Experience
              </h2>
              <p className="mt-3 md:mt-4 max-w-3xl mx-auto text-base md:text-lg text-muted-foreground">
                This isn&apos;t just a demo. It&apos;s a fully-functional application
                showcasing real-world AI capabilities you can use right now.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col gap-4 feature-card">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                    <Image
                      src={feature.imageSrc}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                      data-ai-hint={feature.imageHint}
                    />
                    <div className="feature-image-overlay" aria-hidden />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-background py-12 md:py-16 lg:py-20 text-center">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Ready to Dive In?
            </h2>
            <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
              Create an account to save your chat history and start exploring
              all the features.
            </p>
            <div className="mt-6 md:mt-8">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Get Started with CODEEX AI{' '}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 md:px-6">
          <div className="grid grid-cols-2 gap-6 md:gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/favicon.ico"
                  alt="CODEEX AI Logo"
                  width={28}
                  height={28}
                />
                <span className="text-xl font-bold text-foreground">CODEEX AI</span>
              </Link>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documentation"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="https://github.com/Heoster" className="text-muted-foreground hover:text-foreground">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="https://www.instagram.com/codeex._.heoster/" className="text-muted-foreground hover:text-foreground">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CODEEX AI. All rights reserved.</p>
            <p className="mt-1">CodeEx powered by Heoster.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
