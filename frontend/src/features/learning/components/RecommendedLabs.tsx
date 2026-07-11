import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Zap } from "lucide-react";

const labs = [
  {
    title: "Ransomware Simulation Lab",
    description:
      "Analyze and respond to a simulated ransomware attack in a controlled network environment.",
    difficulty: "Advanced",
    estimated_hours: 6,
    skills_practiced: ["Incident Response", "Malware Analysis", "Forensics"],
  },
  {
    title: "Cloud Infrastructure Audit",
    description:
      "Identify misconfigurations and security gaps in a multi-cloud deployment scenario.",
    difficulty: "Intermediate",
    estimated_hours: 4,
    skills_practiced: ["Cloud Security", "IAM", "Compliance"],
  },
  {
    title: "Threat Hunting Workshop",
    description:
      "Use SIEM queries and endpoint telemetry to hunt for advanced persistent threats.",
    difficulty: "Advanced",
    estimated_hours: 8,
    skills_practiced: ["Threat Hunting", "SIEM", "Log Analysis"],
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export default function RecommendedLabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Labs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {labs.map((lab) => (
          <div key={lab.title} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold leading-tight">{lab.title}</h4>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[lab.difficulty]}`}
              >
                {lab.difficulty}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lab.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lab.estimated_hours}h
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {lab.skills_practiced.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                >
                  <Zap className="h-2 w-2" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
