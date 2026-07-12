import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function SkillOverview() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Skill Overview</CardTitle>
      </CardHeader>
      <p className="px-6 pb-4 text-sm text-surface-400">
        No skill data yet. Complete an assessment to see your skill overview.
      </p>
    </Card>
  );
}
