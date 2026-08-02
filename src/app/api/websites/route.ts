import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

async function getOrCreateDefaultWorkspace() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@contentpilot.ai',
        name: 'Workspace Admin',
        role: 'OWNER',
      },
    });
  }

  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Main Workspace',
        slug: 'main-workspace',
        ownerId: user.id,
      },
    });
  }
  return workspace;
}

export async function GET() {
  try {
    const websites = await prisma.website.findMany({
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

    const workspace = await getOrCreateDefaultWorkspace();

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
        webhookUrl: webhookUrl || `https://api.contentpilot.ai/v1/webhook/${Date.now()}`,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create website profile.' }, { status: 500 });
  }
}
