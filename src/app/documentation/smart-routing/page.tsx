'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Code, 
  Calculator, 
  MessageSquare,
  Image,
  Search,
  ArrowRight,
  CheckCircle,
  Settings,
  Lightbulb
} from 'lucide-react';

export default function SmartRoutingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">Smart Auto-Routing</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Intelligent Model Selection
        </h1>
        <p className="text-xl text-muted-foreground">
          CodeEx AI automatically analyzes your queries and routes them to the most appropriate AI model for optimal results.
        </p>
      </div>

      {/* How It Works */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            How Smart Routing Works
          </CardTitle>
          <CardDescription>
            Advanced query analysis for automatic model selection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <ProcessStep
                step={1}
                title="Query Analysis"
                description="AI analyzes your message content, context, and intent"
                icon={Brain}
              />
              <ProcessStep
                step={2}
                title="Model Matching"
                description="Selects the best-suited model from 13+ available options"
                icon={Zap}
              />
              <ProcessStep
                step={3}
                title="Optimized Response"
                description="Delivers the highest quality answer for your specific query"
                icon={CheckCircle}
              />
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🎯 Key Benefits</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• No manual model selection required</li>
                <li>• Always get the best model for each task</li>
                <li>• Seamless switching between specialized models</li>
                <li>• Optimal performance without complexity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Routing Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Routing Categories</h2>
        <p className="text-muted-foreground">
          Smart routing identifies these types of queries and routes them to specialized models:
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <RoutingCategory
            icon={Calculator}
            title="Mathematical Queries"
            description="Equations, calculations, and mathematical problem solving"
            examples={[
              'Solve x² + 5x + 6 = 0',
              'What is the derivative of sin(x)?',
              'Calculate the area of a circle with radius 5',
              'Explain the quadratic formula'
            ]}
            targetModels={['WizardMath 70B', 'Qwen 2.5 (Math capable)', 'Llama models with math training']}
            color="text-blue-500"
          />

          <RoutingCategory
            icon={Code}
            title="Programming & Code"
            description="Software development, debugging, and coding assistance"
            examples={[
              'Write a Python function to sort a list',
              'Debug this JavaScript error',
              'Explain React hooks',
              'Best practices for API design'
            ]}
            targetModels={['DeepSeek V3.2', 'Coding-specialized models', 'Programming-trained variants']}
            color="text-green-500"
          />

          <RoutingCategory
            icon={MessageSquare}
            title="General Conversation"
            description="Everyday questions, explanations, and casual chat"
            examples={[
              'Explain how photosynthesis works',
              'What are the benefits of exercise?',
              'Tell me about the history of Rome',
              'How do I improve my writing skills?'
            ]}
            targetModels={['Llama 3.1 models', 'General purpose models', 'Conversational variants']}
            color="text-orange-500"
          />

          <RoutingCategory
            icon={Image}
            title="Visual & Multimodal"
            description="Image analysis, visual questions, and multimodal tasks"
            examples={[
              'Describe this image',
              'What do you see in this picture?',
              'Analyze this chart or graph',
              'Read text from this image'
            ]}
            targetModels={['Gemini 2.5 Flash', 'Gemini Flash Latest', 'Vision-capable models']}
            color="text-pink-500"
          />
        </div>
      </div>

      {/* Query Analysis Details */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Query Analysis Process</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>What the AI Looks For</CardTitle>
            <CardDescription>
              Key indicators that determine model routing decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-semibold">Content Analysis</h4>
                <div className="space-y-3">
                  <AnalysisIndicator
                    type="Mathematical Keywords"
                    examples={['solve', 'calculate', 'equation', 'derivative', 'integral']}
                    action="Routes to math models"
                  />
                  <AnalysisIndicator
                    type="Programming Terms"
                    examples={['function', 'variable', 'debug', 'code', 'algorithm']}
                    action="Routes to coding models"
                  />
                  <AnalysisIndicator
                    type="Visual References"
                    examples={['image', 'picture', 'photo', 'visual', 'chart']}
                    action="Routes to multimodal models"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Context Analysis</h4>
                <div className="space-y-3">
                  <AnalysisIndicator
                    type="Question Structure"
                    examples={['Step-by-step requests', 'Explanation needs', 'Problem format']}
                    action="Influences model choice"
                  />
                  <AnalysisIndicator
                    type="Conversation History"
                    examples={['Previous topic context', 'User expertise level', 'Ongoing discussion']}
                    action="Maintains consistency"
                  />
                  <AnalysisIndicator
                    type="Complexity Level"
                    examples={['Simple vs complex queries', 'Technical depth needed', 'Detail requirements']}
                    action="Selects appropriate model"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routing Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Routing Examples</h2>
        
        <div className="space-y-4">
          <RoutingExample
            query="Solve the equation 2x + 5 = 15"
            analysis="Mathematical equation with 'solve' keyword"
            selectedModel="Math-specialized model (e.g., WizardMath)"
            reasoning="Query contains mathematical equation and explicit solve request"
            category="Mathematics"
          />
          
          <RoutingExample
            query="Write a Python function to reverse a string"
            analysis="Programming request with specific language"
            selectedModel="Coding model (e.g., DeepSeek V3.2)"
            reasoning="Contains programming language and function creation request"
            category="Programming"
          />
          
          <RoutingExample
            query="What's the weather like today?"
            analysis="General information request"
            selectedModel="General model with search capability"
            reasoning="Requires real-time information, routes to search-enabled model"
            category="General + Search"
          />
          
          <RoutingExample
            query="Explain the concept of machine learning"
            analysis="Educational explanation request"
            selectedModel="Conversational model (e.g., Llama 3.1)"
            reasoning="General knowledge explanation, benefits from conversational model"
            category="Education"
          />
        </div>
      </div>

      {/* Manual Override */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manual Model Selection
          </CardTitle>
          <CardDescription>
            When and how to override smart routing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">✅ When to Use Auto Mode</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Most general usage scenarios</li>
                  <li>• Mixed conversation topics</li>
                  <li>• When you want optimal results</li>
                  <li>• Learning and exploration</li>
                  <li>• First-time users</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">⚙️ When to Use Manual Selection</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Consistent model behavior needed</li>
                  <li>• Testing specific model capabilities</li>
                  <li>• Advanced users with preferences</li>
                  <li>• Specialized workflows</li>
                  <li>• Research or comparison purposes</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">💡 Recommendation</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Start with Auto mode to experience the full power of smart routing. You can always switch 
                to manual selection later if you have specific model preferences or requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Benefits
          </CardTitle>
          <CardDescription>
            How smart routing improves your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              title="Higher Accuracy"
              description="Specialized models perform better on their target tasks"
              metric="Up to 40% better results"
            />
            <BenefitCard
              title="Faster Responses"
              description="Right-sized models for each query type"
              metric="Optimized speed"
            />
            <BenefitCard
              title="Better Context"
              description="Models trained for specific domains understand context better"
              metric="Improved relevance"
            />
            <BenefitCard
              title="Seamless Experience"
              description="No manual switching or configuration needed"
              metric="Zero complexity"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Advanced Routing Features
          </CardTitle>
          <CardDescription>
            Sophisticated capabilities of the smart routing system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AdvancedFeature
              title="Context Preservation"
              description="Maintains conversation context when switching between models"
              example="Math question followed by explanation request uses consistent context"
            />
            <AdvancedFeature
              title="Fallback Handling"
              description="Automatically tries alternative models if the first choice fails"
              example="If specialized model is unavailable, falls back to general model"
            />
            <AdvancedFeature
              title="Multi-Modal Detection"
              description="Identifies when queries involve multiple types of content"
              example="Code with math components routes to models capable of both"
            />
            <AdvancedFeature
              title="Learning Adaptation"
              description="Routing improves based on successful interactions"
              example="System learns which models work best for your query patterns"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProcessStep({
  step,
  title,
  description,
  icon: Icon,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
          {step}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function RoutingCategory({
  icon: Icon,
  title,
  description,
  examples,
  targetModels,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  examples: string[];
  targetModels: string[];
  color: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Example Queries:</h4>
            <ul className="space-y-1">
              {examples.map((example, i) => (
                <li key={i} className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded">
                  "{example}"
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Target Models:</h4>
            <div className="flex flex-wrap gap-1">
              {targetModels.map((model, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisIndicator({
  type,
  examples,
  action,
}: {
  type: string;
  examples: string[];
  action: string;
}) {
  return (
    <div className="border rounded-lg p-3">
      <h5 className="font-medium text-sm mb-1">{type}</h5>
      <p className="text-xs text-muted-foreground mb-2">
        {examples.join(', ')}
      </p>
      <div className="flex items-center gap-1">
        <ArrowRight className="h-3 w-3 text-primary" />
        <span className="text-xs text-primary">{action}</span>
      </div>
    </div>
  );
}

function RoutingExample({
  query,
  analysis,
  selectedModel,
  reasoning,
  category,
}: {
  query: string;
  analysis: string;
  selectedModel: string;
  reasoning: string;
  category: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">Query:</h4>
              <p className="text-sm font-mono bg-muted/50 p-2 rounded">"{query}"</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
          
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <h5 className="font-medium text-xs text-muted-foreground mb-1">ANALYSIS</h5>
              <p className="text-xs">{analysis}</p>
            </div>
            <div>
              <h5 className="font-medium text-xs text-muted-foreground mb-1">SELECTED MODEL</h5>
              <p className="text-xs text-primary">{selectedModel}</p>
            </div>
            <div>
              <h5 className="font-medium text-xs text-muted-foreground mb-1">REASONING</h5>
              <p className="text-xs">{reasoning}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BenefitCard({
  title,
  description,
  metric,
}: {
  title: string;
  description: string;
  metric: string;
}) {
  return (
    <div className="text-center p-4 bg-muted/50 rounded-lg">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <Badge variant="secondary" className="text-xs">
        {metric}
      </Badge>
    </div>
  );
}

function AdvancedFeature({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example: string;
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="bg-muted/50 p-3 rounded text-xs">
        <span className="font-medium">Example: </span>
        <span className="text-muted-foreground">{example}</span>
      </div>
    </div>
  );
}