import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || 'default';

  const clientId = process.env.TWITTER_CLIENT_ID || process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
  const redirectUri = process.env.TWITTER_REDIRECT_URI ||
    (process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/auth/twitter/callback`
      : 'http://localhost:3000/api/auth/twitter/callback');

  if (!clientId || clientId === 'your_twitter_client_id') {
    // If credentials are not set, trigger demo authorization callback
    const demoCallbackUrl = `${redirectUri}?websiteId=${websiteId}&code=demo_twitter_oauth_${Date.now()}&state=${websiteId}`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const twitterAuthUrl = new URL('https://twitter.com/i/oauth2/authorize');
  twitterAuthUrl.searchParams.append('response_type', 'code');
  twitterAuthUrl.searchParams.append('client_id', clientId);
  twitterAuthUrl.searchParams.append('redirect_uri', redirectUri);
  twitterAuthUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
  twitterAuthUrl.searchParams.append('state', websiteId);
  twitterAuthUrl.searchParams.append('code_challenge', 'challenge');
  twitterAuthUrl.searchParams.append('code_challenge_method', 'plain');

  return NextResponse.redirect(twitterAuthUrl.toString());
}
