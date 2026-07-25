import React from 'react';

export function AudioVisualizer({ isListening }) {
  if (!isListening) return null;

  return (
    <div className="flex items-end justify-center gap-1 h-6 px-4">
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="w-1 bg-emerald-500 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 100}%`,
            animationDelay: `${i * 150}ms`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
}

export default AudioVisualizer;
