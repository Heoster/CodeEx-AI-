'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Image, 
  Cpu, 
  Zap, 
  BookOpen,
  ArrowRight,
  CheckCircle,
  Globe,
  Upload,
  Settings,
  Sparkles,
  Brain,
  Target,
  Users,
  Code,
  Calculator,
  ExternalLink
} from 'lucide-react';

export default function SmartNotesDocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">Smart Notes Pro</span>
          <Badge variant="secondary" className="text-xs">New</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Smart Notes Pro
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Generate comprehensive, research-backed notes on any topic using multiple AI agents, 
          18+ research sources, and advanced content synthesis. Perfect for students, researchers, 
          and professionals who need in-depth documentation.
        </p>
      </div>

      {/* Quick Demo */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Try Smart Notes Pro</CardTitle>
          </div>
          <CardDescription>
            Experience the power of multi-agent AI research and content generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/smart-notes" className="flex-1">
              <Button className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Launch Smart Notes Pro
              </Button>
            </Link>
            <Link href="#getting-started" className="flex-1">
              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Read Guide
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Search}
            title="18+ Research Sources"
            description="Academic papers, GitHub repos, Stack Overflow, Reddit, YouTube, and more"
            badge="Enhanced"
          />
          <FeatureCard
            icon={Image}
            title="Image Integration"
            description="Upload local images or scrape images from URLs automatically"
            badge="New"
          />
          <FeatureCard
            icon={Brain}
            title="Multi-Agent AI"
            description="Research, Structure, and Diagram agents working in parallel"
          />
          <FeatureCard
            icon={Target}
            title="Focus Modes"
            description="Academic, Technical, Practical, or General approaches"
          />
          <FeatureCard
            icon={Globe}
            title="Custom Sources"
            description="Add your own URLs for specialized research domains"
          />
          <FeatureCard
            icon={FileText}
            title="Rich Documents"
            description="Structured notes with diagrams, code blocks, and math expressions"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <ProcessStep
            number="1"
            title="Configure Research"
            description="Choose your topic, focus mode, research sources, and content preferences"
            icon={Settings}
          />
          <ProcessStep
            number="2"
            title="AI Agents Process"
            description="Research, Structure, and Diagram agents work in parallel to gather and organize information"
            icon={Cpu}
          />
          <ProcessStep
            number="3"
            title="Generate Notes"
            description="Receive comprehensive, structured notes with citations, images, and diagrams"
            icon={FileText}
          />
        </div>
      </div>

      {/* Research Sources */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Research Sources</h2>
        <Tabs defaultValue="academic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="academic" className="space-y-4">
            <SourceCategory
              title="Academic Sources"
              description="Scholarly articles, research papers, and academic publications"
              sources={[
                { name: 'arXiv', description: 'Scientific papers and preprints' },
                { name: 'Google Scholar', description: 'Academic publications and citations' },
                { name: 'PubMed', description: 'Medical and life science research' },
                { name: 'JSTOR', description: 'Academic journals and books' },
                { name: 'ResearchGate', description: 'Research network and publications' }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <SourceCategory
              title="Technical Sources"
              description="Code repositories, programming discussions, and technical documentation"
              sources={[
                { name: 'GitHub', description: 'Code repositories and documentation' },
                { name: 'Stack Overflow', description: 'Programming Q&A and solutions' },
                { name: 'Dev.to', description: 'Developer community articles' },
                { name: 'Hacker News', description: 'Tech discussions and news' }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="community" className="space-y-4">
            <SourceCategory
              title="Community Sources"
              description="Discussion forums, blogs, and community-driven content"
              sources={[
                { name: 'Reddit', description: 'Discussion forums and communities' },
                { name: 'Medium', description: 'Articles and professional blogs' }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <SourceCategory
              title="Media Sources"
              description="Video content and multimedia resources"
              sources={[
                { name: 'YouTube', description: 'Educational videos and tutorials' }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4">
            <SourceCategory
              title="Educational Sources"
              description="Online courses and educational platforms"
              sources={[
                { name: 'Coursera', description: 'University courses and specializations' },
                { name: 'edX', description: 'University-level online courses' },
                { name: 'Khan Academy', description: 'Free educational videos and exercises' }
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Getting Started */}
      <div id="getting-started" className="space-y-6">
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                Access Smart Notes Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Navigate to the Smart Notes Pro interface through the test page or main application.
              </p>
              <Link href="/smart-notes">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Smart Notes Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
                Configure Your Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-muted-foreground">Set up your research parameters:</p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• <strong>Topic:</strong> Enter your research topic with specific keywords</li>
                  <li>• <strong>Focus:</strong> Choose Academic, Technical, Practical, or General</li>
                  <li>• <strong>Depth:</strong> Select Basic, Detailed, or Comprehensive</li>
                  <li>• <strong>Sources:</strong> Pick from 18+ research sources</li>
                  <li>• <strong>Content:</strong> Enable code examples, math, images, and diagrams</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                Generate and Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Click "Generate Smart Notes" and watch as three AI agents work in parallel to research, 
                structure, and create diagrams for your topic. Review the generated content and export 
                as needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Advanced Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Image Upload & Scraping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload local images (up to 10MB) or enable automatic image scraping from research sources. 
                Images are automatically distributed across document sections.
              </p>
              <div className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WebP, SVG, GIF
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Custom Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Add custom URLs for specialized research domains. Perfect for company documentation, 
                specific websites, or niche resources not covered by standard sources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code & Math Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Automatically include code examples and mathematical expressions in your notes. 
                Perfect for technical documentation and educational content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Diagram Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Generate Mermaid, PlantUML, Excalidraw, and TikZ diagrams automatically. 
                Visual representations help explain complex concepts and relationships.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <div className="grid gap-4">
          <BestPracticeCard
            title="Be Specific with Topics"
            description="Include keywords like 'with examples', 'mathematical derivations', 'practical guide' for better results"
            example="❌ Machine Learning\n✅ Machine Learning with Computer Vision Applications and Python Examples"
          />
          <BestPracticeCard
            title="Choose the Right Focus"
            description="Select the focus mode that matches your intended audience and use case"
            example="Academic: Research papers, citations\nTechnical: Code examples, implementation\nPractical: Real-world applications\nGeneral: Balanced for all audiences"
          />
          <BestPracticeCard
            title="Select Relevant Sources"
            description="Choose sources that align with your topic and focus for more targeted research"
            example="Technical topics: GitHub, Stack Overflow, Dev.to\nAcademic topics: arXiv, Google Scholar, PubMed\nGeneral topics: Wikipedia, Reddit, Medium"
          />
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FAQItem
            question="How long does it take to generate notes?"
            answer="Generation typically takes 30-60 seconds depending on the complexity of your topic and number of sources selected. The three AI agents work in parallel to optimize processing time."
          />
          <FAQItem
            question="Can I use my own research sources?"
            answer="Yes! You can add custom URLs in the advanced settings. This is perfect for company documentation, specific websites, or specialized resources."
          />
          <FAQItem
            question="What image formats are supported?"
            answer="Smart Notes Pro supports JPG, PNG, WebP, SVG, and GIF formats with a maximum file size of 10MB per image."
          />
          <FAQItem
            question="How are the AI models selected?"
            answer="Smart Notes Pro uses only free-tier AI models including Hugging Face Inference API and free OpenRouter models. The system automatically selects the best model for each agent's task."
          />
          <FAQItem
            question="Can I export the generated notes?"
            answer="Yes, you can export notes in various formats. The system generates structured markdown that can be easily converted to PDF, Word, or other formats."
          />
        </div>
      </div>

      {/* CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Create Smart Notes?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start generating comprehensive, research-backed notes with AI-powered multi-source research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/smart-notes">
              <Button size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Try Smart Notes Pro
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Back to Docs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function ProcessStep({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {number}
          </div>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SourceCategory({
  title,
  description,
  sources,
}: {
  title: string;
  description: string;
  sources: { name: string; description: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((source) => (
            <div key={source.name} className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">{source.name}</div>
                <div className="text-xs text-muted-foreground">{source.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BestPracticeCard({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted p-3">
          <pre className="text-xs whitespace-pre-wrap">{example}</pre>
        </div>
      </CardContent>
    </Card>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  );
}