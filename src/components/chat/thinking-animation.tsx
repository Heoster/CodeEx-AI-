'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Sparkles, Zap, Code, Calculator, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const thinkingStages = [
  { text: 'Analyzing your request', icon: Search, color: 'text-blue-500' },
  { text: 'Processing information', icon: Brain, color: 'text-purple-500' },
  { text: 'Generating response', icon: Sparkles, color: 'text-yellow-500' },
  { text: 'Optimizing output', icon: Zap, color: 'text-green-500' },
  { text: 'Finalizing answer', icon: Code, color: 'text-orange-500' },
];

const thinkingPhrases = [
  'Thinking deeply...',
  'Analyzing patterns...',
  'Processing data...',
  'Connecting ideas...',
  'Formulating response...',
  'Almost there...',
];

export function ThinkingAnimation() {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [dots, setDots] = useState('');

  // Cycle through thinking stages
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % thinkingStages.length);
    }, 2000);

    return () => clearInterval(stageInterval);
  }, []);

  // Cycle through phrases
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % thinkingPhrases.length);
    }, 1500);

    return () => clearInterval(phraseInterval);
  }, []);

  // Animate dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  const CurrentIcon = thinkingStages[currentStage].icon;

  return (
    <div className="flex items-start gap-3 md:gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Avatar with animated icon */}
      <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background bg-gradient-to-br from-primary to-primary/80">
        <AvatarImage src="/favicon.ico" alt="CODEEX AI" />
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CurrentIcon className={cn('h-5 w-5 animate-pulse', thinkingStages[currentStage].color)} />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-3 pt-1">
        {/* Dynamic thinking text */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground animate-pulse">
            {thinkingPhrases[currentPhrase]}
            <span className="inline-block w-8 text-left">{dots}</span>
          </span>
        </div>

        {/* Animated progress bars */}
        <div className="space-y-2">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer bg-[length:200%_100%]" />
          </div>
          <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 animate-shimmer bg-[length:200%_100%] [animation-delay:0.3s]" />
          </div>
        </div>

        {/* Thinking stage indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CurrentIcon className={cn('h-3.5 w-3.5', thinkingStages[currentStage].color)} />
          <span className="animate-in fade-in-0 slide-in-from-left-2 duration-300">
            {thinkingStages[currentStage].text}
          </span>
        </div>

        {/* Animated particles */}
        <div className="flex gap-1.5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 w-1 rounded-full bg-primary/40 animate-bounce',
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>

        {/* Neural network visualization */}
        <div className="flex items-center gap-1 opacity-50">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={`node-${i}`}
                className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
          <Calculator className="h-3 w-3 text-primary/50 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>
    </div>
  );
}
