import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Platform, PostStatus, Tone } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get('websiteId');
    const status = searchParams.get('status');

    const where: any = {};
    if (websiteId) where.websiteId = websiteId;
    if (status) where.status = status as PostStatus;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = posts.map((p) => ({
      ...p,
      platforms: p.platforms || [],
      platformCopies: p.platformCopies || {},
      hashtags: p.hashtags || [],
      mediaUrls: p.mediaUrls || [],
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (error) {
    return NextResponse.json({ success: true, data: [], total: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteId, title, tone, platforms, platformCopies, hashtags, cta, emojis, mediaUrls, status, scheduledAt, originalUrl, summary } = body;

    if (!websiteId || !title || !platforms || platforms.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required fields: websiteId, title, or platforms.' }, { status: 400 });
    }

    const website = await prisma.website.findUnique({ where: { id: websiteId } });
    if (!website) {
      return NextResponse.json({ success: false, error: 'Invalid websiteId' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        workspaceId: website.workspaceId,
        websiteId,
        title,
        summary: summary || title,
        originalUrl: originalUrl || '',
        tone: (tone as Tone) || 'PROFESSIONAL',
        platforms: (platforms as Platform[]) || ['TWITTER'],
        platformCopies: platformCopies || {},
        hashtags: hashtags || [],
        cta: cta || '',
        emojis: emojis ?? true,
        mediaUrls: mediaUrls || [],
        status: (status as PostStatus) || 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: newPost,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create post.' }, { status: 500 });
  }
}
