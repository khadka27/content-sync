'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function PostsPage() {
  const { websites, activeWebsiteId, posts, addPost, updatePostStatus, deletePost, retryPost, useAiCredits } = useStore();

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
    TWITTER: '🚀 Excited to share our latest article on multi-workspace social automation!\n\nCheck it out here: https://contentpilot.ai #AI #SaaS',
    LINKEDIN: 'Multi-workspace social automation is changing the game for SaaS founders and digital agencies. Here is why you should automate multi-channel distribution in 2026.\n\n#SaaS #Growth #Automation',
  });
  const [scheduleDate, setScheduleDate] = useState('2026-08-01T10:00');

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];
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
      // Fallback title fill if fetch fails
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
    if (!postTitle) {
      alert('Please enter a post title or paste an article URL.');
      return;
    }

    addPost({
      websiteId: activeWebsiteId,
      title: postTitle,
      summary: postContent,
      originalUrl: scrapeUrl || undefined,
      tone: postTone,
      platforms: selectedPlatforms,
      platformCopies: platformCopies as Record<Platform, string>,
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
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const allPlatformsList: Platform[] = [
    'TWITTER',
    'LINKEDIN',
    'INSTAGRAM',
    'FACEBOOK',
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
              Create, AI-generate, preview, and schedule multi-platform posts for <span className="text-white font-semibold">{activeWebsite?.name}</span>.
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

                {/* Target Platforms Picker */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-semibold text-zinc-300 block">Target Platforms to Publish</label>
                  <div className="flex flex-wrap gap-2">
                    {allPlatformsList.map((plat) => {
                      const isSelected = selectedPlatforms.includes(plat);
                      return (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => togglePlatform(plat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border ${
                            isSelected
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                              : 'bg-zinc-950/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                          <span>{plat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                    return (
                      <div key={plat} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-zinc-200">{plat}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">Format Preview</span>
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

        {/* TAB 2: VISUAL DRAG & DROP CALENDAR */}
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
