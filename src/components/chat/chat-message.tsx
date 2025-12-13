'use client';

import {useState, useEffect} from 'react';
import {User, Copy, Check} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {type Message} from '@/lib/types';
import {useAuth} from '@/hooks/use-auth';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {formatDistanceToNow} from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {MessageAttribution} from './message-attribution';
import {Button} from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({message}: ChatMessageProps) {
  const {user} = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) {
    return null;
  }
  
  const displayTimestamp = message.createdAt
  ? formatDistanceToNow(new Date(message.createdAt), {addSuffix: true})
  : '';

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          'group flex items-start gap-3 md:gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500',
          !isAssistant && 'flex-row-reverse'
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar
              className={cn(
                'h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all',
                isAssistant ? 'bg-primary ring-primary/20' : 'bg-accent ring-accent/20'
              )}
            >
              {isAssistant ? (
                <>
                  <AvatarImage src="/favicon.ico" alt="CODEEX AI" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    C
                  </AvatarFallback>
                </>
              ) : (
                <>
                  <AvatarImage
                    src={user?.photoURL ?? ''}
                    alt={user?.displayName ?? 'User'}
                  />
                  <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                    {user?.displayName ? (
                      user.displayName.charAt(0).toUpperCase()
                    ) : (
                      <User size={20} />
                    )}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side={isAssistant ? 'right' : 'left'}>
            <p>{isAssistant ? 'CODEEX AI' : user?.displayName ?? 'You'}</p>
          </TooltipContent>
        </Tooltip>

        <div className={cn('flex flex-col gap-2 max-w-[85%] md:max-w-[80%]', !isAssistant && 'items-end')}>
          <div
            className={cn(
              'relative rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md',
              isAssistant
                ? 'bg-muted text-foreground rounded-tl-sm'
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            )}
          >
            <div className={cn(
              'prose prose-sm dark:prose-invert max-w-none',
              'prose-p:my-1 prose-p:leading-relaxed',
              'prose-pre:my-2 prose-pre:bg-background/50 prose-pre:border',
              'prose-code:text-sm prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              'prose-headings:mt-3 prose-headings:mb-2',
              'prose-ul:my-2 prose-ol:my-2',
              !isAssistant && 'prose-invert'
            )}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                components={{
                  a: ({node, ...props}) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {isAssistant && (
              <div className="mt-2">
                <MessageAttribution
                  modelUsed={message.modelUsed}
                  modelCategory={message.modelCategory}
                  autoRouted={message.autoRouted}
                />
              </div>
            )}
          </div>

          <div className={cn(
            'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
            !isAssistant && 'flex-row-reverse'
          )}>
            {displayTimestamp && (
              <span className="text-xs text-muted-foreground px-2">
                {displayTimestamp}
              </span>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy message'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

