import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline text-lg font-semibold", className)}>
      Anton Beski
    </div>
  );
}
