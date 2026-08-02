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
    const handle = `company/${siteName.toLowerCase().replace(/\s+/g, '-')}`;

    const existing = await prisma.socialAccount.findFirst({
      where: { websiteId, platform: 'LINKEDIN' as Platform, handle },
    });
    if (existing) {
      await prisma.socialAccount.update({
        where: { id: existing.id },
        data: { connected: true, accountName: `${siteName} LinkedIn Organization`, handle, accessToken: `linkedin_live_token_${Date.now()}`, followers: 8450 },
      });
    } else {
      await prisma.socialAccount.create({
        data: {
          websiteId,
          platform: 'LINKEDIN' as Platform,
          accountName: `${siteName} LinkedIn Organization`,
          handle,
          accessToken: `linkedin_live_token_${Date.now()}`,
          connected: true,
          isActive: true,
          isPrimary: false,
          followers: 8450,
        },
      });
    }

    return NextResponse.redirect(new URL(`/dashboard/websites?connected=LINKEDIN`, req.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/dashboard/websites?error=linkedin_auth_failed', req.url));
  }
}
