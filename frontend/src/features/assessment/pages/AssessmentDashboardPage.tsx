import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, Target, Zap, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { assessmentService } from "@/services/assessment.service";
import type { AssessmentStatus } from "@/types";

const missionTypes = [
  { type: "soc", label: "SOC Operations", icon: Target, color: "text-primary-400", bg: "bg-primary-900/30" },
  { type: "dfir", label: "DFIR", icon: Zap, color: "text-cyber-400", bg: "bg-cyber-900/30" },
  { type: "threat_hunting", label: "Threat Hunting", icon: ClipboardCheck, color: "text-warning-400", bg: "bg-warning-900/30" },
];

function statusBadge(status: AssessmentStatus) {
  switch (status) {
    case "completed":
      return <Badge variant="success" size="sm">Completed</Badge>;
    case "in_progress":
      return <Badge variant="primary" size="sm">In Progress</Badge>;
    case "paused":
      return <Badge variant="warning" size="sm">Paused</Badge>;
    case "abandoned":
      return <Badge variant="danger" size="sm">Abandoned</Badge>;
    default:
      return <Badge variant="secondary" size="sm">Pending</Badge>;
  }
}

export default function AssessmentDashboardPage() {
  const navigate = useNavigate();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Assessments</h1>
        <p className="text-sm text-surface-400">
          Adaptive cybersecurity capability assessment missions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {missionTypes.map((m) => (
          <Card key={m.type} variant="elevated" className="cursor-pointer transition-colors hover:border-surface-600">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${m.bg}`}>
                <m.icon className={`h-6 w-6 ${m.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-200">{m.label}</p>
                <p className="text-xs text-surface-500">Start new mission</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>Your recent assessment sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
            </div>
          ) : !assessments || assessments.length === 0 ? (
            <EmptyState
              icon={<ClipboardCheck className="h-8 w-8" />}
              title="No assessments yet"
              description="Start your first assessment mission above"
            />
          ) : (
            <div className="space-y-3">
              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3 transition-colors hover:bg-surface-800 cursor-pointer"
                  onClick={() => navigate(`/assessment/${a.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/30">
                      <ClipboardCheck className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-200">
                        Assessment {a.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-surface-500">
                        {a.total_challenges} challenges — {a.progress}% complete
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(a.status)}
                    {a.status === "in_progress" && (
                      <Button variant="ghost" size="sm">
                        Resume
                      </Button>
                    )}
                    {a.status === "completed" && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/report/${a.id}`); }}>
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
