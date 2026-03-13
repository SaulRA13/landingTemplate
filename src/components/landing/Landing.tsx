'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';
import type { Content, ContentSection } from '@/lib/content';
import { getContent } from '@/lib/api';

const numberedFieldRegex = /^(title|mainText|description|image)(\d+)$/;

function getNumberedSections(content: Content): ContentSection[] {
  const sectionMap = new Map<number, Partial<ContentSection>>();

  for (const [key, value] of Object.entries(content)) {
    const match = key.match(numberedFieldRegex);
    if (!match) continue;

    const index = Number(match[2]);
    if (!Number.isFinite(index) || index < 2) continue;

    const field = match[1] as keyof ContentSection;
    const existing = sectionMap.get(index) ?? {};
    existing[field] = typeof value === 'string' ? value : '';
    sectionMap.set(index, existing);
  }

  return Array.from(sectionMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, section]) => ({
      title: section.title || '',
      mainText: section.mainText || '',
      description: section.description || '',
      image: section.image || '',
    }));
}

export default function Landing() {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getContent()
      .then(setContent)
      .catch((err) => {
        console.error('Error loading content:', err);
        setError('Failed to load content');
        setContent({
          title: 'Welcome',
          mainText: 'Unable to load content from server',
          description: 'Please try refreshing the page',
          image: '',
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>{error || 'Failed to load content'}</p>
      </div>
    );
  }

  const extraSections =
    Array.isArray(content.sections) && content.sections.length > 0
      ? content.sections
      : getNumberedSections(content);

  const sections = [
    {
      title: content.title,
      mainText: content.mainText,
      description: content.description,
      image: content.image,
    },
    ...extraSections,
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {sections.map((section, index) => (
          <Hero
            key={`hero-${index}`}
            headline={section.title}
            subheadline={section.mainText}
            description={section.description}
            image={section.image}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}
