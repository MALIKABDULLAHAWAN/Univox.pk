import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect this route - check if user is authenticated
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect('/(auth)/signin?callbackUrl=/dashboard');
  }

  return <>{children}</>;
}

export const metadata = {
  title: 'Dashboard - UniVox PK',
  description: 'Your UniVox PK Dashboard',
};