import { Button } from '@/components/ui/button';

type CTAProps = {
  content: {
    headline: string;
    cta: string;
  };
};

export default function CTA({ content }: CTAProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
            {content.headline}
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join us today and start building with confidence. No credit card required.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            {content.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
