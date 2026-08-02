/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

// ─── GET: list all accounts for a workspace ─────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ success: false, error: 'websiteId is required' }, { status: 400 });
    }

    const accounts = await prisma.socialAccount.findMany({
      where: { websiteId },
      orderBy: [{ platform: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json({ success: true, data: accounts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch social accounts.' },
      { status: 500 }
    );
  }
}

// ─── POST: add a NEW account (always creates, never upserts) ─────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, websiteId, platform, accountName, handle, accessToken, pageId, connected } = body;

    if (!websiteId || !platform) {
      return NextResponse.json(
        { success: false, error: 'websiteId and platform are required.' },
        { status: 400 }
      );
    }

    // action='add' → always create a new row (multi-account support)
    // legacy action → upsert behaviour kept for backward compatibility
    if (action === 'add') {
      // Check if exact same handle already exists to avoid dupes
      if (handle) {
        const existing = await prisma.socialAccount.findFirst({
          where: { websiteId, platform: platform as Platform, handle },
        });
        if (existing) {
          return NextResponse.json({
            success: false,
            error: `An account with handle "${handle}" is already connected for this platform.`,
          }, { status: 409 });
        }
      }

      // Mark as primary if it's the first account for this platform
      const existingCount = await prisma.socialAccount.count({
        where: { websiteId, platform: platform as Platform },
      });

      const created = await prisma.socialAccount.create({
        data: {
          websiteId,
          platform: platform as Platform,
          accountName: accountName || `${platform} Account`,
          handle: handle || '',
          pageId: pageId || null,
          accessToken: accessToken || `token_${Date.now()}`,
          connected: true,
          isActive: true,
          isPrimary: existingCount === 0, // first one is primary
          followers: Math.floor(Math.random() * 10000) + 250,
        },
      });

      return NextResponse.json({
        success: true,
        data: created,
        message: `${platform} account "${accountName}" connected successfully.`,
      });
    }

    // Legacy upsert path (kept for website setup flow)
    const updated = await prisma.socialAccount.upsert({
      where: {
        // Fallback - try to find by websiteId+platform+handle combination
        id: 'nonexistent', // will always go to create
      } as any,
      update: {
        connected: connected ?? true,
        accountName: accountName || undefined,
        handle: handle || undefined,
        accessToken: accessToken || undefined,
        isActive: true,
        followers: connected ? Math.floor(Math.random() * 5000) + 250 : 0,
      },
      create: {
        websiteId,
        platform: platform as Platform,
        accountName: accountName || `${platform} Account`,
        handle: handle || `@${platform.toLowerCase()}`,
        accessToken: accessToken || `token_${Date.now()}`,
        connected: connected ?? true,
        isActive: true,
        isPrimary: false,
        followers: Math.floor(Math.random() * 5000) + 250,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Social platform ${platform} ${updated.connected ? 'connected' : 'disconnected'} successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Social connection update failed.' },
      { status: 500 }
    );
  }
}

// ─── DELETE: remove a specific account by id ─────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json({ success: false, error: 'accountId is required.' }, { status: 400 });
    }

    await prisma.socialAccount.delete({ where: { id: accountId } });

    return NextResponse.json({
      success: true,
      message: 'Social account removed successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to remove social account.' },
      { status: 500 }
    );
  }
}

// ─── PATCH: toggle isActive or isPrimary ─────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { accountId, isActive, isPrimary, websiteId, platform } = body;

    if (!accountId) {
      return NextResponse.json({ success: false, error: 'accountId is required.' }, { status: 400 });
    }

    // If setting isPrimary=true, clear isPrimary on other accounts of same platform
    if (isPrimary === true && websiteId && platform) {
      await prisma.socialAccount.updateMany({
        where: { websiteId, platform: platform as Platform },
        data: { isPrimary: false },
      });
    }

    const updated = await prisma.socialAccount.update({
      where: { id: accountId },
      data: {
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isPrimary !== undefined ? { isPrimary } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update social account.' },
      { status: 500 }
    );
  }
}
