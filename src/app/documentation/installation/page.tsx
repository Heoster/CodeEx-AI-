'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  Chrome, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle,
  Settings,
  Home
} from 'lucide-react';

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="font-medium">Mobile Installation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Install as Mobile App
        </h1>
        <p className="text-xl text-muted-foreground">
          CodeEx AI is a Progressive Web App (PWA) that can be installed on your mobile device for a native app experience.
        </p>
      </div>

      {/* PWA Benefits */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Why Install as an App?
          </CardTitle>
          <CardDescription>
            Get the best mobile experience with native app features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <BenefitCard
              icon={Globe}
              title="Full-Screen Experience"
              description="No browser UI, just pure app interface"
            />
            <BenefitCard
              icon={Zap}
              title="Faster Loading"
              description="Cached resources for instant startup"
            />
            <BenefitCard
              icon={Shield}
              title="Offline Support"
              description="Access previous conversations without internet"
            />
            <BenefitCard
              icon={Home}
              title="Home Screen Icon"
              description="Quick access from your device's home screen"
            />
          </div>
        </CardContent>
      </Card>

      {/* Android Installation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Android Installation</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Chrome Browser (Recommended)
            </CardTitle>
            <CardDescription>
              The easiest way to install CodeEx AI on Android
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Open CodeEx AI in Chrome",
                    description: "Navigate to codeex-ai.netlify.app in your Chrome browser",
                    tip: "Make sure you're using the latest version of Chrome"
                  },
                  {
                    step: 2,
                    title: "Look for the Install Prompt",
                    description: "Chrome will show an 'Add to Home screen' banner at the bottom",
                    tip: "If you don't see it, tap the menu (⋮) in the top right"
                  },
                  {
                    step: 3,
                    title: "Tap 'Add to Home screen'",
                    description: "Or select 'Install app' from the Chrome menu",
                    tip: "You might see 'Install CodeEx AI' instead"
                  },
                  {
                    step: 4,
                    title: "Confirm Installation",
                    description: "Tap 'Install' in the confirmation dialog",
                    tip: "The app will be added to your home screen automatically"
                  }
                ].map((step) => (
                  <InstallationStep
                    key={step.step}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                    tip={step.tip}
                  />
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium text-green-700 dark:text-green-300">Success!</h4>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Once installed, you'll find CodeEx AI on your home screen with its own icon. 
                  It will open in full-screen mode without browser controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Browsers */}
        <Card>
          <CardHeader>
            <CardTitle>Other Android Browsers</CardTitle>
            <CardDescription>
              Installation steps for Firefox, Edge, and Samsung Internet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BrowserGuide
                browser="Firefox"
                steps={[
                  "Open CodeEx AI in Firefox",
                  "Tap the menu (⋮) in the top right",
                  "Select 'Add to Home screen'",
                  "Confirm by tapping 'Add'"
                ]}
              />
              <BrowserGuide
                browser="Microsoft Edge"
                steps={[
                  "Navigate to CodeEx AI in Edge",
                  "Tap the menu (⋯) at the bottom",
                  "Select 'Add to phone'",
                  "Choose 'Add to Home screen'"
                ]}
              />
              <BrowserGuide
                browser="Samsung Internet"
                steps={[
                  "Open CodeEx AI in Samsung Internet",
                  "Tap the menu button",
                  "Select 'Add page to' → 'Home screen'",
                  "Tap 'Add' to confirm"
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* iOS Installation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">iOS Installation (iPhone/iPad)</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Safari Browser (Required)
            </CardTitle>
            <CardDescription>
              iOS only supports PWA installation through Safari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Open Safari",
                    description: "Navigate to codeex-ai.netlify.app in Safari browser",
                    tip: "Other browsers like Chrome won't work for PWA installation on iOS"
                  },
                  {
                    step: 2,
                    title: "Tap the Share Button",
                    description: "Look for the share icon (square with arrow) at the bottom",
                    tip: "It's in the bottom toolbar of Safari"
                  },
                  {
                    step: 3,
                    title: "Select 'Add to Home Screen'",
                    description: "Scroll down in the share menu to find this option",
                    tip: "You might need to scroll down to see it"
                  },
                  {
                    step: 4,
                    title: "Customize and Add",
                    description: "Edit the name if desired, then tap 'Add'",
                    tip: "The default name 'CodeEx AI' works perfectly"
                  }
                ].map((step) => (
                  <InstallationStep
                    key={step.step}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                    tip={step.tip}
                  />
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">iOS Note</h4>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  iOS PWAs have some limitations compared to Android. Features like push notifications 
                  and background sync are not available, but the core app experience works perfectly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Installation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Desktop Installation</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Chrome, Edge, and Other Chromium Browsers</CardTitle>
            <CardDescription>
              Install CodeEx AI as a desktop app for quick access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">Automatic Prompt</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Visit codeex-ai.netlify.app in Chrome/Edge</li>
                  <li>2. Look for the install icon in the address bar</li>
                  <li>3. Click the install button</li>
                  <li>4. Confirm installation</li>
                </ol>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Manual Installation</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Click the menu (⋮) in the browser</li>
                  <li>2. Select "Install CodeEx AI..."</li>
                  <li>3. Click "Install" in the dialog</li>
                  <li>4. App appears in your applications</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Troubleshooting
          </CardTitle>
          <CardDescription>
            Common issues and solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TroubleshootItem
              problem="Don't see the install option?"
              solutions={[
                "Make sure you're using a supported browser (Chrome, Firefox, Edge, Safari)",
                "Clear your browser cache and reload the page",
                "Check that JavaScript is enabled",
                "Try visiting the site in an incognito/private window"
              ]}
            />
            <TroubleshootItem
              problem="App won't install on iOS?"
              solutions={[
                "Use Safari browser only - other browsers don't support PWA installation on iOS",
                "Make sure you're tapping the share button (not the address bar)",
                "Update to the latest iOS version if possible"
              ]}
            />
            <TroubleshootItem
              problem="Installed app won't open?"
              solutions={[
                "Try uninstalling and reinstalling the app",
                "Clear browser data for codeex-ai.netlify.app",
                "Check your internet connection",
                "Restart your device"
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Features After Installation */}
      <Card>
        <CardHeader>
          <CardTitle>What You Get After Installation</CardTitle>
          <CardDescription>
            Features available in the installed app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              title="Native App Experience"
              description="Full-screen interface without browser controls"
              available={true}
            />
            <FeatureCard
              title="Offline Access"
              description="View previous conversations without internet"
              available={true}
            />
            <FeatureCard
              title="Fast Loading"
              description="Cached resources for instant startup"
              available={true}
            />
            <FeatureCard
              title="Home Screen Icon"
              description="Quick access from your device"
              available={true}
            />
            <FeatureCard
              title="Push Notifications"
              description="Get notified of updates (Android only)"
              available="android"
            />
            <FeatureCard
              title="Background Sync"
              description="Sync data when connection returns (Android only)"
              available="android"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function InstallationStep({
  step,
  title,
  description,
  tip,
}: {
  step: number;
  title: string;
  description: string;
  tip: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
        {step}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground mb-1">{description}</p>
        <p className="text-xs text-blue-600 dark:text-blue-400">💡 {tip}</p>
      </div>
    </div>
  );
}

function BrowserGuide({
  browser,
  steps,
}: {
  browser: string;
  steps: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-3">{browser}</h4>
      <ol className="space-y-1 text-sm text-muted-foreground">
        {steps.map((step, i) => (
          <li key={i}>{i + 1}. {step}</li>
        ))}
      </ol>
    </div>
  );
}

function TroubleshootItem({
  problem,
  solutions,
}: {
  problem: string;
  solutions: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
        ❓ {problem}
      </h4>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {solutions.map((solution, i) => (
          <li key={i}>• {solution}</li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  available,
}: {
  title: string;
  description: string;
  available: boolean | string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="mt-0.5">
        {available === true ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : available === "android" ? (
          <Badge variant="outline" className="text-xs">Android</Badge>
        ) : (
          <AlertCircle className="h-4 w-4 text-orange-500" />
        )}
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}