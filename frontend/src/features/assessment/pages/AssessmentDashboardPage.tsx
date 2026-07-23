import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Target, Zap, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { assessmentService } from "@/services/assessment.service";

const missionTypes = [
  { type: "soc", label: "SOC Operations", icon: Target, color: "text-primary-400", bg: "bg-primary-900/30" },
  { type: "dfir", label: "DFIR", icon: Zap, color: "text-cyber-400", bg: "bg-cyber-900/30" },
  { type: "threat_hunting", label: "Threat Hunting", icon: ClipboardCheck, color: "text-warning-400", bg: "bg-warning-900/30" },
];

function statusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="success" size="sm">Completed</Badge>;
    case "in_progress":
    case "active":
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
  const queryClient = useQueryClient();
  const [creatingDomain, setCreatingDomain] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (domain: string) => assessmentService.create(domain),
    onSuccess: (data) => {
      const id = data.assessment_id;
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      navigate(`/assessment/${id}`);
    },
    onError: (err: unknown) => {
      console.error("Failed to create assessment:", err);
      setCreatingDomain(null);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(20, 0),
  });

  const assessments = data?.assessments ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Assessments</h1>
        <p className="text-sm text-surface-400">
          Adaptive cybersecurity capability assessment missions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {missionTypes.map((m) => {
          const isCreating = creatingDomain === m.type && createMutation.isPending;
          return (
            <Card
              key={m.type}
              variant="elevated"
              className={`cursor-pointer transition-colors hover:border-surface-600 ${isCreating ? "pointer-events-none opacity-60" : ""}`}
              onClick={() => {
                if (!isCreating) {
                  setCreatingDomain(m.type);
                  createMutation.mutate(m.type);
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${m.bg}`}>
                  {isCreating ? (
                    <Loader2 className={`h-6 w-6 ${m.color} animate-spin`} />
                  ) : (
                    <m.icon className={`h-6 w-6 ${m.color}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-200">{m.label}</p>
                  <p className="text-xs text-surface-500">
                    {isCreating ? "Starting session..." : "Start new mission"}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>Your recent assessment sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-surface-500">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <EmptyState
              icon={<ClipboardCheck className="h-8 w-8" />}
              title="No assessments yet"
              description="Start your first assessment mission above"
            />
          ) : (
            <div className="space-y-3">
              {assessments.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    a.status === "completed"
                      ? navigate(`/report/${a.id}`)
                      : navigate(`/assessment/${a.id}`)
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-surface-700/50 p-4 text-left transition-colors hover:bg-surface-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-200">
                      {a.domain ?? "Assessment"}
                    </p>
                    <p className="text-xs text-surface-500">
                      {a.started_at ? new Date(a.started_at).toLocaleDateString() : "Unknown date"}
                    </p>
                  </div>
                  {statusBadge(a.status)}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
