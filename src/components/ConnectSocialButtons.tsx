/* eslint-disable react-hooks/immutability */
'use client';

import React from 'react';
import { Share2, CheckCircle2, ArrowUpRight, Lock } from 'lucide-react';

export interface SocialPlatformConfig {
  id: 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'LINKEDIN' | 'TWITTER';
  name: string;
  authUrl: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconLetter: string;
  description: string;
}

export const SUPPORTED_5_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: 'FACEBOOK',
    name: 'Facebook Page',
    authUrl: '/api/auth/facebook',
    bgColor: 'bg-blue-600/10 hover:bg-blue-600/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    iconLetter: 'FB',
    description: 'Publish posts, link previews, and page updates.',
  },
  {
    id: 'INSTAGRAM',
    name: 'Instagram Business',
    authUrl: '/api/auth/instagram',
    bgColor: 'bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-600/10 hover:opacity-90',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    iconLetter: 'IG',
    description: 'Post photo carousels, reels, and auto-captions.',
  },
  {
    id: 'TIKTOK',
    name: 'TikTok Creator',
    authUrl: '/api/auth/tiktok',
    bgColor: 'bg-zinc-900 hover:bg-zinc-800',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    iconLetter: 'TK',
    description: 'Upload short video clips & TikTok Reels v2 API.',
  },
  {
    id: 'LINKEDIN',
    name: 'LinkedIn Company',
    authUrl: '/api/auth/linkedin',
    bgColor: 'bg-sky-700/10 hover:bg-sky-700/20',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    iconLetter: 'IN',
    description: 'Share B2B thought leadership & company updates.',
  },
  {
    id: 'TWITTER',
    name: 'X (Twitter)',
    authUrl: '/api/auth/twitter',
    bgColor: 'bg-zinc-800/60 hover:bg-zinc-800',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-400/30',
    iconLetter: 'X',
    description: 'Publish tweets, threads, and trending hashtags.',
  },
];

interface ConnectSocialButtonsProps {
  websiteId?: string;
  connectedPlatforms?: string[];
  className?: string;
}

export function ConnectSocialButtons({
  websiteId,
  connectedPlatforms = [],
  className = '',
}: ConnectSocialButtonsProps) {
  const handleConnect = (authUrl: string) => {
    const targetUrl = websiteId ? `${authUrl}?websiteId=${encodeURIComponent(websiteId)}` : authUrl;
    window.location.href = targetUrl;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>Core 5-Platform OAuth Connections (FB, Insta, TikTok, LinkedIn & X)</span>
        </h3>
        <span className="text-[11px] text-zinc-400 font-mono">
          {connectedPlatforms.length} / 5 Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SUPPORTED_5_PLATFORMS.map((plat) => {
          const isConnected = connectedPlatforms.includes(plat.id);

          return (
            <div
              key={plat.id}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${plat.bgColor} ${plat.borderColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-black text-white">
                    {plat.iconLetter}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{plat.name}</p>
                    <p className="text-[10px] text-zinc-400">
                      {isConnected ? 'Connected ✅' : 'OAuth Required'}
                    </p>
                  </div>
                </div>

                {isConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                )}
              </div>

              <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                {plat.description}
              </p>

              <button
                onClick={() => handleConnect(plat.authUrl)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                  isConnected
                    ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <span>{isConnected ? 'Reconnect' : `Connect ${plat.name}`}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
