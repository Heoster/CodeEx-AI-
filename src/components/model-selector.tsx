'use client';

/**
 * Model Selector Component
 * A dropdown selector for AI models on desktop
 * Dynamically loads available models from the model registry
 */

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Code, Calculator, MessageCircle, Image as ImageIcon } from 'lucide-react';
import type { ModelId, ModelCategory } from '@/lib/types';
import { useMemo } from 'react';
import modelsConfigData from '@/lib/models-config.json';

interface ModelSelectorProps {
  value: 'auto' | ModelId;
  onValueChange: (value: 'auto' | ModelId) => void;
}

// Load models from configuration
const MODELS: Array<{
  id: 'auto' | ModelId;
  name: string;
  category: ModelCategory | 'auto';
  description: string;
}> = [
  { id: 'auto', name: 'Auto (Smart Routing)', category: 'auto', description: 'Automatically select the best model' },
  // Dynamically load from models-config.json
  ...modelsConfigData.models
    .filter(model => model.enabled)
    .map(model => ({
      id: model.id as ModelId,
      name: model.name,
      category: model.category as ModelCategory,
      description: model.description,
    })),
];

// Group models by category
const groupedModels = MODELS.reduce((acc, model) => {
  const category = model.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(model);
  return acc;
}, {} as Record<string, typeof MODELS>);

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const selectedModel = MODELS.find(m => m.id === value);
  
  return (
    <Select value={value} onValueChange={onValueChange as (value: string) => void}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select model">
          {selectedModel?.name || 'Select model'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {/* Auto option */}
        <SelectGroup>
          <SelectItem value="auto" className="py-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">Auto (Smart Routing)</div>
                <div className="text-xs text-muted-foreground">
                  Automatically select the best model
                </div>
              </div>
            </div>
          </SelectItem>
        </SelectGroup>
        
        {/* General Models */}
        {groupedModels.general && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              General
            </SelectLabel>
            {groupedModels.general.map(model => (
              <SelectItem key={model.id} value={model.id} className="py-2">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {/* Coding Models */}
        {groupedModels.coding && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Coding
            </SelectLabel>
            {groupedModels.coding.map(model => (
              <SelectItem key={model.id} value={model.id} className="py-2">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {/* Math Models */}
        {groupedModels.math && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Math
            </SelectLabel>
            {groupedModels.math.map(model => (
              <SelectItem key={model.id} value={model.id} className="py-2">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {/* Conversation Models */}
        {groupedModels.conversation && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Conversation
            </SelectLabel>
            {groupedModels.conversation.map(model => (
              <SelectItem key={model.id} value={model.id} className="py-2">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        
        {/* Multimodal Models */}
        {groupedModels.multimodal && (
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Multimodal
            </SelectLabel>
            {groupedModels.multimodal.map(model => (
              <SelectItem key={model.id} value={model.id} className="py-2">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}

export default ModelSelector;
