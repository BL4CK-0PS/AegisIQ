import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Shield } from 'lucide-react';

interface Capability {
  name: string;
  score: number;
  max_score: number;
  confidence: number;
  category: string;
}

interface CapabilityMatrixProps {
  capabilities: Capability[];
}

export default function CapabilityMatrix({ capabilities }: CapabilityMatrixProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Capability Assessment</h2>
      </div>

      <div className="space-y-5">
        {capabilities.map((capability) => {
          const percentage = (capability.score / capability.max_score) * 100;

          return (
            <div key={capability.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{capability.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {capability.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {capability.score}/{capability.max_score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(capability.confidence * 100).toFixed(0)}% conf.
                  </span>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
