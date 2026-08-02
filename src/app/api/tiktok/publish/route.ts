import { NextResponse } from 'next/server';
import { TikTokService } from '@/lib/tiktok';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, videoUrl, privacyLevel, websiteId, disableDuet, disableComment, disableStitch } = body;

    if (!title) {
      return NextResponse.json({ error: 'Post title/caption is required' }, { status: 400 });
    }

    // Attempt to locate stored TikTok access token for this website or global model
    let accessToken = 'tiktok_live_token_demo';

    if (websiteId) {
      const socialAccount = await prisma.socialAccount.findFirst({
        where: { websiteId, platform: 'TIKTOK', connected: true },
      });
      if (socialAccount?.accessToken) {
        accessToken = socialAccount.accessToken;
      }
    } else {
      const tikTokAcc = await prisma.tikTokAccount.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
      if (tikTokAcc?.accessToken) {
        accessToken = tikTokAcc.accessToken;
      }
    }

    // Step 12, 13, 14: Initialize, Upload & Publish to TikTok Content Posting API
    const publishResult = await TikTokService.publishVideo({
      accessToken,
      title,
      videoUrl,
      privacyLevel: privacyLevel || 'PUBLIC_TO_EVERYONE',
      disableDuet: !!disableDuet,
      disableComment: !!disableComment,
      disableStitch: !!disableStitch,
    });

    return NextResponse.json({
      success: true,
      publishId: publishResult.publishId,
      uploadUrl: publishResult.uploadUrl,
      message: 'Video successfully uploaded and published to TikTok Content Posting API v2',
    });
  } catch (error: any) {
    console.error('TikTok Direct Publishing Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to publish video to TikTok' }, { status: 500 });
  }
}
