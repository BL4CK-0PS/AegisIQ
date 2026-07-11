import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface Capability {
  name: string;
  score: number;
  benchmark?: number;
}

interface SkillDNAGraphProps {
  capabilities: Capability[];
  showBenchmark?: boolean;
}

export function SkillDNAGraph({ capabilities, showBenchmark = false }: SkillDNAGraphProps) {
  const data = capabilities.map((cap) => ({
    name: cap.name,
    score: cap.score,
    benchmark: cap.benchmark || 70,
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
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />
            <Radar
              name="Your Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            {showBenchmark && (
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="#64748b"
                fill="#64748b"
                fillOpacity={0.05}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            {showBenchmark && <Legend />}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
