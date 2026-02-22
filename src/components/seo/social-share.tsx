/**
 * Social Media Sharing Component
 * Optimized sharing buttons with tracking and SEO benefits
 * Enhanced for WhatsApp, Facebook, Twitter, LinkedIn, Telegram, and more
 */

'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link, MessageCircle, Send, Mail, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  className?: string;
  image?: string;
}

export function SocialShare({
  url = typeof window !== 'undefined' ? window.location.href : 'https://codeex-ai.netlify.app',
  title = '🚀 CODEEX AI - Free AI Chat with 21+ Models | ChatGPT Alternative',
  description = '✨ Try CODEEX AI - the best free AI assistant! Features: AI Chat, Code Generator, Image Creator, Math Solver, PDF Analyzer, Voice AI (Jarvis Mode). No signup needed! 🎯',
  hashtags = ['AI', 'ChatGPT', 'FreeAI', 'CodeGenerator', 'AIChat', 'ArtificialIntelligence', 'Coding', 'Programming', 'Tech', 'AITools'],
  via = 'codeexai',
  className = '',
  image = 'https://codeex-ai.netlify.app/images/og-image.png'
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = encodeURIComponent(hashtags.join(','));
  const encodedImage = encodeURIComponent(image);

  // WhatsApp optimized message with emojis for better engagement
  const whatsappMessage = `${title}

${description}

👉 Try it FREE: ${url}

#AI #FreeAI #ChatGPT #CodeGenerator`;

  // Telegram optimized message
  const telegramMessage = `${title}

${description}

🔗 ${url}`;

  const shareLinks = {
    // WhatsApp - Most important for mobile sharing
    whatsapp: `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`,
    whatsappDirect: `whatsapp://send?text=${encodeURIComponent(whatsappMessage)}`,
    
    // Twitter/X
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}&via=${via}`,
    
    // Facebook
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    
    // LinkedIn
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    
    // Telegram
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(telegramMessage)}`,
    
    // Reddit
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    
    // Pinterest
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
    
    // Hacker News
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    
    // Email
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    
    // SMS
    sms: `sms:?body=${encodeURIComponent(`${title} - ${url}`)}`
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    // Track sharing event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'webpage',
        item_id: url
      });
    }

    // Special handling for WhatsApp on mobile
    if (platform === 'whatsapp' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = shareLinks.whatsappDirect;
      return;
    }

    // Open share window
    if (platform === 'email' || platform === 'sms') {
      window.location.href = shareUrl;
    } else {
      window.open(
        shareUrl,
        'share-dialog',
        'width=600,height=500,scrollbars=yes,resizable=yes'
      );
    }
    
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: '✅ Link copied!',
        description: 'Share CODEEX AI with your friends!',
      });
      
      // Track copy event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: 'copy_link',
          content_type: 'webpage',
          item_id: url
        });
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: title.replace(/[🚀✨🎯👉]/g, '').trim(),
          text: description.replace(/[🚀✨🎯👉]/g, '').trim(),
          url
        });
        
        // Track native share
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'share', {
            method: 'native',
            content_type: 'webpage',
            item_id: url
          });
        }
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className={className}>
      {/* Native Share API (mobile) */}
      {typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="md:hidden"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}

      {/* Desktop Share Menu */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator ? 'hidden md:flex' : ''}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {/* Most Popular - WhatsApp First */}
          <DropdownMenuItem onClick={() => handleShare('whatsapp', shareLinks.whatsapp)} className="text-green-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
            <span className="ml-auto text-xs text-muted-foreground">Popular</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleShare('telegram', shareLinks.telegram)} className="text-blue-500">
            <Send className="h-4 w-4 mr-2" />
            Telegram
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleShare('twitter', shareLinks.twitter)}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter / X
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleShare('facebook', shareLinks.facebook)}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleShare('linkedin', shareLinks.linkedin)}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleShare('email', shareLinks.email)}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Floating share buttons for articles/blog posts
export function FloatingSocialShare(props: SocialShareProps) {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
      <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
        <SocialShare {...props} />
      </div>
    </div>
  );
}

// Inline share buttons for content
export function InlineSocialShare({
  className = "flex items-center gap-2 py-4 border-t border-b",
  ...props
}: SocialShareProps) {
  return (
    <div className={className}>
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      <SocialShare {...props} />
    </div>
  );
}