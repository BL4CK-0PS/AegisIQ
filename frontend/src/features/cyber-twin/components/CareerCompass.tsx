import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Target, BookOpen } from "lucide-react";
import { assessmentService } from "@/services/assessment.service";

interface RoleRecommendation {
  role: string;
  tier: number;
  matchPercent: number;
  learningPath: string;
}

const DOMAIN_ROLE_MAP: Record<string, RoleRecommendation[]> = {
  soc: [
    { role: "SOC Analyst L2", tier: 1, matchPercent: 82, learningPath: "Advance SIEM tuning, playbook authoring, and mentoring L1 analysts." },
    { role: "SOC Lead", tier: 1, matchPercent: 78, learningPath: "Develop team leadership skills and mastery of escalation workflows." },
    { role: "Threat Hunter Junior", tier: 2, matchPercent: 65, learningPath: "Learn hypothesis-driven hunting with Sigma and KQL queries." },
  ],
  dfir: [
    { role: "Incident Responder", tier: 1, matchPercent: 80, learningPath: "Master memory forensics, timeline analysis, and IR playbooks." },
    { role: "DFIR Specialist", tier: 2, matchPercent: 68, learningPath: "Deepen volatility analysis and evidence chain-of-custody skills." },
  ],
  threat_hunting: [
    { role: "Threat Hunter", tier: 1, matchPercent: 79, learningPath: "Build advanced detection engineering and adversary emulation skills." },
    { role: "Detection Engineer", tier: 2, matchPercent: 71, learningPath: "Write custom Sigma/YARA rules and tune detection pipelines." },
  ],
  cloud: [
    { role: "Cloud Security Analyst", tier: 1, matchPercent: 77, learningPath: "Study AWS/GCP security controls, IAM policies, and CloudTrail forensics." },
    { role: "DevSecOps Engineer", tier: 2, matchPercent: 62, learningPath: "Integrate SAST/DAST into CI/CD and manage container security." },
  ],
  malware: [
    { role: "Malware Analyst", tier: 1, matchPercent: 81, learningPath: "Practice static/dynamic analysis, unpacking, and C2 extraction." },
    { role: "Reverse Engineer", tier: 2, matchPercent: 66, learningPath: "Master IDA Pro/Ghidra workflows and binary instrumentation." },
  ],
  iam: [
    { role: "Identity & Access Engineer", tier: 1, matchPercent: 75, learningPath: "Implement zero-trust architectures and RBAC/ABAC models." },
    { role: "GRC Analyst", tier: 2, matchPercent: 60, learningPath: "Study compliance frameworks (NIST, ISO 27001) and audit workflows." },
  ],
};

const FALLBACK_ROLES: RoleRecommendation[] = [
  { role: "SOC Analyst L2", tier: 1, matchPercent: 82, learningPath: "Advance SIEM triage and playbook authoring." },
  { role: "Incident Responder", tier: 1, matchPercent: 75, learningPath: "Master IR workflows and forensic evidence handling." },
  { role: "Threat Hunter Junior", tier: 2, matchPercent: 65, learningPath: "Learn hypothesis-driven threat hunting and detection engineering." },
];

function deriveRolesFromDomains(domains: string[]): RoleRecommendation[] {
  if (domains.length === 0) return FALLBACK_ROLES;

  const seen = new Set<string>();
  const roles: RoleRecommendation[] = [];

  for (const domain of domains) {
    const key = domain.toLowerCase().replace(/[\s-]+/g, "_");
    const mapped = DOMAIN_ROLE_MAP[key];
    if (mapped) {
      for (const r of mapped) {
        if (!seen.has(r.role)) {
          seen.add(r.role);
          roles.push(r);
        }
      }
    }
  }

  if (roles.length === 0) return FALLBACK_ROLES;
  return roles.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 5);
}

export default function CareerCompass() {
  const { data } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentService.list(100, 0),
  });

  const assessments = data?.assessments ?? [];
  const completed = assessments.filter((a) => a.status === "completed");

  if (completed.length === 0) {
    return (
      <Card variant="elevated" className="p-6">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">Career Compass</h2>
        <p className="text-sm text-surface-400">
          No career recommendations yet. Complete an assessment to get your career compass.
        </p>
      </Card>
    );
  }

  const domains = [...new Set(completed.map((a) => (a.domain ?? "Unknown").toLowerCase()))];
  const roles = deriveRolesFromDomains(domains);

  return (
    <Card variant="elevated" className="p-6">
      <h2 className="text-lg font-semibold text-surface-100 mb-1">Career Compass</h2>
      <p className="text-xs text-surface-500 mb-4">
        Based on {completed.length} completed assessment{completed.length !== 1 ? "s" : ""} across {domains.length} domain{domains.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {roles.map((r) => (
          <div key={r.role} className="rounded-lg border border-surface-700/50 p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-primary-400" />
                <span className="text-sm font-medium text-surface-200">{r.role}</span>
              </div>
              <span className="text-xs font-semibold text-primary-400">{r.matchPercent}%</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <BookOpen size={11} className="text-surface-500" />
              <p className="text-xs text-surface-400">{r.learningPath}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
