'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Code, 
  MessageSquare, 
  Calculator, 
  FileText, 
  Image, 
  Brain,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { APP_CONFIG } from '@/lib/app-config';

export default function APIReferencePage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Globe className="h-4 w-4 text-primary" />
          <span className="font-medium">API Reference & URLs</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          App URLs & API Reference
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete reference for CODEEX AI URLs, endpoints, and integration guides.
        </p>
      </div>

      {/* Main App URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Main Application URLs
          </CardTitle>
          <CardDescription>
            Direct links to access CODEEX AI features and tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <URLCard
              title="Main App"
              description="CODEEX AI homepage and main interface"
              url={APP_CONFIG.BASE_URL}
              icon={<Globe className="h-4 w-4" />}
            />
            <URLCard
              title="Chat Interface"
              description="Start chatting with AI models"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.chat}`}
              icon={<MessageSquare className="h-4 w-4" />}
            />
            <URLCard
              title="Smart Notes Pro"
              description="AI-powered research notes with 18+ sources"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.smartNotes}`}
              icon={<FileText className="h-4 w-4" />}
              badge="New"
            />
            <URLCard
              title="Math Solver"
              description="Visual equation solving with step-by-step explanations"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.mathSolver}`}
              icon={<Calculator className="h-4 w-4" />}
            />
            <URLCard
              title="PDF Analyzer"
              description="Extract insights from documents"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.pdfAnalyzer}`}
              icon={<FileText className="h-4 w-4" />}
            />
            <URLCard
              title="AI Image Generator"
              description="Create AI art with multiple models"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.imageGenerator}`}
              icon={<Image className="h-4 w-4" />}
            />
            <URLCard
              title="Jarvis Mode"
              description="Voice-enabled AI assistant"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.jarvisMode}`}
              icon={<Sparkles className="h-4 w-4" />}
            />
            <URLCard
              title="Memory Dashboard"
              description="Smart contextual memory management"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.FEATURES.memoryDashboard}`}
              icon={<Brain className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Documentation URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Documentation URLs
          </CardTitle>
          <CardDescription>
            Complete guides and tutorials for all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <URLCard
              title="Documentation Home"
              description="Main documentation hub"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.DOCS.base}`}
              icon={<Code className="h-4 w-4" />}
            />
            <URLCard
              title="Quick Start Guide"
              description="Get started in minutes"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.DOCS.quickStart}`}
              icon={<Code className="h-4 w-4" />}
              badge="Start Here"
            />
            <URLCard
              title="AI Models Guide"
              description="Learn about 21+ AI models"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.DOCS.aiModels}`}
              icon={<Code className="h-4 w-4" />}
            />
            <URLCard
              title="Commands Reference"
              description="Master slash commands"
              url={`${APP_CONFIG.BASE_URL}${APP_CONFIG.DOCS.commands}`}
              icon={<Code className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            API Endpoints
          </CardTitle>
          <CardDescription>
            REST API endpoints for integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <APIEndpointCard
              method="POST"
              endpoint="/api/chat-direct"
              description="Direct chat API for custom integrations"
              url={`${APP_CONFIG.API_BASE_URL}/chat-direct`}
            />
            <APIEndpointCard
              method="POST"
              endpoint="/api/smart-notes"
              description="Generate smart notes from topics"
              url={`${APP_CONFIG.API_BASE_URL}/smart-notes`}
            />
            <APIEndpointCard
              method="POST"
              endpoint="/api/ai-services/pdf-reader"
              description="PDF analysis and extraction"
              url={`${APP_CONFIG.API_BASE_URL}/ai-services/pdf-reader`}
            />
            <APIEndpointCard
              method="POST"
              endpoint="/api/ai-services/image-quiz"
              description="Image analysis and quiz generation"
              url={`${APP_CONFIG.API_BASE_URL}/ai-services/image-quiz`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Code examples for integrating with CODEEX AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Direct Link to Chat</h4>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">
                  {`<a href="${APP_CONFIG.SHARE_URLS.chat}" target="_blank">Chat with CODEEX AI</a>`}
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Embed Smart Notes</h4>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">
                  {`<iframe src="${APP_CONFIG.SHARE_URLS.smartNotes}" width="100%" height="600"></iframe>`}
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Math Solver Widget</h4>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">
                  {`<iframe src="${APP_CONFIG.SHARE_URLS.mathSolver}" width="100%" height="500"></iframe>`}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface URLCardProps {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  badge?: string;
}

function URLCard({ title, description, url, icon, badge }: URLCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-primary mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{title}</h4>
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <code className="text-xs bg-background px-2 py-1 rounded border">
            {url}
          </code>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}

interface APIEndpointCardProps {
  method: string;
  endpoint: string;
  description: string;
  url: string;
}

function APIEndpointCard({ method, endpoint, description, url }: APIEndpointCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <Badge 
          variant={method === 'POST' ? 'default' : 'secondary'} 
          className="mt-1 text-xs"
        >
          {method}
        </Badge>
        <div className="flex-1">
          <h4 className="font-semibold">{endpoint}</h4>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <code className="text-xs bg-background px-2 py-1 rounded border">
            {url}
          </code>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 w-8 p-0"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}