import { Card, Badge } from '@/components/ui';

const assessments = [
  { date: '2026-07-01', title: 'SOC Analyst Fundamentals', score: 88, status: 'passed' },
  { date: '2026-06-15', title: 'Threat Intelligence Analysis', score: 74, status: 'passed' },
  { date: '2026-05-28', title: 'Incident Handling & Response', score: 82, status: 'passed' },
  { date: '2026-05-10', title: 'Malware Analysis Basics', score: 65, status: 'review' },
];

export default function AssessmentHistory() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Assessment History</h2>
      <div className="space-y-4">
        {assessments.map((assessment, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div className="space-y-1">
              <p className="text-sm font-medium">{assessment.title}</p>
              <p className="text-xs text-muted-foreground">{assessment.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{assessment.score}%</Badge>
              <Badge variant={assessment.status === 'passed' ? 'default' : 'secondary'}>
                {assessment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
