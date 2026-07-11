import { useNavigate } from "react-router-dom";
import { Dna, ArrowRight, Shield, Target, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CapabilityList } from "../components/CapabilityList";
import { SkillGraph } from "../components/SkillGraph";

const mockProfile = {
  id: "1",
  title: "Senior SOC Analyst Skill DNA",
  version: 1,
  capabilities: [
    { id: "1", name: "SIEM Management", category: "Detection", weight: 0.9, difficulty: "advanced" as const, description: "Configure and manage SIEM solutions", sub_skills: ["Splunk", "ELK", "QRadar"] },
    { id: "2", name: "Threat Detection", category: "Detection", weight: 0.85, difficulty: "advanced" as const, description: "Identify and classify threats", sub_skills: ["IOC Analysis", "Behavioral Analysis"] },
    { id: "3", name: "Incident Response", category: "Response", weight: 0.8, difficulty: "intermediate" as const, description: "Respond to security incidents", sub_skills: ["Triage", "Containment", "Eradication"] },
    { id: "4", name: "Log Analysis", category: "Analysis", weight: 0.75, difficulty: "intermediate" as const, description: "Analyze system and network logs", sub_skills: ["Windows Events", "Linux Syslog", "Network Logs"] },
    { id: "5", name: "Network Security", category: "Defense", weight: 0.7, difficulty: "intermediate" as const, description: "Monitor and protect network infrastructure", sub_skills: ["Firewall", "IDS/IPS", "Traffic Analysis"] },
    { id: "6", name: "Communication", category: "Soft Skills", weight: 0.65, difficulty: "beginner" as const, description: "Effective security communication", sub_skills: ["Reporting", "Escalation", "Documentation"] },
  ],
  knowledge_areas: [
    { id: "1", name: "MITRE ATT&CK", domain: "Framework", importance: "critical" as const, description: "Adversarial tactics and techniques" },
    { id: "2", name: "NIST CSF", domain: "Framework", importance: "high" as const, description: "Cybersecurity Framework" },
    { id: "3", name: "Windows Security", domain: "Platform", importance: "critical" as const, description: "Windows OS security mechanisms" },
  ],
  assessment_objectives: [
    "Evaluate threat detection capabilities",
    "Assess incident response procedures",
    "Test SIEM configuration knowledge",
  ],
};

export default function SkillDNAProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Skill DNA Profile</h1>
          <p className="text-sm text-surface-400">
            Your verified cybersecurity capability fingerprint
          </p>
        </div>
        <Button onClick={() => navigate("/assessment")} leftIcon={<ArrowRight size={16} />}>
          Start Assessment
        </Button>
      </div>

      <Card variant="elevated">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-900/30">
            <Dna className="h-7 w-7 text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-100">{mockProfile.title}</h2>
            <p className="text-sm text-surface-400">Version {mockProfile.version}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={18} />
                Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-surface-100">{mockProfile.capabilities.length}</p>
              <p className="text-xs text-surface-400">Assessed areas</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={18} />
                Knowledge Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-surface-100">{mockProfile.knowledge_areas.length}</p>
              <p className="text-xs text-surface-400">Domain expertise</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={18} />
                Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-surface-100">{mockProfile.assessment_objectives.length}</p>
              <p className="text-xs text-surface-400">Assessment goals</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <SkillGraph capabilities={mockProfile.capabilities} />
        </div>
      </div>

      <CapabilityList capabilities={mockProfile.capabilities} />
    </div>
  );
}
