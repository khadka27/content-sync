'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { Role } from '@/types';
import { Users, Plus, ShieldCheck, Mail, Trash2, X } from 'lucide-react';

export default function TeamPage() {
  const { teamMembers, addTeamMember, removeTeamMember } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'EDITOR' as Role });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    addTeamMember({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role,
      status: 'INVITED',
    });
    setModalOpen(false);
    setFormData({ name: '', email: '', role: 'EDITOR' });
  };

  const roleColors: Record<Role, string> = {
    OWNER: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    ADMIN: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    EDITOR: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    AUTHOR: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    VIEWER: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-purple-400" />
              Team Members & Role Permissions
            </h1>
            <p className="text-xs text-zinc-400">
              Invite team members with granular permissions (Owner, Admin, Editor, Author, Viewer).
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>

        {/* Members Roster */}
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Active Team Members ({teamMembers.length})
          </h3>

          <div className="divide-y divide-zinc-800">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100">{member.name}</h4>
                    <p className="text-xs text-zinc-400 font-mono">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${roleColors[member.role]}`}>
                    {member.role}
                  </span>

                  {member.role !== 'OWNER' && (
                    <button onClick={() => removeTeamMember(member.id)} className="p-1.5 text-zinc-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-4 text-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-white">Invite Team Member</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Chen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Role Permission</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="ADMIN">Admin (Full Access)</option>
                    <option value="EDITOR">Editor (Create & Schedule)</option>
                    <option value="AUTHOR">Author (Draft Only)</option>
                    <option value="VIEWER">Viewer (Read Only)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-zinc-400">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">Send Invite</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
