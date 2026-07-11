import { Card } from '@/components/ui';
import { SkillDNAGraph } from '@/components/charts';

const capabilities = [
  { name: 'Incident Response', score: 82 },
  { name: 'Threat Hunting', score: 74 },
  { name: 'Log Analysis', score: 88 },
  { name: 'Network Security', score: 71 },
  { name: 'Communication', score: 85 },
  { name: 'Malware Analysis', score: 65 },
];

export default function SkillDNAOverview() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Skill DNA Overview</h2>
      <SkillDNAGraph data={capabilities} showBenchmark={true} />
    </Card>
  );
}
