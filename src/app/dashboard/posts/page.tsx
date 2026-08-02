'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { Platform, Tone, PostStatus } from '@/types';
import {
  FileEdit,
  Calendar as CalendarIcon,
  Sparkles,
  Link2,
  Globe,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RotateCw,
  Search,
  Filter,
  Trash2,
  Eye,
  Send,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Check,
  Lock,
  ShieldCheck,
  Video,
} from 'lucide-react';

export default function PostsPage() {
  const {
    websites,
    activeWebsiteId,
    posts,
    socialAccounts,
    fetchSocialAccounts,
    addPost,
    updatePostStatus,
    deletePost,
    retryPost,
    useAiCredits,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'studio' | 'calendar' | 'all'>('studio');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // URL Scraper State
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // AI Builder State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTone, setPostTone] = useState<Tone>('PROFESSIONAL');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['TWITTER', 'LINKEDIN']);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [platformCopies, setPlatformCopies] = useState<Record<string, string>>({
    TWITTER: '🚀 Excited to share our latest update!\n\nCheck it out here: https://contentpilot.ai #AI #SaaS',
    LINKEDIN: 'Multi-workspace social automation is changing how digital brands publish content. Here is our latest deep dive.\n\n#SaaS #Growth #Automation',
  });
  const [scheduleDate, setScheduleDate] = useState('2026-08-01T10:00');

  // TikTok Settings State
  const [tiktokPrivacy, setTiktokPrivacy] = useState<'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY'>('PUBLIC_TO_EVERYONE');
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState(true);
  const [tiktokAllowComment, setTiktokAllowComment] = useState(true);
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState(true);
  // Per-account targeting: platformId -> accountIds[]
  const [targetAccountIds, setTargetAccountIds] = useState<Record<string, string[]>>({});

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
  const activeSocials = socialAccounts[activeWebsiteId] || [];

  useEffect(() => {
    if (activeWebsiteId) {
      fetchSocialAccounts(activeWebsiteId);
    }
  }, [activeWebsiteId]);

  const filteredPosts = posts
    .filter((p) => p.websiteId === activeWebsiteId)
    .filter((p) => (statusFilter === 'ALL' ? true : p.status === statusFilter));

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPostTitle(data.data.title);
        setPostContent(data.data.content);
        if (data.data.featuredImage) {
          setSelectedMedia([data.data.featuredImage]);
        }
        await handleGenerateAi(data.data.title, data.data.content);
      }
    } catch {
      setPostTitle('Imported Article from URL');
    } finally {
      setIsScraping(false);
    }
  };

  const handleGenerateAi = async (titleOverride?: string, contentOverride?: string) => {
    if (!useAiCredits(10)) {
      alert('Out of AI Credits! Please upgrade your plan in Billing.');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleOverride || postTitle,
          content: contentOverride || postContent,
          tone: postTone,
          websiteName: activeWebsite?.name,
        }),
      });
      const data = await res.json();
      if (data.success && data.data.platformCopies) {
        setPlatformCopies(data.data.platformCopies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePost = (status: PostStatus) => {
    if (!activeWebsite) {
      alert('Please connect a website first!');
      return;
    }

    if (!postTitle) {
      alert('Please enter a post title or paste an article URL.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform to publish.');
      return;
    }

    // Check connected status
    const unconnectedSelected = selectedPlatforms.filter((p) => {
      const acc = activeSocials.find((s) => s.platform === p);
      return !acc || !acc.connected;
    });

    if (unconnectedSelected.length > 0 && status === 'PUBLISHED') {
      const names = unconnectedSelected.join(', ');
      alert(`Authorization Notice: You must connect and log in to ${names} under "Websites" before publishing directly.`);
    }

    addPost({
      websiteId: activeWebsiteId,
      title: postTitle,
      summary: postContent,
      originalUrl: scrapeUrl || undefined,
      tone: postTone,
      platforms: selectedPlatforms,
      platformCopies: platformCopies as Record<Platform, string>,
      targetAccountIds: allTargetAccountIds.length > 0 ? allTargetAccountIds : undefined,
      hashtags: ['#AI', '#Automation', '#Growth2026'],
      cta: 'Learn more on ContentPilot AI',
      emojis: true,
      mediaUrls: selectedMedia,
      status,
      scheduledAt: status === 'SCHEDULED' ? scheduleDate : undefined,
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    });

    alert(`Post ${status === 'PUBLISHED' ? 'published immediately' : status === 'SCHEDULED' ? 'scheduled successfully' : 'saved to drafts'}!`);
  };

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p));
      // Clear account selections for this platform
      setTargetAccountIds((prev) => { const n = { ...prev }; delete n[p]; return n; });
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
      // Auto-select all connected accounts for this platform
      const platAccounts = activeSocials.filter((s) => s.platform === p && s.connected && s.isActive);
      if (platAccounts.length > 0) {
        setTargetAccountIds((prev) => ({ ...prev, [p]: platAccounts.map((a) => a.id) }));
      }
    }
  };

  const toggleAccountTarget = (platform: Platform, accountId: string) => {
    setTargetAccountIds((prev) => {
      const current = prev[platform] || [];
      const updated = current.includes(accountId)
        ? current.filter((id) => id !== accountId)
        : [...current, accountId];
      return { ...prev, [platform]: updated };
    });
  };

  // Flatten all selected accountIds
  const allTargetAccountIds = Object.values(targetAccountIds).flat();

  const allPlatformsList: Platform[] = [
    'FACEBOOK',
    'INSTAGRAM',
    'TIKTOK',
    'LINKEDIN',
    'YOUTUBE',
    'TWITTER',
    'THREADS',
    'PINTEREST',
    'TELEGRAM',
    'DISCORD',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <FileEdit className="w-6 h-6 text-blue-400" />
              Post Studio & Visual Calendar
            </h1>
            <p className="text-xs text-zinc-400">
              Create, AI-generate, preview, and schedule multi-platform posts for <span className="text-white font-semibold">{activeWebsite?.name || 'Selected Website'}</span>.
            </p>
          </div>

          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'studio' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio & Importer</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'calendar' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Visual Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>All Posts ({filteredPosts.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: STUDIO & IMPORTER */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form & URL Scraper */}
            <div className="lg:col-span-7 space-y-6">
              {/* URL Import Card */}
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-blue-400" />
                    Automated Article URL Import Scraper
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    AUTO SCRAPE
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://website.com/blog/article-post"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleScrape}
                    disabled={isScraping}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition flex items-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {isScraping ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Scrape & Generate</span>
                  </button>
                </div>
              </div>

              {/* Main Builder Inputs */}
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Post Title / Topic *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Performance Hacks for Next.js 16 App Router"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Main Summary / Article Context</label>
                  <textarea
                    rows={3}
                    placeholder="Key takeaways, core findings, or link details..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Tone & AI Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">AI Tone Engine</label>
                    <div className="flex flex-wrap gap-2">
                      {(['PROFESSIONAL', 'MARKETING', 'EDUCATIONAL', 'FRIENDLY'] as Tone[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPostTone(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            postTone === t
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateAi()}
                    disabled={isGenerating}
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 self-start sm:self-auto shrink-0"
                  >
                    {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Regenerate Copy with AI (10 Credits)</span>
                  </button>
                </div>

                {/* Target Platforms + Per-Account Selector */}
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">
                      Target Platforms & Accounts
                    </label>
                    <span className="text-[10px] text-zinc-500">
                      {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} · {allTargetAccountIds.length} account{allTargetAccountIds.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    {allPlatformsList.map((plat) => {
                      const isSelected = selectedPlatforms.includes(plat);
                      const platAccounts = activeSocials.filter((s) => s.platform === plat);
                      const connectedAccounts = platAccounts.filter((a) => a.connected);
                      const hasMultiple = connectedAccounts.length > 1;
                      const selectedAccountIds = targetAccountIds[plat] || [];

                      return (
                        <div key={plat} className={`rounded-2xl border transition overflow-hidden ${
                          isSelected ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/[0.04] bg-zinc-900/40'
                        }`}>
                          {/* Platform toggle header */}
                          <button
                            type="button"
                            onClick={() => togglePlatform(plat)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.02] transition text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                                isSelected ? 'bg-blue-600 border-blue-600' : 'border-zinc-600'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-xs font-semibold text-zinc-200">{plat}</span>
                              {connectedAccounts.length > 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  {connectedAccounts.length} account{connectedAccounts.length !== 1 ? 's' : ''}
                                </span>
                              )}
                              {connectedAccounts.length === 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                                  <Lock className="w-3 h-3" /> not connected
                                </span>
                              )}
                            </div>
                            {isSelected && hasMultiple && (
                              <span className="text-[10px] text-blue-400">
                                {selectedAccountIds.length}/{connectedAccounts.length} selected
                              </span>
                            )}
                          </button>

                          {/* Per-account checkboxes (only when platform selected & has accounts) */}
                          {isSelected && connectedAccounts.length > 0 && (
                            <div className="px-3.5 pb-3 space-y-1.5 border-t border-white/[0.04]">
                              <p className="text-[10px] text-zinc-500 pt-2 mb-1">
                                {hasMultiple ? 'Select which accounts to publish to:' : 'Publishing to:'}
                              </p>
                              {connectedAccounts.map((acct) => {
                                const isAccountSelected = selectedAccountIds.includes(acct.id);
                                return (
                                  <button
                                    key={acct.id}
                                    type="button"
                                    onClick={() => toggleAccountTarget(plat, acct.id)}
                                    disabled={!hasMultiple}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition border ${
                                      isAccountSelected
                                        ? 'bg-blue-600/12 border-blue-500/25 text-blue-300'
                                        : 'bg-zinc-800/30 border-white/[0.04] text-zinc-400 hover:text-zinc-200'
                                    } disabled:cursor-default`}
                                  >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                      isAccountSelected ? 'bg-blue-600 border-blue-600' : 'border-zinc-600'
                                    }`}>
                                      {isAccountSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className="font-semibold truncate">{acct.accountName}</span>
                                    {acct.handle && (
                                      <span className="text-zinc-600 font-mono text-[10px] truncate">{acct.handle}</span>
                                    )}
                                    {acct.isPrimary && (
                                      <span className="ml-auto text-[9px] font-bold badge-neon-blue px-1.5 py-0.5 rounded-full shrink-0">PRIMARY</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TikTok Specific Video Publishing Settings */}
                {selectedPlatforms.includes('TIKTOK') && (
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Video className="w-4 h-4 text-emerald-400" />
                        <span>TikTok Content Posting API v2 Settings</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">OAuth v2 Connected</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                          Privacy Level
                        </label>
                        <select
                          value={tiktokPrivacy}
                          onChange={(e: any) => setTiktokPrivacy(e.target.value)}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                        >
                          <option value="PUBLIC_TO_EVERYONE">Public to Everyone</option>
                          <option value="MUTUAL_FOLLOW_FRIENDS">Friends Only</option>
                          <option value="FOLLOWER_OF_CREATOR">Followers Only</option>
                          <option value="SELF_ONLY">Private (Self Only)</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-4 sm:pt-0">
                        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tiktokAllowComment}
                            onChange={(e) => setTiktokAllowComment(e.target.checked)}
                            className="rounded bg-zinc-800 border-zinc-700 text-blue-600"
                          />
                          <span>Allow Comments</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tiktokAllowDuet}
                            onChange={(e) => setTiktokAllowDuet(e.target.checked)}
                            className="rounded bg-zinc-800 border-zinc-700 text-blue-600"
                          />
                          <span>Allow Duet</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tiktokAllowStitch}
                            onChange={(e) => setTiktokAllowStitch(e.target.checked)}
                            className="rounded bg-zinc-800 border-zinc-700 text-blue-600"
                          />
                          <span>Allow Stitch</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scheduling & Publish Actions */}
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-zinc-200">Schedule Timestamp</span>
                    </div>
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleCreatePost('DRAFT')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-800 transition"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={() => handleCreatePost('SCHEDULED')}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Schedule Post</span>
                    </button>
                    <button
                      onClick={() => handleCreatePost('PUBLISHED')}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Immediately</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Platform Live Previews */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    Target Platform Live Previews
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">{selectedPlatforms.length} Selected</span>
                </div>

                <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
                  {selectedPlatforms.map((plat) => {
                    const copy = platformCopies[plat] || platformCopies['TWITTER'] || postTitle;
                    const account = activeSocials.find((s) => s.platform === plat);
                    const isConnected = account ? account.connected : false;

                    return (
                      <div key={plat} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span className="text-xs font-bold text-zinc-200">{plat}</span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'}`}>
                            {isConnected ? `@${account?.handle || account?.accountName}` : 'Needs Auth Login'}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {copy}
                        </div>

                        {selectedMedia.length > 0 && (
                          <div className="rounded-xl overflow-hidden border border-zinc-800 max-h-40">
                            <img src={selectedMedia[0]} alt="Media Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">August 2026</h3>
                <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
                  <button onClick={() => setCalendarView('month')} className={`px-2.5 py-1 rounded text-xs font-semibold ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Month</button>
                  <button onClick={() => setCalendarView('week')} className={`px-2.5 py-1 rounded text-xs font-semibold ${calendarView === 'week' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Week</button>
                  <button onClick={() => setCalendarView('day')} className={`px-2.5 py-1 rounded text-xs font-semibold ${calendarView === 'day' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>Day</button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Published</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Scheduled</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Failed</span>
              </div>
            </div>

            {/* Month Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-bold text-zinc-500 py-1">
                  {day}
                </div>
              ))}

              {Array.from({ length: 31 }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayPosts = filteredPosts.filter((p) => p.scheduledAt?.includes(`-08-${dayNum < 10 ? `0${dayNum}` : dayNum}`) || (dayNum === 29 && p.publishedAt));

                return (
                  <div
                    key={dayNum}
                    className="min-h-24 p-2 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition space-y-1.5 flex flex-col justify-between"
                  >
                    <span className="text-xs font-mono font-bold text-zinc-400">{dayNum}</span>
                    <div className="space-y-1 flex-1">
                      {dayPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`p-1.5 rounded-lg text-[10px] font-semibold truncate border ${
                            post.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : post.status === 'SCHEDULED'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {post.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ALL POSTS LIST */}
        {activeTab === 'all' && (
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <h3 className="text-base font-bold text-white">Post Repository for {activeWebsite?.name}</h3>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="NEEDS_APPROVAL">Needs Approval</option>
                  <option value="FAILED">Failed</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : post.status === 'SCHEDULED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : post.status === 'FAILED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase font-mono">{post.tone} TONE</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100">{post.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">{post.summary}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 transition"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
