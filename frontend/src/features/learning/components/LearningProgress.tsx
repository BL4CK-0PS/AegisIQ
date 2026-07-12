import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function LearningProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No learning roadmap yet. Complete an assessment to get your personalized learning path.
        </p>
      </CardContent>
    </Card>
  );
}
