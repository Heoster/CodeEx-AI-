'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SohamCore, type CoreMode } from '@/components/landing/soham-core';

interface HeroFeature {
  mode: CoreMode;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TrustStat {
  label: string;
  value: string;
}

interface HeroProps {
  activeMode: CoreMode;
  setActiveMode: (mode: CoreMode) => void;
  heroFeatures: HeroFeature[];
  trustStats: TrustStat[];
  sectionVariant: {
    initial: { opacity: number; y: number };
    whileInView: { opacity: number; y: number };
    viewport: { once: boolean; amount: number };
    transition: { duration: number; ease: [number, number, number, number] };
  };
}

export function DesktopLandingHero({ activeMode, setActiveMode, heroFeatures, trustStats, sectionVariant }: HeroProps) {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24">
      <motion.div {...sectionVariant} className="relative z-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100">
          <ShieldCheck className="h-3.5 w-3.5" />
          Production AI workspace
        </div>

        <h1 className="font-[family:var(--font-manrope)] text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
          <span className="glass-heading block">SOHAM</span>
          <span className="mt-3 block text-xl font-medium tracking-[0.16em] text-slate-300 sm:text-2xl">
            Self Organising Hyper Adaptive Machine
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          SOHAM is the flagship product from CODEEX-AI. It brings AI chat, PDF analysis, image math solving,
          voice access, and multi-model routing into one professional workspace built for daily use.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="h-12 border-0 bg-[linear-gradient(135deg,#00f2ff,#7000ff)] px-7 text-white shadow-[0_20px_50px_rgba(58,0,255,0.32)] hover:opacity-95">
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/documentation">
            <Button size="lg" variant="outline" className="h-12 border-white/15 bg-white/6 px-7 text-slate-100 backdrop-blur-md hover:bg-white/10">
              Explore Documentation
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-sm text-slate-400">Free to start. Built for phone and desktop. No credit card required.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {heroFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.title}
                whileHover={{ rotateX: -4, rotateY: 6, y: -6 }}
                transition={{ duration: 0.22 }}
                className="feature-plane text-left"
                onMouseEnter={() => setActiveMode(feature.mode)}
                onFocus={() => setActiveMode(feature.mode)}
                onMouseLeave={() => setActiveMode('general')}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-white">{feature.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{feature.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div {...sectionVariant} transition={{ ...sectionVariant.transition, delay: 0.08 }} className="relative z-10">
        <div className="core-shell">
          <div className="core-backdrop core-backdrop-a" />
          <div className="core-backdrop core-backdrop-b" />
          <div className="glass-orb-panel">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">SOHAM Core</p>
                <p className="mt-1 text-xl font-semibold text-white">Live product overview</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-cyan-100">
                {activeMode}
              </span>
            </div>
            <SohamCore mode={activeMode} />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {trustStats.map((stat) => (
                <div key={stat.label} className="info-glass-card">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-100">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function MobileLandingHero({ activeMode, setActiveMode, heroFeatures, trustStats, sectionVariant }: HeroProps) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8">
      <motion.div {...sectionVariant} className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
          <ShieldCheck className="h-3.5 w-3.5" />
          Production AI workspace
        </div>

        <h1 className="font-[family:var(--font-manrope)] text-4xl font-semibold leading-[0.95] text-white sm:text-5xl">
          <span className="glass-heading block">SOHAM</span>
          <span className="mt-3 block text-base font-medium tracking-[0.12em] text-slate-300 sm:text-lg">
            Self Organising Hyper Adaptive Machine
          </span>
        </h1>

        <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
          SOHAM brings chat, PDF analysis, image math solving, and multi-model routing into one secure product that works well on a phone.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/login">
            <Button className="h-11 w-full border-0 bg-[linear-gradient(135deg,#00f2ff,#7000ff)] text-white hover:opacity-95">
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/ai-services">
            <Button variant="outline" className="h-11 w-full border-white/15 bg-white/6 text-slate-100 hover:bg-white/10">
              View AI Services
            </Button>
          </Link>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">SOHAM Core</p>
              <p className="mt-1 text-lg font-semibold text-white">Mobile product overview</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-cyan-100">
              {activeMode}
            </span>
          </div>
          <SohamCore mode={activeMode} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {trustStats.map((stat) => (
              <div key={stat.label} className="info-glass-card">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-sm font-medium text-slate-100">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {heroFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button key={feature.title} className="feature-plane text-left" onClick={() => setActiveMode(feature.mode)}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{feature.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{feature.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
