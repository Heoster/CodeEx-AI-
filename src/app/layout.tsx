
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import 'katex/dist/katex.min.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import {Toaster as SonnerToaster} from 'sonner';
import {AuthProvider} from '@/hooks/use-auth';
import LoadingManager from '@/components/loading-manager';
import PageTransition from '@/components/page-transition';
import { PWAPrompt } from '@/components/pwa-prompt';
import SwRegister from '@/components/sw-register';
import { validateStartup } from '@/lib/startup-validation';
import { StructuredData } from '@/components/seo/structured-data';
import { defaultSEO } from '@/lib/seo-config';
import { DEVELOPER_INFO } from '@/lib/developer-info';
import { ErrorBoundary } from '@/components/error-boundary';
import { Analytics } from '@/components/analytics';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app'),
  title: defaultSEO.title,
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  authors: [
    { 
      name: `${DEVELOPER_INFO.name} (${DEVELOPER_INFO.realName})`, 
      url: DEVELOPER_INFO.contact.github 
    }
  ],
  creator: DEVELOPER_INFO.name,
  publisher: DEVELOPER_INFO.company.name,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: DEVELOPER_INFO.company.name,
    startupImage: '/FINALSOHAM.png',
  },
  icons: {
    icon: '/FINALSOHAM.png',
    apple: '/FINALSOHAM.png',
    shortcut: '/FINALSOHAM.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app',
    siteName: 'SOHAM',
    title: 'Free AI Chat Platform | SOHAM - 35+ Models, PDF Analysis, Image Math Solver',
    description: 'Free AI chat with 35+ models. Chat, code, solve math, analyze PDFs, and use smart web search - no signup required.',
    images: [
      {
        url: 'https://soham-ai.vercel.app/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'SOHAM - Free AI Chat Platform with 35+ Models',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Chat Platform | SOHAM - 35+ Models, PDF Analysis, Image Math Solver',
    description: 'Free AI chat with 35+ models. Chat, code, solve math, analyze PDFs, and use smart web search - no signup required.',
    site: '@The_Heoster_',
    creator: '@The_Heoster_',
    images: ['https://soham-ai.vercel.app/Multi-Chat.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'BOhoSA2Bv_SY0gWI4wdYE6gPRxqXimqYLLMrYQxVN4k',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://soham-ai.vercel.app',
  },
  category: 'technology',
  classification: 'Artificial Intelligence Platform',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#020817',
    'msapplication-config': '/browserconfig.xml',
    'developer': DEVELOPER_INFO.name,
    'developer-age': DEVELOPER_INFO.age.toString(),
    'developer-location': `${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.country}`,
    'developer-email': DEVELOPER_INFO.contact.email,
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YH87NZPSKB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YH87NZPSKB');
          `}
        </Script>
        <StructuredData type="organization" />
        <StructuredData type="person" />
        <StructuredData type="softwareApplication" />
        <StructuredData type="website" />
        <StructuredData type="breadcrumb" />
        <link rel="author" href={DEVELOPER_INFO.contact.github} />
        <link rel="me" href={DEVELOPER_INFO.contact.linkedin} />
        <link rel="me" href={DEVELOPER_INFO.contact.twitter} />
      </head>
      <body className={`${manrope.variable} font-body antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Analytics />
              <LoadingManager />
              <PageTransition>
                {children}
              </PageTransition>
            <PWAPrompt />
            <SwRegister />
            <Toaster />
            <SonnerToaster position="top-right" richColors />
          </ThemeProvider>
        </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
