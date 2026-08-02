import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || '';

  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/api/auth/youtube/callback`
    : 'http://localhost:3000/api/auth/youtube/callback';

  if (!clientId) {
    const demoCallbackUrl = `${redirectUri}?websiteId=${websiteId}&code=demo_youtube_oauth_${Date.now()}`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&access_type=offline&state=${websiteId}`;

  return NextResponse.redirect(youtubeAuthUrl);
}
