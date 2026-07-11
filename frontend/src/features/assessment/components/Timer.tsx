import { Clock } from "lucide-react";
import { useTimer } from "@/hooks";

export function Timer() {
  const { formatted, isRunning, toggle } = useTimer();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-lg border border-surface-700 px-3 py-1.5 text-sm font-mono text-surface-200 transition-colors hover:bg-surface-800"
    >
      <Clock size={14} className={isRunning ? "text-cyber-400" : "text-surface-500"} />
      {formatted}
    </button>
  );
}
