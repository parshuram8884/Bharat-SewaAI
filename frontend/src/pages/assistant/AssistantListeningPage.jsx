import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Globe, ChevronDown, Octagon } from 'lucide-react';
import VoiceMicButton from '../../components/assistant/VoiceMicButton';
import WaveformVisualizer from '../../components/assistant/WaveformVisualizer';
import { useAssistantUiStore } from '../../stores/assistantUiStore';

export default function AssistantListeningPage() {
  const navigate = useNavigate();
  const { currentTranscript } = useAssistantUiStore();

  useEffect(() => {
    // Auto simulate listening finish after 4 seconds to route to transcript confirmation state
    const timer = setTimeout(() => {
      navigate('/assistant/transcript');
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 h-[64px] z-10">
        <button
          onClick={() => navigate('/assistant')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
        >
          <X className="w-6 h-6 text-on-surface" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant text-xs font-semibold text-on-surface">
          <Globe className="w-4 h-4 text-primary" />
          <span>Marathi</span>
          <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8 relative">
        {/* Glowing Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-surface-container-highest rounded-full blur-[120px] opacity-40" />
          <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-secondary-fixed rounded-full blur-[120px] opacity-30" />
        </div>

        {/* Mic Visualizer */}
        <div className="relative z-10 flex flex-col items-center">
          <VoiceMicButton isListening={true} onClick={() => navigate('/assistant/transcript')} size="large" />
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Listening...</h1>
            <p className="text-sm text-on-surface-variant mt-1 opacity-80 font-medium">बोलणे सुरू ठेवा</p>
          </div>
        </div>

        {/* Waveform */}
        <div className="z-10">
          <WaveformVisualizer barCount={14} />
        </div>

        {/* Live Transcript Preview */}
        <div className="z-10 w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/40 min-h-[100px] flex items-center justify-center text-center">
            <p className="text-lg font-semibold text-on-surface-variant leading-relaxed italic">
              "{currentTranscript}"
            </p>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="p-6 flex flex-col gap-3 z-20 max-w-md mx-auto w-full">
        <button
          onClick={() => navigate('/assistant/transcript')}
          className="w-full h-12 bg-primary text-on-primary font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Octagon className="w-4 h-4 fill-current" />
          STOP & CONFIRM
        </button>
        <button
          onClick={() => navigate('/assistant')}
          className="w-full h-12 border-2 border-outline-variant text-on-surface-variant font-semibold text-sm rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors"
        >
          CANCEL
        </button>
      </footer>
    </div>
  );
}
