'use client';

import {useState, useEffect, useRef} from 'react';
import {User, Copy, Check, RefreshCw, Volume2, VolumeX, Download, ZoomIn, X, Maximize2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {type Message} from '@/lib/types';
import {useAuth} from '@/hooks/use-auth';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {formatDistanceToNow} from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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

// ─── Sanitize image URLs to allow only http/https/blob/data:image URIs ──────
function sanitizeImageUrl(url: string): string | null {
  if (url.startsWith('data:image/')) return url;
  try {
    const { protocol } = new URL(url);
    if (protocol === 'https:' || protocol === 'http:' || protocol === 'blob:') return url;
  } catch {
    // invalid URL
  }
  return null;
}

// ─── Inline image card with mobile-optimised lightbox + download ─────────────
function GeneratedImage({ src: rawSrc, alt }: { src: string; alt?: string }) {
  const src = sanitizeImageUrl(rawSrc);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    if (!src) return;
    e.stopPropagation();
    setDownloading(true);
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = blob.type.split('/')[1] || 'png';
      a.download = `soham-image-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  // Keyboard close
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!src) {
    return (
      <div className="my-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Image blocked: invalid or unsafe URL.
      </div>
    );
  }

  if (imgError) {
    return (
      <div className="my-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Failed to load image.{' '}
        <a href={src} target="_blank" rel="noopener noreferrer" className="underline">Open directly</a>
      </div>
    );
  }

  return (
    <>
      {/* ── Card ── */}
      <div className="not-prose group my-4 overflow-hidden rounded-xl border border-border/60 bg-muted/30 shadow-sm">
        <div
          className="relative cursor-zoom-in overflow-hidden"
          role="button"
          tabIndex={0}
          aria-label="Open image preview"
          onClick={() => setLightboxOpen(true)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt || 'Generated image'}
            className="w-full max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20 group-active:bg-black/30">
            <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Click to preview</span>
              <span className="sm:hidden">Tap to preview</span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between border-t border-border/40 bg-background/60 px-3 py-2">
          <span className="text-xs text-muted-foreground">AI Generated Image</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="sm"
              className="h-9 min-w-[2.5rem] gap-1.5 px-2 text-xs touch-manipulation"
              onClick={() => setLightboxOpen(true)}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button
              variant="ghost" size="sm"
              className="h-9 min-w-[2.5rem] gap-1.5 px-2 text-xs touch-manipulation"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{downloading ? 'Saving…' : 'Download'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top bar */}
          <div
            className="flex shrink-0 items-center justify-between px-4 pt-safe pb-2 pt-3"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-sm font-medium text-white/80">AI Generated Image</span>
            <button
              className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 active:bg-white/30 touch-manipulation"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image area — pinch-zoom works natively on mobile */}
          <div
            className="flex flex-1 items-center justify-center overflow-hidden px-3 py-2"
            onClick={() => setLightboxOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || 'Generated image'}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              style={{ touchAction: 'pinch-zoom' }}
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Bottom bar — safe area aware for notched phones */}
          <div
            className="shrink-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/70 px-4 py-3 pb-safe backdrop-blur-sm"
            onClick={e => e.stopPropagation()}
          >
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/50 underline underline-offset-2 touch-manipulation"
            >
              Open in browser
            </a>
            <Button
              size="default"
              variant="secondary"
              className="h-11 gap-2 px-6 text-sm touch-manipulation"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Saving…' : 'Download'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
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

  // Update ref directly alongside state to avoid stale closure issues
  const setIsSpeakingSync = (val: boolean) => {
    isSpeakingRef.current = val;
    setIsSpeaking(val);
  };

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
    setCopiedCode(prev => ({...prev, [index]: true}));
    setTimeout(() => setCopiedCode(prev => ({...prev, [index]: false})), 2000);
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsRegenerating(true);
      try {
        onRegenerate();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      hybridTTS.cancel();
      setIsSpeakingSync(false);
      return;
    }

    try {
      const filteredText = VoiceFilter.filterForTTS(message.content, {
        removeRepetition: true,
        normalizeText: true,
        addPauses: true,
        fixPronunciation: true,
      });

      // If filtered text is too short, try speaking the raw content stripped of markdown
      const textToSpeak = filteredText.length >= 3
        ? filteredText
        : message.content.replace(/```[\s\S]*?```/g, '').replace(/[#*_`~]/g, '').trim();

      if (textToSpeak.length < 3) {
        return;
      }

      setIsSpeakingSync(true);
      await hybridTTS.speak({
        text: textToSpeak,
        voice: 'troy',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        onEnd: () => {
          setIsSpeakingSync(false);
        },
        onError: () => {
          setIsSpeakingSync(false);
        },
      });
    } catch (error) {
      console.error('TTS error:', error);
      hybridTTS.cancel();
      setIsSpeakingSync(false);
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
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({node, ...props}) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors" />
                  ),
                  img: ({node: _node, src, alt}) => (
                    <GeneratedImage src={src || ''} alt={alt} />
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
                  ul: ({node, ...props}) => <ul className="my-4 list-disc space-y-1.5 pl-6" {...props} />,
                  ol: ({node, ...props}) => <ol className="my-4 list-decimal space-y-1.5 pl-6" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1 leading-7 marker:text-primary" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-foreground/90" {...props} />,
                  del: ({node, ...props}) => <del className="line-through text-muted-foreground/80 decoration-muted-foreground/60" {...props} />,
                  u: ({node, ...props}: any) => <u className="underline underline-offset-2 decoration-foreground/60 not-italic" {...props} />,
                  mark: ({node, ...props}: any) => <mark className="bg-yellow-200/80 dark:bg-yellow-500/30 text-foreground rounded px-0.5" {...props} />,
                  sup: ({node, ...props}: any) => <sup className="text-[0.75em] align-super" {...props} />,
                  sub: ({node, ...props}: any) => <sub className="text-[0.75em] align-sub" {...props} />,
                  small: ({node, ...props}: any) => <small className="text-[0.85em] text-muted-foreground" {...props} />,
                  kbd: ({node, ...props}: any) => <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[0.8em] font-mono shadow-sm" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 leading-7 text-foreground/95" {...props} />,
                  hr: ({node, ...props}) => <hr className="my-6 border-border/60" {...props} />,
                  h1: ({node, ...props}) => <h1 className="mt-7 mb-3 text-2xl font-bold tracking-tight text-foreground border-b border-border/50 pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-foreground" {...props} />,
                  h3: ({node, ...props}) => <h3 className="mt-5 mb-2 text-lg font-semibold text-foreground" {...props} />,
                  h4: ({node, ...props}) => <h4 className="mt-4 mb-2 text-base font-semibold text-foreground" {...props} />,
                  h5: ({node, ...props}) => <h5 className="mt-4 mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground" {...props} />,
                  h6: ({node, ...props}) => <h6 className="mt-3 mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="my-4 border-l-4 border-primary/60 bg-primary/5 px-4 py-3 italic text-foreground/90 rounded-r-lg" {...props} />
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
