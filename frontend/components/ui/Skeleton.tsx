import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} />;
}

export function StatCardSkeleton() {
  return (
    <div className="glass-panel p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-panel p-6 h-80">
      <Skeleton className="h-5 w-40 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
