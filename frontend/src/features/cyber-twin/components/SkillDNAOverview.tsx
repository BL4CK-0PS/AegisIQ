import { useQuery } from "@tanstack/react-query";
import { Dna, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkillDNAGraph } from "@/components/charts/SkillDNAGraph";
import { skillDnaService } from "@/services/skill-dna.service";

export default function SkillDNAOverview() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["skill-dna-profiles"],
    queryFn: () => skillDnaService.list(),
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

  const latest = profiles?.[0];

  if (!latest) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={<Dna className="h-8 w-8" />}
          title="No Skill DNA data yet"
          description="Complete an assessment to see your skill overview"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Skill DNA Overview</CardTitle>
      </CardHeader>
      <div className="mt-4">
        <SkillDNAGraph
          capabilities={latest.capabilities.map((c) => ({
            name: c.name,
            score: c.weight,
          }))}
          showBenchmark
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
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
    </Card>
  );
}
