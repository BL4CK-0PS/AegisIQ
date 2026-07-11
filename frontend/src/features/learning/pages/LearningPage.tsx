import LearningDashboard from "../components/LearningDashboard";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Path</h1>
        <p className="text-muted-foreground">
          Personalized improvement roadmap
        </p>
      </div>
      <LearningDashboard />
    </div>
  );
}
