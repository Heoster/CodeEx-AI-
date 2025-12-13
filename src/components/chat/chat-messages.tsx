'use client';

import {useEffect, useRef} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {type Message} from '@/lib/types';
import {ChatMessage} from './chat-message';
import {Skeleton} from '../ui/skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {Loader2} from 'lucide-react';

interface ChatMessagesProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  isLoading?: boolean;
  header?: React.ReactNode;
}

export function ChatMessages({
  messages,
  isLoading,
  className,
  header,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className={cn('w-full', className)} ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8" ref={viewportRef}>
        {header}
        <div className="space-y-6 md:space-y-8">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 md:gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background bg-primary">
                <AvatarImage src="/favicon.ico" alt="CODEEX AI" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3 pt-1">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-muted/50" />d
                  <Skeleton className="h-4 w-full bg-muted/50" />
                  <Skeleton className="h-4 w-5/6 bg-muted/50" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-2 w-2 rounded-full bg-primary/30 animate-pulse" />
                  <Skeleton className="h-2 w-2 rounded-full bg-primary/30 animate-pulse [animation-delay:0.2s]" />
                  <Skeleton className="h-2 w-2 rounded-full bg-primary/30 animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
