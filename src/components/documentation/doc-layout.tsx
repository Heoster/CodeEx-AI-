'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  BookOpen,
  MessageSquare,
  Calculator,
  FileText,
  Search,
  Settings,
  HelpCircle,
  Sparkles,
  Brain,
  Code,
  Zap,
  Home,
  Menu,
  Smartphone,
  ChevronLeft,
  Image,
  X,
} from 'lucide-react';

// ─── Navigation tree ─────────────────────────────────────────────────────────

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start',   href: '/documentation/quick-start',   icon: Zap },
      { title: 'Installation',  href: '/documentation/installation',  icon: Home },
      { title: 'PWA Guide',     href: '/documentation/pwa',           icon: Smartphone },
    ],
  },
  {
    title: 'Features',
    items: [
      { title: 'Chat Interface',    href: '/documentation/chat',             icon: MessageSquare },
      { title: 'AI Models',         href: '/documentation/ai-models',        icon: Brain },
      { title: 'Commands',          href: '/documentation/commands',         icon: Code },
      { title: 'Image Generation',  href: '/documentation/image-generation', icon: Image },
      { title: 'Math Solver',       href: '/documentation/math-solver',      icon: Calculator },
      { title: 'PDF Analysis',      href: '/documentation/pdf-analysis',     icon: FileText },
      { title: 'Web Search',        href: '/documentation/web-search',       icon: Search },
      { title: 'Smart Routing',     href: '/documentation/smart-routing',    icon: Sparkles },
      { title: 'Jarvis Mode',       href: '/documentation/jarvis-mode',      icon: Sparkles },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { title: 'Settings',          href: '/documentation/settings',         icon: Settings },
      { title: 'Personalization',   href: '/documentation/personalization',  icon: Sparkles },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'API Reference',     href: '/documentation/api-reference',    icon: Code },
      { title: 'FAQ',               href: '/documentation/faq',              icon: HelpCircle },
    ],
  },
];

// Flat list for breadcrumb lookup
const allItems = navigation.flatMap(s => s.items);

// ─── Sidebar nav (shared between desktop + mobile sheet) ─────────────────────

function SidebarNav({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="space-y-6 pb-8" role="navigation" aria-label="Documentation navigation">
      {navigation.map(section => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ pathname }: { pathname: string }) {
  const current = allItems.find(i => i.href === pathname);
  const section = navigation.find(s => s.items.some(i => i.href === pathname));

  if (!current || pathname === '/documentation') return null;

  return (
    <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
      <Link href="/documentation" className="hover:text-foreground transition-colors">
        Docs
      </Link>
      {section && (
        <>
          <span>/</span>
          <span>{section.title}</span>
        </>
      )}
      <span>/</span>
      <span className="text-foreground font-medium">{current.title}</span>
    </nav>
  );
}

// ─── Prev / Next navigation ───────────────────────────────────────────────────

function PrevNext({ pathname }: { pathname: string }) {
  const idx = allItems.findIndex(i => i.href === pathname);
  if (idx === -1) return null;

  const prev = allItems[idx - 1];
  const next = allItems[idx + 1];

  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="font-medium">{prev.title}</p>
          </div>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={next.href}
          className="group ml-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors hover:bg-muted text-right"
        >
          <div>
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="font-medium">{next.title}</p>
          </div>
          <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground group-hover:text-foreground" />
        </Link>
      ) : <div />}
    </div>
  );
}

// ─── Mobile bottom tab bar ────────────────────────────────────────────────────

function MobileBottomNav({
  pathname,
  onMenuOpen,
}: {
  pathname: string;
  onMenuOpen: () => void;
}) {
  const router = useRouter();
  const idx = allItems.findIndex(i => i.href === pathname);
  const prev = allItems[idx - 1];
  const next = allItems[idx + 1];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-background/95 px-2 pb-safe pt-1 backdrop-blur-sm"
      aria-label="Mobile documentation navigation"
    >
      {/* Back / Prev */}
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center gap-0.5 h-auto py-2 px-3 text-muted-foreground touch-manipulation"
        onClick={() => prev ? router.push(prev.href) : router.push('/documentation')}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-[10px]">{prev ? 'Prev' : 'Home'}</span>
      </Button>

      {/* Docs home */}
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center gap-0.5 h-auto py-2 px-3 text-muted-foreground touch-manipulation"
        asChild
      >
        <Link href="/documentation">
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px]">Docs</span>
        </Link>
      </Button>

      {/* Menu (opens sheet) */}
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center gap-0.5 h-auto py-2 px-3 touch-manipulation"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px]">Menu</span>
      </Button>

      {/* App */}
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center gap-0.5 h-auto py-2 px-3 text-muted-foreground touch-manipulation"
        asChild
      >
        <Link href="/chat">
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px]">Chat</span>
        </Link>
      </Button>

      {/* Next */}
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center gap-0.5 h-auto py-2 px-3 text-muted-foreground touch-manipulation"
        onClick={() => next && router.push(next.href)}
        disabled={!next}
      >
        <ChevronLeft className="h-5 w-5 rotate-180" />
        <span className="text-[10px]">Next</span>
      </Button>
    </nav>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export default function DocLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-background sticky top-0 h-screen">
        <div className="flex items-center gap-2 border-b px-6 py-5">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          <Link
            href="/documentation"
            className="font-semibold text-lg hover:text-primary transition-colors"
            aria-label="Documentation home"
          >
            Documentation
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <SidebarNav pathname={pathname} />
        </ScrollArea>
        <div className="border-t px-4 py-3">
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Back to Chat
          </Link>
        </div>
      </aside>

      {/* ── Mobile top header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/documentation"
          className="flex items-center gap-2 font-semibold text-sm"
          aria-label="Documentation home"
        >
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
          Docs
        </Link>

        {/* Current page title on mobile */}
        {pathname !== '/documentation' && (
          <span className="text-sm font-medium truncate max-w-[160px]">
            {allItems.find(i => i.href === pathname)?.title ?? ''}
          </span>
        )}

        {/* Mobile sheet trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <Link
                href="/documentation"
                className="flex items-center gap-2 font-semibold"
                onClick={() => setSheetOpen(false)}
              >
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSheetOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <SidebarNav pathname={pathname} onLinkClick={() => setSheetOpen(false)} />
            </ScrollArea>
            <div className="border-t px-4 py-3">
              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => setSheetOpen(false)}
              >
                <MessageSquare className="h-4 w-4" />
                Back to Chat
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0" role="main">
        {/* top padding: mobile header (56px) + extra; desktop: none */}
        <div className="mx-auto max-w-3xl px-4 pt-20 pb-28 md:px-8 md:pt-10 md:pb-16">
          <Breadcrumb pathname={pathname} />
          {children}
          <PrevNext pathname={pathname} />
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav pathname={pathname} onMenuOpen={() => setSheetOpen(true)} />
    </div>
  );
}
