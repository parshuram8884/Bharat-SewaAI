import React, { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import useChat from '../hooks/useChat';
import MicToggle from '../components/voice/MicToggle';
import AudioVisualizer from '../components/voice/AudioVisualizer';
import Button from '../components/common/Button';
import { Send, Sparkles, Volume2, VolumeX } from 'lucide-react';

export function Home() {
  const [inputText, setInputText] = useState('');
  const [speakAssistant, setSpeakAssistant] = useState(true);
  const { messages, isLoading, sendMessage } = useChat();

  const {
    supported: sttSupported,
    isListening,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useSpeech({
    lang: 'hi-IN',
    onResult: (transcript) => {
      setInputText(transcript);
      handleSend(transcript);
    },
  });

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || text.trim() === '') return;
    
    setInputText('');
    const reply = await sendMessage(text);
    if (reply && speakAssistant) {
      speak(reply);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-neutral-950 text-neutral-100">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-950/20 via-teal-950/20 to-neutral-950 border-b border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide">AI VOICE ASSISTANT</h2>
        </div>
        <button
          onClick={() => setSpeakAssistant(!speakAssistant)}
          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          title={speakAssistant ? 'Mute AI voice output' : 'Unmute AI voice output'}
        >
          {speakAssistant ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
              How can I help you today?
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Ask me about government schemes, eligibility, required documents, or application procedures. You can type or tap the microphone to speak.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-900/10'
                    : msg.role === 'system'
                    ? 'bg-red-950/40 text-red-300 border border-red-900/30'
                    : 'bg-neutral-900 text-neutral-100 rounded-bl-none border border-neutral-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Voice Visualizer and Controls */}
      <div className="p-6 border-t border-neutral-900 bg-neutral-950/60 backdrop-blur-md flex flex-col items-center gap-4">
        <AudioVisualizer isListening={isListening} />
        
        <div className="w-full max-w-3xl flex items-center gap-4">
          {sttSupported && (
            <MicToggle isListening={isListening} onClick={toggleListening} />
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex-1 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type your query in Hindi, English, etc...'}
              disabled={isListening}
              className="flex-1 bg-neutral-900 hover:bg-neutral-900/80 focus:bg-neutral-900 text-neutral-100 placeholder-neutral-500 text-sm px-4 py-3 rounded-xl border border-neutral-800 focus:border-emerald-500/50 focus:outline-none transition-all duration-300"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputText.trim() || isListening || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
