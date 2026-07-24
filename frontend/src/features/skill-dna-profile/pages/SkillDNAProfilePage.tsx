import { useState } from "react";
import { Dna, Search, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { apiClient } from "@/lib/api-client";

interface Capability {
  id: string;
  name: string;
  category: string;
  weight: number;
  difficulty: string;
  description: string;
  sub_skills: string[];
}

interface KnowledgeArea {
  id: string;
  name: string;
  domain: string;
  importance: string;
  description: string;
}

interface SkillDNAResult {
  status: string;
  profile_id: string;
  title: string;
  difficulty: string;
  capabilities: Capability[];
  knowledge_areas: KnowledgeArea[];
  responsibilities: string[];
  assessment_objectives: string[];
  estimated_duration_minutes: number;
  recommended_rubric: string;
  mitre_technique_ids: string[];
}

export default function SkillDNAProfilePage() {
  const [jdText, setJdText] = useState(() => localStorage.getItem("aegisiq_jd_draft") || "");
  const [result, setResult] = useState<SkillDNAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (jdText.trim().length < 20) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<SkillDNAResult>("/jd/parse", {
        jd_text: jdText,
        title: "Skill DNA Profile",
      });
      const raw = response.data;
      setResult({
        status: raw.status ?? "success",
        profile_id: raw.profile_id ?? "",
        title: raw.title ?? "",
        difficulty: raw.difficulty ?? "intermediate",
        capabilities: raw.capabilities ?? [],
        knowledge_areas: raw.knowledge_areas ?? [],
        responsibilities: raw.responsibilities ?? [],
        assessment_objectives: raw.assessment_objectives ?? [],
        estimated_duration_minutes: raw.estimated_duration_minutes ?? 0,
        recommended_rubric: raw.recommended_rubric ?? "",
        mitre_technique_ids: raw.mitre_technique_ids ?? [],
      });
      localStorage.removeItem("aegisiq_jd_draft");
    } catch {
      setError("Failed to parse job description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-100">Skill DNA Profile</h1>
            <p className="text-sm text-surface-400">
              Extracted capability fingerprint for "{result.title}"
            </p>
          </div>
          <Button variant="secondary" onClick={() => { setResult(null); localStorage.removeItem("aegisiq_jd_draft"); setJdText(""); }}>
            Parse Another
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card variant="elevated">
            <CardContent className="py-4">
              <p className="text-xs text-surface-500">Difficulty</p>
              <p className="mt-1 text-sm font-medium text-surface-200 capitalize">
                {result.difficulty}
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="py-4">
              <p className="text-xs text-surface-500">Estimated Duration</p>
              <p className="mt-1 text-sm font-medium text-surface-200">
                {result.estimated_duration_minutes} minutes
              </p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="py-4">
              <p className="text-xs text-surface-500">MITRE Techniques</p>
              <p className="mt-1 text-sm font-medium text-surface-200">
                {(result.mitre_technique_ids ?? []).length} mapped
              </p>
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Capabilities ({(result.capabilities ?? []).length})</CardTitle>
            <CardDescription>Core skills required for this role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(result.capabilities ?? []).map((cap) => (
              <div key={cap.id} className="rounded-lg border border-surface-700/50 p-4">
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
                    {(cap.sub_skills ?? []).map((skill) => (
                      <span key={skill} className="rounded bg-surface-800 px-2 py-0.5 text-xs text-surface-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Knowledge Areas ({(result.knowledge_areas ?? []).length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(result.knowledge_areas ?? []).map((ka) => (
                <div key={ka.id} className="flex items-center justify-between rounded-lg border border-surface-700/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-surface-200">{ka.name}</p>
                    <p className="text-xs text-surface-500">{ka.domain}</p>
                  </div>
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
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>MITRE ATT&CK Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              {(result.mitre_technique_ids ?? []).length === 0 ? (
                <p className="text-sm text-surface-500 py-2 text-center">
                  No MITRE techniques identified for this profile
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(result.mitre_technique_ids ?? []).map((technique) => (
                    <span
                      key={technique}
                      className="rounded bg-cyber-900/20 px-2 py-1 font-mono text-xs text-cyber-400"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Assessment Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(result.assessment_objectives ?? []).map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-primary-400" />
                  {obj}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Skill DNA Profile</h1>
        <p className="text-sm text-surface-400">
          Extract your unique cybersecurity capability fingerprint from a job description
        </p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna size={18} /> Generate Profile
          </CardTitle>
          <CardDescription>
            Paste a job description to extract capabilities, knowledge areas, and MITRE mappings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={jdText}
            onChange={(e) => {
              setJdText(e.target.value);
              localStorage.setItem("aegisiq_jd_draft", e.target.value);
            }}
            placeholder="Paste the job description here (minimum 20 characters)..."
            className="h-40 w-full rounded-lg border border-surface-700 bg-surface-800 p-3 text-sm text-surface-200 placeholder-surface-500 focus:border-primary-500 focus:outline-none"
          />
          {error && <p className="text-sm text-danger-400">{error}</p>}
          <Button
            onClick={handleParse}
            disabled={jdText.trim().length < 20 || loading}
            leftIcon={<Search size={16} />}
          >
            {loading ? "Parsing..." : "Generate Skill DNA"}
          </Button>
        </CardContent>
      </Card>

      {!result && !loading && (
        <EmptyState
          icon={<Dna className="h-8 w-8" />}
          title="No profile generated yet"
          description="Paste a job description above to extract your Skill DNA"
        />
      )}
    </div>
  );
}
