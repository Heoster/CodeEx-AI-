'use client';

import {type Chat, type Settings, type Message} from '@/lib/types';
import {ChatInput} from '@/components/chat/chat-input';
import {ChatMessages} from '@/components/chat/chat-messages';
import {ExamplePrompts} from '@/components/chat/example-prompts';
import {useState, useRef, useEffect, useCallback} from 'react';
import {generateResponse} from '@/app/actions';
import {useAuth} from '@/hooks/use-auth';
import {hybridTTS} from '@/lib/hybrid-tts';
import {VoiceFilter} from '@/lib/voice-filter';

interface ChatPanelProps {
  chat: Chat;
  settings: Settings;
  messages: Message[];
  addMessage: (
    chatId: string,
    message: Omit<Message, 'id' | 'createdAt'>,
    newTitle?: string
  ) => void;
}

export function ChatPanel({
  chat,
  settings,
  messages,
  addMessage,
}: ChatPanelProps) {
  const [isLoadingFromAI, setIsLoadingFromAI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {user} = useAuth();

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const isLoading = isLoadingFromAI || isSpeaking;

  const handleSendMessage = useCallback(
    async (messageContent: string) => {
      if (isLoading || !user) return;
      setIsLoadingFromAI(true);

      console.log('[ChatPanel] Current settings:', settingsRef.current);
      console.log('[ChatPanel] Selected model:', settingsRef.current.model);

      const isNewChat = messages.length <= 1;
      const newTitle = isNewChat
        ? messageContent.substring(0, 30) +
          (messageContent.length > 30 ? '...' : '')
        : undefined;

      addMessage(
        chat.id,
        {role: 'user', content: messageContent},
        newTitle
      );

      // We map the full message history to the simplified format expected by the AI flow.
      // This ensures we only send the `role` and `content`, preventing validation errors.
      // Filter out any leading assistant messages (like the welcome greeting) since
      // Google's API requires the conversation to start with a user message.
      const historyMessages = messages.map(({role, content}) => ({role, content}));
      const firstUserIndex = historyMessages.findIndex(m => m.role === 'user');
      const filteredHistory = firstUserIndex >= 0 
        ? historyMessages.slice(firstUserIndex) 
        : [];
      
      const updatedHistory = [
        ...filteredHistory,
        {role: 'user' as const, content: messageContent},
      ];

      const response = await generateResponse({
        message: messageContent,
        history: updatedHistory,
        settings: settingsRef.current,
      });

      let assistantContent = '';
      let modelUsed: string | undefined;
      let autoRouted: boolean | undefined;
      
      if (!response) {
        assistantContent = 'Sorry, I encountered an error processing your request. Please try again.';
      } else if ('error' in response) {
        assistantContent = response.error;
      } else {
        assistantContent = response.content;
        modelUsed = response.modelUsed;
        autoRouted = response.autoRouted;
      }

      addMessage(chat.id, {
        role: 'assistant', 
        content: assistantContent,
        modelUsed,
        autoRouted,
      });
      setIsLoadingFromAI(false);

      // STEP 7: Extract and store memories asynchronously (don't wait)
      if (user?.uid && assistantContent) {
        fetch('/api/extract-memories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: messageContent,
            assistantResponse: assistantContent,
            userId: user.uid,
          }),
        }).catch(error => {
          console.error('[Memory Extraction] Failed:', error);
        });
      }

      if (settingsRef.current.enableSpeech && assistantContent) {
        setIsSpeaking(true);
        
        // Use Voice Filter to clean and optimize text for TTS
        const filteredText = VoiceFilter.filterForTTS(assistantContent, {
          removeRepetition: true,
          normalizeText: true,
          addPauses: true,
          fixPronunciation: true,
        });
        
        // Log filtering stats for debugging
        const stats = VoiceFilter.getStats(assistantContent);
        console.log('[Voice Filter] Stats:', stats);
        
        // Skip if text is too short or empty after filtering
        if (filteredText.length < 3) {
          console.log('[Voice Filter] Text too short after filtering');
          setIsSpeaking(false);
          return;
        }
        
        // Map voice names to TTS voices
        const voiceMap: {[key: string]: string} = {
          'Algenib': 'en-US-AriaNeural',
          'Enceladus': 'en-US-GuyNeural',
          'Achernar': 'en-US-JennyNeural',
          'Heka': 'en-IN-NeerjaNeural',
        };
        
        const selectedVoice = voiceMap[settingsRef.current.voice] || settingsRef.current.voice || 'en-US-AriaNeural';
        
        // Use Hybrid TTS with automatic fallback
        // Chain: Groq Orpheus → ElevenLabs → Browser TTS
        hybridTTS.speak({
          text: filteredText,
          voice: selectedVoice,
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          onStart: () => {
            console.log('[Chat] TTS started');
          },
          onEnd: () => {
            console.log('[Chat] TTS ended');
            setIsSpeaking(false);
          },
          onError: (error) => {
            console.error('[Chat] TTS error:', error);
            setIsSpeaking(false);
          },
        });
      }
    },
    [isLoading, user, messages, addMessage, chat.id]
  );

  const stopSpeaking = useCallback(() => {
    // Stop hybrid TTS
    hybridTTS.cancel();
    
    // Also stop any audio element (legacy support)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const handleRegenerateMessage = useCallback(
    async (messageId: string) => {
      if (isLoading || !user) return;

      // Find the message to regenerate
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1 || messageIndex === 0) return;

      // Get the previous user message
      const userMessage = messages[messageIndex - 1];
      if (!userMessage || userMessage.role !== 'user') return;

      // Regenerate the response
      setIsLoadingFromAI(true);

      try {
        const response = await generateResponse({
          message: userMessage.content,
          history: messages.slice(0, messageIndex).map(m => ({
            role: m.role,
            content: m.content,
          })),
          settings: settingsRef.current,
        });

        let assistantContent = '';
        let modelUsed: string | undefined;
        let autoRouted: boolean | undefined;
        
        if (typeof response === 'string') {
          assistantContent = response;
        } else if (response && typeof response === 'object' && 'content' in response) {
          assistantContent = response.content;
          if ('modelUsed' in response) modelUsed = response.modelUsed;
          if ('autoRouted' in response) autoRouted = response.autoRouted;
        }

        // Replace the old message with the new one
        addMessage(chat.id, {
          role: 'assistant', 
          content: assistantContent,
          modelUsed,
          autoRouted,
        });
      } catch (error) {
        console.error('Failed to regenerate message:', error);
      } finally {
        setIsLoadingFromAI(false);
      }
    },
    [isLoading, user, messages, chat.id, addMessage]
  );

  useEffect(() => {
    return () => {
      // Cleanup: stop any ongoing speech when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const greetingHeader =
    messages.length <= 1 && user ? (
      <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Hello, {user.displayName}!</h1>
      </div>
    ) : null;

  return (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col">
      <ChatMessages
        messages={messages}
        isLoading={isLoadingFromAI}
        className="flex-1"
        header={greetingHeader}
        onRegenerateMessage={handleRegenerateMessage}
      />

      {messages.length <= 1 && (
        <ExamplePrompts onSendMessage={handleSendMessage} />
      )}

      <div className="border-t bg-background px-4 py-2 md:py-4">
        {isSpeaking && (
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Speaking...</span>
              <button
                onClick={stopSpeaking}
                className="ml-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} userId={user?.uid} />
        <div className="px-2 pt-2 text-center text-xs text-muted-foreground">
          <p>
            Try commands like{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-semibold">
              /solve
            </code>{' '}
            or{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-semibold">
              /summarize
            </code>
            .
          </p>
          <p>CodeEx powered by Heoster.</p>
        </div>
      </div>
    </div>
  );
}
