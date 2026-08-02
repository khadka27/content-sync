import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const startTime = Date.now();

    // Query real PostgreSQL database metrics
    const [usersCount, workspacesCount, websitesCount, postsCount, socialAccountsCount, recentPosts] = await Promise.all([
      prisma.user.count(),
      prisma.workspace.count(),
      prisma.website.count(),
      prisma.post.count(),
      prisma.socialAccount.count(),
      prisma.post.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          website: {
            select: { name: true, domain: true },
          },
        },
      }),
    ]);

    const dbLatency = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          usersCount,
          workspacesCount,
          websitesCount,
          postsCount,
          socialAccountsCount,
        },
        systemHealth: {
          dbStatus: 'HEALTHY',
          dbLatencyMs: dbLatency,
          memoryUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          memoryTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          nodeVersion: process.version,
          uptimeSeconds: Math.floor(process.uptime()),
        },
        recentActivity: recentPosts.map((p) => ({
          id: p.id,
          title: p.title,
          websiteName: p.website?.name || 'General',
          status: p.status,
          platforms: p.platforms,
          createdAt: p.createdAt.toISOString(),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch admin system metrics.',
      },
      { status: 500 }
    );
  }
}
