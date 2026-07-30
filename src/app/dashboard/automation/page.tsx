'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { AutomationType, Tone } from '@/types';
import { Zap, Rss, Globe, Key, Plus, RefreshCw, CheckCircle2, Sliders, X } from 'lucide-react';

export default function AutomationPage() {
  const { websites, activeWebsiteId, automations, addAutomation, toggleAutomation, triggerSync } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'RSS' as AutomationType,
    targetUrl: '',
    autoPublish: false,
    defaultTone: 'MARKETING' as Tone,
  });

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
  const activeAutomations = automations.filter((a) => a.websiteId === activeWebsiteId);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await triggerSync(id);
    setTimeout(() => setSyncingId(null), 1200);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addAutomation({
      ...formData,
      websiteId: activeWebsiteId,
      active: true,
    });
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-amber-400" />
              Automated Content Sync Hub
            </h1>
            <p className="text-xs text-zinc-400">
              Configure automatic RSS feed listeners, WordPress REST APIs, and Webhook triggers for <span className="text-white font-semibold">{activeWebsite?.name}</span>.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Automation Rule</span>
          </button>
        </div>

        {/* Automations List */}
        <div className="space-y-4">
          {activeAutomations.length === 0 ? (
            <div className="p-10 rounded-3xl bg-zinc-900/90 border border-zinc-800 text-center space-y-3">
              <Zap className="w-8 h-8 text-zinc-500 mx-auto" />
              <p className="text-sm font-semibold text-zinc-200">No automation rules configured for this website.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Create First Rule
              </button>
            </div>
          ) : (
            activeAutomations.map((rule) => (
              <div
                key={rule.id}
                className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono">
                      {rule.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rule.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {rule.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{rule.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono break-all">{rule.targetUrl || 'Webhook endpoint'}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleSync(rule.id)}
                    disabled={syncingId === rule.id}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === rule.id ? 'animate-spin' : ''}`} />
                    <span>Sync Now</span>
                  </button>

                  <button
                    onClick={() => toggleAutomation(rule.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      rule.active ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {rule.active ? 'Pause' : 'Enable'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Drawer */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-6 text-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold text-white">Create Automation Rule</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily TechPulse RSS Auto-Publisher"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as AutomationType })}
                      className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                    >
                      <option value="RSS">RSS Feed</option>
                      <option value="WORDPRESS">WordPress REST API</option>
                      <option value="WEBHOOK">Incoming Webhook</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Default AI Tone</label>
                    <select
                      value={formData.defaultTone}
                      onChange={(e) => setFormData({ ...formData, defaultTone: e.target.value as Tone })}
                      className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                    >
                      <option value="PROFESSIONAL">Professional</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="EDUCATIONAL">Educational</option>
                      <option value="FRIENDLY">Friendly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Endpoint / Feed URL</label>
                  <input
                    type="url"
                    placeholder="https://website.com/rss.xml"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
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
                    Save Rule
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
