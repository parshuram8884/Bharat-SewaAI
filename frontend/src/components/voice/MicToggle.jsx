import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export function MicToggle({ isListening, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
        isListening
          ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse shadow-lg shadow-red-500/30'
          : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      {isListening ? (
        <MicOff className="w-6 h-6 animate-bounce" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
      {isListening && (
        <span className="absolute -inset-1 rounded-full border border-red-500 animate-ping opacity-75 pointer-events-none" />
      )}
    </button>
  );
}

export default MicToggle;
