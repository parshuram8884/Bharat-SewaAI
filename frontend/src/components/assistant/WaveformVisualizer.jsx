import React, { useEffect, useState } from 'react';

export default function WaveformVisualizer({ barCount = 12 }) {
  const [heights, setHeights] = useState(() => Array(barCount).fill(12));

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          const time = Date.now() / 150;
          const baseHeight = 12;
          const amplitude = 28;
          const sinWave = Math.sin(time + i * 0.5);
          const randomNoise = Math.random() * 10;
          return baseHeight + Math.abs(sinWave) * amplitude + randomNoise;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [barCount]);

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-[200px]" id="waveform">
      {heights.map((h, idx) => (
        <div
          key={idx}
          className="w-[6px] bg-secondary-container rounded-full transition-all duration-100"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}
