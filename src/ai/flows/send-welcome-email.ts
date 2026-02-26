'use server';

/**
 * @fileOverview A flow for sending a welcome email to new users.
 *
 * - sendWelcomeEmail - A function that handles sending the email.
 * - WelcomeEmailInput - The input type for the sendWelcomeEmail function.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';

const WelcomeEmailInputSchema = z.object({
  email: z.string().email().describe('The email address of the new user.'),
  displayName: z.string().describe('The display name of the new user.'),
});
export type WelcomeEmailInput = z.infer<typeof WelcomeEmailInputSchema>;

// As we don't have an email provider configured, this flow will simulate
// sending an email by logging to the console. In a real application,
// this would integrate with a service like SendGrid, Resend, or AWS SES.
const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: WelcomeEmailInputSchema,
    outputSchema: z.void(),
  },
  async (input: z.infer<typeof WelcomeEmailInputSchema>) => {
    const {email, displayName} = input;
    const fromEmail = 'codeex@email.com';
    const emailSubject = 'Welcome to CODEEX AI! 🎉';

    const emailBody = `<div style="text-align: center; margin-bottom: 1rem;">
  <img src="/favicon.ico" alt="CODEEX AI Logo" width="48" height="48" />
</div>

Hi ${displayName},

Welcome aboard!

We’re thrilled to have you with us at **CODEEX AI**. 🎉
Your verification was successful, and you're now ready to experience the future of intelligent technology.

At Codeex, we hold our users in the highest regard. Every feature in this app is designed with *you* in mind — a testament to our deep commitment to excellence and innovation.

This app is proudly developed by **Heoster**. Thank you for being part of our journey.

Let’s shape the future together.

Warm regards,
Team CODEEX AI 🚀`;

    if (process.env.NODE_ENV === 'development') {
      console.log('--- SIMULATING SENDING WELCOME EMAIL ---');
      console.log(`From: ${fromEmail}`);
      console.log(`Subject: ${emailSubject}`);
      console.log('Welcome email prepared for new user');
      console.log('-----------------------------------------');
    }

    // In a real implementation, you would use an email service client here.
    // Example (pseudo-code):
    // await emailClient.send({
    //   to: email,
    //   from: fromEmail,
    //   subject: emailSubject,
    //   html: emailBody, // Or a templated version
    // });
  }
);

export async function sendWelcomeEmail(
  input: WelcomeEmailInput
): Promise<void> {
  await sendWelcomeEmailFlow(input);
}
