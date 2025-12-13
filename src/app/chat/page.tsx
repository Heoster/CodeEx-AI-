'use client';

import {ChatLayout} from '@/components/chat/chat-layout';
import {ProtectedRoute} from '@/hooks/use-auth';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatLayout />
    </ProtectedRoute>
  );
}
