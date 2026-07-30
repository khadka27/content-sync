import { NextResponse } from 'next/server';
import { initialTeamMembers } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialTeamMembers,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const newMember = {
      id: `tm-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role: role || 'EDITOR',
      status: 'INVITED',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to invite team member.' }, { status: 500 });
  }
}
