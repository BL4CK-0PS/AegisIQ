import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { assessmentService } from "@/services/assessment.service";

export default function SkillDNAOverview() {
  const { data } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(100, 0),
  });

  const assessments = data?.assessments ?? [];
  const completed = assessments.filter((a) => a.status === "completed");

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-lg font-semibold text-surface-100 mb-4">Skill DNA Overview</h2>
      {completed.length === 0 ? (
        <p className="text-sm text-surface-400">
          No Skill DNA data yet. Complete an assessment to see your skill overview.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-surface-700/50 p-3">
              <p className="text-2xl font-bold text-primary-400">{completed.length}</p>
              <p className="text-xs text-surface-500">Assessments Completed</p>
            </div>
            <div className="rounded-lg border border-surface-700/50 p-3">
              <p className="text-2xl font-bold text-cyber-400">
                {[...new Set(completed.map((a) => a.domain ?? "Unknown"))].length}
              </p>
              <p className="text-xs text-surface-500">Domains Covered</p>
            </div>
          </div>
          <div className="space-y-2">
            {[...new Set(completed.map((a) => a.domain ?? "Unknown"))].map((domain) => (
              <div key={domain} className="flex items-center justify-between rounded-lg border border-surface-700/50 px-3 py-2">
                <span className="text-sm text-surface-200">{domain}</span>
                <span className="text-xs text-surface-500">
                  {completed.filter((a) => a.domain === domain).length} completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
