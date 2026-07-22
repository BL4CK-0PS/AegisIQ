import { Card } from "@/components/ui/Card";

export default function GrowthTrajectory() {
  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-lg font-semibold text-surface-100 mb-4">Growth Trajectory</h2>
      <p className="text-sm text-surface-400">
        No growth data yet. Complete multiple assessments to track your trajectory.
      </p>
    </Card>
  );
}
