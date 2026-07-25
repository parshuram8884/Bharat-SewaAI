import React from 'react';
import { CheckCircle2, Loader2, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ThinkingIndicator() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-6">
      <div className="relative mb-8">
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center p-1 shadow-2xl relative">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary-container animate-[spin_10s_linear_infinite] opacity-40" />
          <div className="bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden border-2 border-primary-container">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl mb-1">🤖</span>
              <span className="text-xs font-bold text-primary">Bharat Sewa AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-1">Understanding your request...</h2>
        <p className="text-on-surface-variant text-xs px-4">
          Our digital assistant is processing your inquiry to find the most relevant citizen services for you.
        </p>
      </div>

      <div className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant mb-6 space-y-3">
        <div className="flex items-center gap-3 text-left">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-on-surface flex-1">Detecting language</span>
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">Marathi / English</span>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <span className="text-xs font-bold text-on-surface flex-1">Understanding intent</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-left opacity-50">
          <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-outline">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-on-surface flex-1">Finding suitable services</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/assistant/chat')}
        className="flex items-center gap-1.5 text-primary text-xs font-bold hover:underline p-2 active:opacity-70"
      >
        <X className="w-4 h-4" />
        <span>Cancel request</span>
      </button>
    </div>
  );
}
