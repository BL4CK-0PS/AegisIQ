import { useNavigate } from "react-router-dom";
import { Dna } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function SkillDNAProfilePage() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<Dna className="h-8 w-8" />}
      title="No Skill DNA Profile yet"
      description="Upload a job description to generate your Skill DNA Profile"
      action={{
        label: "Upload Job Description",
        onClick: () => navigate("/job-description"),
      }}
    />
  );
}
