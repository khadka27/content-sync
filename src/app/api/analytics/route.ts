import { NextResponse } from 'next/server';
import { initialAnalytics } from '@/lib/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || 'web-1';

  const metrics = initialAnalytics.filter((a) => a.websiteId === websiteId);
  const totalPosts = metrics.reduce((acc, m) => acc + m.postsCount, 0);
  const totalImpressions = metrics.reduce((acc, m) => acc + m.impressions, 0);
  const totalReach = metrics.reduce((acc, m) => acc + m.reach, 0);
  const totalClicks = metrics.reduce((acc, m) => acc + m.clicks, 0);
  const avgCtr = metrics.length ? (totalClicks / totalImpressions) * 100 : 0;

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalPosts,
        totalImpressions,
        totalReach,
        totalClicks,
        avgCtr: parseFloat(avgCtr.toFixed(2)),
      },
      platformBreakdown: metrics,
    },
  });
}
