import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start items-center gap-3 my-4">
      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container opacity-60">
        <Bot className="w-5 h-5 text-white animate-pulse" />
      </div>
      <div className="bg-surface-container-high px-4 py-3 rounded-full flex items-center gap-1.5 shadow-sm">
        <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" />
      </div>
    </div>
  );
}
