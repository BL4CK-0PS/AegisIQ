import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { assessmentService } from "@/services/assessment.service";

interface GrowthPoint {
  date: string;
  label: string;
  count: number;
  domains: number;
}

function buildGrowthTimeline(assessments: { status: string; started_at: string | null; domain: string | null }[]): GrowthPoint[] {
  const completed = assessments
    .filter((a) => a.status === "completed" && a.started_at)
    .sort((a, b) => new Date(a.started_at!).getTime() - new Date(b.started_at!).getTime());

  if (completed.length === 0) return [];

  const seenDomains = new Set<string>();
  const points: GrowthPoint[] = [];

  completed.forEach((a, i) => {
    const domain = (a.domain ?? "Unknown").toLowerCase();
    seenDomains.add(domain);
    const date = new Date(a.started_at!);
    points.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      label: `#${i + 1}`,
      count: i + 1,
      domains: seenDomains.size,
    });
  });

  return points;
}

function Sparkline({ points }: { points: GrowthPoint[] }) {
  if (points.length < 2) {
    return (
      <div className="flex items-center justify-center h-16 text-xs text-surface-500">
        Need at least 2 completed assessments for trend line
      </div>
    );
  }

  const maxCount = Math.max(...points.map((p) => p.count));
  const width = 100;
  const height = 60;
  const padding = 4;

  const svgPoints = points.map((p, i) => ({
    x: padding + (i / (points.length - 1)) * (width - padding * 2),
    y: height - padding - (p.count / maxCount) * (height - padding * 2),
  }));

  const first = svgPoints[0]!;
  const last = svgPoints[svgPoints.length - 1]!;
  const linePath = svgPoints.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
  const areaPath = `${linePath} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
      <defs>
        <linearGradient id="growth-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(34,197,94)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(34,197,94)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#growth-gradient)" />
      <path d={linePath} fill="none" stroke="rgb(34,197,94)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {svgPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="2" fill="rgb(34,197,94)" />
      ))}
    </svg>
  );
}

export default function GrowthTrajectory() {
  const { data } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(100, 0),
  });

  const assessments = data?.assessments ?? [];
  const completed = assessments.filter((a) => a.status === "completed");
  const timeline = buildGrowthTimeline(assessments);

  if (completed.length === 0) {
    return (
      <Card variant="elevated" className="p-6">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">Growth Trajectory</h2>
        <p className="text-sm text-surface-400">
          No growth data yet. Complete multiple assessments to track your trajectory.
        </p>
      </Card>
    );
  }

  const domains = [...new Set(completed.map((a) => (a.domain ?? "Unknown").toLowerCase()))];
  const firstDate = timeline[0]?.date ?? "N/A";
  const lastDate = timeline[timeline.length - 1]?.date ?? "N/A";

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-lg font-semibold text-surface-100 mb-1">Growth Trajectory</h2>
      <p className="text-xs text-surface-500 mb-4">
        {firstDate} → {lastDate}
      </p>

      <div className="rounded-lg border border-surface-700/50 p-3 mb-4">
        <Sparkline points={timeline} />
      </div>

      <div className="space-y-2">
        {timeline.map((point, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-surface-700/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={12} className="text-success-400" />
              <span className="text-xs text-surface-400">{point.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-surface-300">
                Assessment {point.label}
              </span>
              <span className="text-[10px] text-surface-500">
                {point.domains} domain{point.domains !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-success-900/10 border border-success-900/20 p-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-success-400" />
          <span className="text-xs font-medium text-success-300">
            {completed.length} assessment{completed.length !== 1 ? "s" : ""} completed across {domains.length} domain{domains.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Card>
  );
}
