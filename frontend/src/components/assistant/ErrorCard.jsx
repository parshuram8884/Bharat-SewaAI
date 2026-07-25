import React from 'react';
import { RefreshCw, Keyboard, FileText, HeadphoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ErrorCard({ onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto text-center py-4">
      <div className="relative mb-6 flex justify-center">
        <div className="w-48 h-48 rounded-full bg-surface-container flex items-center justify-center p-4 relative shadow-inner">
          <span className="text-6xl animate-bounce">😴</span>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-primary">Taking a Quick Nap</h2>
        <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
          AI temporarily unavailable. Our digital assistant is taking a short break.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full mb-8">
        <button
          onClick={onRetry}
          className="bg-primary text-on-primary h-14 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>

        <button
          onClick={() => navigate('/assistant/chat')}
          className="border-2 border-primary text-primary h-14 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <Keyboard className="w-4 h-4" />
          Type request manually
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-left">
        <button
          onClick={() => navigate('/schemes')}
          className="bg-white border border-outline-variant p-4 rounded-xl hover:bg-surface-container-high transition-all text-left"
        >
          <FileText className="w-5 h-5 text-primary mb-2" />
          <span className="font-bold text-xs block text-primary">Browse schemes</span>
          <span className="text-[10px] text-on-surface-variant">Find services directly</span>
        </button>

        <button
          onClick={() => navigate('/support')}
          className="bg-white border border-outline-variant p-4 rounded-xl hover:bg-surface-container-high transition-all text-left"
        >
          <HeadphoneOff className="w-5 h-5 text-primary mb-2" />
          <span className="font-bold text-xs block text-primary">Contact help</span>
          <span className="text-[10px] text-on-surface-variant">Talk to a person</span>
        </button>
      </div>
    </div>
  );
}
