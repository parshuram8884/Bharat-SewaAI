import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Eye, EyeOff, Lock, Mail, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Admin ID or Email is required').email('Please enter a valid government email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'tejas.admin@bharatsewa.gov.in',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      login(data.email, data.password);
      setIsLoading(false);
      showToast('Welcome back, Tejas Mail! Logged into Super Admin console.', 'success');
      navigate('/dashboard');
    }, 800);
  };

  const handleDemoFill = () => {
    setValue('email', 'tejas.admin@bharatsewa.gov.in');
    setValue('password', 'password123');
    showToast('Demo credentials inserted automatically.', 'info');
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
            Centralized Governance Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-xl">
          <header className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-on-surface mb-1">Admin Access</h2>
            <p className="text-sm font-medium text-on-surface-variant">
              Please enter your authorized government credentials.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email / Admin ID */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface">
                Admin ID or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. admin.tejas@sewa.gov.in"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-base text-on-surface placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.email ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs font-semibold text-error mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-semibold text-on-surface">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-xs font-bold text-secondary hover:underline cursor-pointer"
                >
                  Use Demo Credentials
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-surface-container-lowest text-base text-on-surface placeholder:text-on-surface-variant/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.password ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-semibold text-error mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer"
                  {...register('rememberMe')}
                />
                <span className="text-on-surface font-medium">Remember this terminal</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Contact NIC IT Helpdesk for password reset.', 'info'); }} className="text-secondary font-semibold hover:underline">
                Forgot password?
              </a>
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Help Banner */}
          <div className="mt-6 p-3 rounded-xl bg-primary-fixed/20 border border-primary-container/40 flex items-center justify-between text-xs text-primary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Demo Mode active: Ready with Super Admin permissions</span>
            </div>
            <button
              onClick={handleDemoFill}
              className="font-bold underline cursor-pointer hover:opacity-80"
            >
              Auto-fill
            </button>
          </div>
        </section>

        {/* Footer Security Note */}
        <footer className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authorized personnel only. All access is logged and audited by NIC.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AdminLogin;
