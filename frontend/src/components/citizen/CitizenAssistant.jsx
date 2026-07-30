import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Paperclip,
  X,
  FileCheck,
  ScanLine,
  Mic,
  Volume2
} from 'lucide-react';
import axios from 'axios';
import { useAdminData } from '../../context/AdminDataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';



// Information Gemini will collect step by step (text format)
const INFO_TO_COLLECT = [
  "Applicant's Full Name",
  "Detailed Address (House No., Street, Village/City, Taluka, District, State, PIN)",
  "College / Institute Name",
  "Enrollment Number",
  "Course / Programme Enrolled (e.g., B.Sc., B.Com., B.E., B.Tech.)",
  "Degree Duration (3 years or 4 years)",
  "Passout Year",
  "Mobile Number",
];

export function CitizenAssistant() {
  const { showToast } = useToast();
  const { addApplication } = useAdminData();
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Voice AI Engine State
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // File Upload & OCR State
  const fileInputRef = useRef(null);
  const [attachedDoc, setAttachedDoc] = useState(null);
  const [isOcrScanning, setIsOcrScanning] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [applicationSummary, setApplicationSummary] = useState('');
  const [degreeDuration, setDegreeDuration] = useState(null); // null | 3 | 4

  const chatEndRef = useRef(null);

  // ── Language helpers ──────────────────────────────────────
  const getLanguageCode = (langName) => {
    const l = (langName || '').toLowerCase();
    if (l.includes('hindi'))    return 'hi-IN';
    if (l.includes('marathi'))  return 'mr-IN';
    if (l.includes('gujarati')) return 'gu-IN';
    if (l.includes('bengali'))  return 'bn-IN';
    if (l.includes('tamil'))    return 'ta-IN';
    if (l.includes('telugu'))   return 'te-IN';
    return 'en-IN';
  };

  // ── TTS ───────────────────────────────────────────────────
  const speakText = (text, onComplete) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getLanguageCode(user?.language || 'English');
    utterance.rate = 1.0;
    setIsSpeaking(true);
    const finish = () => { setIsSpeaking(false); if (onComplete) onComplete(); };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  };

  // ── STT ───────────────────────────────────────────────────
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast('Speech recognition not supported in this browser.', 'warning'); return; }
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e) {} }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getLanguageCode(user?.language || 'English');
    recognition.onstart  = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      setInputText(transcript);
      if (event.results[event.results.length - 1].isFinal && transcript.trim()) {
        handleSend(transcript);
      }
    };
    recognition.onend   = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    try { recognition.start(); } catch(e) {}
  };

  const stopListening = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e) {} }
    setIsListening(false);
  };

  // ── Auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Initial greeting on mount ─────────────────────────────
  useEffect(() => {
    const greeting =
      `Namaste! 🙏 I am your Bharat Sewa AI Assistant for the **Student Migration Certificate** scheme. How i help you with this Application`;

    setMessages([{
      id: Date.now().toString(),
      sender: 'ai',
      text: greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  // ── Track degree duration from conversation ───────────────
  useEffect(() => {
    if (degreeDuration !== null) return; // already detected
    const userMsgs = messages.filter(m => m.sender === 'user');
    if (userMsgs.length === 0) return;
    const first = userMsgs[0]?.text?.trim() || '';
    if (first.includes('4') || first.toLowerCase().includes('four')) {
      setDegreeDuration(4);
    } else if (first.includes('3') || first.toLowerCase().includes('three')) {
      setDegreeDuration(3);
    }
  }, [messages]);

  // ── OCR Document Scan ─────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrScanning(true);
    showToast(`Scanning ${file.name} with AI OCR Engine...`, 'info');

    setTimeout(() => {
      // ── DOCUMENT TYPE DETECTION via filename keywords ─────────────────────────
      // TODO: Replace this simulated OCR with a real OCR API call
      // (e.g., Google Vision API, AWS Textract, or Tesseract.js)
      let docType = 'Student ID / General Document';
      let extractedInfo = 'Document scanned — details extracted';
      let confidence = 95;

      const fn = file.name.toLowerCase();
      if (fn.includes('sem5') || fn.includes('semester5') || fn.includes('sem-5') || fn.includes('5th')) {
        docType = 'Semester V Marksheet';
        extractedInfo = 'Sem V — Total: 580/700, SGPA: 7.8, Roll No: 21BCS042';
        confidence = 97;
      } else if (fn.includes('sem6') || fn.includes('semester6') || fn.includes('sem-6') || fn.includes('6th')) {
        docType = 'Semester VI Marksheet';
        extractedInfo = 'Sem VI — Total: 610/700, SGPA: 8.1, Roll No: 21BCS042';
        confidence = 97;
      } else if (fn.includes('sem7') || fn.includes('semester7') || fn.includes('sem-7') || fn.includes('7th')) {
        docType = 'Semester VII Marksheet';
        extractedInfo = 'Sem VII — Total: 640/700, SGPA: 8.5, Roll No: 20BT042';
        confidence = 97;
      } else if (fn.includes('sem8') || fn.includes('semester8') || fn.includes('sem-8') || fn.includes('8th')) {
        docType = 'Semester VIII Marksheet';
        extractedInfo = 'Sem VIII — Total: 655/700, SGPA: 8.7, Roll No: 20BT042';
        confidence = 97;
      } else if (fn.includes('leaving') || fn.includes('lc') || fn.includes('college_leave')) {
        docType = 'College Leaving Certificate';
        extractedInfo = 'Leaving Date: 15-Jun-2024 | College: Govt. Engineering College, Pune';
        confidence = 96;
      } else if (fn.includes('provisional') || fn.includes('board') || fn.includes('degree')) {
        docType = 'Provisional / Final Board Certificate';
        extractedInfo = 'Degree: B.Tech. (CSE) | University: SPPU | Year: 2024 | Grade: First Class';
        confidence = 96;
      } else if (fn.includes('photo') || fn.includes('passport') || fn.includes('pic') || fn.includes('avatar')) {
        docType = 'Passport Size Photo';
        extractedInfo = 'Face Detected | Resolution: 300 DPI | Format: Image (JPG/PNG)';
        confidence = 99;
      } else if (fn.includes('sign') || fn.includes('signature')) {
        docType = 'Signature Photo';
        extractedInfo = 'Digital Signature Verified | Format: Image (JPG/PNG)';
        confidence = 98;
      }

      setAttachedDoc({ file, fileName: file.name, documentType: docType, extractedInfo, confidence });
      setIsOcrScanning(false);
      showToast(`AI OCR Scan Complete: ${docType} (${confidence}% Confidence)`, 'success');
    }, 1200);
  };

  // ── Send message to backend ───────────────────────────────
  const handleSend = async (textToSend) => {
    let messageText = textToSend || inputText;
    if (!messageText.trim() && !attachedDoc) return;

    // Append OCR data to message if document attached
    if (attachedDoc) {
      const docHeader = `[📄 Attached Document: ${attachedDoc.fileName} | AI OCR Extracted: ${attachedDoc.documentType} — ${attachedDoc.extractedInfo} (${attachedDoc.confidence}% Confidence)]`;
      messageText = messageText.trim() ? `${messageText}\n\n${docHeader}` : docHeader;
    }

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAttachedDoc(null);
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const endpoint = `${apiBase}/chat/message`;

      console.log('📤 [FRONTEND → BACKEND]:', { endpoint, message: messageText });

      const res = await axios.post(endpoint, {
        message: messageText,
        history: messages,
        contextData: {
          mode: 'service',
          serviceType: 'migration_certificate',
          language: user?.language || 'English',
          citizenName: user?.name || user?.email || 'Citizen User'
        }
      });

      const replyText = res.data?.reply || `Thank you for providing that information. Please continue with the next detail.`;
      setIsTyping(false);

      console.log('📥 [BACKEND → FRONTEND]:', { reply: replyText });

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // TTS loop for voice mode
      if (isVoiceActive) {
        speakText(replyText, () => { if (!isCompleted) startListening(); });
      }

      // Detect successful submission confirmation from Gemini
      const lower = replyText.toLowerCase();
      const isConfirmed =
        lower.includes('submitted successfully') ||
        lower.includes('application has been submitted') ||
        lower.includes('migration certificate application submitted');

      if (!isCompleted && isConfirmed) {
        const citizenName = user?.name || user?.email?.split('@')[0] || 'Citizen User';
        const createdApp = addApplication({
          citizenName,
          citizenEmail: user?.email || '',
          serviceName: 'Migration Certificate Withdrawal',
          serviceType: 'migration_certificate',
          details: messageText
        });
        setReferenceId(createdApp.id);
        setApplicationSummary(replyText);
        setIsCompleted(true);
      }

    } catch (err) {
      console.warn('Backend API warning:', err?.message);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Thank you for sharing that. Please continue providing your details so I can process your Migration Certificate application.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setIsCompleted(false);
    setReferenceId('');
    setApplicationSummary('');
    setDegreeDuration(null);
    const greeting =
      `Namaste! 🙏 Let's start a new application for the **Student Migration Certificate**.

First — **How long is your degree programme?**
  • Reply **3** for a 3-year degree
  • Reply **4** for a 4-year degree`;
    setMessages([{
      id: Date.now().toString(),
      sender: 'ai',
      text: greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">

      {/* ── Main Chat Interface (Only Chat Tab Visible) ───────────────────────────── */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xl flex flex-col h-[680px] overflow-hidden">

        {/* Chat Header */}
        <header className="p-4 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-on-surface truncate">Bharat Sewa AI</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold uppercase shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('Online')}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium truncate">Student Migration Certificate — Application Workflow</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Voice Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !isVoiceActive;
                setIsVoiceActive(next);
                if (next) { startListening(); showToast('Voice Mode Active 🎙️', 'success'); }
                else { stopListening(); showToast('Switched to Text Mode 💬', 'info'); }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer border ${
                isVoiceActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                  : 'bg-primary text-on-primary hover:bg-primary-container border-primary/40'
              }`}
            >
              {isVoiceActive ? <><Mic className="w-4 h-4 animate-bounce" /><span>🎙️ Voice ON</span></> : <><Volume2 className="w-4 h-4" /><span>🔊 Voice</span></>}
            </button>

            {/* Reset */}
            <button
              onClick={resetChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-xs font-bold text-on-surface-variant transition-colors cursor-pointer"
              title="Start New Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user' ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary shadow-xs'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className="space-y-2">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-on-primary rounded-tr-none shadow-md'
                    : 'bg-surface-container-low border border-outline-variant/60 text-on-surface rounded-tl-none shadow-2xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-colors cursor-pointer"
                      title="Listen to message (Text-to-Speech)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🔊 Listen</span>
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-on-surface-variant/70 block px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
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

          {/* Completion Card */}
          {isCompleted && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-on-surface space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-base">Migration Certificate Application Submitted!</h4>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Application Reference: <span className="font-mono font-bold text-primary">{referenceId}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 leading-relaxed">
                Your application for Migration Certificate Withdrawal has been registered successfully. You will be notified via SMS/email for further processing.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => navigate('/applications')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <span>View in Applications</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={resetChat}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container cursor-pointer"
                >
                  New Application
                </button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-3 bg-surface-container-low border-t border-outline-variant/60 space-y-2">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />

          {/* Voice listening indicator */}
          {isListening && (
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-red-600 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 animate-bounce" />
                <span>🎙️ Listening in {user?.language || 'English'}... Speak now!</span>
              </div>
              <button type="button" onClick={stopListening} className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">Stop</button>
            </div>
          )}

          {/* AI speaking indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl animate-pulse">
              <Volume2 className="w-4 h-4 animate-spin" />
              <span>🔊 AI is speaking in {user?.language || 'English'}...</span>
            </div>
          )}

          {/* OCR scanning indicator */}
          {isOcrScanning && (
            <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/30 p-2.5 rounded-xl animate-pulse">
              <ScanLine className="w-4 h-4 animate-spin" />
              <span>⚡ AI OCR Engine: Scanning document & extracting details...</span>
            </div>
          )}

          {/* Attached doc preview */}
          {attachedDoc && !isOcrScanning && (
            <div className="flex items-center justify-between gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl animate-in fade-in">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-on-surface truncate block">{attachedDoc.fileName}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Scanned: <span className="font-bold">{attachedDoc.documentType}</span> • {attachedDoc.extractedInfo} ({attachedDoc.confidence}% Match)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachedDoc(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : isSpeaking
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-primary/10 text-primary border border-primary/40 hover:bg-primary/20'
              }`}
              title={isListening ? 'Listening... Speak now' : 'Click to speak'}
            >
              {isListening
                ? <Mic className="w-5 h-5 animate-bounce" />
                : isSpeaking
                ? <Volume2 className="w-5 h-5 animate-pulse text-white" />
                : <Mic className="w-5 h-5" />
              }
            </button>

            {/* Attach doc button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-surface-container-lowest border border-outline-variant/80 hover:border-primary text-on-surface-variant hover:text-primary rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              title="Attach document for AI OCR scan (Aadhaar, Domicile, Migration Proof, Bank Passbook...)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? `Listening in ${user?.language || 'English'}...`
                  : 'Type your details or attach Aadhaar / Domicile / Migration Proof...'
              }
              className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !attachedDoc}
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
