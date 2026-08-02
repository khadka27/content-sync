import { cookies } from 'next/headers';

export const COOKIE_SESSION_KEY = 'contentsync_session';
export const COOKIE_WEBSITE_KEY = 'contentsync_active_website';

export async function setSessionCookie(userId: string, email: string) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    userId,
    email,
    loggedInAt: new Date().toISOString(),
  });

  cookieStore.set(COOKIE_SESSION_KEY, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export async function setActiveWebsiteCookie(websiteId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_WEBSITE_KEY, websiteId, {
    httpOnly: false, // Accessible to client-side state sync
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

export async function getActiveWebsiteCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_WEBSITE_KEY)?.value || null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_SESSION_KEY);
  cookieStore.delete(COOKIE_WEBSITE_KEY);
}
