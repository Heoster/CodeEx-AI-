import { headers } from 'next/headers';
import { LandingPageShell } from '@/components/landing/landing-page-shell';

function detectMobile(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
}

export default function HomePage() {
  const userAgent = headers().get('user-agent') || '';
  const isMobile = detectMobile(userAgent);

  return <LandingPageShell isMobile={isMobile} />;
}
