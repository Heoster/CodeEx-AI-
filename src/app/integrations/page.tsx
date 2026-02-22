'use client';

import { 
  Code, 
  Database, 
  Globe, 
  Webhook, 
  Zap, 
  Github, 
  Slack, 
  Chrome,
  Smartphone,
  Cloud,
  Terminal,
  FileText,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';

const integrations = [
  {
    name: 'REST API',
    description: 'Full REST API access to all CODEEX AI capabilities',
    icon: <Code className="h-6 w-6" />,
    status: 'available',
    category: 'API',
    features: ['5 endpoints', 'Multi-provider fallback', 'JSON responses', 'Error handling'],
    docs: '/documentation#api',
  },
  {
    name: 'JavaScript SDK',
    description: 'Official JavaScript/TypeScript SDK for web applications',
    icon: <Globe className="h-6 w-6" />,
    status: 'coming-soon',
    category: 'SDK',
    features: ['TypeScript support', 'Promise-based', 'Auto-retry', 'Type safety'],
  },
  {
    name: 'Python SDK',
    description: 'Python library for server-side integrations',
    icon: <Terminal className="h-6 w-6" />,
    status: 'coming-soon',
    category: 'SDK',
    features: ['Async/await support', 'Type hints', 'Error handling', 'Streaming'],
  },
  {
    name: 'Webhooks',
    description: 'Real-time notifications for AI processing events',
    icon: <Webhook className="h-6 w-6" />,
    status: 'coming-soon',
    category: 'Integration',
    features: ['Event notifications', 'Secure delivery', 'Retry logic', 'Custom endpoints'],
  },
  {
    name: 'Zapier',
    description: 'Connect CODEEX AI to 5000+ apps with no-code automation',
    icon: <Zap className="h-6 w-6" />,
    status: 'planned',
    category: 'No-Code',
    features: ['Trigger workflows', 'Multi-step zaps', 'Data transformation', 'Conditional logic'],
  },
  {
    name: 'GitHub Integration',
    description: 'AI-powered code review and documentation generation',
    icon: <Github className="h-6 w-6" />,
    status: 'planned',
    category: 'Developer Tools',
    features: ['Code review', 'Auto documentation', 'Issue analysis', 'PR summaries'],
  },
  {
    name: 'Slack Bot',
    description: 'Bring CODEEX AI directly into your Slack workspace',
    icon: <Slack className="h-6 w-6" />,
    status: 'planned',
    category: 'Communication',
    features: ['Slash commands', 'Direct messages', 'Channel integration', 'File analysis'],
  },
  {
    name: 'Browser Extension',
    description: 'AI assistance anywhere on the web',
    icon: <Chrome className="h-6 w-6" />,
    status: 'planned',
    category: 'Browser',
    features: ['Context menu', 'Page analysis', 'Quick actions', 'Offline mode'],
  },
  {
    name: 'Mobile SDK',
    description: 'Native mobile app integration for iOS and Android',
    icon: <Smartphone className="h-6 w-6" />,
    status: 'planned',
    category: 'Mobile',
    features: ['Native performance', 'Offline caching', 'Voice integration', 'Camera input'],
  },
  {
    name: 'Cloud Functions',
    description: 'Serverless deployment templates for major cloud providers',
    icon: <Cloud className="h-6 w-6" />,
    status: 'planned',
    category: 'Cloud',
    features: ['AWS Lambda', 'Google Cloud Functions', 'Azure Functions', 'Auto-scaling'],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="Integrations"
      />
      
      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Integrate CODEEX AI
            <span className="block gradient-text">Into Your Workflow</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect CODEEX AI to your favorite tools and platforms. Build powerful AI-driven
            applications with our comprehensive integration options.
          </p>
        </div>

        {/* Current API Section */}
        <Card className="mb-12 border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>REST API - Available Now</CardTitle>
                <CardDescription>
                  Start integrating immediately with our full-featured REST API
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">API Endpoints</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">AI Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5MB</div>
                <div className="text-sm text-muted-foreground">File Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Auto</div>
                <div className="text-sm text-muted-foreground">Fallback</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/test-api">
                <Button className="btn-gradient">
                  Test API Endpoints
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Available Integrations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className={integration.status === 'available' ? 'border-primary/50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted text-foreground">
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge 
                          variant={integration.status === 'available' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {integration.status === 'available' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {integration.status === 'coming-soon' && <Clock className="mr-1 h-3 w-3" />}
                          {integration.status === 'planned' && <Clock className="mr-1 h-3 w-3" />}
                          {integration.status === 'available' ? 'Available' : 
                           integration.status === 'coming-soon' ? 'Coming Soon' : 'Planned'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {integration.docs && (
                    <Link href={integration.docs}>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Documentation
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Developer Resources */}
        <div className="mt-16 space-y-8">
          <h2 className="text-3xl font-bold text-center">Developer Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  API Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete API reference with examples, authentication, and error handling.
                </p>
                <Link href="/documentation">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Docs
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  API Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive API testing interface to try all endpoints with real data.
                </p>
                <Link href="/test-api">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Test API
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-primary" />
                  Source Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Open source examples and integration templates on GitHub.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-y-6 py-12 border-t">
          <h2 className="text-3xl font-bold">Ready to Build?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start integrating CODEEX AI into your applications today with our REST API.
            More integration options coming soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-gradient">
                Get API Access
              </Button>
            </Link>
            <Link href="/test-api">
              <Button size="lg" variant="outline">
                Try API Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}