'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isScrolled: boolean;
  mobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

const navLinks = [
  { href: '/chat', label: 'AI Chat' },
  { href: '/pdf-analyzer', label: 'PDF Analyzer' },
  { href: '/visual-math', label: 'Image Math' },
  { href: '/documentation', label: 'Documentation' },
  { href: '/privacy', label: 'Privacy' },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/FINALSOHAM.png" alt="SOHAM logo" width={34} height={34} priority />
      <div className="leading-none">
        <p className="font-[family:var(--font-manrope)] text-sm font-semibold tracking-[0.16em] text-white">
          SOHAM
        </p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">by CODEEX-AI</p>
      </div>
    </Link>
  );
}

export function DesktopLandingHeader({ isScrolled }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${
        isScrolled ? 'bg-[#050505]/85 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Brand />

        <nav className="flex items-center gap-6 text-sm text-slate-300">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" className="border-white/15 bg-white/5 text-slate-100 hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="border-0 bg-[linear-gradient(135deg,#00f2ff,#7000ff)] text-white shadow-[0_18px_44px_rgba(72,0,255,0.35)] hover:opacity-95">
              Launch SOHAM
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileLandingHeader({ isScrolled, mobileNavOpen = false, onToggleMobileNav }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${
        isScrolled ? 'bg-[#050505]/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl' : 'bg-[#050505]/70 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Brand />

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button size="sm" className="border-0 bg-[linear-gradient(135deg,#00f2ff,#7000ff)] text-white hover:opacity-95">
              Open
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-200 hover:bg-white/10"
            onClick={onToggleMobileNav}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="border-t border-white/10 bg-[#050505]/95 px-4 py-4 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 text-sm text-slate-200">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
