import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ScoreData {
  name: string;
  score: number;
}

interface ScoreBreakdownProps {
  data: ScoreData[];
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function ScoreBreakdown({ data }: ScoreBreakdownProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="#334155"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              stroke="#334155"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
