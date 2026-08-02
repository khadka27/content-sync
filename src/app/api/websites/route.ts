import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserWorkspace } from '@/lib/userWorkspace';

export async function GET() {
  try {
    const { workspace } = await getUserWorkspace();

    // Query websites strictly belonging to the authenticated user's workspace
    const websites = await prisma.website.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        socialAccounts: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = websites.map((w) => ({
      ...w,
      socialAccountsCount: w.socialAccounts.filter((s) => s.connected).length,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, domain, logo, brandColor, description, timezone, language, rssFeed, wordpressApi, webhookUrl } = body;

    if (!name || !domain) {
      return NextResponse.json({ success: false, error: 'Name and Domain are required fields.' }, { status: 400 });
    }

    const { workspace } = await getUserWorkspace();

    const created = await prisma.website.create({
      data: {
        workspaceId: workspace.id,
        name,
        domain,
        logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        brandColor: brandColor || '#3b82f6',
        description: description || '',
        timezone: timezone || 'UTC',
        language: language || 'en',
        rssFeed: rssFeed || '',
        wordpressApi: wordpressApi || '',
        webhookUrl: webhookUrl || `https://api.contentsync.ai/v1/webhook/${Date.now()}`,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create website profile.' }, { status: 500 });
  }
}
