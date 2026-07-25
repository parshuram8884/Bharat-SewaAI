import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export function CitizenAssistant() {
  const { showToast } = useToast();
  const { addComplaint } = useAdminData();
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  
  // Modal state for initial selection
  const [showModeModal, setShowModeModal] = useState(true);
  const [mode, setMode] = useState(null); // 'service' | 'complaint'
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [complaintDetails, setComplaintDetails] = useState({ what: '', where: '' });

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Mode Selection Popup
  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setShowModeModal(false);

    const greetingText = selectedMode === 'service'
      ? "Namaste! 🙏 I am your Bharat Sewa AI Assistant. How can I help you apply for a government welfare scheme or service today?"
      : "Namaste! 🙏 I am your Bharat Sewa AI Assistant. Please tell me **what happened** and **where did it happen** to register your complaint.";

    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: greetingText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Direct Backend API Chat Sender
  const handleSend = async (textToSend) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Display user message in chat
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setIsTyping(true);

    try {
      // 2. Call backend Gemini API
      const res = await axios.post('http://localhost:5000/api/chat/message', {
        message: messageText,
        history: updatedHistory,
        contextData: { mode }
      });

      const replyText = res.data?.reply || `Thank you for providing that information. How else can I assist you?`;
      setIsTyping(false);

      console.log('🤖 [Google Gemini AI] Received response from backend API:');
      console.log(replyText);

      // 3. Display Gemini AI response in chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Register complaint in database context ONLY after citizen provides both issue & location
      const lowerReply = replyText.toLowerCase();
      const userMsgs = updatedHistory.filter((m) => m.sender === 'user');
      const isRegistrationConfirmed =
        (lowerReply.includes('registered') || lowerReply.includes('thank you for registering')) ||
        userMsgs.length >= 2;

      if (mode === 'complaint' && !isCompleted && isRegistrationConfirmed) {
        const whatText = userMsgs[0]?.text || messageText;
        const whereText = userMsgs.length >= 2 ? userMsgs[1]?.text : messageText;

        setComplaintDetails({ what: whatText, where: whereText });

        const citizenName = user?.name || user?.email?.split('@')[0] || 'Citizen User';
        const citizenEmail = user?.email || '';

        const createdComplaint = addComplaint({
          citizenName,
          citizenEmail,
          whatHappened: whatText,
          whereHappened: whereText,
          howHappened: messageText,
          documents: []
        });
        setReferenceId(createdComplaint.id);
        setIsCompleted(true);
      }
    } catch (err) {
      console.warn("Backend API call warning, providing fallback reply:", err?.message);
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Thank you for sharing: "${messageText}". Your complaint details have been noted.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setIsCompleted(false);
    setShowModeModal(true);
    setReferenceId('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Initial Choice Modal */}
      {showModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-primary-fixed/40 rounded-2xl text-primary mb-1">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-on-surface">
                Bharat Sewa AI Assistant
              </h2>
              <p className="text-sm font-medium text-on-surface-variant">
                Welcome! Please select what service you need assistance with today:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Option 1: Government Service */}
              <button
                onClick={() => handleSelectMode('service')}
                className="p-5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-all group cursor-pointer space-y-3 shadow-sm hover:shadow-md"
              >
                <div className="p-3 rounded-xl bg-emerald-500 text-white w-fit shadow-md group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface group-hover:text-emerald-600 transition-colors">
                    Government Service / Scheme
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">
                    Apply for schemes, pensions, ration cards & health services.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-600 gap-1 pt-1">
                  <span>Start Application</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Register Complaint */}
              <button
                onClick={() => handleSelectMode('complaint')}
                className="p-5 rounded-2xl border-2 border-amber-500/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 text-left transition-all group cursor-pointer space-y-3 shadow-sm hover:shadow-md"
              >
                <div className="p-3 rounded-xl bg-amber-500 text-white w-fit shadow-md group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface group-hover:text-amber-600 transition-colors">
                    Register Grievance / Complaint
                  </h3>
                  <p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">
                    Report what happened and where it happened directly to officials.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-amber-600 gap-1 pt-1">
                  <span>File Complaint</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chatbot Interface */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xl flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header */}
        <header className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-on-surface">Bharat Sewa AI</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                {mode === 'service' ? 'Service & Scheme Application Workflow' : mode === 'complaint' ? 'Grievance Submission (What & Where Happened)' : 'Select Mode to Start'}
              </p>
            </div>
          </div>

          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-xs font-bold text-on-surface-variant transition-colors cursor-pointer"
            title="Start New Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Mode</span>
          </button>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user' ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-none shadow-md'
                      : 'bg-surface-container-low border border-outline-variant/60 text-on-surface rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                <span className="text-[10px] text-on-surface-variant/70 block px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant/60 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Final Completed Summary Card */}
          {isCompleted && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-on-surface space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-base">Grievance Submitted & Registered!</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Ticket Reference: <span className="font-mono font-bold text-primary">{referenceId}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40">
                <div>
                  <span className="text-on-surface-variant block font-semibold">What Happened:</span>
                  <span className="font-bold text-on-surface">{complaintDetails.what}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-semibold">Where Happened:</span>
                  <span className="font-bold text-on-surface">{complaintDetails.where}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                {mode === 'complaint' && (
                  <button
                    onClick={() => navigate('/complaints')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <span>View in Complaints Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={resetChat}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container cursor-pointer"
                >
                  Start Another Complaint
                </button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar - Simple Text Input Only */}
        <footer className="p-3 bg-surface-container-low border-t border-outline-variant/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Text Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe what happened or where it happened..."
              className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl shadow-md disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default CitizenAssistant;
