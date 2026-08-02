import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl || !imageUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Valid image url parameter required' }, { status: 400 });
    }

    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ContentPilotBot/1.0',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Image fetch failed' }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Image proxy internal error' }, { status: 500 });
  }
}
