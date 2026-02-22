'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Cpu, 
  Volume2, 
  Palette, 
  User, 
  Shield,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Mic,
  MessageSquare
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <Settings className="h-4 w-4 text-primary" />
          <span className="font-medium">Settings & Customization</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Customize Your Experience
        </h1>
        <p className="text-xl text-muted-foreground">
          Personalize CodeEx AI with your preferred AI models, response style, voice settings, and appearance.
        </p>
      </div>

      {/* How to Access Settings */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            How to Access Settings
          </CardTitle>
          <CardDescription>
            Quick guide to opening and navigating the settings panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Desktop</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Look for the settings icon (⚙️) in the top header</li>
                <li>2. Click the icon to open the settings dialog</li>
                <li>3. Adjust your preferences</li>
                <li>4. Settings save automatically</li>
              </ol>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Mobile</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Tap the settings icon in the header</li>
                <li>2. Settings open in a mobile-optimized dialog</li>
                <li>3. Swipe down to dismiss when done</li>
                <li>4. Changes apply immediately</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Settings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">AI Model Configuration</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Model Selection
            </CardTitle>
            <CardDescription>
              Choose how CodeEx AI selects models for your conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <ModelOption
                  name="Auto (Recommended)"
                  description="Smart routing - AI automatically selects the best model for each query"
                  badge="Smart"
                  features={[
                    'Math questions → Math models',
                    'Code questions → Programming models',
                    'General chat → Conversational models',
                    'Image tasks → Multimodal models'
                  ]}
                  recommended={true}
                />
                <ModelOption
                  name="Manual Selection"
                  description="Choose a specific model for all conversations"
                  badge="Control"
                  features={[
                    '13+ models available',
                    'Consistent model behavior',
                    'Specialized for specific tasks',
                    'Expert users preferred'
                  ]}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">💡 Recommendation</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Use "Auto" mode for the best experience. The AI will automatically route your questions 
                  to the most appropriate model, giving you optimal results without manual selection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Customization */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Response Customization</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Response Tone
              </CardTitle>
              <CardDescription>
                Set the personality and communication style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ToneOption
                  tone="Helpful"
                  description="Friendly, supportive, and encouraging responses"
                  example="I'd be happy to help you with that! Let me break it down step by step..."
                  default={true}
                />
                <ToneOption
                  tone="Formal"
                  description="Professional, structured, and precise communication"
                  example="I shall provide you with a comprehensive analysis of the requested topic..."
                />
                <ToneOption
                  tone="Casual"
                  description="Relaxed, conversational, and approachable style"
                  example="Sure thing! So here's the deal with that..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Technical Level
              </CardTitle>
              <CardDescription>
                Adjust explanation complexity and detail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TechnicalLevel
                  level="Beginner"
                  description="Simple explanations with basic terminology"
                  features={['Step-by-step guidance', 'Minimal jargon', 'Lots of examples']}
                />
                <TechnicalLevel
                  level="Intermediate"
                  description="Balanced explanations with moderate detail"
                  features={['Some technical terms', 'Practical examples', 'Moderate depth']}
                />
                <TechnicalLevel
                  level="Expert"
                  description="Advanced explanations with technical depth"
                  features={['Technical terminology', 'Detailed analysis', 'Assumes knowledge']}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Voice & Audio Settings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Voice & Audio Settings</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Speech Output (Text-to-Speech)
            </CardTitle>
            <CardDescription>
              Configure AI responses to be read aloud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Voice Options</h4>
                  <div className="space-y-3">
                    <VoiceOption
                      name="Voice 1"
                      description="Natural, clear female voice"
                      characteristics={['Clear pronunciation', 'Moderate pace', 'Professional tone']}
                    />
                    <VoiceOption
                      name="Voice 2"
                      description="Warm, friendly male voice"
                      characteristics={['Conversational style', 'Slightly slower pace', 'Approachable']}
                    />
                    <VoiceOption
                      name="Voice 3"
                      description="Crisp, articulate female voice"
                      characteristics={['Fast pace', 'Technical content', 'Precise diction']}
                    />
                    <VoiceOption
                      name="Voice 4"
                      description="Deep, authoritative male voice"
                      characteristics={['Slower pace', 'Emphasis on key points', 'Confident delivery']}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Audio Controls</h4>
                  <div className="space-y-3">
                    <AudioControl
                      name="Speech Rate"
                      description="Adjust how fast the AI speaks"
                      range="0.5x to 2.0x speed"
                    />
                    <AudioControl
                      name="Pitch"
                      description="Modify voice pitch for comfort"
                      range="Lower to higher pitch"
                    />
                    <AudioControl
                      name="Volume"
                      description="Control speech output volume"
                      range="0% to 100%"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">🎧 Accessibility</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Speech output is perfect for accessibility, multitasking, or when you prefer to listen 
                  rather than read. Great for learning while doing other activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Input Settings
            </CardTitle>
            <CardDescription>
              Configure speech-to-text input preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <VoiceInputSetting
                name="Auto-Send"
                description="Automatically send message after voice input"
                options={['Enabled', 'Disabled (Review first)']}
              />
              <VoiceInputSetting
                name="Language Detection"
                description="Automatically detect spoken language"
                options={['Auto-detect', 'Fixed language']}
              />
              <VoiceInputSetting
                name="Noise Filtering"
                description="Filter background noise during recording"
                options={['Enabled (Recommended)', 'Disabled']}
              />
              <VoiceInputSetting
                name="Recording Timeout"
                description="Stop recording after silence"
                options={['3 seconds', '5 seconds', '10 seconds']}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appearance Settings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Appearance & Theme</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Selection
            </CardTitle>
            <CardDescription>
              Choose your preferred visual appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <ThemeOption
                name="Light"
                description="Bright, clean interface perfect for daytime use"
                icon={Sun}
                features={['High contrast text', 'Bright backgrounds', 'Easy reading']}
              />
              <ThemeOption
                name="Dark"
                description="Dark interface that's easy on the eyes"
                icon={Moon}
                features={['Reduced eye strain', 'Better for low light', 'Modern appearance']}
              />
              <ThemeOption
                name="System"
                description="Automatically matches your device's theme"
                icon={Monitor}
                features={['Auto light/dark switching', 'Follows OS preference', 'Seamless integration']}
                recommended={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device-Specific Settings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Device-Specific Settings</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Settings
              </CardTitle>
              <CardDescription>
                Optimizations for mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <MobileSetting
                  name="Touch Targets"
                  description="Larger buttons for easier tapping"
                  status="Always enabled"
                />
                <MobileSetting
                  name="Swipe Gestures"
                  description="Swipe to dismiss dialogs and sheets"
                  status="Configurable"
                />
                <MobileSetting
                  name="Haptic Feedback"
                  description="Vibration feedback for interactions"
                  status="Device dependent"
                />
                <MobileSetting
                  name="Auto-Zoom Prevention"
                  description="Prevent zoom on input focus"
                  status="Always enabled"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Desktop Settings
              </CardTitle>
              <CardDescription>
                Features specific to desktop usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <DesktopSetting
                  name="Keyboard Shortcuts"
                  description="Quick access via keyboard"
                  shortcuts={['Ctrl+Enter to send', 'Ctrl+/ for commands']}
                />
                <DesktopSetting
                  name="Window Resizing"
                  description="Responsive layout adaptation"
                  shortcuts={['Auto-adjust to window size']}
                />
                <DesktopSetting
                  name="Multi-Monitor"
                  description="Optimized for multiple displays"
                  shortcuts={['Consistent scaling', 'DPI awareness']}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security Settings
          </CardTitle>
          <CardDescription>
            Control your data and privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <PrivacySetting
              name="Conversation Storage"
              description="How long to keep your chat history"
              options={['Session only', '7 days', '30 days', 'Until cleared']}
              current="Session only"
            />
            <PrivacySetting
              name="Analytics"
              description="Help improve CodeEx AI with usage data"
              options={['Enabled (Anonymous)', 'Disabled']}
              current="Anonymous only"
            />
            <PrivacySetting
              name="Voice Data"
              description="How voice input is processed"
              options={['Local processing', 'Cloud processing']}
              current="Local preferred"
            />
            <PrivacySetting
              name="Model Preferences"
              description="Save your model selection preferences"
              options={['Remember settings', 'Reset each session']}
              current="Remember settings"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Settings Management
          </CardTitle>
          <CardDescription>
            Backup, restore, and sync your preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <SettingsAction
                title="Export Settings"
                description="Download your preferences as a file"
                action="Download JSON file"
              />
              <SettingsAction
                title="Import Settings"
                description="Restore preferences from a backup file"
                action="Upload JSON file"
              />
              <SettingsAction
                title="Reset to Defaults"
                description="Clear all customizations"
                action="Reset all settings"
              />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">⚠️ Settings Storage</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your settings are stored locally in your browser. They won't sync across devices unless 
                you manually export and import them. Consider backing up your settings if you have 
                specific preferences configured.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ModelOption({
  name,
  description,
  badge,
  features,
  recommended = false,
}: {
  name: string;
  description: string;
  badge: string;
  features: string[];
  recommended?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 ${recommended ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-semibold">{name}</h4>
        <Badge variant={recommended ? "default" : "outline"} className="text-xs">
          {badge}
        </Badge>
        {recommended && (
          <Badge variant="secondary" className="text-xs">
            Recommended
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <ul className="space-y-1">
        {features.map((feature, i) => (
          <li key={i} className="text-xs text-muted-foreground">• {feature}</li>
        ))}
      </ul>
    </div>
  );
}

function ToneOption({
  tone,
  description,
  example,
  default: isDefault = false,
}: {
  tone: string;
  description: string;
  example: string;
  default?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 ${isDefault ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-semibold">{tone}</h4>
        {isDefault && (
          <Badge variant="secondary" className="text-xs">
            Default
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="bg-muted/50 p-3 rounded text-xs font-mono">
        "{example}"
      </div>
    </div>
  );
}

function TechnicalLevel({
  level,
  description,
  features,
}: {
  level: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-1">{level}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <ul className="space-y-1">
        {features.map((feature, i) => (
          <li key={i} className="text-xs text-muted-foreground">• {feature}</li>
        ))}
      </ul>
    </div>
  );
}

function VoiceOption({
  name,
  description,
  characteristics,
}: {
  name: string;
  description: string;
  characteristics: string[];
}) {
  return (
    <div className="border rounded-lg p-3">
      <h5 className="font-medium text-sm mb-1">{name}</h5>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <ul className="space-y-0.5">
        {characteristics.map((char, i) => (
          <li key={i} className="text-xs text-muted-foreground">• {char}</li>
        ))}
      </ul>
    </div>
  );
}

function AudioControl({
  name,
  description,
  range,
}: {
  name: string;
  description: string;
  range: string;
}) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <h5 className="font-medium text-sm mb-1">{name}</h5>
      <p className="text-xs text-muted-foreground mb-1">{description}</p>
      <p className="text-xs text-blue-600 dark:text-blue-400">{range}</p>
    </div>
  );
}

function VoiceInputSetting({
  name,
  description,
  options,
}: {
  name: string;
  description: string;
  options: string[];
}) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h4 className="font-medium text-sm mb-1">{name}</h4>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <div className="space-y-1">
        {options.map((option, i) => (
          <p key={i} className="text-xs text-muted-foreground">• {option}</p>
        ))}
      </div>
    </div>
  );
}

function ThemeOption({
  name,
  description,
  icon: Icon,
  features,
  recommended = false,
}: {
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  recommended?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 ${recommended ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <h4 className="font-semibold">{name}</h4>
        {recommended && (
          <Badge variant="secondary" className="text-xs">
            Recommended
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <ul className="space-y-1">
        {features.map((feature, i) => (
          <li key={i} className="text-xs text-muted-foreground">• {feature}</li>
        ))}
      </ul>
    </div>
  );
}

function MobileSetting({
  name,
  description,
  status,
}: {
  name: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div>
        <h4 className="font-medium text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Badge variant="outline" className="text-xs">
        {status}
      </Badge>
    </div>
  );
}

function DesktopSetting({
  name,
  description,
  shortcuts,
}: {
  name: string;
  description: string;
  shortcuts: string[];
}) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <h4 className="font-medium text-sm mb-1">{name}</h4>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <ul className="space-y-0.5">
        {shortcuts.map((shortcut, i) => (
          <li key={i} className="text-xs text-blue-600 dark:text-blue-400">• {shortcut}</li>
        ))}
      </ul>
    </div>
  );
}

function PrivacySetting({
  name,
  description,
  options,
  current,
}: {
  name: string;
  description: string;
  options: string[];
  current: string;
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="space-y-1 mb-2">
        {options.map((option, i) => (
          <p key={i} className="text-xs text-muted-foreground">• {option}</p>
        ))}
      </div>
      <Badge variant="outline" className="text-xs">
        Current: {current}
      </Badge>
    </div>
  );
}

function SettingsAction({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="border rounded-lg p-4 text-center">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <Badge variant="outline" className="text-xs">
        {action}
      </Badge>
    </div>
  );
}