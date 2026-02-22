'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Globe, 
  Zap, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowRight,
  Link as LinkIcon,
  Clock,
  Shield,
  TrendingUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function WebSearchDocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Search className="h-4 w-4 text-purple-600" />
          <span className="font-medium">Web Search</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Real-Time Web Search
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get up-to-date information from the web with AI-powered search and analysis. 
          Includes source citations, fact-checking, and comprehensive summaries.
        </p>
      </div>

      {/* Quick Access */}
      <div className="flex justify-center">
        <Link href="/chat">
          <Button size="lg" className="gap-2">
            <Search className="h-5 w-5" />
            Try Web Search Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Real-Time Results"
          description="Get the latest information from across the web"
          icon={Clock}
          badge="Live Data"
        />
        <FeatureCard
          title="Source Citations"
          description="Every answer includes links to original sources"
          icon={LinkIcon}
        />
        <FeatureCard
          title="Fact Verification"
          description="Cross-reference multiple sources for accuracy"
          icon={Shield}
        />
        <FeatureCard
          title="Smart Summaries"
          description="AI-generated summaries of complex topics"
          icon={FileText}
        />
        <FeatureCard
          title="Trending Topics"
          description="Stay updated with current events and trends"
          icon={TrendingUp}
        />
        <FeatureCard
          title="Multi-Language"
          description="Search and translate content from global sources"
          icon={Globe}
        />
      </div>

      {/* Search Types */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Types of Web Search</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SearchTypeCard
            title="General Information"
            description="Get comprehensive answers to any question"
            examples={[
              "What's the latest news about AI?",
              "How does quantum computing work?",
              "Best practices for React development",
              "Current weather in Tokyo",
              "Stock market trends today"
            ]}
            icon={Globe}
          />
          <SearchTypeCard
            title="Research & Analysis"
            description="Deep dive into complex topics with multiple sources"
            examples={[
              "Compare different machine learning frameworks",
              "Analyze the impact of climate change",
              "Research the history of cryptocurrency",
              "Study market trends in renewable energy",
              "Investigate recent scientific discoveries"
            ]}
            icon={BookOpen}
          />
        </div>
      </div>

      {/* Search Commands */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Search Commands</h2>
        <div className="space-y-3">
          <CommandCard
            command="/search"
            description="Search the web for current information"
            example="/search latest developments in artificial intelligence"
          />
          <CommandCard
            command="/news"
            description="Get the latest news on a specific topic"
            example="/news technology trends 2026"
          />
          <CommandCard
            command="/research"
            description="Comprehensive research with multiple sources"
            example="/research impact of remote work on productivity"
          />
          <CommandCard
            command="/fact-check"
            description="Verify claims and statements with sources"
            example="/fact-check is coffee good for health?"
          />
          <CommandCard
            command="/trends"
            description="Discover trending topics and discussions"
            example="/trends social media platforms 2026"
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Usage Examples</h2>
        <div className="space-y-4">
          <ExampleCard
            title="Current Events"
            query="What are the latest developments in space exploration?"
            response="Recent SpaceX missions, NASA updates, and international space station news with links to official sources"
            sources={["NASA.gov", "SpaceX.com", "Space.com", "Reuters"]}
          />
          <ExampleCard
            title="Technical Research"
            query="Compare the performance of different JavaScript frameworks"
            response="Detailed comparison of React, Vue, Angular with benchmarks, community support, and use cases"
            sources={["GitHub", "Stack Overflow", "MDN", "Dev.to"]}
          />
          <ExampleCard
            title="Market Analysis"
            query="What's the current state of the cryptocurrency market?"
            response="Real-time prices, market trends, expert analysis, and regulatory updates"
            sources={["CoinMarketCap", "Bloomberg", "Reuters", "CoinDesk"]}
          />
        </div>
      </div>

      {/* Search Quality Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Search Quality Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QualityFeatureCard
            title="Source Diversity"
            description="Results from multiple reputable sources for balanced perspectives"
            icon={Globe}
          />
          <QualityFeatureCard
            title="Recency Filtering"
            description="Prioritize recent information for time-sensitive queries"
            icon={Clock}
          />
          <QualityFeatureCard
            title="Authority Ranking"
            description="Trusted sources ranked higher for reliable information"
            icon={Shield}
          />
          <QualityFeatureCard
            title="Content Analysis"
            description="AI analyzes content quality and relevance before presenting"
            icon={Target}
          />
          <QualityFeatureCard
            title="Bias Detection"
            description="Identify potential bias and present multiple viewpoints"
            icon={CheckCircle}
          />
          <QualityFeatureCard
            title="Fact Correlation"
            description="Cross-reference facts across multiple sources"
            icon={LinkIcon}
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Best Practices for Web Search</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TipCard
            title="Effective Query Writing"
            tips={[
              "Be specific about what you're looking for",
              "Include relevant keywords and context",
              "Specify time frames for current information",
              "Ask follow-up questions for deeper insights",
              "Use natural language - no need for search operators"
            ]}
          />
          <TipCard
            title="Evaluating Results"
            tips={[
              "Check multiple sources for consistency",
              "Look for recent publication dates",
              "Verify author credentials and source authority",
              "Cross-reference important facts",
              "Be aware of potential bias in sources"
            ]}
          />
        </div>
      </div>

      {/* Source Types */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Trusted Source Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SourceCard
            title="News & Media"
            sources={["Reuters", "BBC", "Associated Press", "NPR"]}
            icon={FileText}
          />
          <SourceCard
            title="Academic & Research"
            sources={["PubMed", "arXiv", "IEEE", "Nature"]}
            icon={BookOpen}
          />
          <SourceCard
            title="Government & Official"
            sources={["CDC", "NASA", "WHO", "Official Gov Sites"]}
            icon={Shield}
          />
          <SourceCard
            title="Technology & Industry"
            sources={["GitHub", "Stack Overflow", "TechCrunch", "Wired"]}
            icon={Zap}
          />
        </div>
      </div>

      {/* Privacy & Ethics */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Privacy & Ethical Search</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Privacy Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  No personal data stored in search queries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Anonymous search requests to protect identity
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  No tracking or profiling of search behavior
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Secure connections for all search requests
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Ethical Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Respect for source copyrights and attribution
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Balanced presentation of controversial topics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Clear distinction between facts and opinions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Transparent about information limitations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border bg-gradient-to-br from-purple-50 via-purple-25 to-background p-8 text-center">
        <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Ready to Search the Web?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Get real-time information with AI-powered web search and comprehensive source citations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Start Web Search
            </Button>
          </Link>
          <Link href="/docs/commands">
            <Button size="lg" variant="outline">
              View Search Commands
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
          <div className="p-2 rounded-lg bg-purple-100">
            <Icon className="h-6 w-6 text-purple-600" />
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

function SearchTypeCard({
  title,
  description,
  examples,
  icon: Icon,
}: {
  title: string;
  description: string;
  examples: string[];
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-purple-600" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Examples:</p>
          <ul className="space-y-1">
            {examples.map((example, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {example}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ExampleCard({
  title,
  query,
  response,
  sources,
}: {
  title: string;
  query: string;
  response: string;
  sources: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Query:</p>
          <div className="bg-muted p-3 rounded-lg text-sm">
            "{query}"
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">AI Response:</p>
          <p className="text-sm">{response}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Sources:</p>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommandCard({
  command,
  description,
  example,
}: {
  command: string;
  description: string;
  example: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="bg-muted p-2 rounded-lg font-mono text-sm font-semibold">
            {command}
          </div>
          <div className="flex-1">
            <p className="font-medium">{description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Example: <code className="bg-muted px-1 rounded">{example}</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QualityFeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TipCard({
  title,
  tips,
}: {
  title: string;
  tips: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Zap className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SourceCard({
  title,
  sources,
  icon: Icon,
}: {
  title: string;
  sources: string[];
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {sources.map((source, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              • {source}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}