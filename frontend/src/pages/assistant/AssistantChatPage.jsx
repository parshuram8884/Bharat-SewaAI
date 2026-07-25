import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, MoreVertical } from 'lucide-react';
import AssistantChatBubble from '../../components/assistant/AssistantChatBubble';
import ChatComposer from '../../components/assistant/ChatComposer';
import TypingIndicator from '../../components/assistant/TypingIndicator';
import { useConversation, useSendMessage } from '../../hooks/useAssistantQuery';

export default function AssistantChatPage() {
  const navigate = useNavigate();
  const { data: conversation, isLoading } = useConversation('conv-1');
  const sendMessageMutation = useSendMessage();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, sendMessageMutation.isPending]);

  const handleSendMessage = (text) => {
    sendMessageMutation.mutate({ conversationId: 'conv-1', text });
  };

  const handleChipClick = (label) => {
    sendMessageMutation.mutate({ conversationId: 'conv-1', text: label });
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface w-full top-0 sticky z-40 border-b border-outline-variant shadow-sm flex items-center justify-between px-4 h-[64px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/assistant')}
            className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-bold text-base text-primary">Bharat Sewa AI</h1>
            <span className="text-xs text-secondary flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full">
            <Globe className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/assistant/history')}
            className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Canvas */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-36 max-w-4xl mx-auto w-full flex flex-col gap-4">
        <div className="flex justify-center my-2">
          <span className="bg-surface-container text-on-surface-variant text-xs px-3 py-1 rounded-full font-medium">
            Today
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          conversation?.messages?.map((msg) => (
            <AssistantChatBubble key={msg.id} message={msg} onChipClick={handleChipClick} />
          ))
        )}

        {sendMessageMutation.isPending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Composer */}
      <ChatComposer onSendMessage={handleSendMessage} disabled={sendMessageMutation.isPending} />
    </div>
  );
}
