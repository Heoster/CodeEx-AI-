'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface ChangeEmailFormProps {
  currentEmail?: string;
}

export function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;

      if (!user) {
        setResult({
          success: false,
          message: 'You must be logged in to change your email.',
        });
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, idToken }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setNewEmail('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Change Email Address</h3>
        <p className="text-sm text-muted-foreground">
          Update your email address. You'll need to verify the new email before the change takes effect.
        </p>
      </div>

      {currentEmail && (
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm">
            <span className="font-medium">Current Email:</span> {currentEmail}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newEmail">New Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="newEmail"
              type="email"
              placeholder="newemail@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Change Email'
          )}
        </Button>
      </form>
    </div>
  );
}
