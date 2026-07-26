import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Mail, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
});

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();
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
      email: 'citizen@gmail.com',
    },
  });

  // Direct Sign In with Gmail (Opens Dashboard Tab Directly)
  const handleDirectSignIn = async (data) => {
    const email = data.email || getValues('email') || 'citizen@gmail.com';
    setIsLoading(true);
    try {
      login(email);
      showToast(`Welcome! Signed in successfully with ${email}`, 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error("Sign in error:", err);
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setValue('email', 'citizen@gmail.com');
    showToast('Gmail address filled. Click Sign In to open Dashboard.', 'info');
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
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
          <header className="text-center sm:text-left">
            <h2 className="text-2xl font-heading font-bold text-on-surface mb-1">Citizen Sign In</h2>
            <p className="text-sm font-medium text-on-surface-variant">
              Enter your email address to access your applications, complaints, and dashboard.
            </p>
          </header>

          <form onSubmit={handleSubmit(handleDirectSignIn)} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. citizen@gmail.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-base text-on-surface placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.email ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs font-semibold text-error mt-1">{errors.email.message}</p>}
            </div>

            {/* Direct Sign In & Open Dashboard Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-heading font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Opening Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary-container/40 flex items-center justify-between text-xs text-primary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Direct Citizen Dashboard access active</span>
            </div>
            <button
              onClick={handleDemoFill}
              className="font-bold underline cursor-pointer hover:opacity-80"
            >
              Auto-fill Email
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
