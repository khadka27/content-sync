/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      return NextResponse.json({ success: false, error: 'A valid HTTP/HTTPS url query parameter is required.' }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ContentPilotProxy/1.0',
        'Accept': 'image/*, application/json, text/html, */*',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Proxy target responded with status ${response.status}` }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Proxy request failed' }, { status: 500 });
  }
}
