'use client';

import {useEffect} from 'react';

export default function SwRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration.scope);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content available
                console.log('New service worker installed and waiting.');
              } else {
                // Content cached for offline use
                console.log('Content is cached for offline use.');
              }
            }
          });
        });
      } catch (err) {
        console.warn('Service Worker registration failed:', err);
      }
    };

    registerSW();
  }, []);

  return null;
}
