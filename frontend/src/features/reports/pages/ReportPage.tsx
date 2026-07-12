import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function ReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Assessment Report</h1>
              <p className="text-sm text-muted-foreground">
                Report ID: {reportId || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No report available"
          description="Complete an assessment to view your report"
          action={{
            label: "Start Assessment",
            onClick: () => navigate("/assessment"),
          }}
        />
      </div>
    </div>
  );
}
