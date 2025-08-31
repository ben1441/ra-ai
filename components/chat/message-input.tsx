'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowUturnUpIcon } from '@heroicons/react/24/outline';
import { MessageInputProps } from '../../types/schema';

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <Card className="p-2 sm:p-4 bg-card border-border">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 items-end">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            enterKeyHint="send"
            aria-label="Message input"
            className="min-h-[44px] max-h-[120px] resize-none bg-chat-input-bg border-border text-foreground placeholder:text-muted-foreground"
            rows={1}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="h-10 w-10 sm:h-11 sm:w-11 p-0 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <ArrowUturnUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </form>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Press Enter to send, Shift + Enter for new line
      </div>
    </Card>
  );
};