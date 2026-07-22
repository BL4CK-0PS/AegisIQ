import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardCheck,
  Dna,
  TrendingUp,
  FileText,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { RecentAssessments } from "../components/RecentAssessments";
import { SkillOverview } from "../components/SkillOverview";
import { assessmentService } from "@/services/assessment.service";
import { skillDnaService } from "@/services/skill-dna.service";

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: assessments,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments,
  } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(),
  });

  const {
    data: profiles,
    isLoading: profilesLoading,
    error: profilesError,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["skill-dna-profiles"],
    queryFn: () => skillDnaService.list(),
  });

  const isLoading = assessmentsLoading || profilesLoading;
  const hasError = assessmentsError || profilesError;

  const completedCount = assessments?.filter((a) => a.status === "completed").length || 0;
  const totalCount = assessments?.length || 0;
  const avgScore = completedCount > 0
    ? Math.round(
        assessments!
          .filter((a) => a.status === "completed")
          .reduce((sum, a) => sum + (a.progress || 0), 0) / completedCount
      )
    : 0;
  const profileCount = profiles?.length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">
            Welcome back
          </h1>
          <p className="text-sm text-surface-400">
            Track your cybersecurity capability progress
          </p>
        </div>
        <Button onClick={() => navigate("/assessment")} leftIcon={<Plus size={16} />}>
          New Assessment
        </Button>
      </div>

      {hasError && (
        <Alert variant="error" title="Some data failed to load">
          <div className="flex items-center gap-3">
            <p>{assessmentsError?.message || profilesError?.message || "An error occurred."}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (assessmentsError) refetchAssessments();
                if (profilesError) refetchProfiles();
              }}
              leftIcon={<RefreshCw size={14} />}
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900/30">
              <ClipboardCheck className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-surface-400" />
              ) : (
                <p className="text-2xl font-bold text-surface-100">{completedCount}</p>
              )}
              <p className="text-xs text-surface-400">Completed Assessments</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-900/30">
              <TrendingUp className="h-6 w-6 text-cyber-400" />
            </div>
            <div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-surface-400" />
              ) : (
                <p className="text-2xl font-bold text-surface-100">{avgScore}%</p>
              )}
              <p className="text-xs text-surface-400">Average Score</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-900/30">
              <Dna className="h-6 w-6 text-warning-400" />
            </div>
            <div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-surface-400" />
              ) : (
                <p className="text-2xl font-bold text-surface-100">{profileCount}</p>
              )}
              <p className="text-xs text-surface-400">Skill DNA Profiles</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-danger-900/30">
              <FileText className="h-6 w-6 text-danger-400" />
            </div>
            <div>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-surface-400" />
              ) : (
                <p className="text-2xl font-bold text-surface-100">{totalCount}</p>
              )}
              <p className="text-xs text-surface-400">Total Assessments</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAssessments />
        </div>
        <div>
          <SkillOverview />
        </div>
      </div>
    </div>
  );
}
