'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ShieldAlert, Server, Activity, Users, Database, Cpu, CheckCircle2, Clock } from 'lucide-react';

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            Super Admin Portal & System Health
          </h1>
          <p className="text-xs text-zinc-400">
            Monitor background jobs, BullMQ / Redis queues, user accounts, and API logs.
          </p>
        </div>

        {/* System Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Server className="w-4 h-4 text-emerald-400" /> BullMQ Workers</span>
            <p className="text-xl font-extrabold text-white font-mono">4 Workers Active</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Database className="w-4 h-4 text-rose-400" /> Redis Queue Jobs</span>
            <p className="text-xl font-extrabold text-white font-mono">1,420 Completed / 0 Waiting</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-400" /> Registered Users</span>
            <p className="text-xl font-extrabold text-white font-mono">842 Accounts</p>
          </div>

          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Cpu className="w-4 h-4 text-purple-400" /> PostgreSQL Pool</span>
            <p className="text-xl font-extrabold text-white font-mono">12 / 100 Conn</p>
          </div>
        </div>

        {/* Queue & Logs table */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Live Queue Job Logs
          </h3>

          <div className="space-y-2 font-mono text-xs">
            {[
              { id: 'job-984', name: 'RSS Auto Sync - TechPulse Daily', status: 'COMPLETED', duration: '142ms', time: 'Just now' },
              { id: 'job-983', name: 'Publish Post to LinkedIn Company', status: 'COMPLETED', duration: '310ms', time: '2 mins ago' },
              { id: 'job-982', name: 'Scrape Article HTML Content', status: 'COMPLETED', duration: '240ms', time: '5 mins ago' },
              { id: 'job-981', name: 'OpenAI Prompt Completion Payload', status: 'COMPLETED', duration: '890ms', time: '10 mins ago' },
            ].map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-zinc-200">{log.name}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">ID: {log.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-zinc-400">
                  <span>{log.duration}</span>
                  <span className="text-zinc-500">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
