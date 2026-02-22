'use client';

import {useState, useEffect, useCallback, useMemo} from 'react';
import {useLocalStorage} from './use-local-storage';
import {type Chat, type Message} from '@/lib/types';
import {useAuth} from './use-auth';

const getUserStorageKey = (userId: string, key: string) => `${userId}_${key}`;

export function useChatHistory() {
  const {user} = useAuth();
  const userId = user?.uid;

  // Memoize initial values to prevent re-renders in useLocalStorage
  const initialChats = useMemo(() => [], []);
  const initialMessages = useMemo(() => ({}), []);

  const [chats, setChats] = useLocalStorage<Chat[]>(
    userId ? getUserStorageKey(userId, 'chats') : 'fallback_chats',
    initialChats
  );
  const [messages, setMessages] = useLocalStorage<Record<string, Message[]>>(
    userId ? getUserStorageKey(userId, 'messages') : 'fallback_messages',
    initialMessages
  );

  const [activeChatId, setActiveChatId] = useState<string>('');

  const createNewChat = useCallback(() => {
    const ownerId = userId ?? 'guest';

    const newChat: Chat = {
      id: crypto.randomUUID(),
      userId: ownerId,
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'How can I help you today?',
      createdAt: new Date().toISOString(),
    };

    // Prepend to chats array
    setChats(prevChats => [newChat, ...prevChats]);
    setMessages(prevMessages => ({
      ...prevMessages,
      [newChat.id]: [initialMessage],
    }));
    setActiveChatId(newChat.id);
  }, [userId, setChats, setMessages]);

  // When chats load or change, set the active chat
  useEffect(() => {
    if (chats && chats.length > 0) {
      // Ensure active chat is valid, otherwise default to the first one.
      const activeChatExists = chats.some(c => c.id === activeChatId);
      if (!activeChatExists) {
        // sort by `updatedAt` to ensure the most recent is first.
        const sortedChats = [...chats].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setActiveChatId(sortedChats[0].id);
      }
    } else if (chats.length === 0) {
      // If there are no chats for the user (or guest), create a new one.
      createNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, activeChatId, userId, createNewChat]);

  const deleteAllUserChats = useCallback(() => {
    setChats([]);
    setMessages({});
  }, [setChats, setMessages]);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats(prev => prev.filter(c => c.id !== chatId));
      setMessages(prev => {
        const copy = {...prev};
        delete copy[chatId];
        return copy;
      });
      // If the active chat was deleted, clear it so the layout can handle creating a new one
      setActiveChatId(prev => (prev === chatId ? '' : prev));
    },
    [setChats, setMessages]
  );

  const renameChat = useCallback(
    (chatId: string, newTitle: string) => {
      setChats(prev =>
        prev.map(chat => (chat.id === chatId ? {...chat, title: newTitle} : chat))
      );
    },
    [setChats]
  );

  const exportChat = useCallback(
    (chatId: string) => {
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return null;
      const chatMessages = messages[chatId] || [];
      return {
        chat,
        messages: chatMessages,
      };
    },
    [chats, messages]
  );

  const addMessage = useCallback(
    (
      chatId: string,
      message: Omit<Message, 'id' | 'createdAt'>,
      newTitle?: string
    ) => {
      const newMessage: Message = {
        ...message,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));

      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                title: newTitle ?? chat.title,
                updatedAt: new Date().toISOString(),
              }
            : chat
        )
      );
    },
    [setChats, setMessages]
  );

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatMessages = messages[activeChatId] || [];

  return {
    chats: chats.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ), // Always return sorted chats
    activeChat,
    activeChatId,
    setActiveChatId,
    activeChatMessages,
    createNewChat,
    deleteAllUserChats,
    addMessage,
    deleteChat,
    renameChat,
    exportChat,
  };
}
