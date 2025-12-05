import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartDataPoint {
  time: string;
  [key: string]: number | string;
}

interface HistoricalChartProps {
  data: ChartDataPoint[];
  services: Array<{ name: string; key: string; color: string }>;
}

export default function HistoricalChart({ data, services }: HistoricalChartProps) {
  const [selectedService, setSelectedService] = useState<string>("all");

  const visibleServices =
    selectedService === "all"
      ? services
      : services.filter((s) => s.key === selectedService);

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-white">24-Hour Historical Data</h2>
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-64" data-testid="select-service">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.key} value={service.key}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="time"
            stroke="rgba(255, 255, 255, 0.6)"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.6)"
            style={{ fontSize: "12px" }}
            domain={[0, 100]}
            label={{ value: 'Uptime %', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.6)' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              color: "#ffffff",
            }}
            formatter={(value: any) => `${Number(value).toFixed(1)}%`}
          />
          <Legend />
          {visibleServices.map((service) => (
            <Line
              key={service.key}
              type="monotone"
              dataKey={service.key}
              stroke={service.color}
              strokeWidth={3}
              name={service.name}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
