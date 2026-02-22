'use client';

import DocLayout from '@/components/documentation/doc-layout';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout>{children}</DocLayout>;
}