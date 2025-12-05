import { Card } from "@/components/ui/card";
import StatusBadge, { type ServiceStatus } from "./StatusBadge";
import MiniSparkline from "./MiniSparkline";

interface ServiceCardProps {
  name: string;
  url: string;
  description: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  historicalData: number[];
}

export default function ServiceCard({
  name,
  url,
  description,
  status,
  uptime,
  responseTime,
  historicalData,
}: ServiceCardProps) {
  const borderColor = {
    online: "border-l-green-500",
    degraded: "border-l-yellow-500",
    down: "border-l-red-500",
  };

  return (
    <Card
      className={`border-l-4 ${borderColor[status]} p-6 hover-elevate bg-black/40 backdrop-blur-md border-white/10`}
      data-testid={`card-service-${url}`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 text-white" data-testid={`text-service-name-${url}`}>
              {name}
            </h3>
            <p className="text-sm text-white/70 mb-2">{description}</p>
            <p className="text-xs text-white/50 font-mono">{url}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/60 mb-1">Uptime</p>
            <p className="text-3xl font-bold text-white" data-testid={`text-uptime-${url}`}>
              {uptime.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Response Time</p>
            <p className="text-3xl font-bold text-white" data-testid={`text-response-${url}`}>
              {responseTime}
              <span className="text-sm text-white/60 ml-1">ms</span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-2">Last 24 Hours</p>
          <MiniSparkline data={historicalData} status={status} />
        </div>
      </div>
    </Card>
  );
}
