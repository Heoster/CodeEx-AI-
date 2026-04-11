'use client';

import {useState, useEffect, useRef} from 'react';
import {User, Copy, Check, RefreshCw, Volume2, VolumeX} from 'lucide-react';
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
import {hybridTTS} from '@/lib/hybrid-tts';
import {VoiceFilter} from '@/lib/voice-filter';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    return () => {
      if (isSpeakingRef.current) {
        hybridTTS.cancel();
      }
    };
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

  const handleSpeak = async () => {
    if (isSpeaking) {
      hybridTTS.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      const filteredText = VoiceFilter.filterForTTS(message.content, {
        removeRepetition: true,
        normalizeText: true,
        addPauses: true,
        fixPronunciation: true,
      });

      if (filteredText.length < 3) {
        return;
      }

      setIsSpeaking(true);
      await hybridTTS.speak({
        text: filteredText,
        voice: 'troy',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        onEnd: () => {
          setIsSpeaking(false);
        },
        onError: () => {
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      hybridTTS.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isMounted) {
    return null;
  }
  
  const displayTimestamp = message.createdAt
  ? formatDistanceToNow(new Date(message.createdAt), {addSuffix: true})
  : '';

  const renderMarkdownCode = ({inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const codeIndex = `${message.id}-${codeString.substring(0, 20)}`;
    const language = match?.[1]?.toLowerCase();

    if (!inline && language === 'mermaid') {
      return (
        <div className="my-4 overflow-hidden rounded-xl border border-border/70 bg-background/70">
          <div className="border-b border-border/70 bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Diagram
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-6 text-foreground">
            <code {...props}>{codeString}</code>
          </pre>
        </div>
      );
    }
    
    return !inline && match ? (
      <div className="relative group my-4 overflow-hidden rounded-xl border border-border/70 bg-background/70">
        <div className="flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {match[1]}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={() => handleCodeCopy(codeString, codeIndex)}
          >
            {copiedCode[codeIndex] ? (
              <>
                <Check className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-xs">Copied</span>
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
          className="!mt-0 !rounded-none !border-0"
          customStyle={{
            margin: 0,
            background: 'transparent',
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={cn('rounded bg-background/60 px-1.5 py-0.5 text-[0.92em]', className)} {...props}>
        {children}
      </code>
    );
  };

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
                  <AvatarImage src="/FINALSOHAM.png" alt="SOHAM" />
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
            <p>{isAssistant ? 'SOHAM' : user?.displayName ?? 'You'}</p>
          </TooltipContent>
        </Tooltip>

        <div className={cn('flex min-w-0 flex-col gap-2 max-w-[90%] sm:max-w-[86%] lg:max-w-[78%]', !isAssistant && 'items-end')}>
          <div
            className={cn(
              'relative w-full rounded-2xl px-3 py-3 shadow-sm transition-all hover:shadow-md md:px-4',
              isAssistant
                ? 'bg-muted text-foreground rounded-tl-sm'
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            )}
          >
            <div className={cn(
              'prose prose-sm dark:prose-invert max-w-none',
              'prose-p:my-3 prose-p:leading-7',
              'prose-pre:my-4 prose-pre:p-0 prose-pre:bg-transparent',
              'prose-code:text-sm prose-code:bg-transparent prose-code:px-0 prose-code:py-0 prose-code:rounded-none',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              'prose-headings:mt-5 prose-headings:mb-3 prose-headings:scroll-mt-20',
              'prose-headings:font-semibold',
              'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
              'prose-ul:my-4 prose-ol:my-4',
              'prose-li:my-1.5 prose-li:leading-7',
              'prose-strong:font-semibold prose-strong:text-foreground',
              'prose-blockquote:my-4 prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-primary/5 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:text-foreground',
              'prose-hr:my-6 prose-hr:border-border/70',
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
                  code: ({node, inline, className, children, ...props}: any) =>
                    renderMarkdownCode({inline, className, children, ...props}),
                  table: ({node, ...props}) => (
                    <div className="not-prose my-5 overflow-x-auto rounded-xl border border-border/60 shadow-sm">
                      <table className="w-full border-collapse text-sm" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => (
                    <thead className="bg-primary/10 border-b-2 border-primary/20" {...props} />
                  ),
                  tbody: ({node, ...props}) => (
                    <tbody className="divide-y divide-border/50" {...props} />
                  ),
                  tr: ({node, ...props}) => (
                    <tr
                      className="transition-colors even:bg-muted/30 hover:bg-primary/5"
                      {...props}
                    />
                  ),
                  th: ({node, ...props}) => (
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-primary/80 border-r border-primary/10 last:border-r-0 whitespace-nowrap"
                      {...props}
                    />
                  ),
                  td: ({node, ...props}) => (
                    <td
                      className="px-4 py-3 align-top leading-6 text-foreground/90 border-r border-border/30 last:border-r-0"
                      {...props}
                    />
                  ),
                  ul: ({node, ...props}) => <ul className="my-4 list-disc space-y-2 pl-6" {...props} />,
                  ol: ({node, ...props}) => <ol className="my-4 list-decimal space-y-2 pl-6" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1 marker:text-primary" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 leading-7" {...props} />,
                  h1: ({node, ...props}) => <h1 className="mt-6 mb-3 text-2xl font-semibold tracking-tight" {...props} />,
                  h2: ({node, ...props}) => <h2 className="mt-6 mb-3 text-xl font-semibold tracking-tight" {...props} />,
                  h3: ({node, ...props}) => <h3 className="mt-5 mb-2 text-lg font-semibold tracking-tight" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="my-4 border-l-4 border-primary/60 bg-primary/5 px-4 py-3 italic text-foreground/90" {...props} />
                  ),
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
            'flex flex-wrap items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity',
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
                      onClick={handleSpeak}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-3.5 w-3.5 text-primary animate-pulse" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSpeaking ? 'Stop speaking' : 'Speak message'}</p>
                  </TooltipContent>
                </Tooltip>

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
