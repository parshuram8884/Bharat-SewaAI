import React, { useState } from 'react';
import { Paperclip, Mic, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatComposer({ onSendMessage, disabled = false }) {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleMicClick = () => {
    navigate('/assistant/listening');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-container-lowest border-t border-outline-variant z-50">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-0.5 rounded-full border border-outline-variant text-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>AI Online</span>
          </div>
          <div className="bg-primary-container/10 text-primary-container text-xs font-semibold px-3 py-0.5 rounded-full border border-primary-container/20">
            English / मराठी / हिंदी
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-low rounded-2xl border border-outline flex items-center px-3 py-1 gap-2 shadow-sm focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all"
        >
          <button
            type="button"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full"
            title="Attach File"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            placeholder="Ask me something in English or मराठी..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 py-3 focus:outline-none"
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleMicClick}
              className="w-10 h-10 flex items-center justify-center bg-[#ff8031] text-white rounded-full hover:brightness-95 transition-all shadow-sm active:scale-90"
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!text.trim() || disabled}
              className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-full hover:bg-primary-container disabled:opacity-40 transition-colors shadow-sm active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
