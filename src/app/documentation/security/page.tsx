import { Metadata } from 'next';
import { Shield, Lock, Eye, Database, Server, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Security & Privacy - CodeEx AI',
  description: 'Learn about CodeEx AI security measures, data protection, and privacy policies.',
};

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Security & Privacy</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your security and privacy are our top priorities. Learn how we protect your data and ensure secure AI interactions.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Protection
            </CardTitle>
            <CardDescription>
              How we handle and protect your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Encrypted</Badge>
                <div>
                  <h4 className="font-semibold">End-to-End Encryption</h4>
                  <p className="text-sm text-muted-foreground">All data transmission is encrypted using industry-standard protocols.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Secure</Badge>
                <div>
                  <h4 className="font-semibold">No Data Storage</h4>
                  <p className="text-sm text-muted-foreground">Conversations are not permanently stored on our servers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Private</Badge>
                <div>
                  <h4 className="font-semibold">Local Processing</h4>
                  <p className="text-sm text-muted-foreground">When possible, processing happens locally on your device.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Security
            </CardTitle>
            <CardDescription>
              Secure API key management and usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Protected</Badge>
                <div>
                  <h4 className="font-semibold">API Key Protection</h4>
                  <p className="text-sm text-muted-foreground">Your API keys are stored securely and never exposed to third parties.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Validated</Badge>
                <div>
                  <h4 className="font-semibold">Request Validation</h4>
                  <p className="text-sm text-muted-foreground">All API requests are validated and sanitized before processing.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Measures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy Measures
            </CardTitle>
            <CardDescription>
              Your privacy protection measures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Anonymous</Badge>
                <div>
                  <h4 className="font-semibold">Anonymous Usage</h4>
                  <p className="text-sm text-muted-foreground">No personal identification required for basic usage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Minimal</Badge>
                <div>
                  <h4 className="font-semibold">Minimal Data Collection</h4>
                  <p className="text-sm text-muted-foreground">We collect only essential data needed for service functionality.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Infrastructure Security
            </CardTitle>
            <CardDescription>
              Server and infrastructure protection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Monitored</Badge>
                <div>
                  <h4 className="font-semibold">24/7 Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Continuous monitoring for security threats and anomalies.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Updated</Badge>
                <div>
                  <h4 className="font-semibold">Regular Updates</h4>
                  <p className="text-sm text-muted-foreground">Security patches and updates are applied promptly.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Best Practices
            </CardTitle>
            <CardDescription>
              Recommendations for secure usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Keep your API keys private and never share them publicly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use strong, unique passwords for your accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Regularly review and rotate your API keys</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Be cautious when sharing sensitive information in conversations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Report any security concerns immediately</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}