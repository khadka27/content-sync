'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { FileImage, Plus, Search, Trash2, Tag, Upload, X } from 'lucide-react';

export default function MediaPage() {
  const { media, addMedia, deleteMedia } = useStore();
  const [filterFolder, setFilterFolder] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', folder: 'General', type: 'IMAGE' as any });

  const filteredMedia = media.filter((m) => (filterFolder === 'ALL' ? true : m.folder === filterFolder));

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) return;
    addMedia({
      name: formData.name || 'Uploaded Asset',
      url: formData.url,
      folder: formData.folder,
      type: formData.type,
      size: 1420000,
    });
    setModalOpen(false);
    setFormData({ name: '', url: '', folder: 'General', type: 'IMAGE' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <FileImage className="w-6 h-6 text-blue-400" />
              Media Library
            </h1>
            <p className="text-xs text-zinc-400">
              Manage image & video assets, AI generated artwork, and brand graphic kits.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media Asset</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'Tech Assets', 'Brand Assets', 'AI Generated', 'General'].map((folder) => (
            <button
              key={folder}
              onClick={() => setFilterFolder(folder)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                filterFolder === folder ? 'bg-blue-600 text-white shadow-md' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-zinc-900/90 border border-zinc-800 overflow-hidden space-y-3 p-3 hover:border-zinc-700 transition"
            >
              <div className="aspect-video rounded-2xl overflow-hidden relative bg-zinc-950">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-rose-400 hover:bg-rose-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-zinc-200 truncate max-w-[160px]">{item.name}</span>
                <span className="text-[10px] font-mono text-zinc-500">{item.folder}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4 text-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-white">Add Media Asset</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Asset Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Infographic Banner.png"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Image / Media URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-zinc-400">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">Save Asset</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
