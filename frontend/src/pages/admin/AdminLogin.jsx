import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Mail, Building2, CheckCircle2, Send, Check } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
});

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  
  const { sendMagicLink } = useAdminAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'citizen@bharatsewa.gov.in',
    },
  });

  const handleSendVerificationLink = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const email = getValues('email');
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address first.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await sendMagicLink(email);
      setSentEmail(email);
      setLinkSent(true);
      showToast(`Verification link sent to ${email}! Check your inbox.`, 'success');
    } catch (err) {
      console.error("Supabase magic link error:", err);
      showToast(err.message || 'Failed to send verification link. Check Supabase setup.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setValue('email', 'citizen@bharatsewa.gov.in');
    showToast('Demo citizen email inserted automatically.', 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface text-on-surface relative overflow-hidden">
      {/* Decorative Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full blur-[140px]" />
      </div>

      <main className="w-full max-w-[480px] my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <Building2 className="w-8 h-8 text-on-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-tight">
            Bharat Sewa AI
          </h1>
          <p className="text-base text-on-surface-variant font-medium mt-1">
            Citizen Services & Governance Portal
          </p>
        </div>

        {/* Login Card */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-xl">
          <header className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-on-surface mb-1">Citizen Access</h2>
            <p className="text-sm font-medium text-on-surface-variant">
              Enter your email address to receive a secure login verification link.
            </p>
          </header>

          {linkSent ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Verification Link Sent!</h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  We've sent a magic verification link to <span className="font-semibold text-primary">{sentEmail}</span>.
                </p>
                <p className="text-xs text-on-surface-variant/80 mt-2">
                  Click the link in your email to automatically verify your citizen access and open your dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLinkSent(false)}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Use a different email address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleSendVerificationLink)} className="space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-on-surface">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. citizen@bharatsewa.gov.in"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-base text-on-surface placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.email ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs font-semibold text-error mt-1">{errors.email.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-heading font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Verification Link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Verification Link</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Help Banner */}
          <div className="mt-6 p-3 rounded-xl bg-primary-fixed/20 border border-primary-container/40 flex items-center justify-between text-xs text-primary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Citizen Supabase Verification Link active</span>
            </div>
            <button
              onClick={handleDemoFill}
              className="font-bold underline cursor-pointer hover:opacity-80"
            >
              Auto-fill Citizen Email
            </button>
          </div>
        </section>

        {/* Footer Security Note */}
        <footer className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure Citizen Authentication powered by Bharat Sewa.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AdminLogin;

