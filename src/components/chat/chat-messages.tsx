'use client';

import {useEffect, useRef} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {type Message} from '@/lib/types';
import {ChatMessage} from './chat-message';
import {ThinkingAnimation} from './thinking-animation';

interface ChatMessagesProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  isLoading?: boolean;
  header?: React.ReactNode;
  onRegenerateMessage?: (messageId: string) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  className,
  header,
  onRegenerateMessage,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    // Auto-scroll when new messages are added or loading state changes
    if (viewportRef.current) {
      const shouldScroll = messages.length > prevMessagesLengthRef.current || isLoading;
      
      if (shouldScroll) {
        // Smooth scroll to bottom
        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className={cn('w-full', className)} ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8" ref={viewportRef}>
        {header}
        <div className="space-y-6 md:space-y-8">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              onRegenerate={
                message.role === 'assistant' && index === messages.length - 1 && onRegenerateMessage
                  ? () => onRegenerateMessage(message.id)
                  : undefined
              }
            />
          ))}
          {isLoading && <ThinkingAnimation />}
        </div>
      </div>
    </ScrollArea>
  );
}
