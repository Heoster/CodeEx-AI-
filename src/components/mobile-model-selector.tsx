"use client";

/**
 * Mobile Model Selector Component
 * A responsive bottom sheet for selecting AI models on mobile devices
 * Features: Swipe to dismiss, search, category filtering, smooth animations
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Sparkles, 
  Code, 
  Calculator, 
  MessageCircle, 
  Image as ImageIcon,
  Search,
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelId, ModelCategory } from '@/lib/types';

interface ModelOption {
  id: 'auto' | ModelId;
  name: string;
  provider: string;
  description: string;
  category: ModelCategory;
}

interface MobileModelSelectorProps {
  value: 'auto' | ModelId;
  onValueChange: (value: 'auto' | ModelId) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Category icons and labels with enhanced styling
const CATEGORY_CONFIG: Record<ModelCategory, { 
  icon: typeof Sparkles; 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  general: { 
    icon: Sparkles, 
    label: 'General', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  coding: { 
    icon: Code, 
    label: 'Coding', 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  math: { 
    icon: Calculator, 
    label: 'Math', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  conversation: { 
    icon: MessageCircle, 
    label: 'Conversation', 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  multimodal: { 
    icon: ImageIcon, 
    label: 'Multimodal', 
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
};

// Load models from configuration
import modelsConfigData from '@/lib/models-config.json';

// Provider display names
const PROVIDER_NAMES: Record<string, string> = {
  groq: 'Groq',
  google: 'Google',
  huggingface: 'HF',
  cerebras: 'Cerebras',
};

// Provider badge colors
const PROVIDER_COLORS: Record<string, string> = {
  groq: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  google: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  huggingface: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  cerebras: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
};

const DEFAULT_MODELS: ModelOption[] = modelsConfigData.models
  .filter(model => model.enabled)
  .map(model => ({
    id: model.id as ModelId,
    name: model.name,
    provider: model.provider,
    description: model.description,
    category: model.category as ModelCategory,
  }));

export function MobileModelSelector({
  value,
  onValueChange,
  isOpen,
  onClose,
}: MobileModelSelectorProps) {
  const models = DEFAULT_MODELS;
  const selectedModel = value;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Reset search when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      // Auto-expand category of selected model
      const selected = models.find(m => m.id === value);
      if (selected) {
        setExpandedCategories([selected.category]);
      }
    }
  }, [isOpen, value, models]);
  
  // Filter models based on search query
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return models;
    
    const query = searchQuery.toLowerCase();
    return models.filter(model => 
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.category.toLowerCase().includes(query)
    );
  }, [models, searchQuery]);
  
  // Group filtered models by category
  const modelsByCategory = useMemo(() => {
    return filteredModels.reduce((acc, model) => {
      if (!acc[model.category]) {
        acc[model.category] = [];
      }
      acc[model.category].push(model);
      return acc;
    }, {} as Record<ModelCategory, ModelOption[]>);
  }, [filteredModels]);
  
  // Count total filtered models
  const totalFilteredModels = useMemo(() => 
    Object.values(modelsByCategory).reduce((sum, arr) => sum + arr.length, 0),
    [modelsByCategory]
  );
  
  // Handle swipe to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }, []);
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchEnd - touchStart;
    
    // If swiped down more than 100px, close the dialog
    if (diff > 100) {
      onClose();
    }
    
    setTouchStart(null);
  }, [touchStart, onClose]);
  
  const handleSelect = useCallback((modelId: 'auto' | ModelId) => {
    onValueChange(modelId);
    // Small delay for visual feedback
    setTimeout(() => onClose(), 150);
  }, [onValueChange, onClose]);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[425px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>
        
        <DialogHeader className="px-4 pb-3">
          <DialogTitle className="flex items-center justify-between">
            <span>Select AI Model</span>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                {totalFilteredModels} {totalFilteredModels === 1 ? 'model' : 'models'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Auto option - only show when not searching */}
        {!searchQuery && (
          <div className="px-4 pb-3">
            <Button
              variant={selectedModel === 'auto' ? 'default' : 'outline'}
              className="w-full justify-start min-h-[48px] gap-3 transition-all"
              onClick={() => handleSelect('auto')}
            >
              <div className={cn(
                'p-1.5 rounded-md',
                selectedModel === 'auto' ? 'bg-primary-foreground/20' : 'bg-blue-500/10'
              )}>
                <Zap className={cn(
                  'h-4 w-4',
                  selectedModel === 'auto' ? 'text-primary-foreground' : 'text-blue-500'
                )} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Auto (Smart Routing)</div>
                <div className="text-xs text-muted-foreground">
                  Automatically select the best model for your task
                </div>
              </div>
              {selectedModel === 'auto' && <Check className="h-5 w-5 shrink-0" />}
            </Button>
          </div>
        )}
        
        {/* Model categories accordion */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {totalFilteredModels === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No models found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <Accordion 
              type="multiple" 
              className="w-full"
              value={expandedCategories}
              onValueChange={setExpandedCategories}
            >
              {(Object.keys(CATEGORY_CONFIG) as ModelCategory[]).map((category) => {
                const categoryModels = modelsByCategory[category] || [];
                if (categoryModels.length === 0) return null;
                
                const config = CATEGORY_CONFIG[category];
                const Icon = config.icon;
                
                return (
                  <AccordionItem key={category} value={category} className="border-b">
                    <AccordionTrigger className="min-h-[48px] hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-1.5 rounded-md', config.bgColor)}>
                          <Icon className={cn('h-4 w-4', config.color)} />
                        </div>
                        <span className="font-semibold">{config.label}</span>
                        <Badge variant="secondary" className="text-xs ml-auto mr-2">
                          {categoryModels.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1.5 pt-2 pb-1">
                        {categoryModels.map((model) => {
                          const isSelected = selectedModel === model.id;
                          return (
                            <Button
                              key={model.id}
                              variant={isSelected ? 'secondary' : 'ghost'}
                              className={cn(
                                'w-full justify-start min-h-[52px] h-auto py-2.5 px-3',
                                'transition-all duration-200',
                                isSelected && 'ring-2 ring-primary/20'
                              )}
                              onClick={() => handleSelect(model.id)}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium flex items-center gap-2 flex-wrap">
                                  {model.name}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-[10px] px-1.5 py-0 ${PROVIDER_COLORS[model.provider] || ''}`}
                                  >
                                    {PROVIDER_NAMES[model.provider] || model.provider}
                                  </Badge>
                                  {isSelected && (
                                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                      Active
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {model.description}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-5 w-5 shrink-0 text-primary" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileModelSelector;
