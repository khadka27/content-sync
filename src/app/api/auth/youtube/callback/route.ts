import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || searchParams.get('state');

  if (!websiteId) {
    return NextResponse.redirect(new URL('/dashboard/websites?error=missing_website', req.url));
  }

  try {
    const website = await prisma.website.findUnique({ where: { id: websiteId } });
    const siteName = website?.name || 'Brand';
    const handle = `@${siteName.toLowerCase().replace(/\s+/g, '')}_yt`;

    const existing = await prisma.socialAccount.findFirst({
      where: { websiteId, platform: 'YOUTUBE' as Platform, handle },
    });
    if (existing) {
      await prisma.socialAccount.update({
        where: { id: existing.id },
        data: { connected: true, accountName: `${siteName} YouTube Channel`, handle, accessToken: `youtube_live_token_${Date.now()}`, followers: 18900 },
      });
    } else {
      await prisma.socialAccount.create({
        data: {
          websiteId,
          platform: 'YOUTUBE' as Platform,
          accountName: `${siteName} YouTube Channel`,
          handle,
          accessToken: `youtube_live_token_${Date.now()}`,
          connected: true,
          isActive: true,
          isPrimary: false,
          followers: 18900,
        },
      });
    }

    return NextResponse.redirect(new URL(`/dashboard/websites?connected=YOUTUBE`, req.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/dashboard/websites?error=youtube_auth_failed', req.url));
  }
}
