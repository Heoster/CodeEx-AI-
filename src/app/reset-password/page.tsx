'use client';

import { PasswordResetForm } from '@/components/auth/password-reset-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 w-full max-w-md">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </div>

      <PasswordResetForm />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Remember your password?</p>
        <Link href="/login" className="text-primary hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
