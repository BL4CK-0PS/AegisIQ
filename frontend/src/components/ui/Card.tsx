import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
}

const variants = {
  default: "bg-surface-800/50 border border-surface-700/50",
  elevated: "bg-surface-800 border border-surface-700/50 shadow-lg",
  bordered: "bg-surface-800/30 border border-surface-700",
};

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl p-6", variants[variant], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-surface-100", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-surface-400", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex items-center border-t border-surface-700/50 pt-4", className)}
      {...props}
    />
  );
}
