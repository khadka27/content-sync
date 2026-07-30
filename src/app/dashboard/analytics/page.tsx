'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { BarChart3, TrendingUp, Eye, MousePointer, Share2, Award } from 'lucide-react';

export default function AnalyticsPage() {
  const { websites, activeWebsiteId, analytics } = useStore();
  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
  const activeMetrics = analytics.filter((a) => a.websiteId === activeWebsiteId);

  const totalImpressions = activeMetrics.reduce((acc, m) => acc + m.impressions, 0);
  const totalReach = activeMetrics.reduce((acc, m) => acc + m.reach, 0);
  const totalClicks = activeMetrics.reduce((acc, m) => acc + m.clicks, 0);
  const avgCtr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Performance & Analytics
          </h1>
          <p className="text-xs text-zinc-400">
            Per-website and per-platform performance breakdown for <span className="text-white font-semibold">{activeWebsite?.name}</span>.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-400" /> Total Impressions</span>
            <p className="text-2xl font-extrabold text-white font-mono">{totalImpressions.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-400" /> Total Reach</span>
            <p className="text-2xl font-extrabold text-white font-mono">{totalReach.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><MousePointer className="w-4 h-4 text-amber-400" /> Total Clicks</span>
            <p className="text-2xl font-extrabold text-white font-mono">{totalClicks.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Award className="w-4 h-4 text-purple-400" /> Average CTR %</span>
            <p className="text-2xl font-extrabold text-white font-mono">{avgCtr}%</p>
          </div>
        </div>

        {/* Platform breakdown table */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            Per-Platform Metrics Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Posts Published</th>
                  <th className="p-3">Impressions</th>
                  <th className="p-3">Reach</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">CTR %</th>
                  <th className="p-3">Follower Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-200">
                {activeMetrics.map((m) => (
                  <tr key={m.platform} className="hover:bg-zinc-800/40 transition">
                    <td className="p-3 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      {m.platform}
                    </td>
                    <td className="p-3">{m.postsCount}</td>
                    <td className="p-3">{m.impressions.toLocaleString()}</td>
                    <td className="p-3">{m.reach.toLocaleString()}</td>
                    <td className="p-3">{m.clicks.toLocaleString()}</td>
                    <td className="p-3 text-emerald-400">{m.ctr}%</td>
                    <td className="p-3 text-blue-400">+{m.followerGrowth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
