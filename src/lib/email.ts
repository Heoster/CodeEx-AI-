// Server-side email utilities
import emailjs, { type EmailJSResponseStatus } from 'emailjs-com';

// EmailJS configuration with validation
// Note: These should be NEXT_PUBLIC_ prefixed to work in both client and server
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const WELCOME_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codeex-ai.netlify.app';

export interface ContactEmailParams {
  user_name: string;
  user_email: string;
  message: string;
}

export interface WelcomeEmailParams {
  to_email: string;
  to_name: string;
  app_url: string;
}

export interface EmailResponse {
  success: boolean;
  response?: EmailJSResponseStatus;
  error?: string;
}

/**
 * Check if EmailJS is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!(SERVICE_ID && USER_ID);
}

/**
 * Check if welcome email template is configured
 */
export function isWelcomeEmailConfigured(): boolean {
  return !!(isEmailConfigured() && WELCOME_TEMPLATE_ID);
}

/**
 * Send a contact form email
 */
export async function sendContactEmail(params: ContactEmailParams): Promise<EmailResponse> {
  if (!isEmailConfigured() || !CONTACT_TEMPLATE_ID) {
    return { 
      success: false, 
      error: 'Email service is not configured. Please set up EmailJS in your environment variables.' 
    };
  }

  try {
    const response = await emailjs.send(SERVICE_ID!, CONTACT_TEMPLATE_ID!, {
      ...params,
      app_url: APP_URL,
    }, USER_ID!);
    
    return { success: true, response };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send contact email:', error);
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(email: string, displayName: string): Promise<EmailResponse> {
  if (!isWelcomeEmailConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Welcome email not configured, skipping...');
    }
    return { success: true }; // Don't fail if not configured
  }

  try {
    // EmailJS template parameters
    const templateParams = {
      to_name: displayName,        // User's name
      email: email,                // User's email
      app_url: APP_URL,            // App URL
    };

    const response = await emailjs.send(
      SERVICE_ID!,
      WELCOME_TEMPLATE_ID!,
      templateParams,
      USER_ID!
    );
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Welcome email sent successfully to:', email);
    }
    return { success: true, response };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send welcome email:', error);
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}
