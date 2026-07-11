import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Dna,
  TrendingUp,
  FileText,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { RecentAssessments } from "../components/RecentAssessments";
import { SkillOverview } from "../components/SkillOverview";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => ({
      totalAssessments: 12,
      completedAssessments: 8,
      averageScore: 76,
      skillDnaProfiles: 3,
    }),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-surface-400">
            Track your cybersecurity capability progress
          </p>
        </div>
        <Button onClick={() => navigate("/assessment")} leftIcon={<Plus size={16} />}>
          New Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-900/30">
              <ClipboardCheck className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">
                {stats?.completedAssessments || 0}
              </p>
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
              <p className="text-2xl font-bold text-surface-100">
                {stats?.averageScore || 0}%
              </p>
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
              <p className="text-2xl font-bold text-surface-100">
                {stats?.skillDnaProfiles || 0}
              </p>
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
              <p className="text-2xl font-bold text-surface-100">
                {stats?.totalAssessments || 0}
              </p>
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
