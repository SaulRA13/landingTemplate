'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Bot, Smartphone } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/content';

const iconMap: { [key: string]: React.ElementType } = {
  Edit,
  Bot,
  Smartphone,
};

type FeatureWithImage = {
  id: string;
  icon: string;
  title: string;
  description: string;
  image?: ImagePlaceholder;
};

type FeaturesProps = {
  content: FeatureWithImage[];
};

export default function Features({ content }: FeaturesProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
              Everything You Need to Succeed
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is packed with features to help you create, manage, and optimize your landing pages effortlessly.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
          {content.map((feature) => {
            const Icon = iconMap[feature.icon] || Edit;
            return (
              <Card key={feature.id} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {feature.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        width={600}
                        height={400}
                        className="aspect-video w-full object-cover"
                        data-ai-hint={feature.image.imageHint}
                      />
                    </div>
                  )}
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
