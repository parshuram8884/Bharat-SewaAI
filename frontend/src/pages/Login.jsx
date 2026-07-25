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

        {/* Clerk Sign In component */}
        <div className="w-full flex justify-center">
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/login" // Or custom signup path if needed
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
        </div>
      </div>
    </div>
  );
}

export default Login;
