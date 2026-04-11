'use client';

import { motion } from 'framer-motion';
import { Manrope } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AudioLines,
  CheckCircle2,
  FileText,
  History,
  LockKeyhole,
  MessageSquare,
  ScanSearch,
  ShieldCheck,
  UserRound,
  Waves,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeuralLatticeBackground } from '@/components/landing/neural-lattice-background';
import { type CoreMode } from '@/components/landing/soham-core';
import { DesktopLandingHeader, MobileLandingHeader } from '@/components/landing/landing-header';
import { DesktopLandingHero, MobileLandingHero } from '@/components/landing/landing-hero';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { useAuth } from '@/hooks/use-auth';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

const heroFeatures = [
  {
    mode: 'chat' as CoreMode,
    title: 'AI chat for real work',
    description: 'Ask, iterate, compare models, and keep one thread moving without jumping between tools.',
    icon: MessageSquare,
  },
  {
    mode: 'pdf' as CoreMode,
    title: 'PDF analyzer',
    description: 'Read contracts, notes, reports, and study material with direct questions and usable answers.',
    icon: FileText,
  },
  {
    mode: 'vision' as CoreMode,
    title: 'Image math solver',
    description: 'Upload handwritten or printed equations and get a clear, step-by-step solution.',
    icon: ScanSearch,
  },
  {
    mode: 'voice' as CoreMode,
    title: 'Voice access',
    description: 'Use speech input and playback when typing is slower than talking through the task.',
    icon: AudioLines,
  },
];

const trustStats = [
  { label: 'Reach', value: DEVELOPER_INFO.projectStats.countriesReached },
  { label: 'Uptime', value: DEVELOPER_INFO.projectStats.uptime },
  { label: 'Models', value: `${DEVELOPER_INFO.projectStats.modelsIntegrated}+` },
  { label: 'Stack', value: 'Next.js, Firebase, multi-provider routing' },
];

const workflowCards = [
  {
    title: 'One workspace for chat, documents, and visual problem solving',
    text: 'SOHAM is structured around real workflows. Open chat, analyze a PDF, or solve from an image without resetting context or moving to a different product.',
    image: '/Multi-Chat.png',
    href: '/ai-services',
  },
  {
    title: 'Production-ready interfaces, not demo screens',
    text: 'The product surface is built for daily use: account access, protected tools, mobile support, saved settings, and a clearer system structure.',
    image: '/search.png',
    href: '/chat',
  },
];

const comparisonRows = [
  ['Model access', '35+ models inside one product', 'Model access spread across separate tools'],
  ['Workflows', 'Chat, PDFs, image math, and voice in one system', 'A different app or tab for each task'],
  ['Access control', 'Protected routes for core tools and account-aware workflows', 'Mixed public/private flows'],
  ['User continuity', 'Saved settings and local chat handling for signed-in sessions', 'Context is often fragmented'],
];

const securityRows = [
  'Local chat storage is surfaced as a product security feature so users know where session history lives.',
  'Protected access for chat, AI Services, PDF Analyzer, and Image Math Solver.',
  'Firebase authentication, HTTPS in transit, and visible account-management flows.',
  'Clear company and product identity through separate CODEEX-AI and SOHAM pages.',
];

const sectionVariant = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
};

export function LandingPageShell({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeMode, setActiveMode] = useState<CoreMode>('general');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      router.push(user ? '/chat' : '/login');
      return;
    }

    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (user && hasVisitedBefore) {
      router.push('/chat');
    } else if (!hasVisitedBefore) {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`${manrope.variable} neural-obsidian min-h-screen text-slate-100`}>
      <NeuralLatticeBackground />

      {isMobile ? (
        <MobileLandingHeader
          isScrolled={isScrolled}
          mobileNavOpen={mobileNavOpen}
          onToggleMobileNav={() => setMobileNavOpen((open) => !open)}
        />
      ) : (
        <DesktopLandingHeader isScrolled={isScrolled} />
      )}

      <main>
        {isMobile ? (
          <MobileLandingHero
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            heroFeatures={heroFeatures}
            trustStats={trustStats}
            sectionVariant={sectionVariant}
          />
        ) : (
          <DesktopLandingHero
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            heroFeatures={heroFeatures}
            trustStats={trustStats}
            sectionVariant={sectionVariant}
          />
        )}

        <motion.section {...sectionVariant} className="liquid-section border-y border-white/10">
          <div className={`mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 ${isMobile ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} sm:px-6`}>
            {[
              '35+ integrated models',
              'Route-protected core tools',
              'Local chat storage highlighted as a security control',
              'Phone and desktop ready',
            ].map((item) => (
              <div key={item} className="stat-glow-chip">
                {item}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionVariant} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-8 max-w-3xl">
            <p className="section-kicker">Adaptive Workflows</p>
            <h2 className="section-title">The landing page should explain the product in plain terms</h2>
            <p className="section-copy">
              The important thing is not decoration. It is whether a visitor can understand what SOHAM does,
              how it is structured, and why it is safe enough to use for everyday work.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {workflowCards.map((card, index) => (
              <motion.div
                key={card.title}
                whileHover={{ rotateX: -5, rotateY: index % 2 === 0 ? 6 : -6, y: -8 }}
                transition={{ duration: 0.24 }}
                className="workflow-card"
              >
                <Link href={card.href}>
                  <div className="relative aspect-[1.05/1] overflow-hidden rounded-[24px] border border-white/10">
                    <Image src={card.image} alt={card.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.88))]" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#050505]/55 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-100">
                      Product route
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xl font-semibold text-white">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{card.text}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section {...sectionVariant} className="liquid-section border-y border-white/10">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="section-kicker">Why SOHAM</p>
              <h2 className="section-title">One product surface instead of scattered AI utilities</h2>
              <p className="section-copy">
                The value is not the model list alone. The value is that chat, documents, visual solving,
                account access, and security controls are assembled into one usable system.
              </p>
            </div>

            <div className="comparison-surface">
              <div className="comparison-head">
                <span>Capability</span>
                <span>SOHAM</span>
                <span>Typical Setup</span>
              </div>
              {comparisonRows.map(([label, soham, other]) => (
                <div key={label} className="comparison-row">
                  <span className="font-medium text-slate-100">{label}</span>
                  <span className="text-slate-200">{soham}</span>
                  <span className="text-slate-400">{other}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionVariant} className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="panel-card">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                <UserRound className="h-3.5 w-3.5" />
                Company Context
              </div>
              <h2 className="section-title !text-3xl">A real product should have a visible owner</h2>
              <p className="mt-4 text-sm leading-8 text-slate-300">
                SOHAM is the flagship product. CODEEX-AI is the company behind it. The founder story, product page,
                and company page are public so users can place the software in a real business context.
              </p>
              <p className="mt-4 text-sm leading-8 text-slate-400">Mission: {DEVELOPER_INFO.mission}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/soham">
                  <Button variant="outline" className="border-white/15 bg-white/6 text-slate-100 hover:bg-white/10">
                    About SOHAM
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-white/15 bg-white/6 text-slate-100 hover:bg-white/10">
                    About CODEEX-AI
                  </Button>
                </Link>
              </div>
            </div>

            <div className="panel-card">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                <LockKeyhole className="h-3.5 w-3.5" />
                Security
              </div>
              <h2 className="section-title !text-3xl">Local chat storage is treated as a user-control feature</h2>
              <p className="mt-4 text-sm leading-8 text-slate-300">
                SOHAM surfaces local chat storage as part of the security story. That matters because users should know
                when history stays on the device, when account access is required, and how protected routes work before they trust the system.
              </p>
              <div className="mt-5 grid gap-3">
                {securityRows.map((item) => (
                  <div key={item} className="security-row">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-cyan-200" />
                    <p className="text-sm leading-7 text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/privacy">
                  <Button variant="outline" className="border-white/15 bg-white/6 text-slate-100 hover:bg-white/10">
                    Privacy & Data Security
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" className="border-white/15 bg-white/6 text-slate-100 hover:bg-white/10">
                    Terms of Service
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...sectionVariant} className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
          <div className="cta-surface">
            <div>
              <p className="section-kicker">Launch Experience</p>
              <h2 className="section-title">Built for production use, not for a screenshot</h2>
              <p className="section-copy max-w-2xl">
                If you need a multi-model AI product with protected tools, document workflows, visual solving,
                and a clearer security story, SOHAM is ready to use now.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <History className="h-4 w-4 text-cyan-200" />
                  Local chat storage surfaced clearly
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-200" />
                  Protected tool access
                </span>
                <span className="inline-flex items-center gap-2">
                  <Waves className="h-4 w-4 text-cyan-200" />
                  Voice, PDF, and visual workflows
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/login">
                <Button size="lg" className="h-12 border-0 bg-[linear-gradient(135deg,#00f2ff,#7000ff)] px-7 text-white hover:opacity-95">
                  Open SOHAM
                </Button>
              </Link>
              <Link href="/ai-services">
                <Button size="lg" variant="outline" className="h-12 border-white/15 bg-white/6 px-7 text-slate-100 hover:bg-white/10">
                  View AI Services
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/10 bg-[#050505]/70 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/FINALSOHAM.png" alt="SOHAM logo" width={34} height={34} />
              <div>
                <p className="text-sm font-semibold text-slate-100">SOHAM</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Production AI Workspace</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/chat" className="text-slate-300 hover:text-white">AI Chat</Link>
              <Link href="/pdf-analyzer" className="text-slate-300 hover:text-white">PDF Analyzer</Link>
              <Link href="/visual-math" className="text-slate-300 hover:text-white">Image Math</Link>
              <Link href="/documentation" className="text-slate-300 hover:text-white">Documentation</Link>
              <Link href="/privacy" className="text-slate-300 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-slate-300 hover:text-white">Terms</Link>
              <Link href="/soham" className="text-slate-300 hover:text-white">About SOHAM</Link>
              <Link href="/about" className="text-slate-300 hover:text-white">About CODEEX-AI</Link>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} CODEEX-AI. All rights reserved.</p>
            <p className="mt-1">Self Organising Hyper Adaptive Machine</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .neural-obsidian {
          background: linear-gradient(180deg, #050505 0%, #0a0a15 45%, #050505 100%);
        }

        .glass-heading {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(155, 240, 255, 0.78) 34%, rgba(179, 154, 255, 0.78) 68%, rgba(255, 255, 255, 0.92));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 30px rgba(0, 242, 255, 0.12);
          filter: drop-shadow(0 8px 26px rgba(112, 0, 255, 0.18));
        }

        .feature-plane {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03));
          backdrop-filter: blur(22px);
          border-radius: 28px;
          padding: 1.35rem;
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.22);
          transform-style: preserve-3d;
        }

        .core-shell {
          position: relative;
          min-height: 600px;
          perspective: 1600px;
        }

        .core-backdrop {
          position: absolute;
          border-radius: 999px;
          filter: blur(48px);
          opacity: 0.8;
        }

        .core-backdrop-a {
          top: 8%;
          left: 12%;
          height: 180px;
          width: 180px;
          background: rgba(0, 242, 255, 0.18);
        }

        .core-backdrop-b {
          right: 10%;
          bottom: 12%;
          height: 220px;
          width: 220px;
          background: rgba(112, 0, 255, 0.22);
        }

        .glass-orb-panel {
          position: relative;
          z-index: 1;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
          backdrop-filter: blur(30px);
          border-radius: 36px;
          padding: 1.5rem;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.28);
        }

        .info-glass-card {
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 22px;
          padding: 1rem;
        }

        .liquid-section {
          position: relative;
          background:
            radial-gradient(circle at top left, rgba(0, 242, 255, 0.09), transparent 28%),
            radial-gradient(circle at bottom right, rgba(112, 0, 255, 0.14), transparent 30%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.01));
        }

        .liquid-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.05), transparent 35%);
          mix-blend-mode: screen;
          opacity: 0.7;
          pointer-events: none;
        }

        .stat-glow-chip {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 999px;
          padding: 0.9rem 1rem;
          text-align: center;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d9e4ff;
          backdrop-filter: blur(14px);
        }

        .section-kicker {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #95a3c3;
        }

        .section-title {
          margin-top: 0.75rem;
          font-family: var(--font-manrope);
          font-size: clamp(2rem, 3vw, 3.4rem);
          line-height: 1.02;
          font-weight: 600;
          color: #fff;
        }

        .section-copy {
          margin-top: 1rem;
          font-size: 0.98rem;
          line-height: 1.9;
          color: #bcc6df;
        }

        .workflow-card {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025));
          border-radius: 32px;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(18px);
          transform-style: preserve-3d;
        }

        .comparison-surface {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025));
          border-radius: 30px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(20px);
        }

        .comparison-head,
        .comparison-row {
          display: grid;
          grid-template-columns: 1.05fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem 1.25rem;
        }

        .comparison-head {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8897b7;
        }

        .comparison-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.92rem;
        }

        .comparison-row:last-child {
          border-bottom: none;
        }

        .panel-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025));
          border-radius: 32px;
          padding: 1.75rem;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .security-row {
          display: flex;
          gap: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 22px;
          padding: 1rem;
        }

        .cta-surface {
          display: grid;
          gap: 2rem;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            radial-gradient(circle at top left, rgba(0, 242, 255, 0.1), transparent 35%),
            radial-gradient(circle at bottom right, rgba(112, 0, 255, 0.16), transparent 35%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025));
          border-radius: 36px;
          padding: 2rem;
          box-shadow: 0 32px 90px rgba(0, 0, 0, 0.26);
          backdrop-filter: blur(22px);
        }

        @media (max-width: 767px) {
          .comparison-head,
          .comparison-row {
            grid-template-columns: 1fr;
          }

          .comparison-head span:nth-child(3),
          .comparison-row span:nth-child(3) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
