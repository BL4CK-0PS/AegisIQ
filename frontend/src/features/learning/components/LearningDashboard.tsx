import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { learningService } from "@/services/learning.service";
import RecommendedLabs from "./RecommendedLabs";
import MentorChat from "./MentorChat";

export default function LearningDashboard() {
  const { data: compasses, isLoading } = useQuery({
    queryKey: ["career-compasses"],
    queryFn: () => learningService.listCompasses(),
  });

  const latest = compasses?.[0];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weak Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {!latest || latest.weak_skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No skill gaps identified yet. Complete an assessment to get personalized recommendations.
              </p>
            ) : (
              <div className="space-y-3">
                {latest.weak_skills.map((skill, i) => (
                  <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-surface-200">{skill.name}</p>
                      <Badge
                        variant={skill.priority === "critical" ? "danger" : skill.priority === "high" ? "warning" : "primary"}
                        size="sm"
                      >
                        {skill.priority}
                      </Badge>
                    </div>
                    <Progress
                      value={skill.current_level}
                      max={skill.target_level}
                      size="sm"
                      variant={skill.gap > 30 ? "danger" : skill.gap > 15 ? "warning" : "default"}
                    />
                    <p className="mt-1 text-xs text-surface-500">
                      {skill.current_level}/{skill.target_level} — Gap: {skill.gap}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {latest && latest.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latest.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                    <p className="text-sm font-medium text-surface-200">{rec.topic}</p>
                    <p className="mt-1 text-xs text-surface-400">{rec.reason}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="primary" size="sm">{rec.difficulty}</Badge>
                      <span className="text-xs text-surface-500">~{rec.estimated_hours}h</span>
                    </div>
                    {rec.resources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.resources.map((res, j) => (
                          <Badge key={j} variant="secondary" size="sm">
                            {res.type}: {res.title}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {latest && latest.roadmap.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latest.roadmap.map((item, i) => (
                  <div key={i} className="relative rounded-lg bg-surface-800/50 p-3 pl-8">
                    <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-900/30 text-xs font-bold text-primary-400">
                      {item.phase}
                    </div>
                    <p className="text-sm font-medium text-surface-200">{item.title}</p>
                    <p className="mt-1 text-xs text-surface-400">{item.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-surface-500">{item.duration_weeks} weeks</span>
                      <div className="flex flex-wrap gap-1">
                        {item.skills_focus.map((s, j) => (
                          <Badge key={j} variant="primary" size="sm">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <RecommendedLabs />
        <MentorChat />
      </div>
    </div>
  );
}
