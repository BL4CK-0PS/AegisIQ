import { Card } from '@/components/ui';
import { ProgressChart } from '@/components/charts';

const progressData = [
  { month: 'Jan', score: 62 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 78 },
  { month: 'Jun', score: 82 },
];

export default function GrowthTrajectory() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Growth Trajectory</h2>
      <ProgressChart data={progressData} />
    </Card>
  );
}
