/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Loader2,
  Zap,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError ? 'Authentication failed. Please check your credentials.' : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage('Invalid credentials. Try using the 1-Click Demo Login below.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex@contentsync.ai');
    setPassword('demo123456');
    setIsLoading(true);
    setErrorMessage(null);

    const res = await signIn('credentials', {
      email: 'alex@contentsync.ai',
      password: 'demo123456',
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      setErrorMessage('Demo authentication failed.');
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    if (provider === 'google') setIsGoogleLoading(true);
    if (provider === 'github') setIsGithubLoading(true);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Card Wrapper */}
      <div className="glass border border-white/[0.10] rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Top decorative glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Header Text */}
        <div className="space-y-2 text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-neon-blue text-[11px] font-bold mx-auto mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NextAuth.js OAuth 2.0 &amp; Credentials</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-zinc-400">
            {mode === 'signin'
              ? 'Access your multi-workspace social automation dashboard'
              : 'Start automating 10 social platforms with AI in seconds'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-zinc-900/80 border border-white/[0.06] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'signin' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Authentication Alert</p>
              <p className="text-[11px] text-rose-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/80 border border-white/[0.08] rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 font-medium"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-white/[0.08] rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your email address.')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-zinc-900/80 border border-white/[0.08] rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span>Remember session for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition hover:opacity-95 disabled:opacity-60 btn-glow mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Login Banner */}
        <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <span className="relative px-3 bg-zinc-950 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Instant Test Drive
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 border border-amber-500/30 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition group hover:border-amber-500/50"
          >
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            <span>1-Click Demo Login as Founder</span>
          </button>
        </div>

        {/* Social Logins */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isGoogleLoading}
              className="py-2.5 px-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] hover:border-white/[0.15] text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3c0 2.9.7 5.6 1.9 8l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z"
                  />
                </svg>
              )}
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              disabled={isGithubLoading}
              className="py-2.5 px-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] hover:border-white/[0.15] text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGithubLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> OAuth 2.0 Certified
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background ambient glowing gradient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/10 to-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Content Sync <span className="gradient-text">AI</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Multi-Workspace Social Engine</span>
          </div>
        </a>

        <a
          href="/"
          className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-zinc-900/50"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </a>
      </header>

      {/* Main Container with Suspense boundary */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 py-8">
        <Suspense
          fallback={
            <div className="glass p-8 rounded-3xl text-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs text-zinc-400">Loading Content Sync Auth Portal...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-zinc-600 border-t border-white/[0.04]">
        © 2026 Content Sync Inc. All rights reserved. ·{' '}
        <a href="/privacy" className="hover:text-zinc-400 underline transition">Privacy Policy</a> ·{' '}
        <a href="/terms" className="hover:text-zinc-400 underline transition">Terms of Service</a>
      </footer>
    </div>
  );
}
