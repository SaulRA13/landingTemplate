import AskOutForm from '@/components/dates/AskOutForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Salimos?',
  description: 'Una invitación especial',
};

export default function SalimosPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-purple-950 p-4">
      <AskOutForm />
    </main>
  );
}
