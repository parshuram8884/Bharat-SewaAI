import React, { useState } from 'react';

function App() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp === '123456' || otp.length === 6) {
      setMessage('✅ OTP Verification Successful! Welcome to Bharat-SewaAI.');
    } else {
      setMessage('❌ Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6" style={{ fontFamily: 'sans-serif' }}>
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-2">Bharat-SewaAI</h2>
        <p className="text-slate-400 text-center mb-6">Hackathon MVP - Quick Access Mode</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-center text-xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
          >
            Verify & Continue
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${message.includes('✅') ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800' : 'bg-rose-950/50 text-rose-400 border border-rose-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
