import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

interface Capability {
  id: string;
  name: string;
  category: string;
  weight: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  sub_skills: string[];
}

interface CapabilityListProps {
  capabilities: Capability[];
}

const difficultyColors: Record<string, "default" | "success" | "warning" | "danger" | "primary"> = {
  beginner: "success",
  intermediate: "primary",
  advanced: "warning",
  expert: "danger",
};

export function CapabilityList({ capabilities }: CapabilityListProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Capability Details</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {capabilities.map((cap) => (
          <div
            key={cap.id}
            className="rounded-lg border border-surface-700/50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-surface-200">{cap.name}</h3>
                <Badge variant={difficultyColors[cap.difficulty]} size="sm">
                  {cap.difficulty}
                </Badge>
              </div>
              <span className="text-sm font-medium text-primary-400">
                {Math.round(cap.weight * 100)}%
              </span>
            </div>
            <p className="mb-2 text-xs text-surface-400">{cap.description}</p>
            <Progress value={cap.weight * 100} size="sm" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cap.sub_skills.map((skill) => (
                <Badge key={skill} variant="default" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
