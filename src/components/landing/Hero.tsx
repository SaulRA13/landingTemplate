
type HeroProps = {
  headline: string;
  subheadline: string;
  description?: string;
  image?: string;
};

export default function Hero({ headline, subheadline, description, image }: HeroProps) {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              {headline}
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              {subheadline}
            </p>
            {description && (
              <p className="max-w-[800px] text-muted-foreground text-lg">
                {description}
              </p>
            )}
          </div>
          {image && (
            <img 
              src={image} 
              alt={headline} 
              className="w-full max-w-md rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
