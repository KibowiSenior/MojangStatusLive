import ServiceCard from "../ServiceCard";

export default function ServiceCardExample() {
  const mockHistoricalData = [95, 97, 99, 98, 100, 99, 98, 97, 99, 100];

  return (
    <div className="max-w-2xl">
      <ServiceCard
        name="minecraft.net"
        url="minecraft.net"
        description="Main Minecraft website"
        status="online"
        uptime={99.8}
        responseTime={142}
        historicalData={mockHistoricalData}
      />
    </div>
  );
}
