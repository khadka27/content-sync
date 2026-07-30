import { NextResponse } from 'next/server';
import { initialAutomations } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialAutomations,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteId, name, type, targetUrl, autoPublish, defaultTone } = body;

    if (!websiteId || !name || !type) {
      return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
    }

    const newRule = {
      id: `auto-${Date.now()}`,
      websiteId,
      name,
      type,
      targetUrl: targetUrl || '',
      autoPublish: autoPublish ?? false,
      defaultTone: defaultTone || 'MARKETING',
      active: true,
      lastSynced: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newRule }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create automation rule.' }, { status: 500 });
  }
}
