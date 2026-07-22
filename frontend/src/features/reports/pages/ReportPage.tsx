import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  FileText,
  AlertTriangle,
  Loader2,
  ClipboardCheck,
  Clock,
  Target,
  RefreshCw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { reportService } from "@/services/report.service";
import { assessmentService } from "@/services/assessment.service";
import { SkillDNAGraph } from "@/components/charts/SkillDNAGraph";
import { ScoreBreakdown } from "@/components/charts/ScoreBreakdown";
import ReportSummary from "../components/ReportSummary";
import CapabilityMatrix from "../components/CapabilityMatrix";
import EvidencePanel from "../components/EvidencePanel";
import MentorFeedback from "../components/MentorFeedback";
import Recommendations from "../components/Recommendations";
import type { Report, Assessment } from "@/types";

function getScoreRating(score: number): {
  label: string;
  variant: "success" | "primary" | "warning" | "danger";
} {
  if (score >= 80) return { label: "Excellent", variant: "success" };
  if (score >= 60) return { label: "Proficient", variant: "primary" };
  if (score >= 40) return { label: "Developing", variant: "warning" };
  return { label: "Needs Improvement", variant: "danger" };
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "N/A";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function assessmentStatusLabel(status: Assessment["status"]): {
  label: string;
  variant: "success" | "primary" | "warning" | "danger" | "secondary";
} {
  switch (status) {
    case "completed":
      return { label: "Completed", variant: "success" };
    case "in_progress":
      return { label: "In Progress", variant: "primary" };
    case "paused":
      return { label: "Paused", variant: "warning" };
    case "abandoned":
      return { label: "Abandoned", variant: "danger" };
    default:
      return { label: "Pending", variant: "secondary" };
  }
}

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [exportError, setExportError] = useState<string | null>(null);

  const {
    data: assessment,
    isLoading: assessmentLoading,
    error: assessmentError,
  } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => assessmentService.get(id!),
    enabled: !!id,
  });

  const {
    data: report,
    isLoading: reportLoading,
  } = useQuery({
    queryKey: ["report", "by-assessment", id],
    queryFn: () => reportService.getByAssessmentId(id!),
    enabled: !!id && assessment?.status === "completed",
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: (assessmentId: string) => reportService.generate(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", "by-assessment", id] });
    },
  });

  const isLoading = assessmentLoading || (assessment?.status === "completed" && reportLoading);
  const showReportNotFound =
    !assessmentLoading &&
    assessment &&
    assessment.status === "completed" &&
    !reportLoading &&
    !report;

  const handleExportPdf = async (reportId: string) => {
    setExportError(null);
    try {
      const blob = await reportService.exportPdf(reportId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Failed to export PDF. Please try again.");
    }
  };

  const handleExportJson = async (reportData: Report) => {
    setExportError(null);
    try {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportData.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Failed to export JSON. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          <p className="text-sm text-surface-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (assessmentError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">
              Assessment Report
            </h1>
            <p className="text-sm text-surface-500">ID: {id || "N/A"}</p>
          </div>
        </div>

        <EmptyState
          icon={<AlertTriangle className="h-8 w-8" />}
          title="Assessment not found"
          description="This assessment may not exist or you may not have access to it."
          action={{
            label: "Back to Dashboard",
            onClick: () => navigate("/dashboard"),
          }}
        />
      </div>
    );
  }

  if (assessment && assessment.status !== "completed") {
    const status = assessmentStatusLabel(assessment.status);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">
              Assessment Report
            </h1>
            <p className="text-sm text-surface-500">
              Assessment {id?.slice(0, 8)}
            </p>
          </div>
        </div>

        <Card variant="elevated" className="flex flex-col items-center p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-900/30">
            <ClipboardCheck className="h-8 w-8 text-primary-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-surface-100">
            Assessment Not Completed
          </h2>
          <p className="mb-4 max-w-md text-surface-400">
            This assessment is currently{" "}
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
            . Complete the assessment to view the report.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/assessment")}>
              Back to Assessments
            </Button>
            {assessment.status === "in_progress" && (
              <Button
                onClick={() => navigate(`/assessment/${assessment.id}`)}
                leftIcon={<Play size={16} />}
              >
                Resume Assessment
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (showReportNotFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">
              Assessment Report
            </h1>
            <p className="text-sm text-surface-500">
              Assessment {id?.slice(0, 8)}
            </p>
          </div>
        </div>

        <Card variant="elevated" className="flex flex-col items-center p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning-900/30">
            <FileText className="h-8 w-8 text-warning-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-surface-100">
            No Report Available
          </h2>
          <p className="mb-6 max-w-md text-surface-400">
            This assessment has been completed but no report has been generated
            yet. Generate one to view the full analysis.
          </p>
          <Button
            onClick={() => generateMutation.mutate(id!)}
            isLoading={generateMutation.isPending}
            leftIcon={<RefreshCw size={16} />}
          >
            Generate Report
          </Button>
          {generateMutation.isError && (
            <p className="mt-3 text-sm text-danger-400">
              Failed to generate report. Please try again.
            </p>
          )}
        </Card>
      </div>
    );
  }

  if (!report) return null;

  const rating = getScoreRating(report.overall_score);

  const scoreChartData = report.capability_scores.map((cs) => ({
    name: cs.name,
    score: cs.score,
  }));

  const radarChartData = report.capability_scores.map((cs) => ({
    name: cs.name,
    score: cs.score,
    benchmark: 70,
  }));

  return (
    <div className="space-y-6">
      {exportError && (
        <Alert variant="error" title="Export Failed">
          {exportError}
        </Alert>
      )}

      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-surface-100">
              Assessment Report
            </h1>
            <p className="text-sm text-surface-500">
              Assessment {id?.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportPdf(report.id)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportJson(report)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {assessment && (
        <Card variant="elevated" className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm text-surface-400">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>
                Status:{" "}
                <Badge
                  variant={assessmentStatusLabel(assessment.status).variant}
                  size="sm"
                >
                  {assessmentStatusLabel(assessment.status).label}
                </Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{assessment.total_challenges} challenges</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Duration: {formatDuration(assessment.duration_seconds)}</span>
            </div>
            {assessment.started_at && (
              <span>
                Started: {new Date(assessment.started_at).toLocaleDateString()}
              </span>
            )}
            {assessment.completed_at && (
              <span>
                Completed:{" "}
                {new Date(assessment.completed_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </Card>
      )}

      <Card variant="elevated" className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center">
            <p className="mb-1 text-sm font-medium text-surface-400">
              Overall Rating
            </p>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary-500/30 bg-primary-900/20">
              <span className="text-3xl font-bold text-primary-400">
                {report.overall_score}
              </span>
            </div>
            <Badge variant={rating.variant} className="mt-2">
              {rating.label}
            </Badge>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-4 text-sm text-surface-400">
              <span>
                Confidence: {(report.confidence * 100).toFixed(0)}%
              </span>
              <span>|</span>
              <span>
                Generated:{" "}
                {new Date(report.generated_at).toLocaleDateString()}
              </span>
              <span>|</span>
              <span>Capabilities: {report.capability_scores.length}</span>
            </div>
            <p className="leading-relaxed text-surface-300">{report.summary}</p>
            {report.strengths.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-surface-500">
                  STRENGTHS
                </p>
                <div className="flex flex-wrap gap-1">
                  {report.strengths.map((s, i) => (
                    <Badge key={i} variant="success" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {report.weaknesses.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-medium text-surface-500">
                  WEAKNESSES
                </p>
                <div className="flex flex-wrap gap-1">
                  {report.weaknesses.map((w, i) => (
                    <Badge key={i} variant="danger" size="sm">
                      {w}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <ReportSummary report={report} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkillDNAGraph capabilities={radarChartData} showBenchmark />
        <ScoreBreakdown data={scoreChartData} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CapabilityMatrix capabilities={report.capability_scores} />
        <EvidencePanel evidence={report.evidence} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MentorFeedback report={report} />
        <Recommendations recommendations={report.recommendations} />
      </div>

      {report.mitre_mapping.length > 0 && (
        <Card variant="elevated" className="p-6">
          <CardHeader>
            <CardTitle>MITRE ATT&CK Mapping</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {report.mitre_mapping.map((technique, i) => (
              <Badge key={i} variant="primary" size="sm">
                {technique}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
