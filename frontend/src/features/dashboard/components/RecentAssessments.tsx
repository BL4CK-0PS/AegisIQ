import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, Loader2, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Alert } from "@/components/ui/Alert";
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

export function RecentAssessments() {
  const navigate = useNavigate();

  const { data: assessments, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(),
  });

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <Alert variant="error" title="Failed to load assessments">
            <p>{error.message || "Could not fetch assessment data. Please try again."}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => refetch()}
              leftIcon={<RefreshCw size={14} />}
            >
              Retry
            </Button>
          </Alert>
        </div>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          title="No assessments yet"
          description="Complete your first assessment to see it here"
          action={{
            label: "Start Assessment",
            onClick: () => navigate("/assessment"),
          }}
        />
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Assessments</CardTitle>
          <div className="flex items-center gap-2">
            {isFetching && <Loader2 className="h-3 w-3 animate-spin text-surface-500" />}
            <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")}>
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="space-y-2 px-6 pb-6">
        {assessments.slice(0, 5).map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3 cursor-pointer transition-colors hover:bg-surface-800"
            onClick={() =>
              a.status === "completed"
                ? navigate(`/report/${a.id}`)
                : navigate(`/assessment/${a.id}`)
            }
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-4 w-4 text-surface-400" />
              <div>
                <p className="text-sm text-surface-200">
                  Assessment {a.id.slice(0, 8)}
                </p>
                <p className="text-xs text-surface-500">
                  {a.total_challenges} challenges — {a.progress}%
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
