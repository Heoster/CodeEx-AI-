/**
 * Firebase Authentication Service - Server Side
 * For use in API routes only
 */

import { 
  getAuth, 
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { getServerApp } from '@/lib/firebase-server';

export interface AuthResponse {
  success: boolean;
  message: string;
}

/**
 * Firebase Authentication Service - Server Side
 * Handles password reset, email change, and other auth operations
 */
export class FirebaseAuthServiceServer {
  private getAuth() {
    return getAuth(getServerApp());
  }

  /**
   * Sends a password reset email to the user
   * @param email - The user's email address
   */
  async sendPasswordReset(email: string): Promise<AuthResponse> {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    try {
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 
                         process.env.NEXT_PUBLIC_SITE_URL || 
                         'http://localhost:3000';
      
      await sendPasswordResetEmail(this.getAuth(), email, {
        url: `${redirectUrl}/login`,
        handleCodeInApp: true,
      });

      return {
        success: true,
        message: 'Password reset email sent successfully. Check your inbox.',
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        return {
          success: false,
          message: 'No account found with this email address.',
        };
      }
      
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
        };
      }
      
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
    }
  }

  /**
   * Sends email verification to the current user
   * @param user - The Firebase user object
   */
  async sendVerificationEmail(user: User): Promise<AuthResponse> {
    try {
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 
                         process.env.NEXT_PUBLIC_SITE_URL || 
                         'http://localhost:3000';
      
      await sendEmailVerification(user, {
        url: `${redirectUrl}/profile`,
        handleCodeInApp: true,
      });

      return {
        success: true,
        message: 'Verification email sent successfully. Check your inbox.',
      };
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
        };
      }
      
      return {
        success: false,
        message: 'Failed to send verification email. Please try again.',
      };
    }
  }

  /**
   * Changes the user's email address
   * @param user - The Firebase user object
   * @param newEmail - The new email address
   * @param password - The user's current password for reauthentication
   */
  async changeEmail(
    user: User,
    newEmail: string,
    password: string
  ): Promise<AuthResponse> {
    if (!newEmail || !newEmail.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    if (!password) {
      return {
        success: false,
        message: 'Password is required to change email.',
      };
    }

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email!,
        password
      );
      await reauthenticateWithCredential(user, credential);

      // Send verification to new email
      await verifyBeforeUpdateEmail(user, newEmail);

      return {
        success: true,
        message: 'Verification email sent to new address. Please verify to complete the change.',
      };
    } catch (error: any) {
      console.error('Email change error:', error);
      
      if (error.code === 'auth/wrong-password') {
        return {
          success: false,
          message: 'Incorrect password. Please try again.',
        };
      }
      
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: 'This email is already in use by another account.',
        };
      }
      
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
        };
      }
      
      return {
        success: false,
        message: 'Failed to change email. Please try again.',
      };
    }
  }

  /**
   * Changes the user's password
   * @param user - The Firebase user object
   * @param currentPassword - The user's current password
   * @param newPassword - The new password
   */
  async changePassword(
    user: User,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        message: 'Both current and new passwords are required.',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters long.',
      };
    }

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: 'Password changed successfully.',
      };
    } catch (error: any) {
      console.error('Password change error:', error);
      
      if (error.code === 'auth/wrong-password') {
        return {
          success: false,
          message: 'Current password is incorrect.',
        };
      }
      
      if (error.code === 'auth/weak-password') {
        return {
          success: false,
          message: 'New password is too weak. Please choose a stronger password.',
        };
      }
      
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
        };
      }
      
      return {
        success: false,
        message: 'Failed to change password. Please try again.',
      };
    }
  }
}

// Export singleton instance - lazy initialized
let serverAuthService: FirebaseAuthServiceServer | null = null;

export function getFirebaseAuthService(): FirebaseAuthServiceServer {
  if (!serverAuthService) {
    serverAuthService = new FirebaseAuthServiceServer();
  }
  return serverAuthService;
}
