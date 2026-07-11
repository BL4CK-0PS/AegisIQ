import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Play, Clock, Target, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const mockAssessments = [
  { id: "1", title: "SOC Analyst Assessment", type: "soc", status: "completed", score: 82, duration: "25 min" },
  { id: "2", title: "DFIR Challenge", type: "dfir", status: "completed", score: 74, duration: "30 min" },
  { id: "3", title: "Threat Hunting", type: "threat_hunting", status: "in_progress", score: null, duration: "15 min" },
];

const missionTypes = [
  { type: "soc", label: "SOC Operations", icon: Target, color: "text-primary-400", bg: "bg-primary-900/30" },
  { type: "dfir", label: "DFIR", icon: Zap, color: "text-cyber-400", bg: "bg-cyber-900/30" },
  { type: "threat_hunting", label: "Threat Hunting", icon: ClipboardCheck, color: "text-warning-400", bg: "bg-warning-900/30" },
];

const statusColors: Record<string, "success" | "primary" | "warning"> = {
  completed: "success",
  in_progress: "primary",
  pending: "warning",
};

export default function AssessmentDashboardPage() {
  const navigate = useNavigate();

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
          <div className="space-y-3">
            {mockAssessments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 rounded-lg border border-surface-700/50 p-4 transition-colors hover:bg-surface-800/50"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-surface-200">{a.title}</span>
                    <Badge variant={statusColors[a.status]}>{a.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {a.duration}
                    </span>
                    {a.score !== null && <span>Score: {a.score}%</span>}
                  </div>
                </div>
                <Button
                  variant={a.status === "in_progress" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => navigate(`/assessment/${a.id}`)}
                  leftIcon={a.status === "in_progress" ? <Play size={14} /> : undefined}
                >
                  {a.status === "in_progress" ? "Resume" : "View"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
