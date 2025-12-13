
'use client';

import {type Chat, type Settings, type Message} from '@/lib/types';
import {ChatInput} from '@/components/chat/chat-input';
import {ChatMessages} from '@/components/chat/chat-messages';
import {ExamplePrompts} from '@/components/chat/example-prompts';
import {useState, useRef, useEffect, useCallback} from 'react';
import {generateResponse} from '@/app/actions';
import {useAuth} from '@/hooks/use-auth';
import {browserTTS} from '@/lib/browser-tts';

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
      if (!response) {
        assistantContent = 'Sorry, I encountered an error processing your request. Please try again.';
      } else if ('error' in response) {
        assistantContent = response.error;
      } else {
        assistantContent = response.content;
      }

      addMessage(chat.id, {role: 'assistant', content: assistantContent});
      setIsLoadingFromAI(false);

      if (settingsRef.current.enableSpeech && assistantContent) {
        // Use browser's Web Speech API (free, no API key required)
        if (!browserTTS.isAvailable()) {
          console.error('Speech synthesis not supported in this browser');
          return;
        }

        setIsSpeaking(true);
        browserTTS.speak({
          text: assistantContent,
          voice: settingsRef.current.voice,
          onStart: () => {
            console.log('Speech started');
          },
          onEnd: () => {
            setIsSpeaking(false);
          },
          onError: (error: string) => {
            console.error('Speech error:', error);
            setIsSpeaking(false);
          },
        });
      }
    },
    [isLoading, user, messages, addMessage, chat.id]
  );

  useEffect(() => {
    // Load voices when they're available
    const voices = browserTTS.getVoices();
    if (voices.length === 0) {
      // Wait for voices to load
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          browserTTS.getVoices();
        };
      }
    }
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
      />

      {messages.length <= 1 && (
        <ExamplePrompts onSendMessage={handleSendMessage} />
      )}

      <div className="border-t bg-background px-4 py-2 md:py-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
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
