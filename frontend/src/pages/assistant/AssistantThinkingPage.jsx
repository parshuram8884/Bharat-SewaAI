import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import ThinkingIndicator from '../../components/assistant/ThinkingIndicator';

export default function AssistantThinkingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto simulate AI thinking completion and transition to chat conversation view
    const timer = setTimeout(() => {
      navigate('/assistant/chat');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans overflow-hidden">
      <header className="w-full sticky top-0 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-4 h-[64px] z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/assistant')}
            className="p-2 hover:bg-surface-container-low transition-colors rounded-full active:opacity-70 text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-primary">Bharat Sewa AI</h1>
        </div>
        <button className="p-2 hover:bg-surface-container-low transition-colors rounded-full active:opacity-70 text-primary">
          <Globe className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative px-4">
        <ThinkingIndicator />
      </main>
    </div>
  );
}
