import Link from 'next/link';
import {
  Sparkles,
  Globe,
  Share2,
  Zap,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  FileEdit,
  CheckCircle2,
  Cpu,
  Video,
  Rss,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    color: 'from-blue-600 to-cyan-500',
    glow: 'shadow-blue-500/20',
    title: 'Unlimited Workspaces',
    desc: 'Manage separate branding, timezones, RSS feeds, and credentials per website.',
  },
  {
    icon: Share2,
    color: 'from-violet-600 to-purple-500',
    glow: 'shadow-purple-500/20',
    title: '10 Social Platforms',
    desc: 'Facebook, Instagram, LinkedIn, X, TikTok, Threads, Pinterest, Telegram, Discord & YouTube.',
  },
  {
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
    title: 'Automated RSS & Webhooks',
    desc: 'Auto-sync blog updates via RSS feeds, WordPress REST API listeners, or incoming webhooks.',
  },
  {
    icon: Cpu,
    color: 'from-emerald-600 to-teal-500',
    glow: 'shadow-emerald-500/20',
    title: 'AI Content Engine',
    desc: 'GPT-powered captions, hashtags, carousel scripts, and video descriptions generated in seconds.',
  },
  {
    icon: Video,
    color: 'from-rose-600 to-pink-500',
    glow: 'shadow-rose-500/20',
    title: 'TikTok Content API v2',
    desc: 'Upload & publish short video clips directly via TikTok official Content Posting API v2.',
  },
  {
    icon: BarChart3,
    color: 'from-sky-600 to-blue-500',
    glow: 'shadow-sky-500/20',
    title: 'Analytics & Insights',
    desc: 'Track impressions, reach, clicks, and CTR across all connected social accounts in real-time.',
  },
];

const stats = [
  { value: '50K+', label: 'Posts Published', icon: FileEdit },
  { value: '200+', label: 'Happy Teams', icon: Users },
  { value: '99.9%', label: 'Uptime SLA', icon: ShieldCheck },
  { value: '10x', label: 'Content Velocity', icon: TrendingUp },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh text-zinc-100 selection:bg-blue-500 selection:text-white overflow-hidden">

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-sm shadow-lg glow-sm-blue">
                CP
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 status-dot-active" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight gradient-text">
                Content Sync
              </span>
              <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full badge-neon-blue uppercase tracking-widest">
                v2.4
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#stats" className="hover:text-white transition-colors">Stats</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Legal</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all btn-glow flex items-center gap-2"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────── */}
      <main>
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center overflow-hidden">
          {/* Background Orbs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
            <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px]" />
            <div className="absolute top-10 right-0 w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-[100px]" />
          </div>

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold badge-neon-blue mb-6 animate-slide-up">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next.js 16 · Multi-Workspace · 10 Social Platforms</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-6 font-display animate-slide-up" style={{ animationDelay: '0.05s' }}>
            Automate Social Media
            <br />
            <span className="gradient-text">Distribution at Scale</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Content Sync scrapes blog posts, transforms URLs into platform-native posts, generates carousel decks & video scripts, and auto-publishes on your schedule — across every major social network.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient hover:opacity-90 text-white font-bold text-sm shadow-2xl shadow-blue-700/30 transition-all btn-glow flex items-center justify-center gap-3"
            >
              <span>Open Content Sync</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/posts"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-light hover:bg-white/[0.06] border border-white/10 text-zinc-200 font-bold text-sm transition-all text-center flex items-center justify-center gap-2"
            >
              <FileEdit className="w-4 h-4 text-zinc-400" />
              <span>Try AI Post Studio</span>
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center justify-center gap-1.5 mt-10 text-xs text-zinc-500">
            <div className="flex -space-x-2">
              {['bg-blue-600','bg-purple-600','bg-emerald-600','bg-amber-600','bg-rose-600'].map((c,i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white`}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5 ml-3">
              {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
            </div>
            <span className="ml-1">Trusted by <span className="text-zinc-300 font-semibold">200+ content teams</span></span>
          </div>
        </section>

        {/* ── Stats Bar ────────────────────────────────────────── */}
        <section id="stats" className="border-y border-white/[0.06] py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="text-center space-y-1">
                    <Icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-black gradient-text-blue">{s.value}</div>
                    <div className="text-xs text-zinc-400">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features Grid ────────────────────────────────────── */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-neon-purple text-xs font-bold mb-4">
              <Rss className="w-3.5 h-3.5 text-purple-400" />
              <span>Everything you need</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white">
              Built for serious content teams
            </h2>
            <p className="text-zinc-400 text-sm mt-3 max-w-lg mx-auto">
              A fully-integrated content automation stack - from scraping to scheduling to publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-3xl glass border border-white/[0.06] card-hover relative overflow-hidden"
                >
                  {/* Card background glow */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-tr ${f.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center shadow-lg shadow-${f.glow} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 border border-blue-500/20 p-10 text-center">
            {/* Background orb */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                Ready to Accelerate Your Social Growth?
              </h2>
              <p className="text-sm text-zinc-300 max-w-lg mx-auto">
                Join 200+ teams already using Content Sync to automate their entire social media workflow.
              </p>

              <div className="pt-4 flex justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-2xl bg-white text-zinc-950 font-extrabold text-sm hover:bg-zinc-100 transition shadow-2xl flex items-center gap-2"
                >
                  <span>Launch Content Sync →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12 glass">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              CS
            </div>
            <span className="font-bold text-zinc-300 text-sm">Content Sync</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Post Studio', href: '/dashboard/posts' },
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Data Deletion', href: '/data-deletion' },
              { label: 'Settings', href: '/dashboard/settings' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="text-zinc-600 font-mono text-[11px]">
            &copy; {new Date().getFullYear()} Content Sync Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
