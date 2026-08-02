import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const websiteId = searchParams.get('websiteId') || '';

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/api/auth/linkedin/callback`
    : 'http://localhost:3000/api/auth/linkedin/callback';

  if (!clientId) {
    const demoCallbackUrl = `${redirectUri}?websiteId=${websiteId}&code=demo_linkedin_oauth_${Date.now()}`;
    return NextResponse.redirect(demoCallbackUrl);
  }

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${websiteId}&scope=openid%20profile%20w_member_social%20r_organization_social%20w_organization_social`;

  return NextResponse.redirect(linkedinAuthUrl);
}
