'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calculator, 
  Search, 
  FileText, 
  Zap,
  MessageSquare,
  Code,
  Lightbulb
} from 'lucide-react';

export default function CommandsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">Slash Commands</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Command Reference
        </h1>
        <p className="text-xl text-muted-foreground">
          Master CodeEx AI's powerful slash commands for enhanced productivity and specialized tasks.
        </p>
      </div>

      {/* Quick Reference */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Reference
          </CardTitle>
          <CardDescription>
            The three essential commands you'll use most often
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <QuickRefCard
              command="/solve"
              description="Math, coding, quiz problems"
              example="x² + 5x + 6 = 0"
            />
            <QuickRefCard
              command="/search"
              description="Web search with citations"
              example="latest AI news"
            />
            <QuickRefCard
              command="/summarize"
              description="Condense long texts"
              example="[paste article]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Commands */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Detailed Command Guide</h2>
        
        <div className="space-y-6">
          <CommandSection
            command="/solve"
            icon={Calculator}
            color="text-blue-500"
            description="Solve mathematical equations, coding problems, quiz questions, and logical puzzles with step-by-step explanations."
            syntax="/solve [your problem or question]"
            examples={[
              {
                input: '/solve x² + 5x + 6 = 0',
                description: 'Quadratic equation solving',
                output: 'Step-by-step algebraic solution with factoring'
              },
              {
                input: '/solve What is the derivative of sin(x)?',
                description: 'Calculus problem',
                output: 'Mathematical explanation with rules applied'
              },
              {
                input: '/solve Write a binary search algorithm in Python',
                description: 'Coding challenge',
                output: 'Complete code with explanation and complexity analysis'
              },
              {
                input: '/solve If a train travels 60 mph for 2 hours, how far does it go?',
                description: 'Word problem',
                output: 'Solution with formula and calculation steps'
              }
            ]}
            tips={[
              'Math problems are automatically routed to math-optimized models',
              'Include "step-by-step" for detailed explanations',
              'Works with algebra, calculus, statistics, and discrete math',
              'Coding problems get routed to programming-specialized models'
            ]}
          />

          <CommandSection
            command="/search"
            icon={Search}
            color="text-green-500"
            description="Search the web for current information using DuckDuckGo with Google fallback. Results include source citations and AI synthesis."
            syntax="/search [your search query]"
            examples={[
              {
                input: '/search latest developments in artificial intelligence',
                description: 'Current events search',
                output: 'Recent AI news with sources and summary'
              },
              {
                input: '/search weather in Tokyo today',
                description: 'Real-time information',
                output: 'Current weather conditions with forecast'
              },
              {
                input: '/search how to deploy Next.js to Netlify 2026',
                description: 'Technical tutorial search',
                output: 'Up-to-date deployment guides and best practices'
              },
              {
                input: '/search stock price Apple AAPL',
                description: 'Financial data',
                output: 'Current stock information and recent performance'
              }
            ]}
            tips={[
              'Great for current events and real-time data',
              'Results include clickable source links',
              'AI synthesizes information from multiple sources',
              'Use specific keywords for better results'
            ]}
          />

          <CommandSection
            command="/summarize"
            icon={FileText}
            color="text-purple-500"
            description="Condense long articles, documents, or texts into concise summaries while preserving key information and main points."
            syntax="/summarize [paste your text here]"
            examples={[
              {
                input: '/summarize [long research paper]',
                description: 'Academic paper summary',
                output: 'Key findings, methodology, and conclusions'
              },
              {
                input: '/summarize [news article]',
                description: 'News article condensation',
                output: 'Main points, key facts, and implications'
              },
              {
                input: '/summarize [meeting transcript]',
                description: 'Meeting notes summary',
                output: 'Action items, decisions, and key discussions'
              },
              {
                input: '/summarize [technical documentation]',
                description: 'Documentation overview',
                output: 'Essential information and important details'
              }
            ]}
            tips={[
              'Works best with structured text content',
              'Preserves important technical details',
              'Extracts actionable items and key decisions',
              'Maintains context and relationships between ideas'
            ]}
          />
        </div>
      </div>

      {/* Advanced Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Advanced Usage Tips
          </CardTitle>
          <CardDescription>
            Get the most out of CodeEx AI commands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <TipCard
                title="Command Chaining"
                description="Use multiple commands in sequence for complex workflows"
                example='First "/search latest React features", then "/summarize" the results'
              />
              <TipCard
                title="Context Awareness"
                description="Commands understand conversation context and previous messages"
                example="Follow up with clarifying questions without repeating context"
              />
              <TipCard
                title="Model Selection"
                description="Commands automatically route to the best model for the task"
                example="/solve uses math models, /search uses general models"
              />
              <TipCard
                title="Natural Language"
                description="You can also ask naturally without using slash commands"
                example='"Solve this equation" works the same as "/solve equation"'
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">💡 Pro Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Commands are case-insensitive: <code>/SOLVE</code> works the same as <code>/solve</code></li>
                <li>• Use code blocks (```) when sharing code for better formatting</li>
                <li>• Be specific in your queries for more accurate results</li>
                <li>• Combine commands with specific model selection for specialized tasks</li>
                <li>• Use follow-up questions to dive deeper into results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">When to Use Each Command</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <ComparisonCard
            command="/solve"
            bestFor={[
              'Mathematical equations',
              'Coding problems',
              'Logic puzzles',
              'Step-by-step solutions',
              'Educational content'
            ]}
            notFor={[
              'Current events',
              'Real-time data',
              'Long text processing'
            ]}
          />
          <ComparisonCard
            command="/search"
            bestFor={[
              'Current information',
              'Real-time data',
              'News and events',
              'Technical tutorials',
              'Fact checking'
            ]}
            notFor={[
              'Math calculations',
              'Code generation',
              'Text summarization'
            ]}
          />
          <ComparisonCard
            command="/summarize"
            bestFor={[
              'Long articles',
              'Research papers',
              'Meeting notes',
              'Documentation',
              'Content analysis'
            ]}
            notFor={[
              'Short texts',
              'Real-time searches',
              'Mathematical problems'
            ]}
          />
        </div>
      </div>

      {/* Examples in Action */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Real-World Examples</CardTitle>
          <CardDescription>
            See how commands work in practical scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ScenarioCard
              scenario="Student Studying Calculus"
              workflow={[
                '/solve What is the integral of x² + 3x + 2?',
                'Follow up: "Can you explain the power rule?"',
                '/solve Practice problem: ∫(2x³ - 5x + 1)dx'
              ]}
            />
            <ScenarioCard
              scenario="Developer Learning New Framework"
              workflow={[
                '/search Next.js 14 new features 2026',
                '/summarize [paste documentation]',
                '/solve Write a Next.js component with server actions'
              ]}
            />
            <ScenarioCard
              scenario="Researcher Analyzing Papers"
              workflow={[
                '/search recent machine learning papers 2026',
                '/summarize [paste abstract and findings]',
                '/solve Explain the mathematical concepts in this paper'
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickRefCard({
  command,
  description,
  example,
}: {
  command: string;
  description: string;
  example: string;
}) {
  return (
    <div className="bg-background/50 p-4 rounded-lg">
      <code className="text-primary font-bold">{command}</code>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <p className="text-xs text-muted-foreground mt-2 font-mono">
        Example: {example}
      </p>
    </div>
  );
}

function CommandSection({
  command,
  icon: Icon,
  color,
  description,
  syntax,
  examples,
  tips,
}: {
  command: string;
  icon: React.ElementType;
  color: string;
  description: string;
  syntax: string;
  examples: Array<{
    input: string;
    description: string;
    output: string;
  }>;
  tips: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${color}`} />
          <code className="text-2xl">{command}</code>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Syntax */}
          <div>
            <h4 className="font-semibold mb-2">Syntax</h4>
            <code className="block bg-muted p-3 rounded font-mono text-sm">
              {syntax}
            </code>
          </div>

          {/* Examples */}
          <div>
            <h4 className="font-semibold mb-3">Examples</h4>
            <div className="space-y-4">
              {examples.map((example, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {example.description}
                      </Badge>
                      <code className="block bg-muted p-2 rounded font-mono text-sm">
                        {example.input}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Result:</strong> {example.output}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-semibold mb-2">Tips</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {tips.map((tip, i) => (
                <li key={i}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TipCard({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example: string;
}) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium text-sm mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <p className="text-xs text-muted-foreground font-mono bg-background p-2 rounded">
        {example}
      </p>
    </div>
  );
}

function ComparisonCard({
  command,
  bestFor,
  notFor,
}: {
  command: string;
  bestFor: string[];
  notFor: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <code>{command}</code>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-green-600 mb-2">✅ Best for:</h4>
            <ul className="text-sm space-y-1">
              {bestFor.map((item, i) => (
                <li key={i} className="text-muted-foreground">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm text-red-600 mb-2">❌ Not ideal for:</h4>
            <ul className="text-sm space-y-1">
              {notFor.map((item, i) => (
                <li key={i} className="text-muted-foreground">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScenarioCard({
  scenario,
  workflow,
}: {
  scenario: string;
  workflow: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-3">{scenario}</h4>
      <div className="space-y-2">
        {workflow.map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {i + 1}
            </span>
            <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
              {step}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}