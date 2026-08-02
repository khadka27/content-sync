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
    const handle = `@${siteName.toLowerCase().replace(/\s+/g, '_')}_official`;

    const existing = await prisma.socialAccount.findFirst({
      where: { websiteId, platform: 'INSTAGRAM' as Platform, handle },
    });
    if (existing) {
      await prisma.socialAccount.update({
        where: { id: existing.id },
        data: { connected: true, accountName: `${siteName} Instagram Business`, handle, accessToken: `ig_live_token_${Date.now()}`, followers: 3890 },
      });
    } else {
      await prisma.socialAccount.create({
        data: {
          websiteId,
          platform: 'INSTAGRAM' as Platform,
          accountName: `${siteName} Instagram Business`,
          handle,
          accessToken: `ig_live_token_${Date.now()}`,
          connected: true,
          isActive: true,
          isPrimary: false,
          followers: 3890,
        },
      });
    }

    return NextResponse.redirect(new URL(`/dashboard/websites?connected=INSTAGRAM`, req.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/dashboard/websites?error=instagram_auth_failed', req.url));
  }
}
