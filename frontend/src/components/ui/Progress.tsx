import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const barVariants = {
  default: "bg-primary-500",
  success: "bg-cyber-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

const sizes = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  variant = "default",
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-surface-300">Progress</span>
          <span className="text-surface-200">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-surface-700", sizes[size])}>
        <div
          className={cn("rounded-full transition-all duration-500 ease-out", barVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
