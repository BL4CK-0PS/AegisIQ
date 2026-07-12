import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";

export function RecentAssessments() {
  const navigate = useNavigate();

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <EmptyState
        icon={<ClipboardCheck className="h-8 w-8" />}
        title="No assessments yet"
        description="Complete your first assessment to see it here"
        action={{
          label: "Start Assessment",
          onClick: () => navigate("/assessment"),
        }}
      />
    </Card>
  );
}
