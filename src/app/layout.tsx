
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app'),
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
    startupImage: '/icons/icon-192x192.png',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app',
    siteName: 'CODEEX',
    title: 'CODEEX - Free AI Chat with 35+ Models | Groq, Gemini, Cerebras, DeepSeek',
    description: `Free AI chat with 35+ models including Groq Llama 3.3 70B, Google Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek R1. Chat, code, solve math, analyze PDFs. No signup required. 100% free forever.`,
    images: [
      {
        url: '/Multi-Chat.png',
        width: 1200,
        height: 630,
        alt: 'CODEEX - Free AI Chat Platform with 35+ Models',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CODEEX - Free AI Chat with 35+ Models',
    description: `Free AI chat with 35+ models: Groq Llama 3.3, Gemini 2.5, Cerebras Qwen 3 235B, DeepSeek. Chat, code, solve math, analyze PDFs. No signup.`,
    creator: `@${DEVELOPER_INFO.social.Twitter}`,
    images: ['/Multi-Chat.png'],
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
    google: 'RY6Rmrn0nrzaZO8QXaazCfjsnLoEBKT8-oJxBc_l_9U',
    other: {
      // Add your second Google verification code here
      // 'google-site-verification': 'YOUR_SECOND_VERIFICATION_CODE',
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app',
    languages: {
      'en-US': process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app',
      'en-IN': process.env.NEXT_PUBLIC_SITE_URL || 'https://codeex-ai.netlify.app',
    },
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
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YH87NZPSKB"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YH87NZPSKB');
            `,
          }}
        />
        <StructuredData type="organization" />
        <StructuredData type="person" />
        <StructuredData type="softwareApplication" />
        <StructuredData type="website" />
        <StructuredData type="breadcrumb" />
        <link rel="author" href={DEVELOPER_INFO.contact.github} />
        <link rel="me" href={DEVELOPER_INFO.contact.linkedin} />
        <link rel="me" href={DEVELOPER_INFO.contact.twitter} />
        {/* Second Google Site Verification */}
        <meta name="google-site-verification" content="BOhoSA2Bv_SY0gWI4wdYE6gPRxqXimqYLLMrYQxVN4k" />
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
