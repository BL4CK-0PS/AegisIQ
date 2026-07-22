import { useQuery } from "@tanstack/react-query";
import { Beaker, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { learningService } from "@/services/learning.service";

export default function RecommendedLabs() {
  const { data: compasses, isLoading } = useQuery({
    queryKey: ["career-compasses"],
    queryFn: () => learningService.listCompasses(),
  });

  const labs = compasses?.[0]?.labs || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Labs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (labs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Labs</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Beaker className="h-8 w-8" />}
            title="No labs recommended yet"
            description="Complete an assessment to get lab recommendations"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Labs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {labs.map((lab) => (
            <div key={lab.id} className="rounded-lg bg-surface-800/50 p-3">
              <p className="text-sm font-medium text-surface-200">{lab.title}</p>
              <p className="mt-1 text-xs text-surface-400">{lab.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant={lab.difficulty === "advanced" ? "danger" : lab.difficulty === "intermediate" ? "warning" : "success"}
                  size="sm"
                >
                  {lab.difficulty}
                </Badge>
                <span className="text-xs text-surface-500">~{lab.estimated_hours}h</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {lab.skills_practiced.map((skill, j) => (
                  <Badge key={j} variant="primary" size="sm">{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
