import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Zap } from "lucide-react";

const phases = [
  {
    phase: 1,
    title: "Foundations & Core Concepts",
    description:
      "Build a strong base in networking, operating systems, and fundamental security principles.",
    duration_weeks: 4,
    skills_focus: ["Networking", "Linux", "TCP/IP", "Security Fundamentals"],
  },
  {
    phase: 2,
    title: "Defensive Operations",
    description:
      "Learn to monitor, detect, and respond to threats using industry-standard tools and frameworks.",
    duration_weeks: 6,
    skills_focus: ["SIEM", "Incident Response", "Log Analysis", "NIST"],
  },
  {
    phase: 3,
    title: "Advanced Threat Analysis",
    description:
      "Deep dive into malware analysis, threat hunting, and offensive techniques to stay ahead of adversaries.",
    duration_weeks: 8,
    skills_focus: ["Malware Analysis", "Threat Hunting", "Forensics", "YARA"],
  },
];

export default function LearningProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          {phases.map((phase) => (
            <div key={phase.phase} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-bold">
                {phase.phase}
              </div>

              <div className="flex-1 space-y-2 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-tight">
                    {phase.title}
                  </h4>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    {phase.duration_weeks}w
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {phase.skills_focus.map((skill) => (
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
