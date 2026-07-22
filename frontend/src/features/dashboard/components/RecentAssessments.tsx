import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";
import { assessmentService } from "@/services/assessment.service";

export function RecentAssessments() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(5, 0),
  });

  const assessments = data?.assessments ?? [];

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      {isLoading ? (
        <div className="px-6 pb-4 text-sm text-surface-500">Loading assessments...</div>
      ) : assessments.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          title="No assessments yet"
          description="Complete your first assessment to see it here"
          action={{
            label: "Start Assessment",
            onClick: () => navigate("/assessment"),
          }}
        />
      ) : (
        <div className="space-y-2 px-6 pb-4">
          {assessments.map((a) => (
            <button
              key={a.id}
              onClick={() =>
                a.status === "completed"
                  ? navigate(`/report/${a.id}`)
                  : navigate(`/assessment/${a.id}`)
              }
              className="flex w-full items-center justify-between rounded-lg border border-surface-700/50 p-3 text-left transition-colors hover:bg-surface-800/50"
            >
              <div>
                <p className="text-sm font-medium text-surface-200">
                  {a.domain ?? "Assessment"}
                </p>
                <p className="text-xs text-surface-500">
                  {a.started_at ? new Date(a.started_at).toLocaleDateString() : "Unknown date"}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  a.status === "completed"
                    ? "bg-success-900/30 text-success-400"
                    : a.status === "active"
                      ? "bg-primary-900/30 text-primary-400"
                      : "bg-surface-700/30 text-surface-400"
                }`}
              >
                {a.status}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
