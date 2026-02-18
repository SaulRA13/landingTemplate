import { getContent } from '@/app/actions';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';

export default async function Home() {
  const content = await getContent();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero 
          headline={content.title} 
          subheadline={content.mainText}
          description={content.description}
          image={content.image}
        />
      </main>
      <Footer />
    </div>
  );
}
