import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ServiceStatus = "online" | "down" | "degraded";

interface StatusBadgeProps {
  status: ServiceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    online: {
      icon: CheckCircle2,
      label: "Online",
      className: "bg-green-500 text-white hover:bg-green-500",
    },
    down: {
      icon: XCircle,
      label: "Down",
      className: "bg-red-500 text-white hover:bg-red-500",
    },
    degraded: {
      icon: AlertTriangle,
      label: "Degraded",
      className: "bg-yellow-500 text-white hover:bg-yellow-500",
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <Badge className={className} data-testid={`badge-status-${status}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}
