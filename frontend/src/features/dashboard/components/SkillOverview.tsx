import { useQuery } from "@tanstack/react-query";
import { Dna, Loader2, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { SkillDNAGraph } from "@/components/charts/SkillDNAGraph";
import { skillDnaService } from "@/services/skill-dna.service";

export function SkillOverview() {
  const { data: profiles, isLoading, error, refetch } = useQuery({
    queryKey: ["skill-dna-profiles"],
    queryFn: () => skillDnaService.list(),
  });

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Skill Overview</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Skill Overview</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <Alert variant="error" title="Failed to load skills">
            <p>{error.message || "Could not fetch skill data. Please try again."}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => refetch()}
              leftIcon={<RefreshCw size={14} />}
            >
              Retry
            </Button>
          </Alert>
        </div>
      </Card>
    );
  }

  const latest = profiles?.[0];

  if (!latest) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Skill Overview</CardTitle>
        </CardHeader>
        <EmptyState
          icon={<Dna className="h-8 w-8" />}
          title="No skill data yet"
          description="Complete an assessment to see your skill overview"
        />
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Skill Overview</CardTitle>
      </CardHeader>
      <div className="px-6 pb-6">
        <SkillDNAGraph
          capabilities={latest.capabilities.map((c) => ({
            name: c.name,
            score: c.weight,
          }))}
        />
        <div className="mt-3 flex flex-wrap gap-1">
          {latest.knowledge_areas.slice(0, 6).map((ka) => (
            <Badge key={ka.id} variant="primary" size="sm">
              {ka.name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
