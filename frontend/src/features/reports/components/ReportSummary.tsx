import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface CapabilityScore {
  name: string;
  score: number;
  max_score: number;
  confidence: number;
  category: string;
}

interface Report {
  overall_score: number;
  confidence: number;
  summary: string;
  capability_scores: CapabilityScore[];
  strengths: string[];
  weaknesses: string[];
}

interface ReportSummaryProps {
  report: Report;
}

export default function ReportSummary({ report }: ReportSummaryProps) {
  const scoreColor =
    report.overall_score >= 80
      ? 'text-green-600'
      : report.overall_score >= 60
        ? 'text-yellow-600'
        : 'text-red-600';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="col-span-1 p-6 lg:col-span-2">
        <h2 className="mb-2 text-lg font-semibold">Executive Summary</h2>
        <p className="leading-relaxed text-muted-foreground">{report.summary}</p>
      </Card>

      <Card className="col-span-1 flex flex-col items-center justify-center p-6">
        <p className="mb-1 text-sm font-medium text-muted-foreground">Overall Score</p>
        <p className={`text-6xl font-bold ${scoreColor}`}>{report.overall_score}</p>
        <Progress value={report.overall_score} className="mt-4 w-full" />
        <p className="mt-2 text-xs text-muted-foreground">
          Confidence: {(report.confidence * 100).toFixed(0)}%
        </p>
      </Card>

      <Card className="col-span-1 p-6">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Strengths</h3>
        </div>
        <ul className="space-y-2">
          {report.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <Badge variant="success" className="mt-0.5 shrink-0 text-xs">
                <CheckCircle className="mr-1 h-3 w-3" />
                Strong
              </Badge>
              <span className="text-sm text-muted-foreground">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="col-span-1 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold">Weaknesses</h3>
        </div>
        <ul className="space-y-2">
          {report.weaknesses.map((weakness, index) => (
            <li key={index} className="flex items-start gap-2">
              <Badge variant="danger" className="mt-0.5 shrink-0 text-xs">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Weak
              </Badge>
              <span className="text-sm text-muted-foreground">{weakness}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
