import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserWorkspace } from '@/lib/userWorkspace';

export async function GET() {
  try {
    const { user, workspace } = await getUserWorkspace();

    // Fetch team members belonging to the current user's workspace
    const users = await prisma.user.findMany({
      where: {
        workspaces: {
          some: { id: workspace.id },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const list = users.length > 0 ? users : [user];

    const formatted = list.map((u) => ({
      id: u.id,
      name: u.name || u.email.split('@')[0],
      email: u.email,
      role: u.role,
      status: u.id === user.id ? 'ACTIVE' : 'INVITED',
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

    const { workspace } = await getUserWorkspace();

    let created = await prisma.user.findUnique({ where: { email } });
    if (!created) {
      created = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          role: role || 'EDITOR',
          workspaces: {
            connect: { id: workspace.id },
          },
        },
      });
    }

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
