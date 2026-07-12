import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import RecommendedLabs from "./RecommendedLabs";
import MentorChat from "./MentorChat";

export default function LearningDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weak Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No skill gaps identified yet. Complete an assessment to get personalized recommendations.
            </p>
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
