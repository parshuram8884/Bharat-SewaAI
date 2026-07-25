import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerAuthService } from '../../services/officerAuthService';
import { officerDemoDataService } from '../../services/officerDemoDataService';

const OfficerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Ensure data is seeded first
      officerDemoDataService.initializeDemoData();
      
      const res = await officerAuthService.login(email, password);
      if (res.success) {
        navigate('/officer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 text-center bg-slate-900 text-white">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-slate-800">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bharat Sewa AI</h1>
          <p className="text-slate-400 mt-2 text-sm">Government Officer Portal</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="officer@bharatsewa.demo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">Demo Accounts</p>
            <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <button onClick={() => setEmail('reviewer@bharatsewa.demo')} className="block hover:text-blue-600 transition-colors w-full text-left">
                <span className="font-semibold w-24 inline-block">Reviewer:</span> reviewer@bharatsewa.demo
              </button>
              <button onClick={() => setEmail('senior@bharatsewa.demo')} className="block hover:text-blue-600 transition-colors w-full text-left">
                <span className="font-semibold w-24 inline-block">Senior:</span> senior@bharatsewa.demo
              </button>
              <button onClick={() => setEmail('admin@bharatsewa.demo')} className="block hover:text-blue-600 transition-colors w-full text-left">
                <span className="font-semibold w-24 inline-block">Admin:</span> admin@bharatsewa.demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerLogin;
