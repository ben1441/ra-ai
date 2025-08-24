'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import { ChatSidebar } from './chat-sidebar';
import { TypingIndicator } from '../ui/typing-indicator';
import { ChatInterfaceProps } from '../../types/schema';
import { MessageType, MessageStatus, ChatStatus } from '../../types/enums';

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialMessages, 
  chatSessions, 
  currentChatStatus, 
  userAvatar, 
  aiAvatar 
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [chatStatus, setChatStatus] = useState(currentChatStatus);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>('chat-1');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, chatStatus]);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      content,
      type: MessageType.USER,
      timestamp: new Date(),
      status: MessageStatus.SENT
    };

    setMessages(prev => [...prev, userMessage]);
    setChatStatus(ChatStatus.THINKING);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponses = [
        "That's a fascinating question! Let me research that for you. Based on current data and recent studies, here's what I've found:\n\n## Key Findings\n\n• **Primary research** indicates significant developments in this area\n• **Recent studies** show promising results with `95% accuracy`\n• **Industry applications** are expanding rapidly\n\n> **Note**: This analysis is based on the latest available data from peer-reviewed sources.\n\nWould you like me to dive deeper into any specific aspect?",
        "I'd be happy to help you explore that topic! Here are some key insights:\n\n### Current State\n\n• **Market trends** show exponential growth\n• **Technical challenges** are being addressed through innovative approaches\n• **Future outlook** remains highly optimistic\n\n```\nKey Metrics:\n- Growth Rate: 45% YoY\n- Market Size: $2.3B\n- Adoption Rate: 78%\n```\n\nWhat specific area would you like to explore further?",
        "Excellent point! This is an area with significant recent developments:\n\n## Recent Breakthroughs\n\n🔬 **Research Advances**: New methodologies showing **breakthrough results**\n\n📊 **Data Analysis**: Comprehensive studies reveal important patterns\n\n🚀 **Innovation**: Cutting-edge solutions emerging from top institutions\n\n> The field is evolving rapidly with new discoveries published weekly.\n\nShall I provide more detailed analysis on any particular aspect?",
        "That's a complex topic with multiple perspectives. Here's a comprehensive analysis:\n\n### Different Viewpoints\n\n1. **Academic Perspective**: Focus on theoretical foundations\n2. **Industry Perspective**: Emphasis on practical applications\n3. **Regulatory Perspective**: Concerns about compliance and ethics\n\n**Consensus Areas:**\n• Need for standardization\n• Importance of ethical considerations\n• Potential for significant impact\n\nWould you like me to elaborate on any specific perspective?",
        "Great question! I've analyzed recent publications and data sources:\n\n## Research Summary\n\n📚 **Literature Review**: 150+ papers analyzed from top-tier journals\n\n📈 **Trend Analysis**: Clear patterns emerging in the data\n\n🎯 **Key Insights**:\n• **Methodology improvements** leading to better outcomes\n• **Cross-disciplinary collaboration** driving innovation\n• **Real-world applications** showing measurable impact\n\n```markdown\n# Quick Stats\n- Papers reviewed: 150+\n- Time period: Last 24 months\n- Confidence level: High\n```\n\nWhat specific aspect interests you most?"
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        type: MessageType.AI,
        timestamp: new Date(),
        status: MessageStatus.DELIVERED
      };

      setMessages(prev => [...prev, aiMessage]);
      setChatStatus(ChatStatus.IDLE);
    }, 2000);
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false);
    // In a real app, you would load messages for this session
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setChatStatus(ChatStatus.IDLE);
    setSidebarOpen(false);
  };

  const handleCopyMessage = () => {
    // Show a toast or notification that message was copied
    console.log('Message copied to clipboard');
  };

  return (
  <div className="min-h-screen w-full relative bg-black">
    {/* X Organizations Black Background with Top Glow */}
    <div
      className="fixed inset-0 z-0"
      style={{
       background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
      }}
    />
  
    <div className="h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="fixed z-10 hidden lg:block w-80 h-full">
        <ChatSidebar
          sessions={chatSessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <ChatSidebar
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
          />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full lg:ml-80">
        {/* Header */}
        <Card className="p-4 border-b border-border bg-card flex items-center gap-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Bars3CenterLeftIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          
          <div className="flex-1">
            <h1 className="text-heading-md text-foreground">
              Research Assistant
            </h1>
            <p className="text-body-sm text-muted-foreground">
              How can I help you with your research today?
            </p>
          </div>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-heading-lg text-foreground mb-2">
                      Welcome to your Research Assistant
                    </h2>
                    <p className="text-body-md text-muted-foreground">
                      Start a conversation by typing your research question below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isUser={message.type === MessageType.USER}
                      avatar={message.type === MessageType.USER ? userAvatar : aiAvatar}
                      onCopy={handleCopyMessage}
                    />
                  ))}
                  
                  {chatStatus === ChatStatus.THINKING && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        AI
                      </div>
                      <TypingIndicator />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={chatStatus === ChatStatus.THINKING}
                placeholder="Ask me anything about your research..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};