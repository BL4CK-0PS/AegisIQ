import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Compass, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { learningService } from "@/services/learning.service";

export default function CareerCompass() {
  const navigate = useNavigate();

  const { data: compasses, isLoading } = useQuery({
    queryKey: ["career-compasses"],
    queryFn: () => learningService.listCompasses(),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </Card>
    );
  }

  const latest = compasses?.[0];

  if (!latest) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Career Compass</CardTitle>
        </CardHeader>
        <EmptyState
          icon={<Compass className="h-8 w-8" />}
          title="No career recommendations yet"
          description="Complete an assessment to get your career compass"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Career Compass</CardTitle>
      </CardHeader>
      <div className="mt-4 space-y-4">
        {latest.recommendations.slice(0, 3).map((rec, i) => (
          <div key={i} className="rounded-lg bg-surface-800/50 p-3">
            <p className="text-sm font-medium text-surface-200">{rec.topic}</p>
            <p className="mt-1 text-xs text-surface-400">{rec.reason}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="primary" size="sm">{rec.difficulty}</Badge>
              <span className="text-xs text-surface-500">~{rec.estimated_hours}h</span>
            </div>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => navigate("/learning")}
        >
          View Full Roadmap
        </Button>
      </div>
    </Card>
  );
}
