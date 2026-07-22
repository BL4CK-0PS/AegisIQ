import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Dna, Plus, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkillDNAGraph } from "@/components/charts/SkillDNAGraph";
import { skillDnaService } from "@/services/skill-dna.service";

export default function SkillDNAProfilePage() {
  const navigate = useNavigate();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["skill-dna-profiles"],
    queryFn: () => skillDnaService.list(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          <p className="text-sm text-surface-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-100">
            Skill DNA Profiles
          </h1>
          <p className="text-sm text-surface-400">
            AI-generated capability profiles from job descriptions
          </p>
        </div>
        <EmptyState
          icon={<Dna className="h-8 w-8" />}
          title="No Skill DNA Profiles yet"
          description="Upload a job description to generate your first Skill DNA Profile"
          action={{
            label: "Upload Job Description",
            onClick: () => navigate("/job-description"),
          }}
        />
      </div>
    );
  }

  const latest = profiles[0]!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-100">
            Skill DNA Profiles
          </h1>
          <p className="text-sm text-surface-400">
            {profiles.length} profile{profiles.length !== 1 ? "s" : ""} generated
          </p>
        </div>
        <Button onClick={() => navigate("/job-description")} leftIcon={<Plus size={16} />}>
          New Profile
        </Button>
      </div>

      <Card variant="elevated" className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-surface-100">{latest.title}</h2>
            <p className="text-xs text-surface-500">
              Version {latest.version} — Created {new Date(latest.created_at).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="primary" size="sm">Latest</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkillDNAGraph
            capabilities={latest.capabilities.map((c) => ({
              name: c.name,
              score: c.weight,
            }))}
          />

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-surface-300">Capabilities ({latest.capabilities.length})</h3>
              <div className="space-y-2">
                {latest.capabilities.map((cap) => (
                  <div key={cap.id} className="flex items-center justify-between rounded-lg bg-surface-800/50 px-3 py-2">
                    <div>
                      <p className="text-sm text-surface-200">{cap.name}</p>
                      <p className="text-xs text-surface-500">{cap.category}</p>
                    </div>
                    <Badge
                      variant={cap.difficulty === "expert" ? "danger" : cap.difficulty === "advanced" ? "warning" : cap.difficulty === "intermediate" ? "primary" : "success"}
                      size="sm"
                    >
                      {cap.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {latest.knowledge_areas.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-surface-300">Knowledge Areas</h3>
            <div className="flex flex-wrap gap-2">
              {latest.knowledge_areas.map((ka) => (
                <Badge
                  key={ka.id}
                  variant={ka.importance === "critical" ? "danger" : ka.importance === "high" ? "warning" : "primary"}
                  size="sm"
                >
                  {ka.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {latest.responsibilities.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-surface-300">Key Responsibilities</h3>
            <ul className="space-y-1">
              {latest.responsibilities.map((r) => (
                <li key={r.id} className="text-sm text-surface-400">
                  <span className="text-surface-300">{r.title}</span>
                  {r.description && (
                    <span className="ml-2 text-surface-500">— {r.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {profiles.length > 1 && (
        <Card variant="elevated" className="p-6">
          <CardHeader>
            <CardTitle>Previous Versions</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {profiles.slice(1).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between rounded-lg bg-surface-800/50 px-4 py-3">
                <div>
                  <p className="text-sm text-surface-200">{profile.title}</p>
                  <p className="text-xs text-surface-500">
                    Version {profile.version} — {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" size="sm">v{profile.version}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
