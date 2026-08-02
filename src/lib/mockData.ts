import { Website, SocialAccount, Post, MediaItem, AnalyticsMetric, TeamMember, AutomationRule, NotificationItem, UserSubscription } from '@/types';

export const initialWebsites: Website[] = [];

export const initialSocialAccounts: Record<string, SocialAccount[]> = {};

export const initialPosts: Post[] = [];

export const initialMedia: MediaItem[] = [];

export const initialAnalytics: AnalyticsMetric[] = [];

export const initialTeamMembers: TeamMember[] = [];

export const initialAutomations: AutomationRule[] = [];

export const initialNotifications: NotificationItem[] = [];

export const initialSubscription: UserSubscription = {
  plan: 'PRO',
  status: 'ACTIVE',
  aiCreditsTotal: 1000,
  aiCreditsUsed: 0,
  renewalDate: '2026-08-30',
};
