'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Palette, 
  Sparkles, 
  Clock, 
  Settings,
  ArrowRight,
  Zap,
  Heart,
  Star,
  Camera
} from 'lucide-react';

export default function ImageGenerationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Image Generation</span>
          <Badge variant="secondary" className="text-xs">New</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Daily Free Image Generation
        </h1>
        <p className="text-xl text-muted-foreground">
          Create stunning AI-generated images with 5 free generations per day using multiple HuggingFace models.
        </p>
      </div>

      {/* Quick Access */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Try Image Generation Now
          </CardTitle>
          <CardDescription>
            Start creating AI art immediately with our easy-to-use interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/ai-services">
              <Button size="lg">
                Open AI Services Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline">
                Ask in Chat: "Generate an image of..."
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How It Works</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <StepCard
            step={1}
            title="Write Your Prompt"
            description="Describe the image you want to create in natural language"
            icon={Palette}
          />
          <StepCard
            step={2}
            title="Choose Style & Settings"
            description="Select art style, aspect ratio, and quality preferences"
            icon={Settings}
          />
          <StepCard
            step={3}
            title="Generate & Download"
            description="AI creates your image in seconds, ready to download"
            icon={Zap}
          />
        </div>
      </div>

      {/* Available Models */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">AI Models Available</h2>
        <p className="text-muted-foreground">
          We use 5 different HuggingFace models, each optimized for different art styles and use cases.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <ModelCard
            name="Stable Diffusion v1.5"
            description="High-quality general purpose image generation"
            styles={['Realistic', 'Artistic', 'Photographic']}
            priority={1}
          />
          <ModelCard
            name="Stable Diffusion v2.1"
            description="Improved version with better quality and details"
            styles={['Realistic', 'Artistic', 'Abstract']}
            priority={2}
          />
          <ModelCard
            name="OpenJourney"
            description="Midjourney-style artistic image generation"
            styles={['Artistic', 'Fantasy', 'Creative']}
            priority={3}
          />
          <ModelCard
            name="Anything v4"
            description="Anime and illustration focused model"
            styles={['Anime', 'Cartoon', 'Illustration']}
            priority={4}
          />
          <ModelCard
            name="Dreamlike Photoreal"
            description="Photorealistic image generation"
            styles={['Realistic', 'Photographic']}
            priority={5}
          />
        </div>
      </div>

      {/* Art Styles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Art Styles</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StyleCard
            style="Realistic"
            description="Photorealistic images with high detail and accuracy"
            examples={['Portrait photography', 'Landscape scenes', 'Product shots']}
            icon="📸"
          />
          <StyleCard
            style="Artistic"
            description="Creative and expressive artistic interpretations"
            examples={['Digital paintings', 'Concept art', 'Abstract compositions']}
            icon="🎨"
          />
          <StyleCard
            style="Anime"
            description="Japanese animation style with vibrant colors"
            examples={['Character designs', 'Manga illustrations', 'Cel-shaded art']}
            icon="🎌"
          />
          <StyleCard
            style="Cartoon"
            description="Fun and colorful cartoon-style illustrations"
            examples={['Character art', 'Children\'s book style', 'Comic illustrations']}
            icon="🎭"
          />
          <StyleCard
            style="Abstract"
            description="Non-representational artistic expressions"
            examples={['Geometric patterns', 'Color studies', 'Experimental art']}
            icon="🌈"
          />
          <StyleCard
            style="Photographic"
            description="Professional photography quality and lighting"
            examples={['Studio portraits', 'Commercial photography', 'DSLR quality']}
            icon="📷"
          />
        </div>
      </div>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Daily Usage Limits
          </CardTitle>
          <CardDescription>
            Fair usage policy to ensure everyone can enjoy free AI image generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                  ✅ What's Included (Free)
                </h4>
                <ul className="text-sm space-y-1 text-green-600 dark:text-green-400">
                  <li>• 5 image generations per day</li>
                  <li>• All 5 AI models available</li>
                  <li>• Multiple art styles</li>
                  <li>• Various aspect ratios</li>
                  <li>• High-quality output</li>
                  <li>• No watermarks</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  ⏰ Reset Schedule
                </h4>
                <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• Limits reset daily at midnight UTC</li>
                  <li>• Usage tracked per user account</li>
                  <li>• Anonymous users get shared limits</li>
                  <li>• No rollover of unused generations</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Pro Tips for Better Results</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Be specific in your prompts: "A red sports car in a city at sunset" vs "car"</li>
                <li>• Use style keywords: "photorealistic", "anime style", "oil painting"</li>
                <li>• Mention quality: "high quality", "detailed", "8k resolution"</li>
                <li>• Try different aspect ratios for different compositions</li>
                <li>• Use negative prompts to avoid unwanted elements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings & Options */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Customization Options</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aspect Ratios</CardTitle>
              <CardDescription>Choose the perfect dimensions for your image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AspectRatioOption ratio="1:1" description="Square (512×512)" use="Social media, avatars" />
                <AspectRatioOption ratio="16:9" description="Landscape (768×432)" use="Wallpapers, presentations" />
                <AspectRatioOption ratio="9:16" description="Portrait (432×768)" use="Phone wallpapers, stories" />
                <AspectRatioOption ratio="4:3" description="Standard (640×480)" use="Traditional photos" />
                <AspectRatioOption ratio="3:4" description="Portrait (480×640)" use="Portraits, posters" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Settings</CardTitle>
              <CardDescription>Balance between speed and image quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <QualityOption
                  level="Standard"
                  description="Good quality, faster generation (30 steps)"
                  recommended="Most use cases"
                />
                <QualityOption
                  level="High"
                  description="Best quality, slower generation (50 steps)"
                  recommended="Professional use, detailed art"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Example Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Example Prompts</CardTitle>
          <CardDescription>
            Get inspired with these example prompts for different styles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <ExamplePromptCard
              style="Realistic"
              prompt="A professional headshot of a confident businesswoman in a modern office, natural lighting, high quality, DSLR photography"
            />
            <ExamplePromptCard
              style="Artistic"
              prompt="A mystical forest with glowing mushrooms and fireflies, digital painting, fantasy art, vibrant colors, magical atmosphere"
            />
            <ExamplePromptCard
              style="Anime"
              prompt="A cheerful anime girl with blue hair in a school uniform, cherry blossoms in background, anime style, cel shading"
            />
            <ExamplePromptCard
              style="Abstract"
              prompt="Flowing geometric shapes in purple and gold, abstract art, modern composition, gradient colors, minimalist design"
            />
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ready to Create?
          </CardTitle>
          <CardDescription>
            Start generating beautiful AI images right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Head to the AI Services dashboard to start creating. You'll find the image generation panel 
              with all the tools you need to bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/ai-services">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Creating Images
                  <Sparkles className="ml-2 h-4 w-4" />
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
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
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
    </Card>
  );
}

function ModelCard({
  name,
  description,
  styles,
  priority,
}: {
  name: string;
  description: string;
  styles: string[];
  priority: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Priority {priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {styles.map((style, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {style}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StyleCard({
  style,
  description,
  examples,
  icon,
}: {
  style: string;
  description: string;
  examples: string[];
  icon: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{icon}</span>
          {style}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Perfect for:</h4>
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

function AspectRatioOption({
  ratio,
  description,
  use,
}: {
  ratio: string;
  description: string;
  use: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div>
        <h4 className="font-medium text-sm">{ratio}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{use}</p>
    </div>
  );
}

function QualityOption({
  level,
  description,
  recommended,
}: {
  level: string;
  description: string;
  recommended: string;
}) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <h4 className="font-medium text-sm mb-1">{level}</h4>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <Badge variant="outline" className="text-xs">
        {recommended}
      </Badge>
    </div>
  );
}

function ExamplePromptCard({
  style,
  prompt,
}: {
  style: string;
  prompt: string;
}) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <h4 className="font-medium text-sm mb-2">{style} Style</h4>
      <p className="text-xs text-muted-foreground font-mono bg-background p-2 rounded">
        "{prompt}"
      </p>
    </div>
  );
}