'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Zap,
  Bell,
  Home,
  RefreshCw,
  Shield,
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Chrome,
  Share2,
  Monitor,
} from 'lucide-react';

export default function PWAPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="font-medium">Progressive Web App</span>
          <Badge variant="secondary" className="text-xs">PWA</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">SOHAM as a PWA</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Install SOHAM directly on your device — no app store required. Get a native-like
          experience with offline support, fast loading, and a home screen icon.
        </p>
      </div>

      {/* What is a PWA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            What is a Progressive Web App?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            A <strong className="text-foreground">Progressive Web App (PWA)</strong> is a website that
            behaves like a native mobile or desktop app. SOHAM is built as a PWA, which means you can
            install it from your browser — no Play Store or App Store needed.
          </p>
          <p>
            Once installed, it lives on your home screen, opens full-screen, loads instantly from cache,
            and works even with a poor connection.
          </p>
        </CardContent>
      </Card>

      {/* Benefits grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Why Install SOHAM as a PWA?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Zap,    title: 'Instant Launch',      desc: 'Opens in under a second from your home screen thanks to service-worker caching.' },
            { icon: WifiOff,title: 'Offline Ready',       desc: 'Browse previous conversations and use cached UI even without internet.' },
            { icon: Home,   title: 'Home Screen Icon',    desc: 'Looks and feels like a native app — no browser chrome, just SOHAM.' },
            { icon: Bell,   title: 'Push Notifications',  desc: 'Receive update alerts on Android (Chrome). Coming to iOS 16.4+.' },
            { icon: RefreshCw, title: 'Auto Updates',     desc: 'Always runs the latest version — updates happen silently in the background.' },
            { icon: Shield, title: 'Secure by Default',   desc: 'Served over HTTPS with strict content security policies.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-xl border bg-background p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Android */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Install on Android</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Chrome className="h-5 w-5" />
              Chrome (Recommended)
            </CardTitle>
            <CardDescription>Fastest and most reliable method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="space-y-4">
              {[
                { n: 1, title: 'Open Chrome and visit SOHAM',        body: 'Go to soham-ai.vercel.app in Chrome on your Android device.',                tip: 'Use the latest Chrome for the best experience.' },
                { n: 2, title: 'Wait for the install banner',        body: 'Chrome shows an "Add to Home screen" banner at the bottom of the screen.',   tip: 'If it doesn\'t appear, tap ⋮ → "Install app".' },
                { n: 3, title: 'Tap "Install" or "Add to Home screen"', body: 'Confirm in the dialog that appears.',                                      tip: 'The icon will be added to your home screen immediately.' },
                { n: 4, title: 'Launch from home screen',            body: 'Tap the SOHAM icon — it opens full-screen with no browser UI.',               tip: 'You can move it to any folder like a regular app.' },
              ].map(s => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{s.n}</span>
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">💡 {s.tip}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 flex gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                SOHAM is now installed. It will appear in your app drawer and home screen just like any other app.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Other Android Browsers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Firefox',          steps: ['Open SOHAM in Firefox', 'Tap ⋮ menu → "Install"', 'Confirm "Add to Home screen"'] },
              { name: 'Microsoft Edge',   steps: ['Open SOHAM in Edge', 'Tap ⋯ menu → "Add to phone"', 'Select "Add to Home screen"'] },
              { name: 'Samsung Internet', steps: ['Open SOHAM', 'Tap menu → "Add page to"', 'Choose "Home screen" → Add'] },
            ].map(b => (
              <div key={b.name} className="rounded-lg border p-4">
                <p className="font-semibold text-sm mb-2">{b.name}</p>
                <ol className="space-y-1 text-xs text-muted-foreground">
                  {b.steps.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}
                </ol>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* iOS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Install on iPhone / iPad</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 className="h-5 w-5" />
              Safari (Required on iOS)
            </CardTitle>
            <CardDescription>Apple only allows PWA installation through Safari</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ol className="space-y-4">
              {[
                { n: 1, title: 'Open Safari',                    body: 'Navigate to soham-ai.vercel.app in Safari.',                                    tip: 'Chrome and Firefox on iOS cannot install PWAs.' },
                { n: 2, title: 'Tap the Share button',           body: 'The share icon (□↑) is in the bottom toolbar.',                                 tip: 'On iPad it\'s in the top toolbar.' },
                { n: 3, title: 'Tap "Add to Home Screen"',       body: 'Scroll down in the share sheet to find this option.',                           tip: 'It has a "+" icon next to it.' },
                { n: 4, title: 'Confirm and tap "Add"',          body: 'Optionally rename it, then tap Add in the top-right corner.',                   tip: 'The default name "SOHAM" is fine.' },
              ].map(s => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{s.n}</span>
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">💡 {s.tip}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                iOS PWAs run in a separate browser context. Push notifications require iOS 16.4+ and must be
                enabled in Settings → SOHAM → Notifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Install on Desktop</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="h-5 w-5" />
              Chrome / Edge / Brave
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-sm mb-2">Via address bar</p>
              <ol className="space-y-1 text-sm text-muted-foreground">
                <li>1. Visit soham-ai.vercel.app</li>
                <li>2. Click the install icon (⊕) in the address bar</li>
                <li>3. Click "Install" in the dialog</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold text-sm mb-2">Via browser menu</p>
              <ol className="space-y-1 text-sm text-muted-foreground">
                <li>1. Open the browser menu (⋮ or …)</li>
                <li>2. Select "Install SOHAM…" or "Apps → Install"</li>
                <li>3. Confirm installation</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature matrix */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Feature Availability</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Feature</th>
                <th className="px-4 py-3 text-center font-semibold">Android</th>
                <th className="px-4 py-3 text-center font-semibold">iOS</th>
                <th className="px-4 py-3 text-center font-semibold">Desktop</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { feature: 'Home screen icon',       android: true,  ios: true,  desktop: true  },
                { feature: 'Full-screen mode',       android: true,  ios: true,  desktop: true  },
                { feature: 'Offline UI cache',       android: true,  ios: true,  desktop: true  },
                { feature: 'Background sync',        android: true,  ios: false, desktop: true  },
                { feature: 'Push notifications',     android: true,  ios: '16.4+', desktop: true },
                { feature: 'App shortcuts',          android: true,  ios: false, desktop: true  },
                { feature: 'Share target',           android: true,  ios: false, desktop: false },
              ].map(row => (
                <tr key={row.feature} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{row.feature}</td>
                  {(['android', 'ios', 'desktop'] as const).map(p => (
                    <td key={p} className="px-4 py-3 text-center">
                      {row[p] === true  ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> :
                       row[p] === false ? <span className="text-muted-foreground text-xs">—</span> :
                       <Badge variant="outline" className="text-xs">{row[p]}</Badge>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              q: 'No install prompt appears',
              a: 'Clear browser cache, reload the page, and wait a few seconds. On Chrome, check ⋮ → "Install app". Make sure you\'re on HTTPS.',
            },
            {
              q: 'iOS install option is missing',
              a: 'You must use Safari. Chrome and Firefox on iOS do not support PWA installation. Update to iOS 14+ for best results.',
            },
            {
              q: 'App opens in browser instead of standalone',
              a: 'Uninstall and reinstall. On Android, clear Chrome\'s site data for soham-ai.vercel.app and try again.',
            },
            {
              q: 'Offline mode not working',
              a: 'Open the app once with a good connection to let the service worker cache all assets. Then try offline.',
            },
          ].map(item => (
            <div key={item.q} className="rounded-lg border p-4">
              <p className="font-semibold text-sm text-orange-600 dark:text-orange-400 mb-1">❓ {item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Ready to install?</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Open SOHAM in your mobile browser right now and follow the steps above.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/chat">
              Open SOHAM <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/documentation/installation">Full Install Guide</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
