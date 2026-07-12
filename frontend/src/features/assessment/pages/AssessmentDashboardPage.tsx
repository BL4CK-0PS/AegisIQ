import { ClipboardCheck, Target, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";

const missionTypes = [
  { type: "soc", label: "SOC Operations", icon: Target, color: "text-primary-400", bg: "bg-primary-900/30" },
  { type: "dfir", label: "DFIR", icon: Zap, color: "text-cyber-400", bg: "bg-cyber-900/30" },
  { type: "threat_hunting", label: "Threat Hunting", icon: ClipboardCheck, color: "text-warning-400", bg: "bg-warning-900/30" },
];

export default function AssessmentDashboardPage() {

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
          <EmptyState
            icon={<ClipboardCheck className="h-8 w-8" />}
            title="No assessments yet"
            description="Start your first assessment mission above"
          />
        </CardContent>
      </Card>
    </div>
  );
}
