import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token');

  if (!authToken) {
    redirect('/login');
  }

  return <div className="min-h-screen bg-muted/40">{children}</div>;
}
