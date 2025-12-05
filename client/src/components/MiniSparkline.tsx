import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniSparklineProps {
  data: number[];
  status: "online" | "down" | "degraded";
}

export default function MiniSparkline({ data, status }: MiniSparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  const colorMap = {
    online: "#22c55e",
    degraded: "#eab308",
    down: "#ef4444",
  };

  return (
    <ResponsiveContainer width="100%" height={30}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={colorMap[status]}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
