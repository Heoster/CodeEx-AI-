'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { firebaseAuthService, AuthResponse } from '@/lib/firebase-auth-service';

/**
 * React hook for Firebase Auth operations
 * Provides easy access to auth services with loading states
 */
export function useFirebaseAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);

  const sendPasswordReset = async (email: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await firebaseAuthService.sendPasswordReset(email);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const message = 'Failed to send password reset email';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (newEmail: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        const message = 'User not authenticated';
        setError(message);
        return { success: false, message };
      }

      const result = await firebaseAuthService.changeEmailWithVerification(user, newEmail);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const message = 'Failed to change email';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        const message = 'User not authenticated';
        setError(message);
        return { success: false, message };
      }

      const result = await firebaseAuthService.sendVerificationEmail(user);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const message = 'Failed to send verification email';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        const message = 'User not authenticated';
        setError(message);
        return { success: false, message };
      }

      const result = await firebaseAuthService.updateUserPassword(user, newPassword);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const message = 'Failed to update password';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const reauthenticate = async (password: string): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        const message = 'User not authenticated';
        setError(message);
        return { success: false, message };
      }

      const result = await firebaseAuthService.reauthenticateUser(user, password);
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const message = 'Failed to re-authenticate';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendPasswordReset,
    changeEmail,
    sendVerificationEmail,
    updatePassword,
    reauthenticate,
    currentUser: auth.currentUser,
  };
}
