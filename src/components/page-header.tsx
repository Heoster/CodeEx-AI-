'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  backLink: string;
  backText: string;
  title: string;
}

export function PageHeader({ backLink, backText, title }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={backLink} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="CODEEX AI Logo"
            width={28}
            height={28}
          />
          <span className="text-lg md:text-xl font-bold text-foreground">CODEEX AI</span>
        </Link>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>
    </header>
  );
}
