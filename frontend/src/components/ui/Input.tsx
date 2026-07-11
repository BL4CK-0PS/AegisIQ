import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex w-full rounded-lg border bg-surface-800 px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500"
                : "border-surface-600",
              leftIcon && "pl-10",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-danger-400">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-surface-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
