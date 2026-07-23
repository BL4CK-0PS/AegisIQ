import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { learningService } from "@/services/learning.service";
import type { WeakSkill, Lab } from "@/types";

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
            {latest && latest.weak_skills.length > 0 ? (
              <div className="space-y-2">
                {latest.weak_skills.map((skill: WeakSkill, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-surface-800/50 p-3">
                    <div>
                      <p className="text-sm font-medium text-surface-200">{skill.name}</p>
                      <p className="text-xs text-surface-400">
                        Current: {skill.current_level} / Target: {skill.target_level} — Gap: {skill.gap}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      skill.priority === "critical" ? "bg-danger-900/30 text-danger-400"
                        : skill.priority === "high" ? "bg-warning-900/30 text-warning-400"
                          : "bg-surface-700 text-surface-400"
                    }`}>
                      {skill.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400">
                No skill gaps identified yet. Complete an assessment to get personalized recommendations.
              </p>
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
                      <span className="text-xs text-surface-500">~{rec.estimated_hours}h</span>
                    </div>
                    {rec.resources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.resources.map((res, j) => (
                          <span key={j} className="rounded bg-surface-700/50 px-2 py-0.5 text-xs text-surface-400">
                            {res.type}: {res.title}
                          </span>
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
                          <span key={j} className="rounded bg-primary-900/20 px-2 py-0.5 text-xs text-primary-400">{s}</span>
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
        <Card>
          <CardHeader>
            <CardTitle>Recommended Labs</CardTitle>
          </CardHeader>
          <CardContent>
            {latest && latest.labs.length > 0 ? (
              <div className="space-y-2">
                {latest.labs.map((lab: Lab, i: number) => (
                  <div key={i} className="rounded-lg bg-surface-800/50 p-3">
                    <p className="text-sm font-medium text-surface-200">{lab.title}</p>
                    <p className="mt-1 text-xs text-surface-400">{lab.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-surface-500">~{lab.estimated_hours}h</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        lab.difficulty === "advanced" ? "bg-danger-900/30 text-danger-400"
                          : lab.difficulty === "intermediate" ? "bg-warning-900/30 text-warning-400"
                            : "bg-success-900/30 text-success-400"
                      }`}>
                        {lab.difficulty}
                      </span>
                    </div>
                    {lab.skills_practiced.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lab.skills_practiced.map((s, j) => (
                          <span key={j} className="rounded bg-primary-900/20 px-2 py-0.5 text-xs text-primary-400">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400">
                No labs recommended yet. Complete an assessment to get lab recommendations.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Mentor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-64 flex items-center justify-center py-8">
              <p className="text-sm text-surface-400 text-center">
                Start a conversation with your AI mentor. Complete an assessment first to get personalized guidance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask your mentor..."
                className="flex-1 rounded-lg border border-surface-600 bg-surface-800 px-3 py-1.5 text-sm text-surface-100 placeholder:text-surface-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                type="button"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
