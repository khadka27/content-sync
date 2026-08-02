'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { CommandPalette } from '@/components/CommandPalette';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Globe,
  FileEdit,
  Sparkles,
  Zap,
  FileImage,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  ShieldAlert,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  Check,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const {
    websites,
    activeWebsiteId,
    setActiveWebsiteId,
    fetchInitialData,
    subscription,
    notifications,
    markNotificationRead,
    clearNotifications,
    setCommandPaletteOpen,
  } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const [websiteDropdownOpen, setWebsiteDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Websites', path: '/dashboard/websites', icon: Globe, badge: websites.length },
    { label: 'Posts Studio', path: '/dashboard/posts', icon: FileEdit },
    { label: 'AI Script Lab', path: '/dashboard/ai-lab', icon: Sparkles, highlight: true },
    { label: 'Automation Sync', path: '/dashboard/automation', icon: Zap },
    { label: 'Media Library', path: '/dashboard/media', icon: FileImage },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Team', path: '/dashboard/team', icon: Users },
    { label: 'Billing & Usage', path: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      <CommandPalette />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
            CS
          </div>
          <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
            Content Sync
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-zinc-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 glass border-r border-white/[0.05] flex flex-col justify-between p-4 z-40 ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-5">
          {/* Brand Logo Header */}
          <div className="hidden md:flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-xs shadow-lg glow-sm-blue">
                  CS
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 status-dot-active" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm leading-tight gradient-text tracking-tight">Content Sync</h1>
                <p className="text-[10px] text-zinc-500">Multi-Workspace Suite</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold badge-neon-blue">
              PRO
            </span>
          </div>

          {/* Active Website Picker */}
          <div className="relative">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 px-2 block mb-1.5">
              Active Workspace
            </label>
            <button
              onClick={() => setWebsiteDropdownOpen(!websiteDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 bg-zinc-800/50 hover:bg-zinc-800/80 border border-white/[0.06] hover:border-white/[0.10] rounded-xl transition text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: activeWebsite?.brandColor || '#3b82f6' }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white">
                    {activeWebsite?.name || 'Select Website'}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{activeWebsite?.domain}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            </button>

            {websiteDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 glass border border-white/[0.08] rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in duration-150">
                {websites.map((web) => (
                  <button
                    key={web.id}
                    onClick={() => {
                      setActiveWebsiteId(web.id);
                      setWebsiteDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition text-left mb-0.5 ${
                      web.id === activeWebsiteId
                        ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20'
                        : 'text-zinc-300 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: web.brandColor }} />
                      <span className="truncate">{web.name}</span>
                    </div>
                    {web.id === activeWebsiteId && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-white/[0.06] pt-1.5 mt-1">
                  <Link
                    href="/dashboard/websites?action=new"
                    onClick={() => setWebsiteDropdownOpen(false)}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-blue-400 hover:bg-blue-500/10 transition font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect New Website</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition sidebar-link ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 active'
                      : link.highlight
                      ? 'text-purple-300 hover:bg-purple-500/10 hover:text-purple-200'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800/80 border border-white/[0.06] text-zinc-300">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - AI Credits Meter */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Credits
              </span>
              <span className="text-zinc-200 font-bold font-mono">
                {subscription.aiCreditsTotal - subscription.aiCreditsUsed} / {subscription.aiCreditsTotal}
              </span>
            </div>
            <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subscription.aiCreditsUsed / subscription.aiCreditsTotal) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Queue: Active</span>
            </span>
            <div className="flex items-center gap-2 text-zinc-500">
              <Link href="/terms" className="hover:text-zinc-300 transition">
                Terms
              </Link>
              <span>&bull;</span>
              <Link href="/privacy" className="hover:text-zinc-300 transition">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 glass border-b border-white/[0.05] flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Quick Search Button / Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2 bg-zinc-800/40 hover:bg-zinc-800/70 border border-white/[0.06] hover:border-white/[0.10] rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition w-64 md:w-80"
          >
            <Search className="w-4 h-4 text-zinc-500" />
            <span className="truncate text-zinc-500">Search commands, posts, tools...</span>
            <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-zinc-900/80 border border-white/[0.06] rounded-lg text-zinc-500">
              ⌘K
            </kbd>
          </button>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-zinc-950 animate-pulse-glow" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass border border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">Activity Notifications</span>
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-zinc-400 hover:text-zinc-200 transition"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-6">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs transition cursor-pointer ${
                            n.read ? 'bg-zinc-900/40 text-zinc-400' : 'bg-zinc-800/60 text-zinc-200 font-medium border border-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {n.type === 'SUCCESS' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span className="font-semibold">{n.title}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-snug">{n.message}</p>
                          <span className="text-[9px] text-zinc-500 block mt-1">{n.createdAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile & Sign Out */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg">
                  <img
                    src={session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="User avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 status-dot-active" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-zinc-100">{session?.user?.name || 'Alex Rivera'}</p>
                <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">{session?.user?.email || 'Owner & SaaS Admin'}</p>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-mesh">{children}</main>
      </div>
    </div>
  );
}
