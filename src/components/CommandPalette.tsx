'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  Search,
  LayoutDashboard,
  Globe,
  FileEdit,
  Calendar,
  Sparkles,
  Zap,
  FileImage,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  ShieldAlert,
  X,
} from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, websites, setActiveWebsiteId } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Manage Websites', path: '/dashboard/websites', icon: Globe, category: 'Navigation' },
    { label: 'Post Studio & Builder', path: '/dashboard/posts', icon: FileEdit, category: 'Navigation' },
    { label: 'Visual Content Calendar', path: '/dashboard/posts?tab=calendar', icon: Calendar, category: 'Navigation' },
    { label: 'AI Script & Reel Generator', path: '/dashboard/ai-lab', icon: Sparkles, category: 'AI Tools' },
    { label: 'Automation Rules (RSS / Webhook)', path: '/dashboard/automation', icon: Zap, category: 'Navigation' },
    { label: 'Media Library', path: '/dashboard/media', icon: FileImage, category: 'Navigation' },
    { label: 'Analytics & Reach', path: '/dashboard/analytics', icon: BarChart3, category: 'Navigation' },
    { label: 'Team & Permissions', path: '/dashboard/team', icon: Users, category: 'Navigation' },
    { label: 'Billing & AI Credits', path: '/dashboard/billing', icon: CreditCard, category: 'Navigation' },
    { label: 'Workspace Settings', path: '/dashboard/settings', icon: Settings, category: 'Navigation' },
    { label: 'Super Admin Portal', path: '/dashboard/admin', icon: ShieldAlert, category: 'Admin' },
  ];

  const filteredNav = navItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredWebsites = websites.filter(
    (w) => w.name.toLowerCase().includes(query.toLowerCase()) || w.domain.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 mx-4">
        {/* Input header */}
        <div className="relative flex items-center px-4 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command, page, or search website... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Switch Websites */}
          {filteredWebsites.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Switch Website Context
              </div>
              <div className="space-y-1 mt-1">
                {filteredWebsites.map((web) => (
                  <button
                    key={web.id}
                    onClick={() => {
                      setActiveWebsiteId(web.id);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm hover:bg-zinc-800 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: web.brandColor }}
                      />
                      <span className="font-medium text-zinc-200">{web.name}</span>
                      <span className="text-xs text-zinc-500">{web.domain}</span>
                    </div>
                    <span className="text-xs text-blue-400 font-mono">Activate</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Commands */}
          <div>
            <div className="px-3 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Navigation & Actions
            </div>
            <div className="space-y-1 mt-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-zinc-800 transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-zinc-200 group-hover:text-white transition">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-300">Jump</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono text-[10px] text-zinc-300">
              ⌘K
            </kbd>
            <span>or</span>
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono text-[10px] text-zinc-300">
              Ctrl+K
            </kbd>
            <span>to open palette anytime</span>
          </div>
          <span>ContentPilot AI v2.4</span>
        </div>
      </div>
    </div>
  );
}
