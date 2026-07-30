'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { Platform } from '@/types';
import {
  Globe,
  Plus,
  Share2,
  Settings,
  Check,
  X,
  ExternalLink,
  Rss,
  Key,
  Trash2,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function WebsitesPage() {
  const {
    websites,
    activeWebsiteId,
    setActiveWebsiteId,
    addWebsite,
    deleteWebsite,
    socialAccounts,
    toggleSocialAccount,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    logo: '',
    brandColor: '#3b82f6',
    description: '',
    timezone: 'UTC',
    language: 'en',
    rssFeed: '',
    wordpressApi: '',
    webhookUrl: '',
  });

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
  const activeSocials = socialAccounts[activeWebsiteId] || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain) return;
    addWebsite({
      ...formData,
      logo: formData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    });
    setModalOpen(false);
    setFormData({
      name: '',
      domain: '',
      logo: '',
      brandColor: '#3b82f6',
      description: '',
      timezone: 'UTC',
      language: 'en',
      rssFeed: '',
      wordpressApi: '',
      webhookUrl: '',
    });
  };

  const allPlatforms: { id: Platform; label: string; iconBg: string }[] = [
    { id: 'FACEBOOK', label: 'Facebook Page', iconBg: 'bg-blue-600' },
    { id: 'INSTAGRAM', label: 'Instagram Business', iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' },
    { id: 'LINKEDIN', label: 'LinkedIn Company', iconBg: 'bg-sky-700' },
    { id: 'TWITTER', label: 'X (Twitter)', iconBg: 'bg-zinc-800' },
    { id: 'THREADS', label: 'Threads', iconBg: 'bg-zinc-900' },
    { id: 'PINTEREST', label: 'Pinterest', iconBg: 'bg-rose-600' },
    { id: 'TELEGRAM', label: 'Telegram Channel', iconBg: 'bg-sky-500' },
    { id: 'DISCORD', label: 'Discord Guild', iconBg: 'bg-indigo-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Globe className="w-6 h-6 text-blue-400" />
              Website & Brand Profiles
            </h1>
            <p className="text-xs text-zinc-400">
              Manage unlimited websites. Each website has independent social credentials, RSS feeds, and branding.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Connect New Website</span>
          </button>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {websites.map((web) => {
            const isActive = web.id === activeWebsiteId;
            const socials = socialAccounts[web.id] || [];
            const connectedCount = socials.filter((s) => s.connected).length;

            return (
              <div
                key={web.id}
                onClick={() => setActiveWebsiteId(web.id)}
                className={`p-6 rounded-3xl bg-zinc-900/90 border transition cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 border border-zinc-700 shrink-0"
                        style={{ borderColor: web.brandColor }}
                      >
                        <img src={web.logo} alt={web.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {web.name}
                          {isActive && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </h3>
                        <a
                          href={`https://${web.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-zinc-400 hover:text-blue-400 transition flex items-center gap-1"
                        >
                          <span>{web.domain}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: web.brandColor }} />
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2">{web.description || 'No description provided.'}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold text-zinc-200">{connectedCount}</span> Accounts Connected
                  </span>

                  {websites.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWebsite(web.id);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition"
                      title="Delete Website"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Website Deep Connections Section */}
        {activeWebsite && (
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  Active Configuration
                </span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Social Accounts & Sync Settings for {activeWebsite.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">Brand Hex:</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white" style={{ backgroundColor: activeWebsite.brandColor }}>
                  {activeWebsite.brandColor}
                </span>
              </div>
            </div>

            {/* Social Platform Connection Cards */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-400" />
                Connected Social Platforms (8 Supported)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allPlatforms.map((plat) => {
                  const account = activeSocials.find((s) => s.platform === plat.id);
                  const isConnected = account ? account.connected : false;

                  return (
                    <div
                      key={plat.id}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                        isConnected
                          ? 'bg-zinc-800/60 border-zinc-700'
                          : 'bg-zinc-950/40 border-zinc-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${plat.iconBg} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                          {plat.id.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-200">{plat.label}</p>
                          <p className="text-[10px] text-zinc-400">
                            {isConnected ? `@${account?.accountName || 'Connected'}` : 'Not connected'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSocialAccount(activeWebsite.id, plat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          isConnected
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                      >
                        {isConnected ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RSS & Webhooks Credentials Card */}
            <div className="pt-6 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Rss className="w-4 h-4 text-amber-400" />
                  <span>RSS Feed Endpoint</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono break-all">
                  {activeWebsite.rssFeed || 'https://techpulse.io/rss.xml'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>WordPress REST URL</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono break-all">
                  {activeWebsite.wordpressApi || 'https://techpulse.io/wp-json/wp/v2/posts'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Webhook Receiver URL</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono break-all">
                  {activeWebsite.webhookUrl || `https://api.contentpilot.ai/v1/webhook/${activeWebsite.id}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Drawer: Create Website */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-6 text-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Connect New Website</h3>
                  <p className="text-xs text-zinc-400">Configure independent branding, RSS feeds, and credentials.</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Website Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NextGen Engineering"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Domain *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. nextgen-eng.io"
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Brand Color Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.brandColor}
                        onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.brandColor}
                        onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">RSS Feed URL</label>
                    <input
                      type="url"
                      placeholder="https://website.com/rss.xml"
                      value={formData.rssFeed}
                      onChange={(e) => setFormData({ ...formData, rssFeed: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description for AI context generation..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:bg-zinc-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
