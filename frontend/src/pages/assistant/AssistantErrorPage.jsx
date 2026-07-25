import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import ErrorCard from '../../components/assistant/ErrorCard';

export default function AssistantErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-background font-sans min-h-screen flex flex-col">
      <header className="bg-surface w-full sticky top-0 border-b border-outline-variant shadow-sm z-50">
        <div className="flex items-center justify-between px-4 h-[64px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/assistant')}
              className="p-2 active:opacity-70 text-primary hover:bg-surface-container-low rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-primary">Bharat Sewa AI</h1>
          </div>
          <button className="p-2 active:opacity-70 text-primary hover:bg-surface-container-low rounded-full">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto w-full">
        <ErrorCard onRetry={() => navigate('/assistant')} />
      </main>
    </div>
  );
}
