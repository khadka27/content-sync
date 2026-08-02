import { create } from 'zustand';
import {
  Website,
  SocialAccount,
  Post,
  MediaItem,
  AnalyticsMetric,
  TeamMember,
  AutomationRule,
  NotificationItem,
  UserSubscription,
  Platform,
  Tone,
  PostStatus,
} from '@/types';
import { initialTeamMembers, initialNotifications, initialSubscription } from '@/lib/mockData';

interface StoreState {
  // Active State
  websites: Website[];
  activeWebsiteId: string;
  socialAccounts: Record<string, SocialAccount[]>;
  posts: Post[];
  media: MediaItem[];
  analytics: AnalyticsMetric[];
  teamMembers: TeamMember[];
  automations: AutomationRule[];
  notifications: NotificationItem[];
  subscription: UserSubscription;
  commandPaletteOpen: boolean;
  isLoading: boolean;

  // Actions
  fetchInitialData: () => Promise<void>;
  fetchSocialAccounts: (websiteId: string) => Promise<void>;
  setActiveWebsiteId: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Website Actions
  addWebsite: (website: Omit<Website, 'id' | 'status' | 'socialAccountsCount'>) => Promise<void>;
  updateWebsite: (id: string, updates: Partial<Website>) => void;
  deleteWebsite: (id: string) => void;

  // Social Account Actions
  addSocialAccount: (websiteId: string, platform: Platform, accountName: string, handle: string, accessToken: string, pageId?: string) => Promise<void>;
  removeSocialAccount: (websiteId: string, accountId: string) => Promise<void>;
  toggleAccountActive: (websiteId: string, accountId: string) => void;
  setPrimaryAccount: (websiteId: string, accountId: string) => void;
  // Legacy compat shims
  connectSocialAccount: (websiteId: string, platform: Platform, accountName: string, handle: string, accessToken: string) => Promise<void>;
  disconnectSocialAccount: (websiteId: string, platform: Platform) => Promise<void>;

  // Post Actions
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => Promise<void>;
  updatePostStatus: (id: string, status: PostStatus, scheduledAt?: string) => void;
  deletePost: (id: string) => void;
  retryPost: (id: string) => void;

  // Automation Actions
  addAutomation: (automation: Omit<AutomationRule, 'id'>) => void;
  toggleAutomation: (id: string) => void;
  triggerSync: (id: string) => Promise<void>;

  // Media Actions
  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  deleteMedia: (id: string) => void;

  // Team Actions
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  removeTeamMember: (id: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // AI Credit consumption
  useAiCredits: (amount: number) => boolean;
}

export const useStore = create<StoreState>((set, get) => ({
  websites: [],
  activeWebsiteId: '',
  socialAccounts: {},
  posts: [],
  media: [],
  analytics: [],
  teamMembers: initialTeamMembers,
  automations: [],
  notifications: initialNotifications,
  subscription: initialSubscription,
  commandPaletteOpen: false,
  isLoading: false,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [webRes, postsRes] = await Promise.all([
        fetch('/api/websites').then((r) => r.json()),
        fetch('/api/posts').then((r) => r.json()),
      ]);

      const fetchedWebsites: Website[] = webRes.success ? webRes.data : [];
      const fetchedPosts: Post[] = postsRes.success ? postsRes.data : [];

      const nextActiveId = fetchedWebsites[0]?.id || '';

      set({
        websites: fetchedWebsites,
        posts: fetchedPosts,
        activeWebsiteId: nextActiveId,
        isLoading: false,
      });

      if (nextActiveId) {
        get().fetchSocialAccounts(nextActiveId);
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchSocialAccounts: async (websiteId: string) => {
    if (!websiteId) return;
    try {
      const res = await fetch(`/api/social?websiteId=${websiteId}`);
      const data = await res.json();
      if (data.success && data.data) {
        set((state) => ({
          socialAccounts: {
            ...state.socialAccounts,
            [websiteId]: data.data,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to fetch social accounts:', err);
    }
  },

  setActiveWebsiteId: (id: string) => {
    set({ activeWebsiteId: id });
    if (id) {
      get().fetchSocialAccounts(id);
      fetch('/api/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_website', websiteId: id }),
      }).catch(() => {});
    }
  },

  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),

  addWebsite: async (newWeb) => {
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWeb),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const created: Website = data.data;
        set((state) => ({
          websites: [created, ...state.websites],
          activeWebsiteId: created.id,
        }));
        get().fetchSocialAccounts(created.id);
      }
    } catch {
      const id = `web-${Date.now()}`;
      const createdWeb: Website = { ...newWeb, id, status: 'ACTIVE', socialAccountsCount: 4 };
      set((state) => ({ websites: [createdWeb, ...state.websites], activeWebsiteId: id }));
    }
  },

  updateWebsite: (id, updates) => {
    set((state) => ({
      websites: state.websites.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));
  },

  deleteWebsite: (id) => {
    set((state) => {
      const filtered = state.websites.filter((w) => w.id !== id);
      return {
        websites: filtered,
        activeWebsiteId: filtered[0]?.id || '',
      };
    });
  },

  addSocialAccount: async (websiteId, platform, accountName, handle, accessToken, pageId) => {
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          websiteId,
          platform,
          accountName,
          handle,
          accessToken,
          pageId,
          connected: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        get().fetchSocialAccounts(websiteId);
      }
    } catch (err) {
      console.error('addSocialAccount error:', err);
      // Optimistic local update
      const newAccount: import('@/types').SocialAccount = {
        id: `acct-${Date.now()}`,
        websiteId,
        platform,
        accountName,
        handle,
        pageId,
        accessToken,
        connected: true,
        isActive: true,
        isPrimary: false,
        followers: Math.floor(Math.random() * 5000) + 250,
        addedAt: new Date().toISOString(),
      };
      set((state) => ({
        socialAccounts: {
          ...state.socialAccounts,
          [websiteId]: [...(state.socialAccounts[websiteId] || []), newAccount],
        },
      }));
    }
  },

  removeSocialAccount: async (websiteId, accountId) => {
    // Optimistic local removal immediately
    set((state) => ({
      socialAccounts: {
        ...state.socialAccounts,
        [websiteId]: (state.socialAccounts[websiteId] || []).filter((a) => a.id !== accountId),
      },
    }));
    try {
      await fetch('/api/social', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
    } catch (err) {
      console.error('removeSocialAccount error:', err);
      get().fetchSocialAccounts(websiteId);
    }
  },

  toggleAccountActive: (websiteId, accountId) => {
    set((state) => ({
      socialAccounts: {
        ...state.socialAccounts,
        [websiteId]: (state.socialAccounts[websiteId] || []).map((a) =>
          a.id === accountId ? { ...a, isActive: !a.isActive } : a
        ),
      },
    }));
  },

  setPrimaryAccount: (websiteId, accountId) => {
    set((state) => {
      const accts = state.socialAccounts[websiteId] || [];
      const platform = accts.find((a) => a.id === accountId)?.platform;
      return {
        socialAccounts: {
          ...state.socialAccounts,
          [websiteId]: accts.map((a) =>
            a.platform === platform
              ? { ...a, isPrimary: a.id === accountId }
              : a
          ),
        },
      };
    });
  },

  // Legacy shims - keep existing callers working
  connectSocialAccount: async (websiteId, platform, accountName, handle, accessToken) => {
    return get().addSocialAccount(websiteId, platform, accountName, handle, accessToken);
  },

  disconnectSocialAccount: async (websiteId, platform) => {
    // Remove ALL accounts for this platform on this website
    const accts = get().socialAccounts[websiteId] || [];
    const toRemove = accts.filter((a) => a.platform === platform);
    for (const a of toRemove) {
      await get().removeSocialAccount(websiteId, a.id);
    }
  },

  addPost: async (postData) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        set((state) => ({
          posts: [data.data, ...state.posts],
        }));
        return;
      }
    } catch {
      // Fallback
    }

    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },

  updatePostStatus: (id, status, scheduledAt) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              scheduledAt: scheduledAt || p.scheduledAt,
              publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : p.publishedAt,
            }
          : p
      ),
    }));
  },

  deletePost: (id) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },

  retryPost: (id) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id
          ? { ...p, status: 'SCHEDULED', errorMessage: undefined, scheduledAt: new Date().toISOString() }
          : p
      ),
    }));
  },

  addAutomation: (automation) => {
    const newRule: AutomationRule = {
      ...automation,
      id: `auto-${Date.now()}`,
      lastSynced: 'Just now',
    };
    set((state) => ({
      automations: [newRule, ...state.automations],
    }));
  },

  toggleAutomation: (id) => {
    set((state) => ({
      automations: state.automations.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    }));
  },

  triggerSync: async (id) => {
    set((state) => ({
      automations: state.automations.map((a) =>
        a.id === id ? { ...a, lastSynced: new Date().toISOString() } : a
      ),
    }));
  },

  addMedia: (item) => {
    const newItem: MediaItem = {
      ...item,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      media: [newItem, ...state.media],
    }));
  },

  deleteMedia: (id) => {
    set((state) => ({
      media: state.media.filter((m) => m.id !== id),
    }));
  },

  addTeamMember: (member) => {
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      teamMembers: [...state.teamMembers, newMember],
    }));
  },

  removeTeamMember: (id) => {
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== id),
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  useAiCredits: (amount) => {
    const { subscription } = get();
    if (subscription.aiCreditsUsed + amount > subscription.aiCreditsTotal) {
      return false;
    }
    set({
      subscription: {
        ...subscription,
        aiCreditsUsed: subscription.aiCreditsUsed + amount,
      },
    });
    return true;
  },
}));
