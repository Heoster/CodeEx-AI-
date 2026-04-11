'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Smartphone,
  Monitor,
  Share2,
  Chrome,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  WifiOff,
  Home,
  RefreshCw,
} from 'lucide-react';

const androidSteps = [
  {
    title: 'Open Chrome and visit SOHAM',
    body: 'Navigate to soham-ai.vercel.app in Chrome on your Android device.',
    tip: 'Use Chrome 76+ for the best PWA experience.',
  },
  {
    title: 'Look for the install banner',
    body: 'Chrome shows an "Add to Home screen" banner at the bottom of the screen after a few seconds.',
    tip: 'If the banner doesn\'t appear, tap ⋮ → "Install app" from the menu.',
  },
  {
    title: 'Tap "Install"',
    body: 'Confirm in the dialog that pops up. The install takes under a second.',
    tip: 'The SOHAM icon is added to your home screen immediately.',
  },
  {
    title: 'Launch from your home screen',
    body: 'Tap the SOHAM icon — it opens full-screen with no browser address bar.',
    tip: 'You can move it to any folder or dock just like a regular app.',
  },
];

const iosSteps = [
  {
    title: 'Open Safari',
    body: 'Navigate to soham-ai.vercel.app in Safari on your iPhone or iPad.',
    tip: 'Chrome and Firefox on iOS cannot install PWAs — Safari only.',
  },
  {
    title: 'Tap the Share button',
    body: 'The share icon (□↑) is in the bottom toolbar on iPhone, top toolbar on iPad.',
    tip: 'It looks like a box with an arrow pointing up.',
  },
  {
    title: 'Tap "Add to Home Screen"',
    body: 'Scroll down in the share sheet to find this option — it has a "+" icon.',
    tip: 'If you don\'t see it, scroll down further in the share sheet.',
  },
  {
    title: 'Confirm and tap "Add"',
    body: 'Optionally rename it, then tap "Add" in the top-right corner of the dialog.',
    tip: 'The default name "SOHAM" works great.',
  },
];

const desktopSteps = [
  {
    browser: 'Chrome',
    steps: [
      'Visit soham-ai.vercel.app',
      'Click the install icon (⊕) in the address bar on the right',
      'Click "Install" in the confirmation dialog',
      'SOHAM opens as a standalone window',
    ],
  },
  {
    browser: 'Microsoft Edge',
    steps: [
      'Visit soham-ai.vercel.app',
      'Click ⋯ menu → "Apps" → "Install this site as an app"',
      'Confirm the installation',
      'Find SOHAM in your Start menu or taskbar',
    ],
  },
  {
    browser: 'Brave',
    steps: [
      'Visit soham-ai.vercel.app',
      'Click the install icon in the address bar or ⋮ → "Install SOHAM"',
      'Confirm installation',
      'Launch from your desktop or app launcher',
    ],
  },
];

const afterInstall = [
  { icon: Home,      text: 'Home screen icon — launches like a native app' },
  { icon: Zap,       text: 'Full-screen mode — no browser chrome or address bar' },
  { icon: WifiOff,   text: 'Offline UI cache — browse previous chats without internet' },
  { icon: RefreshCw, text: 'Auto-updates — always runs the latest version silently' },
  { icon: Smartphone,text: 'Touch-optimised layout on mobile' },
  { icon: Monitor,   text: 'Standalone window on desktop — separate from your browser' },
];

const troubleshooting = [
  {
    q: 'No install prompt appears',
    a: 'Clear browser cache, reload the page, and wait a few seconds. On Chrome, check ⋮ → "Install app". Ensure you\'re on HTTPS (soham-ai.vercel.app).',
  },
  {
    q: 'iOS "Add to Home Screen" option is missing',
    a: 'You must use Safari on iOS. Chrome and Firefox on iOS do not support PWA installation. Update to iOS 14+ for best results.',
  },
  {
    q: 'App opens in the browser instead of standalone',
    a: 'Uninstall the app, clear Chrome\'s site data for soham-ai.vercel.app, and reinstall.',
  },
  {
    q: 'App won\'t open after installation',
    a: 'Long-press the icon → "App info" → "Clear cache". If that fails, uninstall and reinstall from the browser.',
  },
];

export default function InstallationPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="font-medium">PWA Installation</span>
          <Badge variant="secondary" className="text-xs">No App Store</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Install SOHAM</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Install SOHAM as a Progressive Web App directly from your browser — no Play Store,
          App Store, or download required.
        </p>
      </div>

      {/* Why install */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-primary" />
            Why Install Instead of Using the Browser?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {afterInstall.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm">{text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Android */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Chrome className="h-6 w-6" /> Android — Chrome
        </h2>
        <Card>
          <CardHeader>
            <CardDescription>Recommended browser for Android PWA installation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="space-y-4">
              {androidSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">💡 {step.tip}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 flex gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Done! SOHAM now appears in your app drawer and home screen just like any native app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* iOS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Share2 className="h-6 w-6" /> iPhone / iPad — Safari
        </h2>
        <Card>
          <CardHeader>
            <CardDescription>Apple only allows PWA installation through Safari — not Chrome or Firefox</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="space-y-4">
              {iosSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">💡 {step.tip}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                iOS PWAs run in a separate browser context from Safari. Requires iOS 14+ for basic
                PWA support; iOS 16.4+ for push notifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Monitor className="h-6 w-6" /> Desktop
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {desktopSteps.map(({ browser, steps }) => (
            <Card key={browser}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{browser}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="font-bold text-foreground shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What you get */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What You Get After Installing</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Full-screen experience with no browser address bar',
            'Home screen / desktop icon for one-tap access',
            'Faster load times via service-worker caching',
            'Offline access to the UI and cached conversations',
            'Auto-updates in the background — always up to date',
            'All SOHAM features: chat, image gen, PDF analysis, voice',
            'Works on Android (Chrome), iOS (Safari), and desktop',
            '100% free — no account, no subscription, no app store',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border p-3">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Troubleshooting</h2>
        <div className="space-y-3">
          {troubleshooting.map(({ q, a }) => (
            <Card key={q}>
              <CardContent className="pt-4 pb-4">
                <p className="font-semibold text-sm text-orange-600 dark:text-orange-400 mb-1">❓ {q}</p>
                <p className="text-sm text-muted-foreground">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Ready to install?</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Open SOHAM in your mobile browser or desktop Chrome/Edge and follow the steps above.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/chat">
              Open SOHAM <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/documentation/pwa">PWA Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
