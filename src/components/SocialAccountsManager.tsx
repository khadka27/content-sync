/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Star,
  Power,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Users,
  X,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Platform, SocialAccount } from '@/types';

// ── Platform meta ──────────────────────────────────────────────────────────
const PLATFORM_META: Record<
  Platform,
  {
    label: string;
    shortLabel: string;
    gradient: string;
    borderColor: string;
    badgeClass: string;
    authUrl: string;
    description: string;
  }
> = {
  FACEBOOK: {
    label: 'Facebook Page',
    shortLabel: 'FB',
    gradient: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-500/20',
    badgeClass: 'badge-neon-blue',
    authUrl: '/api/auth/facebook',
    description: 'Pages, Groups & Business accounts',
  },
  INSTAGRAM: {
    label: 'Instagram Business',
    shortLabel: 'IG',
    gradient: 'from-rose-500 via-fuchsia-500 to-amber-500',
    borderColor: 'border-rose-500/20',
    badgeClass: 'badge-neon-rose',
    authUrl: '/api/auth/instagram',
    description: 'Business & Creator profiles',
  },
  TIKTOK: {
    label: 'TikTok Creator',
    shortLabel: 'TK',
    gradient: 'from-zinc-800 to-zinc-900',
    borderColor: 'border-emerald-500/20',
    badgeClass: 'badge-neon-emerald',
    authUrl: '/api/auth/tiktok',
    description: 'Creator & Business accounts v2',
  },
  LINKEDIN: {
    label: 'LinkedIn Company',
    shortLabel: 'LI',
    gradient: 'from-sky-600 to-sky-700',
    borderColor: 'border-sky-500/20',
    badgeClass: 'badge-neon-blue',
    authUrl: '/api/auth/linkedin',
    description: 'Company Pages & Profiles',
  },
  TWITTER: {
    label: 'X (Twitter)',
    shortLabel: 'X',
    gradient: 'from-zinc-700 to-zinc-900',
    borderColor: 'border-zinc-500/20',
    badgeClass: 'badge-neon-blue',
    authUrl: '/api/auth/twitter',
    description: 'Twitter / X accounts & handles',
  },
  THREADS: {
    label: 'Threads',
    shortLabel: 'TH',
    gradient: 'from-violet-600 to-purple-700',
    borderColor: 'border-violet-500/20',
    badgeClass: 'badge-neon-purple',
    authUrl: '/api/auth/threads',
    description: 'Meta Threads profiles',
  },
  PINTEREST: {
    label: 'Pinterest',
    shortLabel: 'PT',
    gradient: 'from-red-600 to-rose-700',
    borderColor: 'border-red-500/20',
    badgeClass: 'badge-neon-rose',
    authUrl: '/api/auth/pinterest',
    description: 'Business & Personal boards',
  },
  TELEGRAM: {
    label: 'Telegram',
    shortLabel: 'TG',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/20',
    badgeClass: 'badge-neon-blue',
    authUrl: '/api/auth/telegram',
    description: 'Channels & Bot accounts',
  },
  DISCORD: {
    label: 'Discord',
    shortLabel: 'DC',
    gradient: 'from-indigo-600 to-violet-700',
    borderColor: 'border-indigo-500/20',
    badgeClass: 'badge-neon-purple',
    authUrl: '/api/auth/discord',
    description: 'Server webhooks & Bot accounts',
  },
  YOUTUBE: {
    label: 'YouTube',
    shortLabel: 'YT',
    gradient: 'from-red-600 to-red-800',
    borderColor: 'border-red-500/20',
    badgeClass: 'badge-neon-rose',
    authUrl: '/api/auth/youtube',
    description: 'YouTube channels & Studio',
  },
};

// Platforms shown in the manager (core 5 + extras)
const VISIBLE_PLATFORMS: Platform[] = [
  'FACEBOOK',
  'INSTAGRAM',
  'TIKTOK',
  'LINKEDIN',
  'TWITTER',
  'THREADS',
  'YOUTUBE',
  'TELEGRAM',
  'DISCORD',
  'PINTEREST',
];

// ── Add Account Modal ──────────────────────────────────────────────────────
interface AddAccountModalProps {
  platform: Platform;
  websiteId: string;
  onClose: () => void;
}

function AddAccountModal({ platform, websiteId, onClose }: AddAccountModalProps) {
  const meta = PLATFORM_META[platform];
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuth = () => {
    setIsLoading(true);
    const url = `${meta.authUrl}?websiteId=${encodeURIComponent(websiteId)}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm glass border border-white/[0.10] rounded-3xl p-6 shadow-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${meta.gradient} flex items-center justify-center font-black text-white text-sm shadow-lg`}>
              {meta.shortLabel}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add {meta.label} Account</h3>
              <p className="text-[11px] text-zinc-400">{meta.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OAuth Info Card */}
        <div className="p-4 rounded-2xl bg-blue-500/8 border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-xs font-bold text-blue-200">Secure OAuth 2.0 Only</p>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            You will be redirected to <span className="text-zinc-200 font-semibold">{meta.label}</span> to authorize Content Sync. Only a secure access token is stored — never your password.
          </p>
          <ul className="text-[11px] text-zinc-500 space-y-0.5 pt-1">
            <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400" />No passwords stored</li>
            <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400" />Revoke access anytime from {meta.label}</li>
            <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400" />Industry-standard OAuth 2.0 flow</li>
          </ul>
        </div>

        {/* OAuth Button */}
        <button
          onClick={handleOAuth}
          disabled={isLoading}
          className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${meta.gradient} text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition hover:opacity-90 btn-glow disabled:opacity-70`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
          {isLoading ? 'Redirecting…' : `Connect ${meta.label} via OAuth`}
        </button>

        <p className="text-center text-[10px] text-zinc-600">
          By connecting, you agree to our{' '}
          <a href="/terms" className="text-zinc-500 hover:text-zinc-300 underline transition">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}

// ── Account Row ────────────────────────────────────────────────────────────
interface AccountRowProps {
  account: SocialAccount;
  websiteId: string;
  meta: (typeof PLATFORM_META)[Platform];
  onRemove: () => void;
  onToggleActive: () => void;
  onSetPrimary: () => void;
}

function AccountRow({ account, websiteId, meta, onRemove, onToggleActive, onSetPrimary }: AccountRowProps) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition group ${
        account.isActive
          ? 'bg-zinc-900/50 border-white/[0.06] hover:border-white/[0.10]'
          : 'bg-zinc-900/20 border-white/[0.03] opacity-60'
      }`}
    >
      {/* Avatar placeholder */}
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${meta.gradient} flex items-center justify-center font-black text-white text-xs shrink-0 shadow-md`}>
        {account.accountName?.charAt(0)?.toUpperCase() || meta.shortLabel}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-zinc-100 truncate">{account.accountName}</span>
          {account.isPrimary && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold badge-neon-blue shrink-0">PRIMARY</span>
          )}
          {!account.isActive && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-zinc-800 text-zinc-500 border border-zinc-700 shrink-0">PAUSED</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {account.handle && (
            <span className="text-[11px] text-zinc-500 font-mono truncate">{account.handle}</span>
          )}
          {account.followers > 0 && (
            <span className="text-[11px] text-zinc-600">· {account.followers.toLocaleString()} followers</span>
          )}
        </div>
      </div>

      {/* Connection status dot */}
      <div className="shrink-0">
        {account.connected ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        )}
      </div>

      {/* Actions (shown on hover) */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Set Primary */}
        {!account.isPrimary && (
          <button
            onClick={onSetPrimary}
            title="Set as primary account"
            className="p-1.5 rounded-lg hover:bg-amber-500/10 text-zinc-500 hover:text-amber-400 transition"
          >
            <Star className="w-3.5 h-3.5" />
          </button>
        )}
        {account.isPrimary && (
          <button
            title="Primary account"
            className="p-1.5 rounded-lg text-amber-400 cursor-default"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </button>
        )}

        {/* Toggle Active */}
        <button
          onClick={onToggleActive}
          title={account.isActive ? 'Pause account' : 'Resume account'}
          className={`p-1.5 rounded-lg transition ${
            account.isActive
              ? 'hover:bg-zinc-800 text-zinc-500 hover:text-emerald-400'
              : 'hover:bg-zinc-800 text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
        </button>

        {/* Remove */}
        {confirmRemove ? (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-rose-400 font-semibold">Confirm?</span>
            <button
              onClick={onRemove}
              className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-[10px] font-bold border border-rose-500/30 transition"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmRemove(false)}
              className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] font-bold transition hover:bg-zinc-700"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmRemove(true)}
            title="Remove account"
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Platform Section ───────────────────────────────────────────────────────
interface PlatformSectionProps {
  platform: Platform;
  accounts: SocialAccount[];
  websiteId: string;
  onAddAccount: (platform: Platform) => void;
}

function PlatformSection({ platform, accounts, websiteId, onAddAccount }: PlatformSectionProps) {
  const { removeSocialAccount, toggleAccountActive, setPrimaryAccount } = useStore();
  const meta = PLATFORM_META[platform];
  const [collapsed, setCollapsed] = useState(accounts.length === 0);

  const connectedCount = accounts.filter((a) => a.connected && a.isActive).length;

  return (
    <div className={`rounded-2xl border transition ${meta.borderColor} glass overflow-hidden`}>
      {/* Platform Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${meta.gradient} flex items-center justify-center font-black text-white text-xs shadow-md`}>
            {meta.shortLabel}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{meta.label}</p>
            <p className="text-[11px] text-zinc-500">{meta.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Account count badge */}
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </span>
          {connectedCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot-active" />
              {connectedCount} live
            </span>
          )}
          <div className="text-zinc-500">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/[0.04]">
          <div className="pt-3 space-y-2">
            {accounts.length === 0 ? (
              <div className="py-5 text-center border border-dashed border-white/[0.06] rounded-2xl">
                <Lock className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">No {meta.label} accounts connected yet.</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">Click below to add your first account.</p>
              </div>
            ) : (
              accounts.map((acct) => (
                <AccountRow
                  key={acct.id}
                  account={acct}
                  websiteId={websiteId}
                  meta={meta}
                  onRemove={() => removeSocialAccount(websiteId, acct.id)}
                  onToggleActive={() => toggleAccountActive(websiteId, acct.id)}
                  onSetPrimary={() => setPrimaryAccount(websiteId, acct.id)}
                />
              ))
            )}
          </div>

          {/* Add Account Button */}
          <button
            onClick={() => onAddAccount(platform)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold border border-dashed ${meta.borderColor} text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition flex items-center justify-center gap-2`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Another {meta.label} Account
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main SocialAccountsManager ─────────────────────────────────────────────
interface SocialAccountsManagerProps {
  websiteId: string;
  className?: string;
}

export function SocialAccountsManager({ websiteId, className = '' }: SocialAccountsManagerProps) {
  const { socialAccounts } = useStore();
  const accounts = socialAccounts[websiteId] || [];

  const [addModalPlatform, setAddModalPlatform] = useState<Platform | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Group accounts by platform
  const byPlatform = VISIBLE_PLATFORMS.reduce<Record<Platform, SocialAccount[]>>(
    (acc, plat) => {
      acc[plat] = accounts.filter((a) => a.platform === plat);
      return acc;
    },
    {} as Record<Platform, SocialAccount[]>
  );

  const totalConnected = accounts.filter((a) => a.connected && a.isActive).length;
  const totalAccounts = accounts.length;

  // Filter platforms based on search
  const filteredPlatforms = VISIBLE_PLATFORMS.filter((p) =>
    searchFilter
      ? PLATFORM_META[p].label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        byPlatform[p].some(
          (a) =>
            a.accountName.toLowerCase().includes(searchFilter.toLowerCase()) ||
            (a.handle || '').toLowerCase().includes(searchFilter.toLowerCase())
        )
      : true
  );

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Connected Social Accounts
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {totalAccounts} total accounts · {totalConnected} active · Multiple accounts per platform supported
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl badge-neon-emerald text-xs font-bold">
            {totalConnected} Live
          </span>
          <span className="px-3 py-1.5 rounded-xl badge-neon-blue text-xs font-bold">
            {totalAccounts} Total
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Filter platforms or accounts…"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-4 pr-4 py-2.5 bg-zinc-900/60 border border-white/[0.06] rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40"
        />
      </div>

      {/* Platform Sections */}
      <div className="space-y-3">
        {filteredPlatforms.map((platform) => (
          <PlatformSection
            key={platform}
            platform={platform}
            accounts={byPlatform[platform]}
            websiteId={websiteId}
            onAddAccount={(p) => setAddModalPlatform(p)}
          />
        ))}
      </div>

      {/* Add Account Modal */}
      {addModalPlatform && (
        <AddAccountModal
          platform={addModalPlatform}
          websiteId={websiteId}
          onClose={() => setAddModalPlatform(null)}
        />
      )}
    </div>
  );
}
