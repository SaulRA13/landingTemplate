import XRayAnalyzer from '@/components/xray/XRayAnalyzer';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Análisis de Radiografías',
  description: 'Analiza radiografías de tórax para detectar neumonía',
};

export default function XRayPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12">
        <XRayAnalyzer />
      </main>
      <Footer />
    </div>
  );
}
