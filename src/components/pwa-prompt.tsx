'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, Wifi, Zap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const savedDismissal = localStorage.getItem('pwa-prompt-dismissed-at');
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const canShowAgain = !savedDismissal || Date.now() - Number(savedDismissal) > sevenDays;
    const iosDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    setIsIos(iosDevice);
    setDismissed(!canShowAgain || isStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (canShowAgain && !isStandalone) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (iosDevice && canShowAgain && !isStandalone) {
      const timer = window.setTimeout(() => setShowPrompt(true), 2500);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        window.clearTimeout(timer);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed-at', String(Date.now()));
  };

  if (!showPrompt || dismissed || (!deferredPrompt && !isIos)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-[380px]">
      <div className="overflow-hidden rounded-[28px] border border-white/15 bg-[#081019]/95 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(104,213,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(91,140,255,0.18),transparent_40%)] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-sky-200">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Install SOHAM</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    Save SOHAM to your device for a cleaner app-like experience, faster access, and offline-ready shell support.
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={handleDismiss} className="h-8 w-8 text-slate-300 hover:bg-white/10 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 grid gap-2 text-xs text-slate-200 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <Smartphone className="mb-2 h-4 w-4 text-sky-200" />
                  Home screen access
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <Zap className="mb-2 h-4 w-4 text-sky-200" />
                  Faster relaunch
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <Wifi className="mb-2 h-4 w-4 text-sky-200" />
                  Offline shell support
                </div>
              </div>

              {isIos && !deferredPrompt ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-relaxed text-slate-300">
                  On iPhone or iPad, open the browser share menu and choose <span className="font-medium text-white">Add to Home Screen</span>.
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                {!isIos && deferredPrompt ? (
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="border-0 bg-[linear-gradient(135deg,#68d5ff,#5b8cff)] text-slate-950 hover:opacity-95"
                  >
                    Install app
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-slate-200 hover:bg-white/10 hover:text-white">
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
