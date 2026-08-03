import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || '';

  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI ||
    (process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`
      : 'https://contentsync.dailyworkreport.com/api/auth/facebook/callback');

  if (!clientId) {
    // If Facebook App Credentials are not configured in .env yet, redirect with demo authorization token
    const demoCallbackUrl = `${redirectUri}?websiteId=${websiteId}&code=demo_facebook_oauth_code_${Date.now()}&state=success`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${websiteId}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic`;

  return NextResponse.redirect(facebookAuthUrl);
}
