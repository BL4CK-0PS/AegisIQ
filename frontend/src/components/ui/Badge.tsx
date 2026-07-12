import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "secondary" | "outline";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-surface-700 text-surface-200",
  primary: "bg-primary-900/50 text-primary-300 border border-primary-700/50",
  success: "bg-cyber-900/50 text-cyber-300 border border-cyber-700/50",
  warning: "bg-warning-900/50 text-warning-300 border border-warning-700/50",
  danger: "bg-danger-900/50 text-danger-300 border border-danger-700/50",
  secondary: "bg-surface-700/50 text-surface-300 border border-surface-600/50",
  outline: "border border-surface-600 text-surface-300",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
