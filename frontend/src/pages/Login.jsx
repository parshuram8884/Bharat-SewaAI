import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export function Login() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Welcome to भारत Sewa
          </h2>
          <p className="text-sm text-neutral-400">
            Sign in to access your secure digital locker and voice assistant.
          </p>
        </div>

        {/* Clerk Sign In component or Configuration Notice */}
        <div className="w-full flex justify-center">
          {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
          import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
          import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') ? (
            <SignIn 
              routing="path" 
              path="/citizen-login" 
              signUpUrl="/citizen-login"
              appearance={{
                variables: {
                  colorPrimary: '#10b981',
                  colorBackground: '#171717',
                  colorText: '#f3f4f6',
                  colorInputBackground: '#262626',
                  colorInputText: '#f3f4f6',
                },
                elements: {
                  card: 'border border-neutral-800 shadow-2xl bg-neutral-900',
                  headerTitle: 'text-neutral-100',
                  headerSubtitle: 'text-neutral-400',
                  socialButtonsBlockButton: 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-750',
                  formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-500 border-none text-white',
                  footerActionText: 'text-neutral-400',
                  footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                }
              }}
            />
          ) : (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-amber-500/40 text-center space-y-4 max-w-sm shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
                !
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-100">Clerk Auth Configuration Required</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The Clerk publishable key in <code className="text-amber-400 bg-neutral-800 px-1.5 py-0.5 rounded">.env</code> is set to the default placeholder <code className="text-neutral-200">pk_test_placeholder</code>.
                </p>
              </div>
              <div className="text-[11px] bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-left text-neutral-300 font-mono space-y-1.5">
                <p className="text-emerald-400 font-bold">// To enable Citizen SSO Login:</p>
                <p>1. Open <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="underline hover:text-emerald-300">dashboard.clerk.com</a></p>
                <p>2. Copy your project Publishable Key</p>
                <p>3. Set <span className="text-amber-400">VITE_CLERK_PUBLISHABLE_KEY</span> in .env</p>
              </div>
              <p className="text-[11px] text-neutral-500 font-sans">
                Admin Panel authentication is unaffected and can be accessed at <a href="/login" className="text-emerald-400 underline hover:text-emerald-300 font-bold">/login</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
