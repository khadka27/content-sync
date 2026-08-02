import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || '';

  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/api/auth/instagram/callback`
    : 'http://localhost:3000/api/auth/instagram/callback';

  if (!clientId) {
    // If credentials are not set, run instant demo authorization callback
    const demoCallbackUrl = `${redirectUri}?websiteId=${websiteId}&code=demo_instagram_oauth_${Date.now()}`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=user_profile,user_media&response_type=code&state=${websiteId}`;

  return NextResponse.redirect(instagramAuthUrl);
}
