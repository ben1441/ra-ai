import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  );
};