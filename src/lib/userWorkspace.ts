import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function getUserWorkspace() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || 'default@contentsync.ai';
  const name = session?.user?.name || email.split('@')[0];

  // 1. Find or create isolated User in DB
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        role: 'OWNER',
      },
    });
  }

  // 2. Find or create isolated Workspace for this specific user
  let workspace = await prisma.workspace.findFirst({
    where: { ownerId: user.id },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        slug: `ws-${user.id.slice(0, 8)}`,
        ownerId: user.id,
      },
    });
  }

  return { user, workspace };
}
