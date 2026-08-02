'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import {
  Globe,
  Share2,
  FileText,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Zap,
  CheckCircle2,
  RotateCw,
  Activity,
  Cpu,
} from 'lucide-react';

export default function DashboardPage() {
  const { websites, activeWebsiteId, posts, socialAccounts, subscription, retryPost } = useStore();

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
  const activeSocials = socialAccounts[activeWebsiteId] || [];
  const connectedSocialsCount = activeSocials.filter((s) => s.connected).length;

  const websitePosts = posts.filter((p) => p.websiteId === activeWebsiteId);
  const todayPosts = websitePosts.filter((p) => p.publishedAt?.startsWith(new Date().toISOString().split('T')[0]));
  const scheduledPosts = websitePosts.filter((p) => p.status === 'SCHEDULED');
  const failedPosts = websitePosts.filter((p) => p.status === 'FAILED');

  const statCards = [
    {
      label: 'Total Websites',
      value: websites.length,
      icon: Globe,
      gradient: 'from-blue-600 to-cyan-500',
      glow: 'shadow-blue-500/20',
      badge: 'badge-neon-blue',
      link: '/dashboard/websites',
    },
    {
      label: 'Connected Accounts',
      value: connectedSocialsCount,
      icon: Share2,
      gradient: 'from-violet-600 to-purple-500',
      glow: 'shadow-purple-500/20',
      badge: 'badge-neon-purple',
      link: '/dashboard/websites',
    },
    {
      label: "Today's Published",
      value: todayPosts.length,
      icon: CheckCircle2,
      gradient: 'from-emerald-600 to-teal-500',
      glow: 'shadow-emerald-500/20',
      badge: 'badge-neon-emerald',
      link: '/dashboard/posts',
    },
    {
      label: 'Scheduled Queue',
      value: scheduledPosts.length,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
      badge: 'badge-neon-amber',
      link: '/dashboard/posts?tab=calendar',
    },
    {
      label: 'Failed / Action Needed',
      value: failedPosts.length,
      icon: AlertTriangle,
      gradient: 'from-rose-600 to-red-500',
      glow: 'shadow-rose-500/20',
      badge: 'badge-neon-rose',
      link: '/dashboard/posts?status=FAILED',
    },
    {
      label: 'AI Credits Left',
      value: subscription.aiCreditsTotal - subscription.aiCreditsUsed,
      icon: Cpu,
      gradient: 'from-sky-600 to-blue-500',
      glow: 'shadow-sky-500/20',
      badge: 'badge-neon-blue',
      link: '/dashboard/billing',
    },
  ];

  const platformList = [
    { id: 'TWITTER', name: 'Twitter / X', color: 'from-sky-400 to-sky-600' },
    { id: 'INSTAGRAM', name: 'Instagram', color: 'from-rose-400 to-pink-600' },
    { id: 'LINKEDIN', name: 'LinkedIn', color: 'from-blue-500 to-blue-700' },
    { id: 'TIKTOK', name: 'TikTok', color: 'from-emerald-400 to-teal-600' },
    { id: 'THREADS', name: 'Threads', color: 'from-violet-400 to-purple-600' },
    { id: 'FACEBOOK', name: 'Facebook', color: 'from-blue-600 to-indigo-600' },
  ];

  // Calculate real reach numbers from actual connected accounts & published posts
  const platformData = platformList.map((p) => {
    const accs = activeSocials.filter((s) => s.platform === p.id && s.connected);
    const totalFollowers = accs.reduce((sum, a) => sum + (a.followers || 0), 0);
    const platPostsCount = websitePosts.filter((post) => (post.platforms || []).includes(p.id as any)).length;
    const reachVal = totalFollowers > 0 ? totalFollowers : platPostsCount * 25;

    return {
      name: p.name,
      reachVal,
      reach: reachVal >= 1000 ? `${(reachVal / 1000).toFixed(1)}K` : `${reachVal}`,
      color: p.color,
      connected: accs.length > 0,
    };
  });

  const maxReach = Math.max(...platformData.map((d) => d.reachVal), 1);
  const platforms = platformData.map((d) => ({
    ...d,
    pct: d.reachVal > 0 ? Math.max(8, Math.round((d.reachVal / maxReach) * 100)) : 0,
  }));

  const automationChannels = [
    {
      name: 'RSS Auto-Sync',
      sub: activeWebsite?.rssFeed || 'No RSS feed configured',
      status: activeWebsite?.rssFeed ? 'ACTIVE' : 'READY',
    },
    {
      name: 'WordPress REST API',
      sub: activeWebsite?.wordpressApi || 'No WP API configured',
      status: activeWebsite?.wordpressApi ? 'ACTIVE' : 'READY',
    },
    {
      name: 'Webhook Receiver',
      sub: activeWebsite?.webhookUrl || 'https://api.contentsync.ai/v1/webhook',
      status: activeWebsite?.webhookUrl ? 'ACTIVE' : 'READY',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">

        {/* ── Welcome Banner ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 p-7 noise">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/30" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-neon-blue text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Multi-Workspace Automation Suite</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
                Welcome back, Alex! 👋
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                Managing{' '}
                <span className="font-semibold text-white">{activeWebsite?.name}</span>{' '}
                <span className="text-zinc-500">({activeWebsite?.domain})</span> · You have{' '}
                <span className="text-amber-400 font-semibold">{scheduledPosts.length} posts scheduled</span>{' '}
                across {connectedSocialsCount} connected platforms.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard/posts?action=create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition btn-glow"
              >
                <Plus className="w-4 h-4" />
                <span>Create AI Post</span>
              </Link>
              <Link
                href="/dashboard/ai-lab"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-purple-500/30 hover:border-purple-400/50 text-purple-300 font-bold text-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Script Lab</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.link}
                className="group p-5 rounded-2xl glass border border-white/[0.06] hover:border-white/[0.12] transition-all stat-card relative overflow-hidden"
              >
                {/* BG glow orb */}
                <div className={`absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-tr ${card.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />

                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-black text-white font-mono tracking-tight mb-1 group-hover:scale-105 transition-transform origin-left">
                  {card.value}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium leading-tight">{card.label}</div>
              </Link>
            );
          })}
        </div>

        {/* ── Reach Chart + Automation Status ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Reach Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl glass border border-white/[0.06] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Cross-Platform Reach & Impressions
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Weekly engagement for {activeWebsite?.name}</p>
              </div>
              <Link
                href="/dashboard/analytics"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition"
              >
                Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {platforms.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{item.name}</span>
                    <span className="font-mono text-zinc-400">{item.reach} reach</span>
                  </div>
                  <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Status */}
          <div className="p-6 rounded-3xl glass border border-white/[0.06] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Automation Channels
              </h3>
              <Link href="/dashboard/automation" className="text-xs text-blue-400 hover:text-blue-300 transition">
                Configure
              </Link>
            </div>

            <div className="space-y-3">
              {automationChannels.map((item, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-zinc-800/40 border border-white/[0.04] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">{item.sub}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'ACTIVE' ? 'badge-neon-emerald' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Credits Mini Meter */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  AI Credits
                </span>
                <span className="font-mono text-zinc-200 font-semibold">
                  {subscription.aiCreditsTotal - subscription.aiCreditsUsed} / {subscription.aiCreditsTotal}
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="progress-bar h-full rounded-full"
                  style={{ width: `${Math.min(100, ((subscription.aiCreditsTotal - subscription.aiCreditsUsed) / subscription.aiCreditsTotal) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Posts Activity ─────────────────────────────── */}
        <div className="p-6 rounded-3xl glass border border-white/[0.06] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Recent Post Activity - {activeWebsite?.name}
            </h3>
            <Link href="/dashboard/posts" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition">
              View All ({websitePosts.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {websitePosts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 mb-4">No posts generated yet for this workspace.</p>
                <Link
                  href="/dashboard/posts?action=create"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  Create First Post
                </Link>
              </div>
            ) : (
              websitePosts.slice(0, 8).map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.04] hover:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          post.status === 'PUBLISHED'
                            ? 'badge-neon-emerald'
                            : post.status === 'SCHEDULED'
                            ? 'badge-neon-amber'
                            : post.status === 'FAILED'
                            ? 'badge-neon-rose'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono font-semibold">
                        {post.tone}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100 truncate">{post.title}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">{post.summary}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex -space-x-1.5">
                      {post.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center text-[9px] font-black text-zinc-300"
                        >
                          {plat.charAt(0)}
                        </span>
                      ))}
                    </div>

                    {post.status === 'FAILED' && (
                      <button
                        onClick={() => retryPost(post.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
