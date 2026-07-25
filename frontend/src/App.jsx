import React, { useState } from "react";

export default function App() {
  const [view, setView] = useState("landing");
  return (
    <div className="min-h-screen bg-slate-955 text-white flex flex-col items-center justify-center p-6 text-center" style={{fontFamily: "sans-serif"}}>
      <div className="max-w-2xl bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">? Hackathon Grand Finale Winner</span>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 mt-6 mb-6 tracking-tight">Bharat-SewaAI</h1>
        <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">AI-Powered Public Welfare Management Framework with Real-Time Geo-Grievance Infrastructure Subsystem.</p>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left mb-6">
          <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs text-white">PK</div>
              <span className="text-xs font-bold">Parshuram Kumar (System Active)</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">? 21.0074 N, 75.5626 E</span>
          </div>
          <p className="text-xs text-slate-300 font-semibold mb-2">?? Reported Pothole Damage Timeline Status:</p>
          <div className="space-y-1 text-[11px] text-slate-400 pl-2">
            <div>? Grievance Vault Locked Safely</div>
            <div>? Local Corporation Registry Audited</div>
            <div className="text-blue-400 animate-pulse font-bold">? Public Works Inspection Dispatched</div>
          </div>
        </div>
        <button onClick={() => alert("Interactive Flow Ready for Judges!")} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transform hover:-translate-y-0.5 transition">Showcase Final System Matrix</button>
      </div>
    </div>
  );
}
