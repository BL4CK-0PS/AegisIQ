import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { assessmentService } from "@/services/assessment.service";
import type { AssessmentStatus } from "@/types";

function statusBadge(status: AssessmentStatus) {
  switch (status) {
    case "completed":
      return <Badge variant="success" size="sm">Done</Badge>;
    case "in_progress":
      return <Badge variant="primary" size="sm">Active</Badge>;
    case "paused":
      return <Badge variant="warning" size="sm">Paused</Badge>;
    default:
      return <Badge variant="secondary" size="sm">Pending</Badge>;
  }
}

export default function AssessmentHistory() {
  const navigate = useNavigate();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </Card>
    );
  }

  const completed = assessments?.filter((a) => a.status === "completed") || [];

  if (completed.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
        </CardHeader>
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          title="No completed assessments"
          description="Complete an assessment to build your history"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <div className="mt-4 space-y-2">
        {completed.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3 cursor-pointer transition-colors hover:bg-surface-800"
            onClick={() => navigate(`/report/${a.id}`)}
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-4 w-4 text-surface-400" />
              <div>
                <p className="text-sm text-surface-200">Assessment {a.id.slice(0, 8)}</p>
                <p className="text-xs text-surface-500">
                  {a.total_challenges} challenges — {new Date(a.completed_at || "").toLocaleDateString()}
                </p>
              </div>
            </div>
            {statusBadge(a.status)}
          </div>
        ))}
      </div>
    </Card>
  );
}
