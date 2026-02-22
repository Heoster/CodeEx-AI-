'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Application Error</h1>
              <p className="text-muted-foreground">
                We're sorry, but something went wrong. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="bg-muted p-4 rounded-lg text-left">
                <p className="font-semibold text-sm mb-2">Error Details:</p>
                <pre className="text-xs overflow-auto max-h-40 text-destructive">
                  {error.message}
                </pre>
              </div>
            )}

            <Button onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
