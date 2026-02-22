'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

interface DocLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Quick Start', href: '/documentation/quick-start', icon: Zap },
      { title: 'Installation', href: '/documentation/installation', icon: Home },
    ],
  },
  {
    title: 'Features',
    items: [
      { title: 'Chat Interface', href: '/documentation/chat', icon: MessageSquare },
      { title: 'AI Models', href: '/documentation/ai-models', icon: Brain },
      { title: 'Commands', href: '/documentation/commands', icon: Code },
      { title: 'Smart Notes', href: '/documentation/smart-notes', icon: BookOpen },
      { title: 'Math Solver', href: '/documentation/math-solver', icon: Calculator },
      { title: 'PDF Analysis', href: '/documentation/pdf-analysis', icon: FileText },
      { title: 'Web Search', href: '/documentation/web-search', icon: Search },
      { title: 'Jarvis Mode', href: '/documentation/jarvis-mode', icon: Sparkles },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { title: 'Settings', href: '/documentation/settings', icon: Settings },
      { title: 'Personalization', href: '/documentation/personalization', icon: Sparkles },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'API Reference', href: '/documentation/api-reference', icon: Code },
      { title: 'FAQ', href: '/documentation/faq', icon: HelpCircle },
    ],
  },
];

// Sidebar Navigation Component
function SidebarNav({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <nav className="space-y-6 pb-6" role="navigation" aria-label="Documentation navigation">
      {navigation.map((section) => (
        <div key={section.title}>
          <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
            {section.title}
          </h4>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    isActive && 'bg-secondary'
                  )}
                  asChild
                  onClick={onLinkClick}
                >
                  <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function DocLayout({ children }: DocLayoutProps) {
  const pathname = usePathname() || '';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background sticky top-0 h-screen">
        <div className="p-6">
          <Link 
            href="/documentation" 
            className="flex items-center gap-2 font-semibold text-lg hover:text-primary transition-colors"
            aria-label="Documentation home"
          >
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            Documentation
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4">
          <SidebarNav pathname={pathname} />
        </ScrollArea>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link 
            href="/documentation" 
            className="flex items-center gap-2 font-semibold"
            aria-label="Documentation home"
          >
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            Docs
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b">
                <Link 
                  href="/documentation" 
                  className="flex items-center gap-2 font-semibold text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                  Documentation
                </Link>
              </div>
              <ScrollArea className="h-[calc(100vh-5rem)] px-4 pt-4">
                <SidebarNav 
                  pathname={pathname} 
                  onLinkClick={() => setMobileMenuOpen(false)} 
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-16" role="main">
        <div className="container max-w-4xl py-8 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
