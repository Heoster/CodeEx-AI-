'use client';

import {useForm, type SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Send, Mic} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {useEffect, useRef, useState} from 'react';
import {cn} from '@/lib/utils';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({onSendMessage, isLoading}: ChatInputProps) {
  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });

  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const SpeechRecognition =
      window.webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported by this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      playSound();
      setIsListening(true);
    };

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onSendMessage(transcript);
      }
    };

    recognition.onerror = event => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.abort();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [onSendMessage]);

  useEffect(() => {
    if (isVoiceChatActive && !isLoading && !isListening) {
      // Only start if recognition exists and is not already running
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Only log if it's not the expected "already started" error
          if (e instanceof Error && !e.message.includes('already')) {
            console.error('Speech recognition error:', e);
          }
        }
      }
    } else if (!isVoiceChatActive || isLoading) {
      // Safely abort if recognition is active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
    }
  }, [isVoiceChatActive, isLoading, isListening]);

  const handleVoiceButtonClick = () => {
    setIsVoiceChatActive(prev => !prev);
  };

  const onSubmit: SubmitHandler<ChatFormValues> = data => {
    onSendMessage(data.message);
    form.reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full items-start gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({field}) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder={
                      isVoiceChatActive
                        ? 'Voice chat is active...'
                        : 'Ask me anything...'
                    }
                    rows={1}
                    className={cn(
                      'max-h-36 resize-none pr-24 text-sm md:text-base py-3 md:py-4 pl-4 rounded-2xl',
                      'border-2 focus-visible:ring-2 focus-visible:ring-primary/20',
                      'transition-all duration-200',
                      isVoiceChatActive && 'border-destructive'
                    )}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isVoiceChatActive}
                    {...field}
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant={isVoiceChatActive ? 'destructive' : 'ghost'}
                      className={cn(
                        'h-9 w-9 rounded-xl transition-all',
                        isListening && 'animate-pulse scale-110'
                      )}
                      disabled={!recognitionRef.current}
                      onClick={handleVoiceButtonClick}
                      aria-pressed={isVoiceChatActive}
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">
                        {isVoiceChatActive ? 'Stop voice chat' : 'Start voice chat'}
                      </span>
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9 rounded-xl shadow-sm"
                      disabled={isLoading || !form.formState.isValid || isVoiceChatActive}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}