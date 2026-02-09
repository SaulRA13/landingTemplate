import Image from 'next/image';
import { getImageById } from '@/lib/content';
import { getContent } from '@/app/actions';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default async function Home() {
  const content = await getContent();

  const heroImage = content.hero.imageId ? getImageById(content.hero.imageId) : undefined;
  const featuresWithImages = content.features.map(feature => ({
    ...feature,
    image: feature.imageId ? getImageById(feature.imageId) : undefined,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero content={content.hero} image={heroImage} />
        <Features content={featuresWithImages} />
        <CTA content={content.cta} />
      </main>
      <Footer />
    </div>
  );
}
