import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-4">
      <StatusBadge status="online" />
      <StatusBadge status="degraded" />
      <StatusBadge status="down" />
    </div>
  );
}
