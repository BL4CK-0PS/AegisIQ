import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecommendedLabs from "./RecommendedLabs";
import MentorChat from "./MentorChat";

const weakSkills = [
  { name: "Threat Hunting", current_level: 35, target_level: 80, gap: 45 },
  { name: "Malware Analysis", current_level: 42, target_level: 85, gap: 43 },
  { name: "Cloud Security", current_level: 28, target_level: 75, gap: 47 },
];

export default function LearningDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weak Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakSkills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">
                    {skill.current_level}% → {skill.target_level}%
                  </span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    style={{ width: `${skill.current_level}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 border-r-2 border-dashed border-primary/70"
                    style={{ width: `${skill.target_level}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <RecommendedLabs />
        <MentorChat />
      </div>
    </div>
  );
}
