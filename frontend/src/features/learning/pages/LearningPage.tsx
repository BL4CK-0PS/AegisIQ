import LearningDashboard from "../components/LearningDashboard";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Learning Path</h1>
        <p className="text-sm text-surface-400">
          Personalized improvement roadmap
        </p>
      </div>
      <LearningDashboard />
    </div>
  );
}
