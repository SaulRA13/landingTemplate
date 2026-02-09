import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { ImagePlaceholder } from '@/lib/content';
import { ArrowRight } from 'lucide-react';

type HeroProps = {
  content: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  image?: ImagePlaceholder;
};

export default function Hero({ content, image }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {content.headline}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {content.subheadline}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                {content.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          {image && (
            <div className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full">
                <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    data-ai-hint={image.imageHint}
                />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
