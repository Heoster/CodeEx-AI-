'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/seo-config';

/**
 * Analytics Component
 * Automatically tracks page views when route changes
 */
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}
