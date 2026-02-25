'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { ChangeEmailForm } from '@/components/auth/change-email-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSendVerification = async () => {
    if (!user) return;

    setVerificationLoading(true);
    setVerificationResult(null);

    try {
      const idToken = await user.getIdToken();

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      setVerificationResult(data);
    } catch (error) {
      setVerificationResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Email Verification
            </CardTitle>
            <CardDescription>
              Verify your email address to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.emailVerified ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        Not verified
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {!user.emailVerified && (
                <Button
                  onClick={handleSendVerification}
                  disabled={verificationLoading}
                  variant="outline"
                >
                  {verificationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Verification'
                  )}
                </Button>
              )}
            </div>

            {verificationResult && (
              <Alert variant={verificationResult.success ? 'default' : 'destructive'}>
                {verificationResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{verificationResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card>
          <CardHeader>
            <CardTitle>Change Email Address</CardTitle>
            <CardDescription>
              Update your email address for account access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeEmailForm currentEmail={user.email || undefined} />
          </CardContent>
        </Card>

        {/* Password Reset */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Reset your password if you've forgotten it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/reset-password')}
              variant="outline"
              className="w-full"
            >
              Reset Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-medium">User ID:</span>
              <span className="text-muted-foreground">{user.uid}</span>
              
              <span className="font-medium">Created:</span>
              <span className="text-muted-foreground">
                {user.metadata.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'Unknown'}
              </span>
              
              <span className="font-medium">Last Sign In:</span>
              <span className="text-muted-foreground">
                {user.metadata.lastSignInTime 
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
