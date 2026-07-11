import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
  secondary: "bg-surface-700 text-surface-100 hover:bg-surface-600 shadow-sm",
  danger: "bg-danger-600 text-white hover:bg-danger-700 shadow-sm",
  ghost: "bg-transparent text-surface-300 hover:bg-surface-800 hover:text-surface-100",
  outline: "border border-surface-600 text-surface-200 hover:bg-surface-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <LoadingSpinner size="sm" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
