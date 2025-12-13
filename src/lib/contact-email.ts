interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: 'support' | 'feedback' | 'bug' | 'partnership' | 'other';
}

interface SendContactEmailResponse {
  success: boolean;
  message: string;
}

/**
 * Sends a contact form email using existing EmailJS service
 */
export async function sendContactFormEmail(
  data: ContactFormData
): Promise<SendContactEmailResponse> {
  // Validate input
  if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
    return {
      success: false,
      message: 'Please fill in all required fields.',
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  // Check message length
  if (data.message.length > 5000) {
    return {
      success: false,
      message: 'Message is too long. Maximum 5000 characters allowed.',
    };
  }

  // Check name length
  if (data.name.length > 100) {
    return {
      success: false,
      message: 'Name is too long. Maximum 100 characters allowed.',
    };
  }

  try {
    // Use the existing email service from email.ts
    const { sendContactEmail } = await import('./email');
    
    const emailParams = {
      user_name: data.name,
      user_email: data.email,
      message: `**Category:** ${data.category || 'General'}\n**Subject:** ${data.subject}\n\n${data.message}`,
    };

    const result = await sendContactEmail(emailParams);

    if (result.success) {
      return {
        success: true,
        message: 'Your message has been sent successfully. We&apos;ll get back to you soon!',
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to send your message. Please try again.',
      };
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'Failed to send your message. Please try again later or email us at codeex@email.com.',
    };
  }
}

