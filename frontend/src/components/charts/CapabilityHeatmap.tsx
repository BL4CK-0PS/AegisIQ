import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface HeatmapData {
  capability: string;
  score: number;
}

interface CapabilityHeatmapProps {
  data: HeatmapData[];
}

function getHeatColor(score: number): string {
  if (score >= 80) return "bg-cyber-500/80 text-white";
  if (score >= 60) return "bg-cyber-500/50 text-surface-100";
  if (score >= 40) return "bg-warning-500/50 text-surface-100";
  if (score >= 20) return "bg-danger-500/50 text-surface-100";
  return "bg-danger-500/80 text-white";
}

export function CapabilityHeatmap({ data }: CapabilityHeatmapProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Capability Heatmap</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((item) => (
          <div
            key={item.capability}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg p-4 text-center transition-transform hover:scale-105",
              getHeatColor(item.score),
            )}
          >
            <span className="text-2xl font-bold">{item.score}</span>
            <span className="mt-1 text-xs font-medium">{item.capability}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
