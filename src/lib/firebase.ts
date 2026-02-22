'use client';

import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {GoogleAuthProvider} from 'firebase/auth';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  AppCheck,
} from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Comprehensive validation to ensure Firebase config is loaded
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
const missingFields = requiredFields.filter(field => 
  !firebaseConfig[field] || 
  String(firebaseConfig[field]).startsWith('YOUR_') ||
  String(firebaseConfig[field]).length < 5
);

if (missingFields.length > 0) {
  console.error(
    `⚠️ Firebase configuration incomplete. Missing or invalid fields: ${missingFields.join(', ')}. ` +
    'Authentication features will not work. Please check your .env.local file.'
  );
}

// Initialize Firebase
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize App Check
let appCheckInstance: AppCheck | undefined;

if (typeof window !== 'undefined') {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;
  const isDev = process.env.NODE_ENV === 'development';
  
  // Only initialize App Check if a valid reCAPTCHA key is provided
  // Skip App Check initialization to avoid errors - it's optional for most features
  if (recaptchaKey && recaptchaKey.length > 10 && !recaptchaKey.startsWith('your_') && !isDev) {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaKey),
        isTokenAutoRefreshEnabled: false, // Disable to prevent repeated errors
      });
      console.log('✅ App Check initialized successfully');
    } catch (e) {
      console.warn('⚠️ App Check initialization skipped:', e instanceof Error ? e.message : 'Unknown error');
      // Silently fail - App Check is optional
    }
  } else {
    console.log('ℹ️ App Check disabled (development mode or no valid key)');
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export {app, googleProvider, appCheckInstance};
