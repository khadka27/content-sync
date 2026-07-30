import Link from 'next/link';
import {
  Sparkles,
  Globe,
  Share2,
  Zap,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
  FileEdit,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500 selection:text-white font-sans">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            CP
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
            ContentPilot AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 space-y-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Sparkles className="w-4 h-4" />
            <span>Next.js 16 Multi-Workspace Social Automation Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Automate Social Media Distribution Across{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Unlimited Websites
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ContentPilot AI automatically scrapes blog posts, transforms URLs into targeted multi-platform posts, generates carousel slide decks & video scripts, and schedules content seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-2xl shadow-blue-600/30 transition flex items-center justify-center gap-3"
            >
              <span>Open ContentPilot AI App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/posts"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm transition text-center"
            >
              Try URL Scraper & AI Studio
            </Link>
          </div>
        </div>

        {/* Product Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit border border-blue-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Unlimited Website Workspaces</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Manage separate branding, logo watermark, timezones, RSS feeds, and credentials per website.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">8 Social Connections</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Facebook Page, Instagram, LinkedIn Company, X (Twitter), Threads, Pinterest, Telegram, and Discord.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Automated RSS & Webhooks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-sync blog updates via RSS feeds, WordPress REST API listeners, or incoming webhooks.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
