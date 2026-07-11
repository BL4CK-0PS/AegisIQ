import type { HTMLAttributes } from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
}

const variants = {
  info: {
    container: "bg-primary-900/30 border-primary-700/50 text-primary-200",
    icon: Info,
    iconColor: "text-primary-400",
  },
  success: {
    container: "bg-cyber-900/30 border-cyber-700/50 text-cyber-200",
    icon: CheckCircle,
    iconColor: "text-cyber-400",
  },
  warning: {
    container: "bg-warning-900/30 border-warning-700/50 text-warning-200",
    icon: AlertTriangle,
    iconColor: "text-warning-400",
  },
  error: {
    container: "bg-danger-900/30 border-danger-700/50 text-danger-200",
    icon: AlertCircle,
    iconColor: "text-danger-400",
  },
};

export function Alert({ variant = "info", title, className, children, ...props }: AlertProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        config.container,
        className,
      )}
      {...props}
    >
      <Icon size={18} className={cn("mt-0.5 shrink-0", config.iconColor)} />
      <div className="flex-1">
        {title && <h4 className="mb-1 font-medium">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
