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
  setActiveWebsiteId: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Website Actions
  addWebsite: (website: Omit<Website, 'id' | 'status' | 'socialAccountsCount'>) => Promise<void>;
  updateWebsite: (id: string, updates: Partial<Website>) => void;
  deleteWebsite: (id: string) => void;

  // Social Account Actions
  toggleSocialAccount: (websiteId: string, platform: Platform) => void;

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
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveWebsiteId: (id: string) => set({ activeWebsiteId: id }),
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
      }
    } catch {
      // Fallback local push
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

  toggleSocialAccount: (websiteId, platform) => {
    set((state) => {
      const current = state.socialAccounts[websiteId] || [];
      const exists = current.find((a) => a.platform === platform);

      let updated: SocialAccount[];
      if (exists) {
        updated = current.map((a) => (a.platform === platform ? { ...a, connected: !a.connected } : a));
      } else {
        updated = [
          ...current,
          {
            id: `sa-${Date.now()}`,
            websiteId,
            platform,
            accountName: `@${platform.toLowerCase()}_account`,
            connected: true,
            followers: Math.floor(Math.random() * 500) + 50,
          },
        ];
      }

      return {
        socialAccounts: {
          ...state.socialAccounts,
          [websiteId]: updated,
        },
      };
    });
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
