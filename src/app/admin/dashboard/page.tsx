'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getContent, getAuthToken } from '@/lib/api';
import AdminHeader from '@/components/admin/AdminHeader';
import ContentEditor from '@/components/admin/ContentEditor';
import type { Content } from '@/lib/content';

export default function AdminDashboardPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Load content
    getContent()
      .then(setContent)
      .catch((err) => {
        console.error('Error loading content:', err);
        setError('Failed to load content');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <p>{error || 'Failed to load content'}</p>
          </div>
        </main>
      </div>
    );
  }

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
