import { MessageType, ChatStatus } from '../types/enums';

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatMessageType = (type: MessageType): string => {
  switch (type) {
    case MessageType.USER:
      return 'You';
    case MessageType.AI:
      return 'AI Assistant';
    case MessageType.SYSTEM:
      return 'System';
    default:
      return 'Unknown';
  }
};

export const formatChatStatus = (status: ChatStatus): string => {
  switch (status) {
    case ChatStatus.TYPING:
      return 'AI is typing...';
    case ChatStatus.THINKING:
      return 'AI is thinking...';
    case ChatStatus.ERROR:
      return 'Something went wrong';
    default:
      return '';
  }
};