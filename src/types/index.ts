export type Role = 'OWNER' | 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER';

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'NEEDS_APPROVAL';

export type Platform =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'LINKEDIN'
  | 'TWITTER'
  | 'THREADS'
  | 'PINTEREST'
  | 'TELEGRAM'
  | 'DISCORD';

export type AutomationType = 'RSS' | 'WORDPRESS' | 'WEBHOOK' | 'MANUAL_URL';

export type Tone = 'PROFESSIONAL' | 'MARKETING' | 'EDUCATIONAL' | 'FRIENDLY';

export interface Website {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  brandColor: string;
  description?: string;
  timezone: string;
  language: string;
  rssFeed?: string;
  wordpressApi?: string;
  webhookUrl?: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  socialAccountsCount?: number;
}

export interface SocialAccount {
  id: string;
  websiteId: string;
  platform: Platform;
  accountName: string;
  handle?: string;
  avatar?: string;
  connected: boolean;
  followers: number;
}

export interface Post {
  id: string;
  websiteId: string;
  title: string;
  originalUrl?: string;
  summary?: string;
  tone: Tone;
  platforms: Platform[];
  platformCopies?: Record<Platform, string>;
  hashtags: string[];
  cta?: string;
  emojis: boolean;
  mediaUrls: string[];
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  folder: string;
  type: 'IMAGE' | 'VIDEO' | 'BRAND' | 'AI_GENERATED';
  size?: number;
  createdAt: string;
}

export interface AnalyticsMetric {
  websiteId: string;
  platform: Platform;
  postsCount: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  followerGrowth: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: 'ACTIVE' | 'INVITED';
  joinedAt: string;
}

export interface AutomationRule {
  id: string;
  websiteId: string;
  name: string;
  type: AutomationType;
  targetUrl?: string;
  autoPublish: boolean;
  defaultTone: Tone;
  active: boolean;
  lastSynced?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  createdAt: string;
}

export interface UserSubscription {
  plan: 'FREE' | 'PRO' | 'AGENCY';
  status: string;
  aiCreditsTotal: number;
  aiCreditsUsed: number;
  renewalDate: string;
}
