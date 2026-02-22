'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Camera, 
  Zap, 
  BookOpen, 
  Target, 
  CheckCircle,
  ArrowRight,
  Image,
  Type,
  Brain
} from 'lucide-react';
import Link from 'next/link';

export default function MathSolverDocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Calculator className="h-4 w-4 text-green-600" />
          <span className="font-medium">Math Solver</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Visual Math Solver
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Solve mathematical equations and problems with step-by-step explanations. 
          Upload images of handwritten or printed math problems for instant solutions.
        </p>
      </div>

      {/* Quick Access */}
      <div className="flex justify-center">
        <Link href="/visual-math">
          <Button size="lg" className="gap-2">
            <Calculator className="h-5 w-5" />
            Try Math Solver Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Image Recognition"
          description="Upload photos of handwritten or printed math problems"
          icon={Camera}
          badge="AI Powered"
        />
        <FeatureCard
          title="Step-by-Step Solutions"
          description="Get detailed explanations for each solution step"
          icon={BookOpen}
        />
        <FeatureCard
          title="Multiple Math Types"
          description="Algebra, calculus, geometry, statistics, and more"
          icon={Target}
        />
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <StepCard
            step="1"
            title="Upload or Type"
            description="Take a photo of your math problem or type it directly into the chat"
            icon={Image}
          />
          <StepCard
            step="2"
            title="AI Analysis"
            description="Our AI analyzes the problem and identifies the mathematical concepts"
            icon={Brain}
          />
          <StepCard
            step="3"
            title="Get Solution"
            description="Receive step-by-step solutions with detailed explanations"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Supported Math Types */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Supported Math Types</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MathTypeCard
            title="Algebra"
            topics={[
              "Linear equations",
              "Quadratic equations", 
              "Systems of equations",
              "Polynomials",
              "Factoring"
            ]}
          />
          <MathTypeCard
            title="Calculus"
            topics={[
              "Derivatives",
              "Integrals",
              "Limits",
              "Chain rule",
              "Optimization"
            ]}
          />
          <MathTypeCard
            title="Geometry"
            topics={[
              "Area and perimeter",
              "Volume calculations",
              "Trigonometry",
              "Coordinate geometry",
              "Proofs"
            ]}
          />
          <MathTypeCard
            title="Statistics"
            topics={[
              "Probability",
              "Mean, median, mode",
              "Standard deviation",
              "Hypothesis testing",
              "Regression analysis"
            ]}
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Usage Examples</h2>
        <div className="space-y-4">
          <ExampleCard
            title="Solve Quadratic Equation"
            input="x² + 5x + 6 = 0"
            description="Get factored form, solutions, and graphical representation"
          />
          <ExampleCard
            title="Calculate Derivative"
            input="f(x) = 3x³ + 2x² - 5x + 1"
            description="Step-by-step differentiation with power rule explanations"
          />
          <ExampleCard
            title="Geometry Problem"
            input="Find the area of a triangle with sides 3, 4, 5"
            description="Multiple solution methods including Heron's formula"
          />
        </div>
      </div>

      {/* Tips and Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tips for Best Results</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TipCard
            title="Clear Images"
            tips={[
              "Ensure good lighting when taking photos",
              "Keep the camera steady and focused",
              "Crop to show only the relevant problem",
              "Use high contrast (dark text on light background)"
            ]}
          />
          <TipCard
            title="Problem Format"
            tips={[
              "Write equations clearly with proper spacing",
              "Use standard mathematical notation",
              "Include all given information",
              "Specify what you need to find"
            ]}
          />
        </div>
      </div>

      {/* Commands */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Math Commands</h2>
        <div className="space-y-3">
          <CommandCard
            command="/solve"
            description="Solve mathematical equations and problems"
            example="/solve x² + 3x - 4 = 0"
          />
          <CommandCard
            command="/graph"
            description="Generate graphs for mathematical functions"
            example="/graph y = x² + 2x - 3"
          />
          <CommandCard
            command="/simplify"
            description="Simplify mathematical expressions"
            example="/simplify (x² - 4)/(x - 2)"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border bg-gradient-to-br from-green-50 via-green-25 to-background p-8 text-center">
        <Calculator className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Ready to Solve Math Problems?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Start solving mathematical problems with AI-powered step-by-step solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/visual-math">
            <Button size="lg" className="gap-2">
              <Calculator className="h-4 w-4" />
              Open Math Solver
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" variant="outline">
              Try in Chat
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
          <div className="p-2 rounded-lg bg-green-100">
            <Icon className="h-6 w-6 text-green-600" />
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

function StepCard({
  step,
  title,
  description,
  icon: Icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-lg font-bold text-green-600">{step}</span>
        </div>
        <Icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function MathTypeCard({
  title,
  topics,
}: {
  title: string;
  topics: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {topic}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ExampleCard({
  title,
  input,
  description,
}: {
  title: string;
  input: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <div className="bg-muted p-3 rounded-lg font-mono text-sm">
            {input}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
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
              <Zap className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
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