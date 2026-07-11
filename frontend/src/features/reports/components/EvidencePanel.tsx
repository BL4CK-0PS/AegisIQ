import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceItem {
  capability: string;
  description: string;
  quality: 'strong' | 'moderate' | 'weak';
  source: string;
}

interface EvidencePanelProps {
  evidence: EvidenceItem[];
}

const qualityStyles: Record<string, string> = {
  strong: 'bg-green-100 text-green-800 border-green-200',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  weak: 'bg-red-100 text-red-800 border-red-200',
};

export default function EvidencePanel({ evidence }: EvidencePanelProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <FileSearch className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Supporting Evidence</h2>
      </div>

      <div className="space-y-4">
        {evidence.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">{item.capability}</span>
              <Badge
                variant="outline"
                className={cn('text-xs', qualityStyles[item.quality])}
              >
                {item.quality.charAt(0).toUpperCase() + item.quality.slice(1)}
              </Badge>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
            <p className="text-xs text-muted-foreground italic">Source: {item.source}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
