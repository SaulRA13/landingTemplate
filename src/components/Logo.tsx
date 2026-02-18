import { Rocket, ScanEye } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 font-headline text-xl font-bold text-foreground", className)}>
      <ScanEye className="size-5 text-primary" />
      <span>Scanner</span>
    </div>
  );
}
