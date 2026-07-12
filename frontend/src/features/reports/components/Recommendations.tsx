import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
};

const priorityOrder: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function Recommendations({ recommendations }: RecommendationsProps) {
  const sorted = [...recommendations].sort(
    (a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)
  );

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Recommendations</h2>
      </div>

      <div className="space-y-4">
        {sorted.map((rec, index) => (
          <div
            key={index}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">{rec.title}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn('text-xs', priorityStyles[rec.priority])}
                >
                  {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {rec.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{rec.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
