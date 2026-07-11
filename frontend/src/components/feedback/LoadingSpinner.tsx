import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-surface-600 border-t-primary-500",
          sizes[size],
        )}
      />
      {label && <p className="text-sm text-surface-400">{label}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface-950">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-surface-400">Loading...</p>
      </div>
    </div>
  );
}
