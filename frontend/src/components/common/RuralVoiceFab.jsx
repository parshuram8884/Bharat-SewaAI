import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Volume2, PhoneCall, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export function RuralVoiceFab() {
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { showToast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakWelcome = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = `Namaste! Bharat Sewa AI mein aapka swagat hai. Kheti, Padhai, Makaan, ya Pension yojana ki jankari ke liye mike button dabayein aur bolein.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    showToast("🔊 Playing Voice Instructions in Hindi / Spoken Language", "info");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Quick Toll-Free Call Badge */}
      <a
        href="tel:1915"
        className="px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs shadow-lg flex items-center gap-2 border-2 border-amber-300 transition-transform hover:scale-105"
        title="Call Toll-Free Helpline 1915"
      >
        <PhoneCall className="w-4 h-4 animate-bounce" />
        <span>हेल्पलाइन: 1915 (Call Free)</span>
      </a>

      {/* Giant Rural Voice Mic Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={speakWelcome}
          className="p-3 rounded-full bg-surface-container-lowest border-2 border-primary/40 text-primary hover:bg-primary/10 shadow-lg cursor-pointer transition-transform hover:scale-110"
          title="Click to Listen Spoken Audio Help"
        >
          <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-emerald-600' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            showToast("Opening Voice Dictation Assistant...", "success");
            navigate('/citizens');
          }}
          className="flex items-center gap-3 px-5 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-2xl transition-transform hover:scale-105 active:scale-95 border-4 border-emerald-400 rural-voice-active cursor-pointer"
        >
          <Mic className="w-7 h-7 animate-bounce" />
          <div className="text-left leading-tight">
            <span className="block text-sm font-extrabold">🎤 बोल कर सेवा पाएं</span>
            <span className="block text-[11px] font-bold text-emerald-200">Tap & Speak your query</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default RuralVoiceFab;
