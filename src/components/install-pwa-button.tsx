'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Download } from 'lucide-react';

// This event is fired by the browser when a PWA is installable.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
}

export function InstallPWAButton(props: ButtonProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide button if the app is already installed.
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback timer to show the button even if 'beforeinstallprompt' isn't supported (like on iOS).
    const timer = setTimeout(() => {
        // Only show if the prompt hasn't already made it visible.
        if (!installPrompt) setIsVisible(true);
    }, 1200);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [installPrompt]);

  const handleInstallClick = useCallback(async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false); // Hide button after successful installation
        setInstallPrompt(null); // The prompt is one-time use.
      }
    } else {
      alert(
        'To install the app:\n\n' +
        '• On Desktop: Look for an install icon in your browser\'s address bar.\n' +
        '• On Mobile: Tap the share button and select "Add to Home Screen".'
      );
    }
  }, [installPrompt]);

  if (!isVisible) {
    return null;
  }

  // Passing all props from outside allows for flexible styling (variant, size, className)
  return (
    <Button {...props} onClick={handleInstallClick}>
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
}
