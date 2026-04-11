'use client';

import { SohamLoader } from '@/components/soham-loader';

interface ThinkingAnimationProps {
  modelName?: string;
}

export function ThinkingAnimation({ modelName }: ThinkingAnimationProps) {
  const label = modelName ? `${modelName} is thinking…` : 'Thinking…';
  return (
    <div className="py-3">
      <SohamLoader variant="inline" size={32} label={label} />
    </div>
  );
}
