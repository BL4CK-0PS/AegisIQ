import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function RecommendedLabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Labs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No labs recommended yet. Complete an assessment to get lab recommendations.
        </p>
      </CardContent>
    </Card>
  );
}
