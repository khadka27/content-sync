import { NextResponse } from 'next/server';
import { TikTokService } from '@/lib/tiktok';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || 'default';

  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;

  if (!clientKey || clientKey === 'your_tiktok_client_key') {
    const redirectUri = process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/auth/tiktok/callback';
    const demoCallbackUrl = `${redirectUri}?websiteId=${websiteId}&code=demo_tiktok_oauth_${Date.now()}`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const authUrl = TikTokService.getAuthUrl(websiteId);
  return NextResponse.redirect(authUrl);
}
