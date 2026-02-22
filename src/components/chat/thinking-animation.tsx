'use client';

import { useEffect, useState } from 'react';

interface ThinkingAnimationProps {
  modelName?: string;
}

export function ThinkingAnimation({ modelName }: ThinkingAnimationProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 py-4">
      {/* Professional pulsing dots animation */}
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-muted-foreground font-medium">
        {modelName ? `${modelName} is thinking` : 'AI is thinking'}
        {dots}
      </span>
    </div>
  );
}
