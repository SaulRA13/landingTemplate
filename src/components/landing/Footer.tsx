import { Logo } from '@/components/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <Logo />
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} LandingJrz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
