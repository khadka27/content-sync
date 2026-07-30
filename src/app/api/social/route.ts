import { NextResponse } from 'next/server';
import { initialSocialAccounts } from '@/lib/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || 'web-1';

  const accounts = initialSocialAccounts[websiteId] || [];
  return NextResponse.json({
    success: true,
    data: accounts,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteId, platform, connected } = body;

    return NextResponse.json({
      success: true,
      message: `Social platform ${platform} ${connected ? 'connected' : 'disconnected'} successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Social connection update failed.' }, { status: 500 });
  }
}
