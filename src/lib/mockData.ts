import { Website, SocialAccount, Post, MediaItem, AnalyticsMetric, TeamMember, AutomationRule, NotificationItem, UserSubscription } from '@/types';

// Clean initial state without fake mock posts or fake website records
export const initialWebsites: Website[] = [];

export const initialSocialAccounts: Record<string, SocialAccount[]> = {};

export const initialPosts: Post[] = [];

export const initialMedia: MediaItem[] = [];

export const initialAnalytics: AnalyticsMetric[] = [];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'tm-owner',
    name: 'Workspace Owner',
    email: 'admin@contentpilot.ai',
    role: 'OWNER',
    status: 'ACTIVE',
    joinedAt: new Date().toISOString().split('T')[0],
  },
];

export const initialAutomations: AutomationRule[] = [];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-welcome',
    title: 'Welcome to ContentPilot AI!',
    message: 'Connect your first website to start automating social media distribution.',
    read: false,
    type: 'INFO',
    createdAt: 'Just now',
  },
];

export const initialSubscription: UserSubscription = {
  plan: 'PRO',
  status: 'ACTIVE',
  aiCreditsTotal: 1000,
  aiCreditsUsed: 0,
  renewalDate: '2026-08-30',
};
