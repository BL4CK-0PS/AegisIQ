import { Progress } from "@/components/ui/Progress";

interface ProgressTrackerProps {
  current: number;
  total: number;
}

export function ProgressTracker({ current, total }: ProgressTrackerProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-surface-400">
          Question {current} of {total}
        </span>
        <span className="text-surface-400">{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} size="md" />
    </div>
  );
}
