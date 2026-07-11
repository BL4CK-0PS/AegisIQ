import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-800 text-surface-400">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-surface-200">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-surface-400">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}
