import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { assessmentService } from "@/services/assessment.service";

export function SkillOverview() {
  const { data } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(100, 0),
  });

  const assessments = data?.assessments ?? [];
  const completed = assessments.filter((a) => a.status === "completed");

  const domainCounts: Record<string, number> = {};
  completed.forEach((a) => {
    const domain = a.domain ?? "Unknown";
    domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
  });

  const domains = Object.entries(domainCounts).sort(([, a], [, b]) => b - a);

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Skill Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {domains.length === 0 ? (
          <p className="text-sm text-surface-400">
            No skill data yet. Complete an assessment to see your skill overview.
          </p>
        ) : (
          <div className="space-y-3">
            {domains.map(([domain, count]) => {
              const pct = Math.min((count / completed.length) * 100, 100);
              return (
                <div key={domain} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-surface-300">{domain}</span>
                    <span className="text-surface-500">{count} completed</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-700">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
