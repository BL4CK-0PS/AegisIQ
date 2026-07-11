import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

const weak_skills = [
  { name: 'Malware Analysis', current: 65, target: 80 },
  { name: 'Network Security', current: 71, target: 85 },
  { name: 'Threat Hunting', current: 74, target: 90 },
];

export default function CareerCompass() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Career Compass</h2>
      <div className="space-y-5">
        {weak_skills.map((skill, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{skill.name}</span>
              <span className="text-muted-foreground">
                {skill.current} / {skill.target}
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${skill.target}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/40"
                style={{ width: `${skill.current}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Recommended Focus</p>
        <ul className="text-sm space-y-1">
          <li>- Advanced malware reverse engineering</li>
          <li>- Network traffic forensics</li>
          <li>- Threat actor profiling techniques</li>
        </ul>
      </div>
    </Card>
  );
}
