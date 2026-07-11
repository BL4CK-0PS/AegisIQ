import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ProgressData {
  date: string;
  score: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
      </CardHeader>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="#334155"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              stroke="#334155"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6, fill: "#60a5fa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
