'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { sendPasswordReset } from '@/lib/password-reset';
import { useToast } from '@/hooks/use-toast';

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill email from query params if available
  useEffect(() => {
    const emailParam = searchParams?.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await sendPasswordReset(email);

    if (result.success) {
      setSubmitted(true);
      toast({
        title: 'Email Sent! 📧',
        description: result.message,
      });
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
        <div className="container mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left panel */}
          <div className="hidden flex-col justify-center gap-6 rounded-lg p-8 md:flex">
            <div>
              <h2 className="text-4xl font-extrabold">
                Check your <span className="gradient-text">email</span>
              </h2>
              <p className="mt-3 max-w-lg text-lg text-muted-foreground">
                We&apos;ve sent a password reset link to your inbox. Click the link to create a new password and regain access to your account.
              </p>
            </div>
            <div className="mt-6">
              <Image src="/favicon.ico" alt="CODEEX AI" width={80} height={80} />
            </div>
          </div>

          {/* Right card */}
          <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Image src="/favicon.ico" alt="CODEEX AI Logo" width={56} height={56} />
              </div>
              <h1 className="text-2xl font-bold">Reset link sent!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Check your email for further instructions.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                <p className="font-medium">Next steps:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>✓ Check your email inbox for the reset link</li>
                  <li>✓ Click the link in the email</li>
                  <li>✓ Create a new password</li>
                  <li>✓ Sign in with your new password</li>
                </ul>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive an email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </p>

              <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400">Still can&apos;t reset your password?</p>
                <p className="mt-2 text-muted-foreground">
                  Contact our support team at{' '}
                  <a href="mailto:codeex@email.com" className="text-primary hover:underline">
                    codeex@email.com
                  </a>
                  {' '}for assistance.
                </p>
              </div>
            </div>

            <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="container mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden flex-col justify-center gap-6 rounded-lg p-8 md:flex">
          <div>
            <h2 className="text-4xl font-extrabold">
              Forgot your <span className="gradient-text">password?</span>
            </h2>
            <p className="mt-3 max-w-lg text-lg text-muted-foreground">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password and regain access to your account.
            </p>
          </div>
          <div className="mt-6">
            <Image src="/favicon.ico" alt="CODEEX AI" width={80} height={80} />
          </div>
        </div>

        {/* Right card */}
        <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Image src="/favicon.ico" alt="CODEEX AI Logo" width={56} height={56} />
            </div>
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="btn-gradient w-full py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Sending link...' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center text-xs">
            <p className="font-medium text-amber-700 dark:text-amber-400">Password reset not working?</p>
            <p className="mt-1 text-muted-foreground">
              Contact us at{' '}
              <a href="mailto:codeex@email.com" className="text-primary hover:underline">
                codeex@email.com
              </a>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            CodeEx powered by Heoster.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
