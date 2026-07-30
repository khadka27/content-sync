'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Settings, Key, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [openAiKey, setOpenAiKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('whsec_live_948201849204819');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-zinc-400" />
            Workspace & API Credentials Settings
          </h1>
          <p className="text-xs text-zinc-400">
            Configure global OpenAI API keys, webhook secret tokens, and notification integrations.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6 max-w-2xl">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              API Key Management
            </h3>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">OpenAI API Key (Optional Override)</label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-zinc-500 mt-1">If blank, standard server environment credentials will be used.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Global Webhook Verification Secret</label>
              <input
                type="text"
                readOnly
                value={webhookSecret}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Notification Dispatch Channels
            </h3>

            {['Browser Notifications', 'Email Alerts', 'Discord Webhook Integration', 'Telegram Bot Alerts'].map((channel) => (
              <label key={channel} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-200">
                <span>{channel}</span>
                <input type="checkbox" defaultChecked className="rounded bg-zinc-800 border-zinc-700 text-blue-600 focus:ring-0" />
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saved ? 'Saved Changes!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
