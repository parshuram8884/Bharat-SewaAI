import React from 'react';
import { Mic, Radio } from 'lucide-react';

export default function VoiceMicButton({ isListening, onClick, size = 'large' }) {
  const isLg = size === 'large';
  
  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-[#ff8031] animate-ping motion-reduce:animate-none opacity-30" />
          <div className="absolute -inset-4 rounded-full bg-[#ff8031] opacity-20 animate-pulse motion-reduce:animate-none" />
        </>
      )}
      <button
        onClick={onClick}
        type="button"
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        className={`relative z-10 rounded-full bg-[#ff8031] hover:bg-[#e06d20] text-white flex items-center justify-center shadow-lg active:scale-90 motion-reduce:active:scale-100 transition-all ${
          isLg ? 'w-32 h-32' : 'w-14 h-14'
        }`}
      >
        {isListening ? (
          <Radio className={isLg ? 'w-16 h-16 animate-spin motion-reduce:animate-none' : 'w-7 h-7 animate-pulse motion-reduce:animate-none'} />
        ) : (
          <Mic className={isLg ? 'w-14 h-14' : 'w-7 h-7'} />
        )}
      </button>
    </div>
  );
}
