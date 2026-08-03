import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        workspaces: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u: any) => ({
      id: u.id,
      name: u.name || 'User',
      email: u.email,
      role: u.role,
      workspacesCount: u.workspaces?.length || 0,
      createdAt: u.createdAt?.toISOString ? u.createdAt.toISOString() : u.createdAt,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch users.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ success: false, error: 'userId and role are required.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update user role.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required.' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: 'User account removed.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete user.' }, { status: 500 });
  }
}
