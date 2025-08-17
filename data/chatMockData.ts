import { MessageType, MessageStatus, ChatStatus } from '../types/enums';

// Mock chat messages for preview
export const mockMessages = [
  {
    id: '1',
    content: 'Hello! I need help researching the latest developments in artificial intelligence.',
    type: MessageType.USER as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: MessageStatus.DELIVERED as const
  },
  {
    id: '2',
    content: 'I\'d be happy to help you research AI developments! Here are some key areas I can explore for you:\n\n• **Large Language Models**: Recent breakthroughs in GPT-4, Claude, and other foundation models\n• **Multimodal AI**: Integration of text, image, and video understanding\n• **AI Safety & Alignment**: Current research on making AI systems more reliable\n• **Industry Applications**: How companies are implementing AI solutions\n\n> **Note**: I can provide detailed analysis with citations and recent papers for any of these areas.\n\nWhich area interests you most, or would you like me to provide a comprehensive overview?',
    type: MessageType.AI as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    status: MessageStatus.DELIVERED as const
  },
  {
    id: '3',
    content: 'Can you focus on multimodal AI and recent breakthroughs?',
    type: MessageType.USER as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    status: MessageStatus.DELIVERED as const
  },
  {
    id: '4',
    content: 'Excellent choice! Multimodal AI has seen remarkable progress recently. Here\'s what I\'ve found:\n\n## Recent Breakthroughs\n\n🔬 **GPT-4V & Vision Models**: Advanced image understanding capabilities that can analyze complex visual scenes\n\n🎥 **Video Generation**: Models like Sora creating realistic video content from text descriptions\n\n🎵 **Audio-Visual Integration**: AI systems that can understand speech, music, and visual context simultaneously\n\n### Key Research Areas\n\n• **Cross-modal learning and representation**: How models learn to connect different types of data\n• **Real-time multimodal processing**: Processing multiple data types simultaneously\n• **Embodied AI for robotics**: AI that can interact with the physical world\n\n```python\n# Example: Simple multimodal processing\nclass MultimodalModel:\n    def process(self, text, image, audio):\n        # Combine different modalities\n        return self.fusion_layer([text_features, image_features, audio_features])\n```\n\n> **Research Tip**: The field is moving towards unified architectures that can handle any combination of modalities seamlessly.\n\nWould you like me to dive deeper into any specific aspect or find recent papers on this topic?',
    type: MessageType.AI as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    status: MessageStatus.DELIVERED as const
  }
];

// Mock chat sessions for sidebar
export const mockChatSessions = [
  {
    id: 'chat-1',
    title: 'AI Research Discussion',
    lastMessage: 'Multimodal AI breakthroughs...',
    timestamp: new Date(),
    messageCount: 4
  },
  {
    id: 'chat-2',
    title: 'Climate Change Data',
    lastMessage: 'Latest IPCC reports...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messageCount: 12
  },
  {
    id: 'chat-3',
    title: 'Quantum Computing',
    lastMessage: 'IBM quantum roadmap...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messageCount: 8
  }
];

// Root props for the main component
export const mockRootProps = {
  initialMessages: mockMessages,
  chatSessions: mockChatSessions,
  currentChatStatus: ChatStatus.IDLE as const,
  userAvatar: 'https://i.pravatar.cc/40?img=1',
  aiAvatar: 'https://i.pravatar.cc/40?img=2'
};