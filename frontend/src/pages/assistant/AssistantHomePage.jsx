import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Bot, Tractor, GraduationCap, Droplet, Target, Sparkles, History } from 'lucide-react';
import ChatComposer from '../../components/assistant/ChatComposer';
import { useSendMessage } from '../../hooks/useAssistantQuery';

export default function AssistantHomePage() {
  const navigate = useNavigate();
  const sendMessageMutation = useSendMessage();

  const handlePromptSelect = (promptText) => {
    sendMessageMutation.mutate({ conversationId: 'conv-1', text: promptText });
    navigate('/assistant/chat');
  };

  const handleSendMessage = (text) => {
    sendMessageMutation.mutate({ conversationId: 'conv-1', text });
    navigate('/assistant/chat');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans pb-28">
      {/* Top Header */}
      <header className="w-full sticky top-0 bg-surface z-40 border-b border-outline-variant flex items-center justify-between px-4 h-[64px] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-surface-container-low transition-colors rounded-full active:opacity-70 text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-primary">Bharat Sewa AI Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/assistant/history')}
            className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-full hover:bg-surface-container-low transition-colors text-xs font-semibold text-primary"
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded-full hover:bg-surface-container-low transition-colors text-xs font-semibold text-primary">
            <Globe className="w-4 h-4" />
            <span>हिन्दी</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pt-6">
        {/* AI Greeting */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-surface-container text-on-surface rounded-2xl rounded-bl-none p-4 shadow-sm max-w-[85%]">
            <p className="text-sm leading-relaxed font-normal">
              Namaste! I am your Bharat Sewa Assistant. How can I help you today?
            </p>
          </div>
        </div>

        {/* Suggested Actions Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-outline-variant flex-1" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Suggested Actions</span>
          <div className="h-px bg-outline-variant flex-1" />
        </div>

        {/* Prompt Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => handlePromptSelect('Find schemes for farmers')}
            className="bg-white border border-outline-variant p-4 rounded-xl text-left hover:border-primary-container hover:bg-surface-container-low transition-all group active:scale-95 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-2 group-hover:bg-primary-container transition-colors">
              <Tractor className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <p className="text-xs text-on-surface font-semibold">Find schemes for farmers</p>
          </button>

          <button
            onClick={() => handlePromptSelect('Check scholarship eligibility')}
            className="bg-white border border-outline-variant p-4 rounded-xl text-left hover:border-primary-container hover:bg-surface-container-low transition-all group active:scale-95 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-2 group-hover:bg-primary-container transition-colors">
              <GraduationCap className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <p className="text-xs text-on-surface font-semibold">Check scholarship eligibility</p>
          </button>

          <button
            onClick={() => handlePromptSelect('File a water complaint')}
            className="bg-white border border-outline-variant p-4 rounded-xl text-left hover:border-primary-container hover:bg-surface-container-low transition-all group active:scale-95 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-2 group-hover:bg-primary-container transition-colors">
              <Droplet className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <p className="text-xs text-on-surface font-semibold">File a water complaint</p>
          </button>

          <button
            onClick={() => handlePromptSelect('Track my application')}
            className="bg-white border border-outline-variant p-4 rounded-xl text-left hover:border-primary-container hover:bg-surface-container-low transition-all group active:scale-95 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mb-2 group-hover:bg-primary-container transition-colors">
              <Target className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <p className="text-xs text-on-surface font-semibold">Track my application</p>
          </button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center opacity-40 py-8">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-outline mx-auto mb-2" />
            <p className="text-xs font-semibold text-on-surface-variant">Start a conversation or tap microphone</p>
          </div>
        </div>
      </main>

      {/* Composer */}
      <ChatComposer onSendMessage={handleSendMessage} />
    </div>
  );
}
