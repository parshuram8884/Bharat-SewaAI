import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const generateUniqueUsername = (emailStr) => {
  const prefix = (emailStr || '').split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 15) || 'user';
  const randomSuffix = Math.random().toString(36).substring(2, 6) + Math.floor(100 + Math.random() * 900);
  return `${prefix}_${randomSuffix}`;
};

export function Login() {
  const { isSignedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && isSignedIn) {
      navigate('/dashboard');
    }
  }, [authLoading, isSignedIn, navigate]);

  const handleSendLink = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;

      setSent(true);
    } catch (err) {
      console.error('Magic link error:', err);
      setError(err.message || 'Failed to send login link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Welcome to भारत Sewa
          </h2>
          <p className="text-sm text-neutral-400">
            {sent
              ? 'Check your inbox'
              : 'Enter your email to receive a secure login link.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="space-y-5">
            <div className="p-5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex flex-col items-center gap-3 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
              <div>
                <p className="text-emerald-300 font-semibold text-base">Link sent to your Gmail!</p>
                <p className="text-neutral-400 text-sm mt-1">
                  A login link has been sent to <span className="text-emerald-400 font-medium">{email}</span>.<br />
                  Open your Gmail and click the link to sign in.
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-neutral-500">
              Didn't receive it?{' '}
              <button
                onClick={() => { setSent(false); setError(''); }}
                className="text-emerald-400 hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Login Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
