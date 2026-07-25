import React, { useState, useEffect } from 'react';
import { useSignIn, useSignUp, useAuth, useClerk } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export function Login() {
  const { isLoaded, isSignedIn } = useAuth();
  const { setActive } = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const navigate = useNavigate();

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flowMode, setFlowMode] = useState('signin'); // 'signin' | 'signup'

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    console.log("Send OTP clicked. isLoaded:", isLoaded);
    if (!isLoaded || !signIn || !signUp) {
      setError('Authentication helper is not loaded yet. Please wait a moment.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    console.log("Attempting OTP send to:", email);

    try {
      // First, try signing in
      try {
        setFlowMode('signin');
        const signinAttempt = await signIn.create({
          identifier: email.trim(),
        });
        console.log("signinAttempt response:", signinAttempt);

        const responseError = signinAttempt.error || signinAttempt.errors?.[0];
        if (responseError) {
          const errMsg = responseError.message || '';
          if (errMsg.toLowerCase().includes("couldn't find your account") || errMsg.toLowerCase().includes("not found")) {
            // User doesn't exist, trigger sign-up instead
            setFlowMode('signup');
            const signupAttempt = await signUp.create({
              emailAddress: email.trim(),
            });
            console.log("signupAttempt response:", signupAttempt);

            const signupError = signupAttempt.error || signupAttempt.errors?.[0];
            if (signupError) {
              throw new Error(signupError.message || 'Failed to create sign-up record.');
            }

            await signUp.sendEmailCode();
            setStep('otp');
            return;
          } else {
            throw new Error(errMsg);
          }
        }

        const firstFactor = signinAttempt.supportedFirstFactors?.find(
          (factor) => factor.strategy === 'email_code'
        );

        if (firstFactor) {
          await signinAttempt.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: firstFactor.emailAddressId,
          });
          setStep('otp');
        } else {
          throw new Error('Email verification strategy is not supported or not enabled in your Clerk Dashboard.');
        }
      } catch (err) {
        console.warn("Caught sign-in error, checking for user_not_found:", err);
        const errMsg = err.message || err.errors?.[0]?.message || '';
        
        if (
          (err.errors && err.errors[0]?.code === 'form_identifier_not_found') ||
          errMsg.toLowerCase().includes("couldn't find your account") ||
          errMsg.toLowerCase().includes("not found")
        ) {
          setFlowMode('signup');
          const signupAttempt = await signUp.create({
            emailAddress: email.trim(),
          });
          console.log("signupAttempt response:", signupAttempt);

          const signupError = signupAttempt.error || signupAttempt.errors?.[0];
          if (signupError) {
            throw new Error(signupError.message || 'Failed to create sign-up record.');
          }

          await signUp.sendEmailCode();
          setStep('otp');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || err.errors?.[0]?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log("Verify OTP clicked. code:", otpCode, "flowMode:", flowMode);
    if (!isLoaded || !signIn || !signUp) {
      setError('Authentication helper is not loaded yet.');
      return;
    }

    if (otpCode.length < 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (flowMode === 'signin') {
        const res = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code: otpCode,
        });
        console.log("attemptFirstFactor resolved value:", res);

        const activeSignIn = res?.status ? res : (res?.result?.status ? res.result : signIn);
        console.log("activeSignIn status:", activeSignIn?.status, "session:", activeSignIn?.createdSessionId);

        if (activeSignIn?.status === 'complete') {
          await setActive({ session: activeSignIn.createdSessionId });
          navigate('/dashboard');
        } else {
          console.error("SignIn incomplete. Status:", activeSignIn?.status);
          setError(`Verification succeeded but sign-in is incomplete (Status: ${activeSignIn?.status || 'unknown'}).`);
        }
      } else {
        const res = await signUp.verifyEmailCode({
          code: otpCode,
        });
        console.log("verifyEmailCode resolved value:", res);

        const activeSignUp = res?.status ? res : (res?.result?.status ? res.result : signUp);
        console.log("activeSignUp status:", activeSignUp?.status, "session:", activeSignUp?.createdSessionId);

        if (activeSignUp?.status === 'complete') {
          await setActive({ session: activeSignUp.createdSessionId });
          navigate('/dashboard');
        } else {
          console.error("SignUp incomplete. Full Object:", JSON.stringify(activeSignUp));
          setError(`Verification succeeded but sign-up is incomplete (Status: ${activeSignUp?.status || 'unknown'}). Missing fields: ${activeSignUp?.missingFields?.join(', ') || 'None'}`);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || err.errors?.[0]?.message || 'Invalid verification code. Please try again.');
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
            {step === 'email' 
              ? 'Enter your email address to secure your digital locker & voice assistant.' 
              : `Enter the 6-digit verification code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
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
                  Sending Code...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 tracking-[0.25em] text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-semibold"
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
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Enter App
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtpCode('');
                setError('');
              }}
              disabled={loading}
              className="w-full text-center text-xs text-neutral-400 hover:text-emerald-400 transition-colors py-2"
            >
              Change Email Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
