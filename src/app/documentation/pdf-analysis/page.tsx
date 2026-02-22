'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Brain, 
  Search,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  BookOpen,
  FileCheck
} from 'lucide-react';

export default function PDFAnalysisPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">PDF Document Analysis</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered PDF Analysis
        </h1>
        <p className="text-xl text-muted-foreground">
          Upload PDF documents and ask questions about their content. Extract insights, summaries, and specific information using advanced AI analysis.
        </p>
      </div>

      {/* Quick Access */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Try PDF Analysis Now
          </CardTitle>
          <CardDescription>
            Upload a document and start asking questions immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/pdf-analyzer">
              <Button size="lg">
                Open PDF Analyzer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ai-services">
              <Button size="lg" variant="outline">
                AI Services Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How PDF Analysis Works</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <StepCard
            step={1}
            title="Upload Document"
            description="Select and upload your PDF file"
            icon={Upload}
            details={[
              'Drag & drop or click to browse',
              'Supports files up to 10MB',
              'Automatic text extraction',
              'Secure processing'
            ]}
          />
          <StepCard
            step={2}
            title="Ask Questions"
            description="Type your questions about the document"
            icon={Search}
            details={[
              'Natural language queries',
              'Specific information requests',
              'Summary and analysis questions',
              'Multiple questions supported'
            ]}
          />
          <StepCard
            step={3}
            title="Get AI Insights"
            description="Receive detailed answers with citations"
            icon={Brain}
            details={[
              'Contextual understanding',
              'Page number references',
              'Relevant quotes included',
              'Comprehensive analysis'
            ]}
          />
        </div>
      </div>

      {/* Supported Use Cases */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">What You Can Analyze</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <UseCaseCard
            title="Research Papers"
            description="Academic papers, studies, and scientific documents"
            examples={[
              'Summarize key findings and methodology',
              'Extract statistical data and results',
              'Identify research gaps and conclusions',
              'Compare different studies'
            ]}
            icon="🔬"
          />
          
          <UseCaseCard
            title="Business Documents"
            description="Reports, proposals, contracts, and presentations"
            examples={[
              'Extract key business metrics',
              'Summarize executive summaries',
              'Identify action items and deadlines',
              'Analyze financial data'
            ]}
            icon="📊"
          />
          
          <UseCaseCard
            title="Legal Documents"
            description="Contracts, agreements, and legal texts"
            examples={[
              'Identify key terms and conditions',
              'Extract important dates and obligations',
              'Summarize legal requirements',
              'Find specific clauses'
            ]}
            icon="⚖️"
          />
          
          <UseCaseCard
            title="Educational Materials"
            description="Textbooks, manuals, and learning resources"
            examples={[
              'Create study summaries',
              'Extract key concepts and definitions',
              'Generate quiz questions',
              'Explain complex topics'
            ]}
            icon="📚"
          />
          
          <UseCaseCard
            title="Technical Documentation"
            description="Manuals, specifications, and guides"
            examples={[
              'Find specific procedures',
              'Extract technical specifications',
              'Summarize installation steps',
              'Identify troubleshooting info'
            ]}
            icon="🔧"
          />
          
          <UseCaseCard
            title="Financial Reports"
            description="Annual reports, financial statements, and analyses"
            examples={[
              'Extract key financial metrics',
              'Summarize performance highlights',
              'Identify trends and patterns',
              'Compare year-over-year data'
            ]}
            icon="💰"
          />
        </div>
      </div>

      {/* Question Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Types of Questions You Can Ask
          </CardTitle>
          <CardDescription>
            Examples of effective queries for PDF analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <QuestionCategory
              category="Summary Questions"
              description="Get overviews and key points"
              examples={[
                'What are the main findings of this research?',
                'Summarize the executive summary',
                'What are the key recommendations?',
                'Give me an overview of this document'
              ]}
            />
            
            <QuestionCategory
              category="Specific Information"
              description="Find particular details or data"
              examples={[
                'What is the revenue for Q3 2023?',
                'Find all mentions of artificial intelligence',
                'What are the system requirements?',
                'List all the authors and their affiliations'
              ]}
            />
            
            <QuestionCategory
              category="Analysis Questions"
              description="Get deeper insights and interpretations"
              examples={[
                'What are the strengths and weaknesses mentioned?',
                'How does this compare to industry standards?',
                'What are the potential risks identified?',
                'What trends can you identify in the data?'
              ]}
            />
            
            <QuestionCategory
              category="Extraction Requests"
              description="Pull out structured information"
              examples={[
                'Create a list of all action items',
                'Extract all dates and deadlines',
                'List the key performance indicators',
                'Find all contact information'
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            File Requirements & Limitations
          </CardTitle>
          <CardDescription>
            What files are supported and current limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Supported Features
                </h4>
                <ul className="text-sm space-y-1 text-green-600 dark:text-green-400">
                  <li>• PDF files up to 10MB</li>
                  <li>• Text-based PDFs (searchable)</li>
                  <li>• Multi-page documents</li>
                  <li>• Multiple languages</li>
                  <li>• Tables and structured data</li>
                  <li>• Academic and business formats</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Current Limitations
                </h4>
                <ul className="text-sm space-y-1 text-orange-600 dark:text-orange-400">
                  <li>• Scanned PDFs (image-only) not supported</li>
                  <li>• Password-protected files not supported</li>
                  <li>• Complex graphics and charts limited</li>
                  <li>• Very large files (&gt;10MB) not accepted</li>
                  <li>• Handwritten text not recognized</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Tips for Best Results</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use text-based PDFs (not scanned images)</li>
              <li>• Ensure good text quality and formatting</li>
              <li>• Be specific in your questions</li>
              <li>• Ask follow-up questions for clarification</li>
              <li>• Reference specific sections or pages when needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle>🔒 Privacy & Security</CardTitle>
          <CardDescription>
            How your documents are handled and protected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✅ Security Measures</h4>
              <ul className="text-sm space-y-1">
                <li>• Secure file upload and processing</li>
                <li>• Documents processed in memory only</li>
                <li>• No permanent storage of your files</li>
                <li>• Encrypted data transmission</li>
                <li>• Automatic cleanup after processing</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">🛡️ Privacy Protection</h4>
              <ul className="text-sm space-y-1">
                <li>• Files are not saved or stored</li>
                <li>• Content is not used for training</li>
                <li>• Processing happens in real-time</li>
                <li>• No sharing with third parties</li>
                <li>• GDPR and privacy compliant</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Example Analysis Workflow</CardTitle>
          <CardDescription>
            Step-by-step example of analyzing a research paper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <WorkflowStep
              step={1}
              action="Upload research paper PDF"
              result="Document successfully processed and text extracted"
            />
            <WorkflowStep
              step={2}
              action="Ask: 'What is the main research question?'"
              result="AI identifies and explains the primary research objective"
            />
            <WorkflowStep
              step={3}
              action="Ask: 'What methodology was used?'"
              result="Detailed explanation of research methods with page references"
            />
            <WorkflowStep
              step={4}
              action="Ask: 'What are the key findings?'"
              result="Summary of main results with supporting data and quotes"
            />
            <WorkflowStep
              step={5}
              action="Ask: 'What are the limitations mentioned?'"
              result="List of study limitations as acknowledged by the authors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Ready to Analyze Documents?
          </CardTitle>
          <CardDescription>
            Start extracting insights from your PDFs right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              The PDF analyzer is perfect for researchers, students, professionals, and anyone who needs 
              to quickly understand and extract information from documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pdf-analyzer">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Analyzing PDFs
                  <FileText className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/commands">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More Commands
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  icon: Icon,
  details,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  details: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            {step}
          </div>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {details.map((detail, i) => (
            <li key={i}>• {detail}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function UseCaseCard({
  title,
  description,
  examples,
  icon,
}: {
  title: string;
  description: string;
  examples: string[];
  icon: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Example questions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {examples.map((example, i) => (
              <li key={i}>• {example}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionCategory({
  category,
  description,
  examples,
}: {
  category: string;
  description: string;
  examples: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-1">{category}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="space-y-2">
        {examples.map((example, i) => (
          <code key={i} className="block bg-muted p-2 rounded text-sm">
            "{example}"
          </code>
        ))}
      </div>
    </div>
  );
}

function WorkflowStep({
  step,
  action,
  result,
}: {
  step: number;
  action: string;
  result: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
        {step}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{action}</p>
        <p className="text-sm text-muted-foreground">→ {result}</p>
      </div>
    </div>
  );
}