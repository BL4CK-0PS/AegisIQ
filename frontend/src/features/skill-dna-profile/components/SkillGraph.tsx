import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface Capability {
  id: string;
  name: string;
  weight: number;
}

interface SkillGraphProps {
  capabilities: Capability[];
}

export function SkillGraph({ capabilities }: SkillGraphProps) {
  const data = capabilities.map((cap) => ({
    name: cap.name,
    value: Math.round(cap.weight * 100),
  }));

  return (
    <Card variant="elevated" className="h-full">
      <CardHeader>
        <CardTitle>Skill DNA Graph</CardTitle>
      </CardHeader>
      <div className="flex h-[350px] items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />
            <Radar
              name="Capability"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
