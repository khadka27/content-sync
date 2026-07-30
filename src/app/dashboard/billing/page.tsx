'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { CreditCard, Sparkles, Check, Zap } from 'lucide-react';

export default function BillingPage() {
  const { subscription } = useStore();

  const plans = [
    { name: 'Starter', price: '$29/mo', credits: '300 Credits/mo', websites: '3 Websites', features: ['Basic AI Generation', 'RSS Feed Sync', 'Email Notifications'] },
    { name: 'Pro Plan', price: '$79/mo', credits: '1,000 Credits/mo', websites: 'Unlimited Websites', current: true, features: ['Unlimited Websites', 'All 8 Social Connections', 'AI Carousel & Script Lab', 'WordPress & Webhook Auto-Sync', 'Priority Support'] },
    { name: 'Agency / Enterprise', price: '$199/mo', credits: '5,000 Credits/mo', websites: 'Unlimited Workspaces', features: ['Custom AI fine-tuning', 'Dedicated BullMQ queue worker', 'White-label reporting', '24/7 SLA uptime guarantee'] },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Billing & Subscription Quotas
          </h1>
          <p className="text-xs text-zinc-400">
            Manage your subscription plan, AI credit balance, and team seat usage.
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              CURRENT PLAN: {subscription.plan}
            </span>
            <h2 className="text-xl font-bold text-white">Pro Plan Subscription Active</h2>
            <p className="text-xs text-zinc-300">
              Renews automatically on <span className="font-mono font-bold text-white">{subscription.renewalDate}</span>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2 min-w-64">
            <div className="flex justify-between text-xs font-bold text-zinc-200">
              <span>AI Credit Balance</span>
              <span className="font-mono text-blue-400">{subscription.aiCreditsTotal - subscription.aiCreditsUsed} / {subscription.aiCreditsTotal}</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(subscription.aiCreditsUsed / subscription.aiCreditsTotal) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${
                plan.current ? 'bg-zinc-900 border-blue-500 ring-1 ring-blue-500/40' : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.current && <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Current</span>}
                </div>

                <div className="text-3xl font-extrabold text-white font-mono">{plan.price}</div>
                <p className="text-xs text-zinc-400 font-semibold">{plan.credits} • {plan.websites}</p>

                <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs text-zinc-300">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={plan.current}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                  plan.current ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                }`}
              >
                {plan.current ? 'Current Active Plan' : 'Upgrade Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
