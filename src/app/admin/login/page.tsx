'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('admin@contentsync.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (email === 'admin@contentsync.ai' && password === 'admin123') {
        // Set admin token cookie
        document.cookie = `contentsync_admin_token=admin_secure_session_${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
        router.push(callbackUrl);
      } else {
        setError('Invalid Admin Credentials. Default login: admin@contentsync.ai / admin123');
      }
    } catch (err: any) {
      setError(err?.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Super Admin Portal</h1>
        <p className="text-xs text-zinc-400">Restricted system administration & user management portal</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Admin Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="admin@contentsync.ai"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Admin Security Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating Admin...' : 'Access Admin Portal'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition">← Back to Content Sync Main Site</Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-zinc-500">Loading Admin Authentication...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
