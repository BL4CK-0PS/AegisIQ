import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkillDNAGraph } from "@/components/charts/SkillDNAGraph";
import { assessmentService } from "@/services/assessment.service";
import { reportService } from "@/services/report.service";

export default function GrowthTrajectory() {
  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(),
  });

  const completedIds = assessments?.filter((a) => a.status === "completed").map((a) => a.id) || [];

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const results = await Promise.all(
        completedIds.map((id) => reportService.get(id).catch(() => null))
      );
      return results.filter(Boolean);
    },
    enabled: completedIds.length > 0,
  });

  const isLoading = assessmentsLoading || reportsLoading;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </Card>
    );
  }

  if (!reports || reports.length < 2) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Growth Trajectory</CardTitle>
        </CardHeader>
        <EmptyState
          icon={<TrendingUp className="h-8 w-8" />}
          title="No growth data yet"
          description="Complete multiple assessments to track your trajectory"
        />
      </Card>
    );
  }

  const latest = reports[reports.length - 1]!;
  const previous = reports[reports.length - 2]!;
  const delta = latest.overall_score - previous.overall_score;

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Growth Trajectory</CardTitle>
      </CardHeader>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-surface-800/50 p-3">
          <span className="text-sm text-surface-400">Score Change</span>
          <span className={`text-sm font-bold ${delta >= 0 ? "text-cyber-400" : "text-danger-400"}`}>
            {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-surface-800/50 p-3 text-center">
            <p className="text-xs text-surface-500">Previous</p>
            <p className="text-xl font-bold text-surface-300">{previous.overall_score}</p>
          </div>
          <div className="rounded-lg bg-surface-800/50 p-3 text-center">
            <p className="text-xs text-surface-500">Latest</p>
            <p className="text-xl font-bold text-primary-400">{latest.overall_score}</p>
          </div>
        </div>

        <SkillDNAGraph
          capabilities={latest.capability_scores.map((cs) => ({
            name: cs.name,
            score: cs.score,
            benchmark: previous.capability_scores.find((p) => p.name === cs.name)?.score,
          }))}
          showBenchmark
        />
      </div>
    </Card>
  );
}
