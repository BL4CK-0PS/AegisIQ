import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { AlertTriangle, Beaker } from "lucide-react";
import { assessmentService } from "@/services/assessment.service";
import type { ResultsResponse } from "@/services/assessment.service";

interface DomainGap {
  domain: string;
  averageScore: number;
  assessmentCount: number;
  latestAssessmentId: string;
  missingConcepts: string[];
  demonstratedSkills: string[];
}

const REMEDIATION_LABS: Record<string, { title: string; description: string }[]> = {
  "web application security": [
    { title: "OWASP Top 10 Hands-On", description: "Practice exploiting and mitigating the most critical web application security risks." },
    { title: "SQL Injection Lab", description: "Identify and exploit SQL injection vulnerabilities in a safe environment." },
  ],
  "network security": [
    { title: "Firewall Rule Analysis", description: "Analyze and optimize firewall rules to detect lateral movement." },
    { title: "Packet Capture Forensics", description: "Parse PCAP files to identify indicators of compromise." },
  ],
  "cloud security": [
    { title: "AWS IAM Policy Audit", description: "Review and harden IAM policies to enforce least privilege." },
    { title: "Container Security Scan", description: "Scan container images for vulnerabilities and misconfigurations." },
  ],
  "endpoint security": [
    { title: "EDR Alert Triage", description: "Investigate and triage endpoint detection alerts using MITRE ATT&CK." },
    { title: "Malware Sandbox Analysis", description: "Analyze suspicious executables in an isolated sandbox environment." },
  ],
  "identity and access management": [
    { title: "RBAC Policy Review", description: "Audit role-based access controls and identify over-privileged accounts." },
    { title: "MFA Bypass Scenarios", description: "Understand common MFA bypass techniques and defensive measures." },
  ],
  "threat hunting": [
    { title: "Hypothesis-Driven Hunt", description: "Practice building and testing threat hunting hypotheses against real datasets." },
    { title: "Sigma Rule Creation", description: "Write custom detection rules using Sigma syntax for SIEM platforms." },
  ],
};

const DEFAULT_LABS = [
  { title: "Cyber Range Practice", description: "Complete hands-on scenarios in the cyber range to strengthen weak areas." },
  { title: "MITRE ATT&CK Mapping", description: "Study technique implementations and practice detection methods." },
];

function getLabsForDomain(domain: string): { title: string; description: string }[] {
  const key = domain.toLowerCase();
  for (const [mapKey, labs] of Object.entries(REMEDIATION_LABS)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return labs;
    }
  }
  return DEFAULT_LABS;
}

function scoreVariant(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

function scoreBadgeVariant(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export default function SkillGaps() {
  const { data: listData } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(100, 0),
  });

  const assessments = listData?.assessments ?? [];
  const completed = assessments.filter((a) => a.status === "completed");

  // Fetch results for each completed assessment
  const resultQueries = completed.map((a) => ({
    queryKey: ["assessment-results", a.id],
    queryFn: () => assessmentService.getResults(a.id),
    enabled: completed.length > 0,
  }));

  // Use individual queries to avoid waterfall
  const result0 = useQuery(resultQueries[0] ?? { queryKey: ["skip"], queryFn: () => null, enabled: false });
  const result1 = useQuery(resultQueries[1] ?? { queryKey: ["skip"], queryFn: () => null, enabled: false });
  const result2 = useQuery(resultQueries[2] ?? { queryKey: ["skip"], queryFn: () => null, enabled: false });
  const result3 = useQuery(resultQueries[3] ?? { queryKey: ["skip"], queryFn: () => null, enabled: false });
  const result4 = useQuery(resultQueries[4] ?? { queryKey: ["skip"], queryFn: () => null, enabled: false });

  const resultResponses = [result0, result1, result2, result3, result4]
    .filter((q) => q.data)
    .map((q) => q.data as ResultsResponse);

  if (completed.length === 0) {
    return (
      <Card variant="elevated" className="p-6">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">Skill Gaps & Weaknesses</h2>
        <p className="text-sm text-surface-400">
          Complete an assessment to identify skill gaps and get remediation recommendations.
        </p>
      </Card>
    );
  }

  // Aggregate scores by domain across all assessments
  const domainMap = new Map<string, {
    scores: number[];
    assessmentCount: number;
    latestAssessmentId: string;
    missingConcepts: Set<string>;
    demonstratedSkills: Set<string>;
  }>();

  for (const a of completed) {
    const domain = a.domain ?? "Unknown";
    const existing = domainMap.get(domain) ?? {
      scores: [],
      assessmentCount: 0,
      latestAssessmentId: a.id,
      missingConcepts: new Set<string>(),
      demonstratedSkills: new Set<string>(),
    };
    existing.assessmentCount += 1;

    // Find matching results
    const results = resultResponses.find((r) => r.assessment_id === a.id);
    if (results && results.results.length > 0) {
      for (const r of results.results) {
        existing.scores.push(r.overall_score);
        for (const mc of r.missing_concepts) {
          existing.missingConcepts.add(mc);
        }
        for (const ds of r.demonstrated_skills) {
          existing.demonstratedSkills.add(ds);
        }
      }
      existing.latestAssessmentId = a.id;
    }

    domainMap.set(domain, existing);
  }

  // Build domain gaps
  const domainGaps: DomainGap[] = [];
  for (const [domain, data] of domainMap) {
    const avgScore = data.scores.length > 0
      ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      : 0;
    domainGaps.push({
      domain,
      averageScore: Math.round(avgScore * 10) / 10,
      assessmentCount: data.assessmentCount,
      latestAssessmentId: data.latestAssessmentId,
      missingConcepts: [...data.missingConcepts],
      demonstratedSkills: [...data.demonstratedSkills],
    });
  }

  // Sort: gaps first (below 70%), then by score ascending
  const gaps = domainGaps
    .filter((d) => d.averageScore < 70)
    .sort((a, b) => a.averageScore - b.averageScore);

  const strengths = domainGaps
    .filter((d) => d.averageScore >= 70)
    .sort((a, b) => b.averageScore - a.averageScore);

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning-400" />
          Skill Gaps & Weaknesses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gaps.length === 0 ? (
          <div className="rounded-lg border border-cyber-700/30 bg-cyber-900/20 p-4">
            <p className="text-sm text-cyber-300 font-medium">No critical skill gaps detected</p>
            <p className="text-xs text-surface-400 mt-1">
              All assessed domains are at or above the 70% proficiency threshold.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-surface-500">
              {gaps.length} domain{gaps.length !== 1 ? "s" : ""} below the 70% proficiency threshold
            </p>
            {gaps.map((gap) => (
              <div key={gap.domain} className="rounded-lg border border-danger-700/30 bg-danger-900/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-surface-200">{gap.domain}</h3>
                    <p className="text-xs text-surface-500">
                      {gap.assessmentCount} assessment{gap.assessmentCount !== 1 ? "s" : ""} completed
                    </p>
                  </div>
                  <Badge variant={scoreBadgeVariant(gap.averageScore)} size="md">
                    {gap.averageScore}%
                  </Badge>
                </div>

                <Progress value={gap.averageScore} variant={scoreVariant(gap.averageScore)} size="sm" />

                {gap.missingConcepts.length > 0 && (
                  <div>
                    <p className="text-xs text-surface-500 mb-1.5">Missing Concepts</p>
                    <div className="flex flex-wrap gap-1">
                      {gap.missingConcepts.slice(0, 6).map((mc) => (
                        <Badge key={mc} variant="danger" size="sm">{mc}</Badge>
                      ))}
                      {gap.missingConcepts.length > 6 && (
                        <Badge variant="outline" size="sm">+{gap.missingConcepts.length - 6} more</Badge>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-surface-500 mb-1.5">Recommended Remediation</p>
                  <div className="space-y-2">
                    {getLabsForDomain(gap.domain).map((lab) => (
                      <div key={lab.title} className="flex items-start gap-2 rounded bg-surface-800/50 p-2">
                        <Beaker size={12} className="mt-0.5 shrink-0 text-warning-400" />
                        <div>
                          <p className="text-xs font-medium text-surface-200">{lab.title}</p>
                          <p className="text-[11px] text-surface-500">{lab.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {strengths.length > 0 && (
          <>
            <div className="border-t border-surface-700/50 pt-4">
              <p className="text-xs text-surface-500 mb-3">Strong Domains (70%+)</p>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s) => (
                  <div key={s.domain} className="flex items-center gap-2 rounded-lg border border-cyber-700/30 bg-cyber-900/10 px-3 py-2">
                    <span className="text-xs font-medium text-cyber-300">{s.domain}</span>
                    <Badge variant="success" size="sm">{s.averageScore}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
