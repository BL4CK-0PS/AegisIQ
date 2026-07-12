import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "border-cyber-700/50 bg-cyber-900/30",
  error: "border-danger-700/50 bg-danger-900/30",
  info: "border-primary-700/50 bg-primary-900/30",
  warning: "border-warning-700/50 bg-warning-900/30",
};

const iconStyles = {
  success: "text-cyber-400",
  error: "text-danger-400",
  info: "text-primary-400",
  warning: "text-warning-400",
};

function ToastItem({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
        styles[toast.type],
      )}
    >
      <Icon size={18} className={cn("mt-0.5 shrink-0", iconStyles[toast.type])} />
      <div className="flex-1">
        <p className="text-sm font-medium text-surface-100">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-surface-400">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded p-1 text-surface-400 hover:text-surface-200"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

let toastCounter = 0;

export function createToast(
  type: ToastMessage["type"],
  title: string,
  message?: string,
): ToastMessage {
  return {
    id: `toast-${++toastCounter}`,
    type,
    title,
    message,
  };
}
