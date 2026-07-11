import { useNavigate } from "react-router-dom";
import { Upload, ClipboardCheck, BarChart3, GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const actions = [
  {
    label: "Upload Job Description",
    icon: Upload,
    to: "/job-description",
    color: "text-primary-400",
    bg: "bg-primary-900/30",
  },
  {
    label: "Start Assessment",
    icon: ClipboardCheck,
    to: "/assessment",
    color: "text-cyber-400",
    bg: "bg-cyber-900/30",
  },
  {
    label: "View Reports",
    icon: BarChart3,
    to: "/reports",
    color: "text-warning-400",
    bg: "bg-warning-900/30",
  },
  {
    label: "Learning Path",
    icon: GraduationCap,
    to: "/learning",
    color: "text-danger-400",
    bg: "bg-danger-900/30",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className="flex flex-col items-center gap-2 rounded-lg border border-surface-700/50 p-4 text-center transition-colors hover:bg-surface-800/50"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg}`}>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <span className="text-xs font-medium text-surface-300">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
