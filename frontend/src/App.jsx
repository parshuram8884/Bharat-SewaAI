import React, { useState } from 'react';

function OnboardingFlow({ screen, setScreen, selectedLang, setSelectedLang, otp, setOtp }) {
  if (screen === 'language') {
    return (
      <div className="flex flex-col h-full justify-between pt-4 text-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Choose Your Language</h2>
          <div className="space-y-3 mt-4">
            {['English', 'Hindi', 'Marathi'].map((lang) => (
              <button key={lang} onClick={() => setSelectedLang(lang)} className={`w-full p-3 text-left rounded-xl border-2 transition ${selectedLang === lang ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100'}`}>{lang}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setScreen('login')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs mt-4">CONTINUE</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full justify-between pt-4 text-slate-800">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-1">Welcome Back</h2>
        <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-Digit OTP" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold tracking-widest mt-4 focus:outline-none" />
      </div>
      <button onClick={() => setScreen('dashboard')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs mt-4">VERIFY & LOGIN</button>
    </div>
  );
}

function CitizenDashboard({ screen, setScreen }) {
  if (screen === 'grievance_category') {
    return (
      <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
        <h3 className="text-sm font-black text-slate-900 mb-4">File a Public Grievance</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Pothole Repair', 'Street Light', 'Garbage Dump', 'Water Leakage'].map((cat, idx) => (
            <div key={idx} onClick={() => setScreen('tracking_status')} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer hover:border-blue-500 transition">
              <h5 className="text-xs font-bold text-slate-800">{cat}</h5>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen('dashboard')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs mt-4">BACK</button>
      </div>
    );
  }

  if (screen === 'tracking_status') {
    return (
      <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase mb-3">Live Progress Tracker</h3>
          <div className="space-y-2 pl-2">
            <p className="text-xs font-bold text-slate-900">✓ Grievance Vault Locked</p>
            <p className="text-xs font-bold text-blue-600 animate-pulse">● Inspection Dispatched</p>
          </div>
        </div>
        <button onClick={() => setScreen('dashboard')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs mt-4">RETURN HOME</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between pt-1 text-slate-800 space-y-3 pb-2">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-5 rounded-[24px] text-center shadow-lg">
        <p className="text-[10px] text-blue-200 uppercase font-extrabold mb-1">Ask Bharat Sewa AI</p>
        <h3 className="text-xs font-bold text-slate-100 mb-3.5">"Report Potholes or Infrastructure Damage"</h3>
        <div onClick={() => setScreen('grievance_category')} className="w-11 h-11 bg-white rounded-full flex items-center justify-center mx-auto cursor-pointer shadow-md"><span className="text-lg">🎙️</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-blue-50/60 text-center rounded-xl"><div className="text-xs font-black text-blue-900">04</div><p className="text-[8.5px] text-slate-500">Filed</p></div>
        <div className="p-2 bg-amber-50/60 text-center rounded-xl"><div className="text-xs font-black text-amber-800">02</div><p className="text-[8.5px] text-slate-500">Progress</p></div>
        <div className="p-2 bg-emerald-50/60 text-center rounded-xl"><div className="text-xs font-black text-emerald-900">02</div><p className="text-[8.5px] text-slate-500">Resolved</p></div>
      </div>
      <div className="border-t border-slate-100 pt-2 flex justify-around text-[10px] font-extrabold bg-white -mx-2">
        <button onClick={() => setScreen('dashboard')} className="text-blue-600">🏠 Home</button>
        <button onClick={() => setScreen('grievance_category')} className="text-slate-400">🚨 Grievance</button>
        <button onClick={() => setScreen('tracking_status')} className="text-slate-400">📊 Status</button>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('landing');
  const [screen, setScreen] = useState('language');
  const [selectedLang, setSelectedLang] = useState('English');
  const [otp, setOtp] = useState('');

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl bg-slate-900/60 backdrop-blur-xl p-12 rounded-3xl border border-slate-800 shadow-2xl">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 tracking-tight">Bharat-SewaAI</h1>
          <button onClick={() => setView('appFlow')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-2xl text-lg transform hover:-translate-y-0.5 transition">Launch Interactive System Flow View</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-950 relative aspect-[9/19] flex flex-col justify-between p-6 min-h-[720px]">
        <button onClick={() => { setView('landing'); setScreen('language'); }} className="absolute top-2 left-4 z-50 text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500 transition">← Web Home</button>
        <div className="h-full flex flex-col justify-between mt-4 flex-1">
          {['language', 'login'].includes(screen) && (
            <OnboardingFlow screen={screen} setScreen={setScreen} selectedLang={selectedLang} setSelectedLang={setSelectedLang} otp={otp} setOtp={setOtp} />
          )}
          {['dashboard', 'grievance_category', 'tracking_status'].includes(screen) && (
            <CitizenDashboard screen={screen} setScreen={setScreen} />
          )}
        </div>
      </div>
    </div>
  );
}
