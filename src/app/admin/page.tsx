'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  Server,
  Globe,
  Database,
  Cpu,
  Clock,
  RefreshCw,
  Activity,
  UserCheck,
  UserX,
  Trash2,
  LogOut,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface SystemStats {
  counts: {
    usersCount: number;
    workspacesCount: number;
    websitesCount: number;
    postsCount: number;
    socialAccountsCount: number;
  };
  systemHealth: {
    dbStatus: string;
    dbLatencyMs: number;
    memoryUsedMb: number;
    memoryTotalMb: number;
    nodeVersion: string;
    uptimeSeconds: number;
  };
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  workspacesCount: number;
  createdAt: string;
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/system');
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      console.error('User deletion failed:', err);
    }
  };

  const handleAdminLogout = () => {
    document.cookie = 'contentsync_admin_token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Super Admin Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Super Admin Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SYSTEM OVERSEER
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">Content Sync Operations & Security</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshAll}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white text-xs font-semibold text-rose-400 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Overview & Health</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({users.length})</span>
          </button>
        </div>

        {/* Tab 1: System Overview & Health */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Real Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-400" /> Total Users
                </span>
                <p className="text-2xl font-extrabold text-white font-mono">
                  {stats?.counts.usersCount || 0} Registered
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-purple-400" /> Total Workspaces
                </span>
                <p className="text-2xl font-extrabold text-white font-mono">
                  {stats?.counts.workspacesCount || 0} Workspaces
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" /> Active Websites
                </span>
                <p className="text-2xl font-extrabold text-white font-mono">
                  {stats?.counts.websitesCount || 0} Domains
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Social Accounts
                </span>
                <p className="text-2xl font-extrabold text-white font-mono">
                  {stats?.counts.socialAccountsCount || 0} Connected
                </p>
              </div>
            </div>

            {/* System Health Diagnostics */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-400" />
                Live Database & Infrastructure Diagnostics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">PostgreSQL Latency</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-bold text-sm">
                      {stats?.systemHealth.dbLatencyMs || 0} ms ({stats?.systemHealth.dbStatus || 'HEALTHY'})
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">Server Heap Memory</span>
                  <span className="text-white font-bold text-sm">
                    {stats?.systemHealth.memoryUsedMb || 0} MB / {stats?.systemHealth.memoryTotalMb || 0} MB
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">Node Environment & Uptime</span>
                  <span className="text-white font-bold text-sm">
                    {stats?.systemHealth.nodeVersion || 'v20.x'} • {stats?.systemHealth.uptimeSeconds || 0}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-400" />
                  User Accounts Directory
                </h2>
                <p className="text-xs text-zinc-400">View and manage registered user permissions across all workspaces.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Workspaces</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-800/40 transition">
                      <td className="p-4 font-bold text-white font-sans">{user.name}</td>
                      <td className="p-4 text-zinc-300">{user.email}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                        >
                          <option value="OWNER">OWNER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR</option>
                        </select>
                      </td>
                      <td className="p-4">{user.workspacesCount} Workspace(s)</td>
                      <td className="p-4 text-zinc-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
