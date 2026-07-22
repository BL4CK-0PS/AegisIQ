import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { assessmentService } from "@/services/assessment.service";

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(10, 0),
  });

  const assessments = data?.assessments ?? [];

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-lg font-semibold text-surface-100 mb-4">Assessment History</h2>
      {assessments.length === 0 ? (
        <p className="text-sm text-surface-400">No assessment history yet.</p>
      ) : (
        <div className="space-y-2">
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
                <p className="text-sm font-medium text-surface-200">{a.domain ?? "Assessment"}</p>
                <p className="text-xs text-surface-500">
                  {a.started_at ? new Date(a.started_at).toLocaleDateString() : "Unknown"}
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
