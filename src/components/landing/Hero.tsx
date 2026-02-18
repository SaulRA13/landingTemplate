
type HeroProps = {
  headline: string;
  subheadline: string;
};

export default function Hero({ headline, subheadline }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              {headline}
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              {subheadline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
