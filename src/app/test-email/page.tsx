'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { testEmailConfiguration, runEmailTests } from '@/lib/test-email';

export default function TestEmailPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const config = testEmailConfiguration();

  const runTests = async () => {
    setTesting(true);
    try {
      const results = await runEmailTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-xl font-bold">Email Service Test</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <span>Contact Email Service</span>
                  {config.configured ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      Not Configured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Welcome Email Service</span>
                  {config.welcomeConfigured ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Configured
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Optional
                    </Badge>
                  )}
                </div>
              </div>

              {config.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Configuration Errors:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                    {config.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Run Email Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runTests} 
                disabled={testing || !config.configured}
                className="w-full"
              >
                {testing ? 'Running Tests...' : 'Run Email Service Tests'}
              </Button>
            </CardContent>
          </Card>

          {testResults && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Contact Email Test</h4>
                    <div className="flex items-center gap-2">
                      {testResults.contactTest.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {testResults.contactTest.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Welcome Email Test</h4>
                    <div className="flex items-center gap-2">
                      {testResults.welcomeTest.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {testResults.welcomeTest.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}