'use client';

import React from 'react';
import { ChatInterface } from '../components/chat/chat-interface';
import { mockRootProps } from '../data/chatMockData';

export default function ChatAIPage() {
  return (
    <div className="w-full min-h-dvh">
      <ChatInterface {...mockRootProps} />
    </div>
  );
}