import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';

/**
 * Sends a password reset email to the user.
 * @param email - The user's email address
 * @returns Promise with success status and message
 */
export async function sendPasswordReset(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  try {
    const auth = getAuth(app);
    
    // Send password reset email
    await sendPasswordResetEmail(auth, email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL ||'https://codeex-ai.netlify.app','http://localhost:3000'}/login`,
      handleCodeInApp: true,
    });

    return {
      success: true,
      message: 'Password reset email sent successfully. Check your inbox for a link to reset your password.',
    };
  } catch (error) {
    const errorMessage = parsePasswordResetError(error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Parses Firebase password reset errors into user-friendly messages.
 */
function parsePasswordResetError(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'An error occurred while sending the reset email. Please try again.';
  }

  const err = error as { code?: string; message?: string };

  switch (err.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many reset requests. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'Failed to send password reset email. Please try again later.';
  }
}
