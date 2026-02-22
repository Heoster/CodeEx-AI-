'use client';

import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {GoogleAuthProvider} from 'firebase/auth';
import type {AppCheck} from 'firebase/app-check';

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

// App Check is disabled - it's optional and was causing ReCAPTCHA errors
// Firebase Security Rules provide sufficient protection
let appCheckInstance: AppCheck | undefined;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export {app, googleProvider, appCheckInstance};
