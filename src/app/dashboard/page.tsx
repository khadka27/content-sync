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
  Calendar as CalendarIcon,
  Play,
  RotateCw,
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
    { label: 'Total Websites', value: websites.length, icon: Globe, color: 'from-blue-600 to-indigo-600', link: '/dashboard/websites' },
    { label: 'Connected Accounts', value: connectedSocialsCount, icon: Share2, color: 'from-purple-600 to-pink-600', link: '/dashboard/websites' },
    { label: 'Today’s Published Posts', value: todayPosts.length, icon: CheckCircle2, color: 'from-emerald-600 to-teal-600', link: '/dashboard/posts' },
    { label: 'Scheduled Queue', value: scheduledPosts.length, icon: Clock, color: 'from-amber-600 to-orange-600', link: '/dashboard/posts?tab=calendar' },
    { label: 'Action Needed / Failed', value: failedPosts.length, icon: AlertTriangle, color: 'from-rose-600 to-red-600', link: '/dashboard/posts?status=FAILED' },
    { label: 'AI Credits Remaining', value: subscription.aiCreditsTotal - subscription.aiCreditsUsed, icon: Sparkles, color: 'from-cyan-600 to-blue-600', link: '/dashboard/billing' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/20 p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multi-Workspace Automation Suite</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, Alex! 👋
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Currently managing <span className="font-semibold text-white">{activeWebsite?.name}</span> ({activeWebsite?.domain}). You have <span className="text-amber-400 font-semibold">{scheduledPosts.length} posts scheduled</span> across {connectedSocialsCount} connected platforms.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard/posts?action=create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create AI Post</span>
              </Link>
              <Link
                href="/dashboard/ai-lab"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium text-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Script Lab</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.link}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-400">{card.label}</span>
                  <div className={`p-2 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono tracking-tight group-hover:text-blue-400 transition">
                  {card.value}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Middle Section: Reach Chart & Quick Automation Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Overview Visual */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Cross-Platform Reach & Impressions
                </h3>
                <p className="text-xs text-zinc-400">Weekly engagement metrics for {activeWebsite?.name}</p>
              </div>
              <Link
                href="/dashboard/analytics"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Custom Interactive Bars Chart */}
            <div className="space-y-4 pt-2">
              {[
                { platform: 'Twitter / X', reach: '142,000', percentage: 85, color: 'bg-sky-500' },
                { platform: 'Instagram', reach: '180,000', percentage: 95, color: 'bg-pink-500' },
                { platform: 'LinkedIn', reach: '78,000', percentage: 65, color: 'bg-blue-600' },
                { platform: 'Threads', reach: '45,000', percentage: 48, color: 'bg-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">{item.platform}</span>
                    <span className="font-mono text-zinc-400">{item.reach} reach</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Automation Status */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Automation Channels
              </h3>
              <Link href="/dashboard/automation" className="text-xs text-blue-400 hover:underline">
                Configure
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-200">RSS Auto-Sync</p>
                  <p className="text-[10px] text-zinc-400">techpulse.io/rss.xml</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-200">WordPress Listener</p>
                  <p className="text-[10px] text-zinc-400">WP REST v2 API</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-800/50 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-200">Webhook Receiver</p>
                  <p className="text-[10px] text-zinc-400">api.contentpilot.ai/webhook</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Posts */}
        <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Recent Post Activity for {activeWebsite?.name}
            </h3>
            <Link href="/dashboard/posts" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
              View All Posts ({websitePosts.length})
            </Link>
          </div>

          <div className="space-y-3">
            {websitePosts.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-xs text-zinc-400">No posts generated for this website yet.</p>
                <Link
                  href="/dashboard/posts?action=create"
                  className="inline-flex items-center gap-2 mt-3 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Post</span>
                </Link>
              </div>
            ) : (
              websitePosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : post.status === 'SCHEDULED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : post.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold font-mono">
                        {post.tone} TONE
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100">{post.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">{post.summary}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex -space-x-1.5">
                      {post.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-300"
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
                        <span>Retry</span>
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
