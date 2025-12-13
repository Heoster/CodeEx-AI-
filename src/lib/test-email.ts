/**
 * Email Service Test Utility
 * Tests EmailJS configuration and functionality
 */

import { isEmailConfigured, isWelcomeEmailConfigured, sendContactEmail, sendWelcomeEmail } from './email';

export interface EmailTestResult {
  configured: boolean;
  welcomeConfigured: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Test email service configuration
 */
export function testEmailConfiguration(): EmailTestResult {
  const result: EmailTestResult = {
    configured: false,
    welcomeConfigured: false,
    errors: [],
    warnings: []
  };

  // Check basic configuration
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const welcomeTemplateId = process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID;
  const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

  if (!serviceId) {
    result.errors.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID is not set');
  }

  if (!userId) {
    result.errors.push('NEXT_PUBLIC_EMAILJS_USER_ID is not set');
  }

  if (!templateId) {
    result.errors.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID is not set');
  }

  if (!welcomeTemplateId) {
    result.warnings.push('NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID is not set (welcome emails disabled)');
  }

  result.configured = isEmailConfigured();
  result.welcomeConfigured = isWelcomeEmailConfigured();

  if (result.configured && !templateId) {
    result.warnings.push('EmailJS is configured but contact template ID is missing');
  }

  return result;
}

/**
 * Test sending a contact email (dry run)
 */
export async function testContactEmail(): Promise<{ success: boolean; error?: string }> {
  try {
    const testParams = {
      user_name: 'Test User',
      user_email: 'test@example.com',
      message: 'This is a test message from the email service test utility.'
    };

    const result = await sendContactEmail(testParams);
    return { success: result.success, error: result.error };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Test sending a welcome email (dry run)
 */
export async function testWelcomeEmail(): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendWelcomeEmail('test@example.com', 'Test User');
    return { success: result.success, error: result.error };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Run comprehensive email service tests
 */
export async function runEmailTests(): Promise<{
  configuration: EmailTestResult;
  contactTest: { success: boolean; error?: string };
  welcomeTest: { success: boolean; error?: string };
}> {
  const configuration = testEmailConfiguration();
  
  let contactTest: { success: boolean; error?: string } = { success: false, error: 'Configuration not valid' };
  let welcomeTest: { success: boolean; error?: string } = { success: false, error: 'Configuration not valid' };

  if (configuration.configured) {
    contactTest = await testContactEmail();
  }

  if (configuration.welcomeConfigured) {
    welcomeTest = await testWelcomeEmail();
  }

  return {
    configuration,
    contactTest,
    welcomeTest
  };
}