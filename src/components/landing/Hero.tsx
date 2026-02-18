
type HeroProps = {
  headline: string;
  subheadline: string;
  description?: string;
  image?: string;
};

export default function Hero({ headline, subheadline, description, image }: HeroProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {image && (
            <img 
              src={image} 
              alt={headline} 
              className="w-full max-w-md rounded-lg object-cover"
            />
          )}
          <div className="space-y-4">
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
        </div>
      </div>
    </section>
  );
}
