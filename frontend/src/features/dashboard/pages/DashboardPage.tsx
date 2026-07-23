import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardCheck,
  Dna,
  TrendingUp,
  FileText,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RecentAssessments } from "../components/RecentAssessments";
import { SkillOverview } from "../components/SkillOverview";
import { assessmentService } from "@/services/assessment.service";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(100, 0),
  });

  const assessments = data?.assessments ?? [];
  const completedCount = assessments.filter((a) => a.status === "completed").length;
  const activeCount = assessments.filter((a) => a.status === "active").length;
  const totalCount = assessments.length;

  const avgQuestionCount =
    completedCount > 0
      ? Math.round(
          assessments.filter((a) => a.status === "completed")
            .reduce((sum, a) => sum + (a.question_count ?? 0), 0) / completedCount,
        )
      : 0;

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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} variant="elevated">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-surface-700" />
                <div className="space-y-2">
                  <div className="h-7 w-16 animate-pulse rounded bg-surface-700" />
                  <div className="h-3 w-24 animate-pulse rounded bg-surface-700" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900/30">
                <ClipboardCheck className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-100">{completedCount}</p>
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
                <p className="text-2xl font-bold text-surface-100">{avgQuestionCount}</p>
                <p className="text-xs text-surface-400">Avg. Questions per Assessment</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-900/30">
                <Dna className="h-6 w-6 text-warning-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-100">{activeCount}</p>
                <p className="text-xs text-surface-400">Active Assessments</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-danger-900/30">
                <FileText className="h-6 w-6 text-danger-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-100">{totalCount}</p>
                <p className="text-xs text-surface-400">Total Assessments</p>
              </div>
            </div>
          </Card>
        </div>
      )}

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
