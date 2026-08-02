'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { Sparkles, Video, Layers, Quote, Play, Copy, Check, RotateCw } from 'lucide-react';

export default function AiLabPage() {
  const { websites, activeWebsiteId, useAiCredits } = useStore();
  const [topic, setTopic] = useState('10 Engineering Rules for Scaling Next.js Apps in 2026');
  const [mode, setMode] = useState<'CAROUSEL' | 'QUOTE' | 'REEL' | 'SHORTS'>('CAROUSEL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [carouselOutput, setCarouselOutput] = useState<any[]>([]);
  const [quoteOutput, setQuoteOutput] = useState<any>(null);
  const [scriptsOutput, setScriptsOutput] = useState<any>(null);

  const activeWebsite = websites.find((w) => w.id === activeWebsiteId) || websites[0];

  const handleGenerate = async () => {
    if (!topic) return;
    if (!useAiCredits(15)) {
      alert('Out of AI Credits! Please upgrade in Billing.');
      return;
    }
    setIsGenerating(true);
    try {
      if (mode === 'CAROUSEL') {
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_carousel', title: topic }),
        });
        const data = await res.json();
        setCarouselOutput(data.data.slides);
      } else if (mode === 'QUOTE') {
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_quote', title: topic, websiteName: activeWebsite?.name }),
        });
        const data = await res.json();
        setQuoteOutput(data.data);
      } else {
        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_scripts', title: topic }),
        });
        const data = await res.json();
        setScriptsOutput(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Creative Asset Lab
          </h1>
          <p className="text-xs text-zinc-400">
            Generate carousel slides, high-converting quote cards, Instagram Reel scripts, and YouTube Shorts scripts.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { id: 'CAROUSEL', label: 'Carousel Slides', icon: Layers, desc: 'Multi-slide image decks' },
            { id: 'QUOTE', label: 'Quote Card Generator', icon: Quote, desc: 'Visual quote graphics' },
            { id: 'REEL', label: 'Instagram Reel Script', icon: Video, desc: 'Hook, scenes, and narration' },
            { id: 'SHORTS', label: 'YouTube Shorts Script', icon: Play, desc: 'Fast-paced 60s video script' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id as any)}
                className={`p-5 rounded-2xl border text-left transition space-y-2 ${
                  isSelected
                    ? 'bg-purple-600/15 border-purple-500/50 ring-1 ring-purple-500/30'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-xl w-fit ${isSelected ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100">{item.label}</h3>
                  <p className="text-[10px] text-zinc-400">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Generator Form */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Topic or Blog Title</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic for AI asset creation..."
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-medium"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
              >
                {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Assets (15 Credits)</span>
              </button>
            </div>
          </div>

          {/* Generated Outputs Preview */}
          <div className="pt-6 border-t border-zinc-800">
            {mode === 'CAROUSEL' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Carousel Slide Outline Preview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {(carouselOutput.length > 0
                    ? carouselOutput
                    : [
                        { slideNumber: 1, title: topic, subtitle: 'A step-by-step breakdown' },
                        { slideNumber: 2, title: '1. Autonomous Agents', text: 'Multi-step event-driven orchestration.' },
                        { slideNumber: 3, title: '2. Zero-Trust Sandboxes', text: 'Deterministic code execution isolation.' },
                        { slideNumber: 4, title: '3. Real-Time Sync', text: 'Instantaneous multi-channel distribution.' },
                        { slideNumber: 5, title: 'Summary', text: 'Start building with Content Sync today!' },
                      ]
                  ).map((slide) => (
                    <div
                      key={slide.slideNumber}
                      className="aspect-[4/5] p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500 transition"
                    >
                      <span className="text-[10px] font-mono font-bold text-purple-400">SLIDE 0{slide.slideNumber}</span>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white">{slide.title}</h4>
                        <p className="text-[10px] text-zinc-400 leading-snug">{slide.subtitle || slide.text}</p>
                      </div>
                      <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'QUOTE' && (
              <div className="space-y-4 max-w-xl mx-auto text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-center gap-2">
                  <Quote className="w-4 h-4 text-purple-400" />
                  Generated Quote Graphic Card
                </h3>

                <div className="aspect-[4/3] p-8 rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-purple-950/40 border border-purple-500/30 flex flex-col items-center justify-center space-y-4 relative shadow-2xl">
                  <Quote className="w-8 h-8 text-purple-400/40" />
                  <p className="text-base font-extrabold text-white leading-relaxed italic">
                    {quoteOutput?.quoteText || `"Automation isn’t about doing less work; it’s about creating more space for high-impact innovation."`}
                  </p>
                  <p className="text-xs font-semibold text-purple-300 font-mono">
                    - {quoteOutput?.author || activeWebsite?.name}
                  </p>
                </div>
              </div>
            )}

            {(mode === 'REEL' || mode === 'SHORTS') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-400" />
                    Generated Video Script Output
                  </h3>
                  <button
                    onClick={() => copyToClipboard(scriptsOutput?.reelScript || 'Script content')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {scriptsOutput?.reelScript ||
                    `🎬 [INSTAGRAM REEL / SHORTS SCRIPT]\n\n[HOOK (0-3s)]: "Stop scrolling! Here's why ${topic} will change your workflow in 2026."\n\n[SCENE 1 (3-15s)]: Show screen capture of modern dashboard.\nVoiceover: "Engineers are leveraging multi-agent workflows to automate 80% of routine tasks."\n\n[SCENE 2 (15-30s)]: Text overlay with 3 key points:\n1. Zero friction setup\n2. Real-time multi-platform sync\n3. High conversion output\n\n[CTA (30-45s)]: "Link in bio to test Content Sync for free today! 🔥"`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
