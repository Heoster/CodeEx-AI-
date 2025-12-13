
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import {AuthProvider} from '@/hooks/use-auth';
import LoadingManager from '@/components/loading-manager';
import PageTransition from '@/components/page-transition';
import { PWAPrompt } from '@/components/pwa-prompt';
import SwRegister from '@/components/sw-register';
import { validateStartup } from '@/lib/startup-validation';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

// Run startup validation on server-side only
if (typeof window === 'undefined') {
  validateStartup();
}

export const metadata: Metadata = {
  title: 'CODEEX AI',
  description: 'An intelligent AI assistant powered by Heoster. Chat, solve problems, search the web, and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CODEEX AI',
    startupImage: '/icons/icon-192x192.png',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
    shortcut: '/favicon.ico',
  },
  verification: {
    google: 'RY6Rmrn0nrzaZO8QXaazCfjsnLoEBKT8-oJxBc_l_9U',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#020817',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#020817',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} font-body antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingManager />
            <PageTransition>
              {children}
            </PageTransition>
            <PWAPrompt />
            <SwRegister />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
