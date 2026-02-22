import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Zap, 
  Settings, 
  Brain, 
  Target, 
  Share2,
  BarChart3,
  Sparkles,
  MessageSquare,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Personalization - CODEEX AI Documentation',
  description: 'Learn how to customize your AI experience with personalization settings, response formatting, and smart context management.',
};

export default function PersonalizationDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Personalization</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Customize your AI experience with advanced personalization settings, smart context management, and response optimization.
          </p>
          <Badge variant="secondary" className="text-sm">
            New in CODEEX AI v3.1
          </Badge>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              What's New in AI Personalization
            </CardTitle>
            <CardDescription>
              Revolutionary features that make AI responses more relevant, concise, and tailored to your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-600">✅ Problems Solved</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI responses too long and overwhelming</li>
                  <li>• Information from old queries cluttering new responses</li>
                  <li>• Generic responses not matching user needs</li>
                  <li>• Difficulty sharing and organizing AI responses</li>
                  <li>• No insights into AI interaction patterns</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-600">🚀 New Capabilities</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Personalized AI behavior based on your profile</li>
                  <li>• Smart context management for fresh conversations</li>
                  <li>• Automatic response enhancement and formatting</li>
                  <li>• Advanced sharing and export options</li>
                  <li>• Response analytics and performance insights</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information Setup
            </CardTitle>
            <CardDescription>
              Help AI understand you better for more personalized responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> AI will address you personally
                  </div>
                  <div>
                    <strong>Age:</strong> Adjusts explanation complexity
                  </div>
                  <div>
                    <strong>Profession:</strong> Tailors examples to your field
                  </div>
                  <div>
                    <strong>Education Level:</strong> Matches technical depth
                  </div>
                  <div>
                    <strong>Interests:</strong> Provides relevant examples
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">How It Helps</h3>
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="mb-2"><strong>Example:</strong></p>
                  <p className="text-muted-foreground">
                    "Hi Sarah, as a web developer, you'll find React hooks particularly useful for state management. 
                    Since you're interested in performance optimization, here's how useMemo can help..."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Response Preferences
            </CardTitle>
            <CardDescription>
              Control how AI responds to your queries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Response Length</h3>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline">Short</Badge> 50-150 words</div>
                  <div><Badge variant="outline">Medium</Badge> 150-300 words</div>
                  <div><Badge variant="outline">Detailed</Badge> 300-1000 words</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">AI Tone</h3>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline">Professional</Badge> Formal language</div>
                  <div><Badge variant="outline">Friendly</Badge> Warm & supportive</div>
                  <div><Badge variant="outline">Casual</Badge> Conversational</div>
                  <div><Badge variant="outline">Enthusiastic</Badge> Energetic</div>
                  <div><Badge variant="outline">Concise</Badge> Direct & efficient</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Technical Depth</h3>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline">Beginner</Badge> Simple terms</div>
                  <div><Badge variant="outline">Intermediate</Badge> Balanced</div>
                  <div><Badge variant="outline">Advanced</Badge> Technical</div>
                  <div><Badge variant="outline">Expert</Badge> Deep concepts</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Use the word limit slider to prevent information overload. Set it to 200-300 words for optimal readability 
                while still getting comprehensive answers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Response Formatting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Response Formatting
            </CardTitle>
            <CardDescription>
              Automatic formatting and enhancement options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Formatting Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Auto Highlights</span>
                    <Badge variant="secondary">🔥 Important info highlighted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bold Text</span>
                    <Badge variant="secondary">**Key terms** emphasized</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Underlines</span>
                    <Badge variant="secondary">__Critical points__ underlined</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emojis</span>
                    <Badge variant="secondary">✨ Visual enhancement</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Enhanced Example</h3>
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p>🔥 <strong>Important:</strong> React hooks must follow the rules of hooks.</p>
                  <p>✅ <strong>Solution:</strong> Always call hooks at the top level.</p>
                  <p>💡 <strong>Tip:</strong> Use ESLint plugin for automatic checking.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Smart Context Management
            </CardTitle>
            <CardDescription>
              Prevents information overload from previous conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Context Memory</h3>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline">Minimal</Badge> 2 messages</div>
                  <div><Badge variant="outline">Standard</Badge> 6 messages</div>
                  <div><Badge variant="outline">Extended</Badge> 12 messages</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Fresh Chat Behavior</h3>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline">Clean Start</Badge> No context</div>
                  <div><Badge variant="outline">Light Context</Badge> Recent only</div>
                  <div><Badge variant="outline">Full Context</Badge> All relevant</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Smart Features</h3>
                <div className="space-y-1 text-sm">
                  <div>🎯 Topic-based filtering</div>
                  <div>⏰ Time-based relevance</div>
                  <div>🔄 Auto-optimization</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🎯 How It Works</h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                The AI automatically detects when you're starting a new topic and reduces context from previous conversations. 
                This prevents responses from being cluttered with irrelevant information from earlier queries.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Response Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Response Sharing & Export
            </CardTitle>
            <CardDescription>
              Share and save AI responses in multiple formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Export Formats</h3>
                <div className="space-y-2 text-sm">
                  <div>📄 <strong>Text:</strong> Plain text format</div>
                  <div>📝 <strong>Markdown:</strong> Formatted with headers</div>
                  <div>🌐 <strong>HTML:</strong> Web-ready format</div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Sharing Options</h3>
                <div className="space-y-2 text-sm">
                  <div>📧 <strong>Email:</strong> Direct email sharing</div>
                  <div>🐦 <strong>Social:</strong> Twitter, LinkedIn, Facebook</div>
                  <div>📱 <strong>Native:</strong> Device sharing menu</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Response Analytics
            </CardTitle>
            <CardDescription>
              Track your AI interaction patterns and optimize performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Metrics Tracked</h3>
                <div className="space-y-2 text-sm">
                  <div>📊 Response quality scores</div>
                  <div>📈 Average word counts</div>
                  <div>⏱️ Reading time estimates</div>
                  <div>🎯 Topic distribution</div>
                  <div>✨ Enhancement usage</div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Insights Provided</h3>
                <div className="space-y-2 text-sm">
                  <div>💡 Response optimization tips</div>
                  <div>🎨 Formatting recommendations</div>
                  <div>📝 Length adjustment suggestions</div>
                  <div>🔄 Context management advice</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Quick setup guide for optimal AI personalization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h3 className="font-semibold">Set Up Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to Settings → Personal tab and fill in your basic information (name, profession, interests).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h3 className="font-semibold">Configure Response Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred response length (200-300 words recommended), tone, and technical depth.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h3 className="font-semibold">Enable Formatting</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn on auto-highlights, bold text, and emojis for better readability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <h3 className="font-semibold">Optimize Context</h3>
                  <p className="text-sm text-muted-foreground">
                    Set context memory to "Standard" and fresh chat behavior to "Light Context" for best results.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🚀 Pro Setup</h4>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                For the best experience: Enable all formatting options, set response length to 250 words, 
                use "Friendly" tone, and "Standard" context memory. This provides the perfect balance of 
                information density and readability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Q: Will my personal information be stored securely?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, all personalization data is stored locally in your browser and never sent to external servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Q: How does context management prevent information overload?</h3>
                <p className="text-sm text-muted-foreground">
                  The AI analyzes topic relevance and time-based factors to include only pertinent context from previous conversations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Q: Can I reset my personalization settings?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can reset individual settings or clear all personalization data from the settings panel.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Q: Do these features work with all AI models?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, personalization works with all 13+ AI models and the auto-routing system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}