import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { formatRelativeTime } from "@/lib/utils";
import type { Assessment } from "@/types";

const mockAssessments: Partial<Assessment>[] = [
  {
    id: "1",
    status: "completed",
    progress: 100,
    started_at: new Date(Date.now() - 86400000).toISOString(),
    total_challenges: 8,
  },
  {
    id: "2",
    status: "in_progress",
    progress: 65,
    started_at: new Date(Date.now() - 3600000).toISOString(),
    total_challenges: 10,
    current_challenge_index: 6,
  },
  {
    id: "3",
    status: "completed",
    progress: 100,
    started_at: new Date(Date.now() - 172800000).toISOString(),
    total_challenges: 6,
  },
];

const statusColors: Record<string, "success" | "primary" | "warning" | "danger"> = {
  completed: "success",
  in_progress: "primary",
  pending: "warning",
  abandoned: "danger",
};

export function RecentAssessments() {
  const navigate = useNavigate();

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {mockAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center gap-4 rounded-lg border border-surface-700/50 p-4 transition-colors hover:bg-surface-800/50"
          >
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-surface-200">
                  Assessment #{assessment.id}
                </span>
                <Badge variant={statusColors[assessment.status || "pending"]}>
                  {assessment.status?.replace("_", " ")}
                </Badge>
              </div>
              <Progress value={assessment.progress || 0} size="sm" />
              <p className="mt-1 text-xs text-surface-500">
                {formatRelativeTime(assessment.started_at || new Date())} ·{" "}
                {assessment.total_challenges} challenges
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/assessment/${assessment.id}`)}
              leftIcon={<Eye size={14} />}
            >
              View
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
