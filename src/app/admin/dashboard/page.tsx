import type { Metadata } from 'next';
import { getContent } from '@/app/actions';
import AdminHeader from '@/components/admin/AdminHeader';
import ContentEditor from '@/components/admin/ContentEditor';

export const metadata: Metadata = {
  title: 'Administrador',
  description: 'Panel principal del administrador',
};

export default async function AdminDashboardPage() {
  const content = await getContent();

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8">
            <ContentEditor initialContent={content} />
        </div>
      </main>
    </div>
  );
}
