import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { SkillDNAParseResult } from "@/services/role-definition.service";

interface ParseResultProps {
  result: SkillDNAParseResult;
}

export function ParseResult({ result }: ParseResultProps) {
  const capabilities = result.capabilities ?? [];
  const knowledgeAreas = result.knowledge_areas ?? [];
  const objectives = result.assessment_objectives ?? [];
  const mitreIds = result.mitre_technique_ids ?? [];
  const responsibilities = result.responsibilities ?? [];

  if (capabilities.length === 0 && knowledgeAreas.length === 0 && !result.title) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
        </CardHeader>
        <p className="px-6 pb-4 text-sm text-surface-500">
          File uploaded successfully. Parsed details will appear here once processing is complete.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Extracted Information</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-surface-700/50 p-3">
            <p className="text-xs text-surface-500">Title</p>
            <p className="mt-1 text-sm font-medium text-surface-200">{result.title}</p>
          </div>
          <div className="rounded-lg border border-surface-700/50 p-3">
            <p className="text-xs text-surface-500">Difficulty</p>
            <p className="mt-1 text-sm font-medium text-surface-200 capitalize">{result.difficulty}</p>
          </div>
          <div className="rounded-lg border border-surface-700/50 p-3">
            <p className="text-xs text-surface-500">Duration</p>
            <p className="mt-1 text-sm font-medium text-surface-200">{result.estimated_duration_minutes} min</p>
          </div>
        </div>

        {capabilities.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-surface-500">Capabilities ({capabilities.length})</p>
            <div className="space-y-2">
              {capabilities.map((cap) => (
                <div key={cap.id} className="rounded-lg border border-surface-700/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-surface-200">{cap.name}</p>
                      <p className="text-xs text-surface-500">{cap.category}</p>
                    </div>
                    <span className="rounded-full bg-primary-900/20 px-2 py-0.5 text-xs text-primary-400">
                      {cap.difficulty}
                    </span>
                  </div>
                  {(cap.sub_skills ?? []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {cap.sub_skills.map((skill) => (
                        <span key={skill} className="rounded bg-surface-800 px-2 py-0.5 text-xs text-surface-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {knowledgeAreas.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-surface-500">Knowledge Areas ({knowledgeAreas.length})</p>
            <div className="space-y-1">
              {knowledgeAreas.map((ka) => (
                <div key={ka.id} className="flex items-center justify-between rounded-lg border border-surface-700/50 px-3 py-2">
                  <span className="text-sm text-surface-300">{ka.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    ka.importance === "critical"
                      ? "bg-danger-900/30 text-danger-400"
                      : ka.importance === "high"
                        ? "bg-warning-900/30 text-warning-400"
                        : "bg-surface-700/30 text-surface-400"
                  }`}>
                    {ka.importance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mitreIds.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-surface-500">MITRE ATT&CK Techniques</p>
            <div className="flex flex-wrap gap-2">
              {mitreIds.map((id) => (
                <span key={id} className="rounded bg-cyber-900/20 px-2 py-1 font-mono text-xs text-cyber-400">
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {objectives.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-surface-500">Assessment Objectives</p>
            <ul className="space-y-1">
              {objectives.map((obj, i) => (
                <li key={i} className="text-sm text-surface-300">• {obj}</li>
              ))}
            </ul>
          </div>
        )}

        {responsibilities.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-surface-500">Key Responsibilities</p>
            <ul className="space-y-1">
              {responsibilities.slice(0, 10).map((r, i) => (
                <li key={i} className="text-sm text-surface-400">• {r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
