import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

const skillData = [
  { name: "Incident Response", score: 82, color: "success" as const },
  { name: "Threat Hunting", score: 74, color: "default" as const },
  { name: "Windows Security", score: 88, color: "success" as const },
  { name: "Network Analysis", score: 79, color: "default" as const },
  { name: "Communication", score: 85, color: "success" as const },
];

export function SkillOverview() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Skill Overview</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {skillData.map((skill) => (
          <div key={skill.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm text-surface-300">{skill.name}</span>
              <span className="text-sm font-medium text-surface-200">
                {skill.score}%
              </span>
            </div>
            <Progress value={skill.score} variant={skill.color} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}
