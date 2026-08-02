'use client';

import React from 'react';
import { Video, ArrowUpRight } from 'lucide-react';

interface ConnectTikTokButtonProps {
  websiteId?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'compact';
  connected?: boolean;
}

export function ConnectTikTokButton({
  websiteId,
  className = '',
  variant = 'default',
  connected = false,
}: ConnectTikTokButtonProps) {
  const connectTikTok = () => {
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || 'your_tiktok_client_key';
    const redirectUri = typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth/tiktok/callback`
      : 'http://localhost:3000/api/auth/tiktok/callback';

    if (!clientKey || clientKey === 'your_tiktok_client_key') {
      // Direct redirect to backend handler which supports demo mode
      window.location.href = `/api/auth/tiktok?websiteId=${encodeURIComponent(websiteId || 'default')}`;
      return;
    }

    const redirect = encodeURIComponent(redirectUri);
    const scope = encodeURIComponent('user.info.basic,video.upload,video.publish');
    const state = websiteId || (typeof crypto !== 'undefined' ? crypto.randomUUID() : 'default');

    window.location.href = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${redirect}&state=${state}`;
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={connectTikTok}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
          connected
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
            : 'bg-black text-white hover:bg-zinc-900 border border-zinc-800 shadow'
        } ${className}`}
      >
        <Video className="w-3.5 h-3.5" />
        <span>{connected ? 'TikTok Connected' : 'Connect TikTok'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={connectTikTok}
      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
        connected
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          : 'bg-black hover:bg-zinc-900 text-white border border-zinc-800 shadow-zinc-950/40'
      } ${className}`}
    >
      <Video className="w-4 h-4 text-emerald-400" />
      <span>{connected ? 'TikTok Account Connected ✅' : 'Connect TikTok'}</span>
      {!connected && <ArrowUpRight className="w-4 h-4 text-zinc-400" />}
    </button>
  );
}
