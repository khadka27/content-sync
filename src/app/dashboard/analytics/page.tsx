'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { BarChart3, TrendingUp, Eye, MousePointer, Share2, Award, RefreshCw } from 'lucide-react';

interface PlatformMetric {
  id: string;
  websiteId: string;
  platform: string;
  postsCount: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
}

export default function AnalyticsPage() {
  const { websites, activeWebsiteId } = useStore();
  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];

  const [metrics, setMetrics] = useState<PlatformMetric[]>([]);
  const [summary, setSummary] = useState({
    totalPosts: 0,
    totalImpressions: 0,
    totalReach: 0,
    totalClicks: 0,
    avgCtr: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!activeWebsiteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?websiteId=${activeWebsiteId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSummary(json.data.summary || {});
        setMetrics(json.data.platformBreakdown || []);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeWebsiteId]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              Performance & Analytics
            </h1>
            <p className="text-xs text-zinc-400">
              Live performance metrics for <span className="text-white font-semibold">{activeWebsite?.name || 'Selected Workspace'}</span>.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-400" /> Total Impressions
            </span>
            <p className="text-2xl font-extrabold text-white font-mono">{summary.totalImpressions.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Total Reach
            </span>
            <p className="text-2xl font-extrabold text-white font-mono">{summary.totalReach.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
              <MousePointer className="w-4 h-4 text-amber-400" /> Total Clicks
            </span>
            <p className="text-2xl font-extrabold text-white font-mono">{summary.totalClicks.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" /> Average CTR %
            </span>
            <p className="text-2xl font-extrabold text-white font-mono">{summary.avgCtr}%</p>
          </div>
        </div>

        {/* Platform breakdown table */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            Per-Platform Analytics Breakdown
          </h3>

          {metrics.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <BarChart3 className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No social platforms connected for this website yet.</p>
            </div>
          ) : (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-200">
                  {metrics.map((m) => (
                    <tr key={m.id || m.platform} className="hover:bg-zinc-800/40 transition">
                      <td className="p-3 font-sans font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        {m.platform}
                      </td>
                      <td className="p-3">{m.postsCount}</td>
                      <td className="p-3">{m.impressions.toLocaleString()}</td>
                      <td className="p-3">{m.reach.toLocaleString()}</td>
                      <td className="p-3">{m.clicks.toLocaleString()}</td>
                      <td className="p-3 text-emerald-400">{m.ctr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
