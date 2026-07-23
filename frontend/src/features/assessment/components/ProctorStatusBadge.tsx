import { Monitor, Mic, Maximize, Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProctorStatusBadgeProps {
  isFullscreen: boolean;
  isScreenSharing: boolean;
  isMicActive: boolean;
  isTabFocused: boolean;
  violationCount: number;
  isLocked: boolean;
  audioLevel: number;
}

interface IndicatorProps {
  label: string;
  active: boolean;
  icon: React.ReactNode;
}

function Indicator({ label, active, icon }: IndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
        active
          ? "bg-success-900/40 text-success-400"
          : "bg-danger-900/40 text-danger-400",
      )}
      title={`${label}: ${active ? "Active" : "Inactive"}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

export function ProctorStatusBadge({
  isFullscreen,
  isScreenSharing,
  isMicActive,
  isTabFocused,
  violationCount,
  isLocked,
  audioLevel,
}: ProctorStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-surface-700/50 bg-surface-800/80 px-3 py-1.5 backdrop-blur-sm">
      <Eye size={12} className="text-primary-400" />
      <span className="text-[10px] font-medium text-surface-400">PROCTOR</span>

      <div className="flex items-center gap-1">
        <Indicator label="FS" active={isFullscreen} icon={<Maximize size={10} />} />
        <Indicator label="Screen" active={isScreenSharing} icon={<Monitor size={10} />} />
        <Indicator label="Mic" active={isMicActive} icon={<Mic size={10} />} />
      </div>

      {!isTabFocused && (
        <span className="flex items-center gap-0.5 rounded-full bg-warning-900/40 px-1.5 py-0.5 text-[10px] font-medium text-warning-400">
          <AlertTriangle size={9} />
          Focus
        </span>
      )}

      {violationCount > 0 && (
        <span className="rounded-full bg-danger-900/40 px-1.5 py-0.5 text-[10px] font-medium text-danger-400">
          {violationCount}/{3}
        </span>
      )}

      {isMicActive && audioLevel > 0 && (
        <div className="flex items-center gap-px">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all",
                audioLevel > (i + 1) * 30 ? "bg-success-400" : "bg-surface-600",
              )}
              style={{ height: `${4 + i * 2}px` }}
            />
          ))}
        </div>
      )}

      {isLocked && (
        <span className="rounded-full bg-danger-900/50 px-2 py-0.5 text-[10px] font-bold text-danger-300">
          LOCKED
        </span>
      )}
    </div>
  );
}
