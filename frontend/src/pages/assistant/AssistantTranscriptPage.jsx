import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import TranscriptCard from '../../components/assistant/TranscriptCard';
import { useAssistantUiStore } from '../../stores/assistantUiStore';
import { useSendMessage } from '../../hooks/useAssistantQuery';

export default function AssistantTranscriptPage() {
  const navigate = useNavigate();
  const { currentTranscript, currentEnglishTranslation } = useAssistantUiStore();
  const sendMessageMutation = useSendMessage();

  const handleConfirm = () => {
    sendMessageMutation.mutate({ conversationId: 'conv-1', text: currentTranscript });
    navigate('/assistant/thinking');
  };

  return (
    <div className="bg-mesh text-on-background min-h-screen flex flex-col font-sans">
      <header className="bg-surface text-primary w-full sticky top-0 shadow-sm border-b border-outline-variant z-40">
        <div className="flex items-center justify-between px-4 h-[64px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/assistant/listening')}
              className="p-2 hover:bg-surface-container-low transition-colors active:opacity-70 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-primary">Bharat Sewa AI</h1>
          </div>
          <button className="p-2 hover:bg-surface-container-low transition-colors active:opacity-70 rounded-full">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 py-8 max-w-lg mx-auto w-full">
        <TranscriptCard
          transcript={currentTranscript}
          translation={currentEnglishTranslation}
          onConfirm={handleConfirm}
          onSpeakAgain={() => navigate('/assistant/listening')}
          onEdit={() => navigate('/assistant/chat')}
        />
      </main>
    </div>
  );
}
