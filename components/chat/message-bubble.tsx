'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Square2StackIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { MessageBubbleProps } from '../../types/schema';
import { formatTimestamp } from '../../utils/formatters';
import { MessageType } from '../../types/enums';
import { MarkdownRenderer } from '../ui/markdown-renderer';

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser, 
  avatar, 
  onCopy 
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.();
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={avatar} alt={isUser ? 'User' : 'AI'} />
        <AvatarFallback className="text-xs">
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`p-4 transition-smooth ${
          isUser 
            ? 'bg-chat-user-bg text-chat-user-text border-none' 
            : 'bg-chat-ai-bg text-chat-ai-text border-border'
        }`}>
          {message.type === MessageType.AI ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <div className="text-body-md whitespace-pre-wrap">{message.content}</div>
          )}
        </Card>
        
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
          
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                  >
                    <Square2StackIcon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <EllipsisHorizontalIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isUser ? 'end' : 'start'}>
                <DropdownMenuItem onClick={handleCopy}>
                  <Square2StackIcon className="h-4 w-4 mr-2" />
                  Copy message
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export conversation
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};