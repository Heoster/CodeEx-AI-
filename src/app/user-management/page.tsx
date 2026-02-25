'use client';

import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { PageSEO } from '@/components/seo/page-seo';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  Shield,
  Sparkles,
  Image,
  Video,
  Search,
  Mic,
  Volume2,
  MessageSquare,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function UserManagementPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access user management</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = [
    {
      icon: Sparkles,
      title: 'Multi-Model AI',
      description: 'Access Groq, Google Gemini, Cerebras, and HuggingFace models',
      status: 'active',
      link: '/chat'
    },
    {
      icon: Image,
      title: 'Image Generation',
      description: 'SOHAM pipeline with HuggingFace FLUX.1-schnell',
      status: 'active',
      link: '/chat'
    },
    {
      icon: Video,
      title: 'Video Generation',
      description: 'Google Veo 3.1 for AI video creation',
      status: 'active',
      link: '/chat'
    },
    {
      icon: Search,
      title: 'Web Search',
      description: 'You.com integration for real-time web search',
      status: 'active',
      link: '/chat'
    },
    {
      icon: Mic,
      title: 'Speech-to-Text',
      description: 'Groq Whisper V3 Turbo for voice transcription',
      status: 'active',
      link: '/chat'
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Groq PlayAI TTS with 6 voice options',
      status: 'active',
      link: '/chat'
    },
    {
      icon: MessageSquare,
      title: 'Smart Intent Detection',
      description: 'Automatic routing to image, video, or search',
      status: 'active',
      link: '/chat'
    },
    {
      icon: Zap,
      title: 'Memory System',
      description: 'Context-aware conversations with memory',
      status: 'beta',
      link: '/chat'
    }
  ];

  const quickLinks = [
    { icon: Settings, label: 'Account Settings', href: '/account-settings' },
    { icon: BookOpen, label: 'Documentation', href: '/documentation' },
    { icon: Shield, label: 'Privacy Policy', href: '/privacy' },
    { icon: ExternalLink, label: 'Terms of Service', href: '/terms' }
  ];

  return (
    <>
      <PageSEO
        title="User Management | CODEEX AI"
        description="Manage your CODEEX AI account, view features, and access settings"
        keywords={['user management', 'account', 'AI features']}
        canonical="/user-management"
      />

      <div className="min-h-screen bg-background">
        <PageHeader
          backLink="/chat"
          backText="Back to Chat"
          title="User Management"
        />

        <main className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{user.displayName || 'User'}</h2>
                  <p className="text-muted-foreground">{user.email}</p>

                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge variant="outline">
                      Member since {new Date(user.metadata.creationTime!).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>

                <Button onClick={() => window.location.href = '/account-settings'}>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Available Features</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <feature.icon className="h-8 w-8 text-primary" />
                      <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.location.href = feature.link}
                    >
                      Try Now
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access important pages and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => window.location.href = link.href}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono">{user.uid.substring(0, 20)}...</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="text-sm">{new Date(user.metadata.creationTime!).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Sign In</p>
                  <p className="text-sm">{new Date(user.metadata.lastSignInTime!).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
