// Chat message types and status enums
export enum MessageType {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  ERROR = 'error'
}

export enum ChatStatus {
  IDLE = 'idle',
  TYPING = 'typing',
  THINKING = 'thinking',
  ERROR = 'error'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}