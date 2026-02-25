'use client';

import {useState, useEffect, useRef} from 'react';
import {User, Copy, Check, RefreshCw} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {type Message} from '@/lib/types';
import {useAuth} from '@/hooks/use-auth';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {formatDistanceToNow} from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {MessageAttribution} from './message-attribution';
import {MessageShare} from './message-share';
import {Button} from '@/components/ui/button';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export function ChatMessage({message, onRegenerate}: ChatMessageProps) {
  const {user} = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState<{[key: string]: boolean}>({});
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeCopy = async (code: string, index: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode({...copiedCode, [index]: true});
    setTimeout(() => {
      setCopiedCode({...copiedCode, [index]: false});
    }, 2000);
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsRegenerating(true);
      try {
        await onRegenerate();
      } finally {
        setIsRegenerating(false);
      }
    }
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
              'prose-pre:my-2 prose-pre:p-0 prose-pre:bg-transparent',
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
                  img: ({node, ...props}) => (
                    <img 
                      {...props} 
                      className="max-w-full h-auto rounded-lg my-4"
                      loading="lazy"
                    />
                  ),
                  code: ({node, inline, className, children, ...props}: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    const codeIndex = `${message.id}-${codeString.substring(0, 20)}`;
                    
                    return !inline && match ? (
                      <div className="relative group my-2">
                        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border border-b-0">
                          <span className="text-xs font-medium text-muted-foreground">
                            {match[1]}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCodeCopy(codeString, codeIndex)}
                          >
                            {copiedCode[codeIndex] ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                                <span className="text-xs">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                <span className="text-xs">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="!mt-0 !rounded-t-none !rounded-b-lg border"
                          customStyle={{
                            margin: 0,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                          }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {isAssistant && (
              <div className="mt-3 pt-2 border-t border-border/50">
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

            {isAssistant && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleRegenerate}
                      disabled={isRegenerating || !onRegenerate}
                    >
                      <RefreshCw className={cn(
                        "h-3.5 w-3.5",
                        isRegenerating && "animate-spin"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRegenerating ? 'Regenerating...' : 'Regenerate response'}</p>
                  </TooltipContent>
                </Tooltip>

                <MessageShare message={message} className="h-7 w-7" />
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

