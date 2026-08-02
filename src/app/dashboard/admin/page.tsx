'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-xs font-mono text-zinc-500">
      Redirecting to Super Admin Portal (/admin)...
    </div>
  );
}
