import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function AssessmentPage() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<ClipboardCheck className="h-8 w-8" />}
      title="No active assessment"
      description="Start an assessment from the dashboard"
      action={{
        label: "Go to Assessments",
        onClick: () => navigate("/assessment"),
      }}
    />
  );
}
