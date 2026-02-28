'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Key, 
  Zap, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Database,
  Cpu,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function APIDocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Code className="h-4 w-4 text-indigo-600" />
          <span className="font-medium">API Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          CODEEX AI API
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Integrate CODEEX AI's powerful multi-model capabilities into your applications. 
          RESTful API with comprehensive AI services and real-time responses.
        </p>
      </div>

      {/* Quick Access */}
      <div className="flex justify-center gap-4">
        <Link href="/contact">
          <Button size="lg" className="gap-2">
            <Key className="h-5 w-5" />
            Get API Key
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          View OpenAPI Spec
        </Button>
      </div>

      {/* API Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Multi-Model Access"
          description="Access 13+ AI models through unified endpoints"
          icon={Cpu}
          badge="13+ Models"
        />
        <FeatureCard
          title="RESTful Design"
          description="Standard HTTP methods with JSON responses"
          icon={Globe}
        />
        <FeatureCard
          title="Real-Time Streaming"
          description="Server-sent events for live AI responses"
          icon={Zap}
        />
        <FeatureCard
          title="Secure Authentication"
          description="API key authentication with rate limiting"
          icon={Lock}
        />
        <FeatureCard
          title="Comprehensive Logging"
          description="Detailed request/response logging and analytics"
          icon={Database}
        />
        <FeatureCard
          title="Developer Tools"
          description="SDKs, examples, and interactive documentation"
          icon={BookOpen}
        />
      </div>

      {/* Base URL and Authentication */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Base URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                https://codeex-ai.vercel.app/api/v1
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All API requests should be made to this base URL with the appropriate endpoint.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Include your API key in the Authorization header for all requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">API Endpoints</h2>
        <div className="space-y-4">
          <EndpointCard
            method="POST"
            endpoint="/chat/completions"
            description="Generate AI responses using various models"
            parameters={[
              { name: "model", type: "string", required: true, description: "AI model to use (e.g., 'gpt-4', 'claude-3')" },
              { name: "messages", type: "array", required: true, description: "Array of message objects" },
              { name: "temperature", type: "number", required: false, description: "Randomness (0.0-2.0)" },
              { name: "max_tokens", type: "number", required: false, description: "Maximum response length" }
            ]}
          />
          <EndpointCard
            method="POST"
            endpoint="/images/generate"
            description="Generate images from text descriptions"
            parameters={[
              { name: "prompt", type: "string", required: true, description: "Text description of the image" },
              { name: "model", type: "string", required: false, description: "Image model (default: 'dall-e-3')" },
              { name: "size", type: "string", required: false, description: "Image size (e.g., '1024x1024')" },
              { name: "quality", type: "string", required: false, description: "Image quality ('standard' or 'hd')" }
            ]}
          />
          <EndpointCard
            method="POST"
            endpoint="/analyze/document"
            description="Analyze PDF documents and extract insights"
            parameters={[
              { name: "file", type: "file", required: true, description: "PDF file to analyze" },
              { name: "query", type: "string", required: false, description: "Specific question about the document" },
              { name: "extract_text", type: "boolean", required: false, description: "Whether to extract full text" }
            ]}
          />
          <EndpointCard
            method="POST"
            endpoint="/solve/math"
            description="Solve mathematical equations and problems"
            parameters={[
              { name: "problem", type: "string", required: true, description: "Mathematical problem or equation" },
              { name: "show_steps", type: "boolean", required: false, description: "Include step-by-step solution" },
              { name: "format", type: "string", required: false, description: "Response format ('text' or 'latex')" }
            ]}
          />
          <EndpointCard
            method="GET"
            endpoint="/search/web"
            description="Search the web for current information"
            parameters={[
              { name: "q", type: "string", required: true, description: "Search query" },
              { name: "limit", type: "number", required: false, description: "Number of results (max 10)" },
              { name: "include_sources", type: "boolean", required: false, description: "Include source URLs" }
            ]}
          />
        </div>
      </div>

      {/* Response Format */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Response Format</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-700">Success Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
{`{
  "success": true,
  "data": {
    "id": "req_123456",
    "model": "gpt-4",
    "content": "AI response content",
    "usage": {
      "prompt_tokens": 50,
      "completion_tokens": 100,
      "total_tokens": 150
    }
  },
  "timestamp": "2026-01-15T10:30:00Z"
}`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-700">Error Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
{`{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key provided",
    "details": "Check your API key format"
  },
  "timestamp": "2026-01-15T10:30:00Z"
}`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Code Examples</h2>
        <div className="space-y-4">
          <CodeExampleCard
            title="JavaScript/Node.js"
            language="javascript"
            code={`const response = await fetch('https://codeex-ai.vercel.app/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Explain quantum computing' }
    ],
    temperature: 0.7,
    max_tokens: 500
  })
});

const data = await response.json();
console.log(data.data.content);`}
          />
          <CodeExampleCard
            title="Python"
            language="python"
            code={`import requests

url = "https://codeex-ai.vercel.app/api/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "gpt-4",
    "messages": [
        {"role": "user", "content": "Explain quantum computing"}
    ],
    "temperature": 0.7,
    "max_tokens": 500
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["data"]["content"])`}
          />
          <CodeExampleCard
            title="cURL"
            language="bash"
            code={`curl -X POST https://codeex-ai.vercel.app/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Explain quantum computing"}
    ],
    "temperature": 0.7,
    "max_tokens": 500
  }'`}
          />
        </div>
      </div>

      {/* Rate Limits */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Rate Limits & Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <RateLimitCard
            tier="Free"
            requests="100/day"
            rateLimit="10/minute"
            features={["Basic models", "Standard support", "Community access"]}
            price="$0/month"
          />
          <RateLimitCard
            tier="Pro"
            requests="10,000/day"
            rateLimit="100/minute"
            features={["All models", "Priority support", "Advanced features"]}
            price="$29/month"
          />
          <RateLimitCard
            tier="Enterprise"
            requests="Unlimited"
            rateLimit="1000/minute"
            features={["Custom models", "24/7 support", "SLA guarantee"]}
            price="Custom"
          />
        </div>
      </div>

      {/* Error Codes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Error Codes</h2>
        <div className="space-y-3">
          <ErrorCodeCard
            code="400"
            name="Bad Request"
            description="Invalid request format or missing required parameters"
          />
          <ErrorCodeCard
            code="401"
            name="Unauthorized"
            description="Invalid or missing API key"
          />
          <ErrorCodeCard
            code="403"
            name="Forbidden"
            description="API key doesn't have permission for this endpoint"
          />
          <ErrorCodeCard
            code="429"
            name="Rate Limited"
            description="Too many requests, please slow down"
          />
          <ErrorCodeCard
            code="500"
            name="Server Error"
            description="Internal server error, please try again later"
          />
        </div>
      </div>

      {/* SDKs and Libraries */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">SDKs & Libraries</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SDKCard
            name="JavaScript SDK"
            description="Official Node.js and browser SDK"
            status="Available"
            installCommand="npm install @codeex/ai-sdk"
          />
          <SDKCard
            name="Python SDK"
            description="Official Python library"
            status="Available"
            installCommand="pip install codeex-ai"
          />
          <SDKCard
            name="Go SDK"
            description="Official Go module"
            status="Beta"
            installCommand="go get github.com/codeex/ai-go"
          />
          <SDKCard
            name="PHP SDK"
            description="Community-maintained library"
            status="Community"
            installCommand="composer require codeex/ai-php"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border bg-gradient-to-br from-indigo-50 via-indigo-25 to-background p-8 text-center">
        <Code className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Ready to Build with CODEEX AI?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Get your API key and start integrating powerful AI capabilities into your applications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              <Key className="h-4 w-4" />
              Get API Key
            </Button>
          </Link>
          <Link href="/docs/quick-start">
            <Button size="lg" variant="outline">
              Quick Start Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function EndpointCard({
  method,
  endpoint,
  description,
  parameters,
}: {
  method: string;
  endpoint: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}) {
  const methodColor = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-gray-100 text-gray-800',
    DELETE: 'bg-red-100 text-red-800'
  }[method] || 'bg-gray-100 text-gray-800';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge className={methodColor}>{method}</Badge>
          <div className="flex-1">
            <CardTitle className="text-lg font-mono">{endpoint}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Parameters:</h4>
          <div className="space-y-2">
            {parameters.map((param, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs">{param.name}</code>
                  <Badge variant="outline" className="text-xs">{param.type}</Badge>
                  {param.required && <Badge variant="destructive" className="text-xs">required</Badge>}
                </div>
                <p className="text-muted-foreground flex-1">{param.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CodeExampleCard({
  title,
  language,
  code,
}: {
  title: string;
  language: string;
  code: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">{language}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm"><code>{code}</code></pre>
        </div>
      </CardContent>
    </Card>
  );
}

function RateLimitCard({
  tier,
  requests,
  rateLimit,
  features,
  price,
}: {
  tier: string;
  requests: string;
  rateLimit: string;
  features: string[];
  price: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{tier}</CardTitle>
        <div className="text-2xl font-bold">{price}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Requests:</span>
            <span className="font-medium">{requests}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Rate Limit:</span>
            <span className="font-medium">{rateLimit}</span>
          </div>
        </div>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorCodeCard({
  code,
  name,
  description,
}: {
  code: string;
  name: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded font-mono font-bold">
            {code}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SDKCard({
  name,
  description,
  status,
  installCommand,
}: {
  name: string;
  description: string;
  status: string;
  installCommand: string;
}) {
  const statusColor = {
    Available: 'bg-green-100 text-green-800',
    Beta: 'bg-gray-100 text-gray-800',
    Community: 'bg-blue-100 text-blue-800'
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge className={statusColor}>{status}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-2 rounded text-xs font-mono">
          {installCommand}
        </div>
      </CardContent>
    </Card>
  );
}