import { NextResponse } from 'next/server';
import { initialMedia } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialMedia,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, url, folder, type } = body;

    const newMedia = {
      id: `m-${Date.now()}`,
      name: name || 'Uploaded Media',
      url: url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      folder: folder || 'General',
      type: type || 'IMAGE',
      size: 1024000,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({ success: true, data: newMedia }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Media upload failed.' }, { status: 500 });
  }
}
