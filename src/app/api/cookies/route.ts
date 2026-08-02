import { NextResponse } from 'next/server';
import {
  setSessionCookie,
  getSessionCookie,
  setActiveWebsiteCookie,
  getActiveWebsiteCookie,
  clearAuthCookies,
} from '@/lib/cookies';

export async function GET() {
  const session = await getSessionCookie();
  const activeWebsiteId = await getActiveWebsiteCookie();

  return NextResponse.json({
    success: true,
    data: {
      session,
      activeWebsiteId,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { action, websiteId, userId, email } = await req.json();

    if (action === 'set_website' && websiteId) {
      await setActiveWebsiteCookie(websiteId);
      return NextResponse.json({ success: true, message: 'Active website cookie updated.' });
    }

    if (action === 'login' && email) {
      await setSessionCookie(userId || 'usr-main', email);
      return NextResponse.json({ success: true, message: 'Session cookie set successfully.' });
    }

    if (action === 'logout') {
      await clearAuthCookies();
      return NextResponse.json({ success: true, message: 'Auth cookies cleared.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid cookie action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Cookie update error' }, { status: 500 });
  }
}
