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
import { app } from '@/lib/firebase';

export interface AuthResponse {
  success: boolean;
  message: string;
}

/**
 * Firebase Authentication Service
 * Handles password reset, email change, and other auth operations
 */
export class FirebaseAuthService {
  private auth = getAuth(app);

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
      
      await sendPasswordResetEmail(this.auth, email, {
        url: `${redirectUrl}/login`,
        handleCodeInApp: true,
      });

      return {
        success: true,
        message: 'Password reset email sent successfully. Check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        message: this.parseAuthError(error, 'password-reset'),
      };
    }
  }

  /**
   * Changes user's email address with verification
   * Sends verification email to new address before updating
   * @param user - Current authenticated user
   * @param newEmail - New email address
   */
  async changeEmailWithVerification(user: User, newEmail: string): Promise<AuthResponse> {
    if (!newEmail || !newEmail.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    if (user.email === newEmail) {
      return {
        success: false,
        message: 'New email is the same as current email.',
      };
    }

    try {
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || 
                         process.env.NEXT_PUBLIC_SITE_URL || 
                         'http://localhost:3000';

      // Send verification email to new address
      await verifyBeforeUpdateEmail(user, newEmail, {
        url: `${redirectUrl}/profile`,
        handleCodeInApp: true,
      });

      return {
        success: true,
        message: 'Verification email sent to new address. Please verify to complete the change.',
      };
    } catch (error) {
      return {
        success: false,
        message: this.parseAuthError(error, 'email-change'),
      };
    }
  }

  /**
   * Updates email directly (requires recent authentication)
   * @param user - Current authenticated user
   * @param newEmail - New email address
   */
  async updateEmailDirect(user: User, newEmail: string): Promise<AuthResponse> {
    if (!newEmail || !newEmail.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    try {
      await updateEmail(user, newEmail);

      return {
        success: true,
        message: 'Email updated successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: this.parseAuthError(error, 'email-update'),
      };
    }
  }

  /**
   * Updates user password (requires recent authentication)
   * @param user - Current authenticated user
   * @param newPassword - New password
   */
  async updateUserPassword(user: User, newPassword: string): Promise<AuthResponse> {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.',
      };
    }

    try {
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: 'Password updated successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: this.parseAuthError(error, 'password-update'),
      };
    }
  }

  /**
   * Re-authenticates user with email and password
   * Required before sensitive operations like email/password change
   * @param user - Current authenticated user
   * @param password - Current password
   */
  async reauthenticateUser(user: User, password: string): Promise<AuthResponse> {
    if (!user.email) {
      return {
        success: false,
        message: 'User email not found.',
      };
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      return {
        success: true,
        message: 'Re-authentication successful.',
      };
    } catch (error) {
      return {
        success: false,
        message: this.parseAuthError(error, 'reauth'),
      };
    }
  }

  /**
   * Sends email verification to current user
   * @param user - Current authenticated user
   */
  async sendVerificationEmail(user: User): Promise<AuthResponse> {
    if (user.emailVerified) {
      return {
        success: false,
        message: 'Email is already verified.',
      };
    }

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
        message: 'Verification email sent. Please check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        message: this.parseAuthError(error, 'email-verification'),
      };
    }
  }

  /**
   * Parses Firebase auth errors into user-friendly messages
   */
  private parseAuthError(error: unknown, operation: string): string {
    if (typeof error !== 'object' || error === null) {
      return `An error occurred during ${operation}. Please try again.`;
    }

    const err = error as { code?: string; message?: string };

    switch (err.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/email-already-in-use':
        return 'This email is already in use by another account.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/requires-recent-login':
        return 'This operation requires recent authentication. Please log in again.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/invalid-action-code':
        return 'Invalid or expired verification code.';
      case 'auth/expired-action-code':
        return 'Verification code has expired. Please request a new one.';
      default:
        return `Failed to complete ${operation}. Please try again later.`;
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
