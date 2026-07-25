import React, { useState } from "react";
export default function App() {
  const [view, setView] = useState("landing");
  const [screen, setScreen] = useState("dashboard");

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-slate-955 text-white flex flex-col items-center justify-center p-6 text-center" style={{fontFamily: "sans-serif"}}>
        <div className="max-w-2xl bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">? Hackathon Winner Layout</span>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 mt-6 mb-6 tracking-tight">Bharat-SewaAI</h1>
          <button onClick={() => setView("appFlow")} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-2xl text-lg transform hover:-translate-y-0.5">Launch Interactive System Flow View</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-950 relative aspect-[9/19] flex flex-col justify-between p-6 min-h-[720px]">
        <button onClick={() => setView("landing")} className="absolute top-2 left-4 z-50 text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">? Web Home</button>
        <div className="absolute top-2 left-0 right-0 flex justify-between px-8 text-xs font-semibold text-slate-400 pointer-events-none"><span></span><div className="flex gap-1 items-center"><span>??</span> <span>??</span> <span>??</span></div></div>
        <div className="h-full flex flex-col justify-between mt-4 flex-1 pt-4">
          <div className="flex justify-between items-center mb-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs text-white">PK</div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">Parshuram Kumar</h4>
                <p className="text-[9px] text-emerald-600 font-bold">? System Active</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-5 rounded-[24px] text-center shadow-lg mb-5">
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-extrabold mb-1">Ask Bharat Sewa AI</p>
            <h3 className="text-xs font-bold text-slate-100 mb-3.5">"??? ?? ?????? ?? ?????? ???? ????"</h3>
            <div onClick={() => setScreen("grievance_category")} className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto cursor-pointer shadow-md"><span className="text-lg animate-bounce">???</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-blue-50/60 border border-blue-100 rounded-xl text-center"><div className="text-xs font-black text-blue-900">04</div><p className="text-[8.5px] text-slate-500 font-semibold">Filed</p></div>
            <div className="p-2 bg-amber-50/60 border border-amber-100 rounded-xl text-center"><div className="text-xs font-black text-amber-800">02</div><p className="text-[8.5px] text-slate-500 font-semibold">Progress</p></div>
            <div className="p-2 bg-emerald-50/60 border border-emerald-100 rounded-xl text-center"><div className="text-xs font-black text-emerald-900">02</div><p className="text-[8.5px] text-slate-500 font-semibold">Resolved</p></div>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-around text-[10px] font-extrabold bg-white shadow-lg shrink-0 -mx-2">
            <button className="text-blue-600">?? Home</button>
            <button className="text-slate-400">?? Grievance</button>
            <button className="text-slate-400">?? Status</button>
          </div>
        </div>
      </div>
    </div>
  );
}
