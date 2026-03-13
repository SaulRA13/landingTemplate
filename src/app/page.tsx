import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';

export const metadata: Metadata = {
  title: 'Scanner',
  description: 'Escanea tus radiografias con la ayuda de IA',
};

export default function Home() {
  return <Landing />;
}
