'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Bug, 
  Zap, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowRight,
  FileText,
  Search,
  Lightbulb,
  Shield,
  Gauge
} from 'lucide-react';
import Link from 'next/link';

export default function CodeAnalysisDocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Code className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Code Analysis</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered Code Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Debug, explain, optimize, and review your code with advanced AI assistance. 
          Support for 50+ programming languages with intelligent suggestions.
        </p>
      </div>

      {/* Quick Access */}
      <div className="flex justify-center">
        <Link href="/chat">
          <Button size="lg" className="gap-2">
            <Code className="h-5 w-5" />
            Start Code Analysis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Bug Detection"
          description="Identify and fix bugs with detailed explanations"
          icon={Bug}
          badge="Smart AI"
        />
        <FeatureCard
          title="Code Explanation"
          description="Understand complex code with line-by-line breakdowns"
          icon={BookOpen}
        />
        <FeatureCard
          title="Performance Optimization"
          description="Get suggestions to improve code efficiency and speed"
          icon={Gauge}
        />
        <FeatureCard
          title="Security Analysis"
          description="Detect security vulnerabilities and best practices"
          icon={Shield}
        />
        <FeatureCard
          title="Code Review"
          description="Comprehensive code quality assessment and suggestions"
          icon={Search}
        />
        <FeatureCard
          title="Refactoring Help"
          description="Improve code structure and maintainability"
          icon={Lightbulb}
        />
      </div>

      {/* Supported Languages */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Supported Programming Languages</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <LanguageCard languages={["JavaScript", "TypeScript", "Node.js", "React"]} category="Web Development" />
          <LanguageCard languages={["Python", "Django", "Flask", "FastAPI"]} category="Python Ecosystem" />
          <LanguageCard languages={["Java", "Spring", "Kotlin", "Scala"]} category="JVM Languages" />
          <LanguageCard languages={["C++", "C", "Rust", "Go"]} category="Systems Programming" />
          <LanguageCard languages={["C#", ".NET", "F#", "VB.NET"]} category="Microsoft Stack" />
          <LanguageCard languages={["PHP", "Laravel", "Symfony", "WordPress"]} category="PHP Ecosystem" />
          <LanguageCard languages={["Ruby", "Rails", "Swift", "Objective-C"]} category="Mobile & Web" />
          <LanguageCard languages={["SQL", "MongoDB", "Redis", "GraphQL"]} category="Databases" />
        </div>
      </div>

      {/* Analysis Types */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Types of Code Analysis</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <AnalysisTypeCard
            title="Static Analysis"
            description="Analyze code without executing it"
            features={[
              "Syntax error detection",
              "Code style violations",
              "Unused variables/imports",
              "Complexity analysis",
              "Security vulnerabilities"
            ]}
            icon={Search}
          />
          <AnalysisTypeCard
            title="Dynamic Analysis"
            description="Runtime behavior and performance analysis"
            features={[
              "Performance bottlenecks",
              "Memory usage patterns",
              "Runtime error prediction",
              "Optimization suggestions",
              "Best practices recommendations"
            ]}
            icon={Zap}
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Usage Examples</h2>
        <div className="space-y-4">
          <ExampleCard
            title="Debug JavaScript Function"
            language="JavaScript"
            code={`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`}
            issue="Array index out of bounds error"
            solution="Change <= to < in the loop condition"
          />
          <ExampleCard
            title="Optimize Python Code"
            language="Python"
            code={`def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates`}
            issue="O(n³) time complexity"
            solution="Use set for O(n) solution with Counter or set operations"
          />
          <ExampleCard
            title="Security Review"
            language="SQL"
            code={`query = "SELECT * FROM users WHERE id = " + user_id`}
            issue="SQL injection vulnerability"
            solution="Use parameterized queries or prepared statements"
          />
        </div>
      </div>

      {/* Commands */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Code Analysis Commands</h2>
        <div className="space-y-3">
          <CommandCard
            command="/debug"
            description="Find and fix bugs in your code"
            example="/debug [paste your code here]"
          />
          <CommandCard
            command="/explain"
            description="Get detailed explanations of how code works"
            example="/explain this React component"
          />
          <CommandCard
            command="/optimize"
            description="Get performance optimization suggestions"
            example="/optimize this algorithm for better speed"
          />
          <CommandCard
            command="/review"
            description="Comprehensive code quality review"
            example="/review my Python function for best practices"
          />
          <CommandCard
            command="/refactor"
            description="Improve code structure and readability"
            example="/refactor this messy JavaScript code"
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Best Practices for Code Analysis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TipCard
            title="Preparing Your Code"
            tips={[
              "Include relevant context and comments",
              "Provide the full function or class when possible",
              "Mention the programming language explicitly",
              "Include error messages if debugging",
              "Specify your goals (performance, readability, etc.)"
            ]}
          />
          <TipCard
            title="Getting Better Results"
            tips={[
              "Ask specific questions about the code",
              "Mention your experience level",
              "Include the expected vs actual behavior",
              "Provide sample input/output data",
              "Ask for explanations of suggested changes"
            ]}
          />
        </div>
      </div>

      {/* Analysis Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Advanced Analysis Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureDetailCard
            title="Complexity Analysis"
            description="Big O notation analysis for time and space complexity"
            icon={Target}
          />
          <FeatureDetailCard
            title="Security Scanning"
            description="OWASP Top 10 vulnerability detection and prevention"
            icon={Shield}
          />
          <FeatureDetailCard
            title="Code Metrics"
            description="Cyclomatic complexity, maintainability index, and more"
            icon={Gauge}
          />
          <FeatureDetailCard
            title="Pattern Recognition"
            description="Identify design patterns and anti-patterns in code"
            icon={Search}
          />
          <FeatureDetailCard
            title="Documentation Generation"
            description="Auto-generate comments and documentation"
            icon={FileText}
          />
          <FeatureDetailCard
            title="Test Suggestions"
            description="Recommend unit tests and edge cases to consider"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border bg-gradient-to-br from-blue-50 via-blue-25 to-background p-8 text-center">
        <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Ready to Analyze Your Code?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Get instant AI-powered code analysis, debugging help, and optimization suggestions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              <Code className="h-4 w-4" />
              Start Code Analysis
            </Button>
          </Link>
          <Link href="/docs/commands">
            <Button size="lg" variant="outline">
              View All Commands
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
          <div className="p-2 rounded-lg bg-blue-100">
            <Icon className="h-6 w-6 text-blue-600" />
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

function LanguageCard({
  languages,
  category,
}: {
  languages: string[];
  category: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {languages.map((lang, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisTypeCard({
  title,
  description,
  features,
  icon: Icon,
}: {
  title: string;
  description: string;
  features: string[];
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ExampleCard({
  title,
  language,
  code,
  issue,
  solution,
}: {
  title: string;
  language: string;
  code: string;
  issue: string;
  solution: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">{language}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-3 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{code}</code></pre>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Issue:</p>
            <p className="text-sm text-red-700">{issue}</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-1">Solution:</p>
            <p className="text-sm text-green-700">{solution}</p>
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
              <Lightbulb className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function FeatureDetailCard({
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
        <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}