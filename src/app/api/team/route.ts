import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name || u.email.split('@')[0],
      email: u.email,
      role: u.role,
      status: 'ACTIVE',
      joinedAt: u.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const created = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        role: role || 'EDITOR',
      },
    });

    const formatted = {
      id: created.id,
      name: created.name || created.email.split('@')[0],
      email: created.email,
      role: created.role,
      status: 'INVITED',
      joinedAt: created.createdAt.toISOString().split('T')[0],
    };

    return NextResponse.json({ success: true, data: formatted }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to invite team member.' }, { status: 500 });
  }
}
