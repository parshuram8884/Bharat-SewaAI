import React, { useState } from 'react';

// सब-कंपोनेंट 1: शिकायत श्रेणी और जियो-लोकेशन
function GrievanceSetup({ screen, setScreen }) {
  if (screen === 'grievance_category') {
    return (
      <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
        <div className="flex-1 overflow-y-auto pr-0.5">
          <h3 className="text-sm font-black text-slate-900 mb-1">File a Public Grievance</h3>
          <p className="text-[11px] text-slate-400 mb-4">Select an infrastructure category to report issue</p>
          <div className="grid grid-cols-2 gap-3">
            {['Pothole Repair', 'Street Light', 'Garbage Dump', 'Water Leakage'].map((cat, idx) => (
              <div key={idx} onClick={() => setScreen('geo_location')} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-pointer hover:border-blue-500 transition">
                <div className="text-xl mb-1">{idx === 0 ? '🕳️' : idx === 1 ? '💡' : idx === 2 ? '🗑️' : '🚰'}</div>
                <h5 className="text-xs font-bold text-slate-800">{cat}</h5>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setScreen('dashboard')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs mt-4">BACK TO HOME</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
      <div>
        <h4 className="text-sm font-black text-slate-900 mb-2">Tag Issue Geo-Location</h4>
        <div className="w-full h-40 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center relative overflow-hidden mb-4">
          <span className="text-slate-400 font-bold text-xs">📍 Mapping Pimprala, Jalgaon...</span>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-[10px] font-bold text-blue-900 uppercase">Detected Coordinates</p>
          <p className="text-xs text-slate-700 font-semibold mt-0.5">21.0074° N, 75.5626° E</p>
        </div>
      </div>
      <button onClick={() => setScreen('voice_complaint')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs shadow-md">CONFIRM LOCATION →</button>
    </div>
  );
}

// सब-कंपोनेंट 2: वॉयस रिकॉर्डिंग और मीडिया अपलोड
function GrievanceMedia({ screen, setScreen }) {
  if (screen === 'voice_complaint') {
    return (
      <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
        <div>
          <h4 className="text-sm font-black text-slate-900 mb-1">Describe Your Complaint</h4>
          <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-3xl text-white">🎙️</span>
          </div>
          <p className="text-xs text-center text-slate-500 italic">"Pimprala main road par bada pothole hai..."</p>
        </div>
        <button onClick={() => setScreen('upload_photos')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs shadow-md">NEXT: CAPTURE PHOTOS</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
      <div>
        <h4 className="text-sm font-black text-slate-900 mb-4">Upload Evidence Photos</h4>
        <div className="p-5 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center mb-3">
          <span className="text-2xl">📸</span>
          <p className="text-xs font-bold text-slate-700 mt-1">Capture Damage Site</p>
        </div>
      </div>
      <button onClick={() => setScreen('ai_summary')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs shadow-md">PROCEED TO AI SUMMARY</button>
    </div>
  );
}

// सब-कंपोनेंट 3: एआई रिपोर्ट समरी और लाइव ट्रैकिंग टाइमलाइन
function GrievanceTracker({ screen, setScreen }) {
  if (screen === 'ai_summary') {
    return (
      <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
        <div className="flex-1 overflow-y-auto pr-0.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">AI Verification Report</h3>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3">
            <p className="text-xs font-bold text-slate-800">Severe Road Infrastructure Damage Detected</p>
          </div>
        </div>
        <button onClick={() => setScreen('grievance_status')} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-xs shadow-md">SUBMIT GRIEVANCE</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
      <div className="flex-1 overflow-y-auto pr-0.5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Grievance Timeline</h3>
        </div>
        <div className="space-y-4 pl-2">
          <div className="text-xs font-bold text-slate-900">✓ Grievance Registered</div>
          <div className="text-xs font-bold text-blue-600 animate-pulse">● On-Site Inspection Pending</div>
        </div>
      </div>
      <button onClick={() => setScreen('dashboard')} className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl text-xs shadow-md">RETURN TO HOME</button>
    </div>
  );
}

// सब-कंपोनेंट 4: मुख्य सिटिजन डैशबोर्ड होम स्क्रीन
function DashboardHomeScreen({ setScreen }) {
  return (
    <div className="flex flex-col h-full justify-between pt-2 text-slate-800">
      <div className="flex-1 overflow-y-auto pr-0.5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md">PK</div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Parshuram Kumar</h4>
              <p className="text-[10px] text-emerald-600 font-bold">● System Guard Active</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-5 rounded-[24px] text-center shadow-lg mb-5">
          <p className="text-[10px] text-blue-200 uppercase tracking-widest font-extrabold mb-1">Ask Bharat Sewa AI</p>
          <h3 className="text-xs font-bold text-slate-100 mb-4 px-2 leading-relaxed">"सड़क के गड्ढों की शिकायत दर्ज करें"</h3>
          <div onClick={() => setScreen('grievance_category')} className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto cursor-pointer shadow-xl">
            <span className="text-xl">🎙️</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-2.5 -mx-2 flex justify-around text-[10px] font-bold bg-white">
        <button onClick={() => setScreen('dashboard')} className="text-blue-600">🏠 Home</button>
        <button onClick={() => setScreen('grievance_category')} className="text-slate-400">🚨 Grievance</button>
        <button onClick={() => setScreen('grievance_status')} className="text-slate-400">📊 Status</button>
      </div>
    </div>
  );
}

// मुख्य कोर कंपोनेंट
export default function App() {
  const [view, setView] = useState('landing');
  const [screen, setScreen] = useState('dashboard');

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-955 text-white flex flex-col items-center justify-center p-6 text-center" style={{ fontFamily: 'sans-serif' }}>
        <div className="max-w-3xl bg-slate-900/60 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-slate-800">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 mb-6 tracking-tight">Bharat-SewaAI</h1>
          <button onClick={() => setView('appFlow')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl text-lg">Launch Interactive System Flow View</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-950 relative aspect-[9/19] flex flex-col justify-between p-6 min-h-[720px]">
        <button onClick={() => setView('landing')} className="absolute top-2 left-4 z-50 text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">← Web Home</button>
        <div className="h-full flex flex-col justify-between mt-4 flex-1">
          {screen === 'dashboard' && <DashboardHomeScreen setScreen={setScreen} />}
          {(screen === 'grievance_category' || screen === 'geo_location') && <GrievanceSetup screen={screen} setScreen={setScreen} />}
          {(screen === 'voice_complaint' || screen === 'upload_photos') && <GrievanceMedia screen={screen} setScreen={setScreen} />}
          {(screen === 'ai_summary' || screen === 'grievance_status') && <GrievanceTracker screen={screen} setScreen={setScreen} />}
        </div>
      </div>
    </div>
  );
}
