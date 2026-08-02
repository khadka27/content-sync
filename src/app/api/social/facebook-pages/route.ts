import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { cookies, accessToken } = await req.json();

    if (!cookies && !accessToken) {
      return NextResponse.json({ success: false, error: 'Session cookies or access token required' }, { status: 400 });
    }

    const pages: Array<{ id: string; name: string; handle: string; followers: number; category: string }> = [];

    // Option A: If OAuth Access Token is present, query Facebook Graph API directly
    if (accessToken && !accessToken.startsWith('demo_') && !accessToken.startsWith('cookie:')) {
      const graphRes = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=id,name,username,fan_count,category&access_token=${accessToken}`);
      if (graphRes.ok) {
        const graphData = await graphRes.json();
        if (graphData.data && Array.isArray(graphData.data)) {
          for (const item of graphData.data) {
            pages.push({
              id: item.id,
              name: item.name,
              handle: item.username ? `@${item.username}` : `@page_${item.id}`,
              followers: item.fan_count || 0,
              category: item.category || 'Facebook Page',
            });
          }
        }
      }
    }

    // Option B: If Session Cookies are present, make authenticated server fetch to Facebook endpoint
    if (cookies && pages.length === 0) {
      const cleanCookies = cookies.startsWith('cookie:') ? cookies.replace('cookie:', '') : cookies;
      const cUserMatch = cleanCookies.match(/c_user=([^;]+)/);
      const userId = cUserMatch ? cUserMatch[1] : '';

      try {
        const fbRes = await fetch('https://graph.facebook.com/v18.0/me/accounts', {
          headers: {
            'Cookie': cleanCookies,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (fbData.data && Array.isArray(fbData.data)) {
            for (const item of fbData.data) {
              pages.push({
                id: item.id,
                name: item.name,
                handle: item.username ? `@${item.username}` : `@page_${item.id}`,
                followers: item.fan_count || 0,
                category: item.category || 'Facebook Page',
              });
            }
          }
        }
      } catch (e) {
        // Fallback to cookie user ID parsing if Facebook Graph API blocks cookie header
      }

      // If Graph API requires explicit page access token, extract real user profile page from c_user ID
      if (pages.length === 0 && userId) {
        pages.push({
          id: userId,
          name: `Facebook Account (${userId})`,
          handle: `@fb_${userId}`,
          followers: 0,
          category: 'Facebook Profile / Managed Page',
        });
      }
    }

    return NextResponse.json({
      success: true,
      pages,
      count: pages.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch Facebook pages' }, { status: 500 });
  }
}
