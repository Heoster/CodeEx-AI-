'use client';

/**
 * Message Attribution Component
 * Displays which AI model generated a response
 */

import { Sparkles, Code, Calculator, MessageCircle, Image as ImageIcon, Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ModelCategory } from '@/lib/types';

interface MessageAttributionProps {
  modelUsed?: string;
  modelCategory?: ModelCategory;
  autoRouted?: boolean;
  routingReasoning?: string;
}

// Load model display names from configuration
import modelsConfigData from '@/lib/models-config.json';

const MODEL_NAMES: Record<string, string> = modelsConfigData.models.reduce((acc, model) => {
  acc[model.id] = model.name;
  return acc;
}, {} as Record<string, string>);

// Category icons and colors
const CATEGORY_CONFIG: Record<ModelCategory, { icon: typeof Sparkles; color: string; label: string }> = {
  general: { icon: Sparkles, color: 'text-blue-500', label: 'General' },
  coding: { icon: Code, color: 'text-green-500', label: 'Coding' },
  math: { icon: Calculator, color: 'text-purple-500', label: 'Math' },
  conversation: { icon: MessageCircle, color: 'text-orange-500', label: 'Conversation' },
  multimodal: { icon: ImageIcon, color: 'text-pink-500', label: 'Multimodal' },
};

export function MessageAttribution({
  modelUsed,
  modelCategory,
  autoRouted,
  routingReasoning,
}: MessageAttributionProps) {
  if (!modelUsed) {
    return null;
  }

  const displayName = MODEL_NAMES[modelUsed] || modelUsed;
  const category = modelCategory || 'general';
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
            <Icon className={cn('h-3 w-3', config.color)} />
            <span>{displayName}</span>
            {autoRouted && (
              <span className="flex items-center gap-0.5 text-muted-foreground/70">
                <Zap className="h-3 w-3" />
                <span>auto</span>
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[250px]">
          <div className="space-y-1">
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              Category: {config.label}
            </p>
            {autoRouted && routingReasoning && (
              <p className="text-xs text-muted-foreground">
                {routingReasoning}
              </p>
            )}
            {autoRouted && !routingReasoning && (
              <p className="text-xs text-muted-foreground">
                Automatically selected based on your query
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default MessageAttribution;
